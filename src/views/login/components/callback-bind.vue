<template>
  <Form
    ref="formCom"
    :validation-schema="mySchema"
    autocomplete="off"
    v-slot="{ errors }"
    class="ecs-form"
  >
    <div class="user-info">
      <img :src="avatar" alt="" />
      <p>Hi,{{ nickname }} 欢迎,完成绑定后可以QQ账号一键登录哦~</p>
    </div>
    <div class="ecs-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field
          :class="{ err: errors.mobile }"
          v-model="form.mobile"
          name="mobile"
          class="input"
          type="text"
          placeholder="绑定的手机号"
        />
      </div>
      <div v-if="errors.mobile" class="error">
        <i class="iconfont icon-warning" />{{ errors.mobile }}
      </div>
    </div>

    <div class="ecs-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field
          :class="{ err: errors.code }"
          v-model="form.code"
          name="code"
          class="input"
          type="text"
          placeholder="短信验证码"
        />
        <span @click="send()" class="code">{{
          time === 0 ? "发送验证码" : `${time}秒后发送`
        }}</span>
      </div>
      <div v-if="errors.code" class="error">
        <i class="iconfont icon-warning" />{{ errors.code }}
      </div>
    </div>
    
    <a @click="submit()" href="javascript:;" class="submit">立即绑定</a>
  </Form>
</template>

<script>
import QC from 'qc'
import { reactive, ref, onUnmounted } from 'vue'
import { Form, Field } from 'vee-validate'
import schema from '@/utils/vee-validate-schema'
import { userQQBindCode, userQQBindLogin } from '@/api/user'
import { useIntervalFn } from '@vueuse/core'
import Message from '@/components/library/Message'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
  name: 'CallbackBind',
  components: { Form, Field },
  props: {
    unionId: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    // 1. 准备下信息：unionId(openId) qq头像 昵称
    // 2. 完成表单校验
    // 3. 发送验证吗（校验，定义api，调用，完成倒计时）
    // 4. 进行绑定（绑定成功就是登录成功）
    const nickname = ref('null')
    const avatar = ref('null')
    if (QC.Login.check()) {
      QC.api('get_user_info').success(res => {
        nickname.value = res.data.nickname
        avatar.value = res.data.figureurl_1
      })
    }

    //表单数据对象
    const form = reactive({
      mobile: null,
      code: null
    })
    //校验规则对象
    const mySchema = {
      mobile: schema.mobile,
      code: schema.code
    }

    //发送短信验证码
    // pause 暂停 resume 开始
    // useIntervalFn(回调函数,执行间隔,是否立即开启)
    const time = ref(0)
    const formCom = ref(null)
    const { resume, pause } = useIntervalFn(() => {
      time.value--
      if (time.value <= 0) {
        pause()
      }
    }, 1000, false)
    onUnmounted(() => {
      pause()
    })


    //发送验证码
    const send = async () => {
      const valied = mySchema.mobile(form.mobile)
      if (valied === true) {
        if (time.value === 0) {
          //成功通过
          await userQQBindCode(form.mobile)
          Message({ type: 'success', text: '发送成功' })
          time.value = 60
          resume()
        }
      } else {
        //失败,使用vee的错误函数显示错误的信息 setFieldError(字段名称，错误信息)
        formCom.value.setFieldError('mobile', valied)
      }
    }


    //立即绑定
    const store = useStore()
    const router = useRouter()
    const submit = async () => {
      const valid = formCom.value.validate()
      if (valid) {
        userQQBindLogin({
          unionId: props.unionId,
          ...form
        }).then(data => {
          //存储用户信息
          const { id, account, avatar, moblie, nickname, token } = data.result
          store.commit('user/setUser', { id, account, avatar, moblie, nickname, token })
          //合并购物车
          store.dispatch('cart/mergeCart').then(() => {
            //跳转到来源页面或者首页
            router.push(store.state.user.redirectUrl)
            //登录成功消息提示
            Message({ type: 'success', text: 'QQ绑定成功' })
          })
        }).catch(e => {
          Message({ type: 'error', text: '绑定失败' })
        })
      }
    }
    return { nickname, avatar, form, mySchema, send, time, formCom, submit }
  }
}
</script>

<style scoped lang='less'>
.user-info {
  width: 320px;
  height: 70px;
  margin: 0 auto;
  display: flex;
  background: #f2f2f2;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 25px;
  img {
    background: #f2f2f2;
    width: 50px;
    height: 50px;
  }
  p {
    padding-left: 10px;
  }
}
.code {
  position: absolute;
  right: 0;
  top: 0;
  line-height: 50px;
  width: 80px;
  color: #999;
  &:hover {
    cursor: pointer;
  }
}
</style>