<template>
  <div class='home-category' @mouseleave="categoryId=null">
    <ul class="menu">
      <li :class="{active:categoryId===item.id}" 
      v-for="item in menuList" :key="item.id" 
      @mouseenter="categoryId = item.id">
        <router-link :to="`/category/${item.id}`">{{item.name}}</router-link>
        <!-- 有数据时显示数据 -->
        <template v-if="item.children">
          <router-link 
          v-for="sub in item.children" 
          :key="sub.id" 
          :to="`/category/sub/${sub.id}`">
          {{sub.name}}
          </router-link>>
        </template>
        <template v-else>
          <!-- 没有数据时显示骨架 -->
          <EcsSkeleton width="60px" height="18px" style="margin-right:5px" bg="rgba(255,255,255,0.2)"/>
          <EcsSkeleton width="50px" height="18px" bg="rgba(255,255,255,0.2)"/>
        </template>
      </li>
    </ul>
    <!-- 弹层 -->
    <div class="layer" v-if="currCategory">
      <!-- 商品 -->
      <h4 v-if="currCategory">{{currCategory.id ==='brand' ? '品牌':'分类'}}推荐 <small>根据您的购买或浏览记录推荐</small></h4>
      <ul v-if="currCategory && currCategory.goods && currCategory.goods.length">
        <li v-for="item in currCategory.goods" :key="item.id">
          <router-link to="/">
            <img :src="item.picture" alt="">
            <div class="info">
              <p class="name ellipsis-2">{{item.name}}</p>
              <p class="desc ellipsis">{{item.desc}}</p>
              <p class="price"><i>¥</i>{{item.price}}</p>
            </div>
          </router-link>
        </li>
      </ul>
      <!-- 品牌 -->
      <ul v-if="currCategory && currCategory.brands&&currCategory.brands.length">
        <li class="brand" v-for="item in currCategory.brands" :key="item.id">
          <router-link to="/">
            <img :src="item.picture" alt="">
            <div class="info">
              <p class="place"><i class="iconfont icon-dingwei"></i>{{item.place}}</p>
              <p class="name ellipsis">{{item.name}}</p>
              <p class="desc ellipsis-2">{{item.desc}}</p>
            </div>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {computed,reactive,ref} from 'vue'
import { useStore } from 'vuex'
import { findBrand } from '@/api/home'
export default {
  name: 'HomeCategory',
    // 1. 获取vuex的一级分类，并且只需要两个二级分类
    // 2. 需要在组件内部，定义一个品牌数据
    // 3. 根据vuex的分类数据和组件中定义品牌数据，得到左侧分类完整数据(9分类+1品牌)数组
    // 4. 进行渲染即可
  setup() {
    const store = useStore()
    //最终使用9个分类+1个自定义品牌数据
    const brand = reactive({
      id:'brand',
      name:'品牌',
      children: [{id: 'brand-children',name: '品牌推荐'}],
      //品牌列表
      brands:[]
    })
    const menuList = computed(() => {
      //得到的9个分类每个一级分类下面有两个二级分类
      const list = store.state.category.list.map((item) => {
        return{
          id: item.id,
          name: item.name,
          children: item.children && item.children.slice(0,2),
          goods: item.goods
        }
      })
      list.push(brand)
      return list
    })

    // 得到弹出层的推荐商品数据
    const categoryId = ref(null)
    const currCategory = computed(() => {
      return menuList.value.find(item => item.id === categoryId.value)
    })

    //获取品牌数据
    findBrand().then(data => {
      brand.brands = data.result
    })

    return{ menuList,categoryId,currCategory }
  }
}
</script>

<style scoped lang='less'>
.home-category {
  width: 250px;
  height: 500px;
  background: rgba(0,0,0,0.8);
  position: relative;
  z-index: 99;
  .menu {
    li {
      padding-left: 40px;
      height: 50px;
      line-height: 50px;
      &:hover,&.active {
        background: @themeColor;
      }
      a {
        margin-right: 4px;
        color: #fff;
        &:first-child {
          font-size: 16px;
        }
      }
    }
  }
}
//弹层
 .layer {
    width: 990px;
    height: 500px;
    background: rgba(255,255,255,0.8);
    position: absolute;
    left: 250px;
    top: 0;
    display: none;
    padding: 0 15px;
    h4 {
      font-size: 20px;
      font-weight: normal;
      line-height: 80px;
      small {
        font-size: 16px;
        color: #666;
      }
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      li {
        width: 310px;
        height: 120px;
        margin-right: 15px;
        margin-bottom: 15px;
        border: 1px solid #eee;
        border-radius: 4px;
        background: #fff;
        &:nth-child(3n) {
          margin-right: 0;
        }
        a {
          display: flex;
          width: 100%;
          height: 100%;
          align-items: center;
          padding: 10px;
          &:hover {
            background: #e3f9f4;
          }
          img {
              width: 95px;
              height: 95px;
          }
          .info {
            padding-left: 10px;
            line-height: 24px;
		        width: 190px;
            .name {
              font-size: 16px;
              color: #666;
            }
            .desc {
              color: #999;
            }
            .price {
              font-size: 22px;
              color: @priceColor;
              i {
                font-size: 16px;
              }
            }
          }
        }
      }
      //品牌的样式
      li.brand {
        height: 180px;
        a {
          align-items: flex-start;
          img {
            width: 120px;
            height: 160px;
          }
          .info {
            p {
              margin-top: 8px;
            }
            .place {
              color: #999;
            }
          }
        }
      }
    }
  }
  &:hover {
    .layer {
      display: block;
    }
  }
//骨架的动画
.ecs-skeleton {
  animation: fade 1s linear infinite alternate;
}
@keyframes fade {
  from {
    opacity: 0.2;
  }
  to {
    opacity: 1;
  }
}
  
</style>