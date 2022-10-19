<template>
    <div class="wrap">
        <div class="subContent">
            <div class="tableWrap">
                <!--搜索功能-->
                <el-form :inline="true" :model="searchForm" class="zr-row-scatter">
                    <div></div>
                    <div>
                        <el-form-item label="">
                            <!-- 信息内容 -->
                            <el-input v-model="searchForm.keyword" clearable placeholder="信息标题、内容关键字"></el-input>
                        </el-form-item>

                        <el-form-item label="">
                            <!-- 信息类型 -->
                            <!--<el-input v-model="searchForm.msgType" clearable placeholder="信息类型"></el-input>-->
                            <DictSelect v-model="searchForm.msgType" selectData="msgType"
                                        placeholder="信息类型" :showContents="['7','8','9','10']"></DictSelect>

                        </el-form-item>
                        <el-form-item label="">
                            <!--信息状态-->
                            <!--&lt;!&ndash;<el-input v-model="searchForm.msgStatus" clearable placeholder="信息状态"></el-input>&ndash;&gt;-->
                            <DictSelect v-model="searchForm.msgStatus" selectData="msgStatus"
                                        placeholder="信息状态"></DictSelect>
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" @click="search('param')">搜索</el-button>
                        </el-form-item>
                    </div>
                </el-form>
                <!--数据表格渲染-->
                <el-table ref="table" stripe :data="tableData" style="width: 100%" @selection-change="onSelect">
                    <el-table-column type="selection" width="60"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" type="index" label="序号" align="center" width="50"></el-table-column>


                    <!-- 信息类型 -->
                    <el-table-column :show-overflow-tooltip="true" prop="msgType" :formatter="msgType"
                                     label="类型" align="center"></el-table-column>
                    <!-- 信息标题 -->
                    <el-table-column :show-overflow-tooltip="true" prop="title" align="center" label="标题">
                        <template slot-scope="scope">
                            <el-button type="text" size="smart" @click="toDetails(scope.$index, scope.row)">
                                {{scope.row.title}}
                            </el-button>
                        </template>
                    </el-table-column>
                    <!-- 信息内容 -->
                    <el-table-column :show-overflow-tooltip="true" prop="content" align="center" label="内容"></el-table-column>
                    <!-- 通知范围 -->
                    <!-- <el-table-column :show-overflow-tooltip="true" prop="roleIds" label="通知范围" align="center"></el-table-column> -->

                    <!-- 创建时间 -->
                    <el-table-column :show-overflow-tooltip="true" prop="createtTime" label="创建时间"
                                     :formatter="createTimeFormatter" align="center"></el-table-column>

                    <!-- 预计发布时间 -->
                    <el-table-column :show-overflow-tooltip="true" prop="predictTime" label="预计发布时间"
                                     :formatter="predictTimeFormatter" align="center"></el-table-column>
                    <!-- 创建人 -->
                    <el-table-column :show-overflow-tooltip="true" prop="creteName"
                                     label="创建人" align="center"></el-table-column>
                    <!-- 信息状态 -->
                    <el-table-column :show-overflow-tooltip="true" prop="msgStatus" :formatter="msgStatus"
                                     label="状态" align="center"></el-table-column>
                    <!-- 操作 -->
                    <el-table-column :show-overflow-tooltip="true" label="操作" width="180" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" size="mini" :disabled="scope.row.msgStatus != 1"  @click="toEdit(scope.$index, scope.row)">审核</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页-->
                <el-pagination v-if="renovatePagination" @size-change="onSizeChange" @current-change="onCurrentChange"
                               :current-page="pageNum" :page-sizes="[10, 15, 20, 25]" :page-size="pageSize"
                               layout="total, sizes, prev, pager, next, jumper" :total="totolNum">
                </el-pagination>
            </div>

            <!--编辑弹出窗-->
            <el-dialog   :close-on-click-modal="false"  :title="isDetail?'明细':(editform.id?'审核信息':'新增')" :visible.sync="formDialogVisible"
                       :before-close="close" width="900px">
                <el-form :model="editform" :rules="rules" ref="editform" label-width="140px">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="类型" prop="msgType">
                                <!-- 信息类型 -->
                                <!--<el-input v-model="editform.msgType" :disabled="isDetail"></el-input>-->
                                <DictSelect v-model="editform.msgType" disabled :selectData="msgTypeList"
                                            placeholder="信息类型" :showContents="['7','8','9','10']" ></DictSelect>


                            </el-form-item>
                        </el-col>
                        <!-- 是否需要审批 -->
                        <el-col :span="12">
                            <el-form-item label="是否需要审批" prop="isAudit" >
                                <el-radio-group v-model="editform.isAudit" disabled>
                                    <el-radio label="0">是</el-radio>
                                    <el-radio label="1">否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="信息标题" prop="title">
                                <!-- 信息标题 -->
                                <el-input v-model="editform.title" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="信息内容" prop="content">
                                <!-- 信息内容 -->
                                <!--<el-input v-model="editform.content" :disabled="isDetail"></el-input>-->
                                <el-input type="textarea" disabled :autosize="{minRows:5}"
                                          v-model="editform.content" maxlength="100"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="通知范围" prop="roleIds">
                                <!-- 接收角色 -->
                                <!--<el-input v-model="editform.roleIds" :disabled="isDetail"></el-input>-->
                                <el-select v-model="editform.roleIds" multiple   style="width: 100%;" disabled>
                                    <el-option v-for="item in roleList" :label="item.label" :key="item.value" :value="item.value">
                                    </el-option>
                                </el-select>

                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <!-- 预计发布时间 -->
                            <el-form-item label="预计发布时间" prop="predictTime">
                                <el-date-picker
                                     v-model="editform.predictTime"
                                     type="datetime"
                                     value-format="timestamp"
                                     format="yyyy-MM-dd HH:mm"
                                     placeholder="预计发布时间"
                                     disabled>
                                 </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <!-- 创建人 -->
                            <el-form-item label="创建人" prop="creteName">
                                <el-input v-model="editform.creteName" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <!-- 创建时间 -->
                        <el-col :span="12">
                            <el-form-item label="创建时间" prop="createTime">
                                <el-date-picker
                                     v-model="editform.createTime"
                                     type="datetime"
                                     value-format="timestamp"
                                     format="yyyy-MM-dd HH:mm"
                                     placeholder="创建时间"
                                     :disabled="true">
                                 </el-date-picker>

                            </el-form-item>
                        </el-col>
                    </el-row>
