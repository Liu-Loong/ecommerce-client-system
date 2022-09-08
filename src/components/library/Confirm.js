import {createVNode,render} from 'vue'
import EcsConfirm from './ecs-confirm.vue'

//dom容器
const div = document.createElement('div')
div.setAttribute('class','ecs-confirm-container')
document.body.appendChild(div)


//该函数渲染EcsConfirm组件，标题和文本
//函数的返回值是promise对象
export default ({title,text}) => {
  // 1. 渲染组件
  // 2. 点击确认按钮，触发resolve同时销毁组件
  // 3. 点击取消按钮，触发reject同时销毁组件
  return new Promise((resolve,reject)=> {
    //点击取消按钮触发的函数
    const cancelCallback = () => {
      render(null,div)
      reject(new Error('点击取消'))
    }
    //点击确认按钮触发的函数
    const submitCallback = () => {
      render(null,div)
      resolve()
    }
    const vnode = createVNode(EcsConfirm,{title,text,cancelCallback,submitCallback})
    render(vnode,div)
  })
}