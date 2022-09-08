<template>
  <div class="goods-relevant">
    <div class="header">
      <i class="icon" />
      <span class="title">{{goodsId ? '同类商品推荐' : '猜你喜欢'}}</span>
    </div>
    <!-- 此处使用改造后的xtx-carousel.vue -->
    <EcsCarousel :sliders="sliders" style="height:380px"/>
  </div>
</template>

<script>
import { ref } from 'vue-demi'
import { findRelevantGoods } from '@/api/product'
export default {
  name: 'GoodsRelevant',
  props: {
    goodsId: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    // 得到需要的数据
    const sliders = ref([])
    findRelevantGoods({id: props.goodsId}).then(data => {
      //每页4条
      const pagesize = 4
      const pagetotal = Math.ceil(data.result.length / pagesize)
      for(let i=0;i<pagetotal;i++){
        sliders.value.push(data.result.slice(pagesize*i,pagesize*(i+1)))
      }
    }) 
    return { sliders }
  }
}
</script>

<style scoped lang='less'>
.goods-relevant {
  background: #fff;
  min-height: 460px;
  margin-top: 20px;
  .header {
    height: 80px;
    line-height: 80px;
    padding: 0 20px;
    .title {
      font-size: 20px;
      padding-left: 10px;
    }
    .icon {
      width: 16px;
      height: 16px;
      display: inline-block;
      border-top: 4px solid @themeColor;
      border-right: 4px solid @themeColor;
      box-sizing: border-box;
      position: relative;
      transform: rotate(45deg);
      &::before {
        content: "";
        width: 10px;
        height: 10px;
        position: absolute;
        left: 0;
        top: 2px;
        background: lighten(@themeColor, 40%);
      }
    }
  }
}
:deep(.ecs-carousel) {
  height: 380px;
  .carousel {
    &-indicator {
      bottom: 30px;
      span {
        &.active {
          background: @themeColor;
        }
      }
    }
    &-btn {
      top: 110px;
      opacity: 1;
      background: rgba(0,0,0,0);
      color: #ddd;
      i {
        font-size: 30px;
      }
    }
  }
}
</style>