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
                    <el-table-column :show-overflow-tooltip="true" prop="plateName" label="停车场名称" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="chargingNumber" label="桩号码" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="plateStatus" label="使用状态" align="center"></el-table-column>
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
                            <el-form-item label="使用状态" prop="plateStatus">
                                <el-select v-model="editform.plateStatus" placeholder="使用状态" clearable :disabled="isDetail">
                                	<el-option label="已使用" value="已使用"></el-option>
                                	<el-option label="未使用" value="未使用"></el-option>
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
        data() {
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
                      // 使用状态
                      plateStatus: [{
                              required: true,
                              message: '请输入使用状态',
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
                this.$httpPost('/manage/chargingPile/find', {
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
                        this.editform.consumption = this.editform.readNumber - this.editform.beforeReadNumber
                        this.editform.chargingSum = this.editform.chargingPrice * this.editform.consumption
                        axiosHttp.post('/manage/chargingPile/save', {
                            // id
                            id: this.editform.id,
                            // 停车场名称
                            plateName: this.editform.plateName,
                            // 桩号码
                            chargingNumber: this.editform.chargingNumber,
                            // 使用状态
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
                axiosHttp.post('/manage/chargingPile/delete', {
                    id: this.deleteIds
                }).then(res => {
                    this.deleteVisible = false;
                this.deleteIds = "";
                this.search();
            })
            }
        }
    }
</script>
