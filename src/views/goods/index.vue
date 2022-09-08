<template>
  <div class='ecs-goods-page' v-if="goods">
    <div class="container">
      <!-- 面包屑 -->
      <EcsBread>
        <EcsBreadItem to="/">首页</EcsBreadItem>
        <EcsBreadItem :to="`/category/${goods.categories[1].id}`">{{goods.categories[1].name}}</EcsBreadItem>
        <EcsBreadItem :to="`/category/sub/${goods.categories[0].id}`">{{goods.categories[0].name}}</EcsBreadItem>
        <EcsBreadItem >{{goods.name}}</EcsBreadItem>
      </EcsBread>
      <!-- 商品信息 -->
      <div class="goods-info">
        <div class="media">
          <GoodsImage :images="goods.mainPictures"/>
          <GoodsSales />
        </div>
        <div class="spec">
          <GoodsName :goods="goods" />
          <!-- sku组件 -->
          <GoodsSku :goods="goods"  skuId="" @change="changeSku"/>
          <!-- 数量选择组件 -->
          <EcsNumbox label="数量" v-model="num" :max="goods.inventory"/>
          <!-- 按钮组件 -->
          <EcsButton @click="insertCart()" type="primary" size="large" style="margin-top:20px">加入购物车</EcsButton>
        </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevant />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <GoodsTabs />
          <!-- 注意事项 -->
          <div class="goods-warn">
            <GoodsWarn />
          </div>
        </div>
        <!-- 24热榜+周热搜榜 -->
        <div class="goods-aside">
          <GoodsHot :type="1"/>
          <GoodsHot :type="2"/>
          <GoodsHot :type="3"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { nextTick, provide, ref, watch } from 'vue'
import { findGoods } from '@/api/product'
import { useRoute } from 'vue-router'
import GoodsRelevant from './components/goods-relevant.vue'
import GoodsImage from './components/goods-image.vue'
import GoodsSales from './components/goods-sales.vue'
import GoodsName from './components/goods-name.vue'
import GoodsSku from './components/goods-sku.vue'
import GoodsTabs from './components/goods-tabs.vue'
import GoodsHot from './components/goods-hot.vue'
import GoodsWarn from './components/goods-warn.vue'
import { useStore } from 'vuex'
import Message from '@/components/library/Message'
export default {
  name: 'GoodsPage',
  components: { GoodsRelevant,GoodsImage,GoodsSales,GoodsName,GoodsSku,GoodsTabs,GoodsHot,GoodsWarn },
  setup() {
    //1.获取商品详情，进行渲染
    const goods = useGoods()
    //sku改变时候触发
    const changeSku = (sku) => {
      //修改商品的信息（库存，现价，原价等）
      if(sku.skuId){
        goods.value.price = sku.price
        goods.value.oldPrice = sku.oldPrice
        goods.value.inventory = sku.inventory
      }
      //记录选择后的sku
      currentSku.value = sku
    }
    //选择的数量
    const num = ref(1)
    //提供goods数据给子孙组件使用
    provide('goods',goods)

    //加入购物车
    const store = useStore()
    const currentSku = ref(null)
    const insertCart = () => {
      //约定加入购物车字段必须和后端保持一致
      if (currentSku.value && currentSku.value.skuId) {
        const {skuId,specsText:attrsText,inventory:stock} = currentSku.value
        const {id,name,price,mainPictures} = goods.value
        store.dispatch('cart/insertCart',{
          skuId,
          attrsText,
          stock,
          id,
          name,
          price,
          nowPrice:price,
          picture:mainPictures[0],
          selected:true,
          isEffective:true,
          count:num.value
        }).then(()=>{
          Message({type: 'success' ,text:'加入购物车成功'})
        }).catch((err)=>{
          Message({type: err ,text:'加入购物车失败'})
        })
      }else{
        Message({text:'请选择完整的规格'})
      }
    }

    return { goods,changeSku,num,insertCart }
  }
}
//获取商品详情方法
const useGoods = () => {
  //出现路由地址的的商品id发生变化但是不会初始化组件
  const goods = ref(null)
  const route = useRoute()
  watch(() => route.params.id ,(newValue) => {
    if(newValue && `/product/${newValue}` === route.path){
      findGoods(route.params.id).then(data => {
        // 让商品数据为null让后使用v-if的组件可以重新销毁和创建
        goods.value = null
        nextTick(() => {
          goods.value = data.result
        })
      })
    }
  },{immediate:true})
  
  return goods
}
</script>

<style scoped lang='less'>
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}
.goods-tabs {
  min-height: 600px;
  background: #fff;
}
.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}

</style>