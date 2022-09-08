<template>
  <!-- 顶部通栏 -->
  <AppTopnav />
  
  <!-- 头部组件 -->
  <AppHeader />
  <AppHeaderSticky/>
  <!-- 内容容器 -->
  <div class="main">
    <!-- 二级路由 -->
    <router-view></router-view>
  </div>
  <!-- 底部组件 -->
  <AppFooter />
</template>
<script>
import AppTopnav from '@/components/app-topnav.vue'
import AppHeader from '@/components/app-header.vue'
import AppFooter from '@/components/app-footer.vue'
import AppHeaderSticky from '@/components/app-header-sticky.vue'

import { useStore } from 'vuex'
export default {
  name: 'Layout',
  components: {
    AppTopnav,AppHeader,AppFooter,AppHeaderSticky
  },
  //获取分类数据
  setup(props) {
    const store = useStore()
    store.dispatch('category/getList')
  }
}
</script>

<style>
.app-body {
  min-height: 600px;
}

</style>
