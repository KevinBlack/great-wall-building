<template>
    <div class="header">
        <img src="static/img/logo.png" height="46" style="position: absolute;top: 7px" alt="">
        <!-- 折叠按钮 -->
        <!-- <div  style="position:absolute;cursor: pointer;padding: 0 18px; line-height: 50px;" >
            <img src="static/img/cec.png" />
            <img style="margin-left: 10px;" src="static/img/gt-logo.png"/>
        </div>
        <div class="logo"></div> -->
        <div class="header-right">
            <div class="header-user-con">
            	<!--<div id="" style="font-size: 14px;">
            		<a href="javascript:;" style="color: #5677FC;"><i class="iconfont icon-guanyu-guanwang"></i> 返回企业网站</a>
            	</div>-->
                <!-- 全屏显示 -->
                <!--<div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
                        <i class="el-icon-rank"></i>
                    </el-tooltip>
                </div>-->
                <!-- 消息中心 -->
                <!--<div class="btn-bell">
                    <el-tooltip effect="dark" :content="message?`有${message}条未读消息`:`消息中心`" placement="bottom">
                        <router-link to="/tabs">
                            <i class="el-icon-bell"></i>
                        </router-link>
                    </el-tooltip>
                    <span class="btn-bell-badge" v-if="message"></span>
                </div>-->
                <!-- 用户头像 -->
                <div class="user-avator"></div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        <i class="iconfont icon-mine"></i> {{username}}
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item divided  command="updatePassword">修改密码</el-dropdown-item>
                        <el-dropdown-item divided  command="personalData">个人资料</el-dropdown-item>
                        <el-dropdown-item divided  command="loginout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-badge  :value="queryUnReadCount" :max="10" class="item">
                    <i class="el-icon-bell m-l-5 f-18 c-p" style="color: #fff;" @click="msgManager()"></i>
                    <!--<el-button class="share-button" icon="el-icon-share" type="primary"></el-button>-->
                </el-badge>
            </div>
        </div>
        <!-- 修改密码 -->
        <el-dialog   title="修改密码" :visible.sync="editUserVisible" >
            <el-form :model="user" :rules="editUserRules" ref="user" label-width="100px">
                <el-form-item label="原密码" prop="password">
                    <el-input type="password" maxlength="12" v-model="user.password" style="width:70%"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="passwordNew">
                    <el-input type="password" maxlength="12" v-model="user.passwordNew" style="width:70%"></el-input>
                </el-form-item>
                <el-form-item label="新密码确认" prop="passwordCheck">
                    <el-input type="password" maxlength="12" v-model="user.passwordCheck" style="width:70%"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="save('user')">确 定</el-button>
                <el-button @click="editUserVisible = false">取 消</el-button>
            </span>
        </el-dialog>

    </div>
