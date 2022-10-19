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
                       <el-form-item >
                           <el-input placeholder="计划名称" v-model="searchForm.planName" clearable ></el-input>
                       </el-form-item>
                       <el-form-item label="开始日期">
                           <el-date-picker v-model="searchForm.beginTime" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd HH:mm" align="right">
                           </el-date-picker>
                       </el-form-item>

                       <el-form-item>
                           <el-button type="primary" @click="search()">搜索</el-button>
                       </el-form-item>
                    </div>

                </el-form>
                <!--数据表格渲染 @selection-change="onSelect"  :selectable='checkboxT'-->
                <el-table ref="table" stripe :data="tableData" style="width: 100%" >
                    <el-table-column type="selection"  width="60" disabled='true'></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" type="index" label="序号" width="50" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="planName" label="计划名称" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="organ" label="所属机构" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="circuit " label="线路" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="planStatus" label="状态" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="keepPeriod" label="巡检周期" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="keepType" label="巡检类型" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="beginTime" width="180" label="开始日期" :formatter="dateFormat" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="endTime"  width="180"  label="结束日期" :formatter="dateFormat" align="center"></el-table-column>
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
                            <el-form-item label="计划名称" prop="planName">
                                <el-input v-model="editform.planName" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="所属机构" prop="organ">
                                <el-input v-model="editform.organ" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="线路" prop="circuit">
                                <el-input v-model="editform.circuit" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="状态" prop="planStatus">
                                <el-input v-model="editform.planStatus" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="巡检周期" prop="keepPeriod">
                                <el-input v-model="editform.keepPeriod" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="巡检类型" prop="keepType">
                                <el-input  v-model="editform.keepType" :disabled="isDetail"></el-input>
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
    import { formatDate } from '../../../static/js/date.js'
    import { axiosHttp, api } from '@/libs'
    import Vue from 'vue'
    export default {
        // 变量初始化定义
        data() {
            return {
                tableData: [],
                //刷新分页
                renovatePagination: true,
                pageNum: 1,
                pageSize: 15,
                totolNum: 0,
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
                        // 巡检周期
                        keepPeriod: [{
                                 required: true,
                                 message: '请输入巡检周期',
                                 trigger: 'change'
                             }],
                        // 所属机构
                        organ: [{
                                required: true,
                                message: '请输入所属机构',
                                trigger: 'blur'
                            }],
                         // 开始日期
                         beginTime: [{
                                  required: true,
                                  message: '请选择开始日期',
                                  trigger: 'change'
                              }],
                          // 结束日期
                          endTime: [{
                                   required: true,
                                   message: '请选择结束日期',
                                   trigger: 'change'
                               }],
                        // 线路
                        circuit: [{
                                required: true,
                                message: '请输入线路',
                                trigger: 'blur'
                            }],
                       // 状态
                       planStatus: [{
                               required: true,
                               message: '请输入状态',
                               trigger: 'blur'
                           }]


                }
            }

        },
        // 页面加载时执行
        created: function() {
        	const _this = this;
            this.search();
           	/*const intervalTemp = setInterval(() => {
                _this.search()
            }, 3000)*/
           	// store.commit('SET_PUSH_INTERVAL',intervalTemp)
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
            search() {
             	let startTime = "";
				let endTime = "";
            	if(this.searchForm.taskStartTime != undefined) {
					startTime = formatDate(this.searchForm.beginTime[0], "yyyy-MM-dd hh:mm");

					endTime = formatDate(this.searchForm.beginTime[1], "yyyy-MM-dd hh:mm");
				}
                this.$http("post",'/manage/keepPlan/find', {
                	startTime:startTime,
                	endTime:endTime,
                    taskName: this.searchForm.planName,
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
                        if(this.editform.beginTime <= this.editform.endTime){
                            axiosHttp.post('/manage/keepPlan/save', {
                                // id
                                id: this.editform.id,
                                // 计划名称
                                planName: this.editform.planName,
                                // 所属机构
                                organ: this.editform.organ,
                                // 线路
                                circuit: this.editform.circuit,
                                // 状态
                                planStatus: this.editform.planStatus,
                                // 巡检周期
                                keepPeriod: this.editform.keepPeriod,
                                // 巡检类型
                                keepType: this.editform.keepType,
                                // 开始日期
                                beginTime: this.editform.beginTime,
                                // 结束日期
                                endTime: this.editform.endTime


                            }).then(res => {
                                this.search()
                                this.formDialogVisible = false;
                            })
                        }else{
                            this.$message.error('开始日期须小于等于结束日期');
                        }

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
                axiosHttp.post('/manage/keepPlan/delete', {
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
