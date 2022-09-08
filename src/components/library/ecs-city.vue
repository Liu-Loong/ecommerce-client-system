<template>
  <div class="ecs-city" ref="target">
    <div class="select" @click="toggle()" :class="{active:active}">
      <span v-if="!fullLocation" class="placeholder">请选择配送地址</span>
      <span class="value">{{fullLocation}}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="option" v-show="active">
      <div v-if="loading" class="loading"></div>
      <template v-else>
        <span class="ellipsis" @click="changeItem(item)" v-for="item in currList" :key="item.code">{{item.name}}</span>
      </template>
    </div>
  </div>
</template>

<script>
import { computed, reactive, ref } from 'vue-demi'
import { onClickOutside } from '@vueuse/core'
import axios from 'axios'
export default {
  name: 'EcsCity',
  props:{
    fullLocation:{
      type: String,
      default: ''
    }
  },
  setup(props,{emit}) {
     // 控制展开收起,默认收起
    const active = ref(false)
    //所有地区数据
    const allCityData = ref([])
    //加载效果
    const loading = ref(false)
    const open = () => {
      active.value = true
      //获取城市地区数据
      loading.value = true
      getCityData().then(data => {
        allCityData.value = data
        loading.value = false
      })
      //清空之前选择
      for(const key in changeResult){
        changeResult[key] = ''
      }
    }
    const close = () => {
      active.value = false
    }
    // 切换展开收起
    const toggle = () => {
      active.value ? close() : open()
    }
    //点击其他位置进行隐藏
    const target = ref(null)
    onClickOutside(target,() => {
      close()
    })
    //实现计算属性：获取当前显示的地区数组
    const currList = computed(() => {
      //默认显示省份
      let currList = allCityData.value
      //获取市
      if(changeResult.provinceCode && changeResult.provinceName){
        currList = currList.find(p => p.code === changeResult.provinceCode).areaList
      }
      //获取区
      if(changeResult.cityCode && changeResult.cityName){
        currList = currList.find(c => c.code === changeResult.cityCode).areaList
      }

      return currList
    })

    // 定义选择的省市区
    const changeResult = reactive({
      provinceCode: '',
      provinceName: '',
      cityCode: '',
      cityName: '',
      countyCode: '',
      countyName: '',
      fullLocation: ''  
    })
    //当你点击按钮时进行记录
    const changeItem = (item) =>{
      if(item.level === 0){
        changeResult.provinceCode = item.code
        changeResult.provinceName = item.name
      }
      if(item.level === 1){
        changeResult.cityCode = item.code
        changeResult.cityName = item.name
      }
      if(item.level === 2){
        changeResult.countyCode = item.code
        changeResult.countyName = item.name
        //拼接完整路径
        changeResult.fullLocation = `${changeResult.provinceName} ${changeResult.cityName} ${changeResult.countyName}`
        close()
        emit('change',changeResult)
      }
    }
    return { active,toggle,target,loading,currList,changeItem }
  }
}

// 获取城市数据
const getCityData = () => {
  // 1. 数据在 https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json
  // 2. 何时获取？打开城市列表的时候，做个内存中缓存
  // 3. 怎么使用数据？定义计算属性，根据点击的省份城市展示
  //返回一个promise在then中获取数据,这里可能是异步操作也可能是同步操作
  return new Promise((resolve,reject) => {
    //数据存储在window.cityData字段上
    //有缓存
    if(window.cityData){
      resolve(window.cityData)
    }else{
      //无缓存
      const url = 'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json'
      axios.get(url).then(res => {
        //进行缓存
        window.cityData = res.data
        resolve(window.cityData)
      })
    }
  })

}
</script>
<style scoped lang="less">
.ecs-city {
  display: inline-block;
  position: relative;
  z-index: 400;  
  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }
    .loading {
      height: 290px;
      width: 100%;
      background: url(../../assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>