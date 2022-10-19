<template>
    <div class="wrap">
        <div class="c-crumbs" >
            系统管理 > 字典管理
        </div>
        <div class="subContent zr-row">
            <div class="tableWrap">
                <!--搜索功能-->
                <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                    <el-button type="primary" @click="toEdit()">创建</el-button>
                    <el-button type="primary" @click="toDelete()">删除</el-button>
                    <el-button type="primary" @click="search()">刷新</el-button>
                    <el-form-item label="">
                        <el-input v-model="searchForm.username" clearable placeholder="用户名"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-input v-model="searchForm.sex" clearable placeholder="性别"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-input v-model="searchForm.status" clearable placeholder="状态"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="search('param')">搜索</el-button>
                    </el-form-item>
                </el-form>
                <!--数据表格渲染-->
                <el-table ref="table" stripe :data="tableData" style="width: 100%" @selection-change="onSelect">
                    <el-table-column type="selection" width="60"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" type="index" label="序号" width="50"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="email" label="邮箱"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="status" label="状态"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="tel"  label="电话"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="userType"  label="用户类型"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="username" label="用户名"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="password" label="密码"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="worktel" label="工作电话"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="remark" label="备注"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" label="操作" width="180">
                        <template slot-scope="scope">
                            <el-button type="text" size="mini" @click="toEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button type="text" size="mini" @click="toDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页-->
                <el-pagination @size-change="onSizeChange" @current-change="onCurrentChange" :current-page=pageNum :page-sizes="[10, 15, 20, 25]" :page-size=pageSize layout="total, sizes, prev, pager, next, jumper" :total=totolNum>
                </el-pagination>
            </div>

            <!--编辑弹出窗-->
            <el-dialog   title="新增字典" :visible.sync="editTableVisible" width="900px">
                <el-form  :model="editform" :rules="rules" ref="editform"  label-width="80px">
                    <el-col :span="12">
                        <el-form-item label="账号" prop="username">
                            <el-input v-model="editform.username"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="性别" >
                            <el-input v-model="editform.sex"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="密码" >
                            <el-input v-model="editform.password"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="电话" >
                            <el-input v-model="editform.tel"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="邮箱" >
                            <el-input v-model="editform.email"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="状态" >
                            <el-input v-model="editform.status"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="备注">
                            <el-input type="textarea" v-model="editform.remark"></el-input>
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
                searchForm: {},
                editTableVisible: false,
                deleteVisible: false,
                editform: {},
                deleteIds: '',
                checkedArr: [],
                actives: [{
                    "lable": "启用",
                    "key": 1
                }, {
                    "lable": "停用",
                    "key": 0
                }],
                // 校验
                rules: {
                    username: [{
                        required: true,
                        message: '请输入公司名称',
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
                }
                this.$httpPost('/manage/baseUserTemp/find', {
                    username: this.searchForm.username,
                    sex: this.searchForm.sex,
                    status: this.searchForm.status,
                    page: this.pageNum,
                    size: this.pageSize
                }).then(res => {
                    this.tableData = res.data.body.content;
                    this.totolNum = Number(res.data.body.totalElements)
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
                        this.$httpPost('/manage/baseUserTemp/save', {
                            id: this.editform.id,
                            username: this.editform.username,
                            password: this.editform.password,
                            email: this.editform.email,
                            status: this.editform.status,
                            sex: this.editform.sex,
                            tel: this.editform.tel,
                            remark: this.editform.remark
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
                console.log(this[formName])
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
                this.$httpPost('/manage/baseUserTemp/delete', {
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
