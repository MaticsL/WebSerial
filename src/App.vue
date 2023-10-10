<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <el-container class="mainAPP">
    <el-aside>
      <nav>
        <el-menu default-active="/" :router="true" class="el-menu-vertical">
          <el-menu-item index="/">
            <span slot="title">Home</span>
          </el-menu-item>
          <el-menu-item index="/chuni">
            <span slot="title">Chuni</span>
          </el-menu-item>
          <el-menu-item index="/hangeki">
            <span slot="title">Hangeki</span>
          </el-menu-item>
        </el-menu>
      </nav>
    </el-aside>
    <el-container>
      <el-main>
        <RouterView />
      </el-main>
    </el-container>
  </el-container>

</template>

<style scoped>
.mainAPP {
  max-width: 1000px;
}
.el-menu-vertical:not(.el-menu--collapse) {
  width: 200px;
  min-height: 800px;
}
</style>
