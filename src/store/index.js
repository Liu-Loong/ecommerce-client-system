import { createStore } from 'vuex'
import createPersistedstate from 'vuex-persistedstate'

import cart from './modules/cart'
import category from './modules/category'
import user from './modules/user'

export default createStore({

  modules: {
    cart, category, user
  },
  // 配置插件
  plugins: [
    // 默认存储在localStorage
    createPersistedstate({
      // 本地存储名字
      key: 'ecommerce-client-system',
      // 指定需要存储的模块
      paths: ['user', 'cart']
    })
  ]

  // // 数据
  // state: {

  // },
  // // vuex的计算属性
  // getters: {

  // },
  // // 改数据的函数
  // mutations: {
  // },
  // // 请求数据的函数
  // actions: {
  // },
  // // 分模块
  // modules: {
  // }
})
