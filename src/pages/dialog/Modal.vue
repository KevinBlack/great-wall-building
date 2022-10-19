<template id="modal">
    <div class="wrap">
        <!--{{editform}}-->
        <el-form :model="editform" :rules="rules" ref="editform" label-width="100px" width="30%">
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
            <!--<el-form-item label="服务描述">-->
            <!--<el-input v-model="editform.contentDescribe" :disabled="true"></el-input>-->
            <!--</el-form-item>-->
            <el-form-item label="问题描述" prop="contentDescribe">
                <el-input type="textarea" v-model="editform.contentDescribe" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="服务区域">
                <el-input v-model="editform.serveArea" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="联系电话">
                <el-input v-model="editform.customerPhone" :disabled="true"></el-input>
            </el-form-item>
            <div v-if="editform.price&&editform.serveStatus > 1002">
                <el-form-item label="支付金额">
                    <el-input v-model="editform.price" :disabled="true" class="w-25 m-r-10"></el-input>元
                </el-form-item>
                <el-form-item label="支付方式">
                    <el-input :value="editform.paymentType === '1001'?'支付宝':'微信'" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="支付状态">
                    <el-input :disabled="true" :value="editform.serveStatus === '1003'?'待支付':'已支付'"></el-input>
                </el-form-item>
            </div>
            <!--<el-form-item label="问题描述" prop="contentDescribe">-->
            <!--<el-input type="textarea" v-model="editform.contentDescribe" :disabled="true"></el-input>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="现场图片">
                <el-input v-model="editform.customerShootPicture"></el-input>
            </el-form-item>-->


            <!-- 上面的部分只是做展示  下面的部分 根据状态的不同显示不同的内容-->

            <!--状态1001显示班组长选择框-->
            <template v-if="serveStatus1001">
                <el-form-item label="班组长" prop="jobForeman">
                    <el-select v-model="editform.jobForeman" style="width: 200px;" clearable filterable
                               placeholder="用户名">
                        <el-option v-for="item in users" :key="item.id" :label="item.username" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </template>


            <template v-if="serveStatus1002">
                <el-form-item label="是否有偿" prop="serveClasses">
                    <!--<el-input v-model="editform.serveClasses"></el-input>-->
                    <el-radio-group v-model="editform.serveClasses" id="serveClasses" @change="radioChange">
                        <el-radio :label="1">有偿</el-radio>
                        <el-radio :label="2">无偿</el-radio>
                    </el-radio-group>
                    <!--</template>-->
                </el-form-item>
                <el-form-item label="金额" prop="price" v-if="payPrice">
                    <template>
                        <el-input v-model="editform.price" type="number"
                                  @change="setInput($event)" class="w-25 m-r-10"></el-input>元
                    </template>
                </el-form-item>
                <template v-if="payTypeFlag">
                    <el-form-item label="支付方式" prop="payType">
                        <el-select v-model="editform.payType" id="payType" style="margin-bottom:10px;" clearable
                                   filterable placeholder="支付方式">
                            <el-option v-for="item in payTypes" :key="item.key" :label="item.lable" :value="item.key">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </template>
                <template v-if="serveParPersonFlag1002">
                    <el-form-item label="负责人" prop="jobForeman">
                        <el-select v-model="editform.jobForeman" style="margin-bottom:10px;" clearable filterable
                                   placeholder="用户名">
                            <el-option v-for="item in users" :key="item.id" :label="item.username" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="参与人" prop="serveParPerson">
                        <el-input v-model="editform.serveParPerson" id="serveParPerson"
                                  v-on:click.native="selectParPerson"></el-input>
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
                    <el-select v-model="editform.jobForeman" style="margin-bottom:10px;" clearable filterable
                               placeholder="用户名">
                        <el-option v-for="item in users" :key="item.id" :label="item.username" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="参与人" prop="serveParPerson">
                    <el-input v-model="editform.serveParPerson" id="serveParPerson"
                              v-on:click.native="selectParPerson"></el-input>
                </el-form-item>
            </template>


            <template v-if="serveStatus1005">
                <el-form-item label="到场时间" prop="applyServeTime">
                    <el-date-picker v-model="editform.applyServeTime" type="datetime" value-format="timestamp"
                                    format="yyyy-MM-dd HH:mm" placeholder="选择到场时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="离场时间" prop="serveEndTime">
                    <el-date-picker v-model="editform.serveEndTime" type="datetime" format="yyyy-MM-dd HH:mm"
                                    placeholder="选择离场时间">
                    </el-date-picker>
                </el-form-item>
                <!--<el-form-item label="完成情况">
                    <el-input type="textarea" :row="2" :col="5" v-model="editform.remark"></el-input>
                </el-form-item>-->
            </template>
            <el-form-item label="备注">
                <el-input type="textarea" :row="2" :col="5" v-model="editform.remark"></el-input>
            </el-form-item>

        </el-form>


        <template v-if="serveStatus1001">
            <span slot="footer" class="dialog-footer">
                <el-button class="ok" type="primary" @click="paigong('editform','')">派工</el-button>
                <el-button type="primary" @click="cancleWork()">取消服务</el-button>
            </span>
        </template>
        <template v-if="serveStatus1002">
					<span slot="footer" class="dialog-footer">
					    <el-button class="ok" type="primary" @click="paigong('editform','')">派工</el-button>
					    <el-button type="primary" @click="cancleWork()">取消服务</el-button>
					    <el-button class="ok" type="primary" @click="zhuanpai()">转办</el-button>
				  	</span>
        </template>

        <template v-if="serveStatus1004">
                <span slot="footer" class="dialog-footer">
                    <el-button class="ok" type="primary" @click="paigong('editform','')">派工</el-button>
                    <!--<el-button class="ok" type="primary" @click="zhuanban('editform')">转办</el-button>-->
                </span>
        </template>

        <template v-if="serveStatus1005">
				<span slot="footer" class="dialog-footer">
				    <el-button class="ok" type="primary" @click="paigong('editform','')">办理</el-button>

				    <el-button class="ok" type="primary" @click="paigong('editform','cancle')">重新派工</el-button>
			  	</span>
        </template>


        <template v-if="serveStatus1008">
                <span slot="footer" class="dialog-footer">
                    <el-button class="ok" type="primary" @click="zhuanban('editform')">派工</el-button>
                </span>
        </template>


        <!--取消服务弹出框-->
        <el-dialog   title="取消服务" :visible.sync="cancleWorkVisible" :modal="false" width="30%">
            <div style="overflow: hidden;">
                <el-form ref="toWorkform" :model="deleform" label-width="80px">
                    <el-form-item label="取消原因">
                        <el-input type="textarea" :autosize="{minRows:5}" v-model="deleform.remark"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
			    <el-button class="ok" type="primary" @click="quxiaofuwu">确 定</el-button>
			    <el-button class="cancle" @click="cancleWorkVisible=false">取 消</el-button>
		  	</span>
        </el-dialog>

        <!--选择参与人-->
        <el-dialog   title="指派人员" id="editPersonVisible" :visible.sync="editPersonVisible" :modal="false">
            <template>
                <el-tree :data="serveParPerson" show-checkbox node-key="id" ref="allUser"
                         :default-checked-keys="checkRolekeys" :check-strictly=true :props="defaultRoleProps">
                </el-tree>
                <span slot="footer" class="dialog-footer">
			    <el-button class="ok" type="primary" @click="confirmPerson">确定</el-button>
			    <el-button class="cancle" @click="editPersonVisible=false">取 消</el-button>
		  	</span>
            </template>
        </el-dialog>


        <!--派给其他班组长-->
        <el-dialog   title="派给其他班组长" :visible.sync="workManVisible" :modal="false" width="30%">
            <div style="overflow: hidden;">
                <el-form :model="toWorkform2" :rules="ruleWork" ref="toWorkform2" label-width="80px">
                    <el-form-item label="班组长" prop="jobForeman">
                        <el-select v-model="toWorkform2.jobForeman" style="margin-bottom:10px;" clearable filterable
                                   placeholder="用户名">
                            <el-option v-for="item in users1" :key="item.id" :label="item.username" :value="item.id">
                            </el-option>
                        </el-select>

                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input type="textarea" :row="2" :col="5" v-model="toWorkform2.remark"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
			    <el-button class="ok" type="primary" @click="pai('toWorkform2')">确 定</el-button>
			    <el-button class="cancle" @click="workManVisible=false">取 消</el-button>
		  	</span>
        </el-dialog>


        <!--派给其他负责人-->
        <el-dialog   title="派给其他负责人" :visible.sync="workPrincipalVisible" :modal="false" width="30%" :before-close="closeDialog">
            <div style="overflow: hidden;">
            </div>
            <div style="overflow: hidden;">
                <el-form :model="toWorkform3" :rules="ruleWork3" ref="toWorkform3" label-width="80px">
                    <el-form-item label="负责人" prop="jobForeman">
                        <el-select v-model="toWorkform3.jobForeman" style="margin-bottom:10px;" clearable filterable
                                   placeholder="用户名">
                            <el-option v-for="item in users" :key="item.id" :label="item.username" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="参与人" prop="serveParPerson">
                        <el-input v-model="toWorkform3.serveParPerson" id="serveParPerson"
                                  v-on:click.native="selectParPerson('3')"></el-input>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input type="textarea" :row="2" :col="5" v-model="toWorkform3.remark"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
			    <el-button class="ok" type="primary" @click="toAnotherPrincipal('toWorkform3')">确 定</el-button>
			    <el-button class="cancle" @click="closeDialog">取 消</el-button>
		  	</span>
        </el-dialog>


    </div>
