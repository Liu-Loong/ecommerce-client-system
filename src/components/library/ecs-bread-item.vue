<template>
  <div class="ecs-bread-item">
    <router-link v-if="to" :to="to"><slot /></router-link>
    <span v-else><slot /></span>
  </div>
</template>
<script>
export default {
  name: 'EcsBreadItem',
  props: {
    to: {
      type: [String, Object],
      default: ''
    }
  }
}
</script>
<style  lang="less">

</style>