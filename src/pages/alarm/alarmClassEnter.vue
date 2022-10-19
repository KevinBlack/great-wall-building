
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
                        <!-- 设备专业 -->
                        <el-input v-model="searchForm.deviceSystem" clearable placeholder="设备专业"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <!-- 设备子系统 -->
                        <el-input v-model="searchForm.deviceSubSys" clearable placeholder="设备子系统"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <!-- 设备类别 -->
                        <el-input v-model="searchForm.deviceType" clearable placeholder="设备类别"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <!-- 子系统报警编码 -->
                        <el-input v-model="searchForm.sysAlarmNo" clearable placeholder="子系统报警编码"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <!-- 报警名称 -->
                        <el-input v-model="searchForm.alarmName" clearable placeholder="报警名称"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <!-- 报警级别（0普通 1重要 2严重） -->
                        <el-input v-model="searchForm.alarmLevel" clearable placeholder="报警级别（0普通 1重要 2严重）"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <!-- 报警分类(0 设备故障 1 事件 ) -->
                        <el-input v-model="searchForm.alarmType" clearable placeholder="报警分类(0 设备故障 1 事件 )"></el-input>
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
                    <!-- 设备专业 -->
                    <el-table-column :show-overflow-tooltip="true" prop="deviceSystem" label="设备专业"></el-table-column>
                    <!-- 设备子系统 -->
                    <el-table-column :show-overflow-tooltip="true" prop="deviceSubSys" label="设备子系统"></el-table-column>
                    <!-- 设备类别 -->
                    <el-table-column :show-overflow-tooltip="true" prop="deviceType" label="设备类别"></el-table-column>
                    <!-- 子系统报警编码 -->
                    <el-table-column :show-overflow-tooltip="true" prop="sysAlarmNo" label="子系统报警编码"></el-table-column>
                    <!-- 报警名称 -->
                    <el-table-column :show-overflow-tooltip="true" prop="alarmName" label="报警名称"></el-table-column>
                    <!-- 报警级别（0普通 1重要 2严重） -->
                    <el-table-column :show-overflow-tooltip="true" prop="alarmLevel" label="报警级别（0普通 1重要 2严重）"></el-table-column>
                    <!-- 报警分类(0 设备故障 1 事件 ) -->
                    <el-table-column :show-overflow-tooltip="true" prop="alarmType" label="报警分类(0 设备故障 1 事件 )"></el-table-column>
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
                            <el-form-item label="设备专业" prop="deviceSystem">
                                <!-- 设备专业 -->
                                <el-input v-model="editform.deviceSystem"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="设备子系统" prop="deviceSubSys">
                                <!-- 设备子系统 -->
                                <el-input v-model="editform.deviceSubSys"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="设备类别" prop="deviceType">
                                <!-- 设备类别 -->
                                <el-input v-model="editform.deviceType"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="子系统报警编码" prop="sysAlarmNo">
                                <!-- 子系统报警编码 -->
                                <el-input v-model="editform.sysAlarmNo"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="报警名称" prop="alarmName">
                                <!-- 报警名称 -->
                                <el-input v-model="editform.alarmName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="报警级别（0普通 1重要 2严重）" prop="alarmLevel">
                                <!-- 报警级别（0普通 1重要 2严重） -->
                                <el-input v-model="editform.alarmLevel"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="报警分类(0 设备故障 1 事件 )" prop="alarmType">
                                <!-- 报警分类(0 设备故障 1 事件 ) -->
                                <el-input v-model="editform.alarmType"></el-input>
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
                // 设备专业
                deviceSystem: [{
                        required: true,
                        message: '请输入设备专业',
                        trigger: 'blur'
                    }],
                // 设备子系统
                deviceSubSys: [{
                        required: true,
                        message: '请输入设备子系统',
                        trigger: 'blur'
                    }],
                // 设备类别
                deviceType: [{
                        required: true,
                        message: '请输入设备类别',
                        trigger: 'blur'
                    }],
                // 子系统报警编码
                sysAlarmNo: [{
                        required: true,
                        message: '请输入子系统报警编码',
                        trigger: 'blur'
                    }],
                // 报警名称
                alarmName: [{
                        required: true,
                        message: '请输入报警名称',
                        trigger: 'blur'
                    }],
                // 报警级别（0普通 1重要 2严重）
                alarmLevel: [{
                        required: true,
                        message: '请输入报警级别（0普通 1重要 2严重）',
                        trigger: 'blur'
                    }],
                // 报警分类(0 设备故障 1 事件 )
                alarmType: [{
                        required: true,
                        message: '请输入报警分类(0 设备故障 1 事件 )',
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
                this.$httpPost('/manage/alarmClassEnter/find', {
                    // 设备专业
                    deviceSystem: this.searchForm.deviceSystem,
                    // 设备子系统
                    deviceSubSys: this.searchForm.deviceSubSys,
                    // 设备类别
                    deviceType: this.searchForm.deviceType,
                    // 子系统报警编码
                    sysAlarmNo: this.searchForm.sysAlarmNo,
                    // 报警名称
                    alarmName: this.searchForm.alarmName,
                    // 报警级别（0普通 1重要 2严重）
                    alarmLevel: this.searchForm.alarmLevel,
                    // 报警分类(0 设备故障 1 事件 )
                    alarmType: this.searchForm.alarmType,
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
                        this.$httpPost('/manage/alarmClassEnter/save', {
                        // ID
                        id: this.editform.id,
                        // 设备专业
                        deviceSystem: this.editform.deviceSystem,
                        // 设备子系统
                        deviceSubSys: this.editform.deviceSubSys,
                        // 设备类别
                        deviceType: this.editform.deviceType,
                        // 子系统报警编码
                        sysAlarmNo: this.editform.sysAlarmNo,
                        // 报警名称
                        alarmName: this.editform.alarmName,
                        // 报警级别（0普通 1重要 2严重）
                        alarmLevel: this.editform.alarmLevel,
                        // 报警分类(0 设备故障 1 事件 )
                        alarmType: this.editform.alarmType,
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
                this.$httpPost('/manage/alarmClassEnter/delete', {
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