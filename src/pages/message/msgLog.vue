
<template>
    <div class="wrap">
        <div class="subContent">
            <div class="tableWrap">
                <!--搜索功能-->
                <el-form :inline="true" :model="searchForm" class="zr-row-scatter">
                    <div>
                    </div>
                    <div>
                        <el-form-item label="">
                            <!-- 消息类型 -->
                            <!--<el-input v-model="searchForm.msgType" clearable placeholder="消息类型"></el-input>-->
                            <DictSelect v-model="searchForm.msgType"  selectData="msgType"
                                        placeholder="消息类型" ></DictSelect>
                        </el-form-item>
                        <el-form-item label="">
                            <!-- 接收人姓名 -->
                            <el-input v-model="searchForm.customerName" clearable placeholder="接收人姓名"></el-input>
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
                    <!-- 消息类型 -->
                    <el-table-column :show-overflow-tooltip="true" prop="msgType" label="消息类型" :formatter="stateMsgType"></el-table-column>
                    <!-- 消息标题 -->
                    <el-table-column :show-overflow-tooltip="true" prop="title" label="消息标题"></el-table-column>
                    <!-- 消息内容 -->
                    <el-table-column :show-overflow-tooltip="true" prop="sendWay" label="接收方式" :formatter="sendWay"></el-table-column>
                    <!-- 接收人姓名 -->
                    <el-table-column :show-overflow-tooltip="true" prop="customerName" label="接收人姓名"></el-table-column>
                    <!-- 接收人手机号 -->
                    <el-table-column :show-overflow-tooltip="true" prop="customerPhone" label="接收人手机号"></el-table-column>
                    <!-- 发送时间(0成功 1失败) -->
                    <el-table-column :show-overflow-tooltip="true" prop="createTime" label="发送时间" :formatter="createTimeFormatter"></el-table-column>
                    <!-- 状态(0成功 1失败) -->
                    <el-table-column :show-overflow-tooltip="true" prop="status" label="状态" :formatter="status"></el-table-column>

                    <!--<el-table-column :show-overflow-tooltip="true" label="操作" width="180">
                        <template slot-scope="scope">
                            <el-button type="text" size="mini" @click="toEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button type="text" size="mini" @click="toDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>-->
                </el-table>
                <!--分页-->
                <el-pagination v-if="renovatePagination" @size-change="onSizeChange" @current-change="onCurrentChange" :current-page=pageNum :page-sizes="[10, 15, 20, 25]" :page-size=pageSize layout="total, sizes, prev, pager, next, jumper" :total=totolNum>
                </el-pagination>
            </div>

            <!--编辑弹出窗-->
            <el-dialog   :title="isDetail?'查看详情':(editform.id?'编辑':'新增')" :visible.sync="formDialogVisible" :before-close="close" width="900px">
                <el-form  :model="editform" :rules="rules" ref="editform"  label-width="80px">
                        <el-col :span="12">
                            <el-form-item label="消息类型" prop="msgType">
                                <!-- 消息类型 -->
                                <el-input v-model="editform.msgType" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="消息标题" prop="title">
                                <!-- 消息标题 -->
                                <el-input v-model="editform.title" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="消息内容" prop="content">
                                <!-- 消息内容 -->
                                <el-input v-model="editform.content" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="接收人ID" prop="customerId">
                                <!-- 接收人ID -->
                                <el-input v-model="editform.customerId" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="接收人姓名" prop="customerName">
                                <!-- 接收人姓名 -->
                                <el-input v-model="editform.customerName" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="接收人手机号" prop="customerPhone">
                                <!-- 接收人手机号 -->
                                <el-input v-model="editform.customerPhone" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="状态(0成功 1失败)" prop="status">
                                <!-- 状态(0成功 1失败) -->
                                <el-input v-model="editform.status" :disabled="isDetail"></el-input>
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
    import {dict} from '@/libs'
    import Vue from 'vue'
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
                msgTypeList: [],
                // 校验
                rules: {
                // 消息类型
                msgType: [{
                        required: true,
                        message: '请输入消息类型',
                        trigger: 'blur'
                    }],
                // 消息标题
                title: [{
                        required: true,
                        message: '请输入消息标题',
                        trigger: 'blur'
                    }],
                // 消息内容
                content: [{
                        required: true,
                        message: '请输入消息内容',
                        trigger: 'blur'
                    }],
                // 接收人ID
                customerId: [{
                        required: true,
                        message: '请输入接收人ID',
                        trigger: 'blur'
                    }],
                // 接收人姓名
                customerName: [{
                        required: true,
                        message: '请输入接收人姓名',
                        trigger: 'blur'
                    }],
                // 接收人手机号
                customerPhone: [{
                        required: true,
                        message: '请输入接收人手机号',
                        trigger: 'blur'
                    }],
                // 状态(0成功 1失败)
                status: [{
                        required: true,
                        message: '请输入状态(0成功 1失败)',
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
                axiosHttp.post('/message/msgLog/find', {
                    // 消息类型
                    msgType: this.searchForm.msgType,
                    // 消息标题
                    title: this.searchForm.title,
                    // 消息内容
                    content: this.searchForm.content,
                    // 接收人ID
                    customerId: this.searchForm.customerId,
                    // 接收人姓名
                    customerName: this.searchForm.customerName,
                    // 接收人手机号
                    customerPhone: this.searchForm.customerPhone,
                    // 状态(0成功 1失败)
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
                        axiosHttp.post('/message/msgLog/save', {
                        // ID
                        id: this.editform.id,
                        // 消息类型
                        msgType: this.editform.msgType,
                        // 消息标题
                        title: this.editform.title,
                        // 消息内容
                        content: this.editform.content,
                        // 接收人ID
                        customerId: this.editform.customerId,
                        // 接收人姓名
                        customerName: this.editform.customerName,
                        // 接收人手机号
                        customerPhone: this.editform.customerPhone,
                        // 状态(0成功 1失败)
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
                axiosHttp.post('/message/msgLog/delete', {
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
            stateMsgType: function(row, column, cellValue) {
                if(this.msgTypeList.find(item => item.value === row.msgType)) return this.msgTypeList.find(item => item.value === row.msgType).label
                // switch (row.alarmType){
                //     case "01":
                //         return "设备故障";
                //     case "02":
                //         return "事件";
                //     default:
                //         return "";
                // }
            },
            status: function(row, column, cellValue) {
                switch (row.status){
                    case "0":
                        return "成功";
                    case "1":
                        return "失败";
                    default:
                        return "成功";
                }
            },
            sendWay: function(row, column, cellValue) {
                switch (row.sendWay){
                    case "1":
                        return "消息推送";
                    case "2":
                        return "消息发布屏";
                    default:
                        return "消息推送";
                }
            },
            //时间格式化
            createTimeFormatter(row, column, cellValue) {
                if(row.createTime!=null){
                    return Vue.filter('dateFormat')(row.createTime,'yyyy-MM-dd hh:mm:ss')
                }
            },
        },
        // 页面加载时执行
        created: function() {
            this.search();
            dict.dict('msgType').then(payload => this.msgTypeList = payload)
        },
    }
</script>
