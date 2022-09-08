import axios from 'axios'
import store from '@/store'
import router from '@/router'

/*  1.初始化axios实例
    2.请求拦截器，如果有token进行头部携带
    3.响应拦截器：1）剥离无效数据 2）处理token失效
    4.导出一个函数，调用当前的axios实例发请求，返回promise
 */

// 导出基准地址，原因：其他地方不是通过axios请求发送的，也需要基准地址
export const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net/'
const instance = axios.create({
  // axios的一些配置  baseURL  timeout
  baseURL,
  timeout: 5000
})
// 请求拦截器
instance.interceptors.request.use(config => {
  // 拦截业务逻辑
  // 进行请求配置的修改
  // 如果本地有token就在头部携带
  // 1.获取用户信息对象
  const profile = store.state.user.profile
  // 2.判断是否有token
  if (profile.token) {
    // 3.设置token
    config.headers.Authorization = `Bearer ${profile.token}`
  }
  return config
}, err => {
  return Promise.reject(err)
})

// 响应拦截器
// res => res.data  取出data数据，未来调用接口的时候直接获取到的就是后台的数据
instance.interceptors.response.use(res => res.data, err => {
  // 401 状态码，进入该函数
  if (err.response && err.response.status === 401) {
    // 1.清空无效用户信息
    // 2.跳转到登录页面
    // 3.跳转需要传参（当前路由地址）给登录页码
    store.commit('user/setUser', {})
    // 当前路由地址
    // 在组件当中：$router.fullpath
    // js模块中：router.currentRouter.value.fullPath
    // router.currentRouter  是一个ref响应式数据 需要.value
    // encodeURIComponent()转换URL编码，目的：防止将来解析地址时不出问题
    const fullPath = encodeURIComponent(router.currentRoute.value.fullPath)
    router.push('/login?redirectUrl=' + fullPath)
  }
  return Promise.reject(err)
})

// 请求工具函数
export default (url, method, submitData) => {
  // 负责发送请求： 请求地址，请求方式，提交的数据
  return instance({
    url,
    method,
    // 1. 如果是get请求，需要使用params来传递submitData
    // 2. 如果是其他请求，需要使用data来传submitData
    // []设置一个动态的key，[]内可以写js表达式，js表达的结果当作key
    //  const a = {name:100} a.name/a[10>8?'name':'age']
    // method参数：可能大小写不同 eg：get/GET 利用.toLowerCase转换成小写再来判断
    // 在对象，['params']:submitData ===== params:submitData 这样理解
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
}