</template>
<script>
    import { axiosHttp } from '@/libs'
    import store from '@/store/index'
    import { mapState,mapActions } from 'vuex'
    import bus from '../common/bus';
    import Des from '../../../static/js/des.js';
    export default {
        data() {
            return {
                collapse: false,
                fullscreen: false,
                name: localStorage.getItem('csmpLoginName'),
                message: 2,
                editUserVisible: false,
                user:{
                    password:"",
                    passwordNew:"",
                    passwordCheck:""
                },
                editUserRules: {
                    password: [{
                        required: true,
                        message: '请填写原密码',
                        trigger: 'blur'
                    },{
                        min: 6,
                        message: '密码长度设置为6-12位',
                        trigger: 'blur'
                    }],
                    passwordNew: [{
                        required: true,
                        message: '请填写新密码',
                        trigger: 'blur'
                    },{
                        min: 6,
                        message: '密码长度设置为6-12位',
                        trigger: 'blur'
                    }],
                    passwordCheck: [{
                        required: true,
                        message: '请确认新密码',
                        trigger: 'blur'
                    },{
                        min: 6,
                        message: '密码长度设置为6-12位',
                        trigger: 'blur'
                    }],
                }
            }
        },
        computed:{
            username(){
                let username = localStorage.getItem('ms_username');
                return username ? username : this.name;
            },
            ...mapState({queryUnReadCount:state=>state.queryUnReadCount})
        },
        methods:{
            // 用户名下拉菜单选择事件
            handleCommand(command) {
                if(command == 'loginout'){
                    this.$httpPost('/auth/oauth/logout').then(res =>{
                        if(res.data.code==0){
                            localStorage.clear();
                            this.$store.state.isNoMenu = false
                            this.$router.push('/login');
                            store.state.menuList = []
                        }
                    })
                } else if (command == 'updatePassword'){
                    this.$nextTick(() => {
                        this.$refs.user.resetFields()
                    })
                    this.editUserVisible = true;
                }else if (command == 'personalData'){
                    this.$router.push('/personalData')
                }
            },
            getDesPwd(pwd) { //加密方法
                var desPwd = '';
                var key1 = "www";
                var key2 = "css";
                var key3 = "com";
                desPwd = Des.strEnc(pwd, key1, key2, key3);
                return desPwd;
            },

            // 修改密码
            save(rule) {
                this.$refs[rule].validate((valid) => {
                    if (valid) {
                        var encryptPassword = this.getDesPwd(this.user.password);
                        var encryptPasswordNew = this.getDesPwd(this.user.passwordNew);
                        var encryptPasswordCheck = this.getDesPwd(this.user.passwordCheck);
                        if (encryptPasswordNew != encryptPasswordCheck) {
                            this.$message.error('新密码不一致');
                            return false;
                        } else {
                            this.$httpPost('/system/user/check', {
                                userId: localStorage.getItem("csmpLoginId"),
                                password: encryptPassword
                            }).then(res =>{
                                if(res.data.code == 0){
                                    this.$httpPost('/system/user/update', {
                                        userId: localStorage.getItem("csmpLoginId"),
                                        password: encryptPasswordNew
                                    }).then(res =>{
                                        if(res.data.code == 0){
                                            this.$message.success(res.data.body);
                                            this.editUserVisible = false;
                                            this.user = {};
                                        } else {
                                        }
                                    });
                                } else {
                                }
                            },error => {
                            });
                        }
                    } else {
                        return false;
                    }
                });
            },
            // 侧边栏折叠
            collapseChage(){
                this.collapse = !this.collapse;
                bus.$emit('collapse', this.collapse);
            },
            // 全屏事件
            handleFullScreen(){
                let element = document.documentElement;
                if (this.fullscreen) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                } else {
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if (element.webkitRequestFullScreen) {
                        element.webkitRequestFullScreen();
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    } else if (element.msRequestFullscreen) {
                        // IE11
                        element.msRequestFullscreen();
                    }
                }
                this.fullscreen = !this.fullscreen;
            },
            //角色 登录 我的消息 页面
            msgManager(){
                if(localStorage.getItem('csmpUserType') == "0"){
                    this.$router.push('/message/messageOnline') //物业端
                }else{
                    //this.$router.push('/message/messageOnline')
                    this.$router.push({path:'/message/messageOnlineCompany',query:{tabItem:'table1'}}) //企业端
                }

            },
            ...mapActions(['getUnReadCount'])
        },
        mounted(){
            if(document.body.clientWidth < 1500){
                this.collapseChage();
            }
        },
        created(){
            // this.queryUnReadCount();
            this.getUnReadCount()

        }
    }
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        background-color: #1771cc;
        height: 60px;
        /*background-image: url();*/
        font-size: 22px;
    }
    .collapse-btn{
        float: left;
        padding: 0 21px;
        cursor: pointer;
        line-height: 50px;
    }
    .header .logo{
        float: left;
        width:250px;
        line-height: 50px;
    }
    .header-right{
        float: right;
        padding-right: 30px;
    }
    .header-user-con{
        display: flex;
        height: 50px;
        align-items: center;
    }
    .btn-fullscreen{
        transform: rotate(45deg);
        margin-right: 5px;
        font-size: 24px;
    }
    .btn-bell, .btn-fullscreen{
        position: relative;
        width: 30px;
        height: 30px;
        text-align: center;
        border-radius: 15px;
        cursor: pointer;
    }
    .btn-bell-badge{
        position: absolute;
        right: 0;
        top: -2px;
        width: 8px;
        height: 8px;
        border-radius: 4px;
        background: #f56c6c;
        color: #fff;
    }
    .btn-bell .el-icon-bell{
        color: #fff;
    }
    .user-name{
        margin-left: 10px;
        -moz-user-select: none;
        -ms-user-select: none;
        -webkit-user-select: none;
    }
    .user-avator{
        margin-left: 20px;
    }
    .user-avator img{
        display: block;
        width:40px;
        height:40px;
        border-radius: 50%;
    }
    .el-dropdown-link{
        color: #fff;
        cursor: pointer;
    }
    .el-dropdown-menu__item{
        text-align: center;
    }
</style>
