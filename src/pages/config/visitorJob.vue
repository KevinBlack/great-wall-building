
<template>
    <div class="wrap">
        <div class="subContent zr-row">
            <div class="tableWrap">
                <!--搜索功能-->
                <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                    <!--<el-button type="primary" @click="search()">刷新</el-button>-->
                    <div class="zr-row">
                    <el-button type="primary" @click="handleadd" >添加</el-button>
                    </div>
                </el-form>
                <!--数据表格渲染-->
                <el-table
                    ref="testTable"
                    :data="tableData"
                    style="width:100%"
                    border
                >
                    <el-table-column
                        prop="JOB_NAME"
                        label="任务名称"
                        sortable
                        show-overflow-tooltip>
                    </el-table-column>

                    <el-table-column
                        prop="JOB_GROUP"
                        label="任务所在组"
                        sortable>
                    </el-table-column>

                    <el-table-column
                        prop="JOB_CLASS_NAME"
                        label="任务类名"
                        sortable>
                    </el-table-column>

                    <el-table-column
                        prop="TRIGGER_NAME"
                        label="触发器名称"
                        sortable>
                    </el-table-column>

                    <el-table-column
                        prop="TRIGGER_GROUP"
                        label="触发器所在组"
                        sortable>
                    </el-table-column>

                    <el-table-column
                        prop="CRON_EXPRESSION"
                        label="表达式"
                        sortable>
                    </el-table-column>

                    <el-table-column
                        prop="TIME_ZONE_ID"
                        label="时区"
                        sortable>
                    </el-table-column>


                    <el-table-column label="操作" width="180">
                        <template slot-scope="scope">
                            <!--<el-button type="text" size="mini" @click="toEdit(scope.$index, scope.row)">启用</el-button>-->
                            <el-button
                                size="small"
                                type="warning"
                                @click="handlePause(scope.$index, scope.row)">暂停</el-button>

                            <el-button
                                size="small"
                                type="info"
                                @click="handleResume(scope.$index, scope.row)">恢复</el-button>

                            <el-button
                                size="small"
                                type="danger"
                                @click="handleDelete(scope.$index, scope.row)">删除</el-button>

                            <el-button
                                size="small"
                                type="success"
                                @click="handleUpdate(scope.$index, scope.row)">修改</el-button>
                        </template>
                    </el-table-column>

                </el-table>
                <!--分页-->
                <!--<el-pagination @size-change="onSizeChange" @current-change="onCurrentChange" :current-page=pageNum :page-sizes="[15, 20, 25, 30]" :page-size=pageSize layout="total, sizes, prev, pager, next, jumper" :total=totolNum>
                </el-pagination>-->
            </div>





            <el-dialog   :close-on-click-modal="false" title="添加任务" :visible.sync="dialogFormVisible">
                <el-form :model="form">
                    <el-form-item label="任务名称" label-width="120px" style="width:35%">
                        <el-input v-model="form.jobName" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="任务分组" label-width="120px" style="width:35%">
                        <el-input v-model="form.jobGroup" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="表达式" label-width="120px" style="width:35%">
                        <el-input v-model="form.cronExpression" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="add">确 定</el-button>
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                </div>
            </el-dialog>

            <el-dialog   :close-on-click-modal="false"  title="修改任务" :visible.sync="updateFormVisible">
                <el-form :model="updateform">
                    <el-form-item label="表达式" label-width="120px" style="width:35%">
                        <el-input v-model="updateform.cronExpression" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="update">确 定</el-button>
                    <el-button @click="updateFormVisible = false">取 消</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import formValidation from '@/config/formValidation.js'
    import { formatDate } from '../../../static/js/date.js'
    export default {
        // 变量初始化定义
        data() {
            return {
                tableData: [],
                pageNum: 1,
                pageSize: 15,
                totolNum: 100,
                searchForm: {},
                //请求的URL
                url:'/system/job/queryJob',
                //默认每页数据量
                pagesize: 10,

                //当前页码
                currentPage: 1,

                //查询的页码
                start: 1,

                //默认数据总数
                totalCount: 1000,

                //添加对话框默认可见性
                dialogFormVisible: false,

                //修改对话框默认可见性
                updateFormVisible: false,

                //提交的表单
                form: {
                    jobName: '',
                    jobGroup: '',
                    cronExpression: '',
                },

                updateform: {
                    jobName: '',
                    jobGroup: '',
                    cronExpression: '',
                },

            }

        },
        // 页面加载时执行
        created: function() {
            // this.initServerType();
            // alert();
            this.loadData();
        },
        // 自定义方法
        methods: {
            //从服务器读取数据
            loadData: function(pageNum, pageSize){
                const _this=this;
                // alert(1);
                this.$httpPost('/system/job/queryJob2').then(function(res){
                    console.log(res.data)
                    _this.tableData = res.data.body;
                    // this.totalCount = res.body.number;
                },function(){
                    console.log('failed');
                });
            },

            //单行删除
            handleDelete: function(index, row) {
                const _this=this;
                this.$httpPost('/system/job/deleteJob2',{"jobClassName":row.JOB_NAME,"jobGroupName":row.JOB_GROUP},{emulateJSON: true}).then(function(res){
                    _this.loadData();
                },function(){
                    console.log('failed');
                });
            },

            //暂停任务
            handlePause: function(index, row){
                const _this=this;
                this.$httpPost('/system/job/pauseJob2',{"jobClassName":row.JOB_NAME,"jobGroupName":row.JOB_GROUP},{emulateJSON: true}).then(function(res){
                    _this.loadData();
                },function(){
                    console.log('failed');
                });
            },

            //恢复任务
            handleResume: function(index, row){
                const _this=this;
                this.$httpPost('/system/job/resumeJob2',{"jobClassName":row.JOB_NAME,"jobGroupName":row.JOB_GROUP},{emulateJSON: true}).then(function(res){
                    _this.loadData();
                },function(){
                    console.log('failed');
                });
            },

            //搜索
            search: function(){
                this.loadData();
            },

            //弹出对话框
            handleadd: function(){
                this.dialogFormVisible = true;
            },

            //添加
            add: function(){
                const _this=this;
                this.$httpPost('/system/job/addJob2',{"jobClassName":this.form.jobName,"jobGroupName":this.form.jobGroup,"cronExpression":this.form.cronExpression},{emulateJSON: true}).then(function(res){
                    _this.loadData();
                    this.dialogFormVisible = false;
                },function(){
                    console.log('failed');
                });
            },

            //更新
            handleUpdate: function(index, row){
                console.log(row)
                this.updateFormVisible = true;
                this.updateform.jobName = row.JOB_CLASS_NAME;
                this.updateform.jobGroup = row.JOB_GROUP;
            },

            //更新任务
            update: function(){
                this.$httpPost
                ('/system/job/rescheduleJob2',
                    {"jobClassName":this.updateform.jobName,
                        "jobGroupName":this.updateform.jobGroup,
                        "cronExpression":this.updateform.cronExpression
                    },{emulateJSON: true}
                ).then(function(res){
                    this.loadData(this.currentPage, this.pagesize);
                    this.updateFormVisible = false;
                },function(){
                    console.log('failed');
                });

            },

            //每页显示数据量变更
            handleSizeChange: function(val) {
                this.pagesize = val;
                this.loadData(this.currentPage, this.pagesize);
            },

            //页码变更
            handleCurrentChange: function(val) {
                this.currentPage = val;
                this.loadData(this.currentPage, this.pagesize);
            },

        }
    }
    //载入数据
    // vue.loadData(vue.currentPage, vue.pagesize);
</script>
