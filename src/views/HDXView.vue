<template>
    <h2 @click="debugenable">HDX 配置</h2><el-divider></el-divider>
    <el-alert title="提示" type="info" description="本页面提供 HDX 乌蒙风格控制器的配置功能。请确认您的控制器符合这个版本。完成配置后，您可以直接关闭这个页面。" show-icon>
    </el-alert><br />
    <el-row>
        <el-col :span="4"><el-button @click="factoryMode">进入刷机模式</el-button></el-col>
        <el-col :span="4"><el-button @click="choosePort" :disabled="connected">连接控制器</el-button></el-col>
        <el-col :span="16">
            <el-alert :title="lastmessage" :type="headMessageType" :closable="false">
            </el-alert>
        </el-col>
    </el-row><br v-if="connecting" />
    <el-progress v-if="connecting" :percentage="connectPercentage"></el-progress>
</template>

<script>
export default {
    data() {
        return {
            headMessageType: "warning",
            lastmessage: "请选择设备",
            portNum: null,
            connected: false,
            connectPercentage: 0,
            connecting: false,
        }
    },
    methods: {
        async factoryMode() {
            let self = this
            if ("serial" in navigator) {
                //support
                try {
                    self.portNum = await navigator.serial.requestPort()
                }
                catch (err) {
                    self.lastmessage = "端口选择错误：" + err
                    return
                }
                try {
                    await self.portNum.open({ baudRate: 1200 })
                    await self.portNum.setSignals({ dataTerminalReady: false })
                }
                catch (err) {
                    self.lastmessage = "打开端口错误：" + err
                    return
                }
                self.lastmessage = "成功，请检查控制器盘符并放入固件"
                self.headMessageType = "success"
            }
        },
        asciiToUint8(str) {
            let hex = '';
            for (let i = 0; i < str.length; i++) {
                const charCode = str.charCodeAt(i);
                const hexValue = charCode.toString(16).padStart(2, '0');
                hex += hexValue + ' ';
            }
            hex = hex.trim();
            const arr = Uint8Array.from(hex.split(' ').map(byte => parseInt(byte, 16)));
            return arr;
        },
        test() {
            let self = this
            console.log(self.asciiToUint8('{LAr2}'));
        },
        async choosePort() {
            let self = this
            if ("serial" in navigator) {
                //support
                try {
                    self.portNum = await navigator.serial.requestPort()
                }
                catch (err) {
                    self.lastmessage = "端口选择错误：" + err
                    return
                }
                try {
                    await self.portNum.open({ baudRate: 1000000 })
                }
                catch (err) {
                    self.lastmessage = "打开端口错误：" + err
                    return
                }
                //RSET and HALT
                self.connecting = true;
                self.connectPercentage = 0;
                var RSET = self.asciiToUint8("{RSET}")
                var HALT = self.asciiToUint8("{HALT}")
                var writer = self.portNum.writable.getWriter()
                var reader = self.portNum.readable.getReader()
                await writer.write(RSET)
                await writer.write(HALT)

                // var pongPacket = "";
                // var isGetted = false
                // while (pongPacket.length <= 27 && (!isGetted)) {
                //     var res = await reader.read()
                //     for (var x in res.value) {
                //         if (String.fromCharCode(res.value[x]) != "A") pongPacket = pongPacket + String.fromCharCode(res.value[x])
                //         if (pongPacket.endsWith("XDEN chunicon v3-32 model 2.")) isGetted = true
                //         if (pongPacket.endsWith("XDEN chunicon v3-32 model 1.")) isGetted = true
                //     }
                // }
                // if (!isGetted) {
                //     self.lastmessage = "打开端口错误：请选择正确的设备!"
                //     return
                // }
                // self.connectPercentage = 20;
                //获取固件版本号
                // var readFirmwareVersionPacket = self.getReadRomPacket(0x07)
                // await writer.write(readFirmwareVersionPacket)
                // var recvCount = 0
                // var firmVersion = ""
                // while (recvCount <= 2) {
                //     var res = await reader.read()
                //     recvCount++
                //     for (var x in res.value) {
                //         if (String.fromCharCode(res.value[x]) != "A") firmVersion = firmVersion + String.fromCharCode(res.value[x])
                //     }
                // }
                // self.connectPercentage = 40;
                //获取输出
                var readZhouiopacket = self.getReadRomPacket(0x65)
                await writer.write(readZhouiopacket)
                var recvCount = 0
                var zhouiostr = ""
                while (recvCount <= 1) {
                    var res = await reader.read()
                    recvCount++
                    for (var x in res.value) {
                        if (String.fromCharCode(res.value[x]) != "A") zhouiostr = zhouiostr + String.fromCharCode(res.value[x])
                    }
                }
                if (zhouiostr * 1 == 1) self.zhou_io_enabled = true; else self.zhou_io_enabled = false;

                var readkeyboardpacket = self.getReadRomPacket(0x64)
                await writer.write(readkeyboardpacket)
                var recvCount = 0
                var keyboardstr = ""
                while (recvCount <= 1) {
                    var res = await reader.read()
                    recvCount++
                    for (var x in res.value) {
                        if (String.fromCharCode(res.value[x]) != "A") keyboardstr = keyboardstr + String.fromCharCode(res.value[x])
                    }
                }
                if (keyboardstr * 1 == 1) self.keyboard_enabled = true; else self.keyboard_enabled = false;
                self.connectPercentage = 50;
                //获取灵敏度
                var readSensitivePacket = self.getReadRomPacket(0x54)
                await writer.write(readSensitivePacket)
                var recvCount = 0
                var sensi = ""
                while (recvCount <= 2) {
                    var res = await reader.read()
                    recvCount++
                    for (var x in res.value) {
                        if (String.fromCharCode(res.value[x]) != "A") sensi = sensi + String.fromCharCode(res.value[x])
                    }
                }
                self.sensitive = parseInt(sensi)
                self.connectPercentage = 70

                //获取亮度
                var readBrightnesstivePacket = self.getReadRomPacket(0x62)
                await writer.write(readBrightnesstivePacket)
                var recvCount = 0
                var bri = ""
                while (recvCount <= 2) {
                    var res = await reader.read()
                    recvCount++
                    for (var x in res.value) {
                        if (String.fromCharCode(res.value[x]) != "A") bri = bri + String.fromCharCode(res.value[x])
                    }
                }
                self.brightness = parseInt(bri)
                if (self.brightness > 255 || self.brightness < 0) self.brightness = 255
                self.connectPercentage = 80
                //获取键型
                var readKeyTypePacket = self.getReadRomPacket(0x5e)
                await writer.write(readKeyTypePacket)
                var recvCount = 0
                var keyt = ""
                while (recvCount <= 2) {
                    var res = await reader.read()
                    recvCount++
                    for (var x in res.value) {
                        if (String.fromCharCode(res.value[x]) != "A") keyt = keyt + String.fromCharCode(res.value[x])
                    }
                }
                self.connectPercentage = 90
                self.keyType = parseInt(keyt)
                if (self.keyType > 4 || self.keyType < 1) self.keyType = 1
                self.connecting = false
                self.lastmessage = "已选择控制器: XDEN chunicon v2. 固件版本: " + firmVersion
                self.firmVersion = parseInt(firmVersion)
                //写入灯效
                self.headMessageType = "success"
                reader.releaseLock()
                writer.releaseLock()
                self.connected = true
            }
            else {
                self.lastmessage = "您的浏览器不支持串口通信，请使用chrome浏览器。"
            }
            //TODO 键位设置 4 8 16 32k 抗干扰开关（无 弱 强）  6air开关
        },
    }
}
</script>
<style></style>
