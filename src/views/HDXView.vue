<script setup>
</script>

<template>
    <h2 @click="debugenable">HDX 配置</h2><el-divider></el-divider>
    <el-alert title="提示" type="info" description="本页面提供 HDX 乌蒙风格控制器的配置功能。请确认您的控制器符合这个版本。完成配置后，您可以直接关闭这个页面。" show-icon>
    </el-alert><br />
    <el-row>
        <el-col :span="4"><el-button @click="factoryMode">进入刷机模式</el-button></el-col>
        <el-col :span="4"><el-button @click="senseMode">修改灵敏度</el-button></el-col>
        <el-col :span="4" v-if="0 && debugEnabled">
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
    <el-card v-if="connected && !halting && debugEnabled" id="screen-testing">
        <h2>修改全部灵敏度</h2>
            <el-button :span="4" @click="addSensitivity">
                提高灵敏度
            </el-button>
            <el-button :span="4" @click="minusSensitivity">
                降低灵敏度
            </el-button>
    </el-card>
    <br />
    <el-card v-if="connected && !halting && debugEnabled" id="screen-testing">
        <h2>修改区域灵敏度</h2>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-select v-model="selectedArea" placeholder="触摸区域" :inline="true">
                    <el-option label="A1" value="A1"></el-option>
                    <el-option label="A2" value="A2"></el-option>
                    <el-option label="A3" value="A3"></el-option>
                    <el-option label="A4" value="A4"></el-option>
                    <el-option label="A5" value="A5"></el-option>
                    <el-option label="A6" value="A6"></el-option>
                    <el-option label="A7" value="A7"></el-option>
                    <el-option label="A8" value="A8"></el-option>
                    <el-option label="B1" value="B1"></el-option>
                    <el-option label="B2" value="B2"></el-option>
                    <el-option label="B3" value="B3"></el-option>
                    <el-option label="B4" value="B4"></el-option>
                    <el-option label="B5" value="B5"></el-option>
                    <el-option label="B6" value="B6"></el-option>
                    <el-option label="B7" value="B7"></el-option>
                    <el-option label="B8" value="B8"></el-option>
                    <el-option label="C1" value="C1"></el-option>
                    <el-option label="C2" value="C2"></el-option>
                    <el-option label="D1" value="D1"></el-option>
                    <el-option label="D2" value="D2"></el-option>
                    <el-option label="D3" value="D3"></el-option>
                    <el-option label="D4" value="D4"></el-option>
                    <el-option label="D5" value="D5"></el-option>
                    <el-option label="D6" value="D6"></el-option>
                    <el-option label="D7" value="D7"></el-option>
                    <el-option label="D8" value="D8"></el-option>
                    <el-option label="E1" value="E1"></el-option>
                    <el-option label="E2" value="E2"></el-option>
                    <el-option label="E3" value="E3"></el-option>
                    <el-option label="E4" value="E4"></el-option>
                    <el-option label="E5" value="E5"></el-option>
                    <el-option label="E6" value="E6"></el-option>
                    <el-option label="E7" value="E7"></el-option>
                    <el-option label="E8" value="E8"></el-option>
                </el-select>
            </el-col>
            <el-col :span="8">
                <el-button :span="4" @click="addAreaSensitivity">
                    提高灵敏度
                </el-button>
                <el-button :span="4" @click="minusAreaSensitivity">
                    降低灵敏度
                </el-button>
            </el-col>
        </el-row>
        <br/>
    </el-card>
    <el-card v-if="0 && connected && !halting && debugEnabled" id="screen-testing">
        <h2>触摸区域</h2>
        <div>{{ touchingArea }}</div>
        <br/>
    </el-card>
    <el-card v-if="0 && connected && halting && debugEnabled" id="settings-changing">
        <h3>设置Ratio</h3>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-select v-model="RatioSetting.area" placeholder="触摸区域" :inline="true">
                    <el-option label="A1" value="A1"></el-option>
                    <el-option label="A2" value="A2"></el-option>
                    <el-option label="A3" value="A3"></el-option>
                    <el-option label="A4" value="A4"></el-option>
                    <el-option label="A5" value="A5"></el-option>
                    <el-option label="A6" value="A6"></el-option>
                    <el-option label="A7" value="A7"></el-option>
                    <el-option label="A8" value="A8"></el-option>
                    <el-option label="B1" value="B1"></el-option>
                    <el-option label="B2" value="B2"></el-option>
                    <el-option label="B3" value="B3"></el-option>
                    <el-option label="B4" value="B4"></el-option>
                    <el-option label="B5" value="B5"></el-option>
                    <el-option label="B6" value="B6"></el-option>
                    <el-option label="B7" value="B7"></el-option>
                    <el-option label="B8" value="B8"></el-option>
                    <el-option label="C1" value="C1"></el-option>
                    <el-option label="C2" value="C2"></el-option>
                    <el-option label="D1" value="D1"></el-option>
                    <el-option label="D2" value="D2"></el-option>
                    <el-option label="D3" value="D3"></el-option>
                    <el-option label="D4" value="D4"></el-option>
                    <el-option label="D5" value="D5"></el-option>
                    <el-option label="D6" value="D6"></el-option>
                    <el-option label="D7" value="D7"></el-option>
                    <el-option label="D8" value="D8"></el-option>
                    <el-option label="E1" value="E1"></el-option>
                    <el-option label="E2" value="E2"></el-option>
                    <el-option label="E3" value="E3"></el-option>
                    <el-option label="E4" value="E4"></el-option>
                    <el-option label="E5" value="E5"></el-option>
                    <el-option label="E6" value="E6"></el-option>
                    <el-option label="E7" value="E7"></el-option>
                    <el-option label="E8" value="E8"></el-option>
                </el-select>
            </el-col>
            <el-col :span="8">
                <el-select v-model="RatioSetting.value" placeholder="值" :inline="true">
                    <el-option label="-5" value=-5></el-option>
                    <el-option label="-4" value=-4></el-option>
                    <el-option label="-3" value=-3></el-option>
                    <el-option label="-2" value=-2></el-option>
                    <el-option label="-1" value=-1></el-option>
                    <el-option label="0" value=0></el-option>
                    <el-option label="1" value=1></el-option>
                    <el-option label="2" value=2></el-option>
                    <el-option label="3" value=3></el-option>
                    <el-option label="4" value=4></el-option>
                    <el-option label="5" value=5></el-option>
                </el-select>
            </el-col>
            <el-button :span="4" @click="submitRatio">
                Submit
            </el-button>
        </el-row>
        <br/>
        <h3>设置Sensitivity</h3>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-select v-model="SensitivitySetting.area" placeholder="触摸区域" :inline="true">
                    <el-option label="A1" value="0x41"></el-option>
                    <el-option label="A3" value="0x42"></el-option>
                    <el-option label="A2" value="0x43"></el-option>
                    <el-option label="A4" value="0x44"></el-option>
                    <el-option label="A5" value="0x45"></el-option>
                    <el-option label="A6" value="0x46"></el-option>
                    <el-option label="A7" value="0x47"></el-option>
                    <el-option label="A8" value="0x48"></el-option>
                    <el-option label="B1" value="0x49"></el-option>
                    <el-option label="B2" value="0x50"></el-option>
                    <el-option label="B3" value="0x51"></el-option>
                    <el-option label="B4" value="0x52"></el-option>
                    <el-option label="B5" value="0x53"></el-option>
                    <el-option label="B6" value="0x54"></el-option>
                    <el-option label="B7" value="0x55"></el-option>
                    <el-option label="B8" value="0x56"></el-option>
                    <el-option label="C1" value="0x57"></el-option>
                    <el-option label="C2" value="0x58"></el-option>
                    <el-option label="D1" value="0x59"></el-option>
                    <el-option label="D2" value="0x60"></el-option>
                    <el-option label="D3" value="0x61"></el-option>
                    <el-option label="D4" value="0x62"></el-option>
                    <el-option label="D5" value="0x63"></el-option>
                    <el-option label="D6" value="0x64"></el-option>
                    <el-option label="D7" value="0x65"></el-option>
                    <el-option label="D8" value="0x66"></el-option>
                    <el-option label="E1" value="0x67"></el-option>
                    <el-option label="E2" value="0x68"></el-option>
                    <el-option label="E3" value="0x69"></el-option>
                    <el-option label="E4" value="0x70"></el-option>
                    <el-option label="E5" value="0x71"></el-option>
                    <el-option label="E6" value="0x72"></el-option>
                    <el-option label="E7" value="0x73"></el-option>
                    <el-option label="E8" value="0x74"></el-option>
                </el-select>
            </el-col>
            <el-col :span="8">
                <el-select v-model="SensitivitySetting.value" placeholder="值" :inline="true">
                    <el-option label="-5" value=-5></el-option>
                    <el-option label="-4" value=-4></el-option>
                    <el-option label="-3" value=-3></el-option>
                    <el-option label="-2" value=-2></el-option>
                    <el-option label="-1" value=-1></el-option>
                    <el-option label="0" value=0></el-option>
                    <el-option label="1" value=1></el-option>
                    <el-option label="2" value=2></el-option>
                    <el-option label="3" value=3></el-option>
                    <el-option label="4" value=4></el-option>
                    <el-option label="5" value=5></el-option>
                </el-select>
            </el-col>
            <el-button :span="4" @click="submitSensitivity">
                Submit
            </el-button>
        </el-row>
    </el-card>
