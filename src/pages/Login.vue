<template>
    <!--<div class="login-wrap">
        <div class="ms-title">后台管理系统</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" @keyup.enter.native="submitForm('ruleForm')" placeholder="username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                <p style="font-size:12px;line-height:30px;color:#999;"></p>
            </el-form>
        </div>
    </div>-->


    <div class="w-100 h-100 " id="login" style="background:url('../../static/img/loginbg.jpg') no-repeat center center;
        background-size: 100% 100%; ">

        <div class="zr-row-scatter" style="border-bottom: 1px solid #a795d2;">
            <img src="static/img/logo.png" style="margin-left:70px;">
            <!-- <div style="margin-right:38px;margin-top:20px;" class="c-white">返回企业官网</div> -->
        </div>
        <div class="login-wrap">
            <div class="login-left">
                <div
                    style="width:60%;max-width:420px;margin:12% 0 5% 20%;border:1px solid #ccc;padding:30px 46px;border-radius: 10px;background-color:rgba(55,60,121,0.6)">
                    <h1 style="color:#f1f1f1">中电长城大厦 <span style="font-size: 16px;">综合服务管理平台</span></h1>
                    <h3></h3>
                    <div class="w-100 m-t-20 zr-row h-48-px">
                        <div style="position: relative" class="zi-g-1 zr-column-center c-p" @click="userType = 0"
                             :style="userType?'background-color:#ddd;color:black':'background-color:#2c7eef;color:white'">
                            <div>
                                物业人员登录 <i style="position: absolute;left:0;right:0;margin:auto;bottom: -5px;"
                                        v-if="userType === 0" class="el-icon-caret-top zr-column-center"></i>
                            </div>
                        </div>
                        <div style="position: relative;cursor:pointer;" class="zi-g-1 zr-column-center" @click="userType = 1"
                             :style="userType?'background-color:#2c7eef;color:white':'background-color:#ddd;color:black'">
                            <div class="">
                                客户登录 <i style="position: absolute;left:0;right:0;margin:auto;bottom: -5px;"
                                        v-if="userType === 1" class="el-icon-caret-top zr-column-center"></i>
                            </div>
                        </div>
                    </div>

                    <div v-if="!loginType">
                        <el-input placeholder="手机号" v-model="userName" class="m-t-40" style="height:45px">
                            <template slot="prepend">
                                <i class="iconfont icon-shoujihao-"></i>
                            </template>
                        </el-input>
                        <el-input type="password" placeholder="密码" v-model="password" class="m-t-20"
                                  style="height:45px">
                            <template slot="prepend">
                                <i class="iconfont icon-mima-"></i>
                            </template>
                        </el-input>
                        <userDetail v-if='userdetailShow'></userDetail>
                        <el-button class="m-t-40 w-100 h-44-px bg-red c-white mybtn"
                                   style="font-size: 14px;border:1px solid #F44336" @click="login()">登 录
                        </el-button>
                        <div class="zr-row-scatter m-t-20 c-white f-14">
                            <div @click="loginType = 1" class="c-p">注册</div>
                            <div @click="loginType = 2" class="c-p">忘记密码</div>
                        </div>
                    </div>

                    <div v-if="loginType === 1 || loginType === 2">
                        <el-input placeholder="请输入手机号码" v-model="userName" class="m-t-40" style="height:45px">
                            <template slot="prepend">
                                <i class="iconfont icon-shoujihao-"></i>
                            </template>
                        </el-input>
                        <div class="zr-row-scatter m-t-20">
                            <el-input placeholder="请输入验证码" v-model="smsCode" style="height:45px;width:70%">
                                <template slot="prepend">
                                    <i class="iconfont icon-yanzhengma-"></i>
                                </template>
                            </el-input>
                            <el-button type="primary" class="h-44-px" @click="getCode()">{{countDown.text}}</el-button>
                        </div>
                        <el-input v-if="loginType!=1" type="password" placeholder="密码" v-model="password" class="m-t-20"
                                  style="height:45px">
                            <template slot="prepend">
                                <i class="iconfont icon-mima-"></i>
                            </template>
                        </el-input>
                        <el-input v-if="loginType!=1" type="password" placeholder="确认密码" v-model="passwordAgain" class="m-t-20"
                                  style="height:45px">
                            <template slot="prepend">
                                <i class="iconfont icon-mima-"></i>
                            </template>
                        </el-input>
                         <el-input v-if="loginType==1" placeholder="请输入姓名" v-model="chineseName" class="m-t-20" style="height:45px">
                            <template slot="prepend">
                                <i class="iconfont icon-shoujihao-"></i>
                            </template>
                        </el-input>
						<div class="m-t-20" v-if="loginType==1">
                            <el-select v-model="sex" placeholder="请选择性别"  style="width: 100%;">
							    <el-option
							      v-for="item in sexes"
							      :key="item.value"
							      :label="item.label"
							      :value="item.value">
							    </el-option>
							</el-select>
                        </div>
                        <div class="zr-row-scatter m-t-20" >
                            <!-- 调用树形下拉框组件 -->
						     <SelectTree
                              v-if="loginType==1"
						      :props="props"
						      :options="optionData"
						      :value="valueId"
                               x-placement="top-start"
						      :clearable="isClearable"
						      :accordion="isAccordion"
						      @getValue="getValue($event)"
						      @click="getTree"
						     style="width: 100%;" placeholder="请选择用户类型"/>
                        </div>

                        <el-button class="m-t-40 w-100 h-44-px bg-red c-white mybtn" style="border:1px solid #F44336"
                                   @click="register()">{{loginType === 1?'注册':'确定'}}
                        </el-button>
                        <!--@click="loginType === 2?loginType = 3:false"{{loginType === 1?'注册':'确定'}}-->
                        <div class="zr-column-center m-t-25 c-white f-14" style="cursor: pointer"
                             @click="loginType = 0">{{loginType === 1?'已有账号':'想起密码'}} 立即登录
                        </div>
                    </div>
                    <div v-if="loginType === 3" class="zr-column-center m-t-40">
                        <img src="static/img/changePssSuccess.png" class="m-b-20">
                        <div class="m-b-40 c-mima">密码重置成功 请重新登录</div>
                        <el-button class="m-t-40 w-100 h-44-px bg-red c-white mybtn" @click="loginType = 0">确 定</el-button>
                    </div>
                </div>
            </div>

        </div>

        <!--<div style="position:fixed;width:807px;height:532px" class="zr-column-center"  :style="{'top':gifTop,'left':gifLeft}">-->
        <!--<img style="width:807px;height:532px" src="static/img/index.gif">-->
        <!--</div>-->

        <!--<div class="footer">-->
        <!--<div class="zr-column-center">-->
        <!--<span>版权所有 中国长城 Copyright © 2015-2020   粤ICP备14073451号</span>-->
        <!--</div>-->
        <!--</div>-->
        <div class="aboutme">
            <span>电 话：0755-26639997</span>
            <span>传 真：0755-2663169</span>
            <span>地 址：深圳市南山区科技园科发路3号</span>
            <span>邮 编：518057</span>
            <div class="zr-column-center" style="margin-top:6px;">
                <span>版权所有 中国长城 Copyright © 2015-2020   粤ICP备14073451号</span>
            </div>
        </div>
    </div>
