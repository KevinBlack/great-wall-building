
<template>
    <div class="wrap">
        <div class="subContent">
            <div class="tableWrap">
                <!--搜索功能-->
                <el-form :inline="true" :model="searchForm" class="demo-form-inline zr-row-scatter">
                    <div class="zr-row">
                        <div><el-button  type="primary" @click="toEdit(false)">创建</el-button></div>
                        <div class="m-l-10 m-r-10"><el-button type="primary" @click="toDelete()">批量删除</el-button></div>
                        <!--<el-button type="primary" @click="search()">刷新</el-button>-->
                        <!-- <el-upload :action="importUrl" :on-change="uploadChange" :on-success="handleSuccess" :on-error="handleUploadError" :show-file-list="false"> -->
                        <el-upload :action="importUrl" :on-success="handleSuccess" :on-error="handleUploadError" :show-file-list="false">
                            <el-button size="small" type="primary">导入</el-button>
                        </el-upload>
                    </div>
                    <div>
                        <el-form-item label="负责人群">
                            <el-select v-model="searchForm.responsiblePersonId" clearable @change="responsiblePersonChange">
                                <el-option v-for="item in roleList" :label="item.label" :key="item.value" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="">
                            <el-input v-model="searchForm.keyword" clearable placeholder="关键字" />
                        </el-form-item>
                        <el-form-item label="">
                            <!-- 报警级别（01一般  02重要 03严重） -->
                            <!--<el-input v-model="searchForm.alarmLevel" clearable placeholder="报警级别（0一般  1重要 2严重）"></el-input>-->

                            <!-- <el-select v-model="searchForm.alarmLevel"  style="width: 100%;" clearable placeholder="报警级别" >
                                <el-option v-for="item in alarmLevelList" :label="item.label" :key="item.value" :value="item.value">
                                </el-option>
                            </el-select> -->
                            <DictSelect v-model="searchForm.alarmLevel" selectData="alarmLevel" placeholder="报警级别" :showContents="['01','02','03']"></DictSelect>
                        </el-form-item>
                        <el-form-item label="">
                            <!-- 报警分类(0设备故障 1事件) -->
                            <!--<el-input v-model="searchForm.alarmType" clearable placeholder="报警分类(0设备故障 1事件)"></el-input>-->
                            <!-- <el-select v-model="searchForm.alarmType"  style="width: 100%;" clearable placeholder="报警分类" >
                                <el-option v-for="item in alarmTypeList" :label="item.label" :key="item.value" :value="item.value">
                                </el-option>
                            </el-select> -->
                            <DictSelect v-model="searchForm.alarmType" selectData="alarmType" placeholder="报警分类"></DictSelect>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="search('param')">搜索</el-button>
                        </el-form-item>
                    </div>
                </el-form>
                <!--数据表格渲染-->
                <el-table ref="table" stripe :data="alarmDefineTable.content" style="width: 100%" @selection-change="onSelect">
                    <el-table-column type="selection" width="60" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" type="index" label="序号" width="50" align="center"></el-table-column>
                    <!-- 子系统报警编码 -->
                    <!--<el-table-column :show-overflow-tooltip="true" prop="sysAlarmNo" label="子系统报警编码"></el-table-column>-->
                    <el-table-column :show-overflow-tooltip="true" prop="sysAlarmNo" label="子系统报警编码" width="200" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" size="smart" @click="toDetails(scope.$index, scope.row)">{{scope.row.sysAlarmNo}}</el-button>
                        </template>
                    </el-table-column>
                    <!-- 设备类型名称 -->
                    <el-table-column :show-overflow-tooltip="true" prop="deviceTypeName" label="设备类别"  align="center"></el-table-column>
                    <!-- 报警名称 -->
                    <el-table-column :show-overflow-tooltip="true" prop="alarmName" label="报警名称" align="center"></el-table-column>
                    <!-- 报警分类(0设备故障 1事件) -->
                    <!-- findNameFromList -->
                    <el-table-column :show-overflow-tooltip="true" prop="alarmType" label="报警分类" :formatter="stateAlarmType" align="center"></el-table-column>
                    <!-- 报警级别（0一般  1重要 2严重） -->
                    <el-table-column :show-overflow-tooltip="true" label="报警级别" :formatter="stateAlarmLevel" width="150" align="center">
                        <template slot-scope="scope">
                            <div :style="scope.row.alarmLevel==1?blue:(scope.row.alarmLevel ==2?yellow:red)">
                                <span style="color:white;"> {{scope.row.alarmLevel == 1?'普通':(scope.row.alarmLevel ==2?'重要':'严重') }}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" label="操作" width="180" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" size="mini" @click="toEdit(false,scope.$index, scope.row)">编辑</el-button>
                            <el-button type="text" size="mini" @click="toEdit(true,scope.$index, scope.row)">发布屏配置</el-button>
                            <!--<el-button type="text" size="mini" @click="toDelete(scope.$index, scope.row)">删除</el-button>-->
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页-->
                <el-pagination v-if="renovatePagination" @size-change="onSizeChange" @current-change="onCurrentChange" :current-page="pageNum" :page-sizes="[10, 15, 20, 25]" :page-size="alarmDefineTable.size" layout="total, sizes, prev, pager, next, jumper" :total="Number(alarmDefineTable.totalElements)">
                </el-pagination>
            </div>

            <!--编辑弹出窗-->
            <el-dialog   :title="isDisplayScreen?'信息发布屏配置':isDetail?'查看详情':(editform.id?'编辑':'新增')" :visible.sync="formDialogVisible" :before-close="close" width="800px">
                <el-form  :model="editform" :rules="rules" ref="editform"  label-width="130px">
                        <el-col :span="24">
                            <el-form-item label="子系统报警编码" prop="sysAlarmNo">
                                <!-- 子系统报警编码 -->
                                <el-input v-model="editform.sysAlarmNo" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="报警分类" prop="alarmType">
                                <!-- 报警分类(01设备故障 02事件) -->
                                <!--<el-input v-model="editform.alarmType"></el-input>-->
                                <DictSelect v-model="editform.alarmType" :disabled="isDetail" :selectData="alarmTypeList" placeholder="请选择"></DictSelect>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="报警级别" prop="alarmLevel">
                                <!-- 报警级别（01一般  02重要 03严重） -->
                                <DictSelect v-model="editform.alarmLevel" :disabled="isDetail" :selectData="alarmLevelList" placeholder="请选择"></DictSelect>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                            <el-form-item label="设备专业" prop="deviceSystemCode">
                                <!-- 设备专业代码 -->
                                <!--<el-input v-model="editform.deviceSystemCode"></el-input>-->
                                <el-select v-model="editform.deviceSystemCode"  @change="deviceSystemCodeChange" style="width: 100%;" :disabled="isDetail">
                                    <el-option v-for="item in deviceTree" :label="item.label" :key="item.value" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                            <el-form-item label="设备子系统" prop="deviceSubSysCode">
                                <!-- 设备子系统代码 -->
                                <!--<el-input v-model="editform.deviceSubSysCode"></el-input>-->
                                <el-select v-model="editform.deviceSubSysCode" @change="deviceSubSysCodeChange" style="width: 100%;" :disabled="isDetail">
                                    <el-option v-for="item in deviceSubSysCodeList" :label="item.label" :key="item.value" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="设备类别" prop="deviceTypeCode">
                                <!-- 设备类别代码 -->
                                <!--<el-input v-model="editform.deviceTypeCode"></el-input>-->
                                <el-select v-model="editform.deviceTypeCode"  @change="deviceTypeCodeChange" style="width: 100%;" :disabled="isDetail">
                                    <el-option v-for="item in deviceTypeCodeList" :label="item.label" :key="item.value" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                            <el-form-item label="报警名称" prop="alarmName">
                                <!-- 报警名称 -->
                                <el-input v-model="editform.alarmName" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="负责人群" prop="responsiblePersonId">
                                <!-- 负责人群ID -->
                                <!--<el-input v-model="editform.responsiblePersonId"></el-input>-->
                                <el-select v-model="editform.responsiblePersonId" multiple @change="responsiblePersonChange"  style="width: 100%;" :disabled="isDetail">
                                    <el-option v-for="item in roleList" :label="item.label" :key="item.value" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24" v-if="isDisplayScreen">
                            <el-form-item label="信息发布屏"  prop="publishScreenLocation">
                                <!--<el-input v-model="editform.asd"></el-input>-->
                                <!--<el-col :span="24">-->
                                    <!--<el-form-item label="发布屏位置" prop="publishScreenLocation">-->
                                        <el-checkbox-group   v-model="editform.publishScreenLocation"  @change="publishScreenLocationChange">
                                            <el-checkbox v-for="(item,index) in locationList" :label="item.id" :key="index" :checked="editform.playerId?editform.playerId.split().contains(item.id):false">{{item.nickName}}</el-checkbox>
                                        </el-checkbox-group>
                                    <!--</el-form-item>-->
                                <!--</el-col>-->


                            </el-form-item>
                        </el-col>
                </el-form>
                <span slot="footer" class="dialog-footer" v-if="!isDetail || isDisplayScreen">
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
    import { formatDate } from '../../../static/js/date.js'
    import { api, dict } from '@/libs'
    import store from '@/store/index'
    import { mapState } from 'vuex'
    export default {
        // 变量初始化定义
        data: function() {
            var checkSysAlarmNo = (rule, value, callback) => {
            	if(!value) {
            		return callback(new Error("请输入子系统报警编码"));
            	} else {
                    if(this.editform.id){
                        this.rowId = this.editform.id
                    }else{
                        this.rowId = ''
                    }
                    
            		this.$httpPost('/manage/alarmDefine/getSysAlarmNo', {
            		        id:this.rowId,
            		        sysAlarmNo: this.editform.sysAlarmNo
            		    }).then(res => {
                            if(res.data.msg == "success") {
                            	callback();
                            }else{
                                return false
                            }
            		})

            	}
            };
            return {
                blue:{
                    background:'blue',
                    width:'45%',
                    margin:'auto'

                },
                yellow:{
                    background:'orange',
                    width:'45%',
                    margin:'auto'
                },
                red:{
                    background:'red',
                    width:'45%',
                    margin:'auto'
                },
                rowId:'',
                pageNum: 1,
                pageSize: 15,
                //刷新分页
                renovatePagination: true,
                searchForm: {},
                formDialogVisible: false,
                deleteVisible: false,
                //是否为详情，并设置是否disable
                isDetail: false,
                isDisplayScreen: false,
                // editform: {},
                deleteIds: '',
                checkedArr: [],
                // 报警级别
                alarmLevelList:[],
                // 报警类别
                alarmTypeList:[],
                // 角色列表
                roleList:[],
                deviceSystemCodeList:[],
                deviceSubSysCodeList:[],
                deviceTypeCodeList:[],
                deviceTypeCodeTest: [],
                // ids
                responsiblePersonVal:'',
                // names
                responsiblePersons:'',
                importUrl: api.baseUrl + "/manage/alarmDefine/importExcel?token=" + window.localStorage.csmpToken,
                locationList:[],
                publishScreen:'',
                editform: {
                    publishScreenLocation:[]
                },
                // 校验
                rules: {
                    // 子系统报警编码
                    sysAlarmNo: [{
                            required: true,
                            validator: checkSysAlarmNo,
                            trigger: 'blur',

                        }],
                    // 报警名称
                    alarmName: [{
                            required: true,
                            message: '请输入报警名称',
                            trigger: 'blur'
                        }],
                    // 报警级别（01一般  02重要 03严重）
                    alarmLevel: [{
                            required: true,
                            message: '请选择报警级别',
                            trigger: 'change'
                        }],
                    // 报警分类(01设备故障 02事件)
                    alarmType: [{
                            required: true,
                            message: '请选择报警分类',
                            trigger: 'change'
                        }],
                    // 设备类别代码
                    deviceTypeCode: [{
                            required: true,
                            message: '请选择设备类别',
                            trigger: 'change'
                        }],
                    // 设备类型名称
                    deviceTypeName: [{
                            required: true,
                            message: '请选择设备类型名称',
                            trigger: 'change'
                        }],
                    // 设备专业代码
                    deviceSystemCode: [{
                            required: true,
                            message: '请选择设备专业',
                            trigger: 'change'
                        }],
                    // 设备专业名称
                    deviceSystemName: [{
                            required: true,
                            message: '请输入设备专业名称',
                            trigger: 'blur'
                        }],
                    // 设备子系统代码
                    deviceSubSysCode: [{
                            required: true,
                            message: '请选择设备子系统',
                            trigger: 'change'
                        }],
                    // 设备子系统名称
                    deviceSubSysName: [{
                            required: true,
                            message: '请选择设备子系统名称',
                            trigger: 'blur'
                        }],
                    // 负责单位ID
                    responsibleUnitId: [{
                            required: true,
                            message: '请选择负责单位ID',
                            trigger: 'blur'
                        }],
                    // 负责单位
                    responsibleUnit: [{
                            required: true,
                            message: '请选择负责单位',
                            trigger: 'blur'
                        }],
                    // 负责人群ID
                    responsiblePersonId: [{
                            required: true,
                            message: '请选择负责人群',
                            trigger: 'change'
                        }],
                    // 负责人群
                    responsiblePerson: [{
                            required: true,
                            message: '请选择负责人群',
                            trigger: 'blur'
                        }],
                    // 全局报警ID
                    globalAlarmId: [{
                            required: true,
                            message: '请输入全局报警ID',
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
        computed: {
          ...mapState({
              alarmDefineTable: state => state.alarmDefineTable,
              deviceTree: state => state.deviceTree
          })
        },
        // 自定义方法
        methods: {
            // 导入
            handleSuccess() {
                this.search()
                this.$forceUpdate()
                this.$message.success('数据导入成功!')
            },
            handleUploadError() {
                this.$message.error(err)
            },
            // uploadChange(file, fileList) {
            //     this.search()
            //     this.$forceUpdate()
            // },
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
            //负责人群更改
            responsiblePersonChange(selVal){
                let arr = []
                selVal.forEach(item => arr.push(this.roleList.find(roleItem => roleItem.value === item).label))
                this.responsiblePersons=arr.join(',');
                this.responsiblePersonVal=selVal.join(',');
            },
            // 修改 新增 保存
            save() {
                const responsiblePersonId = this.editform.responsiblePersonId
                this.$refs.editform.validate((valid) => {
                    if(valid) {
                        this.$delete(this.editform,'publishScreenLocation')
                        store.dispatch('saveAlarmDefine', Object.assign(this.editform,{responsiblePersonId: this.responsiblePersonVal,responsiblePerson:this.responsiblePersons, playerId:this.publishScreen,}))
                        .then(res => {
                            if(res) {
                                this.formDialogVisible = true
                                this.editform.responsiblePersonId = responsiblePersonId
                                this.$forceUpdate()
                            } else {
                                this.search()
                                this.formDialogVisible = false
                            }
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
                if(index == undefined) {
                    //没勾选
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
                this.$httpPost('/manage/alarmDefine/delete', {
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
            // 弹出修改弹出框
            toEdit(type, index, row) {
                this.editform = {
                    responsiblePersonId: []
                };
                if(row){
                    this.rowId = row.id
                    this.deviceSystemCodeChange(row.deviceSystemCode);
                    this.deviceSubSysCodeChange(row.deviceSubSysCode);
                    this.responsiblePersons=row.responsiblePerson;
                    this.editform = Object.assign({},row);
                    this.editform = Object.assign({publishScreenLocation:[]},row);
                    let arr = []
                    if( row.playerId){
                        row.playerId.split(",").forEach(item=>{
                            arr.push(parseInt(item));
                        })
                        this.$set(this.editform,'publishScreenLocation',arr);
                    }


                    if(this.editform.responsiblePersonId){
                        //  调用接口 获取 角色
                        this.$httpPost('/message/msgInform/selectActiveRole', {
                            // ID
                            ids: this.editform.responsiblePersonId,

                        }).then(res => {
                            this.editform.responsiblePersonId=res.data.body.split(",");
                            this.responsiblePersonVal=this.editform.responsiblePersonId.join(',');
                        })
                        // this.editform.responsiblePersonId=row.responsiblePersonId.split(',');
                        // this.responsiblePersonVal=this.editform.responsiblePersonId.join(',');
                    }else {
                        this.editform.responsiblePersonId=[];
                    }
                }
                this.formDialogVisible = true

                this.isDetail = type
                this.isDisplayScreen = type
            },
            // 弹出查看详情弹出框
            toDetails(index, row) {
                this.deviceSystemCodeChange(row.deviceSystemCode)
                this.deviceSubSysCodeChange(row.deviceSubSysCode)
                this.editform = {
                    responsiblePersonId: []
                };
                if(row){
                    this.editform = Object.assign({},row);
                    if(this.editform.responsiblePersonId){
                        //  调用接口 获取 角色
                        this.$httpPost('/message/msgInform/selectActiveRole', {
                            // ID
                            ids: this.editform.responsiblePersonId,

                        }).then(res => {
                            this.editform.responsiblePersonId=res.data.body.split(",");
                            this.responsiblePersonVal=this.editform.responsiblePersonId.join(',');
                        })


                        // this.editform.responsiblePersonId=row.responsiblePersonId.split(',');
                    }else {
                        this.editform.responsiblePersonId=[];
                    }
                }
                this.formDialogVisible = true;
                this.isDetail = true
                this.isDisplayScreen = false
            },
            queryDeviceTypeByRealId(realId){
                this.deviceSystemCodeList = this.deviceTree
            },
            deviceSystemCodeChange(realId){
                this.editform.deviceSubSysCode = ''
                this.editform.deviceTypeCode = ''
                if(this.deviceTree.find(item => item.value === realId)) this.deviceSubSysCodeList = this.deviceTree.find(item => item.value === realId).children
                if(this.deviceTree.find(item => item.value === realId)) this.editform.deviceSystemName = this.deviceTree.find(item => item.value === realId).label
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

            // 报警分类(01设备故障 02事件)
            stateAlarmType: function(row, column, cellValue) {
                if(this.alarmTypeList.find(item => item.value === row.alarmType)) return this.alarmTypeList.find(item => item.value === row.alarmType).label
                // switch (row.alarmType){
                //     case "01":
                //         return "设备故障";
                //     case "02":
                //         return "事件";
                //     default:
                //         return "";
                // }
            },
            // 表格显示 报警级别（01普通  01重要 03严重）
            stateAlarmLevel: function(row, column, cellValue) {
                if(this.alarmLevelList.find(item => item.value === row.alarmLevel)) return this.alarmLevelList.find(item => item.value === row.alarmLevel).label
                // switch (row.alarmLevel){
                //     case "01":
                //         return "普通";
                //     case "02":
                //         return "重要";
                //     case "03":
                //         return "严重";
                //     default:
                //         return "";
                // }
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
            // 初始化表格 搜索功能
            search(type) {
                if(type=='param'){
                    this.pageNum = 1;
                    this.renovatePagination = false;
                }
                store.dispatch('getAlarmDefineList', {
                    // 报警级别（01一般  02重要 03严重）
                    alarmLevel: this.searchForm.alarmLevel,
                    // 报警分类(01设备故障 02事件)
                    alarmType: this.searchForm.alarmType,
                    responsiblePerson: this.searchForm.searchResponsible,
                    page: this.pageNum,
                    size: this.pageSize,
                    deviceSystemName :this.searchForm.deviceSystemName,
                    keyword :this.searchForm.keyword,
                    responsiblePersonId: this.searchForm.responsiblePersonId
                }).then(() => this.renovatePagination = true)
            },
            showTree(){
                this.$httpPost('/message/msgInform/showTree',{}).then(res => {
                    let nodelist =JSON.parse(res.data.body).nodeList;
                    this.locationList = nodelist;
                })
            },
//             //发布屏位置选择
            publishScreenLocationChange(val){
                this.publishScreen = val.join(",");
            },
        },
        // 页面加载时执行
        created: function() {
            store.dispatch('getDeviceTree')
            dict.dict('alarmLevel').then(payload => this.alarmLevelList = payload)
            dict.dict('alarmType').then(payload => this.alarmTypeList = payload)
            store.dispatch('getRoleList').then(res => this.roleList = res.filter(resItem => resItem.active === 1).map(item => item = {label:item.name,value:item.id}))
            this.search();
            this.showTree();
        },
    }
</script>
<style lang="less">
    .el-dialog__headerbtn .el-dialog__close {
        color: #fff !important;
    }
</style>