<!--                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="附件">
                                <el-upload
                                   action=action
                                  :on-preview="handlePreview"
                                  :on-remove="handleRemove"
                                  :before-remove="beforeRemove"
                                  :limit="1"
                                  :on-exceed="handleExceed"
                                  :file-list="fileList"
                                  :disabled="isDetail">
                                  <el-button size="small" type="primary" :disabled="isDetail">点击上传</el-button>

                                </el-upload>
                            </el-form-item>
                        </el-col>
                    </el-row>-->
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="审核结果" prop="auditResult">
                                <el-radio-group v-model="editform.auditResult" @change="ideaChange" :disabled="isDetail">
                                    <el-radio label="0">同意</el-radio>
                                    <el-radio label="1">退回</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="退回原因" prop="auditContent" v-if="showAuditContent">
                                <!-- 信息内容 -->
                                <!--<el-input v-model="editform.content" :disabled="isDetail"></el-input>-->
                                <el-input type="textarea" :disabled="isDetail" :autosize="{minRows:5}"
                                          v-model="editform.auditContent" maxlength="1000"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <!-- 审核人 -->
                            <el-form-item label="审核人" prop="auditName">
                                <el-input v-model="editform.auditName" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <!-- 审核时间 -->
                        <el-col :span="12">
                            <el-form-item label="审核时间" prop="auditTime">
                                <el-date-picker
                                     v-model="editform.auditTime"
                                     type="datetime"
                                     value-format="timestamp"
                                     format="yyyy-MM-dd HH:mm"
                                     placeholder="审核时间"
                                     :disabled="true">
                                 </el-date-picker>

                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer" v-if="!isDetail">
                    <el-button type="primary" @click="save()">确 定</el-button>
                    <el-button @click="close()">取 消</el-button>
                </span>
            </el-dialog>

        </div>
    </div>
