<template>
  <div class="ecs-pagination" v-if="total > 0">
    <a
      @click="changePage(myCurrentPage - 1)"
      v-if="myCurrentPage > 1"
      href="javascript:;"
      >上一页</a
    >
    <a v-else href="javascript:;" class="disabled">上一页</a>
    <span v-if="pager.start > 1">...</span>
    <a
      @click="changePage((myCurrentPage = item))"
      v-for="item in pager.btnArr"
      :key="item"
      :class="{ active: item === myCurrentPage }"
      href="javascript:;"
      >{{ item }}</a
    >
    <span v-if="pager.end < pager.pageCount">...</span>
    <a
      @click="changePage(myCurrentPage + 1)"
      v-if="myCurrentPage < pager.pageCount"
      href="javascript:;"
      >下一页</a
    >
    <a v-else href="javascript:;" class="disabled">下一页</a>
  </div>
</template>
<script>
import { computed, ref, watch } from 'vue-demi'
export default {
  name: 'EcsPagination',
  props: {
    total: {
      type: Number,
      default: 100
    },
    currentPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    }
  },
  setup(props, { emit }) {
    //按钮的个数,设置为动态的需要响应式数据
    const btnCount = 5
    //当前显示的页码
    const myCurrentPage = ref(7)
    //总条数
    const myTotal = ref(100)
    //每页多少条
    const myPageSize = ref(10)

    // 重点：根据上述数据得到（总页数，起始页码，结束页码，按钮数组）
    const pager = computed(() => {
      //总页数
      const pageCount = Math.ceil(myTotal.value / myPageSize.value)
      // 计算起始页码和结束页码
      // 1. 理想情况根据当前页码，和按钮个数可得到
      let start = myCurrentPage.value - Math.floor(btnCount / 2)
      let end = start + btnCount - 1
      // 2.1 如果起始页码小于1了，需要重新计算
      if (start < 1) {
        start = 1
        end = (start + btnCount - 1) > pageCount ? pageCount : (start + btnCount - 1)
      }
      // 2.2 如果结束页码大于总页数，需要重新计算
      if (end > pageCount) {
        end = pageCount
        start = (end - btnCount + 1) < 1 ? 1 : (end - btnCount + 1)
      }
      // 处理完毕start和end得到按钮数组
      const btnArr = []
      for (let i = start; i <= end; i++) {
        btnArr.push(i)
      }
      return { pageCount, start, end, btnArr }
    })

    // 监听传入的值改变
    watch(props, () => {
      myTotal.value = props.total
      myCurrentPage.value = props.currentPage
      myPageSize.value = props.pageSize
    }, { immediate: true })

    // 改变页码
    const changePage = (newPage) => {
      myCurrentPage.value = newPage
      // 通知父组件最新页码
      emit('currentChange', newPage)

    }

    return { myCurrentPage, pager, changePage }
  }
}
</script>
<style scoped lang="less">
.ecs-pagination {
  display: flex;
  justify-content: center;
  padding: 30px;
  > a {
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    margin-right: 10px;
    &:hover {
      color: @themeColor;
    }
    &.active {
      background: @themeColor;
      color: #fff;
      border-color: @themeColor;
    }
    &.disabled {
      cursor: not-allowed;
      opacity: 0.4;
      &:hover {
        color: #333;
      }
    }
  }
  > span {
    margin-right: 10px;
  }
}
</style>