
<template>
    <div class="wrap">
        <div class="subContent">
            <div class="tableWrap">
                <!--搜索功能-->
                <el-form :inline="true" :model="searchForm" class="demo-form-inline zr-row-scatter">
                    <div class="zr-row">
                        <el-button type="primary" @click="toDelete()">批量删除</el-button>
                        <el-button type="primary" @click="search()">刷新</el-button>
                    </div>
                    <div class="zr-row">
                            <el-form-item label="">
                                <!-- 内容 -->
                                <el-input v-model="searchForm.content" clearable placeholder="内容"></el-input>
                            </el-form-item>
                            <!--<el-form-item label="">-->
                                <!-- 类型 -->
                                <!--<el-input v-model="searchForm.type" clearable placeholder="类型"></el-input>-->
                            <!--</el-form-item>-->
                            <el-form-item label="">
                                <!-- 状态 -->

                                <el-select v-model="searchForm.status"  clearable placeholder="状态">
                                    <el-option  label="未处理"  value="1"></el-option>
                                    <el-option  label="已处理"  value="2"></el-option>
                                </el-select>

                            </el-form-item>
                            <!--<el-form-item label="">-->
                                 <!--备注 -->
                                <!--<el-input v-model="searchForm.remark" clearable placeholder="备注"></el-input>-->
                            <!--</el-form-item>-->
                        <el-form-item>
                            <el-button type="primary" @click="search('param')">查询</el-button>
                        </el-form-item>
                    </div>
                </el-form>
                <!--数据表格渲染-->
                <el-table ref="table" stripe :data="tableData" style="width: 100%" @selection-change="onSelect">
                    <el-table-column type="selection" width="60"></el-table-column>
                    <el-table-column type="index" label="序号" width="50"></el-table-column>
                    <!-- 内容 -->
                    <!--<el-table-column prop="content" label="内容"></el-table-column>-->


                    <el-table-column :show-overflow-tooltip="true" prop="deviceCode" label="内容">
                        <template slot-scope="scope">
                            <el-button type="text" size="smart" @click="toDetails(scope.$index, scope.row)">{{scope.row.content}}</el-button>
                        </template>
                    </el-table-column>

                    <!-- 类型 -->
                    <!--<el-table-column prop="type" label="类型"></el-table-column>-->
                    <!-- 状态 -->
                    <el-table-column prop="status" :formatter="statusFormatter" label="状态"></el-table-column>
                    <el-table-column prop="tel" label="联系方式"></el-table-column>
                    <el-table-column prop="person" label="联系人"></el-table-column>
                    <!-- 备注 -->
                    <!--<el-table-column prop="remark" label="备注"></el-table-column>-->
                    <el-table-column label="操作" width="180">
                        <template slot-scope="scope">
                            <el-button type="text" size="mini" :disabled="scope.row.status!=1" @click="showStatusVisible(scope.$index, scope.row)">处理</el-button>
                            <el-button type="text" size="mini" @click="toDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页-->
                <el-pagination v-if="renovatePagination" @size-change="onSizeChange" @current-change="onCurrentChange" :current-page="pageNum" :page-sizes="[10, 15, 20, 25]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totolNum">
                </el-pagination>
            </div>

            <!--编辑弹出窗-->
            <el-dialog   :title="isDetail?'查看详情':(editform.id?'编辑':'新增')" :visible.sync="formDialogVisible" :before-close="close" width="40%">
                <el-form  :model="editform" ref="editform"  label-width="80px">
                        <el-col :span="12">
                            <el-form-item label="内容" >
                                <!-- 内容 -->
                                <!--<el-input v-model="editform.content" :disabled="isDetail"></el-input>-->
                                <el-input type="textarea"  :disabled="isDetail" :autosize="{minRows:5}" v-model="editform.content" maxlength="100"></el-input>
                            </el-form-item>
                        </el-col>
                        <!--<el-col :span="12">-->
                            <!--<el-form-item label="类型" prop="type">-->
                                <!-- 类型 -->
                                <!--<el-input v-model="editform.type" :disabled="isDetail"></el-input>-->
                            <!--</el-form-item>-->
                        <!--</el-col>-->
                        <!--<el-col :span="12">-->
                            <!--<el-form-item label="状态" prop="status">-->
                                <!-- 状态 -->
                                <!--<el-input v-model="editform.status" :disabled="isDetail"></el-input>-->
                            <!--</el-form-item>-->
                        <!--</el-col>-->
                        <!--<el-col :span="12">-->
                            <!--<el-form-item label="备注" prop="remark">-->
                                <!-- 备注 -->
                                <!--<el-input v-model="editform.remark" :disabled="isDetail"></el-input>-->
                            <!--</el-form-item>-->
                        <!--</el-col>-->
                </el-form>
                <!--<span slot="footer" class="dialog-footer">-->
                    <!--<el-button type="primary" @click="save()">确 定</el-button>-->
                    <!--<el-button @click="close()">取 消</el-button>-->
                <!--</span>-->
            </el-dialog>

            <!--删除提示框-->
            <el-dialog   title="提示" :visible.sync="deleteVisible" width="30%">
                <span>确定删除？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="deleteRow()">确 定</el-button>
                    <el-button @click="deleteVisible = false">取 消</el-button>
                </span>
            </el-dialog>

            <el-dialog   title="提示" :visible.sync="statusVisible" width="30%">
                <span >是否设置为已处理？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="updateStatus()">确 定</el-button>
                    <el-button @click="statusVisible = false">取 消</el-button>
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
                statusVisible :false,
                editform: {},
                deleteIds: '',
                checkedArr: [],
                // 校验
                rules: {
                // 内容
                content: [{
                        required: true,
                        message: '请输入内容',
                        trigger: 'blur'
                    }],
                // 类型
                type: [{
                        required: true,
                        message: '请输入类型',
                        trigger: 'blur'
                    }],
                // 状态
                status: [{
                        required: true,
                        message: '请输入状态',
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
                axiosHttp.post('/manage/advice/find', {
                    // 内容
                    content: this.searchForm.content,
                    // 类型
                    type: this.searchForm.type,
                    // 状态
                    status: this.searchForm.status,
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
                        axiosHttp.post('/manage/advice/save', {
                        // 主键
                        id: this.editform.id,
                        // 内容
                        content: this.editform.content,
                        // 类型
                        type: this.editform.type,
                        // 状态
                        status: this.editform.status,
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
                axiosHttp.post('/manage/advice/delete', {
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
            statusFormatter: function(row, column, cellValue) {
                switch (row.status){
                    case '1':
                        return "未处理";
                    default:
                        return "已处理";
                }
            },
            showStatusVisible(index, row,value){
                this.visitorStatus=value;

                if(index == undefined) {
                    //	没勾选
                    if(this.deleteIds == "") {
                        this.$message.error('请至少选择一条数据！');
                        return;
                    }
                }
                if(row) {
                    this.deleteIds = row.id;
                }
                this.statusVisible=true;
            },
            updateStatus(){
                this.$httpPost('/manage/advice/updateStatus', {
                    ids: this.deleteIds,
                }).then(res => {
                    this.statusVisible = false;
                    this.deleteIds = "";
                    this.search();
                })
            }
        }
    }
</script>