</template>

<script>
    // import { formatDate } from '../../../../static/js/date.js'

    export default {
        inject: ['reloadView'],
        data: function () {

            var checkPrice = (rule, value, callback) => {

                if (!value) {
                    return callback(new Error("金额不能为空"));
                } else {
                    if (value < 1000000) {
                        callback();
                    } else {
                        return callback(new Error("金额过大,不能超过1000000！"));
                    }
                }
            };
            return {
                editform: this.params,
                toWorkform: {},
                toWorkform2: {},
                toWorkform3: {},
                // 待受理状态
                serveStatus1001: false,
                serveStatus1002: false,
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

                ruleWork: {
                    jobForeman: [{
                        required: true,
                        message: '请选择班组长',
                        trigger: 'blur'
                    },]
                },
                ruleWork3: {
                    jobForeman: [{
                        required: true,
                        message: '请选择班组长',
                        trigger: 'change'
                    },],
                    serveParPerson: [{
                        required: true,
                        message: '请选择参与人',
                        trigger: 'change'
                    },],
                },
                rules: {
                    jobForeman: [{
                        required: true,
                        message: '请选择班组长',
                        trigger: 'blur'
                    },],
                    serveClasses: [{
                        required: true,
                        message: '请选择服务方式',
                        trigger: 'blur'
                    },],
                    price: [{
                        required: true,
                        validator: (rule,val,callback) => {
                            if(val === null || val === '') {
                                callback(new Error('请输入金额'))
                            }
                            else {
                                if(val == 0) callback(new Error('请输入大于0的金额'))
                            }
                        },
                        trigger: 'blur'
                    },],
                    payType: [{
                        required: true,
                        message: '请选择支付方式',
                        trigger: 'blur'
                    },],
                    jobForeman: [{
                        required: true,
                        message: '请选择班组长',
                        trigger: 'change'
                    },],
                    serveParPerson: [{
                        required: true,
                        message: '请选择参与人',
                        trigger: 'change'
                    },],
                    serveStartTime: [{
                        required: true,
                        message: '请选择到场时间',
                        trigger: 'blur'
                    },]
                },


            }
        },
        methods: {
            // 根据状态 显示不同的操作按钮
            findByServeStatus() {
                // 每次进来都要先初始化方法
                let serveStatus = this.editform.serveStatus;
                this.id = this.editform.id;
                this.serveStatus = serveStatus;

                this.serveStatus1001 = false;
                this.serveStatus1002 = false;
                this.serveStatus1005 = false;
                this.serveStatus1004 = false;
                this.serveStatus1008 = false;


                this.$refs["editform"].clearValidate();


                // 待受理状态
                // 客服人员("10001"),班组长("10002"),负责人("10003"),参与人("10004"),业主或租户("10005");
                if (serveStatus == "1001") {
                    this.code = "10002";
                    this.serveStatus1001 = true;
                    this.selectuser();
                } else if (serveStatus == "1002") {
                    this.serveStatus1002 = true;
                    this.serveParPersonFlag1002 = true;
                    this.code = "10003";
                    this.selectuser();
                    //  默认是无偿状态
                    this.editform.serveClasses = 2;
                    this.payPrice = false;
                    this.payTypeFlag = false;
                    this.editform.jobForeman = '';
                } else if (serveStatus == "1004") {
                    this.serveStatus1004 = true;
                    this.serveParPersonFlag1002 = true;
                    this.editform.jobForeman = "";
                    this.code = "10003";
                    this.selectuser();
                } else if (serveStatus == "1005") {
                    this.serveStatus1005 = true;
                    if (this.editform.par == "000") {
                        this.par = "000";
                        this.serveStatus1005 = false;
                    }
                } else if (serveStatus == "1008") {
                    this.serveStatus1008 = true;
                }
            },
            setInput(value){
                this.editform.price = Math.round(value*100)/100 + ''
                if(this.editform.price.length>8) this.editform.price=this.editform.price.slice(0,8)
            },
            // 关闭弹出框
            closeDialog() {
                this.workPrincipalVisible = false
                this.toWorkform3 = {}
                this.$refs.toWorkform3.resetFields();
            },
            state(row) {
                if (row === "1001") {
                    return "待受理";
                } else if (row === "1002") {
                    return "待核实";
                } else if (row === "1003") {
                    return "待支付";
                } else if (row === "1004") {
                    return "待派工";
                } else if (row === "1005") {
                    return "待办结";
                } else if (row === "1006") {
                    return "已办结";
                } else if (row === "1007") {
                    return "已评价";
                } else if (row === "1008") {
                    return "重新派工";
                } else if (row === "1009") {
                    return "取消服务";
                } else {
                    return null;
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
            // 显示取消服务的弹出框
            cancleWork() {
                this.cancleWorkVisible = true;
            },
            //  派工
            paigong(formrule, val) {
                let cancleFlag = ""
                if (this.serveStatus == '1005' && val == 'cancle') {
                    cancleFlag = '2';
                }
                this.$refs[formrule].validate((valid) => {
                    if (valid) {

                        //负责人办理时 ，办理按钮需要结束时间必填  其他按钮不需要
                        if (this.serveStatus1005 && val === '' && !this.editform.serveEndTime) {

                            this.$message({
                                type: 'error',
                                center: true,
                                message: '请选择离场时间'
                            });
                            return;
                        }
                        if(this.editform.serveEndTime&&(this.editform.serveEndTime.getTime()<this.editform.applyServeTime)){
                            this.$message({
                                type: 'error',
                                center: true,
                                message: '离场时间不能小于到场时间'
                            });
                            return;
                        };
                        this.$httpPost('/serveorder/serve/info/update', {
                            id: this.editform.id,
                            serveClasses: this.editform.serveClasses,
                            payType: this.editform.payType,
                            price: this.editform.price,
                            jobForeman: this.editform.jobForeman,
                            remark: this.editform.remark,
                            serveParPerson: this.editform.serveParPerson,
                            serveParPersonId: this.ids,
                            serveStartTime: this.editform.applyServeTime,
                            serveEndTime: this.editform.serveEndTime,
                            flag: cancleFlag
                        }).then(res => {
                            if (res.data.msg == "success") {
                                this.$message({
                                    type: 'success',
                                    center: true,
                                    message: '办理成功'
                                });
                                // this.$parent.serveorderDialog = false;

                                this.reloadView();
                            } else {
                                this.$message({
                                    type: 'error',
                                    center: true,
                                    message: res.data.msg,
                                });
                            }
                        })
                    }
                })
            },
            // 取消服务
            quxiaofuwu() {
                this.$httpPost('/serveorder/serve/info/delete', {
                    id: this.id,
                    remark: this.deleform.remark,
                }).then(res => {
                    if (res.data.msg == "success") {
                        this.$message({
                            message: '取消服务成功！',
                            center: true,
                            type: 'success'
                        });
                        //  刷新页面
                        this.reloadView();
                    } else {
                        this.cancleWorkVisible = false;
                        this.$message({
                            message: '取消服务失败',
                            center: true,
                            type: 'error'
                        });
                    }
                })
            },
            pai(formrule) {
                this.$refs[formrule].validate((valid) => {
                    if (valid) {
                        this.$httpPost('/serveorder/serve/info/toAnother', {
                            id: this.id,
                            jobForeman: this.toWorkform2.jobForeman,
                            remark: this.toWorkform2.remark,
                        }).then(res => {
                            if (res.data.msg == "success") {
                                this.workManVisible = false;
                                this.$message({
                                    message: '派工成功！',
                                    center: true,
                                    type: 'success'
                                });
                                this.reloadView();
                            } else {
                                this.WorkManVisible = false;
                                this.$message({
                                    message: '派工失败',
                                    center: true,
                                    type: 'error'
                                });
                            }
                        })
                    }
                })
            },
            zhuanban(formrule) {
                this.workPrincipalVisible = true;
                this.code = "10003";
                this.selectuser();
            },
            toAnotherPrincipal(formrule) {
                this.$refs[formrule].validate((valid) => {
                    if (valid) {
                        this.$httpPost('/serveorder/serve/info/toAnotherPrincipal', {
                            id: this.id,
                            serveParPerson: this.editform.serveParPerson,
                            serveParPersonId: this.ids,
                            jobForeman: this.toWorkform3.jobForeman,
                            remark: this.toWorkform3.remark,
                        }).then(res => {
                            if (res.data.msg == "success") {
                                this.WorkPrincipalVisible = false;
                                this.editTableVisible = false;
                                this.$message({
                                    message: '转派成功！',
                                    center: true,
                                    type: 'success'
                                });
                                this.reloadView();
                            } else {
                                this.WorkPrincipalVisible = false;
                                this.editTableVisible = false;
                                this.$message({
                                    message: '转派失败',
                                    center: true,
                                    type: 'error'
                                });
                            }
                        })
                    }
                })
            },
            // 客服人员("10001"),班组长("10002"),负责人("10003"),参与人("10004"),业主或租户("10005");
            // 支付方式改变后的显示
            radioChange(row, val) {
                if (val != 2) {
                    this.$refs['editform'].clearValidate();
                }
                // 无偿
                if (row == 2) {
                    //this.flag = true;
                    this.serveParPersonFlag1002 = true;
                    this.payPrice = false;
                    this.payTypeFlag = false;
                    this.code = "10003";
                    this.editform.payType = '';
                    this.editform.price = '';
                    this.selectuser();
                } else if (row == 1) {
                    this.payTypeFlag = true;
                    this.payPrice = true;
                    this.code = "10003";
                    // this.flag = false;
                    this.serveParPersonFlag1002 = false;
                    this.editform.jobForeman = '';
                    this.editform.serveParPerson = '';
                }


            },

            // 参与人选择
            selectParPerson(item) {
                this.maodian = item;
                this.$httpPost('/system/user/role/getUserByRole', {
                    "code": '10004'
                }).then(response => {
                    let data = response.data.body;
                    this.serveParPerson = data;
                }, function (response) {

                });
                this.editPersonVisible = true;

            },
            // 参与人选择确定
            confirmPerson() {

                let ids = this.$refs.allUser.getCheckedKeys();
                let usernames = [];
                for (let i = 0; i < this.$refs.allUser.getCheckedNodes().length; i++) {
                    usernames.push(this.$refs.allUser.getCheckedNodes()[i].username);
                }
                this.ids = ids.join();

                if (this.maodian == 3) {
                    this.toWorkform3.serveParPerson = usernames.join();
                } else {
                    this.editform.serveParPerson = usernames.join();
                }
                this.$refs.allUser.setCheckedKeys([]);
                this.editPersonVisible = false;

            },
            // 状态1002 下的转派功能
            zhuanpai() {
                this.workManVisible = true;
                this.selectuserss();
                this.toWorkform2 = {};

            },
            // 转派 防止与方法selectuser()冲突
            selectuserss() {
                this.$httpPost('/system/user/role/getUserByRole', {
                    "code": "10002",
                }).then(response => {
                    let data = response.data.body;
                    this.users1 = data;
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

        mounted() {
            // 初始化时加载
            this.findByServeStatus()
            if (this.updateTem) {
                this.$refs['editform'].clearValidate()
            }
        },
        props: [
            'params', 'updateTem'
        ],
        watch: {
            params(val) {
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
