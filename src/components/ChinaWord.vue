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
                <div class="grid-content bg-purple-light">
                    <div v-for="(word,index) in words">
                        <div v-if="index%2==0">
                            <p class="player_chengyu">
                                {{word}}
                            </p>
                        </div>
                        <div v-else>
                            <p class="cpu_chengyu">
                                {{word}}
                            </p>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="grid-content bg-purple chengyu-explain"></div>
            </el-col>
        </el-row>

        <div>
            <el-row>
                <el-col :span="8">
                    <div class="grid-content bg-purple"><p></p></div>
                </el-col>
                <el-col :span="8">
                    <el-row>
                        <el-col :span="18">
                            <div class="grid-content bg-purple">
                                <el-input
                                        v-model="input"
                                        placeholder="请输入一个成语"
                                        maxlength="4"
                                        minlength="4"
                                        clearable
                                        :disabled="inputDisabled"
                                        @keyup.enter.native="ok"
                                ></el-input>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="grid-content bg-purple-light">
                                <el-button @click="ok">确定</el-button>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <div><p class="tips">{{tips}}</p></div>
                    </el-row>
                </el-col>


                <el-col :span="8">
                    <div class="grid-content bg-purple"></div>
                    <p></p></el-col>
            </el-row>

        </div>

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
                        if ( resObj['chengyu']) {
                            //是成语
                            this.handlePush(word, resObj)
                        } else {
                            //不是成语
                            if (resObj['result'] == 4) {
                                this.tips = word+'???  这不是成语吧  23333'

                            } else {
                                console.log(resObj)
                                this.tips = word+'  emmmm……接不上您的成语，你赢了'
                            }


                        }
                    } else {
                        //不是第一次输入
                        if ('chengyu' in resObj) {
                            //是成语  检查拼音
                            this.checkPinyin(word, resObj)

                        } else {
                            if (resObj['result'] == 4) {
                                this.tips = word+'???  这不是成语吧  23333'

                            } else {
                                console.log(resObj)
                                this.tips = word+'  emmmm……接不上您的成语，你赢了'
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
                            this.tips =word+ ',倒是个成语，不过拼音没接上吧'
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
            },
            ok: function () {
                //用输入后禁用输入框，等待后台数据处理
                this.inputDisabled = true
                let word = this.input.trim()
                if (this.check4words(word)) {
                    this.checkIsChengyu(word)
                } else {
                    //不是四个字
                    this.tips = word+',-_-||，这都不是四个字，不要胡乱输入哦'
                }


            }
        }
    }

</script>

<style scoped>
    .player_chengyu {
        text-align: right;
        background-color: #ff8f65;
        margin-left: 50%;
        border-radius: 3px;
    }

    .cpu_chengyu {
        text-align: left;
        background-color: #8786ff;
        margin-right: 50%;
        border-radius: 3px;
    }

    .tips {
        color: aliceblue;
    }

    .explain-out {
        height: 100%;
    }

    .chengyu-explain {
        text-align: left;
        font-size: small;
        color: aliceblue;
        bottom: 0;
        padding: 0 10px 10px 10px;
        white-space: pre-wrap;
    }

    #ChinaWord {
        background: url("../assets/bkg.jpg");
        min-height: 800px;
        width: 100%;
        overflow: hidden;
        background-size: cover;
    }
    .title{
        text-align: center;
        font-family: 华文行楷;

    }
</style>