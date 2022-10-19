<template>
    <div class="wrap">
        <div class="subContent zr-row">
            <div class="tableWrap">
                <!--搜索功能-->
                <el-form :inline="true" :model="searchForm" class="demo-form-inline zr-row-scatter" >
                    <div>
                       <el-form-item style="margin-left:0">
                           <el-button type="primary" @click="toEdit()">新增</el-button>
                       </el-form-item>
                       <el-form-item style="margin-left:0">
                           <el-button type="primary" @click="reload()">刷新</el-button>
                       </el-form-item>
                    </div>
                    <div>
                       <el-form-item label="入场时间">
                       	<el-date-picker v-model="searchForm.plateTime" type="datetimerange" range-separator="至" start-placeholder="入场开始日期" end-placeholder="入场结束日期" format="yyyy-MM-dd HH:mm" >
                       	</el-date-picker>
                       </el-form-item>
                       <el-form-item label="车牌号">
                           <el-input placeholder="车牌号" v-model="searchForm.plateNumber" clearable ></el-input>
                       </el-form-item>
                       <!--<el-form-item >
                           <el-input placeholder="关键字" v-model="searchForm.keyword" clearable ></el-input>
                       </el-form-item>-->
                       <el-form-item>
                           <el-button type="primary" @click="search()">搜索</el-button>
                       </el-form-item>
                    </div>
                </el-form>
                <!--数据表格渲染-->
                <el-table ref="table" stripe :data="tableData" style="width: 100%">
                    <el-table-column type="selection" width="60" disabled='true'></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" type="index" label="序号" width="50" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="plateNumber" label="车牌号" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="plateName"   label="停车场名称" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="plateTime"   label="入场时间" width="180" align="center" :formatter="dateFormat"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="comeTime"    label="出场时间" width="180" align="center" :formatter="dateFormat"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="paymentMethod" label="缴费方式" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="dealPayable"   label="应缴金额" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="paidAmount"    label="实缴金额" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="plateStatus"   label="支付状态" align="center"></el-table-column>
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
                <el-form  :model="editform" :rules="rules" ref="editform"  label-width="120px">
                        <el-col :span="12">
                            <el-form-item label="车牌号" prop="plateNumber">
                                <el-input v-model="editform.plateNumber" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="停车场名称" prop="plateName">
                                <el-input v-model="editform.plateName" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="入场时间" prop="plateTime">
                                <el-date-picker v-model="editform.plateTime" type="datetime" value-format="timestamp"
                                                    format="yyyy-MM-dd HH:mm" placeholder="入场时间">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                             <el-form-item label="出场时间" prop="comeTime">
                                 <el-date-picker v-model="editform.comeTime" type="datetime" value-format="timestamp"
                                                     format="yyyy-MM-dd HH:mm" placeholder="出场时间">
                                 </el-date-picker>
                             </el-form-item>
                         </el-col>
                        <el-col :span="12">
                            <el-form-item label="缴费方式" prop="paymentMethod">
                                <el-input v-model="editform.paymentMethod" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="实缴金额" prop="paidAmount">
                                <el-input v-model="editform.paidAmount" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>

                       <el-col :span="12">
                           <el-form-item label="应缴金额" prop="dealPayable">
                               <el-input v-model="editform.dealPayable" :disabled="isDetail"></el-input>
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
					return callback(new Error("输入框不能为空"));
				} else {
                    const reg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/
                    if(reg.test(value)) {
                    	callback();
                    } else {
                    	return callback(new Error("只能输入大于0的数,小数保留两位！"));
                    }

				}
			};
            return {
                tableData: [],
                //刷新分页
                renovatePagination: true,
                formDialogVisible:false,
                deleteVisible:false,
                isDetail:false,
                pageNum: 1,
                pageSize: 15,
                totolNum: 100,
                searchForm: {},
                editform: {},
                deleteIds: '',
                checkedArr: [],
                // 校验
                rules: {
                      //停车场名称
                      plateName: [{
                              required: true,
                              message: '请输入停车场名称',
                              trigger: 'blur'
                          }],
                      // 车牌号
                      plateNumber: [{
                              required: true,
                              message: '请输入车牌号',
                              trigger: 'blur'
                          }],
                     // 缴费方式
                     paymentMethod: [{
                              required: true,
                              message: '请选择缴费方式',
                              trigger: 'change'
                          }],
                      // 应缴金额
                      dealPayable:[{
                              required: true,
                              validator: checkPayment,
                              trigger: 'blur'
                          }],
                     // 入场时间
                     plateTime: [{
                              required: true,
                              message: '请选择入场时间',
                              trigger: 'change'
                          }],
                     // 出场时间
                    comeTime: [{
                                required: true,
                                message: '请选择出场时间',
                                trigger: 'change'
                            }],
                      // 实缴金额
                      paidAmount : [{
                              required: true,
                              validator: checkPayment,
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
            reload(){
            	this.search();
            },
            // 初始化表格 搜索功能
            search() {
                this.$httpPost('/manage/payment/find', {
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
                        if(this.editform.plateTime > this.editform.comeTime){
                            this.$message.error('入场时间须早于出场时间');
                            return
                        }
                        if(this.editform.dealPayable < this.editform.paidAmount){
                            this.$message.error('实缴金额须小于应缴金额');
                            return
                        }
                        axiosHttp.post('/manage/payment/save', {
                            // id
                            id: this.editform.id,
                            // 停车场名称
                            plateName: this.editform.plateName,
                            // 车牌号
                            plateNumber: this.editform.plateNumber,
                            // 缴费方式
                            paymentMethod: this.editform.paymentMethod,
                            // 入场时间
                            plateTime: this.editform.plateTime,
                            // 出场时间
                            comeTime: this.editform.comeTime,
                            // 支付状态
                            plateStatus: this.editform.plateStatus,
                            // 应缴金额
                            dealPayable: this.editform.dealPayable,
                            // 实缴金额
                            paidAmount: this.editform.paidAmount
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
                axiosHttp.post('/manage/payment/delete', {
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
