import { checkAllCart, deleteCart, findCartList, getNewCartGoods, insertCart, mergeLocalCart, updateCart } from "@/api/cart"
import { promiseTimeout } from "@vueuse/core"


// 购物车模块
export default {
  namespaced: true,
  state() {
    return {
      // 购物车商品列表
      list: []
    }
  },
  getters: {
    //有效商品列表 :库存stock>0，商品有效标识isEffective为true
    validList(state) {
      return state.list.filter(goods => goods.stock > 0 && goods.isEffective)
    },
    //有效商品总件数
    validTotal(state, getters) {
      return getters.validList.reduce((p, c) => p + c.count, 0)
    },
    //有效商品总金额
    validAmount(state, getters) {
      return getters.validList.reduce((p, c) => p + c.count * Math.round(100 * c.nowPrice), 0) / 100
    },
    //无效商品列表
    invalidList(state){
      return state.list.filter(goods => goods.stock <= 0 || !goods.isEffective)
    },
    //已选择商品列表
    selectedList(state,getters){
      return getters.validList.filter(item => item.selected === true)
    },
    //已选商品总件数
    selectedTotal(state,getters){
      return getters.selectedList.reduce((p, c) => p + c.count, 0)
    },
    //已选商品总金额
    selectedAmount(state, getters) {
      return getters.selectedList.reduce((p, c) => p + c.count * Math.round(100 * c.nowPrice), 0) / 100
    },
    //是否全选
    isCheckAll(state,getters){
      return getters.validList.length !== 0 && getters.selectedList.length === getters.validList.length
    }
  },
  mutations: {
    //设置购物车列表
    setCartList(state,payload){
      state.list = payload
    },
    //插入购物车商品
    insertCart(state, payload) {
      //查找是否有相同商品，相同则增加商品数量
      const sameIndex = state.list.findIndex(goods => goods.skuId === payload.skuId)
      if (sameIndex >= 0) {
        const count = state.list[sameIndex].count
        payload.count += count
        //删除原有商品
        state.list.splice(sameIndex, 1)
      }
      //追加新的商品
      state.list.unshift(payload)
    },
    //修改购物车商品
    updateCart(state,goods){
      //goods 商品信息：nowPrice stock isEffective
      // goods中字段有可能不完整，goods有的信息才去修改
      // 1. goods中必需有skuId，才能找到对应的商品信息
      const updateGoods = state.list.find(item => item.skuId === goods.skuId)
      for (const key in goods) {
        if (goods[key] !== undefined && goods[key] !== null && goods[key] !== '') {
          updateGoods[key] = goods[key]
        }
      }
    },
    //删除购物车商品
    deleteCart(state,skuId){
      const index = state.list.findIndex(item => item.skuId === skuId)
      state.list.splice(index,1)
    }
    

  },
  actions: {

    //合并本地购物车
    async mergeCart(ecs){
      // 存储token后调用合并API接口函数进行购物合并
      const cartList = ecs.state.list.map(goods => {
        return{
          skuId:goods.skuId,
          selected:goods.selected,
          count:goods.count
        }
      })
      await mergeLocalCart(cartList)
      //合并本地购物车成功并将本地购物车删除
      ecs.commit('setCartList',[])
    },

    //加入购物车
    insertCart(ecs, payload) {
      return new Promise((resolve) => {
        if (ecs.rootState.user.profile.token) {
          //已登录
          const {skuId,count} = payload
          //调用insertCart接口后重新拉去一遍服务端的购物车数据
          insertCart({skuId,count}).then(data => {
            return findCartList()
          }).then(data => {
            //将服务端的数据重写入购物车数据
            ecs.commit('setCartList',data.result)
            resolve()
          })
        } else {
          //未登录
          ecs.commit('insertCart', payload)
          resolve()
        }
      })
    },

    //获取购物车商品列表
    findCartList(ecs){
      return new Promise((resolve)=> {
        if (ecs.rootState.user.profile.token) {
          //已登录
          findCartList().then(data => {
            ecs.commit('setCartList',data.result)
            resolve()
          })
        }else{
          //未登录,本地
          //Promise.all() 可以并列发送多个请求，等所有请求成功，调用then
          //Promise.race() 可以并列发送多个请求，等最快的请求成功，调用then
          const promiseArr = ecs.state.list.map(goods => {
            return getNewCartGoods(goods.skuId)
          })
          Promise.all(promiseArr).then(dataList => {
            //更新本地购物车
            dataList.forEach((data,index) => {
              ecs.commit('updateCart',{skuId:ecs.state.list[index].skuId,...data.result})
            })
            resolve()
          })
        }
      })
    },

    //删除购物车商品
    deleteCart(ecs,payload){
      return new Promise((resolve) => {
        if (ecs.rootState.user.profile.token) {
          //已登录
          deleteCart([payload]).then(()=>{
            return findCartList()
          }).then((data) => {
            ecs.commit('setCartList',data.result)
            resolve()
          })
        } else {
          //未登录
          ecs.commit('deleteCart', payload)
          resolve()
        }
      })
    },
    
    //批量删除选中商品，清空失效商品列表
    batchDeleteCart(ecs,isClear){
      return new Promise((resolve) => {
        if (ecs.rootState.user.profile.token) {
          //已登录
          const ids = ecs.getters[isClear ? 'invalidList' : 'selectedList'].map(item => item.skuId)
          deleteCart(ids).then(()=> {
            return findCartList()
          }).then(data => {
            ecs.commit('setCartList',data.result)
            resolve()
          })
        } else {
          //未登录
          //1.获取有效的商品列表，遍历的去调用修改mutations即可
          //2.isClear 为true时为清空失效商品列表，否则为批量删除选中商品列表
          ecs.getters[isClear ? 'invalidList' : 'selectedList'].forEach(item => {
            ecs.commit('deleteCart',item.skuId)
          })
          resolve()
        }
      })
    },

    //修改购物车(选中状态，数量)
    updateCart(ecs,payload){
      //payload 需要有skuId 可能有selected,count
      return new Promise((resolve) => {
        if (ecs.rootState.user.profile.token) {
          //已登录
          updateCart(payload).then(()=>{
            return findCartList()
          }).then(data => {
            ecs.commit('setCartList',data.result)
            resolve()
          })
        } else {
          //未登录
          ecs.commit('updateCart', payload)
          resolve()
        }
      })
    },

    //全选&反选
    checkAllCart(ecs,selected){
      return new Promise((resolve) => {
        if (ecs.rootState.user.profile.token) {
          //已登录
          const ids = ecs.getters.validList.map(item => item.skuId)
          checkAllCart({ids,selected}).then(()=>{
            return findCartList()
          }).then(data => {
            ecs.commit('setCartList',data.result)
            resolve()
          })
        } else {
          //未登录
          //1.获取有效的商品列表，遍历的去调用修改mutations即可
          ecs.getters.validList.forEach(item => {
            ecs.commit('updateCart',{skuId:item.skuId,selected})
          })
          resolve()
        }
      })
    },
    
    //修改sku规格函数
    updateCartSku(ecs,{oldSkuId,newSku}){
      return new Promise((resolve) => {
        if (ecs.rootState.user.profile.token) {
          //已登录
          //1.获取原先商品的数量
          //2.删除原先商品
          //3.获取修改的skuId 和 原先商品数量 做一个加入购物车操作
          //4.更新列表
          const oldGoods = ecs.state.list.find(item => item.skuId === oldSkuId)
          deleteCart([oldSkuId]).then(()=>{
            return insertCart({skuId:newSku.skuId,count:oldGoods.count})
          }).then(()=>{
            return findCartList()
          }).then(data => {
            ecs.commit('setCartList',data.result)
            resolve()
          })
        } else {
          //未登录
          //当你修改了sku的时候其实skuId需要更改，相当于把原来的信息移出，创建一条新的商品信息。
          //1.获取旧的商品信息
          const oldGoods = ecs.state.list.find(item => item.skuId === oldSkuId)
          //2.删除旧的商品
          ecs.commit('deleteCart',oldSkuId)
          //3.合并一条新的商品信息
          const {skuId,price:nowPrice,inventory:stock,specsText:attrsText} = newSku
          const newGoods = {...oldGoods,skuId,nowPrice,stock,attrsText}
          //4.插入新的信息
          ecs.commit('insertCart',newGoods)
          resolve()
        }
      })
    }
  }
}
