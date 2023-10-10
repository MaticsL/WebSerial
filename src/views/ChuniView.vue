<template>
  <h2 @click="debugenable">chuni （白色）24-27 寸控制器配置</h2><el-divider></el-divider>
  <el-row>
    <el-col :span="4"><el-button @click="choosePort" :disabled="connected">连接控制器</el-button></el-col>
    <el-col :span="20">
      <el-alert
        :title="lastmessage"
        :type="headMessageType"
        :closable="false"
      >
      </el-alert>
    </el-col>
  </el-row>
  <el-divider></el-divider>
  <el-card v-if="connected">
    <div slot="header">
      <span>灵敏度配置<span>
      <el-alert
        title="提示"
        type="info"
        description="向左升高灵敏度，向右降低灵敏度，推荐带灯版本灵敏度8-11之间，不带灯版灵敏度32-45之间。"
        show-icon>
      </el-alert>
      <el-button style="float: right;" type="primary" :disabled="!connected" @click="writeSensitive">写入灵敏度</el-button>
    </div>
    <el-slider
      v-model="sensitive"
      :show-tooltip="false"
      :step="sensiStep"
      :min="sensiMin"
      :max="sensiMax">
    </el-slider>
  </el-card>
  <el-card v-if="self.firmVersion>=10">
    <div slot="header">
      <span>亮度配置</span>
      <el-button style="float: right;" type="primary" :disabled="!connected" @click="writeBrightness">写入亮度配置</el-button>
    </div>
    <el-slider
      v-model="brightness"
      :show-tooltip="false"
      step=1
      min=0
      :marks="brightnessMark"
      max=10>
    </el-slider>
  </el-card>
  <el-card v-if="false">
    <div slot="header">
      <span>灯光颜色配置</span>

      <el-button style="float: right;" type="primary" :disabled="!connected" @click="writeColor">写入灯光颜色配置</el-button>
    </div>
    <el-color-picker color-format="rgb" v-model="lightColor"></el-color-picker>
    <el-color-picker color-format="rgb" v-model="closeColor"></el-color-picker>
  </el-card>
  <el-card v-if="self.firmVersion>=10">
    <div slot="header">
      <span>键型配置</span>
      <el-button style="float: right;" type="primary" :disabled="!connected" @click="writeKeyLayout">写入键型配置</el-button>
    </div>
    <el-slider
      v-model="keyType"
      :show-tooltip="false"
      step=1
      min=1
      :marks="keyTypeMark"
      max=4>
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
        connected: true,
        lastmessage: "请选择端口",
        sliderType: 1, //0=noled, 1=led
        portNum: null,
        eepromAddr: 255,
        eepromValue: 0,
        lightColor: "#000000",
        brightness: 10,
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
          25: '10%',
          50: '20%',    
          75: '30%',
          100: '40%',
          125: '50%',    
          150: '60%',
          175: '70%',
          200: '80%',    
          225: '90%',
          255: '100%',
        },
        sensitive: 8,
        sensiStep: 1,
        sensiMin: 7,
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
            if(String.fromCharCode(res.value[x])!="A")result=result+String.fromCharCode(res.value[x])
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
          var writekeylayoutPacket = self.getWriteRomPacket(0x54, self.keyType)
          await writer.write(writekeylayoutPacket)
          var readkeylayoutPacket = self.getReadRomPacket(0x54)
          await writer.write(readkeylayoutPacket)
          var recvCount = 0
          var keyt = ""
          while(recvCount<=2){
            var res = await reader.read()
            recvCount++
            for(var x in res.value){
              if(String.fromCharCode(res.value[x])!="A")keyt=keyt+String.fromCharCode(res.value[x])
            }
          }
          self.keyType = parseInt(keyt)
          reader.releaseLock()
          writer.releaseLock()
          self.lastmessage="写入成功！键型在下次连接手台时生效。"
        }
      },
      aysnc writeBrightness() {
        let self=this
        if(self.connected&&self.portNum!=null){
          var writer = self.portNum.writable.getWriter()
          var reader = self.portNum.readable.getReader()
          var writeBrightnessPacket = self.getWriteRomPacket(0x54, self.brightness)
          await writer.write(writeBrightnessPacket)
          var readBrightnessPacket = self.getReadRomPacket(0x54)
          await writer.write(readBrightnessPacket)
          var recvCount = 0
          var bri = ""
          while(recvCount<=2){
            var res = await reader.read()
            recvCount++
            for(var x in res.value){
              if(String.fromCharCode(res.value[x])!="A")bri=bri+String.fromCharCode(res.value[x])
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
              if(String.fromCharCode(res.value[x])!="A")sensi=sensi+String.fromCharCode(res.value[x])
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
          var helloPacket = self.getHelloPacket()
          var writer = self.portNum.writable.getWriter()
          var reader = self.portNum.readable.getReader()
          await writer.write(helloPacket)
          var pongPacket = "";
          var isGetted = false
          while(pongPacket.length<=20&&(!isGetted)){
            var res = await reader.read()
            for(var x in res.value){
              if(String.fromCharCode(res.value[x])!="A")pongPacket=pongPacket+String.fromCharCode(res.value[x])
              if(pongPacket.endsWith("XDEN chunicon v2."))isGetted=true
            }
          }
          
          //获取固件版本号
          var readFirmwareVersionPacket = self.getReadRomPacket(0x07)
          await writer.write(readFirmwareVersionPacket)
          var recvCount = 0
          var firmVersion = ""
          while(recvCount<=2){
            var res = await reader.read()
            recvCount++
            for(var x in res.value){
              if(String.fromCharCode(res.value[x])!="A")firmVersion=firmVersion+String.fromCharCode(res.value[x])
            }
          }

          //获取灵敏度
          var readSensitivePacket = self.getReadRomPacket(0x54)
          await writer.write(readSensitivePacket)
          var recvCount = 0
          var sensi = ""
          while(recvCount<=2){
            var res = await reader.read()
            recvCount++
            for(var x in res.value){
              if(String.fromCharCode(res.value[x])!="A")sensi=sensi+String.fromCharCode(res.value[x])
            }
          }
          self.sensitive = parseInt(sensi)

          //获取亮度
          var readBrightnesstivePacket = self.getReadRomPacket(0x54)
          await writer.write(readBrightnesstivePacket)
          var recvCount = 0
          var bri = ""
          while(recvCount<=2){
            var res = await reader.read()
            recvCount++
            for(var x in res.value){
              if(String.fromCharCode(res.value[x])!="A")bri=bri+String.fromCharCode(res.value[x])
            }
          }
          self.brightness = parseInt(bri)
          if(self.brightness>255||self.brightness<0)self.brightness=255
          //获取键型
          var readKeyTypePacket = self.getReadRomPacket(0x54)
          await writer.write(readKeyTypePacket)
          var recvCount = 0
          var keyt = ""
          while(recvCount<=2){
            var res = await reader.read()
            recvCount++
            for(var x in res.value){
              if(String.fromCharCode(res.value[x])!="A")keyt=keyt+String.fromCharCode(res.value[x])
            }
          }
          self.keyType = parseInt(keyt)
          if(self.keyType>4||self.keyType<1)self.keyType=1

          self.lastmessage="已选择控制器: XDEN chunicon v2. 固件版本: " + firmVersion
          self.firmVersion = firmVersion
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
      }
    }
}
</script>
<style>
</style>
