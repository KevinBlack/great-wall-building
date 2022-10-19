
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
                                <!-- 机构名称 -->
                                <el-input v-model="searchForm.apiName" clearable placeholder="机构名称"></el-input>
                            </el-form-item>
                            <!--<el-form-item label="">
                                &lt;!&ndash; 密钥 &ndash;&gt;
                                <el-input v-model="searchForm.apiSecret" clearable placeholder="密钥"></el-input>
                            </el-form-item>
                            <el-form-item label="">
                                &lt;!&ndash; 是否可用 &ndash;&gt;
                                <el-input v-model="searchForm.isFlag" clearable placeholder="是否可用"></el-input>
                            </el-form-item>-->
                            <!--<el-form-item label="">
                                &lt;!&ndash; 上一次access_token &ndash;&gt;
                                <el-input v-model="searchForm.accessToken" clearable placeholder="上一次access_token"></el-input>
                            </el-form-item>-->
                           <!-- <el-form-item label="">
                                &lt;!&ndash; remark &ndash;&gt;
                                <el-input v-model="searchForm.remark" clearable placeholder="remark"></el-input>
                            </el-form-item>-->
                        <el-form-item>
                            <el-button type="primary" @click="search('param')">查询</el-button>
                        </el-form-item>
                    </div>
                </el-form>
                <!--数据表格渲染-->
                <el-table ref="table" stripe :data="tableData" style="width: 100%" @selection-change="onSelect">
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                    <!-- 机构名称 -->
                    <el-table-column prop="apiName" label="机构名称" align="center"></el-table-column>
                    <!-- 机构id -->
                    <el-table-column prop="apiId" label="机构id" align="center"></el-table-column>
                    <!-- 密钥 -->
                    <el-table-column prop="apiSecret" label="密钥" width="300" align="center"></el-table-column>
                    <!-- 是否可用 -->
                    <el-table-column prop="isFlag" label="是否可用" :formatter="apiStatus" align="center"></el-table-column>
                    <!-- 上一次access_token -->
                    <!--<el-table-column prop="accessToken" label="上一次access_token"></el-table-column>-->
                    <!-- remark -->
                    <!--<el-table-column prop="remark" label="remark"></el-table-column>-->
                    <el-table-column label="操作" width="180" align="center">
                        <template slot-scope="scope">
                            <!--<el-button type="text" size="mini" @click="toEdit(scope.$index, scope.row)">启用</el-button>-->
                            <el-button @click.native.prevent="handleEditActive(scope.$index, scope.row)" type="text" size="mini" v-if="scope.row.isFlag == 0">
                                禁用
                            </el-button>
                            <el-button @click.native.prevent="handleEditActive(scope.$index, scope.row)" type="text" size="mini" v-else>
                                启用
                            </el-button>

                            <el-button type="text" size="mini" @click="toDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页-->
                <el-pagination v-if="renovatePagination" @size-change="onSizeChange" @current-change="onCurrentChange" :current-page="pageNum" :page-sizes="[10, 15, 20, 25]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totolNum">
                </el-pagination>
            </div>

            <!--编辑弹出窗-->
            <el-dialog   :close-on-click-modal="false"  :title="isDetail?'查看详情':(editform.id?'编辑':'新增')" :visible.sync="formDialogVisible" :before-close="close" width="40%">
                <el-form  :model="editform" :rules="rules" ref="editform"  label-width="80px">
                        <el-col :span="12">
                            <el-form-item label="机构名称" prop="apiName">
                                <!-- 机构名称 -->
                                <el-input v-model="editform.apiName" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <!--<el-col :span="12">
                            <el-form-item label="机构id" prop="apiId">
                                &lt;!&ndash; 机构id &ndash;&gt;
                                <el-input v-model="editform.apiId" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="密钥" prop="apiSecret">
                                &lt;!&ndash; 密钥 &ndash;&gt;
                                <el-input v-model="editform.apiSecret" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="是否可用" prop="isFlag">
                                &lt;!&ndash; 是否可用 &ndash;&gt;
                                <el-input v-model="editform.isFlag" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="上一次access_token" prop="accessToken">
                                &lt;!&ndash; 上一次access_token &ndash;&gt;
                                <el-input v-model="editform.accessToken" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>-->
                        <!--<el-col :span="12">
                            <el-form-item label="remark" prop="remark">
                                &lt;!&ndash; remark &ndash;&gt;
                                <el-input v-model="editform.remark" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>-->
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="save()">确 定</el-button>
                    <el-button @click="close()">取 消</el-button>
                </span>
            </el-dialog>

            <!--删除提示框-->
            <el-dialog   :close-on-click-modal="false"  title="提示" :visible.sync="deleteVisible" width="30%">
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
                // 机构名称
                apiName: [{
                        required: true,
                        message: '请输入机构名称',
                        trigger: 'blur'
                    }],
                // 机构id
                apiId: [{
                        required: true,
                        message: '请输入机构id',
                        trigger: 'blur'
                    }],
                // 密钥
                apiSecret: [{
                        required: true,
                        message: '请输入密钥',
                        trigger: 'blur'
                    }],
                // 是否可用
                isFlag: [{
                        required: true,
                        message: '请输入是否可用',
                        trigger: 'blur'
                    }],
                // 上一次access_token
                accessToken: [{
                        required: true,
                        message: '请输入上一次access_token',
                        trigger: 'blur'
                    }],
                // remark
                remark: [{
                        required: true,
                        message: '请输入remark',
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
                axiosHttp.post('/system/api/find', {
                    // 机构名称
                    apiName: this.searchForm.apiName,
                    // 机构id
                    apiId: this.searchForm.apiId,
                    // 密钥
                    apiSecret: this.searchForm.apiSecret,
                    // 是否可用
                    isFlag: this.searchForm.isFlag,
                    // 上一次access_token
                    accessToken: this.searchForm.accessToken,
                    // remark
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
                        axiosHttp.post('/system/api/save', {
                        // 主键
                        id: this.editform.id,
                        // 机构名称
                        apiName: this.editform.apiName,
                        // 机构id
                        apiId: this.editform.apiId,
                        // 密钥
                        apiSecret: this.editform.apiSecret,
                        // 是否可用
                        isFlag: this.editform.isFlag,
                        // 上一次access_token
                        accessToken: this.editform.accessToken,
                        // remark
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
            apiStatus(row, column, cellValue) {
                if (cellValue == 0) {
                    return '启用';
                } else {
                    return '禁用';
                }
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
                axiosHttp.post('/system/api/delete', {
                    id: this.deleteIds
                }).then(res => {
                    this.deleteVisible = false;
                this.deleteIds = "";
                this.search();
            })
            },
            handleEditActive(index, row) {
                let activetmp = "";
                if(row.isFlag=="0"){
                    activetmp = "1";
                }else{
                    activetmp = "0";
                }
                this.$http('post','/system/api/updateActive',{
                    id: row.id,
                    isFlag: activetmp
                }).then(res => {
                    if (res.data.code == 0) {
                        this.search()
                    } else {
                    }
                });
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