</template>
<script>
	import SelectTree from "./treeSelect.vue";
	import treeJson from './api/tree.json';
    import Des from '../../static/js/des'
    import store from '@/store/index'
    import {mapState} from 'vuex'

    export default {
    	name: "app",
    	components: {
		    SelectTree
		},
        data: function () {
            return {
            	isClearable: true, // 可清空（可选）
			    isAccordion: true, // 可收起（可选）
			    valueId: "", // 初始ID（可选）
			    props: {
			        // 配置项（必选）
			        //value: "name",
			        value: "id",
			        label: "name",
			        children: "children"
			        // disabled:true
			    },
			      // 选项列表（必选）
			    list: [
			          /*{ id: 1, parentId: 0, name: "一级菜单A", rank: 1 },
			          { id: 2, parentId: 0, name: "一级菜单B", rank: 1 },
			          { id: 3, parentId: 0, name: "一级菜单C", rank: 1 },
			          { id: 4, parentId: 1, name: "二级菜单A-A", rank: 2 },
			          { id: 5, parentId: 1, name: "二级菜单A-B", rank: 2 },
			          { id: 6, parentId: 2, name: "二级菜单B-A", rank: 2 },
			          { id: 7, parentId: 4, name: "三级菜单A-A-A", rank: 3 },
			          { id: 8, parentId: 7, name: "四级菜单A-A-A-A", rank: 4 },
			          { id: 9, parentId: 0, name: "一级菜单C", rank: 1 },
			          { id: 10, parentId: 0, name: "一级菜单end", rank: 1 }*/
			    ],
                userType: 0,
                loginType: 0,
                userName: '',
                password: '',
                passwordAgain: '',
                chineseName:'',
                sex:'',
                sexes: [{
			          value: '男',
			          label: '男'
			        }, {
			          value: '女',
			          label: '女'
			        }],
                loginTop: '',
                loginLeft: '',
                totalTime: 180,
                gifTop: '',
                gifLeft: '',
                smsCode: '',
                userdetailShow: false,
                ruleForm: {
                    username: '',
                    password: '',
                    userType: 0
                },
                rules:
                    {
                        username: [
                            {required: true, message: '请输入用户名', trigger: 'blur'}
                        ],
                        password: [
                            {required: true, message: '请输入密码', trigger: 'blur'}
                        ]
                    }
            }
        },
        computed: {
            ...mapState({
                countDown: state => state.countDown
            }),
             /* 转树形数据 */
		    optionData() {
		      let cloneData = JSON.parse(JSON.stringify(this.list)); // 对源数据深度克隆
		      return cloneData.filter(father => {
		        // 循环所有项，并添加children属性
		        let branchArr = cloneData.filter(child => father.id == child.pId); // 返回每一项的子级数组
		        branchArr.length > 0 ? (father.children = branchArr) : ""; //给父级添加一个children属性，并赋值
		        return father.pId == 0; //返回第一层
		      });
		    }
        },
        methods: {
        	getTree(){
        		let obj = {};
		        this.list = this.list.reduce((item, next) => {
		            obj[next.id] ? "" : (obj[next.id] = true && item.push(next));
                    return item;
                }, []);
        	},
        	 // 取值
		    getValue(value) {
              this.valueId = value;
		    },
		    getNodeTree(tree) {
		      for (var i in tree) {
		        if (typeof tree[i] == "object") {
		          this.getNodeTree(tree[i]);
		        } else {
		          this.list.push({
		            id: tree["id"],
		            parentId: tree["parentId"],
		            name: tree["goodsTypeName"]
		          });
		        }
		      }
		    },
		    getTreeList() {
                this.$httpNoToken('POST','/system/user/org/zTree').then(res => {
                    if (res.data.code == 0) {
                        this.list=res.data.body;
                    } else {
                        this.$message.error(res.data.msg)
                    }
                }, error => {
            			this.$message.error(error.msg);
                })
		    },
            detailShow() {
                this.userdetailShow = true
            },
            //登录
            login() {
                this.$httpPost('/auth/oauth/token', {
                    username: this.userName,
                    password: this.getDesPwd(this.password),
                    userType: this.userType
                }).then(res => {
                    if (res.data.code == 0) {
                        localStorage.setItem('csmpToken', res.data.body.token);
                        localStorage.setItem('csmpLoginName', res.data.body.name);
                        localStorage.setItem('csmpLoginUserName', res.data.body.username)
                        localStorage.setItem('csmpLoginId', res.data.body.id);
                        localStorage.setItem('csmpUserType', res.data.body.userType);
                        if (this.$route.query.redirect) this.$router.push(this.$route.query.redirect)
                        else this.$router.push('/index')
                        document.removeEventListener('keydown', this.enterEvent, false);
                    } else {
                        this.$message.error(res.data.msg);
                        // this.$message.error('手机号或密码错误');
                        this.password = '';
                    }
                }, error => {
                    this.$message.error(error.msg?error.msg:'登录失败');
                })
            },
            //注册
            register() {
                let type = this.loginType;
//      	 	this.password=this.getDesPwd(this.password);
//      	 	this.passwordAgain=this.getDesPwd(this.passwordAgain);
                /*if(!(this.password.length>5 && this.password.length<13)){
                    this.$message.error('密码长度设置为6-12位');
                    return
                }*/
                if (type == 1) {
                    this.$httpPost('/system/user/register', {
                        telephone: this.userName,
                        code: this.smsCode,
                       // password: this.getDesPwd(this.password),
                        name:this.chineseName,
                        sex:this.sex,
                        department:this.valueId,
                        //confirmPassword: this.getDesPwd(this.passwordAgain),
                        userType: this.userType
                    }).then(res => {
                        if (res.data.code == 0) {
                            this.loginType = 0;
                            this.$message({
                                message: '注册成功!初始密码:123456',
                                type: 'success'
                            });
                        } else {
                            this.$message.error(res.data.msg)
                        }
                        //this.password = "";
                        //this.passwordAgain = "";
                    }, error => {
                        this.$message.error(error.msg);
                    })
                } else if (type == 2) {
                    this.$httpPost('/system/user/updatePassword', {
                        telephone: this.userName,
                        code: this.smsCode,
                        password: this.getDesPwd(this.password),
                        //name:this.chineseName,
                        //sex:this.sex,
                        //department:this.valueId,
                        confirmPassword: this.getDesPwd(this.passwordAgain),
                        userType: this.userType
                    }).then(res => {
                        if (res.data.code == 0) {
                            this.loginType = 3;
                        } else {
                            this.$message.error(res.data.msg)
                        }
                        this.password = "";
                        this.passwordAgain = "";
                    }, error => {
                        this.$message.error(error.msg);
                    })
                }

            },

            //获取验证码
            getCode() {
                if (store.state.countDown.second < 180) {
                    return
                } else {
                    store.dispatch('loginCheckPhone', {telephone: this.userName, userType: this.userType,type:this.loginType}).then(res => {
                        if (res) {
                            this.$message.error(res.msg);
                        } else {
                            this.$message({
                                message: '验证码发送成功',
                                type: 'success'
                            });
                        }
                    })
                }
            },
            getDesPwd: function (pwd) { //加密方法
                let desPwd = '';
                let key1 = "www";
                let key2 = "css";
                let key3 = "com";
                desPwd = Des.strEnc(pwd, key1, key2, key3);
                return desPwd;
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.ruleForm.password = this.getDesPwd(this.ruleForm.password);
                        this.$httpPost('/auth/oauth/token', {
                            username: this.userName,
                            password: this.password,
                            userType: this.userType
                        }).then(res => {
                            if (res.data.code == 0) {
                                localStorage.setItem('csmpToken', res.data.body.token);
                                localStorage.setItem('csmpLoginName', res.data.body.name);
                                localStorage.setItem('csmpLoginId', res.data.body.id);
                                this.$router.push('/index');
                            } else {
                                this.$message.error(res.data.msg)
                            }
                        })
                    } else {
                    }
                });
            },
            enterEvent() {
                let _key = window.event.keyCode;
                if (_key === 13) {
                    if (this.loginType == 0) {
                        this.login();
                    } else {
                        this.register();
                    }

                }
            }
        },


        created() {
        	//前台模拟数据
        	//this.getNodeTree(treeJson);
        	//后台访问数据
        	this.getTreeList();
            //回车事件绑定
            document.addEventListener('keydown', this.enterEvent, false)
            let w = document.documentElement.clientWidth || document.body.clientWidth
            let h = document.documentElement.clientHeight || document.body.clientHeight
            // window.onresize = () => {
            //     window.location.reload()
            // }
            this.loginTop = (h - 646) / 2 + 'px'
            this.loginLeft = (w - 1418) / 2 + 'px'
            this.gifTop = (h - 550) / 2 + 'px'
            this.gifLeft = (w - 1418) / 2 + 608 + 'px'
            this.$store.state.isNoMenu = false
            localStorage.clear()
        },

    }
</script>

<style lang="less">
    .mybtn:hover {
        color: #fff !important;
    }

    .login-wrap {
        position: relative;
        min-width: 960px;
        width: 100%;
    }

    .login-btn {
        text-align: center;
    }

    .login-btn button {
        width: 100%;
        height: 36px;
    }

    #login {
        overflow: auto;
        .el-input--small .el-input__inner {
            height: 45px !important;
        }
        .el-input-group__append, .el-input-group__prepend {
            background-color: #E6E6E6;
        }
    }

    .aboutme {
        width: 100%;
        position: absolute;
        bottom: 0;
        text-align: center;
        color: #F1F1F1;
        font-size: 12px;
        background: #373d41;
        padding: 10px 0;
        span {
            margin-right: 20px;
        }
    }

    .login-left {
        width: 38%;
        margin-top: 56px;
    }

    @media screen and (max-width: 1200px) {
        .login-wrap {
            width: 1120px;
        }

        .login-left {
            width: 422px;
            left: 56px;
            top: 56px;
        }

    }
    .c-mima{
        color: greenyellow;
    }


</style>
