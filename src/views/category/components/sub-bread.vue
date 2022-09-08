<template>
  <EcsBread>
    <EcsBreadItem to="/">首页</EcsBreadItem>
    <EcsBreadItem v-if="category.top" :to="`/category/${category.top.id}`">{{category.top.name}}</EcsBreadItem>
    <Transition name="fade-right" mode="out-in">
      <EcsBreadItem v-if="category.sub" :key="category.sub.id">{{category.sub.name}}</EcsBreadItem>
    </Transition>
  </EcsBread>
</template>

<script>
import { computed } from 'vue-demi'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
export default {
  name: 'SubBread',
  setup() {
    //目标对象 {top:{id,name},sub{id,name}}
    const store = useStore()
    const route = useRoute()
    // 通过计算属性得到，二级类目的名称和ID，一级类目的名称和ID
    const category = computed(() => {
      const obj = {}
      //获取数据的逻辑
      store.state.category.list.forEach(top => {
        if(top.children) {
          const sub = top.children.find(sub => sub.id === route.params.id)
          if(sub){
            obj.top = {id: top.id, name: top.name}
            obj.sub = {id: sub.id, name: sub.name}
          }
        }
      })
      return obj
    })
    return { category }
  }
}
</script>

<style>

</style>