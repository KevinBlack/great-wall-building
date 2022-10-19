
<template>
    <div class="wrap">
        <div class="subContent">
            <div class="tableWrap">
                <!--搜索功能-->
                <el-form :inline="true" :model="searchForm" class="demo-form-inline zr-row-scatter">
                    <div class="zr-row">
                        <el-button type="primary" @click="toEdit()">创建</el-button>
                        <el-button type="primary" @click="toDelete()">批量删除</el-button>
                        <el-button type="primary" @click="search()">刷新</el-button>
                    </div>
                    <div class="zr-row">
                            <el-form-item label="">
                                <!-- 供应商名称 -->
                                <el-input v-model="searchForm.name" clearable placeholder="供应商名称"></el-input>
                            </el-form-item>
                            <el-form-item label="">
                                <!-- 供应商等级 -->
                                <el-input v-model="searchForm.grade" clearable placeholder="供应商等级"></el-input>
                            </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="search('param')">查询</el-button>
                        </el-form-item>
                    </div>
                </el-form>
                <!--数据表格渲染-->
                <el-table ref="table" stripe :data="tableData" style="width: 100%" @selection-change="onSelect">
                    <el-table-column type="selection" width="60" align="center"></el-table-column>
                    <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                    <!-- 供应商名称 -->
                    <el-table-column prop="name" label="供应商名称" align="center"></el-table-column>
                    <!-- 联系电话 -->
                    <el-table-column prop="tel" label="联系电话" align="center"></el-table-column>
                    <!-- 供应商等级 -->
                    <el-table-column prop="grade" label="供应商等级" align="center"></el-table-column>
                    <!-- 评价 -->
                    <el-table-column :show-overflow-tooltip="true"  prop="evaluation" label="评价" align="center"></el-table-column>
                    <!-- 备注 -->
                    <el-table-column :show-overflow-tooltip="true" prop="remark" label="备注" align="center"></el-table-column>
                    <el-table-column label="操作" width="180" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" size="mini" @click="toEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button type="text" size="mini" @click="toDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页-->
                <el-pagination v-if="renovatePagination" @size-change="onSizeChange" @current-change="onCurrentChange" :current-page="pageNum" :page-sizes="[10, 15, 20, 25]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totolNum">
                </el-pagination>
            </div>

            <!--编辑弹出窗-->
            <el-dialog   :title="isDetail?'查看详情':(editform.id?'编辑':'新增')" :visible.sync="formDialogVisible" :before-close="close" width="50%">
                <el-form  :model="editform" :rules="rules" ref="editform"  label-width="120px">
                        <el-col :span="12">
                            <el-form-item label="供应商名称" prop="name">
                                <!-- 供应商名称 -->
                                <el-input v-model="editform.name" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="供应商等级" prop="grade">
                                <!-- 供应商等级 -->
                                <el-input v-model="editform.grade" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="联系电话" prop="tel">
                                <!-- 联系电话 -->
                                <el-input v-model="editform.tel" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                            <el-form-item label="评价" prop="evaluation">
                                <!-- 评价 -->
                                <el-input v-model="editform.evaluation" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="备注" prop="remark">
                                <!-- 备注 -->
                                <el-input type="textarea" :autosize="{minRows:3}" v-model="editform.remark" :disabled="isDetail"></el-input>
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
    import { axiosHttp } from '@/libs'
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
                // 供应商名称
                name: [{
                        required: true,
                        message: '请输入供应商名称',
                        trigger: 'blur'
                    }],
                // 联系电话
                tel: [{
                        required: true,
                        message: '请输入联系电话',
                        trigger: 'blur'
                    }],
                // 供应商等级
                grade: [{
                        required: true,
                        message: '请输入供应商等级',
                        trigger: 'blur'
                    }]


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
                axiosHttp.post('/manage/supplierManage/find', {
                    // 供应商名称
                    name: this.searchForm.name,
                    // 联系电话
                    tel: this.searchForm.tel,
                    // 供应商等级
                    grade: this.searchForm.grade,
                    // 评价
                    evaluation: this.searchForm.evaluation,
                    // 备注
                    remark: this.searchForm.remark,
                    page: this.pageNum,
                    size: this.pageSize

                }).then(res => {
                    this.tableData = res.content;
                    this.totolNum = Number(res.totalElements);
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
                        axiosHttp.post('/manage/supplierManage/save', {
                        // id
                        id: this.editform.id,
                        // 供应商名称
                        name: this.editform.name,
                        // 联系电话
                        tel: this.editform.tel,
                        // 供应商等级
                        grade: this.editform.grade,
                        // 评价
                        evaluation: this.editform.evaluation,
                        // 备注
                        remark: this.editform.remark,
                        }).then(res => {
                        this.search();
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
                axiosHttp.post('/manage/supplierManage/delete', {
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
