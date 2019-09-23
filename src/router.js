import FantasyLine from "./components/FantasyLine.vue";
import ChinaWord from "./components/ChinaWord.vue";
import seasons from "./components/seasons.vue";
import VueRouter from 'vue-router'

const router = new VueRouter({
    mode: 'history',
    routes: [

        {
            path: '/',
            component: FantasyLine,

        },
        {
            path: '/chinaword',
            component: ChinaWord
        },
        {
            path: '/seasons',
            component: seasons
        },
    ]
})
export default router