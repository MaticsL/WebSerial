<template>
  <h2 @click="debugenable">chuni32寸控制器配置</h2><el-divider></el-divider>
    <el-alert
      title="提示"
      type="info"
      description="本页面提供 chun32 寸控制器的配置功能。请确认您的控制器符合这个版本。完成配置后，您可以直接关闭这个页面。"
      show-icon>
    </el-alert><br />
  <el-row>
    <el-col :span="4"><el-button @click="factoryMode" :disabled="connected">进入刷机模式</el-button></el-col>
    <el-col :span="4"><el-button @click="choosePort" :disabled="connected">连接控制器</el-button></el-col>
    <el-col :span="16">
      <el-alert
        :title="lastmessage"
        :type="headMessageType"
        :closable="false"
      >
      </el-alert>
    </el-col>
  </el-row><br v-if="connecting" />
  <el-progress v-if="connecting" :percentage="connectPercentage"></el-progress>
  <el-divider></el-divider>
  <el-card v-if="connected">
    <div slot="header">
      <span>输出配置</span>

      <el-button style="float: right;" type="primary" :disabled="!connected" @click="writeInput">写入输入配置</el-button>
    </div><br />
    <el-alert
      title="提示"
      type="info"
      description="手台可以调节输出键盘按键或舟HID，请根据需要选择，也可以都输出。"
      show-icon>
    </el-alert>

  </el-card><br />
  <el-card v-if="connected">
    <div slot="header">
      <span>灵敏度阈值配置</span>

      <el-button style="float: right;" type="primary" :disabled="!connected" @click="writeSensitive">写入灵敏度</el-button>
    </div><br />
    <el-alert
      title="提示"
      type="info"
      description="向左升高灵敏度，向右降低灵敏度。"
      show-icon>
    </el-alert>
    <el-slider
      v-model="sensitive"
      :show-tooltip="true"
      :step="sensiStep"
      :min="sensiMin"
      :max="sensiMax"
      show-input>
    </el-slider>
  </el-card><br />
  <el-card v-if="firmVersion>=10">
    <div slot="header">
      <span>亮度配置</span>
      <el-button style="float: right;" type="primary" :disabled="!connected" @click="writeBrightness">写入亮度配置</el-button>
    </div>
    <el-slider
      v-model="brightness"
      :show-tooltip="false"
      :step="1"
      :min="0"
      :marks="brightnessMark"
      :max="10">
    </el-slider>
  </el-card><br />
  <el-card v-if="false">
    <div slot="header">
      <span>灯光颜色配置</span>

      <el-button style="float: right;" type="primary" :disabled="!connected" @click="writeColor">写入灯光颜色配置</el-button>
    </div>
    <el-color-picker color-format="rgb" v-model="lightColor"></el-color-picker>
    <el-color-picker color-format="rgb" v-model="closeColor"></el-color-picker>
  </el-card>
  <el-card v-if="false">
    <div slot="header">
      <span>键型配置</span>
      <el-button style="float: right;" type="primary" :disabled="!connected" @click="writeKeyLayout">写入键型配置</el-button>
    </div><br />
    <el-alert
      title="提示"
      type="info"
      description="键型：32k为几乎覆盖全键盘，8k为asdfjkl;，4k为dfjk。"
      show-icon></el-alert>
    <el-slider
      v-model="keyType"
      :show-tooltip="false"
      :step="1"
      :min="1"
      :marks="keyTypeMark"
      :max="4">
    </el-slider>
  </el-card>
  <el-card v-if="connected&&debugEnabled">
    <div slot="header">
      <span>危险区域！</span>
    </div>
      <el-input-number v-model="eepromAddr" :min="0" :max="255" label="地址"></el-input-number>
      <el-input-number v-model="eepromValue" :min="0" :max="255" label="值"></el-input-number>
      <el-button type="primary" @click="readEEPROM">读取</el-button>
      <el-button type="danger" @click="writeEEPROM">写入</el-button>
  </el-card>
</template>

