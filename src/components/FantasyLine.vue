<template>
    <div id="FantasyLine">
        <el-container>
            <el-header><h2>这是一个在线画画的页面</h2></el-header>
            <el-main>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <div class="grid-content bg-purple">
                            <div class="block">
                                <el-color-picker v-model="color1" @change="colorChange"></el-color-picker>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="16">
                        <div class="grid-content bg-purple">
                            <p>X:{{x}} Y:{{y}}</p>
                            <canvas id="canvas"
                                    width="500"
                                    height="500"
                                    @mousedown="canvasDown($event)"
                                    @mousemove="canvasMove($event)"
                                    @mouseup="canvasUp($event)"
                                    @mouseleave="canvasLeave($event)"
                                    ref="canvas"
                            ></canvas>
                        </div>
                    </el-col>

                </el-row>

            </el-main>
            <el-footer>
                <el-row :gutter="20">
                    <el-col :span="4">
                        <div class="grid-content bg-purple">
                            <el-button type="primary" icon="el-icon-arrow-left">上一页</el-button>
                        </div>
                    </el-col>
                    <el-col :span="16">
                        <div class="grid-content bg-purple"><p></p></div>
                    </el-col>
                    <el-col :span="4">
                        <div class="grid-content bg-purple">
                            <el-button type="primary" @click="nextProject">下一项<i class="el-icon-arrow-right el-icon--right"></i></el-button>
                        </div>
                    </el-col>
                </el-row>


            </el-footer>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "FantasyLine",
        data: function () {
            return {
                x: 0,
                y: 0,
                main_color: 0,
                canvasMouseDown: false,
                canvas: '',
                context: '',
                color1: '#FFFFFF'
            }


        },
        mounted() {
            this.show();
        },
        methods: {
            huaxian: function () {
                this.context.moveTo(0, 0)
                this.context.lineTo(500, 500)
                this.context.stroke();
            },
            colorClip: function (num) {
                if (num > 255) {
                    return 255
                }
                if (num < 0) {
                    return 0
                }
                return num
            },
            preFixInt:function(num){
                if(num<16){
                    return '0'+num.toString(16)
                }else{
                    return num.toString(16)
                }
            },
            randomColor: function (hexColor, randomRange) {
                hexColor = hexColor.substring(1,)
                let r = this.colorClip(parseInt(hexColor.substring(0, 2), 16) + parseInt((Math.random() - 0.5) * randomRange))
                let g = this.colorClip(parseInt(hexColor.substring(2, 4), 16) + parseInt((Math.random() - 0.5) * randomRange))
                let b = this.colorClip(parseInt(hexColor.substring(4,), 16) + parseInt((Math.random() - 0.5) * randomRange))
                return '#' + this.preFixInt(r) + this.preFixInt(g) + this.preFixInt(b)
            },
            colorChange: function () {
                this.context.strokeStyle = this.color1
                //console.log(this.color1)

            },
            show: function () {
                this.canvas = this.$refs.canvas;//指定canvas
                this.context = this.canvas.getContext("2d");//设置2D渲染区域

                this.context.strokeStyle = this.color1
            },
            canvasDown: function (event) {
                this.canvasMouseDown = true;
                this.context.beginPath()
                this.context.moveTo(event.offsetX, event.offsetY)
                this.x = event.offsetX
                this.y = event.offsetY
                // console.log('鼠标按下')


            },
            canvasUp: function (event) {
                this.canvasMouseDown = false;




            },
            canvasMove: function (event) {
                if (this.canvasMouseDown) {
                    this.context.lineTo(event.offsetX, event.offsetY)
                    //渐变线距离范围
                    let gradient = this.context.createLinearGradient(this.x, this.y, event.offsetX, event.offsetY)
                    //渐变线颜色范围

                    let endColor = this.randomColor(this.color1, 200)
                    gradient.addColorStop(0, this.color1)
                    gradient.addColorStop(1, endColor)
                    //设置线的宽度
                    this.context.lineWidth = parseInt(Math.random() * 5);
                    //透明度
                    this.context.globalAlpha = 0.1
                    this.context.strokeStyle = gradient
                    this.context.stroke()

                    this.context.moveTo(event.offsetX, event.offsetY)
                    this.x = event.offsetX
                    this.y = event.offsetY


                } else {
                    //渐变线颜色初始值
                    //console.log("鼠标移动未按下")

                }

            },
            canvasLeave: function (e) {
                this.canvasMouseDown = false;
                //console.log('鼠标离开画布')
            },
            nextProject:function () {
                this.$router.push('/chinaword')
            }

        },

    }


</script>

<style scoped>
    #FantasyLine {

    }

    #canvas {
        background: black;

    }
</style>