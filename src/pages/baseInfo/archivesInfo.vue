
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
                                <!-- 档案名称 -->
                                <el-input v-model="searchForm.name" clearable placeholder="档案名称"></el-input>
                            </el-form-item>
                            <el-form-item label="">
                                <!-- 档案类型 -->
                                <el-input v-model="searchForm.type" clearable placeholder="档案类型"></el-input>
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
                    <!-- 档案名称 -->
                    <el-table-column prop="nametext" label="档案名称" align="center"></el-table-column>
                    <!-- 档案内容 -->
                    <el-table-column prop="content" label="档案内容" align="center"></el-table-column>
                    <!-- 档案说明 -->
                    <el-table-column prop="explains" label="档案说明" align="center"></el-table-column>
                    <!-- 档案类型 -->
                    <el-table-column prop="typed" label="档案类型" align="center"></el-table-column>
                    <!-- 附加文件 -->
                    <!-- <el-table-column prop="additionalFiles" label="附加文件"></el-table-column> -->
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
                            <el-form-item label="档案名称" prop="nametext">
                                <!-- 档案名称 -->
                                <el-input v-model="editform.nametext" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="档案内容" prop="content">
                                <!-- 档案内容 -->
                                <el-input v-model="editform.content" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="档案说明" prop="explains">
                                <!-- 档案说明 -->
                                <el-input v-model="editform.explains" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="档案类型" prop="typed">
                                <!-- 档案类型 -->
                                <el-input v-model="editform.typed" :disabled="isDetail"></el-input>
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
                                    :show-file-list="true"
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
    import { axiosHttp,api } from '@/libs'
    export default {
        // 变量初始化定义
        data() {
            return {
                tableData: [],
                pageNum: 1,
                pageSize: 15,
                totolNum: 0,
                fileList: [],
                //刷新分页
                renovatePagination: true,
                searchForm: {},
                deleteVisible: false,
                //是否为详情，并设置是否disable
                isDetail:false,
                formDialogVisible :false,
                editform: {file: ''},
                uploadId: '',
                fId: 0,
                dowloadId:'',
                loading:false,
                deleteIds: '',
                isDisable:false,
                checkedArr: [],
                // 校验
                rules: {
                // 档案名称
                nametext: [{
                        required: true,
                        message: '请输入档案名称',
                        trigger: 'blur'
                    }],
                // 档案内容
                content: [{
                        required: true,
                        message: '请输入档案内容',
                        trigger: 'blur'
                    }],
                // 档案说明
                explains: [{
                        required: true,
                        message: '请输入档案说明',
                        trigger: 'blur'
                    }],
                // 档案类型
                typed: [{
                        required: true,
                        message: '请输入档案类型',
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
                axiosHttp.post("/manage/archivesInfo/uploadCertificates", formData, config).then(res => {
                    this.loading  = false
                    this.$message.success('上传成功')
                    this.search();
                    //this.$forceUpdate()
                    this.formDialogVisible = false;
                    this.isDisable = false
                    this.fileList = []
                }).catch(error => {
                    // this.$message.error('请选择附件')
                })
            },
            fileDownload(file){
                console.log(file)
                location.href =api.baseUrl +
				"/manage/archivesInfo/downFile?id="+this.dowloadId +"&token=" +window.localStorage.csmpToken;

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
               this.editform.file = file.raw
           },
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
                axiosHttp.post('/manage/archivesInfo/find', {
                    // 档案名称
                    nametext: this.searchForm.name,
                    // 档案内容
                    content: this.searchForm.content,
                    // 档案说明
                    explains: this.searchForm.explain,
                    // 档案类型
                    typed: this.searchForm.type,
                    // 附加文件
                    additionalFiles: this.searchForm.additionalFiles,
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
                this.formDialogVisible = true;
                //this.loading  = false
                this.isDetail=false;
                if(row){
                    if(row.additionalFiles) {
                        this.fId = 1
                    } else {
                        this.fId = 0

                    }
                    this.dowloadId = row.id
                    this.editform = Object.assign({itemIndex:index},row);
                    this.uploadId = row.id
                    axiosHttp.post('/manage/archivesInfo/getFile', {
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
                        axiosHttp.post('/manage/archivesInfo/save', {
                        // id
                        id: this.editform.id,
                        // 档案名称
                        nametext: this.editform.nametext,
                        // 档案内容
                        content: this.editform.content,
                        // 档案说明
                        explains: this.editform.explains,
                        // 档案类型
                        typed: this.editform.typed,
                        // 附加文件
                        //additionalFiles: this.editform.additionalFiles,
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
                axiosHttp.post('/manage/archivesInfo/delete', {
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
