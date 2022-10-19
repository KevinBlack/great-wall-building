<template>
    <div>
        <div class="h-75-px w-100">
            <el-form ref="personForm" :model="person" label-width="80px">
            
            <el-row class="b-b-gray-4">
                <el-col :span="2" class="zr-column-center" >
                    <div class="f-18">基本信息</div>
                </el-col>
            </el-row>
            <el-row class="b-b-gray-4">
                <el-col :span="2" class="zr-column-center bg-gray" >
                    <div><i class="el-icon-success c-green"></i> 已设置</div>
                </el-col>
                <el-col :span="2" class="zr-column-center">
                    <div class="f-16 f-w-700">个人头像</div>
                </el-col>
                <el-col :span="12" class="zr-row zr_align-center">
                    <div class="f-16">设置个性头像，用于判断是否为综合管理平台用户</div>
                </el-col>
                <el-col :span="7" class="zr-column-center" model="user">
                    <div class="w-50 f-16" style="text-align: right;">
                        <img style="border-radius:50%" height="40" width="40" :src="person.headPhoto">
                    </div>
                    <!-- <div  class="f-14 w-100" style="text-align: right">如需更换头像，请登录APP进行修改</div> -->
                </el-col>
            </el-row>

            <el-row class="b-b-gray-4">
                <el-col :span="2" class="zr-column-center bg-gray">
                    <div><i class="el-icon-success c-green"></i> 已设置</div>
                </el-col>
                <el-col :span="2" class="zr-column-center">
                    <div class="f-16 f-w-700">基本信息</div>
                </el-col>
                <el-col :span="12" class="zr-row zr_align-center">
                    <div class="f-16">
                        <!-- <el-form-item label="姓名">
                            <el-input v-model="person.NAME" :disabled="isDisabled"></el-input>
                        </el-form-item> -->
                        {{person.NAME}}
                    </div>
                </el-col>
                <!-- <el-col :span="7" class="zr-column-center">
                    <div class="w-100 f-16" style="text-align: right">{{person.username}}&nbsp;&nbsp;({{company.certNo}})&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{company.sex}}</div>
                </el-col> -->
            </el-row>

            <el-row class="b-b-gray-4">
                <el-col :span="2" class="zr-column-center bg-gray">
                    <div><i class="el-icon-success c-green"></i> 已设置</div>
                </el-col>
                <el-col :span="2" class="zr-column-center">
                    <div class="f-16 f-w-700">手机号码</div>
                </el-col>
                <el-col :span="12" class="zr-row zr_align-center">
                    <div class="f-16">
                        {{person.MOBILE}}
                         <!-- <el-form-item label="">
                            <el-input v-model="person.MOBILE" :disabled="isDisabled"></el-input>
                        </el-form-item> -->
                    </div>
                </el-col>
                <el-col :span="7" class="zr-column-center">
                    <div class="w-100 f-16" style="text-align: right">{{company.mobile}}</div>
                </el-col>
                <!--<el-col :span="2" class="zr-column-center" >-->
                <!--<el-button type="primary" @click="updatePhone1()">修 改</el-button>-->
                <!--</el-col>-->

            </el-row>

            <el-row class="b-b-gray-4">
                <el-col :span="2" class="zr-column-center bg-gray">
                    <div><i class="el-icon-success c-green"></i> 已设置</div>
                </el-col>
                <el-col :span="2" class="zr-column-center">
                    <div class="f-16 f-w-700">工作单位</div>
                </el-col>
                <el-col :span="12" class="zr-row zr_align-center">
                    <div class="f-16">
                        {{person.COMPANY}}
                    </div>
                </el-col>
                <el-col :span="7" class="zr-column-center">
                    <div class="w-100 f-16" style="text-align: right">{{company.company}}</div>
                </el-col>
            </el-row>

            <el-row class="b-b-gray-4">
                <el-col :span="2" class="zr-column-center bg-gray">
                    <div><i class="el-icon-success c-green"></i> 已设置</div>
                </el-col>
                <el-col :span="2" class="zr-column-center">
                    <div class="f-16 f-w-700">所在部门</div>
                </el-col>
                <el-col :span="12" class="zr-row zr_align-center">
                    <div class="f-16">
                        {{person.DEPARTMENT}}
                    </div>
                </el-col>
                <el-col :span="7" class="zr-column-center">
                    <div class="w-100 f-16" style="text-align: right">{{company.department}}</div>
                </el-col>
            </el-row>

            <el-row class="b-b-gray-4">
                <el-col :span="2" class="zr-column-center bg-gray">
                    <div><i class="el-icon-success c-green"></i> 已设置</div>
                </el-col>
                <el-col :span="2" class="zr-column-center">
                    <div class="f-16 f-w-700">职务</div>
                </el-col>
                <el-col :span="12" class="zr-row zr_align-center">
                    <div class="f-16">
                        {{person.POST}}
                    </div>
                </el-col>
                <el-col :span="7" class="zr-column-center">
                    <div class="w-100 f-16" style="text-align: right">{{company.post}}</div>
                </el-col>
            </el-row>

            <el-row class="b-b-gray-4">
                <el-col :span="2" class="zr-column-center bg-gray">
                    <div><i class="el-icon-success c-green"></i> 已设置</div>
                </el-col>
                <el-col :span="2" class="zr-column-center">
                    <div class="f-16 f-w-700">所属区域</div>
                </el-col>
                <el-col :span="12" class="zr-row zr_align-center">
                    <div class="f-16">
                        {{person.AREA}}
                    </div>
                </el-col>
                <el-col :span="7" class="zr-column-center">
                    <div class="w-100 f-16" style="text-align: right">{{company.area}}</div>
                </el-col>
            </el-row>
            </el-form>
        </div>
    </div>