</template>

<script>
export default {
    data() {
        return {
            headMessageType: "warning",
            lastmessage: "请选择设备",
            selectedArea: "none",
            portNum: null,
            connected: true,
            halting: false,
            touchingArea: [],
            touchingIntervalID: 0,
            readingData: new Uint8Array(),
            RatioSetting: {
                area: null,
                value:null
            },
            SensitivitySetting: {
                area: null,
                value:null
            },
        debugEnabledCount: 0,
        debugEnabled: false
        }
    },
    methods: {
        getSensePacket(t1, t2){
            packet = new TextEncoder().encode("sen " + t1 + " " + t2)
            console.log(packet)
            return packet
        },
        async addSensitivity() {
            let self=this
            if(!self.connected){
                return
            }
            var writer = self.portNum.writable.getWriter()
            var packet = self.getSensePacket("*", "-")
            await writer.write(packet)
        },
        async addSensitivity() {
            let self=this
            if(!self.connected){
                return
            }
            var writer = self.portNum.writable.getWriter()
            var packet = self.getSensePacket("*", "+")
            await writer.write(packet)
        },
        async addAreaSensitivity() {
            let self=this
            if(!self.connected){
                return
            }
            var writer = self.portNum.writable.getWriter()
            var packet = self.getSensePacket(self.selectedArea, "-")
            await writer.write(packet)
        },
        async minusAreaSensitivity() {
            let self=this
            if(!self.connected){
                return
            }
            var writer = self.portNum.writable.getWriter()
            var packet = self.getSensePacket(self.selectedArea, "+")
            await writer.write(packet)
        },
        debugenable() {
            this.debugEnabledCount+=1
            if(this.debugEnabledCount>=5)this.debugEnabled=true
        },
        submitRatio() {
            if (this.RatioSetting.area == null || this.RatioSetting.value == null) return;
            
        },
        submitSensitivity() {
            
        },
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
        async startTouchListening() {
            let self = this
            while (!this.halting) {
                let reader = self.portNum.getReader();
                while (true) {
                    const { value, done } = await reader.read();
                    if (done) {
                        break;
                    }
                    self.readingData = new Uint8Array();
                    if (value[7] & 1) self.readingData.push("A1");
                    if (value[7] & 2) self.readingData.push("A2");
                    if (value[7] & 4) self.readingData.push("A3");
                    if (value[7] & 8) self.readingData.push("A4");
                    if (value[7] & 16) self.readingData.push("A5");

                    if (value[6] & 1) self.readingData.push("A6");
                    if (value[6] & 2) self.readingData.push("A7");
                    if (value[6] & 4) self.readingData.push("A8");
                    if (value[6] & 8) self.readingData.push("B1");
                    if (value[6] & 16) self.readingData.push("B2");

                    if (value[5] & 1) self.readingData.push("B3");
                    if (value[5] & 2) self.readingData.push("B4");
                    if (value[5] & 4) self.readingData.push("B5");
                    if (value[5] & 8) self.readingData.push("B6");
                    if (value[5] & 16) self.readingData.push("B7");

                    if (value[4] & 1) self.readingData.push("B8");
                    if (value[4] & 2) self.readingData.push("C1");
                    if (value[4] & 4) self.readingData.push("C2");
                    if (value[4] & 8) self.readingData.push("D1");
                    if (value[4] & 16) self.readingData.push("D2");

                    if (value[3] & 1) self.readingData.push("D3");
                    if (value[3] & 2) self.readingData.push("D4");
                    if (value[3] & 4) self.readingData.push("D5");
                    if (value[3] & 8) self.readingData.push("D6");
                    if (value[3] & 16) self.readingData.push("D7");

                    if (value[2] & 1) self.readingData.push("D8");
                    if (value[2] & 2) self.readingData.push("E1");
                    if (value[2] & 4) self.readingData.push("E2");
                    if (value[2] & 8) self.readingData.push("E3");
                    if (value[2] & 16) self.readingData.push("E4");

                    if (value[1] & 1) self.readingData.push("E5");
                    if (value[1] & 2) self.readingData.push("E6");
                    if (value[1] & 4) self.readingData.push("E7");
                    if (value[1] & 8) self.readingData.push("E8");
                }
            }
        },
        async senseMode() {
            let self=this
            if("serial" in navigator){
            //support
            try {
                self.portNum = await navigator.serial.requestPort()
            }
            catch(err) {
                self.lastmessage="端口选择错误：" + err
                return
            }
            try {
                await self.portNum.open({baudRate: 1000000})
            }
            catch(err) {
                self.lastmessage="打开端口错误：" + err
                return
            }
            self.connected=true;

          }
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
                    this.startTouchListening();
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
                self.startTouchListening();
            }
            else {
                self.lastmessage = "您的浏览器不支持串口通信，请使用chrome浏览器。"
            }
        },
    }
}
</script>
<style></style>
