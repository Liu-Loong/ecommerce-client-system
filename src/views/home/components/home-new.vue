<template>
  <div class="home-new">
    <HomePanel title="新鲜好物" subTitle="新鲜出炉 品质靠谱">
      <template #right><EcsMore path="/"/></template>
      <div ref="target" style="position: relative;height: 426px;">
        <!-- 面板内容 -->
        <Transition name="fade">
          <ul v-if="goods.length" class="goods-list">
            <li v-for="item in goods" :key="item.id">
              <router-link :to="`/product/${item.id}`">
                <img :src="item.picture" alt="">
                <p class="name ellipsis">{{item.name}}</p>
                <p class="price">&yen;{{item.price}}</p>
              </router-link>
            </li>
          </ul>
          <HomeSkeleton bg="#f0f9f4" v-else/> 
        </Transition>
      </div>
    </HomePanel>
  </div>
</template>

<script>
import { ref } from 'vue'
import { findeNew } from '@/api/home'
import HomePanel  from './home-panel'
import HomeSkeleton  from './home-skeleton'
import { useLazyData } from '@/hooks'
export default {
  name: 'HomeNew',
  components:{HomePanel,HomeSkeleton},
  setup() {
    const {target,result} = useLazyData(findeNew)
    // console.log(goods);
    return{ goods: result,target }
  }
}
</script>

<style scoped lang="less">
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 406px;
  li {
    width: 306px;
    height: 406px;
    background: #f0f9f4;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding: 12px 30px 0 30px;
      text-align: center;
    }
    .price {
      color: @priceColor;
    }
  }
}
</style>