<template>
  <LoginHeader>联合登录</LoginHeader>
  <section class="container" v-if="isBind">
    <div class="unbind">
      <div class="loading"></div>
    </div>
  </section>
  <section class="container" v-else>
    <nav class="tab">
      <a @click="hasAccount = true" :class="{ active: hasAccount }" href="javascript:;">
        <i class="iconfont icon-bind" />
        <span>已有账号，请绑定手机</span>
      </a>
      <a @click="hasAccount = false" :class="{ active: !hasAccount }" href="javascript:;">
        <i class="iconfont icon-edit" />
        <span>没有账号，请完善资料</span>
      </a>
    </nav>
    <div class="tab-content" v-if="hasAccount">
      <CallbackBind :unionId="unionId" />
    </div>
    <div class="tab-content" v-else>
      <CallbackPatch :unionId="unionId" />
    </div>
  </section>
  <LoginFooter />
</template>

<script>
import { ref } from 'vue'
import LoginHeader from './components/login-header'
import LoginFooter from './components/login-footer'
import CallbackBind from './components/callback-bind'
import CallbackPatch from './components/callback-patch'
import QC from 'qc'
import { userQQLogin } from '@/api/user'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Message from '@/components/library/Message'
export default {
  name: 'LoginCallback',
  components: { LoginHeader, LoginFooter, CallbackBind, CallbackPatch },
  setup() {
    const hasAccount = ref(true)

    //默认用户已经进行绑定
    //通过qq的API获取openId也就是后台接口需要的额unionId，然后进行登录
    //如果失败，则qq未和平台进行绑定(有账号未绑定qq/无账号未绑定qq)
    const isBind = ref(true)
    const store = useStore()
    const router = useRouter()
    const unionId = ref(null)
    //确认qq是否登录
    if (QC.Login.check()) {
      //获取qq唯一标识openId
      QC.Login.getMe((openId) => {
        unionId.value = openId
        //请求后台，进行qq登录
        userQQLogin(openId).then(data => {
          //登录成功,data.result为用户信息
          //存储用户信息
          const { id, account, avatar, moblie, nickname, token } = data.result
          store.commit('user/setUser', { id, account, avatar, moblie, nickname, token })
          //合并购物车
          store.dispatch('cart/mergeCart').then(() => {
            //跳转到来源页面或者首页
            router.push(store.state.user.redirectUrl)
            //登录成功消息提示
            Message({type: 'success',text: 'QQ登录成功'})
          })
        }).catch(e=>{
          //登录失败，qq没有和平台进行绑定
          isBind.value = false
        })
      })
    }


    return { hasAccount,isBind,unionId }
  }

}
</script>

<style scoped lang='less'>
.container {
  padding: 25px 0;
  position: relative;
  height: 730px;  
  .unbind {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 25px 0;
    z-index: 99;
    .loading {
      height: 100%;
      background: #fff url(../../assets/images/load.gif) no-repeat center / 100px 100px;
    }
  }
}
.tab {
  background: #fff;
  height: 80px;
  padding-top: 40px;
  font-size: 18px;
  text-align: center;
  a {
    color: #666;
    display: inline-block;
    width: 350px;
    line-height: 40px;
    border-bottom: 2px solid #e4e4e4;
    i {
      font-size: 22px;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
      margin-left: 4px;
    }
    &.active {
      color: @themeColor;
      border-color: @themeColor;
    }
  }
}
.tab-content {
  min-height: 600px;
  background: #fff;
}

</style>