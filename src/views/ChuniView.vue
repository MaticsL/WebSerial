<template>
  <h2>控制器配置</h2><el-divider></el-divider>
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
      <span>灵敏度配置</span>
      <el-button style="float: right;" type="primary" :disabled="!connected" @click="writeSensitive">写入灵敏度</el-button>
    </div>
    <el-slider
      v-model="sensitive"
      :show-tooltip="false"
      :step="sensiStep"
      :min="sensiMin"
      :marks="sensiMarks"
      :max="sensiMax">
    </el-slider>
  </el-card>

</template>

<script>
export default {
    data() {
      return {
        headMessageType: "warning",
        connected: false,
        lastmessage: "请选择端口",
        sliderType: 1, //0=noled, 1=led
        portNum: null,
        sensitive: 8,
        sensiStep: 1,
        sensiMin: 8,
        sensiMax: 12,
        sensiMarks0: {
          24: '超高',
          32: '高',
          40: '一般',
          48: '低',
          56: '较低',
          64: '非常低'
        },
        sensiMarks1: {
          8: '超高',
          9: '高',
          10: '一般',
          11: '低',
          12: '较低',
          13: '非常低'
        },
        sensiMarks: {
          24: '超高',
          32: '高',
          40: '一般',
          48: '低',
          56: '较低',
          64: '非常低'
        }
      }
    },
    methods: {
      async writeSensitive() {
        let self=this
        if(self.connected&&self.portNum!=null){
          var writer = self.portNum.writable.getWriter()
          var reader = self.portNum.readable.getReader()
          var writeSensitivePacket = new Uint8Array([0x21, 0x40, 0x23, 0x23, 0x1c, 0x54, 0x00, self.sensitive, self.sensitive, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
          await writer.write(writeSensitivePacket)
          var readSensitivePacket = new Uint8Array([0x21, 0x40, 0x23, 0x23, 0x1d, 0x54, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
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
          if(self.sensitive>16){
            self.sensiMarks = self.sensiMarks0
            self.sensiStep = 8
            self.sensiMin = 24
            self.sensiMax = 64
          }
          else{
            self.sensiMarks = self.sensiMarks1
            self.sensiStep = 1
            self.sensiMin = 8
            self.sensiMax = 13
          }
          reader.releaseLock()
          writer.releaseLock()
          self.lastmessage="写入成功"
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
          var helloPacket = new Uint8Array([0x21, 0x40, 0x23, 0x23, 0x20, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
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
          var readFirmwareVersionPacket = new Uint8Array([0x21, 0x40, 0x23, 0x23, 0x1d, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
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
          var readSensitivePacket = new Uint8Array([0x21, 0x40, 0x23, 0x23, 0x1d, 0x54, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
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
          if(self.sensitive>16){
            self.sensiMarks = self.sensiMarks0
            self.sensiStep = 8
            self.sensiMin = 24
            self.sensiMax = 64
          }
          else{
            self.sensiMarks = self.sensiMarks1
            self.sensiStep = 1
            self.sensiMin = 8
            self.sensiMax = 13
          }
          self.lastmessage="已选择控制器: XDEN chunicon v2. 固件版本: " + firmVersion
          //写入灯效
          
          self.headMessageType = "success"
          reader.releaseLock()
          writer.releaseLock()
          self.connected=true
        }
        else{
          self.lastmessage="您的浏览器不支持串口通信，请使用chrome浏览器。"
        }
      }
    }
}
</script>
<style>
</style>
