import { createRouter, createWebHashHistory } from 'vue-router'

const Layout = () => import('@/views/Layout')
const Home = () => import('@/views/home/index')
const TopCategory = () => import('@/views/category/index')
const SubCategory = () => import('@/views/category/sub')
const Goods = () => import('@/views/goods/index')
const Login = () => import('@/views/login/index')
const Cart = () => import('@/views/cart/index')
const LoginCallback = () => import('@/views/login/callback')
// 路由规则
const routes = [
  // 一级路由布局容器
  {
    path: '/',
    component: Layout,
    children: [
      { path: '/', component: Home },
      { path: '/category/:id', component: TopCategory },
      { path: '/category/sub/:id', component: SubCategory },
      { path: '/product/:id', component: Goods },
      { path: '/cart', component: Cart },
    ]
  },
  {path:'/login',component: Login},
  {path:'/login/callback',component: LoginCallback}
]
// 创建路由实例
const router = createRouter({
  // 使用hash方式实现路由
  history: createWebHashHistory(),
  // 配置路由规则
  routes,
  //每次切换路由的时候滚动到页面顶部
  scrollBehavior () {
    //vue2.0 vuex3.0通过x y 控制
    //vue3.0 vuex4.0通过left top 控制
    return { left:0 ,top:0 }
  }
})

export default router
