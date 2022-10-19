<template>
    <div class="wrap">
        <div class="subContent zr-row">
            <div class="tableWrap">
                <!--搜索功能-->
                <el-form :inline="true" :model="searchForm" class="demo-form-inline zr-row-scatter">
                    <div>
                        <el-form-item>
                            <el-button type="primary" @click="toEdit()">新增</el-button>
                        </el-form-item>
                    </div>
                    <div>
                    <el-form-item label="车牌号">
                        <el-input placeholder="车牌号" v-model="searchForm.plateNumber" clearable ></el-input>
                    </el-form-item>
                    <el-form-item >
                        <el-input placeholder="关键字" v-model="searchForm.keyword" clearable ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="search('param')">搜索</el-button>
                    </el-form-item>
                    </div>
                </el-form>
                <!--数据表格渲染-->
                <el-table ref="table" stripe :data="tableData" style="width: 100%">
                    <el-table-column type="selection"  width="60" disabled='true'></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" type="index" label="序号" width="50" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="plateName"   label="停车场名称" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="chargingNumber" label="桩号码" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="plateNumber" label="车牌号" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="powertKou" label="充电口" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="chargeMode" label="充电方式" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="platePepole" label="用户名" align="center" ></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="beginTime" label="开始时间" width="180" :formatter="dateFormat" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="endTime"  label="结束时间" width="180" :formatter="dateFormat" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="acountTime"  label="累计时间" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="acountPayable"  label="累计金额(元)" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="chargeTotal"  label="充电量" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="isFinish"  label="是否完成" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="plateStatus"  label="支付状态" align="center"></el-table-column>
                    <el-table-column label="操作" width="180" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" size="mini" @click="toEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button type="text" size="mini" @click="toDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页-->
                <el-pagination v-if="renovatePagination" @size-change="onSizeChange" @current-change="onCurrentChange" :current-page="pageNum" :page-sizes="[15, 20, 25, 30]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totolNum">
                </el-pagination>
            </div>
            <!--编辑弹出窗-->
            <el-dialog   :title="isDetail?'查看详情':(editform.id?'编辑':'新增')" :visible.sync="formDialogVisible" :before-close="close" width="50%">
                <el-form  :model="editform" :rules="rules" ref="editform"  label-width="140px">
                        <el-col :span="24">
                            <el-form-item label="停车场名称" prop="plateName">
                                <el-input v-model="editform.plateName" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="桩号码" prop="chargingNumber">
                                <el-input v-model="editform.chargingNumber" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="车牌号" prop="plateNumber">
                                <el-input v-model="editform.plateNumber" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="充电方式" prop="chargeMode">
                                <el-input v-model="editform.chargeMode" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="用户名" prop="platePepole">
                                <el-input v-model="editform.platePepole" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="充电口" prop="powertKou">
                                <el-input v-model="editform.powertKou" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="开始时间" prop="beginTime">
                                <el-date-picker v-model="editform.beginTime" type="datetime" value-format="timestamp"
                                                    format="yyyy-MM-dd HH:mm" placeholder="开始时间">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                       <el-col :span="12">
                            <el-form-item label="结束时间" prop="endTime">
                                <el-date-picker v-model="editform.endTime" type="datetime" value-format="timestamp"
                                                    format="yyyy-MM-dd HH:mm" placeholder="结束时间">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                             <el-form-item label="累计时间(小时)" prop="acountTime">
                                 <el-input  v-model="editform.acountTime" :disabled="isDetail"></el-input>
                             </el-form-item>
                         </el-col>
                        <el-col :span="12">
                            <el-form-item label="累计金额(元)" prop="acountPayable">
                                <el-input  v-model="editform.acountPayable" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="充电量(度)" prop="chargeTotal">
                                <el-input  v-model="editform.chargeTotal" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="是否完成" prop="isFinish">
                                <el-select v-model="editform.isFinish" placeholder="请选择" clearable :disabled="isDetail">
                                	<el-option label="是" value="是"></el-option>
                                	<el-option label="否" value="否"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="支付状态" prop="plateStatus">
                                <el-select v-model="editform.plateStatus" placeholder="支付状态" clearable :disabled="isDetail">
                                	<el-option label="已支付" value="已支付"></el-option>
                                	<el-option label="未支付" value="未支付"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="save()">确 定</el-button>
                    <el-button @click="close()">取 消</el-button>
                </span>
            </el-dialog>
            <!--删除提示框-->
            <el-dialog   title="提示" :visible.sync="deleteVisible" width="30%">
                <span>确定删除？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="deleteRow()">确 定</el-button>
                    <el-button @click="deleteVisible = false">取 消</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import { api, dict, axiosHttp,util } from '@/libs'
    import Vue from 'vue'
    import { formatDate } from '../../../static/js/date.js'
    export default {
        // 变量初始化定义
        data: function() {
			var checkPayment = (rule, value, callback) => {
				if(!value) {
					return callback(new Error("请输入累计金额"));
				} else {
                    const reg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/
                    if(reg.test(value)) {
                    	callback();
                    } else {
                    	return callback(new Error("只能输入大于0的数,小数保留两位！"));
                    }

				}
			};
            var checkHours = (rule, value, callback) => {
            	if(!value) {
            		return callback(new Error("请输入累计金额"));
            	} else {
                    const reg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1})?$/
                    if(reg.test(value)) {
                    	callback();
                    } else {
                    	return callback(new Error("只能输入大于0的数,小数保留一位！"));
                    }

            	}
            };
            var checkEletric = (rule, value, callback) => {
            	if(!value) {
            		return callback(new Error("请输入充电量"));
            	} else {
                    const reg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1})?$/
                    if(reg.test(value)) {
                    	callback();
                    } else {
                    	return callback(new Error("只能输入大于0的数,小数保留一位！"));
                    }

            	}
            };
            var beginTime = (rule, value, callback) => {
            	if(!value) {
            		return callback(new Error("请选择开始时间"));
            	} else {
                        if(this.editform.endTime){
                            if(value < this.editform.endTime){
                                this.editform.acountTime =  Number(((this.editform.endTime - value )/1000/3600).toString().match(/^\d+(?:\.\d{0,1})?/))
                                this.$forceUpdate()
                            }else{
                                return callback(new Error("开始时间须早于结束时间"));
                            }
                        }
                    	callback();

            	}
            };
            var endTime = (rule, value, callback) => {
            	if(!value) {
            		return callback(new Error("请选择结束时间"));
            	} else {
                        if(this.editform.beginTime){
                            if(value > this.editform.beginTime){
                                this.editform.acountTime =  Number(((value - this.editform.beginTime)/3600/1000).toString().match(/^\d+(?:\.\d{0,1})?/))
                                this.$forceUpdate()
                            }else{
                                return callback(new Error("结束时间不得早于开始时间"));
                            }

                        }
                    	callback();


            	}
            };
            return {
                tableData: [],
                //刷新分页
                renovatePagination: true,
                pageNum: 1,
                pageSize: 15,
                totolNum: 100,
                searchForm: {},
                editform: {},
                deleteIds: '',
                checkedArr: [],
                deleteVisible: false,
                //是否为详情，并设置是否disable
                isDetail:false,
                formDialogVisible :false,
                // 校验
                rules: {
                      //停车场名称
                      plateName: [{
                              required: true,
                              message: '请输入停车场名称',
                              trigger: 'blur'
                          }],
                      // 桩号码
                      chargingNumber: [{
                              required: true,
                              message: '请输入桩号码',
                              trigger: 'blur'
                          }],
                      // 车牌号
                      plateNumber: [{
                              required: true,
                              message: '请输入车牌号',
                              trigger: 'blur'
                          }],
                     // 充电口
                     powertKou: [{
                              required: true,
                              message: '请输入充电口',
                              trigger: 'blur'
                          }],
                      // 充电方式
                      chargeMode:[{
                              required: true,
                              message: '请选择充电方式',
                              trigger: 'change'
                          }],
                     // 开始时间
                     beginTime: [{
                              required: true,
                              validator: beginTime,
                              trigger: 'change'
                          }],
                     // 结束时间
                    endTime: [{
                                required: true,
                                validator: endTime,
                                trigger: 'change'
                            }],
                    // 累计时间
                    acountTime: [{
                             required: true,
                             validator: checkHours,
                             trigger: 'change'
                         }],
                      // 用户名
                      platePepole: [{
                              required: true,
                              message: '请输入用户名',
                              trigger: 'blur'
                          }],
                     // 累计金额
                     acountPayable: [{
                              required: true,
                              validator: checkPayment,
                              trigger: 'change'
                          }],
                    // 充电量
                    chargeTotal: [{
                             required: true,
                             validator: checkEletric,
                             trigger: 'change'
                         }],
                    // 是否完成
                    isFinish: [{
                             required: true,
                             message: '请选择是否完成',
                             trigger: 'change'
                         }],
                     // 支付状态
                     plateStatus: [{
                              required: true,
                              message: '请选择支付状态',
                              trigger: 'change'
                          }]

                }
            }

        },
        // 页面加载时执行
        created: function() {
            this.search();
        },
        // 自定义方法
        methods: {
            //页码数改变
            onSizeChange(val) {
                this.pageSize = val;
                this.search();
            },
            //页码改变
            onCurrentChange(val) {
                this.pageNum = val;
                this.search();
            },
            // 初始化表格 搜索功能
            search(type) {
                this.$httpPost('/manage/chargingOrder/find', {
                    plateNumber: this.searchForm.plateNumber,
                    keyword: this.searchForm.keyword,
                    page: this.pageNum,
                    size: this.pageSize
                }).then(res => {
                    this.tableData = res.data.body.content;
                    this.totolNum = Number(res.data.body.totalElements)
                })
            },
            // 弹出修改弹出框
            toEdit(index, row) {
                this.editform = {}
                this.formDialogVisible = true;
                this.isDetail=false;
                if(row){
                    this.editform = Object.assign({itemIndex:index},row);

                }
            },
            // 修改 新增 保存
            save() {
                this.$refs.editform.validate((valid) => {
                    if(valid) {
                        if(this.editform.beginTime > this.editform.endTime){
                            this.$message.error('开始时间不得晚于结束时间');
                            return
                        }

                        axiosHttp.post('/manage/chargingOrder/save', {
                            // id
                            id: this.editform.id,
                            // 停车场名称
                            plateName: this.editform.plateName,
                            // 桩号码
                            chargingNumber: this.editform.chargingNumber,
                            // 车牌号
                            plateNumber: this.editform.plateNumber,
                            // 充电口
                            powertKou: this.editform.powertKou,
                            // 充电方式
                            chargeMode: this.editform.chargeMode,
                            // 用户名
                            platePepole: this.editform.platePepole,
                            // 开始时间
                            beginTime: this.editform.beginTime,
                            // 结束时间
                            endTime: this.editform.endTime,
                            // 累计时间
                            acountTime: this.editform.acountTime,
                            // 累计金额
                            acountPayable: this.editform.acountPayable,
                            // 充电量
                            chargeTotal: this.editform.chargeTotal,
                            // 是否完成
                            isFinish: this.editform.isFinish,
                            // 支付状态
                            plateStatus: this.editform.plateStatus
                        }).then(res => {
                            this.search()
                            this.formDialogVisible = false;
                        })
                    } else {
                        return false;
                    }
               });
            },
            // 关闭弹出框
            close() {
                this.formDialogVisible = false;
                this.$refs.editform.resetFields();
            },
            // 删除操作赋值删除项  并弹窗
            toDelete(index, row) {
                if(row) {
                    this.deleteIds = row.id;
                    this.deleteVisible = true;
                } else {
                    if (this.$refs.table.store.states.selection.length > 0) {
                        this.deleteVisible = true;
                    } else {
                        this.$message.error('请至少选择一条数据');
                    }
                }

            },
            // 删除 行  包括单选和多选
            deleteRow() {
                axiosHttp.post('/manage/chargingOrder/delete', {
                    id: this.deleteIds
                }).then(res => {
                    this.deleteVisible = false;
                    this.deleteIds = "";
                    this.search();
                })
            },
            // 时间格式化
            dateFormat(row, column, cellValue) {
            	if(cellValue==null||cellValue==""){
            		return "";
            	}
                let date = new Date(parseInt(cellValue));
                if(date == undefined) {
                    return "";
                }
                return formatDate(date, "yyyy-MM-dd hh:mm");
            }
        }
    }
</script>