</template>

<script>

    import { api, dict, axiosHttp } from '@/libs'
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
                isDetail: false,
                formDialogVisible: false,
                showAuditContent:false,
                publishScreenLocationVisible: false,
                editform: {},editform2:{},
                deleteIds: '',
                checkedArr: [],
                msgStatusList: [],
                msgTypeList: [],
                roleList: [],
                roleNameList:[],
                fileList: [],
                // 校验
                rules: {
                    // 信息类型
                    msgType: [{
                        required: true,
                        message: '请选择信息类型',
                        trigger: 'change'
                    }],
                    // 是否需要审批
                    isAudit: [{
                            required: true,
                            message: '请选择是或否',
                            trigger: 'blur'
                        }],
                    // 信息标题
                    title: [{
                        required: true,
                        message: '请输入信息标题',
                        trigger: 'blur'
                    }],
                    // 信息内容
                    content: [{
                        required: true,
                        message: '请输入信息内容',
                        trigger: 'blur'
                    }],
                    // 通知范围
                    roleIds: [{
                        required: true,
                        message: '请选择接收角色',
                        trigger: 'blur'
                    }],
                    // 预计发布时间
                    predictTime: [{
                        required: true,
                        message: '请选择预计发布时间',
                        trigger: 'change'
                    }],
                    //创建人
                    creteName: [{
                            required: true,
                            message: '创建人',
                            trigger: 'change'
                        }],
                    //创建时间
                    createTime:[{
                            required: true,
                            message: '选择创建时间',
                            trigger: 'change'
                        }],

                    // 审核结果
                    auditResult: [{
                        required: true,
                        message: '请选择审核结果',
                        trigger: 'change'
                    }],
                    //退回原因
                    auditContent:[{
                        required: true,
                        message: '请填写退回原因',
                        trigger: 'change'
                    }],
                    //审核人
                    // auditName:[{
                    //     required: true,
                    //     message: '审核人',
                    //     trigger: 'change'
                    // }],
                    //审核时间
                    // auditTime:[{
                    //     required: true,
                    //     message: '审核时间',
                    //     trigger: 'change'
                    // }]
                }
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
                if (type == 'param') {
                    this.pageNum = 1;
                    this.renovatePagination = false;
                }
                axiosHttp.post('/message/msgAudit/find', {
                    // 信息类型
                    msgType: this.searchForm.msgType,
                    // 信息标题
                    keyword: this.searchForm.keyword,
                    /*// 信息内容
                    content: this.searchForm.content,*/
                    msgStatus: this.searchForm.msgStatus,
                    page: this.pageNum,
                    size: this.pageSize

                }).then(res => {
                    console.log(res);
                    this.tableData = res.content;
                    this.totolNum = Number(res.totalElements);
                    this.renovatePagination = true
                })
            },
            // 弹出修改弹出框
            toEdit(index, row) {
                this.formDialogVisible = true;
                this.isDetail = false;
                if (row) {
                	console.log(row);
                	this.deleteIds = row.id;
                    this.editform =Object.assign ({itemIndex:index},row);
                    if (row.roleIds) {
                        //  调用接口 获取 角色
                        axiosHttp.post('/message/msgInform/selectActiveRole', {
                            // ID
                            ids: row.roleIds,

                        }).then(res => {
                            this.editform.roleIds=res.split(",");
                        })
                    }
                    if(this.editform.auditResult=="0"){
                        this.showAuditContent = false;
                    }else if(this.editform.auditResult=="1"){
                    	this.showAuditContent = true;

                    }
                    if(this.editform.id){
                        let currentTime = new Date().getTime();
                        this.editform.auditTime = currentTime;
                        this.editform.auditName = localStorage.getItem('csmpLoginName');
                    }

                }
            },
            // 弹出查看详情弹出框
            toDetails(index, row) {
                const _this = this;
                if (row) {
                	 this.editform =({itemIndex:index},row);
                 if (row.roleIds) {
                        //  调用接口 获取 角色
                        axiosHttp.post('/message/msgInform/selectActiveRole', {
                            // ID
                            ids: row.roleIds,

                        }).then(res => {
                            _this.editform.roleIds=res.split(",");
                        })
                    }
                    if(_this.editform.auditResult=="0"){
                        this.showAuditContent = false;
                    }else if(_this.editform.auditResult=="1"){
                    	this.showAuditContent = true;

                    }

                }
                this.formDialogVisible = true;
                this.isDetail = true
            },
            //创建时间格式化
            createTimeFormatter(row, column, cellValue) {
                if(row.createTime!=null){
                    return Vue.filter('dateFormat')(row.createTime,'yyyy-MM-dd hh:mm:ss')
                }
            },
            //时间格式化
            predictTimeFormatter(row, column, cellValue) {
                if (row.predictTime != null) {
                    return Vue.filter('dateFormat')(row.predictTime, 'yyyy-MM-dd hh:mm:ss')
                }
            },
            //  获取角色列表
            selectRole() {
                this.$httpPost('/system/user/role/getRoleName').then(res => {

                    if (res.data.msg === "success") {
                        var dataArr = res.data.body;
                        if (dataArr.length != 0) {
                            for (var i = 0; i < dataArr.length; i++) {
                                if (dataArr[i].active === 1) {
                                    var newObj = new Object();
                                    newObj.label = dataArr[i].name;
                                    newObj.value = dataArr[i].id;
                                    this.roleList.push(newObj);
                                }

                            }
                            console.log(this.roleList);
                        } else {
                            this.roleList = [];
                        }
                    } else {
                        Toast("加载服务类型失败");
                    }

                }, function (response) {

                });
            },
            // 修改 新增 保存
            save() {
                this.$refs.editform.validate((valid) => {
                    if (valid) {
                        axiosHttp.post('/message/msgAudit/save', {
                            // ID
                            id: this.deleteIds,
  							//isAudit: this.isAudit,
                            // 审核结果
                            auditResult: this.editform.auditResult,
                            // 审核意见
                            auditContent: this.editform.auditContent,
                            //审核人
                            auditName:this.editform.auditName,
                            //审核时间
                            auditTime:this.editform.auditTime

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
                if (row) {
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
            saveBatch() {
                this.$refs.editform2.validate((valid) => {
                    if (valid) {
                        axiosHttp.post('/message/msgAudit/save', {
                            id: this.deleteIds,
                            auditResult: this.editform2.auditResult,
                            auditContent: this.editform2.auditContent,
                        }).then(res => {
                            this.deleteVisible = false;
                            this.deleteIds = "";
                            this.search();
                            this.$refs.editform2.resetFields();
                        })
                    } else {
                        return false;
                    }
                })
            },
            // 表格选择改变事件
            onSelect(val) {
                this.checkedArr = val;
                let idsArr = [];
                for (var i = 0; i < val.length; i++) {
                    idsArr.push(val[i].id)
                }
                this.deleteIds = idsArr.join(',');
            },
            //退回时显示退回原因
            ideaChange(value){

                if(value=="0"){
                    this.showAuditContent = false;
                }else if(value=="1"){
                	this.showAuditContent = true;

                }

            },

            msgType: function (row, column, cellValue) {
                if (this.msgTypeList.find(item => item.value === row.msgType)) return this.msgTypeList.find(item => item.value === row.msgType).label
            }
            ,
            msgStatus: function (row, column, cellValue) {
                if (this.msgStatusList.find(item => item.value === row.msgStatus)) return this.msgStatusList.find(item => item.value === row.msgStatus).label

            },
            //上传附件
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`);
            }

        },

        // 页面加载时执行
        created: function () {
            this.search();
            this.selectRole();
            dict.dict('msgType').then(payload => this.msgTypeList = payload);
            dict.dict('msgStatus').then(payload => this.msgStatusList = payload)

        }
    }
</script>
