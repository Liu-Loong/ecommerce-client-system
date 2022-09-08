import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//导入组件的UI组件库
import UI from './components/library'
//重置样式
import 'normalize.css'
//公用样式
import '@/assets/styles/common.less'
createApp(App).use(store).use(router).use(UI).mount('#app')
