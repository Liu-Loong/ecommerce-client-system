<template>
  <div class="sub-category">
    <div class="container">
      <!-- 面包屑 -->
      <SubBread />
      <!-- 筛选区 -->
      <SubFilter @filter-change="filterChange"/>
      <!-- 商品面板（排序+列表组件） -->
      <div class="goods-list">
        <!-- 排序 -->
        <SubSort @sort-change="sortChange"/>
        <!-- 列表 -->
        <ul>
          <li v-for="item in goodsList" :key="item.id" >
            <GoodsItem :goods="item" />
          </li>
        </ul>
        <!-- 无限加载组件 -->
        <EcsInfiniteLoading @infinite="getData" :loading="loading" :finished="finished"/>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import SubBread from './components/sub-bread.vue'
import SubFilter from './components/sub-filter.vue'
import SubSort from './components/sub-sort.vue'
import GoodsItem from './components/goods-item.vue'
import { findSubCategoryGoods } from '@/api/category'
import { useRoute } from 'vue-router'
export default {
  name:'SubCategory',
  setup(props) {
    const route = useRoute()
    //加载中
    const loading = ref(false)
    //是否加载完毕
    const finished = ref(false)
    //商品列表数据
    const goodsList = ref([])
    //请求参数
    let reqParams = {
      page: 1,
      pageSize: 20
    }
    //获取数据
    const getData = () => {
      loading.value = true
      //设置二级分类ID
      reqParams.categoryId = route.params.id
      findSubCategoryGoods(reqParams).then(data => {
        //获取数据成功
        if(data.result.items.length){
          goodsList.value.push(...data.result.items)
          //将页码Page++
          reqParams.page++
        }else{
          //没有数据时,加载完成
          finished.value = true
        }
        //请求结束
        loading.value = false
      })
    }
    // 切换二级分类重新加载
    watch(() => route.params.id,(newValue) => {
      if(newValue && `/category/sub/${newValue}` === route.path){
        finished.value = false
        goodsList.value = [] //导致列表为空，加载更多组件上移进入可视区，去加载数据
        reqParams = {
          page: 1,
          pageSize: 20
        }
      }
    })
    //1.更改排序组件的筛选数据，重新请求
    const sortChange = (sortParams) => {
      finished.value = false
      //合并请求参数，需要保留之前的参数
      reqParams = {...reqParams,...sortParams}
      reqParams.page = 1
      goodsList.value = []
    }
    //2.更改筛选组件的筛选数据，查询请求
    const filterChange = (filterParams) => {
      finished.value = false
      //合并请求参数，需要保留之前的参数
      reqParams = {...reqParams,...filterParams}
      reqParams.page = 1
      goodsList.value = []
    }
    return { getData,loading,finished,goodsList,sortChange,filterChange }
  },
  components: { SubBread,SubFilter,SubSort,GoodsItem }
}
</script>

<style scoped lang="less">
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;
    li {
      margin-right: 20px;
      margin-bottom: 20px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>