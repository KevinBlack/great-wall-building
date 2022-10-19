<template>
    <div>
        <el-card class="box-card" style="width: 50%;margin:20px">
            <div slot="header" class="clearfix">
                <span>管理端</span>
            </div>
        <el-upload
            class="upload-demo"
            ref="upload"
            :action="action"
            accept=".apk"
            :auto-upload="false"
            :multiple="false"
            :on-success="handleSuccess"
            :limit="1">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-input style="width: 120px;" v-model="apkVersion" clearable placeholder="请输入版本号"></el-input>
            <el-button type="success"  @click="submitUpload">上传到服务器</el-button>
        </el-upload>
            <div class="table-wrap">
                <el-table ref="table" stripe border :data="tableData1">
                    <el-table-column :show-overflow-tooltip="true" type="index" label="序号" width="50"></el-table-column>

                    <el-table-column :show-overflow-tooltip="true" prop="createTime" :formatter="createTimeFormatter" label="上传时间"></el-table-column>

                    <el-table-column :show-overflow-tooltip="true" prop="version" label="版本号"></el-table-column>
                </el-table>
                <!--分页-->
                <el-pagination @size-change="onSizeChange1" @current-change="onCurrentChange1" :current-page=pageNum1 :page-sizes="[10, 15, 20, 25]" :page-size=pageSize1 layout="total, sizes, prev, pager, next, jumper" :total=totolNum1>

                </el-pagination>
            </div>
        </el-card>

        <el-card class="box-card" style="width: 50%;margin:20px;margin-left:0;">
            <div slot="header" class="clearfix">
                <span>业主端</span>
            </div>
            <el-upload
                class="upload-demo"
                ref="upload2"
                :action="action"
                accept=".apk"
                :auto-upload="false"
                :multiple="false"
                :on-success="handleSuccess2"
                :limit="1">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-input style="width: 120px;" v-model="apkVersion2" clearable placeholder="请输入版本号"></el-input>
                <el-button type="success"  @click="submitUpload2">上传到服务器</el-button>
            </el-upload>

            <div class="table-wrap">
                <el-table ref="table2" stripe border :data="tableData2">
                    <el-table-column :show-overflow-tooltip="true" type="index" label="序号" width="50"></el-table-column>

                    <el-table-column :show-overflow-tooltip="true" prop="createTime" :formatter="createTimeFormatter" label="上传时间"></el-table-column>

                    <el-table-column :show-overflow-tooltip="true" prop="version" label="版本号"></el-table-column>
                </el-table>
                <!--分页-->
                <el-pagination @size-change="onSizeChange2" @current-change="onCurrentChange2" :current-page=pageNum2 :page-sizes="[10, 15, 20, 25]" :page-size=pageSize2 layout="total, sizes, prev, pager, next, jumper" :total=totolNum2>

                </el-pagination>
            </div>
        </el-card>
    </div>
</template>

<script>
    import { api } from '@/libs'
    import Vue from 'vue'
    export default {
        name: "uploadapk",
        data(){
          return {
              action:api.fileserver+'upload/upload',
              apkVersion:'',
              apkVersion2:'',

              tableData1: [],
              pageNum1: 1,
              pageSize1: 10,
              totolNum1: 0,

              tableData2: [],
              pageNum2: 1,
              pageSize2: 10,
              totolNum2: 0,
          }
        },
        created(){
            this.search1();
            this.search2();
        },
        methods:{
            submitUpload(){

                if(this.apkVersion==''){
                    this.$message({
                        type:'error',
                        message:'版本号不能为空'
                    })
                    return;
                }

                this.$refs.upload.submit();

            },
            handleSuccess(res,file,fileList){
                let params = {
                    userId:localStorage.getItem('csmpLoginId'),
                    fileId:res.fileId,
                    version:this.apkVersion
                }
                //管理端文件上传
                this.$httpPost('/system/app/upload/gl',params).then(res => {
                    if(res.data.code===0) {
                        this.$message({
                            type:'success',
                            message:'上传成功'
                        })
                    }
                    this.$refs.upload.clearFiles()
                    this.apkVersion=''
                    this.search1()
                });
            },

            //业主端文件上传
            submitUpload2(){
                if(this.apkVersion2==''){
                    this.$message({
                        type:'error',
                        message:'版本号不能为空'
                    })
                    return;
                }
                this.$refs.upload2.submit();
            },
            handleSuccess2(res,file,fileList){
                let params = {
                    userId:localStorage.getItem('csmpLoginId'),
                    fileId:res.fileId,
                    version:this.apkVersion2
                }

                this.$httpPost('/system/app/upload/yz',params).then(res => {
                    if(res.data.code===0) {
                        this.$message({
                            type:'success',
                            message:'上传成功'
                        })
                    }
                    this.$refs.upload2.clearFiles()
                    this.apkVersion2=''
                    this.search2();
                });
            },

            //页码数改变
            onSizeChange1(val) {
                this.pageSize1 = val;
                this.search1();
            },
            //页码改变
            onCurrentChange1(val) {
                this.pageNum1 = val;
                this.search1();
            },
            // 初始化表格 搜索功能
            search1(type) {
                if(type=='param'){
                    this.pageNum1 = 1;
                }
                this.$httpPost('/system/file/findGl', {
                    page: this.pageNum1,
                    size: this.pageSize1

                }).then(res => {
                    this.tableData1 = res.data.body.content;
                    this.totolNum1 = Number(res.data.body.totalElements);
                })
            },

            //页码数改变
            onSizeChange2(val) {
                this.pageSize2 = val;
                this.search2();
            },
            //页码改变
            onCurrentChange2(val) {
                this.pageNum2 = val;
                this.search2();
            },
            // 初始化表格 搜索功能
            search2(type) {
                if(type=='param'){
                    this.pageNum2 = 1;
                }
                this.$httpPost('/system/file/findYz', {
                    page: this.pageNum2,
                    size: this.pageSize2

                }).then(res => {
                    this.tableData2 = res.data.body.content;
                    this.totolNum2 = Number(res.data.body.totalElements);
                })
            },

            //时间格式化
            createTimeFormatter(row, column, cellValue) {
                if(row.createTime!=null){
                    return Vue.filter('dateFormat')(row.createTime,'yyyy-MM-dd hh:mm:ss')
                }
            }
        }

    }
</script>

<style scoped>
    .table-wrap{
        margin-top:20px;
    }
</style>
