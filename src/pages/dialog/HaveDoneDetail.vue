<template id="haveDoneDetail">
    <div class="wrap">
        <!--{{haveDoneDetailParams}}-->
        <el-form :model="editform" ref="editform" label-width="100px" width="30%">
            <el-form-item label="服务单号">
                <el-input v-model="editform.serveCode" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="服务类型">
                <el-input v-model="editform.serveType" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="申请时间">
                <el-input :value="editform.applyTime | dateFormat" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="预约时间">
                <el-input :value="editform.applyServeTime | dateFormat" :disabled="true"></el-input>
            </el-form-item>
            <!--<el-form-item label="服务状态">
                <el-input v-model="editform.serveStatus" :disabled="true"></el-input>
            </el-form-item>-->
            <el-form-item label="联系人">
                <el-input v-model="editform.customerName" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="服务描述">
                <el-input v-model="editform.contentDescribe" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="服务区域">
                <el-input v-model="editform.serveArea" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="联系电话">
                <el-input v-model="editform.customerPhone" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="发送人">
                <el-input v-model="editform.beforeOperatePerson" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="问题描述" prop="contentDescribe">
                <el-input type="textarea" v-model="editform.contentDescribe" :disabled="true"></el-input>
            </el-form-item>
            <!--<el-form-item label="现场图片">
                <el-input v-model="editform.customerShootPicture"></el-input>
            </el-form-item>-->


            <!-- 上面的部分只是做展示  下面的部分 根据状态的不同显示不同的内容-->

            <!--状态1001显示班组长选择框-->
            <template v-if="serveStatus1001">
                <el-form-item label="班组长" prop="jobForeman">
                    <el-select v-model="editform.jobForeman" :disabled="true" style="width: 200px;" clearable filterable
                               placeholder="用户名">
                        <el-option v-for="item in users" :key="item.id" :label="item.username" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </template>


            <template v-if="serveStatus1002">
                <el-form-item label="是否有偿" prop="serveClasses">
                    <!--<el-input v-model="editform.serveClasses"></el-input>-->
                    <el-radio-group v-model="editform.serveClasses" :disabled="true" id="serveClasses">
                        <el-radio :label="1">有偿</el-radio>
                        <el-radio :label="2">无偿</el-radio>
                    </el-radio-group>
                    <!--</template>-->
                </el-form-item>
                <el-form-item label="金额" prop="price" v-if="payPrice">
                    <template>
                        <el-input v-model="editform.price" :disabled="true" type="number"
                                  oninput="if(value.length>8)value=value.slice(0,8);value=Math.round(value*100)/100;" class="w-25 m-r-10"></el-input>元
                    </template>
                </el-form-item>
                <template v-if="payTypeFlag">
                    <el-form-item label="支付方式" prop="payType">
                        <el-select v-model="editform.payType" id="payType" :disabled="true" style="margin-bottom:10px;" clearable
                                   filterable placeholder="支付方式">
                            <el-option v-for="item in payTypes" :key="item.key" :label="item.lable" :value="item.key">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </template>
                <template v-if="serveParPersonFlag1002">
                    <el-form-item label="负责人" prop="jobForeman">
                        <el-select v-model="editform.jobForeman" :disabled="true" style="margin-bottom:10px;" clearable filterable
                                   placeholder="用户名">
                            <el-option v-for="item in users" :key="item.id" :label="item.username" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="参与人" prop="serveParPerson">
                        <el-input v-model="editform.serveParPerson" :disabled="true" id="serveParPerson"></el-input>
                    </el-form-item>
                </template>
            </template>

            <template v-if="serveStatus1003">
                <el-form-item label="是否有偿" prop="serveClasses">
                    <!--<el-input v-model="editform.serveClasses"></el-input>-->
                    <el-radio-group v-model="editform.serveClasses" :disabled="true" >
                        <el-radio :label="1">有偿</el-radio>
                        <el-radio :label="2">无偿</el-radio>
                    </el-radio-group>
                    <!--</template>-->
                </el-form-item>
                <el-form-item label="待支付金额" prop="price" v-if="payPrice">
                    <template>
                        <el-input v-model="editform.price" :disabled="true" type="number"
                                  oninput="if(value.length>8)value=value.slice(0,8);value=Math.round(value*100)/100;" class="w-25 m-r-10"></el-input>元
                    </template>
                </el-form-item>
                <template v-if="payTypeFlag">
                    <el-form-item label="支付方式" prop="payType">
                        <el-select v-model="editform.payType" id="payType" :disabled="true" style="margin-bottom:10px;" clearable
                                   filterable placeholder="支付方式">
                            <el-option v-for="item in payTypes" :key="item.key" :label="item.lable" :value="item.key">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </template>
            </template>

            <template v-if="serveStatus1004">
                <!--<el-form-item label="支付方式" prop="payType">
                    <el-select v-model="editform.payType" id="payType" style="margin-bottom:10px;" clearable
                               :disabled="true"
                               filterable placeholder="支付方式">
                        <el-option v-for="item in payTypes" :key="item.key" :label="item.lable" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="金额" prop="price">
                    <template>
                        <el-input v-model="editform.price" type="number" :disabled="true"></el-input>
                    </template>
                </el-form-item>-->
                <el-form-item label="负责人" prop="jobForeman">
                    <el-select v-model="editform.servePrincipal" :disabled="true" style="margin-bottom:10px;" clearable filterable
                               placeholder="用户名">
                        <el-option v-for="item in users" :key="item.id"  :label="item.username" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="参与人" prop="serveParPerson" >
                    <el-input v-model="editform.serveParPerson" :disabled="true" id="serveParPerson"></el-input>
                </el-form-item>
            </template>


            <template v-if="serveStatus1005">
                <el-form-item label="到场时间" prop="applyServeTime">
                    <el-date-picker v-model="editform.applyServeTime" :disabled="true" type="datetime" value-format="timestamp"
                                    format="yyyy-MM-dd HH:mm" placeholder="选择到场时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="离场时间" prop="serveEndTime">
                    <el-date-picker v-model="editform.serveEndTime" :disabled="true" type="datetime" format="yyyy-MM-dd HH:mm"
                                    placeholder="选择离场时间" value-format="timestamp">
                    </el-date-picker>
                </el-form-item>
                <!--<el-form-item label="完成情况">
                    <el-input type="textarea" :row="2" :col="5" v-model="editform.remark"></el-input>
                </el-form-item>-->
            </template>
            <el-form-item label="备注">
                <el-input type="textarea" :row="2" :col="5" :disabled="true" v-model="editform.remark"></el-input>
            </el-form-item>

        </el-form>

    </div>
