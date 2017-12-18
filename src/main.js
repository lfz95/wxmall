// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import App from './App'
import router from './router'
require('./assets/css/reset.css')
// 引入toast，插件化使用
import  LoadingPlugin   from 'vux/src/plugins/loading'
import   ToastPlugin  from 'vux/src/plugins/toast'
import   AlertPlugin from 'vux/src/plugins/alert'
//引入微信jssdk
// import  WechatPlugin  from 'vux/src/plugins/wechat'

// js复制到剪切板插件
import VueClipboards from 'vue-clipboards';
Vue.use(VueClipboards)
// Vue.use(WechatPlugin)
Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)
Vue.use(AlertPlugin)
Vue.use(VueRouter)

// const router = new VueRouter({
//   routes
// })

// FastClick.attach(document.body)

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  template: '<App/>',
  router,
  components: { App }
}).$mount('#app-box')
