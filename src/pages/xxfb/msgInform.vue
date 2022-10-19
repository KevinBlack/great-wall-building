
<template>
    <div class="wrap">
        <div class="subContent">
            <div class="tableWrap">
                <!--搜索功能-->
                <el-form :inline="true" :model="searchForm" class="zr-row-scatter">
                    <div>
                        <el-button type="primary" @click="toEdit()">创建</el-button>
                        <el-button type="primary" @click="toDelete()">批量删除</el-button>
						<el-button type="primary" @click="toSend()">批量发布</el-button>
                    </div>
                    <div>

                        <el-form-item label="">
                            <!-- 信息内容 -->
                            <el-input v-model="searchForm.keyword" clearable placeholder="信息标题、内容关键字"></el-input>
                        </el-form-item>

                        <el-form-item label="">
                            <!-- 信息类型 -->
                            <!--<el-input v-model="searchForm.msgType" clearable placeholder="信息类型"></el-input>-->
                            <DictSelect v-model="searchForm.msgType"  selectData="msgType"
                                        placeholder="信息类型" :showContents="['7','8','9','10']" ></DictSelect>

                        </el-form-item>
                        <el-form-item label="">
                            <!-- 信息状态 -->
                            <!--<el-input v-model="searchForm.msgStatus" clearable placeholder="信息状态"></el-input>-->
                            <DictSelect v-model="searchForm.msgStatus"  selectData="msgStatus"
                                        placeholder="信息状态" ></DictSelect>
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" @click="search('param')">搜索</el-button>
                        </el-form-item>
                    </div>
                </el-form>
                <!--数据表格渲染-->
                <el-table ref="table" stripe :data="tableData" style="width: 100%" @selection-change="onSelect">
                    <el-table-column type="selection" width="60"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" type="index" label="序号" width="50" align="center"></el-table-column>

                    <!-- 信息类型 -->
                    <el-table-column :show-overflow-tooltip="true" prop="msgType" label="类型" align="center"  :formatter="msgType"></el-table-column>
                    <!-- 信息标题 -->
                    <el-table-column :show-overflow-tooltip="true" prop="title" label="标题" align="center">

                        <template slot-scope="scope">
                            <el-button type="text" size="smart" @click="toDetails(scope.$index, scope.row)">{{scope.row.title}}</el-button>
                        </template>
                    </el-table-column>
                    <!-- 信息内容 -->
                    <el-table-column :show-overflow-tooltip="true" prop="content" label="内容" align="center">
                    </el-table-column>
                    <!-- 通知范围 -->
                    <!-- <el-table-column :show-overflow-tooltip="true" prop="roleIds" label="通知范围" align="center"></el-table-column> -->
                    <!-- 是否需要审批 -->
                    <el-table-column :show-overflow-tooltip="true" prop="isAudit" label="是否需要审批" align="center" :formatter="isAuditFormatter"></el-table-column>
                    <!-- 创建时间 -->
                    <el-table-column :show-overflow-tooltip="true" prop="createTime" label="创建时间" align="center" :formatter="createTimeFormatter"></el-table-column>
                    <!-- 创建人 -->
                    <el-table-column :show-overflow-tooltip="true" prop="creteName" label="创建人" align="center"></el-table-column>
                    <!-- 预计发布时间 -->
                    <el-table-column :show-overflow-tooltip="true" prop="predictTime" label="预计发布时间"  :formatter="predictTimeFormatter" align="center"></el-table-column>

                    <!-- 信息状态 -->
                    <el-table-column :show-overflow-tooltip="true" prop="msgStatus" label="信息状态" align="center" :formatter="msgStatus"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" label="操作" align="center" width="180">
                        <template slot-scope="scope">
                            <el-button type="text" size="mini" :disabled="scope.row.msgStatus==1||scope.row.msgStatus==3||scope.row.msgStatus==4" @click="toEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button type="text" size="mini" :disabled="scope.row.msgStatus==4" @click="toDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页-->
                <el-pagination v-if="renovatePagination" @size-change="onSizeChange" @current-change="onCurrentChange" :current-page="pageNum" :page-sizes="[10, 15, 20, 25]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totolNum">
                </el-pagination>
            </div>

            <!--编辑弹出窗-->
            <el-dialog   :title="isDetail?'明细':(editform.id?'编辑':'创建')" :visible.sync="formDialogVisible" :before-close="close" width="900px">
                <el-form :model="editform" :rules="rules" ref="editform" label-width="140px">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="类型" prop="msgType">
                                    <!-- 信息类型 -->
                                    <!--<el-input v-model="editform.msgType" :disabled="isDetail"></el-input>-->
                                    <DictSelect v-model="editform.msgType" :disabled="isDetail" :selectData="msgTypeList"
                                                placeholder="信息类型" :showContents="['7','8','9','10']" ></DictSelect>


                                </el-form-item>
                            </el-col>
                            <!-- 是否需要审批 -->
                            <el-col :span="12">
                                <el-form-item label="是否需要审批" prop="isAudit" >
                                    <el-radio-group v-model="editform.isAudit" :disabled="isDetail">
                                        <el-radio label="0">是</el-radio>
                                        <el-radio label="1">否</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                        </el-row>
                         <!-- 信息标题 -->
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="标题" prop="title">
                                    <!-- 信息标题 -->
                                    <el-input v-model="editform.title" maxlength="1000" :disabled="isDetail"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <!-- 信息内容 -->
                        <el-row>
                            <el-col :span="24">
                                    <el-form-item label="内容" prop="content">
                                       <!-- 信息内容 -->
                                        <!--<el-input v-model="editform.content" :disabled="isDetail"></el-input>-->
                                        <el-input type="textarea"  :disabled="isDetail" :autosize="{minRows:5}" v-model="editform.content" maxlength="1000"></el-input>
                                    </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="发布方式" prop="sendWayCheckList">
                                    <!-- 信息状态 -->
                                    <!--<el-input v-model="editform.sendWay" :disabled="isDetail"></el-input>-->
                                    <!--<el-radio-group v-model="editform.sendWay" @change="sendWayChange">
                                        <el-radio label="1">信息推送</el-radio>
                                        <el-radio label="2">发布屏</el-radio>
                                    </el-radio-group>-->

                                    <el-checkbox-group v-model="editform.sendWayCheckList" @change="sendWayChange" :disabled="isDetail">
                                        <el-checkbox label="1">消息推送</el-checkbox>
                                        <el-checkbox label="2" :disabled="true">消息发布屏</el-checkbox>
                                    </el-checkbox-group>

                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="通知范围" prop="roleIds">
                                    <!-- 接收角色 -->
                                    <!--<el-input v-model="editform.roleIds" :disabled="isDetail"></el-input>-->

                                    <el-select v-model="editform.roleIds" multiple   style="width: 100%;" :disabled="isDetail">
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
                                         :disabled="isDetail">
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
                    <!-- 拒绝原因 -->
                    <el-row v-if="editform.auditContent">
                        <el-col :span="24">
                                <el-form-item label="退回原因" prop="content">
                                   <!-- 信息内容 -->
                                    <!--<el-input v-model="editform.content" :disabled="isDetail"></el-input>-->
                                    <el-input type="textarea"  disabled :autosize="{minRows:5}" v-model="editform.auditContent" maxlength="1000"></el-input>
                                </el-form-item>
                        </el-col>
                    </el-row>
                    <!--<el-row>
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

                </el-form>
                <span v-if="!isDetail" slot="footer" class="dialog-footer">
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

            <el-dialog   title="提示" :visible.sync="sendVisible" width="30%">
                <span>确定发布？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="sendRow()">确 定</el-button>
                    <el-button @click="sendVisible = false">取 消</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>

    import { api, dict, axiosHttp,util } from '@/libs'
    import Vue from 'vue'
    import { formatDate } from '../../../static/js/date.js'
    import {mapActions} from 'vuex'


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
                publishScreen:'',
                //是否为详情，并设置是否disable
                isDetail:false,
                formDialogVisible :false,
                sendVisible :false,
                isupkeep :true,
                editform: {
                    sendWayCheckList:[],
                    publishScreenLocation:[]
                },
                deleteIds: '',
                checkedArr: [],
                msgStatusList: [],
                msgTypeList: [],
                sendWay: '',
                // 角色列表
                roleList:[],
                // ids
                responsiblePersonVal:'',
                // names
                responsiblePersons:'',
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
                        trigger: 'change'
                    }],
                // 预计发布时间
                predictTime: [{
                        required: true,
                        message: '请选择预计发布时间',
                        trigger: 'change'
                    }],
                // 信息状态
                sendWayCheckList: [{
                        required: true,
                        message: '请选择发布方式',
                        trigger: 'change'
                    }],
                //创建人
              creteName: [{
                        required: false,
                        message: '创建人',
                        trigger: 'change'
                    }],
                //创建时间
                createTime:[{
                        required: false,
                        message: '选择创建时间',
                        trigger: 'change'
                    }]
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
                if(type=='param'){
                    this.pageNum = 1;
                    this.renovatePagination = false;
                }
                axiosHttp.post('/message/msgInform/find', {
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
                    this.renovatePagination = true;

            })
            },
            msgStatus: function(row, column, cellValue) {
                if(this.msgStatusList.find(item => item.value === row.msgStatus)) return this.msgStatusList.find(item => item.value === row.msgStatus).label

            },
            msgType: function(row, column, cellValue) {
                if(this.msgTypeList.find(item => item.value === row.msgType)) return this.msgTypeList.find(item => item.value === row.msgType).label
            },
            // 弹出修改弹出框
            toSend(index, row) {
                if(row) {
                    this.deleteIds = row.id;
                    this.sendVisible = true;
                } else {
                    if (this.$refs.table.store.states.selection.length > 0) {
                        if(!this.isupkeep){
                            this.$message.error('请选择信息状态为待发布的数据！');
                            return;
                        }
                        this.sendVisible = true;
                    } else {
                        this.$message.error('请至少选择一条数据');
                    }
                }
            },
            // 弹出修改弹出框
            toEdit(index, row) {
                this.isDetail=false;
                //this.responsiblePersonChange(row.roleIds);
                this.$nextTick(() => {
                    if(row){
                        this.editform =Object.assign ({itemIndex:index,sendWayCheckList:[],publishScreenLocation:[]},row);
                        if(row.sendWay){
                             this.editform.sendWayCheckList=row.sendWay.split(",");
                        }

                        if(row.roleIds){
                            //  调用接口 获取 角色
                            axiosHttp.post('/message/msgInform/selectActiveRole', {
                                // ID
                                ids: row.roleIds,
                            }).then(res => {
                                this.editform.roleIds=res.split(",");

                            })
                        }


                    }else{
                        let currentTime = new Date().getTime();
                        if(this.editform.id == undefined){
                            this.editform.createTime = currentTime;
                            this.editform.creteName = localStorage.getItem('csmpLoginName');
                        }
                    }
                })
                this.formDialogVisible = true;
            },
            // 弹出查看详情弹出框
            toDetails(index, row) {
                    const _this = this;
                if(row){
                    this.editform =Object.assign ({itemIndex:index,sendWayCheckList:[],publishScreenLocation:[]},row);
                    if(row.sendWay) _this.editform.sendWayCheckList=row.sendWay.split(",");
                    if(row.roleIds){
                        //  调用接口 获取 角色
                        axiosHttp.post('/message/msgInform/selectActiveRole', {
                            // ID
                            ids: row.roleIds,

                        }).then(res => {
                            _this.editform.roleIds=res.split(",");

                        })

                    }

                }
                this.formDialogVisible = true;
                this.isDetail = true

            },
            sendWayChange(value){

                this.sendWay=value.join(",");
                // let checkedCount = value.length;
                //  checkedCount === this.sendWayCheckList.length;
                // alert();
            },
            //创建时间格式化
            createTimeFormatter(row, column, cellValue) {
                if(row.createTime!=null){
                    return Vue.filter('dateFormat')(row.createTime,'yyyy-MM-dd hh:mm:ss')
                }
            },
            //预计时间格式化
            predictTimeFormatter(row, column, cellValue) {
                if(row.predictTime!=null){
                    return Vue.filter('dateFormat')(row.predictTime,'yyyy-MM-dd hh:mm:ss')
                }
            },
             //是否需要审批 0：是，1：否）
            isAuditFormatter(row, column, cellValue){
                 switch (row.isAudit){
                        case "0":
                            return "是";
                        case "1":
                            return "否";
                        default:
                             return "";
                 }
             },
            //  获取角色列表
            selectRole() {
                this.$httpPost('/system/user/role/getRoleName').then(res => {

                    if(res.data.msg === "success") {
                        var dataArr = res.data.body;
                        if(dataArr.length!= 0){
                            for(var i = 0;i<dataArr.length;i++){
                                if(dataArr[i].active === 1) {
                                    var newObj = new Object();
                                    newObj.label = dataArr[i].name;
                                    newObj.value = dataArr[i].id;
                                    this.roleList.push(newObj);

                                }

                            }
                        }else{
                            this.roleList=[];
                        }
                    }else{
                        Toast("加载服务类型失败");
                    }

                }, function(response) {

                });
            },
            // 修改 创建 保存
            save() {
                this.$refs.editform.validate((valid) => {
                    if(valid) {
                        let predictTime = "";
                        let createTime = "";
                        if(this.editform.predictTime != undefined) {
                            predictTime = formatDate(new Date(Number(this.editform.predictTime)), "yyyy-MM-dd hh:mm:ss");
                            createTime = formatDate(new Date(Number(this.editform.createTime)), "yyyy-MM-dd hh:mm:ss");
                        }

                        axiosHttp.post('/message/msgInform/save', {
                            // ID
                            id: this.editform.id,
                            // 信息类型
                            msgType: this.editform.msgType,
                            //是否需要审批
                             isAudit: this.editform.isAudit,
                            // 信息标题
                            title: this.editform.title,
                            // 信息内容
                            content: this.editform.content,
                            // 接收角色
                            roleIds: !this.editform.roleIds?'':this.editform.roleIds.join(","),
                            // 预计发布时间
                            predictTime: predictTime,
                            // 发布方式
                            sendWay: this.editform.sendWayCheckList.join(","),
                           // 创建人
                            creteName:this.editform.creteName,
                            // 创建时间
                            createTime: this.editform.createTime,
                            // 信息状态
                            msgStatus: this.editform.msgStatus,



                        }).then(res => {
                            this.search();
                            this.formDialogVisible = false;
                            this.$refs.editform.resetFields();
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
                    console.log(row);
                } else {
                    if (this.$refs.table.store.states.selection.length > 0) {
                        let arr = this.$refs.table.store.states.selection;
                        console.log(arr);
                        for(var i = 0; i < arr.length; i++) {
                            if(arr[i].msgStatus == 4){
                                  this.$message.error('所选数据存在已发布数据，不能进行删除!');
                                  return;
                                }

                            }

                       this.deleteVisible = true;
                    } else {
                        this.$message.error('请至少选择一条数据');
                    }
                }

            },
            // 删除 行  包括单选和多选
            deleteRow() {
                axiosHttp.post('/message/msgInform/delete', {
                    id: this.deleteIds
                }).then(res => {
                    this.deleteVisible = false;
                this.deleteIds = "";
                this.search();
                })
            },
            //发布
            sendRow() {
                axiosHttp.post('/message/msgInform/send', {
                    id: this.deleteIds
                }).then(res => {
                    this.sendVisible = false;
                    this.deleteIds = "";
                    this.search();
                    this.getUnReadCount();
                })
            },
            // 表格选择改变事件
            onSelect(val) {
                this.checkedArr = val;
                let idsArr = [];
                let typesArr = [];
                for(var i = 0; i < val.length; i++) {
                    idsArr.push(val[i].id)
                    typesArr.push(val[i].msgStatus)
                }
                this.deleteIds = idsArr.join(',');
                if (typesArr.length>0) {
                    for(var i=0;i<typesArr.length;i++){
                        if ("3"!=typesArr[i]) {
                            this.isupkeep=false;
                            return;
                        }else{
                            this.isupkeep=true;
                        }
                    }
                }else{
                    this.isupkeep=true;
                }
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
            },
            ...mapActions(['getUnReadCount'])

        },
        // 页面加载时执行
        created: function() {
            this.search();
            this.selectRole();
            dict.dict('msgType').then(payload => this.msgTypeList = payload);
            dict.dict('msgStatus').then(payload => this.msgStatusList = payload);
        }
    }
</script>
