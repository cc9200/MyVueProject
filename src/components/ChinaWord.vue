<template>
    <div id="ChinaWord">
        <h2 class="title">成语接龙</h2>
        <el-row>
            <el-col :span="8" class="explain-out">
                <div class="grid-content bg-purple chengyu-explain">
                    {{cpu_explain}}
                </div>
            </el-col>
            <el-col :span="8">
                <div class="grid-content chengyu_list_box">
                    <div v-for="(word,index) in words" id="chengyu_list">
                        <div v-if="index%2==0">
                            <div class="player_chengyu_box">
                                <div class="player_chengyu">
                                    {{word}}
                                </div>
                            </div>

                        </div>
                        <div v-else>
                            <div class="cpu_chengyu_box"><p class="cpu_chengyu">
                                {{word}}
                            </p></div>

                        </div>
                    </div>
                </div>
                <el-row :span="24" id="chengyu_input_out">

                    <el-col :span="20">
                        <div class="grid-content bg-purple">
                            <el-input
                                    id="chengyu_input"
                                    v-model="input"
                                    placeholder="请输入一个成语"
                                    maxlength="4"
                                    minlength="4"
                                    clearable
                                    autofocus="false"
                                    :disabled="inputDisabled"
                                    @keyup.enter.native="ok"
                                    ref="chengyu_input"
                            ></el-input>
                        </div>

                    </el-col>
                    <el-col :span="4">
                        <div class="grid-content">
                            <el-button id="okButton" @click="ok">确定</el-button>
                        </div>
                    </el-col>

                </el-row>
                <el-row>
                    <div><p class="tips">{{tips}}</p></div>
                </el-row>
            </el-col>


        </el-row>


    </div>
</template>

<script>
    import args from '../Arguments.js'

    export default {
        name: "ChinaWord",
        data() {
            return {
                input: '',
                words: [],
                tips: '',
                inputDisabled: false,
                cpu_explain: ' ',
            }
        },
        watch: {
            inputDisabled: function (N, O) {
                if (!N) {
                    // this.$refs['chengyu_input'].focus()
                    document.getElementById('chengyu_input').focus()
                    console.log('focus')
                }


            }
        },
        methods: {
            getPinyin: function (character) {
                // console.log(character)
                // console.log(args)
                this.$axios.get(args['getPinyinUrl'], {
                    params: {
                        key: args['getPinyinKey'],
                        text: character
                    }
                }).then(res => {
                    //console.log(res)
                    return res.data.newslist[0].pinyin.trim()
                })

            },
            check4words: function (word) {
                return word.length == 4
            },
            checkIsChengyu: function (word) {
                this.$axios.get(args['queryChengyuUrl'], {
                    params: {
                        key: args['queryChengyuKey'],
                        userid: args['queryChengyuUserID'],
                        word: word
                    }
                }).then(res => {
                    console.log(res)
                    let resObj = res.data.newslist[0]

                    if (this.words.length == 0) {
                        //第一次输入不检查拼音
                        if (resObj['chengyu']) {
                            //是成语
                            this.handlePush(word, resObj)
                        } else {
                            //不是成语
                            if (resObj['result'] == 4) {
                                this.tips = word + '???  这不是成语吧  23333'

                            } else {
                                console.log(resObj)
                                this.tips = word + '  emmmm……接不上您的成语，你赢了'
                            }


                        }
                    } else {
                        //不是第一次输入
                        if ('chengyu' in resObj) {
                            //是成语  检查拼音
                            this.checkPinyin(word, resObj)

                        } else {
                            if (resObj['result'] == 4) {
                                this.tips = word + '???  这不是成语吧  23333'

                            } else {
                                console.log(resObj)
                                this.tips = word + '  emmmm……接不上您的成语，你赢了'
                            }
                        }
                    }


                })
            },
            checkPinyin: function (word, resObj) {
                let pre_word = this.words[this.words.length - 1]
                let character = pre_word.charAt(pre_word.length - 1) + word[0]
                this.$axios.get(args['getPinyinUrl'], {
                    params: {
                        key: args['getPinyinKey'],
                        text: character
                    }
                }).then(res => {
                    //console.log(res)
                    let ls = res.data.newslist[0].pinyin.trim().split(' ')
                    console.log(character)
                    console.log(ls)
                    if (ls.length == 2) {
                        if (ls[0] == ls[1]) {
                            //检查拼音正确
                            this.handlePush(word, resObj)

                        } else {
                            this.tips = word + ',倒是个成语，不过拼音没接上吧'
                        }
                    } else {
                        console.log('可能是网络请求出错了吧')
                    }
                })

            },
            handlePush: function (word, resObj) {
                this.words.push(word)
                this.words.push(resObj['chengyu'])

                let explain = resObj['chengyu']
                explain += '\n'
                if (resObj['pinyin']) {
                    explain += resObj['pinyin']
                }
                explain += '\n'
                if (resObj['chuchu']) {
                    explain += resObj['chuchu']
                }
                explain += '\n'
                if (resObj['jiesi']) {
                    explain += resObj['jiesi']
                }
                this.cpu_explain = explain
                this.input = ''
                this.inputDisabled = false
                let ele = document.getElementById("chengyu_input")
                ele.focus()
                console.log(ele)
            },
            ok: function () {
                //用输入后禁用输入框，等待后台数据处理
                this.inputDisabled = true
                let word = this.input.trim()
                if (this.check4words(word)) {
                    this.checkIsChengyu(word)
                } else {
                    //不是四个字
                    this.tips = word + ',-_-||，这都不是四个字，不要胡乱输入哦'
                }


            }
        }
    }

</script>

<style scoped>
    #chengyu_input_out {
        /*text-align: center;*/
    }

    .chengyu_list_box {
        /*position:relative;*/
        min-height: 30vh;
        margin: 10px 0;
    }

    .player_chengyu_box {
        text-align: right;
    }

    .player_chengyu {

        /*position:reletive;*/
        /*right:0;*/
        display: inline;
        background-color: rgba(38, 255, 35, 1);
        padding: auto 10px;
        font-size: 20px;
        line-height: 1.8;
        border-radius: 6px;
    }

    .cpu_chengyu_box {
        text-align: left;
        font-size: 20px;
        line-height: 1.8;
        border-radius: 6px;
    }

    .cpu_chengyu {
        /*position:reletive;*/
        /*left:0;*/
        display: inline;
        background-color: #FFF;
        margin-right: 50%;
        border-radius: 3px;
    }

    .tips {
        color: black;
    }

    .explain-out {

    }

    .chengyu-explain {
        text-align: left;
        font-size: 1em;
        line-height: 1.8;
        /*font-family:"华文行楷", "宋体", "微软雅黑";*/
        color: darkslategrey;
        bottom: 0;
        padding: 0 10px 10px 10px;
        white-space: pre-line;
    }

    #ChinaWord {
        background: white url("../assets/zhujian.jpg");
        background-attachment: fixed;
        background-position: left top;
        background-repeat: repeat;
        /*background-size: cover;*/
        /*filter: blur(1px);*/
        height: 100vh;
        /*width: 100%;*/
        /*background_re;*/
        /*background-size: cover;*/
    }

    #okButton {
        width: 100%;

    }

    .title {
        text-align: center;
        font-family: "华文行楷", "宋体", "微软雅黑";
        margin-top: 0;
        padding-top: 5%;

    }
</style>