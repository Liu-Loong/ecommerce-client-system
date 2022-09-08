
<script>
import { h } from 'vue'
export default {
  name: 'EcsBread',
  //用法
  //1.单文件组件，template标签去除
  //2.返回值就是组件内容
  //3.vue2.0的h函数需要传参进来，vue3.0的h函数需要导入进来
  //4.h的第一个参数 标签名字 的二个参数 标签属性对象 第三个参数 子节点
  //需求
  //1.创建ecs-bread父容器
  //2.获取默认插槽内容ecs-bread-item
  //3.去除ecs-bread-item组件的i标签，由render函数来创建
  //4.遍历插槽中的item，得到一个动态创建的节点，实现最后一个不添加<i>标签
  //5.把动态创建的节点渲染在ecs-bread标签中
  render() {
    const items = this.$slots.default()
    const dymanicItems = []
    items.forEach((item,i) => {
      dymanicItems.push(item)
      if(i < (items.length - 1)){
        dymanicItems.push(h('i',{ class: 'iconfont icon-angle-right'}))
      }
    })
    return h('div',{ class: 'ecs-bread'},dymanicItems)
  }
}
</script>
<style  lang='less'>
//去除scoped属性，目的：让样式作用到ecs-bread-item组件
.ecs-bread{
  display: flex;
  padding: 25px 10px;
  &-item {
    a {
      color: #666;
      transition: all .4s;
      &:hover {
        color: @themeColor;
      }
    }
  }
  i {
    font-size: 12px;
    margin-left: 5px;
    margin-right: 5px;
    line-height: 22px;
  }
}
</style>