<template>
  <div class="ecs-confirm" :class="{fade}">
    <div class="wrapper" :class="{fade}">
      <div class="header">
        <h3>{{title}}</h3>
        <a @click="cancel" href="JavaScript:;" class="iconfont icon-close-new"></a>
      </div>
      <div class="body">
        <i class="iconfont icon-warning"></i>
        <span>{{text}}</span>
      </div>
      <div class="footer">
        <EcsButton @click="cancel" size="mini" type="gray">取消</EcsButton>
        <EcsButton @click="submit" size="mini" type="primary">确认</EcsButton>
      </div>
    </div>
  </div>
</template>
<script>
import { onMounted, ref } from 'vue-demi'
// 当前组件不是在APP下进行渲染，无法使用APP下的环境（全局组件，全局指令，原型属性函数
import EcsButton from './ecs-button.vue'
export default {
  name: 'EcsConfirm',
  components:{ EcsButton },
  props:{
    title:{
      type:String,
      default: '温馨提示'
    },
    text:{
      type:String,
      default:''
    },
    cancelCallback:{
      type:Function
    },
    submitCallback:{
      type:Function
    }
  },
  setup(props) {
    //对话框默认隐藏
    const fade = ref(false)
    //组件渲染完毕后
    onMounted(() => {
      // 当元素渲染完毕立即过渡的动画不会触发
      setTimeout(() => {
        fade.value = true
      }, 0);
    })
    //取消对话框
    const cancel = () =>{
      props.cancelCallback()
    }
    //确认对话框
    const submit = () =>{
      props.submitCallback()
    }

    return{fade,cancel,submit}
  }
}
</script>
<style scoped lang="less">
.ecs-confirm {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 8888;
  background: rgba(0,0,0,0);
  &.fade {
    transition: all 0.4s;
    background: rgba(0,0,0,.5);
  }
  .wrapper {
    width: 400px;
    background: #fff;
    border-radius: 4px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-60%);
    opacity: 0;
    &.fade {
      transition: all 0.4s;
      transform: translate(-50%,-50%);
      opacity: 1;
    }
    .header,.footer {
      height: 50px;
      line-height: 50px;
      padding: 0 20px;
    }
    .body {
      padding: 20px 40px;
      font-size: 16px;
      .icon-warning {
        color: @priceColor;
        margin-right: 3px;
        font-size: 16px;
      }
    }
    .footer {
      text-align: right;
      .ecs-button {
        margin-left: 20px;
      }
    }
    .header {
      position: relative;
      h3 {
        font-weight: normal;
        font-size: 18px;
      }
      a {
        position: absolute;
        right: 15px;
        top: 15px;
        font-size: 20px;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        color: #999;
        &:hover {
          color: #666;
        }
      }
    }
  }
}
</style>