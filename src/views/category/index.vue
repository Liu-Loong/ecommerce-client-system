<template>
  <div class="top-category">
    <div class="container">
      <!-- 面包屑 -->
      <EcsBread>
        <EcsBreadItem to="/">首页</EcsBreadItem>
        <Transition name="fade-right" mode="out-in">
          <EcsBreadItem :key="topCategory.id">{{topCategory.name}}</EcsBreadItem>
        </Transition>
        
      </EcsBread>
      <!-- 轮播图 -->
      <EcsCarousel :sliders="sliders" style="height:500px" />
      <!-- 所有二级分类 -->
      <div class="sub-list" >
        <h3>全部分类</h3>
        <ul>
          <li v-for="item in topCategory.children" :key="item.id">
            <a href="javascript:;">
              <img :src="item.picture" >
              <p>{{item.name}}</p>
            </a>
          </li>
        </ul>
      </div>
      <!-- 各个分类关联商品 -->
      <div class="ref-goods" v-for="sub in sublist" :key="sub.id">
        <div class="head">
          <h3>- {{sub.name}} -</h3>
          <p class="tag">温暖柔软，品质之选</p>
          <EcsMore :path="`/category/sub/${sub.id}`"/>
        </div>
        <div class="body">
          <GoodsItem v-for="goods in sub.goods" :key="goods.id" :goods="goods" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { findBanner } from '@/api/home'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { computed,ref, watch } from 'vue'
import GoodsItem  from './components/goods-item.vue'
import { findTopCategory } from '@/api/category'

export default {
  components: { GoodsItem },
  name: 'TopCategory',
  setup() {
    //获取轮播图
    const sliders = ref([])
    findBanner().then(data => {
      sliders.value = data.result
    })
    //获取面包屑+所有分类
    const store = useStore()
    const route = useRoute()
    const topCategory = computed(() => {
      //当前顶级分类 == 路由上的id取vuex中category模块的list中查找
      let cate = {}
      const item = store.state.category.list.find(item => {
        return item.id === route.params.id
      })
      if(item){
        cate = item
      }
      return cate
    })
    //获取各个子类目下的推荐商品
    const sublist = ref([])
    const getSubList = () => {
      findTopCategory(route.params.id).then(data => {
        sublist.value = data.result.children
      })
    }
    watch(() =>route.params.id,(newValue) => {
      if( newValue && `/category/${newValue}` === route.path) getSubList()
    },{immediate:true})
    return{ 
      sliders,
      topCategory,
      sublist 
    }
  }
}
</script>

<style scoped lang="less">
.top-category {
  h3 {
    font-size: 28px;
    color: #666;
    font-weight: normal;
    text-align: center;
    line-height: 100px;
  }
  .sub-list {
    margin-top: 20px;
    background-color: #fff;
    ul {
      display: flex;
      padding: 0 32px;
      flex-wrap: wrap;
      li {
        width: 168px;
        height: 160px;
        a {
          text-align: center;
          display: block;
          font-size: 16px;
          img {
            width: 100px;
            height: 100px;
          }
          p {
            line-height: 40px;
          }
          &:hover {
            color: @themeColor;
          }
        }
      }
    }
  }
  .ref-goods {
    background-color: #fff;
    margin-top: 20px;
    position: relative;
    .head {
      .ecs-more {
        position: absolute;
        top: 20px;
        right: 20px;
      }
      .tag {
        text-align: center;
        color: #999;
        font-size: 20px;
        position: relative;
        top: -20px;
      }
    }
    .body {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      padding: 0 65px 30px;
    }
  }
}
</style>