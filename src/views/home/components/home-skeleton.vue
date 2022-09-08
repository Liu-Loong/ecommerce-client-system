<template>
  <div class="home-skeletion">
    <div class="item" v-for="item in 4" :key="item" :style="{backgroundColor:bg}">
      <EcsSkeleton bg="#e4e4e4" width="306px" height="306px" animated />
      <EcsSkeleton bg="#e4e4e4" width="245px" height="24px" animated />
      <EcsSkeleton bg="#e4e4e4" width="120px" height="24px" animated />
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeSkeleton',
  props: {
    bg: {
      type: String,
      default: '#fff'
    }
  }
}
</script>

<style scoped lang='less'>
.home-skeletion {
  width: 1240px;
  height: 406px;
  display: flex;
  justify-content: space-between;
  .item {
    width: 306px;
    .ecs-skeleton ~ .ecs-skeleton{
      display: block;
      margin: 16px auto 0;
    }
  }
}
</style>