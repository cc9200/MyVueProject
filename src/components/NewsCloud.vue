<template>
    <div id="root">
        <div id="head">
            <h1>中文互联网热搜词云</h1>
            <p id="updatetime">更新时间：{{lastUpdateTime}}</p>
        </div>

        <div v-for="(item,index) in newsList" :key= item.url class="drop"

             :style="{
             left:item.left,
             top:item.top,
             animationTimingFunction:item.AnimationTimingFunc,
            animationDelay:item.AnimationDelay,
            animationIterationCount:item.AnimationIterrationCount,
            animationDirection:item.AnimationDirection,
            animateDuration:item.AnimationDuration,
            // animationName:item.AnimationName,

             }">
            <a :href=item.url target="_blank" 
            @mouseover="hover($event,item.imgUrl)"
            @mouseleave="mouseLeave($event)"
            >{{item.title}}</a>
            <br>
        </div>

        <img src="" id='newsImg' alt="" >
        <el-button id="preButton" @click="swichButtonClick('pre')" type="primary" icon="el-icon-arrow-left">上一项</el-button>
        <el-button id="nextButton" @click="swichButtonClick('next')" type="primary" icon="el-icon-arrow-left">下一项</el-button>
    </div>
</template>

<script>
    import args from '../Arguments.js'

    export default {
        name: "NewsCloud",
        data() {
            return {
                lastUpdateTime: '',
                newsList: [],
                windowWidth:1920,
                windowHeight:1080,

            }
        },
        created() {
            this.windowHeight=document.body.clientHeight
            this.windowWidth=document.body.clientWidth
            this.reqNews()
        },
        methods: {
            hover:function(e,imgUrl){
                // console.log(e.x,e.y)
                let imgX=this.windowWidth/2-200
                let imgY=this.windowHeight/2-100
                if(e.x<this.windowWidth/2 && e.y<this.windowHeight/2-100){
                    imgX=this.windowWidth/2
                    imgY=0
                }else if(e.x<this.windowWidth/2 && e.y>this.windowHeight/2-100){
                    imgX=this.windowWidth/2
                    imgY=0
                }else if(e.x>this.windowWidth/2 && e.y>this.windowHeight/2-100){
                    imgX=0
                    imgY=0
                }
                else if(e.x>this.windowWidth/2 && e.y<this.windowHeight/2-100){
                    imgX=0
                    imgY=0
                }
                // console.log(e.currentTarget.parentElement.getElementsByTagName('img'))
                // document.getElementById('root').style.justifyContent='center'
                document.getElementById('newsImg').style.left=imgX.toString()+'px'
                document.getElementById('newsImg').style.top=imgY.toString()+'px'
                document.getElementById('newsImg').src=imgUrl
            },
            mouseLeave:function(e){
                    document.getElementById('newsImg').src=''
            },
            swichButtonClick:function(e){
               if(e=='next'){
                    this.$router.push('/chinaword')
                }else if(e=='pre'){
                    this.$router.push('/seasons')
                }
            },
            random_percent: function (range) {
                return parseInt(Math.random() * range).toString() + "%"
            },
            random_choice: function (array) {
                return array[Math.round(Math.random() * (array.length - 1))]
            },
            reqNews: function () {
                this.$axios.get(args['DjangoBaseUrl'] + args['reqForNewsUrl'], {}).then(res => {
                    // console.log(res)
                    this.lastUpdateTime = res.data['lastUpdateTime']
                    let AnimationTimingFuncArray = ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out']
                    let AnimationDelayArray = ['0s', '1s', '2s', '3s', '4s', '5s', '6s', '7s', '8s', '9s', '10s',]
                    let AnimationIterrationCountArray = [4, 5, 6, 7, 8, 9, 10, 11, 12]
                    let AnimationDirectionArray = ['normal', 'reverse', 'alternate', 'alternate-reverse']
                    let AnimationDurationArray = ['4s', '5s', '6s', '7s', '8s', '9s', '10s', '11s', '12s', '13s', '14s']
                    let AnimationNameArray = ['topToBottom']
                    res.data.newList.forEach((item, index) => {
                        //左边距随机
                        item['left'] = this.random_choice(['0%', '15%', '30%', '45%', '60%', '75', '90%'])
                        //顶部
                        // item['top'] = this.random_percent(30)
                        item['top'] = 0
                        //进入退出策略
                        // item['AnimationTimingFunc'] = this.random_choice(AnimationTimingFuncArray)
                        item['AnimationTimingFunc'] = 'linear'
                        // // 延迟
                        item['AnimationDelay'] = index.toString() + 's'
                        // // 次数
                        // item['AnimationIterrationCount'] = this.random_choice(AnimationIterrationCountArray)
                        item['AnimationIterrationCount'] = 99
                        // // 是否在下一周期逆向播放
                        // item['AnimationDirection'] = this.random_choice(AnimationDirectionArray)
                        // // 动画完成时间
                        // item['AnimationDuration'] = this.random_choice(AnimationDurationArray)
                        item['AnimationDuration'] = '40s'
                        // // 动画名称
                        // item['AnimationName'] = this.random_choice(AnimationNameArray)
                        this.newsList.push(item)
                    })

                })
            }

        }
    }
</script>

<style scoped>
    #root {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
    }

    #head  {
        position: absolute;
        left: 30px;
        top: 20px;
    }

    img#newsImg{
        position: absolute;
        max-width: 100%;
        max-height: 100%;
    }

    .drop  {
        position: fixed;
        width:500px;
        top: 10%;
        animation: topToBottom 20s;
        opacity: 0;
        overflow: inherit;

    }

    .drop:hover {
        opacity: 1;
        animation-play-state: paused;
    }

    #root > div > a:link {
        color: grey;
        text-decoration: none;
        /*text-shadow: 0px 3px grey;*/
    }

    #root > div > a:visited {
        color: blue;
        text-decoration: none;

        /*text-shadow: 0px 3px grey;*/
    }

    @keyframes topToBottom {
        0% {
            font-size: 1.2em;
            opacity: 0.9;
        }
        /*25% {*/
        /*font-size: 1.1em;*/
        /*top: 45%;*/
        /*opacity: 0.4;*/
        /*}*/
        /*50% {*/
        /*font-size: 1.2em;*/
        /*top: 60%;*/
        /*opacity: 0.6;*/
        /*}*/
        /*75% {*/
        /*font-size: 1.5em;*/
        /*top: 90%;*/
        /*opacity: 1;*/
        /*}*/
        100% {
            font-size: 1.2em;
            top: 95%;
            opacity: 1;
        }
    }

    @keyframes leftToRight {
        0% {
            font-size: 1em;
            left: 0;
            opacity: 0;

        }
        50% {
            font-size: 1.2em;
            left: 50%;
            opacity: 0.7;
        }
        100% {
            font-size: 1em;
            left: 100%;
            opacity: 1;
        }
    }
    #preButton{
        position:fixed;
        bottom:5%;
        left:-90px;
    }
    #nextButton{
        position:fixed;
        bottom:5%;
        right:-90px;
    }
    #preButton:hover{


        left:0;
    }
    #nextButton:hover{
        right:0px;
    }

    img.newsImg{
        display:none;
    }
    img.newsImg:hover{
       display: inline-block;
    }
</style>