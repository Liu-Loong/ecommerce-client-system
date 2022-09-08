// 获取商品相关的API函数


import request from "@/utils/request";

/**
 * 获取商品详情
 * @param {String} id -商品id 
 */
export const findGoods = (id) => {
  return request('/goods', 'get', { id })
}

/**
 * 获取商品同类推荐-未传入ID为猜喜欢
 * @param {String} id - 商品id
 * @param {Number} limit - 获取条数
 */
export const findRelevantGoods = ({ id, limit = 16 }) => {
  return request('/goods/relevant', 'get', { id, limit })
}

/**
 * 获取热榜商品
 * @param {Number} type - 1代表24小时热销榜 2代表周热销榜 3代表总热销榜
 * @param {Number} limit - 获取个数
 */
export const findGoodsHot = ({ id, limit = 3, type = 1 }) => {
  return request('/goods/hot', 'get', { id, limit, type })
}

/**
 * 获取商品的评价统计信息
 * @param {String} id - 商品id
 */
export const findGoodsCommentInfo = (id) => {
  // return request(`/goods/${id}/evaluate`)
  return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate`,'get')
}

/**
 * 获取商品的评价统计信息
 * @param {String} id - 商品id
 * @param {Object} params 
 * @returns
 */
 export const findGoodsCommentList = (id,params) => {
  return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate/page`,'get',params)
}