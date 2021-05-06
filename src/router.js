import Vue from "vue"
import Router from "vue-router"

Vue.use(Router)
export default new Router({
    routes: [
        {
            path: "/",
            component: () => import('./components/InputPage.vue')
        },
        {
            path: "/tests",
            component: () => import('./components/Tests.vue')
        }

    ],
    mode: "history"
})