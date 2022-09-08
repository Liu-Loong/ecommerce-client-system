import { userCheckAccount } from "@/api/user"

// 定义校验规则提供给vee-validate组件使用
export default {
  /**
   * value是将来使用该规则的表单元素的值
     1.必填
     3.校验函数规则：true为校验成功，字符串为失败，（错误提示
   */
  //）

  //校验account
  account(value){
    if(!value) return '请输入用户名'
    //6-20个字符，需要以字母开头
    if(!/^[a-zA-Z]\w{5,19}$/.test(value)) return '字母开头且6-20个字符'
    return true
  },
  //用户校验且校验其唯一性
  async accountApi(value) {
    if(!value) return '请输入用户名'
    //6-20个字符，需要以字母开头
    if(!/^[a-zA-Z]\w{5,19}$/.test(value)) return '字母开头且6-20个字符'
    //服务器端校验
    const data = await userCheckAccount(value)
    if(data.result.valid) return '用户名已存在'
    return true
  },
  //密码校验
  password(value){
    if(!value) return '请输入密码'
    //6-24个字符
    if(!/^\w{6,24}$/.test(value))return'密码为6-24个字符'
    return true
  },
  //确认密码校验
  rePassword(value,{form}){
    if(!value) return '请输入密码'
    //6-24个字符
    if(!/^\w{6,24}$/.test(value))return'密码为6-24个字符'
    //form为表单数据对象
    if(value !== form.password) return '两次输入的密码不一致'
    return true
  },
  //手机号校验
  mobile(value){
    if(!value) return '请输入手机号'
    //1开头 3-9之间  9个字符
    if(!/^1[3-9]\d{9}$/.test(value))return'手机号格式错误'
    return true
  },
  //验证码校验
  code(value){
    if(!value) return '请输入验证码'
    //6个数字
    if(!/^\d{6}$/.test(value))return'验证码是6个数字'
    return true
  },
  //是否勾选校验
  isAgree (value) {
    if (!value) return '请勾选同意用户协议'
    return true
  }
}