<script>
export default {
    data() {
      return {
        headMessageType: "warning",
        firmVersion: 0,
        connecting: false,
        connected: false,
        lastmessage: "请选择设备",
        sliderType: 1, //0=noled, 1=led
        portNum: null,
        eepromAddr: 255,
        connectPercentage: 0, 
        eepromValue: 0,
        lightColor: "#000000",
        brightness: 250,
        keyType: 1,
        closeColor: "#000000",
        keyTypeMark: {
          1: "32k",
          2: "16k",
          3: "8k",
          4: "4k"
        },
        brightnessMark: {
          0: '关闭',
          1: '10%',
          2: '20%',    
          3: '30%',
          4: '40%',
          5: '50%',    
          6: '60%',
          7: '70%',
          8: '80%',    
          9: '90%',
          10: '100%',
        },
        sensitive: 20,
        sensiStep: 1,
        sensiMin: 10,
        sensiMax: 64,
        debugEnabledCount: 0,
        debugEnabled: false
      }
    },
    methods: {
      debugenable() {
        this.debugEnabledCount+=1
        if(this.debugEnabledCount>=5)this.debugEnabled=true
      },
      getWriteRomPacket(addr, val) {
        return new Uint8Array([0x21, 0x40, 0x23, 0x23, 0x1c, addr, 0x00, val, val, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
      },
      getHelloPacket() {
        return new Uint8Array([0x21, 0x40, 0x23, 0x23, 0x20, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
      },
      getReadRomPacket(addr) {
        return new Uint8Array([0x21, 0x40, 0x23, 0x23, 0x1d, addr, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
      },
      async readEEPROM() {
        let self=this
        var writer = self.portNum.writable.getWriter()
        var reader = self.portNum.readable.getReader()
        var readEEPROMPacket = self.getReadRomPacket(self.eepromAddr)
        await writer.write(readEEPROMPacket)
        var recvCount = 0
        var result=""
        while(recvCount<=2){
          var res = await reader.read()
          recvCount++
          for(var x in res.value){
            result=result+String.fromCharCode(res.value[x])
          }
        }
        self.eepromValue = parseInt(result)
        reader.releaseLock()
        writer.releaseLock()
      },
      async writeEEPROM() {
        let self=this
        var writer = self.portNum.writable.getWriter()
        var writeEEPROMPacket = self.getWriteRomPacket(self.eepromAddr, self.eepromValue)
        await writer.write(writeEEPROMPacket)
        writer.releaseLock()
      },
      async writeKeyLayout() {
        let self=this
        if(self.connected&&self.portNum!=null){
          var writer = self.portNum.writable.getWriter()
          var reader = self.portNum.readable.getReader()
          var writekeylayoutPacket = self.getWriteRomPacket(0x5e, self.keyType)
          await writer.write(writekeylayoutPacket)
          var readkeylayoutPacket = self.getReadRomPacket(0x5e)
          await writer.write(readkeylayoutPacket)
          var recvCount = 0
          var keyt = ""
          while(recvCount<=2){
            var res = await reader.read()
            recvCount++
            for(var x in res.value){
              keyt=keyt+String.fromCharCode(res.value[x])
            }
          }
          self.keyType = parseInt(keyt)
          reader.releaseLock()
          writer.releaseLock()
          self.lastmessage="写入成功！键型在下次连接手台时生效。"
        }
      },
      async writeBrightness() {
        let self=this
        if(self.connected&&self.portNum!=null){
          var writer = self.portNum.writable.getWriter()
          var reader = self.portNum.readable.getReader()
          var writeBrightnessPacket = self.getWriteRomPacket(0x62, self.brightness)
          await writer.write(writeBrightnessPacket)
          var readBrightnessPacket = self.getReadRomPacket(0x62)
          await writer.write(readBrightnessPacket)
          var recvCount = 0
          var bri = ""
          while(recvCount<=2){
            var res = await reader.read()
            recvCount++
            for(var x in res.value){
              bri=bri+String.fromCharCode(res.value[x])
            }
          }
          self.brightness = parseInt(bri)
          reader.releaseLock()
          writer.releaseLock()
          self.lastmessage="写入成功！亮度在下次连接手台时生效。"
        }
      },
      async writeSensitive() {
        let self=this
        if(self.connected&&self.portNum!=null){
          var writer = self.portNum.writable.getWriter()
          var reader = self.portNum.readable.getReader()
          var writeSensitivePacket = self.getWriteRomPacket(0x54, self.sensitive)
          await writer.write(writeSensitivePacket)
          var readSensitivePacket = self.getReadRomPacket(0x54)
          await writer.write(readSensitivePacket)
          var recvCount = 0
          var sensi = ""
          while(recvCount<=2){
            var res = await reader.read()
            recvCount++
            for(var x in res.value){
              sensi=sensi+String.fromCharCode(res.value[x])
            }
          }
          self.sensitive = parseInt(sensi)
          reader.releaseLock()
          writer.releaseLock()
          self.lastmessage="写入成功！灵敏度在下次连接手台时生效。"
        }
      },
      async choosePort() {
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
          //发送hello
          self.connecting=true;
          self.connectPercentage=0;
          var helloPacket = self.getHelloPacket()
          var writer = self.portNum.writable.getWriter()
          var reader = self.portNum.readable.getReader()
          await writer.write(helloPacket)
          var pongPacket = "";
          var isGetted = false
          while(pongPacket.length<=27&&(!isGetted)){
            var res = await reader.read()
            for(var x in res.value){
              pongPacket=pongPacket+String.fromCharCode(res.value[x])
              if(pongPacket.endsWith("XDEN chunicon v3-32 model 2."))isGetted=true
              if(pongPacket.endsWith("XDEN chunicon v3-32 model 1."))isGetted=true
            }
          }
          if(!isGetted){
            self.lastmessage="打开端口错误：请选择正确的设备!"
            return
          }
          self.connectPercentage=30;
          //获取固件版本号
          var readFirmwareVersionPacket = self.getReadRomPacket(0x07)
          await writer.write(readFirmwareVersionPacket)
          var recvCount = 0
          var firmVersion = ""
          while(recvCount<=2){
            var res = await reader.read()
            recvCount++
            for(var x in res.value){
              firmVersion=firmVersion+String.fromCharCode(res.value[x])
            }
          }
          self.connectPercentage=50;
          //获取灵敏度
          var readSensitivePacket = self.getReadRomPacket(0x54)
          await writer.write(readSensitivePacket)
          var recvCount = 0
          var sensi = ""
          while(recvCount<=2){
            var res = await reader.read()
            recvCount++
            for(var x in res.value){
              sensi=sensi+String.fromCharCode(res.value[x])
            }
          }
          self.sensitive = parseInt(sensi)
          self.connectPercentage=70

          //获取亮度
          var readBrightnesstivePacket = self.getReadRomPacket(0x62)
          await writer.write(readBrightnesstivePacket)
          var recvCount = 0
          var bri = ""
          while(recvCount<=2){
            var res = await reader.read()
            recvCount++
            for(var x in res.value){
              bri=bri+String.fromCharCode(res.value[x])
            }
          }
          self.brightness = parseInt(bri)
          if(self.brightness>255||self.brightness<0)self.brightness=255
          self.connectPercentage=80
          //获取键型
          var readKeyTypePacket = self.getReadRomPacket(0x5e)
          await writer.write(readKeyTypePacket)
          var recvCount = 0
          var keyt = ""
          while(recvCount<=2){
            var res = await reader.read()
            recvCount++
            for(var x in res.value){
              keyt=keyt+String.fromCharCode(res.value[x])
            }
          }
          self.connectPercentage=90
          self.keyType = parseInt(keyt)
          if(self.keyType>4||self.keyType<1)self.keyType=1
          self.connecting=false
          self.lastmessage="已选择控制器: XDEN chunicon v2. 固件版本: " + firmVersion
          self.firmVersion = parseInt(firmVersion)
          //写入灯效
          self.headMessageType = "success"
          reader.releaseLock()
          writer.releaseLock()
          self.connected=true
        }
        else{
          self.lastmessage="您的浏览器不支持串口通信，请使用chrome浏览器。"
        }
        //TODO 键位设置 4 8 16 32k 抗干扰开关（无 弱 强）  6air开关
      },
        async factoryMode() {
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
            await self.portNum.open({baudRate: 1200})
            await self.portNum.setSignals({dataTerminalReady: false})
          }
          catch(err) {
            self.lastmessage="打开端口错误：" + err
            return
          }
          self.lastmessage="成功，请检查控制器盘符并放入固件"
          self.headMessageType="success"
        }
      }
    }
}
</script>
<style>
</style>
