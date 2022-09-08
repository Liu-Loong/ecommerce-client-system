<template>
  <div class="page-home">
    <!-- 首页入口 -->
    <div class="home-entry">
      <div class="container">
        <!-- 左侧分类 -->
        <HomeCategory />
        <!-- 轮播图 -->
        <HomeBanner />
      </div>
    </div>
    <!-- 新鲜好物 -->
    <HomeNew />
    <!-- 人气推荐 -->
    <HomeHot />
    <!-- 热门品牌 -->
    <HomeBrand />
    <!-- 商品区域 -->
    <HomeProduct />
    <!-- 最新专题 -->
    <HomeSpecial />
  </div>
</template>
<script>
import { ref } from 'vue'
import HomeCategory from './components/home-category'
import HomeBanner from './components/home-banner'
import HomeHot from './components/home-hot.vue'
import HomeNew  from './components/home-new'
import HomeBrand from './components/home-brand'
import HomeProduct from './components/home-product'
import HomeSpecial from './components/home-special.vue'
export default {
  name: 'HomePage',
  components: { 
    HomeCategory,
    HomeBanner,
    HomeHot,
    HomeNew,
    HomeBrand,
    HomeProduct,
    HomeSpecial },
  setup() {
    const show = ref(true)
    return { show }
  }
}
</script>
<style scoped lang="less">

</style>