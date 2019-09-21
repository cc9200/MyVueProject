<template>
    <div id="app">
        <router-view></router-view>

    </div>
</template>

<script>
    import FantasyLine from "./components/FantasyLine.vue";
    import ChinaWord from "./components/ChinaWord.vue";


    export default {
        name: "app",

        components: {
            FantasyLine,
        },
        // created() {
        //     console.log(123)
        //     this.$router.push('/123')
        // },
        methods: {
            routerToChinaWord: function () {
                console.log('router push')

            }
        }
    };
</script>

<style>

</style>
