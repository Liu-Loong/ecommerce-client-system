//提供复用逻辑的函数（钩子）
import { useIntersectionObserver } from '@vueuse/core'
import { ref } from 'vue'
/**
 * 数据懒加载函数
 * @returns { Element } target - DOM对象
 * @returns { Function } apiFn - API函数
 */
export const useLazyData = (apiFn) => {
  const target = ref(null)
  const result = ref([])
  // stop 停止观察
  const { stop } = useIntersectionObserver(
    // 监听的目标元素target
    target,
    ([{ isIntersecting }], observerElement) => {
      // isIntersecting 是否进入可视区
      if(isIntersecting){
        stop()
        //调用API函数，获取数据
        apiFn().then(data => {
          result.value = data.result
        })
      }
    },
    //配置选项
    {
      //只要相交的比例大于0就触发
      threshold: 0
    }
  )
  return {target,result}
}