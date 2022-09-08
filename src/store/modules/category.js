// 分类模块
import { topCategory } from '@/api/constants'
import { findAllCategory } from '@/api/category'
export default {
  namespaced: true,
  state () {
    return {
      // 分类信息
      list: topCategory.map(item => ({name: item}))
    }
  },
  //加载数据成功后需要修改list所以需要mutations函数
  mutations:{
    // payload 所有的分类集合
    setList (state,payload) {
      state.list = payload
    },
    //定义show和hide函数，控制当前分类的二级分类显示和隐藏
    show(state, id){
      const currCategory = state.list.find(item => item.id === id)
      currCategory.open  = true
    },
    hide(state, id){
      const currCategory = state.list.find(item => item.id === id)
      currCategory.open  = false
    }
  },
  // 需要向后台加载数据，所以需要actions函数获取数据
  actions:{
    async getList ({ commit }) {
      //获取分类数据
      const data = await findAllCategory()
      //给一级分类加上控制二级分类显示/隐藏的数据
      data.result.forEach(item => {
        item.open = false
      })
      //修改分类数据
      commit('setList', data.result)
    }
  }
}
