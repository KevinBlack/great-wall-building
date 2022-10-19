<template>
    <div class="wrap">

        <div class="subContent zr-row">
            <div class="tableWrap">
                <!--搜索功能-->
                <el-form :inline="true" :model="searchForm" class="demo-form-inline zr-row-scatter">
                    <div class="zr-row">
                        <el-button class="tright" style="margin-left: 0;" type="primary" @click="toEdit">创建</el-button>
                        <el-button class="tright" type="primary" @click="toDelete">批量删除</el-button>
                        <el-button class="tright" type="primary" @click="search">刷新</el-button>
                    </div>
                    <div class="zr-row">
                        <el-form-item>
                            <el-input v-model="searchForm.name" clearable placeholder="名称"></el-input>
                        </el-form-item>
                        <el-form-item >
                            <el-input v-model="searchForm.code" clearable placeholder="编码"></el-input>
                        </el-form-item>
                        <el-form-item >
                            <el-input v-model="searchForm.typekey" clearable placeholder="类别"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="search('param')">搜索</el-button>
                        </el-form-item>
                    </div>
                </el-form>
                <!--数据表格渲染-->
                <el-table ref="table" stripe :data="tableData" style="width: 100%" @selection-change="onSelect">
                    <el-table-column type="selection" width="60" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" type="index" label="序号" width="50" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="name" label="名称" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="code" label="编码" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="active" :formatter="state" label="是否可用" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="typekey" label="类别" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="sortno" label="排序" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="remark" label="备注" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" label="操作" width="180" align="center">
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
                        <el-form-item label="名称" prop="name">
                            <el-input v-model="editform.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="编码" prop="code">
                            <el-input v-model="editform.code"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="是否可用" prop="active" >
                            <el-select v-model="editform.active" clearable style="width: 100%;">
                                <el-option v-for="item in actives" :label="item.lable" :key="item.key" :value="item.key">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="类别" prop="typekey">
                            <el-input v-model="editform.typekey"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="排序" prop="sortno">
                            <el-input v-model="editform.sortno" type="number"></el-input>
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
                    companyName: [{
                        required: true,
                        message: '请输入公司名称',
                        trigger: 'blur'
                    }],
                    name: [{
                        required: true,
                        message: '请输入名称',
                        trigger: 'blur'
                    }, ],
                    code: [{
                        required: true,
                        message: '请输入名称',
                        trigger: 'blur'
                    }, ],
                    active: [{
                        required: true,
                        message: '请选择状态',
                        trigger: 'blur'
                    }, ],
                    typekey: [{
                        required: true,
                        message: '请输入类别',
                        trigger: 'blur'
                    }, ],
                    sortno: [{
                        required: true,
                        message: '请输入排序',
                        trigger: 'blur'
                    }, ],
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
                this.$httpPost('/system/user/dict/find', {
                    name: this.searchForm.name,
                    code: this.searchForm.code,
                    typekey: this.searchForm.typekey,
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
                        this.$httpPost('/system/user/dict/save', {
                            id: this.editform.id,
                            name: this.editform.name,
                            code: this.editform.code,
                            active: this.editform.active,
                            typekey: this.editform.typekey,
                            sortno: this.editform.sortno,
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
                this.$httpPost('/system/user/dict/delete', {
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
            // 表格显示 状态渲染  无需自动生成
            state: function(row, column, cellValue) {
                if(row.active === 1) {
                    return "启用"
                } else {
                    return "停用"
                }
            },
        }
    }
</script>
