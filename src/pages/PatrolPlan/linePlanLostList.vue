<template>
    <div class="wrap">
        <div class="subContent zr-row">
            <div class="tableWrap">
                <!--搜索功能-->
                <el-form :inline="true" :model="searchForm" class="demo-form-inline zr-row-scatter" >
                	<div>
                        <el-form-item>
                            <el-button type="primary" @click="toEdit()">新增</el-button>
                        </el-form-item>
                    </div>
                    <div>
                        <el-form-item>
                            <el-input placeholder="计划名称" v-model="searchForm.planName" clearable ></el-input>
                        </el-form-item>
                        <el-form-item label="">
                        	<el-date-picker v-model="searchForm.beginTime" type="datetimerange" range-separator="至" start-placeholder="巡检开始日期" end-placeholder="巡检结束日期" format="yyyy-MM-dd HH:mm" >
                        	</el-date-picker>
                        </el-form-item>
                        <el-form-item label="">
                             <el-input placeholder="巡检人员/任务组" v-model="searchForm.keyword" clearable ></el-input>
                         </el-form-item>
                         <!--<el-form-item >
                             <el-input placeholder="关键字" v-model="searchForm.keyword" clearable ></el-input>
                         </el-form-item>-->
                         <el-form-item>
                             <el-button type="primary" @click="search('param')">搜索</el-button>
                         </el-form-item>
                    </div>
                </el-form>
                <!--数据表格渲染-->
                <el-table ref="table" stripe :data="tableData" style="width: 100%" >
                    <el-table-column type="selection"  width="60" disabled='true'></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" type="index" label="序号" width="50" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="planName" label="计划名称" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="keepTime" width="180" label="巡检日期" :formatter="dateFormat" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="circuit" label="线路名称" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="beginTime" width="180" label="开始时间" :formatter="dateFormat" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="endTime" width="180" label="结束时间" :formatter="dateFormat" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="funneledNumber"  label="漏点数" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="totalNumber"  label="总点数" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="keepName"  label="巡检人员/任务组" align="center"></el-table-column>
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
                        <el-col :span="12">
                            <el-form-item label="计划名称" prop="planName">
                                <el-input v-model="editform.planName" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="巡检日期" prop="keepTime">
                                <el-date-picker v-model="editform.keepTime" type="datetime" value-format="timestamp"
                                                    format="yyyy-MM-dd HH:mm" placeholder="巡检日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="线路名称" prop="circuit">
                                <el-input v-model="editform.circuit" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                             <el-form-item label="开始日期" prop="beginTime">
                                 <el-date-picker v-model="editform.beginTime" type="datetime" value-format="timestamp"
                                                     format="yyyy-MM-dd HH:mm" placeholder="开始时间">
                                 </el-date-picker>
                             </el-form-item>
                         </el-col>
                        <el-col :span="12">
                             <el-form-item label="结束日期" prop="endTime">
                                 <el-date-picker v-model="editform.endTime" type="datetime" value-format="timestamp"
                                                     format="yyyy-MM-dd HH:mm" placeholder="结束时间">
                                 </el-date-picker>
                             </el-form-item>
                         </el-col>
                        <el-col :span="12">
                            <el-form-item label="漏点数" prop="funneledNumber">
                                <el-input v-model="editform.funneledNumber" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="总点数" prop="totalNumber">
                                <el-input v-model="editform.totalNumber" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="巡查人员/任务组" prop="keepName">
                                <el-input v-model="editform.keepName" :disabled="isDetail"></el-input>
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
            var checkLostNumber = (rule, value, callback) => {
            	if(!value) {
            		return callback(new Error("请输入漏点数"));
            	} else {
            		const reg = /^[0-9]*$/
            		if(reg.test(value)) {
            			callback();
            		} else {
            			return callback(new Error("只能输入大于等于0的整数！"));
            		}
            	}
            };
            var checkTotalNumber = (rule, value, callback) => {
            	if(!value) {
            		return callback(new Error("请输入总点数"));
            	} else {
            		const reg = /^[1-9]*$/
            		if(reg.test(value)) {
            			callback();
            		} else {
            			return callback(new Error("只能输入大于0的整数！"));
            		}
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
                      //计划名称
                      planName: [{
                              required: true,
                              message: '请输入计划名称',
                              trigger: 'blur'
                          }],
                      // 巡检日期
                      keepTime: [{
                               required: true,
                               message: '请选择巡检时间',
                               trigger: 'change'
                           }],
                      // 线路名称
                      circuit: [{
                              required: true,
                              message: '请输入线路名称',
                              trigger: 'blur'
                          }],
                       // 开始时间
                       beginTime: [{
                                required: true,
                                message: '请选择开始时间',
                                trigger: 'change'
                            }],
                        // 结束时间
                        endTime: [{
                                 required: true,
                                 message: '请选择结束时间',
                                 trigger: 'change'
                             }],
                      // 漏点数
                      funneledNumber: [{
                              required: true,
                              validator: checkLostNumber,
                              trigger: 'blur'
                          }],
                     // 总点数
                     totalNumber: [{
                             required: true,
                             validator: checkTotalNumber,
                             trigger: 'blur'
                         }],
                    // 巡检人员/任务组
                    keepName: [{
                            required: true,
                            message: '请输入巡检人员/任务组',
                            trigger: 'blur'
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
                let startTime = "";
                let endTime = "";
                if(this.searchForm.taskStartTime != undefined) {
                	startTime = formatDate(this.searchForm.beginTime[0], "yyyy-MM-dd hh:mm");

                	endTime = formatDate(this.searchForm.beginTime[1], "yyyy-MM-dd hh:mm");
                }
                this.$httpPost('/manage/keepFunneled/find', {
                    planName: this.searchForm.planName,
                    keyword: this.searchForm.keyword,
                    startTime:startTime,
                    endTime:endTime,
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
                            this.$message.error('开始日期不能大于结束日期');
                            return;
                        }
                        if(this.editform.funneledNumber > this.editform.totalNumber){
                            this.$message.error('漏点数须小于总点数');
                            return;
                        }
                        axiosHttp.post('/manage/keepFunneled/save', {
                            // id
                            id: this.editform.id,
                            // 计划名称
                            planName: this.editform.planName,
                            // 巡检日期
                            keepTime: this.editform.keepTime,
                            // 线路名称
                            circuit: this.editform.circuit,
                            // 开始时间
                            beginTime: this.editform.beginTime,
                            // 结束时间
                            endTime: this.editform.endTime,
                            // 漏点数
                            funneledNumber: this.editform.funneledNumber,
                            // 总点数
                            totalNumber: this.editform.totalNumber,
                            // 巡检人员/任务组
                            keepName: this.editform.keepName


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
                axiosHttp.post('/manage/keepFunneled/delete', {
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
                let dateTime = new Date(parseInt(cellValue));
                if(dateTime == undefined) {
                    return "";
                }
                return formatDate(dateTime, "yyyy-MM-dd hh:mm");
            }
        }
    }
</script>
