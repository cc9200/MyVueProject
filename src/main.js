import Vue from "vue";
import App from "./App.vue";
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueRouter from 'vue-router'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)
Vue.use(VueRouter)
Vue.use(ElementUI)
Vue.prototype.$axios = axios;


import router from './router.js'

Vue.config.productionTip = false;


//跳转修改title
router.beforeEach((to, from, next) => {
        if (to.meta.title) {
            document.title = to.meta.title
        }
        next()
    }
)


new Vue({
    router,
    render: h => h(App)
}).$mount("#app");
