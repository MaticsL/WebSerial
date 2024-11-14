<template>
    <h2 @click="debugenable">HDX 配置</h2><el-divider></el-divider>
    <el-alert title="提示" type="info" description="本页面提供 HDX 乌蒙风格控制器的配置功能。请确认您的控制器符合这个版本。完成配置后，您可以直接关闭这个页面。" show-icon>
    </el-alert><br />
    <el-row>
        <el-col :span="4"><el-button @click="factoryMode">进入刷机模式</el-button></el-col>
        <el-col :span="4">
            <el-button @click="choosePort">
                {{ connected ? (halting ? "进入屏幕测试" : "进入配置设置") : "连接控制器" }}
            </el-button>
        </el-col>
        <el-col :span="16">
            <el-alert :title="lastmessage" :type="headMessageType" :closable="false">
            </el-alert>
        </el-col>
    </el-row>
    <br />
    <el-card v-if="connected && !halting" id="screen-testing">
        <div class="touch-sensor-canvas-container">
            <canvas></canvas>
        </div>
    </el-card>
    <el-card v-if="connected && halting" id="settings-changing">
        234
    </el-card>
</template>

<style scoped>
.touch-sensor-canvas-container {
    width: 50vw;
    height: 50vw;
}
</style>

<script>
export default {
    data() {
        return {
            headMessageType: "warning",
            lastmessage: "请选择设备",
            portNum: null,
            connected: true,
            halting: false
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
            if (this.connected == true) {
                if (this.halting == true) {
                    let STAT = this.asciiToUint8("{STAT}");
                    // let writer = self.portNum.writable.getWriter();
                    // await writer.write(STAT);
                    this.halting = !this.halting;
                    self.lastmessage = "退出配置设置";
                }
                else {
                    let HALT = this.asciiToUint8("{HALT}");
                    // let writer = self.portNum.writable.getWriter();
                    // await writer.write(HALT);
                    this.halting = !this.halting;
                    self.lastmessage = "退出屏幕测试";
                }
                return;
            }
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
                let RSET = self.asciiToUint8("{RSET}")
                let HALT = self.asciiToUint8("{HALT}")
                let writer = self.portNum.writable.getWriter()
                await writer.write(RSET)
                await writer.write(HALT)
                connected = !connected;
                self.lastmessage = "成功连接"
                self.headMessageType = "success"
            }
            else {
                self.lastmessage = "您的浏览器不支持串口通信，请使用chrome浏览器。"
            }
        },
    }
}
</script>
<style></style>
