
<template>
    <div class="wrap">
        <div class="subContent">
            <div class="tableWrap">
                <!--搜索功能-->
                <el-form :inline="true" :model="searchForm" class="zr-row-scatter">
                    <div>
                        <el-button type="primary" @click="toEdit()">创建</el-button>
                        <el-button type="primary" @click="toDelete()">批量删除</el-button>
                        <el-button type="primary" @click="search()">刷新</el-button>
                    </div>
                    <div>
                        <el-form-item label="">
                            <!-- 保养配置id -->
                            <el-input v-model="searchForm.maintainConfigId" clearable placeholder="保养配置id"></el-input>
                        </el-form-item>
                        <el-form-item label="">
                            <!-- 检查项目/质量标准 -->
                            <el-input v-model="searchForm.content" clearable placeholder="检查项目/质量标准"></el-input>
                        </el-form-item>
                        <el-form-item label="">
                            <!-- 必检项 1，是，0，否 -->
                            <el-input v-model="searchForm.isWhether" clearable placeholder="必检项 1，是，0，否"></el-input>
                        </el-form-item>
                        <el-form-item label="">
                            <!-- 0要点 1标准 2动态要点 3动态标准 -->
                            <el-input v-model="searchForm.flag" clearable placeholder="0要点 1标准 2动态要点 3动态标准"></el-input>
                        </el-form-item>
                        <el-form-item label="">
                            <!-- 备注 -->
                            <el-input v-model="searchForm.remark" clearable placeholder="备注"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="search('param')">搜索</el-button>
                        </el-form-item>
                    </div>
                </el-form>
                <!--数据表格渲染-->
                <el-table ref="table" stripe :data="tableData" style="width: 100%" @selection-change="onSelect">
                    <el-table-column type="selection" width="60"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" type="index" label="序号" width="50"></el-table-column>
                    <!-- 保养配置id -->
                    <el-table-column :show-overflow-tooltip="true" prop="maintainConfigId" label="保养配置id"></el-table-column>
                    <!-- 检查项目/质量标准 -->
                    <el-table-column :show-overflow-tooltip="true" prop="content" label="检查项目/质量标准"></el-table-column>
                    <!-- 必检项 1，是，0，否 -->
                    <el-table-column :show-overflow-tooltip="true" prop="isWhether" label="必检项 1，是，0，否"></el-table-column>
                    <!-- 0要点 1标准 2动态要点 3动态标准 -->
                    <el-table-column :show-overflow-tooltip="true" prop="flag" label="0要点 1标准 2动态要点 3动态标准"></el-table-column>
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
            <el-dialog   :title="isDetail?'查看详情':(editform.id?'编辑':'新增')" :visible.sync="formDialogVisible" :before-close="close" width="900px">
                <el-form  :model="editform" :rules="rules" ref="editform"  label-width="80px">
                        <el-col :span="12">
                            <el-form-item label="保养配置id" prop="maintainConfigId">
                                <!-- 保养配置id -->
                                <el-input v-model="editform.maintainConfigId" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="检查项目/质量标准" prop="content">
                                <!-- 检查项目/质量标准 -->
                                <el-input v-model="editform.content" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="必检项 1，是，0，否" prop="isWhether">
                                <!-- 必检项 1，是，0，否 -->
                                <el-input v-model="editform.isWhether" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="0要点 1标准 2动态要点 3动态标准" prop="flag">
                                <!-- 0要点 1标准 2动态要点 3动态标准 -->
                                <el-input v-model="editform.flag" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="备注" prop="remark">
                                <!-- 备注 -->
                                <el-input v-model="editform.remark" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                </el-form>
                <span slot="footer" class="dialog-footer">
		    <el-button @click="close()">取 消</el-button>
		    <el-button type="primary" @click="save()">确 定</el-button>
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
                pageSize: 15,
                totolNum: 0,
                //刷新分页
                renovatePagination: true,
                searchForm: {},
                deleteVisible: false,
                //是否为详情，并设置是否disable
                isDetail:false,
                formDialogVisible :false,
                editform: {},
                deleteIds: '',
                checkedArr: [],
                // 校验
                rules: {
                // 保养配置id
                maintainConfigId: [{
                        required: true,
                        message: '请输入保养配置id',
                        trigger: 'blur'
                    }],
                // 检查项目/质量标准
                content: [{
                        required: true,
                        message: '请输入检查项目/质量标准',
                        trigger: 'blur'
                    }],
                // 必检项 1，是，0，否
                isWhether: [{
                        required: true,
                        message: '请输入必检项 1，是，0，否',
                        trigger: 'blur'
                    }],
                // 0要点 1标准 2动态要点 3动态标准
                flag: [{
                        required: true,
                        message: '请输入0要点 1标准 2动态要点 3动态标准',
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
                this.$httpPost('/manage/maintainPoints/find', {
                    // 保养配置id
                    maintainConfigId: this.searchForm.maintainConfigId,
                    // 检查项目/质量标准
                    content: this.searchForm.content,
                    // 必检项 1，是，0，否
                    isWhether: this.searchForm.isWhether,
                    // 0要点 1标准 2动态要点 3动态标准
                    flag: this.searchForm.flag,
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
                this.formDialogVisible = true;
                this.isDetail=false;
                if(row){
                    this.editform = Object.assign({},row);
                }
            },
            // 修改 新增 保存
            save() {
                this.$refs.editform.validate((valid) => {
                    if(valid) {
                        this.$httpPost('/manage/maintainPoints/save', {
                        // 序号
                        id: this.editform.id,
                        // 保养配置id
                        maintainConfigId: this.editform.maintainConfigId,
                        // 检查项目/质量标准
                        content: this.editform.content,
                        // 必检项 1，是，0，否
                        isWhether: this.editform.isWhether,
                        // 0要点 1标准 2动态要点 3动态标准
                        flag: this.editform.flag,
                        // 备注
                        remark: this.editform.remark,
                        }).then(res => {
                        this.search();
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
                this.$httpPost('/manage/maintainPoints/delete', {
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
            },
            // 弹出查看详情弹出框
            toDetails(index, row) {
                const _this = this;
                this.editform = {};
                if(row){
                    this.editform = Object.assign({},row);
                }
                this.formDialogVisible = true;
                this.isDetail = true
            },
        }
    }
</script>
