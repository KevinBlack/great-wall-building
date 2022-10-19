
<template>
    <div class="wrap">
        <div class="subContent">
            <div class="tableWrap">
                <!--搜索功能-->
                <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                    <el-button type="primary" @click="toEdit()">创建</el-button>
                    <el-button type="primary" @click="toDelete()">删除</el-button>
                    <el-button type="primary" @click="search()">刷新</el-button>
                    <el-form-item label="">
                        <!-- 告警ID -->
                        <el-input v-model="searchForm.alarmId" clearable placeholder="告警ID"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <!-- 告警时间 -->
                        <el-input v-model="searchForm.alarmTime" clearable placeholder="告警时间"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <!-- 备注 -->
                        <el-input v-model="searchForm.remark" clearable placeholder="备注"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="search('param')">搜索</el-button>
                    </el-form-item>
                </el-form>
                <!--数据表格渲染-->
                <el-table ref="table" stripe :data="tableData" style="width: 100%" @selection-change="onSelect">
                    <el-table-column type="selection" width="60"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" type="index" label="序号" width="50"></el-table-column>
                    <!-- 告警ID -->
                    <el-table-column :show-overflow-tooltip="true" prop="alarmId" label="告警ID"></el-table-column>
                    <!-- 告警时间 -->
                    <el-table-column :show-overflow-tooltip="true" prop="alarmTime" label="告警时间" width="160"></el-table-column>
                    <!-- 备注 -->
                    <el-table-column :show-overflow-tooltip="true" prop="remark" label="备注"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" label="操作" width="180">
                        <template slot-scope="scope">
                            <el-button type="text" size="mini" @click="toEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button type="text" size="mini" @click="toDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页-->
                <el-pagination v-if="renovatePagination" @size-change="onSizeChange" @current-change="onCurrentChange" :current-page=pageNum :page-sizes="[10, 15, 20, 25]" :page-size=pageSize layout="total, sizes, prev, pager, next, jumper" :total=totolNum>
                </el-pagination>
            </div>

            <!--编辑弹出窗-->
            <el-dialog   title="新增" :visible.sync="editTableVisible" width="900px">
                <el-form  :model="editform" :rules="rules" ref="editform"  label-width="80px">
                        <el-col :span="12">
                            <el-form-item label="告警ID" prop="alarmId">
                                <!-- 告警ID -->
                                <el-input v-model="editform.alarmId"></el-input>
                            </el-form-item>
                        </el-col>
                         <el-col :span="12">
                             <!-- 告警时间 -->
                            <el-form-item label="告警时间">
                                <el-date-picker v-model="editform.alarmTime" type="datetime" value-format="timestamp"
                                                format="yyyy-MM-dd HH:mm" placeholder="告警时间">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="备注" prop="remark">
                                <!-- 备注 -->
                                <el-input v-model="editform.remark"></el-input>
                            </el-form-item>
                        </el-col>
                </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="save('editform')">确 定</el-button>
                <el-button @click="close('editform')">取 消</el-button>
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
    export default {
        // 变量初始化定义
        data() {
            return {
                tableData: [],
                pageNum: 1,
                pageSize: 10,
                totolNum: 100,
                //刷新分页
                renovatePagination: true,
                searchForm: {},
                editTableVisible: false,
                deleteVisible: false,
                editform: {},
                deleteIds: '',
                checkedArr: [],
                // 校验
                rules: {
                // 告警ID
                alarmId: [{
                        required: true,
                        message: '请输入告警ID',
                        trigger: 'blur'
                    }],
                // 告警时间
                alarmTime: [{
                        required: true,
                        message: '请输入告警时间',
                        trigger: 'blur'
                    }],
                // 备注
                remark: [{
                        required: true,
                        message: '请输入备注',
                        trigger: 'blur'
                    }],
                },
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
                if(type=='param'){
                    this.pageNum = 1;
                    this.renovatePagination = false;
                }
                this.$httpPost('/manage/alarmLog/find', {
                    // 告警ID
                    alarmId: this.searchForm.alarmId,
                    // 告警时间
                    alarmTime: this.searchForm.alarmTime,
                    // 备注
                    remark: this.searchForm.remark,
                    page: this.pageNum,
                    size: this.pageSize

                }).then(res => {
                    this.tableData = res.data.body.content;
                    this.totolNum = Number(res.data.body.totalElements);
                    this.renovatePagination = true
            })
            },
            // 弹出修改弹出框
            toEdit(index, row) {
                this.editform = {};
                this.editTableVisible = true;
                if(row){
                    this.editform = Object.assign({},row);
                }
            },
            // 修改 新增 保存
            save(formrule) {
                this.$refs[formrule].validate((valid) => {
                    if(valid) {
                        this.$httpPost('/manage/alarmLog/save', {
                        // ID
                        id: this.editform.id,
                        // 告警ID
                        alarmId: this.editform.alarmId,
                        // 告警时间
                        alarmTime: this.editform.alarmTime,
                        // 备注
                        remark: this.editform.remark,
                        }).then(res => {
                            this.editTableVisible = false;
                        this.search();
                    })
                    } else {
                        return false;
            }
            });
            },
            // 关闭弹出框
            close(formName) {
                this.editTableVisible = false;
                this[formName] = {};
                this.$refs[formName].resetFields();
            },
            // 删除操作赋值删除项  并弹窗
            toDelete(index, row) {
                if(index == undefined) {
                    //					没勾选
                    if(this.deleteIds == "") {
                        this.$message.error('请至少选择一条数据！');
                        return;
                    }
                }
                if(row) {
                    this.deleteIds = row.id;
                }
                this.deleteVisible = true;

            },
            // 删除 行  包括单选和多选
            deleteRow() {
                this.$httpPost('/manage/alarmLog/delete', {
                    id: this.deleteIds
                }).then(res => {
                    this.deleteVisible = false;
                this.deleteIds = "";
                this.search();
            })
            },
            // 表格选择改变事件
            onSelect(val) {
                this.checkedArr = val;
                let idsArr = [];
                for(var i = 0; i < val.length; i++) {
                    idsArr.push(val[i].id)
                }
                this.deleteIds = idsArr.join(',');
            }
        }
    }
</script>
<style lang="less">
    .el-dialog__headerbtn .el-dialog__close {
        color: #fff !important;
    }
</style>