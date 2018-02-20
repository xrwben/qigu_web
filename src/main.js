import Vue from 'vue'
import App from './App'
import router from './router'
import axios from './utils/http.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import toFormData from './utils/toFormData.js'
import * as filters from './utils/filters'
Vue.use(ElementUI)
Vue.prototype.axios = axios
Vue.prototype.toFormData = toFormData
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
