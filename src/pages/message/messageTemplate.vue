<template>
    <div class="wrap">
        <div class="subContent">
            <div class="tableWrap">
                <!--搜索功能-->
                <el-form :inline="true" :model="searchForm" class="zr-row-scatter">
                    <div>
                        <!--<el-button type="primary" @click="toEdit()">创建</el-button>-->
                    </div>
                    <div>

                        <el-form-item label="">
                            <!-- 机构id -->
                            <!--<el-input v-model="searchForm.apiId" clearable placeholder="消息类型"></el-input>-->
                            <DictSelect v-model="searchForm.type" selectData="msgType"
                                        placeholder="消息类型" :showContents="['1','2','3','4','5','6']"></DictSelect>

                        </el-form-item>
                        <el-form-item label="">
                            <!-- 密钥 -->
                            <el-input v-model="searchForm.title" clearable placeholder="消息标题"></el-input>
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
                    <!-- 机构名称 -->
                    <el-table-column :show-overflow-tooltip="true" prop="msgCode" label="消息编码"></el-table-column>
                    <!-- 机构id -->
                    <el-table-column :show-overflow-tooltip="true" prop="type" label="消息类型"></el-table-column>
                    <!-- 消息标题 -->
                    <el-table-column :show-overflow-tooltip="true" prop="title" label="消息标题"></el-table-column>
                    <!-- 内容模板 -->
                    <el-table-column :show-overflow-tooltip="true" prop="content" label="内容模板"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" label="操作" width="180">
                        <template slot-scope="scope">
                            <el-button type="text" size="mini" @click="toEdit(scope.$index, scope.row)">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页-->
                <el-pagination v-if="renovatePagination" @size-change="onSizeChange" @current-change="onCurrentChange"
                               :current-page=pageNum :page-sizes="[10, 15, 20, 25]" :page-size=pageSize
                               layout="total, sizes, prev, pager, next, jumper" :total=totolNum>
                </el-pagination>
            </div>

            <!--编辑弹出窗-->
            <el-dialog   :close-on-click-modal="false"  :title="isDetail?'查看详情':(editform.id?'编辑':'新增')" :visible.sync="formDialogVisible"
                       :before-close="close" width="900px">
                <el-form :model="editform" :rules="rules" ref="editform" label-width="100px">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="消息编码" prop="msgCode">
                                <!-- 机构名称 -->
                                <el-input v-model="editform.msgCode" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="消息类型" prop="type">
                                <!-- 机构id -->
                                <!--<el-input v-model="editform.type" :disabled="true"></el-input>-->

                                <DictSelect v-model="editform.type" :disabled="isDetail" :selectData="msgTypeList"
                                            placeholder="消息类型"  ></DictSelect>
                                <!--<el-select v-model="editform.type" @change="typeChange" style="width: 100%;"-->
                                           <!--:disabled="isDetail">-->
                                    <!--<el-option v-for="item in msgTypeList" :label="item.label" :key="item.value"-->
                                               <!--:value="item.value">-->
                                    <!--</el-option>-->
                                <!--</el-select>-->

                            </el-form-item>
                        </el-col>
                    </el-row>


                    <el-col :span="24">
                        <el-form-item label="消息标题" prop="title">
                            <!-- 密钥 -->
                            <el-input v-model="editform.title" :disabled="isDetail"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="内容模板" prop="content">
                            <!-- 是否可用 -->
                            <el-input v-model="editform.content" type="textarea" :autosize="{minRows:5}"
                                      :disabled="isDetail"></el-input>

                        </el-form-item>
                    </el-col>
                    <!--<el-col :span="24">
                        <el-form-item label="接收角色" prop="roleIdList">
                            &lt;!&ndash; 上一次access_token &ndash;&gt;
                            <el-select v-model="editform.roleIdList" multiple @change="roleIdsChange"
                                       style="width: 100%;" :disabled="isDetail">
                                <el-option v-for="item in roleList" :label="item.label" :key="item.value"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>-->
                </el-form>
                <span slot="footer" class="dialog-footer">
		    <!--<el-button type="primary" @click="save()">确 定</el-button>
		    <el-button @click="close()">取 消</el-button>-->
		  </span>
            </el-dialog>

            <!--删除提示框-->
            <el-dialog   :close-on-click-modal="false"  title="提示" :visible.sync="deleteVisible" width="30%">
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
    import {dict} from '@/libs'

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
                msgTypeList: [],
                searchForm: {},
                deleteVisible: false,
                //是否为详情，并设置是否disable
                isDetail: false,
                formDialogVisible: false,
                showAlarmType: false,
                editform: {},
                deleteIds: '',
                checkedArr: [],
                globalAlarmIdList: [],
                roleList: [],
                deviceSystemCodeList:[],
                deviceSubSysCodeList:[],
                deviceTypeCodeList:[],
                deviceTypeCodeTest: [],
                alarmDefineList: [],
                // ids
                roleIds: '',
                roleIdList: [],
                // names
                roleNames: '',
                // 校验
                rules: {
                    title: [{
                        required: true,
                        message: '请输入消息标题',
                        trigger: 'blur'
                    }],
                    content: [{
                        required: true,
                        message: '请输入内容模板',
                        trigger: 'blur'
                    }],
                    roleIdList: [{
                        required: true,
                        message: '请选择接收角色',
                        trigger: 'change'
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
                if (type == 'param') {
                    this.pageNum = 1;
                    this.renovatePagination = false;
                }
                this.$httpPost('/message/msgTemplate/find', {

                    pageIndex: this.pageNum,
                    size: this.pageSize,
                    title: this.searchForm.title,
                    type: this.searchForm.type,

                }).then(res => {
                    this.tableData = res.data.data;
                    this.totolNum = Number(res.data.totalCount);
                    this.renovatePagination = true
                })
            },
            // 修改 新增 保存
            save() {
                // alert(this.roleIds);
                this.$refs.editform.validate((valid) => {
                    if (valid) {
                        this.$httpPost('/message/msgTemplate/save', {
                            // 主键
                            id: this.editform.id,
                            // title
                            title: this.editform.title,
                            // content
                            content: this.editform.content,

                            roleIds: this.editform.roleIdList.join(",")
                        }).then(res => {
                            this.search();
                            this.formDialogVisible = false;
                        })
                    } else {
                        return false;
                    }
                });
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
                        } else {
                            this.roleList = [];
                        }
                    } else {
                        Toast("加载服务类型失败");
                    }

                }, function (response) {

                });
            },
            queryGlobalAlarmId() {
                this.$httpPost('/manage/alarmDefine/queryGlobalAlarmId').then(res => {

                    if (res.data.msg === "success") {
                        var dataArr = res.data.body;
                        if (dataArr.length != 0) {
                            for (var i = 0; i < dataArr.length; i++) {
                                    var newObj = new Object();
                                    newObj.label = dataArr[i].alarmName;
                                    newObj.value = dataArr[i].globalAlarmId;
                                    this.globalAlarmIdList.push(newObj);
                                    this.alarmDefineList.push(dataArr[i]);

                            }
                        } else {
                            this.roleList = [];
                        }
                    } else {
                        Toast("加载服务类型失败");
                    }

                }, function (response) {

                });
            },
            globalAlarmIdChange(value){
                for (var i = 0; i < this.alarmDefineList.length; i++) {
                    if(value===this.alarmDefineList[i].globalAlarmId){
                        this.editform.deviceSystemCode=this.alarmDefineList[i].deviceSystemCode
                        this.deviceSystemCodeChange(this.alarmDefineList[i].deviceSystemCode)
                        this.editform.deviceSubSysCode=this.alarmDefineList[i].deviceSubSysCode
                        this.deviceSubSysCodeChange(this.alarmDefineList[i].deviceSubSysCode)
                        this.editform.deviceTypeCode=this.alarmDefineList[i].deviceTypeCode
                    }

                }
            },
            typeChange(value) {
                //  报警
                if (value === "1") {

                    this.showAlarmType = true
                } else if (value === "2") {
                    // 保养
                    this.showAlarmType = false
                } else {
                    this.showAlarmType = false

                }
            },
            deviceSystemCodeChange(realId){
                this.editform.deviceSubSysCode = ''
                this.editform.deviceTypeCode = ''
                this.deviceSubSysCodeList = this.deviceTree.find(item => item.value === realId).children
                this.editform.deviceSystemName = this.deviceTree.find(item => item.value === realId).label
            },
            deviceSubSysCodeChange(realId){
                this.deviceTree.forEach(item => {
                    const obj = item.children.find(subItem => subItem.value === realId)
                    if(obj) {
                        this.deviceTypeCodeList = obj.children
                        this.editform.deviceSubSysName = obj.label
                    }
                })
                this.editform.deviceTypeCode = ''
            },
            deviceTypeCodeChange(realId){
                const obj = this.deviceTypeCodeList.find(item=> item.value === realId);
                this.$forceUpdate()
                this.editform.deviceTypeName=obj.label
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
            //接收角色更改
            roleIdsChange(selVal) {
                let arr = []
                selVal.forEach(item => arr.push(this.roleList.find(roleItem => roleItem.value === item).label))
                this.roleIdList = selVal;
                // this.roleNames=arr.join(',');
                // this.roleIds=selVal.join(',');
                // console.log(this.roleIdList)
            },
            // 关闭弹出框
            close() {
                this.formDialogVisible = false;
                this.$refs.editform.resetFields();
            },
            // 弹出修改弹出框
            toEdit(index, row) {
                this.formDialogVisible = true;
                this.isDetail = true;
                if (row) {
                    this.editform = Object.assign({roleIdList: []}, row);
                    /*this.$httpPost('/message/msgTemplate/queryByMsgTemplateId', {
                        // 主键
                        msgTemplateId: this.editform.id,
                    }).then(res => {
                        if (res.data.code == 0) {
                            if (res.data.body) {
                                this.editform.roleIdList = res.data.body.roleIds.split(",")
                            }
                        }
                    })*/
                }
            },
        },

        // 页面加载时执行
        created: function () {
            this.search();
            this.selectRole();
            this.queryGlobalAlarmId();
            dict.dict('msgType').then(payload => this.msgTypeList = payload)

        },
    }
</script>

<style scoped>

</style>
