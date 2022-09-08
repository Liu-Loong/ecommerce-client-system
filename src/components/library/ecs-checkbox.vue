<template>
  <div class="ecs-checkbox" @click="changeChecked()">
    <i v-if="checked" class="iconfont icon-checked"></i>
    <i v-else class="iconfont icon-unchecked"></i>
    <span v-if="$slots.default"><slot/></span>
  </div>
</template>
<script>
import { useVModel } from '@vueuse/core'
//v-model ===> :modelValue + @update:modelValue
export default {
  name: 'EcsCheckbox',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  setup(props,{emit}) {
    //使用useVModel实现双向数据绑定
    //1.使用props接收modelValue
    //2.使用useVModel来包装props中的modelValue属性数据
    //3.在使用checked.value时就是使用父组件数据
    //4.在使用checked.value = ‘数据’ 赋值时，触发emit('update:modelValue','数据')
    const checked = useVModel(props,'modelValue',emit)
    const changeChecked = () => {
      //改值且通知父组件
      const newValue = !checked.value
      checked.value = newValue
      //让组件支持change事件
      emit('change',newValue)
    }
    return { checked,changeChecked }
  }
  
}
</script>
<style scoped lang="less">
.ecs-checkbox {
  display: inline-block;
  margin-right: 2px;
  .icon-checked {
    color: @themeColor;
    ~ span {
      color: @themeColor;
    }
  }
  i {
    position: relative;
    top: 1px;
  }
  span {
    margin-left: 2px;
  }
}
</style>