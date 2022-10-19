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
                                <el-input v-model="searchForm.keyword" clearable placeholder="关键字"></el-input>
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
                    <!-- 合同编号 -->
                    <el-table-column prop="contractNumber" label="合同编号" align="center"></el-table-column>
                    <!-- 合同名称 -->
                    <el-table-column prop="contractName" label="合同名称" align="center"></el-table-column>
                    <!-- 合同类别 -->
                    <el-table-column prop="contractType" label="合同类别" align="center"></el-table-column>
                    <!-- 合同标额 -->
                    <!-- <el-table-column prop="contractQuota" label="合同标额"></el-table-column> -->
                    <!-- 承办部门 -->
                    <el-table-column prop="undertakeDepartment" label="承办部门" align="center"></el-table-column>
                    <!-- 采购依据 -->
                    <!-- <el-table-column prop="purchasingBasis" label="采购依据"></el-table-column> -->
                    <!-- 承办人 -->
                    <!-- <el-table-column prop="undertakePeople" label="承办人"></el-table-column> -->
                    <!-- 申报日期 -->
                    <!-- <el-table-column prop="declareDate" label="申报日期" :formatter="declareTimeFormatter"></el-table-column> -->
                    <!-- 附加文件 -->
                    <!-- <el-table-column prop="additionalFiles" label="附加文件"></el-table-column> -->
                    <!-- 批准日期 -->
                    <el-table-column prop="approveDate" label="批准日期" :formatter="approveTimeFormatter" align="center"></el-table-column>
                    <!-- 联系电话 -->
                    <el-table-column prop="tel" label="联系电话" align="center"></el-table-column>
                    <!-- 备注 -->
                    <!-- <el-table-column prop="remark" label="备注"></el-table-column> -->
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
            <el-dialog   :title="isDetail?'查看详情':(editform.id?'编辑':'新增')" :visible.sync="formDialogVisible" :before-close="close" width="40%">
                <el-form  :model="editform" :rules="rules" ref="editform"  label-width="80px">
                        <el-col :span="12">
                            <el-form-item label="合同编号" prop="contractNumber">
                                <!-- 合同编号 -->
                                <el-input v-model="editform.contractNumber" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="合同名称" prop="contractName">
                                <!-- 合同名称 -->
                                <el-input v-model="editform.contractName" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="合同类别" prop="contractType">
                                <!-- 合同类别 -->
                                <el-input v-model="editform.contractType" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="合同标额" prop="contractQuota">
                                <!-- 合同标额 -->
                                <el-input v-model="editform.contractQuota" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="承办部门" prop="undertakeDepartment">
                                <!-- 承办部门 -->
                                <el-input v-model="editform.undertakeDepartment" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="采购依据" prop="purchasingBasis">
                                <!-- 采购依据 -->
                                <el-input v-model="editform.purchasingBasis" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="承办人" prop="undertakePeople">
                                <!-- 承办人 -->
                                <el-input v-model="editform.undertakePeople" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                         <el-col :span="12">
                             <!-- 申报日期 -->
                            <el-form-item label="申报日期" prop="declareDate">
                                <el-date-picker v-model="editform.declareDate" type="datetime" value-format="timestamp"
                                                format="yyyy-MM-dd HH:mm" placeholder="申报日期" :disabled="isDetail">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                       <!-- <el-col :span="12">
                            <el-form-item label="附加文件" prop="additionalFiles">
                                <el-input v-model="editform.additionalFiles" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col> -->
                         <el-col :span="12">
                             <!-- 批准日期 -->
                            <el-form-item label="批准日期" prop="approveDate">
                                <el-date-picker v-model="editform.approveDate" type="datetime" value-format="timestamp"
                                                format="yyyy-MM-dd HH:mm" placeholder="批准日期" :disabled="isDetail">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="联系电话" prop="tel">
                                <!-- 联系电话 -->
                                <el-input v-model="editform.tel" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="附加文件" prop="additionalFiles">
                                <!-- 附加文件 -->
                                <el-upload
                                    class="upload-demo"
                                    ref="listUpload"
                                    action="123"
                                    :auto-upload="false"
                                    :limit="1"
                                    :on-change="fileChange"
                                    v-loading="loading"
                                    element-loading-text="上传中"
                                    element-loading-spinner="el-icon-loading"
                                    element-loading-background="rgba(0, 0, 0, 0.5)"
                                    :on-exceed="handleExceed"
                                    :before-remove="beforeRemove"
                                    :before-upload="beforeupload"
                                    :file-list="fileList"
                                    :on-preview="fileDownload">
                                    <em>点击上传</em>
                                </el-upload>
                                <!-- <el-input v-model="editform.additionalFiles" :disabled="isDetail"></el-input> -->
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
                    <el-button type="primary" @click="save()" :disabled="isDisable">确 定</el-button>
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

    import { api, dict, axiosHttp, util } from '@/libs'
    import Vue from 'vue'
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
                fileList:[],
                uploadId:'',
                isDisable:false,
                loading:false,
                fId:0,
                dowloadId:'',
                checkedArr: [],
                // 校验
                rules: {
                // 合同编号
                contractNumber: [{
                        required: true,
                        message: '请输入合同编号',
                        trigger: 'blur'
                    }],
                // 合同名称
                contractName: [{
                        required: true,
                        message: '请输入合同名称',
                        trigger: 'blur'
                    }],
                // 合同类别
                contractType: [{
                        required: true,
                        message: '请输入合同类别',
                        trigger: 'blur'
                    }],
                // 合同标额
                contractQuota: [{
                        required: true,
                        message: '请输入合同标额',
                        trigger: 'blur'
                    }],
                // 承办部门
                undertakeDepartment: [{
                        required: true,
                        message: '请输入承办部门',
                        trigger: 'blur'
                    }],
                // 采购依据
                purchasingBasis: [{
                        required: true,
                        message: '请输入采购依据',
                        trigger: 'blur'
                    }],

                // 申报日期
                declareDate: [{
                        required: true,
                        message: '请输入申报日期',
                        trigger: 'blur'
                    }],

                // 批准日期
                approveDate: [{
                        required: true,
                        message: '请输入批准日期',
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
                if(type=='param'){
                    this.pageNum = 1;
                    this.renovatePagination = false;
                }
                axiosHttp.post('/manage/contractLedger/find', {
                    // 合同编号
                    contractNumber: this.searchForm.contractNumber,
                    // 合同名称
                    contractName: this.searchForm.contractName,
                    // 合同类别
                    contractType: this.searchForm.contractType,
                    // 合同标额
                    contractQuota: this.searchForm.contractQuota,
                    // 承办部门
                    undertakeDepartment: this.searchForm.undertakeDepartment,
                    // 采购依据
                    purchasingBasis: this.searchForm.purchasingBasis,
                    // 承办人
                    undertakePeople: this.searchForm.undertakePeople,
                    // 申报日期
                    declareDate: this.searchForm.declareDate,
                    // 附加文件
                    additionalFiles: this.searchForm.additionalFiles,
                    // 批准日期
                    approveDate: this.searchForm.approveDate,
                    // 联系电话
                    tel: this.searchForm.tel,
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
            // 上传
             handleUpload(){
                 this.loading  = true
                 let formData = new FormData()
                 formData.append('id', this.uploadId);
                 formData.append('fId', this.fId);
                 formData.append('file', this.editform.file)
                 let config = {
                     headers: {
                         'Content-Type': 'multipart/form-data'
                     }
                 };
                 //然后通过下面的方式把内容通过axios来传到后台
                 //下面的this.$reqs 是在主js中通过Vue.prototype.$reqs = axios 来把axios赋给它;
                 axiosHttp.post("/manage/contractLedger/uploadCertificates", formData, config).then(res => {
                     this.loading  = false
                     this.$message.success('上传成功')
                     this.search();
                     //this.$forceUpdate()
                     this.formDialogVisible = false;
                     this.isDisable = false
                     this.fileList = []
                 }).catch(error => {
                     //this.$message.error('请选择附件')
                 })
             },
             fileDownload(file){
                 console.log(file)
                 location.href =api.baseUrl +
            				"/manage/contractLedger/downFile?id="+this.dowloadId +"&token=" +window.localStorage.csmpToken;

             },
             beforeupload(file) {
                     //创建临时的路径来展示图片
                     var windowURL = window.URL || window.webkitURL;
                     this.src = windowURL.createObjectURL(file);
                   },

            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`);
            },
            fileChange(file, fileList) {
                console.log(fileList)
                this.editform.file = file.raw
            },
            // 弹出修改弹出框
            toEdit(index, row) {
                this.editform = {};
                this.formDialogVisible = true;
                this.isDetail=false;
                if(row){
                    console.log(row)
                    if(row.additionalFiles) {
                        this.fId = 1
                    } else {
                        this.fId = 0

                    }
                    this.dowloadId = row.id
                    this.editform = Object.assign({},row);
                    this.uploadId = row.id
                    axiosHttp.post('/manage/contractLedger/getFile', {
                        id: row.id
                    }).then(res => {
                        if(res.id !== null && res.id !== ""){
                           let fileItem = {
                               name: res.FileName,
                               url: res.path
                           }
                           this.fileList = []
                           this.fileList.push(fileItem)
                        }


                    })
                }else{
                    this.editform = {};
                    this.editform.file = '';
                    this.fileList = []
                }
            },
            // 修改 新增 保存
            save() {
                this.$refs.editform.validate((valid) => {
                    if(valid) {
                        this.isDisable = true
                        axiosHttp.post('/manage/contractLedger/save', {
                        // id
                        id: this.editform.id,
                        // 合同编号
                        contractNumber: this.editform.contractNumber,
                        // 合同名称
                        contractName: this.editform.contractName,
                        // 合同类别
                        contractType: this.editform.contractType,
                        // 合同标额
                        contractQuota: this.editform.contractQuota,
                        // 承办部门
                        undertakeDepartment: this.editform.undertakeDepartment,
                        // 采购依据
                        purchasingBasis: this.editform.purchasingBasis,
                        // 承办人
                        undertakePeople: this.editform.undertakePeople,
                        // 申报日期
                        declareDate: this.editform.declareDate,
                        // 附加文件
                        //additionalFiles: this.editform.additionalFiles,
                        // 批准日期
                        approveDate: this.editform.approveDate,
                        // 联系电话
                        tel: this.editform.tel,
                        // 备注
                        remark: this.editform.remark,
                        }).then(res => {
                        this.uploadId = res.id
                        if(this.editform.file != undefined && this.editform.file != ''){
                            setTimeout(() => {
                            	this.handleUpload()
                            },2000);
                        }else{
                            this.search();
                            this.formDialogVisible = false;
                            this.isDisable = false
                        }
                    })
                    } else {
                        this.isDisable = false
                        return false;
            }
            });
            },
            // 关闭弹出框
            close() {
                this.formDialogVisible = false;
                this.fileList = []
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
                axiosHttp.post('/manage/contractLedger/delete', {
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
            //申报日期格式化
            declareTimeFormatter(row, column, cellValue) {
                if (row.declareDate != null) {
                    return Vue.filter('dateFormat')(row.declareDate, 'yyyy-MM-dd')
                }
            },
            //批准日期格式化
            approveTimeFormatter(row, column, cellValue) {
                if (row.approveDate != null) {
                    return Vue.filter('dateFormat')(row.approveDate, 'yyyy-MM-dd')
                }
            }
        }
    }
</script>
<style>

    .el-loading-spinner {
        top: 20px;
    }
    .el-loading-spinner i{
        color: #fff;
    }
    .el-loading-spinner .el-loading-text {
        color: #fff;
        margin:  0;
    }


</style>