</template>
<script>
    import { api } from '@/libs'
    export default {
        // 变量初始化定义
        data() {
            return {
                person:{},
                company:[],
                isDisabled:true
            }

        },
        // 自定义方法
        methods: {
            //获取公司列表
            getCompanyList(flag){
                this.$httpPost('/system/user/org/getOrgList', {
                    flag:flag
                    }).then(res => {
                        if (res.data.code == 0) {
                            this.company=res.data.body;
                        }
                    })
            },
            //获取用户信息
                getPerson(){
                    let csmpLoginId = localStorage.getItem('csmpLoginId');
                    this.$httpPost('/system/user/getPersonInfo', {
                    userId: csmpLoginId
                    }).then(res => {
                        if (res.data.code == 0) {
                            this.person=res.data.body
                            console.log(this.person)
                        }
                    })
                },
        },
        // 页面加载时执行
        created: function() {
            this.getPerson();
            // console.log(api)
            // let csmpLoginId = localStorage.getItem('csmpLoginId');
            // this.$httpPost('/system/user/getUsers', {
            //     userId: csmpLoginId
            // }).then(res => {
            //     if (res.data.code == 0) {
            //         let users = res.data.body;
            //         if(users){
            //             this.person = users[0];
            //             let personImg = users[0].headPhoto;
            //             this.person.headPhoto = personImg?(api.fileserver+'download?fileId='+personImg):'static/img/person.png';

            //             this.$httpPost('/manage/peopleInfo/findPeopleByLoginUser', {
            //             }).then(res => {
            //                 if (res.data.code == 0) {
            //                     let company = res.data.body;
            //                     if(company){
            //                         this.company = company;
            //                         let certNo = company.certNo;
            //                         if(certNo!="" && (certNo.length >= 8)){
            //                             this.company.certNo=certNo.substring(0,4)+'******'+certNo.substring(certNo.length-4)
            //                         }
            //                         let mobile = company.mobile;
            //                         if(mobile!="" && (mobile.length >= 5)){
            //                             this.company.mobile=mobile.substring(0,3)+'******'+mobile.substring(mobile.length-2)
            //                         }
            //                     }else{
            //                         this.$message.error('用户不存在');
            //                         return;
            //                     }
            //                 } else {
            //                 }

            //             })
            //         }else{
            //             this.$message.error('用户不存在');
            //             return;
            //         }
            //     } else {
            //     }

            // })
        },
    }

</script>
