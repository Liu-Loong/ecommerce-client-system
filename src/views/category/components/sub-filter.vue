<template>
	<!-- 筛选区 -->
   <div class="sub-filter" v-if="filterData && !filterLoading">
     <div class="item">
       <div class="head">品牌：</div>
       <div class="body">
         <a @click="changeBrand(item.id)" :class="{active:item.id === filterData.selectBrand}" 
         href="javascript:;" v-for="item in filterData.brands" :key="item.id">{{item.name}}</a>
       </div>
     </div>
     <div class="item" v-for="item in filterData.saleProperties" :key="item.id">
       <div class="head">{{item.name}}</div>
       <div class="body">
         <a @click="changeProp(item,prop.id)" :class="{active:prop.id === item.selectedProp}" 
         href="javascript:;" v-for="prop in item.properties" :key="prop.id">{{prop.name}}</a>
       </div>
     </div>
   </div>
   <div v-else class="sub-filter">
    <EcsSkeleton class="item" width="800px" height="40px"  />
    <EcsSkeleton class="item" width="800px" height="40px"  />
    <EcsSkeleton class="item" width="600px" height="40px"  />
    <EcsSkeleton class="item" width="600px" height="40px"  />
    <EcsSkeleton class="item" width="600px" height="40px"  />
  </div>
</template>
<script>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { findSubCategoryFilter } from '@/api/category'
export default {
  name: 'SubFilter',
  setup(props,{emit}) {
    const route = useRoute()
    //监听二级类目ID的变化获取筛选数据（分类发生变化的时候需要重新获取筛选数据，需要使用侦听器）
    const filterData = ref(null)
    const filterLoading = ref(false)
    watch(() => route.params.id,(newValue) => {
      //变化后的ID有值且处在二级类目路由下（当你从二级分类去顶级分类也会拿到ID，不能去加载数据因为它不是二级分类的ID）
      if(newValue && `/category/sub/${newValue}` === route.path){
        filterLoading.value = true
        //发请求获取数据
        findSubCategoryFilter(route.params.id).then(data => {
          // 每一个可选的条件缺失 全部条件 给所有数据加上全部条件
          //给每一组数据加上一个选中的id
          //1.品牌全部
          data.result.selectBrand = null
          data.result.brands.unshift({id: null,name: '全部'})
          //2.属性全部
          data.result.saleProperties.forEach(item => {
            item.selectedProp = null
            item.properties.unshift({id: null,name: '全部'})
          })
          //设置修改的数据
          filterData.value = data.result
          filterLoading.value = false
        })
      }
    },{immediate:true})
    //获取筛选参数的函数
    const getFilterParams = () => {
      const filterParams = { brandId: null,attrs: []}
      //品牌数值
      filterParams.brandId = filterData.value.selectBrand
      //选中的属性
      filterData.value.saleProperties.forEach(item => {
        if(item.selectedProp){
          const prop = item.properties.find(prop => prop.id === item.selectedProp)
          filterParams.attrs.push({groupName: item.name,propertyName: prop.name})
        }
      })
      if(filterParams.attrs.length === 0)filterParams.attrs = null
      //参考数据：{brandId:'',attrs；[{groupName:'',propertyName:''},...]}
      return filterParams
    }
    //记录当前选择的品牌
    const changeBrand = (brandId) => {
      if(filterData.value.selectBrand === brandId)return
      filterData.value.selectBrand = brandId
      emit('filter-change',getFilterParams())
    }
    //记录你选中的属性
    const changeProp = (item,propId) => {
      if(item.selectedProp === propId)return
      item.selectedProp = propId
      emit('filter-change',getFilterParams())
    }
    return{ filterData,filterLoading,changeBrand,changeProp }
  }
}
</script>
<style scoped lang='less'>
  // 筛选区
  .sub-filter {
    background: #fff;
    padding: 25px;
    .item {
      display: flex;
      line-height: 40px;
      .head {
        width: 80px;
        color: #999;
      }
      .body {
        flex: 1;
        a {
          margin-right: 36px;
          transition: all .3s;
          display: inline-block;  
          &.active,
          &:hover {
            color: @themeColor;
          }
        }
      }
    }
    .ecs-skeleton {
      padding: 10px 0;
    }
  }
</style>