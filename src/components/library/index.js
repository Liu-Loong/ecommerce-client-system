// 扩展vue原有的功能：全局组件，自定义指令，挂载原型方法，注意：没有全局过滤器。
// 这就是插件
// vue2.0插件写法要素：导出一个对象，有install函数，默认传入了Vue构造函数，Vue基础之上扩展
// vue3.0插件写法要素：导出一个对象，有install函数，默认传入了app应用实例，app基础之上扩展
// import EcsSkeleton from './ecs-skeleton.vue'
// import EcsCarousel from './ecs-carousel.vue'
// import EcsMore from './ecs-more.vue'
// import EcsBread from './ecs-bread.vue'
// import EcsBreadItem from './ecs-bread-item.vue'
// import defaultImg from '@/assets/images/200.png'

/*
1.使用 require 提供的函数 context 加载某一个目录下的所有 .vue 后缀的文件。require.context() 是webpack提供的一个自动导入的API
2.然后 context 函数会返回一个导入函数 importFn
3.它用一个属性 keys() 获取所有的文件路径
4.通过文件路径数组，通过遍历数组，再使用 importFn 根据路径导入组件对象
5.遍历的同时进行全局注册即可
*/

//参数：1. 目录  2. 是否加载子目录  3. 加载文件的正则匹配
const importFn = require.context('./',false,/\.vue$/)
import Message from '@/components/library/Message'
import Confirm from '@/components/library/Confirm'
export default {
  install (app) {
    // 在app上进行扩展，app提供 component directive 函数
    // 如果要挂载原型 app.config.globalProperties 方式
    // app.component(EcsSkeleton.name, EcsSkeleton)
    // app.component(EcsCarousel.name, EcsCarousel)
    // app.component(EcsMore.name, EcsMore)
    // app.component(EcsBread.name, EcsBread)
    // app.component(EcsBreadItem.name, EcsBreadItem)

    //根据keys批量注册
    importFn.keys().forEach(path => {
      //导入组件
      const component = importFn(path).default
      //注册组件
      app.component(component.name,component)
    })
    //定义指令
    defineDirective(app)

    //定义一个原型函数
    app.config.globalProperties.$message = Message
    app.config.globalProperties.$confirm = Confirm
  }
}

// 定义指令
const defineDirective = (app) =>{
  //1.图片懒加载指令
  // 原理：先存储图片地址不能放在src上，当图片进入可视区，将存储的图片地址设置给图片元素即可
  app.directive('lazyload',{
    // vue2.0 监听使用指令的DOM是否创建好，钩子函数： inserted
    // vue3.0 的指令拥有的钩子函数和组件一样，使用指令的DOM是否创建好：钩子函数：mounted
    mounted(el,binding) {
      //2.创建一个观察对象，来观察当前使用指令的元素
      const observe = new IntersectionObserver(([{isIntersecting}]) => {
        if(isIntersecting){
          //停止观察
          observe.unobserve(el)
          //3.把指令的值设置给el的src属性 binding.value就是指令的值
          //4.处理图片加载失败 error 图片加载失败的时间 load 图片加载成功
          el.onerror = () =>{
            //加载失败，设置默认图
            el.src = defaultImg
          }
          el.src = binding.value
        }
      },{
        threshold: 0.01
      })
      //开启观察
      observe.observe(el)
    },
  })
}