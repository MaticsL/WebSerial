<template>
  <h2 @click="debugenable">HDX 配置</h2><el-divider></el-divider>
    <el-alert
      title="提示"
      type="info"
      description="本页面提供 HDX 乌蒙风格控制器的配置功能。请确认您的控制器符合这个版本。完成配置后，您可以直接关闭这个页面。"
      show-icon>
    </el-alert><br />
  <el-row>
    <el-col :span="4"><el-button @click="factoryMode">进入刷机模式</el-button></el-col>
    <el-col :span="16">
      <el-alert
        :title="lastmessage"
        :type="headMessageType"
        :closable="false"
      >
      </el-alert>
    </el-col>
  </el-row>
</template>

<script>
export default {
    data() {
      return {
        headMessageType: "warning",
        lastmessage: "请选择设备",
        portNum: null
      }
    },
    methods: {
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
