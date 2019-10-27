import Vue from 'vue'
import Buefy from 'buefy'
import VueLayers from 'vuelayers'
import 'vuelayers/lib/style.css' // needs css-loader

Vue.use(VueLayers)
import 'buefy/dist/buefy.css'

import App from './App.vue'
import router from './router'
import store from './store'

Vue.use(Buefy)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