</template>

<script>
    // import { formatDate } from '../../../../static/js/date.js'

    export default {
        inject:['reloadView'],
        data: function () {
            return {
                editform: this.haveDoneDetailParams,
                toWorkform: {},
                toWorkform2: {},
                toWorkform3: {},
                // 待受理状态
                serveStatus1001: false,
                serveStatus1002: false,
                serveStatus1003: false,
                serveStatus1004: false,
                serveStatus1005: false,
                serveStatus1008: false,
                // 判断角色代码
                id: "",
                // 负责人ID 多个
                ids: "",
                serveStatus: "",
                // 角色状态码
                code: "",
                users: {},
                users1: {},
                deleform: {},
                cancleWorkVisible: false,
                serveTimeFlag: false,
                par: "",
                // 支付金额
                payPrice: false,
                serveParPersonFlag1002: false,
                // 选择参与人的弹出框
                editPersonVisible: false,
                workPrincipalVisible: false,
                workManVisible: false,
                serveClasses: "",
                serveParPerson: [],
                maodian: '',
                checkRolekeys: [],
                defaultRoleProps: {
                    label: 'username'
                },
                payTypeFlag: false,
                payTypes: [{
                    "lable": "立即支付",
                    "key": "2"
                }],
            }
        },
        methods: {
   // 根据状态 显示不同的操作按钮
            findByServeStatus() {
                //调用我的接口
                this.$httpPost('/serveorder/serve/order/myServiceDetailsLook', {
                    "serveCode": this.editform.serveCode,
                }).then(res => {
                    this.editform=res.data.body;
                }, function(response) {

                });


                // 每次进来都要先初始化方法
                let serveStatus = this.editform.serveStatus;
                this.id = this.editform.id;
                this.serveStatus = serveStatus;

                this.serveStatus1001 = false;
                this.serveStatus1002 = false;
                this.serveStatus1003 = false;
                this.serveStatus1005 = false;
                this.serveStatus1004 = false;
                this.serveStatus1008 = false;


                this.$refs["editform"].clearValidate();


                // 待受理状态
                // 客服人员("10001"),班组长("10002"),负责人("10003"),参与人("10004"),业主或租户("10005");
                if (serveStatus == "1001") {
                } else if (serveStatus == "1002") {
                    this.serveStatus1001 = true;
                    this.code="10002";
                    this.selectuser();

                } else if (serveStatus == "1003") {
                    this.serveStatus1003 = true;
                    this.payPrice = true;
                } else if (serveStatus == "1004") {
                    this.serveParPersonFlag1002 = true;
                } else if (serveStatus == "1005") {
                    this.serveStatus1004 = true;
                    // this.serveStatus1005 = true;
                    this.code="10003";
                    this.selectuser();
                } else if (serveStatus == "1006") {
                    this.serveStatus1005 = true;
                }else if (serveStatus == "1008") {
                    this.serveStatus1008 = true;
                }
            },
            selectuser() {
                this.$httpPost('/system/user/role/getUserByRole', {
                    "code": this.code
                }).then(response => {
                    let data = response.data.body;
                    this.users = data;
                }, function (response) {

                });
            },
            //时间格式化
            dateFormat(row) {
                let date = new Date(parseInt(row));
                if (date == undefined) {
                    return "";
                }
                return formatDate(date, "yyyy-MM-dd hh:mm");
            },


        },
        //时间格式化
        dateFormat3(row) {
            if (row == null) {
                return "";
            }
            let date = new Date(parseInt(row));
            return formatDate(date, "yyyy-MM-dd hh:mm");
        },


        mounted() {
        	this.findByServeStatus();
            // 初始化时加载
            if(this.updateTem){
               this.$refs['editform'].clearValidate()
            }
        },
        props: [
            'haveDoneDetailParams','updateTem'
        ],
        watch: {
            haveDoneDetailParams(val) {
                //新增params的watch，监听变更并同步到editform上
                this.editform = val;
            	this.findByServeStatus();
			}
        }
    }
</script>


<style scoped>
    .dialog-footer {
        text-align: center;
        display: block;
    }
</style>
