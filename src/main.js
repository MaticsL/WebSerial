import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import locale from 'element-plus/lib/locale/lang/zh-cn'

const app = createApp(App)

app.use(router)
app.use(ElementPlus, { locale })
app.mount('#app')
