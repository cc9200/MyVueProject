import FantasyLine from "./components/FantasyLine.vue";
import ChinaWord from "./components/ChinaWord.vue";
import seasons from "./components/seasons.vue";
import NewsCloud from "./components/NewsCloud.vue";
import VueRouter from 'vue-router'

const router = new VueRouter({
    mode: 'history',
    routes: [

        // {
        //     path: '/',
        //     component: FantasyLine,
        //
        // },
        {
            path: '/',
            component: NewsCloud,
            meta:{title:'中文互联网热搜词云'}

        },
        {
            path: '/chinaword',
            component: ChinaWord,
            meta:{title:'成语接龙'}
        },
        {
            path: '/seasons',
            component: seasons,
            meta:{title:'Sound Of Seasons'}
        },
    ]
})
export default router