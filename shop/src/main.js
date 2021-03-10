import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/global.css'
import './assets/fonts/iconfont.css'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/' // 设置请求根路径
Vue.config.productionTip = false

axios.interceptors.request.use(config => // 配置axios拦截器
{
  config.headers.Authorization = window.sessionStorage.getItem('token') // 给各请求头携带token
  return config
})

new Vue({
  axios: Vue.prototype.$http = axios, // 挂载
  router,
  render: h => h(App)
}).$mount('#app')
