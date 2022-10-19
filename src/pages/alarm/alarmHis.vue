
<template>
    <div class="wrap" id="alarmHis">
        <div class="subContent">
            <div class="tableWrap">
                <!--搜索功能-->
                <el-form :inline="true" :model="searchForm" class="zr-row-scatter">
                    <div>
                        <el-button type="primary" @click="toDelete()">批量删除</el-button>
                    </div>
                    <div>
                        <el-form-item label="">
                            <el-input v-model="searchForm.keyword" clearable placeholder="关键字" />
                        </el-form-item>
                        <el-form-item label="">
                            <!-- 设备类别 -->
                            <el-select v-model="searchForm.deviceSystemName" clearable style="width: 100%;" placeholder="所属专业" >
                                <el-option v-for="item in deviceSystemNameList" :label="item.name" :key="item.name" :value="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="">
                            <el-date-picker v-model="searchForm.alarmTime" type="datetimerange" range-separator="至" start-placeholder="报警开始时间" end-placeholder="报警结束时间" format="yyyy-MM-dd HH:mm" align="right">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="search('param')">搜索</el-button>
                        </el-form-item>
                    </div>
                </el-form>
                <!--数据表格渲染-->
                <el-table ref="table" stripe :data="tableData" style="width: 100%" @selection-change="onSelect">
                    <el-table-column type="selection" :selectable='selectable()' width="60" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" type="index" label="序号" width="50" align="center"></el-table-column>
                    <!-- 告警定义Id -->
                    <!--<el-table-column :show-overflow-tooltip="true" prop="alarmDefineId" label="告警定义Id"></el-table-column>-->
                    <!-- 设备编号 -->
                    <!--<el-table-column :show-overflow-tooltip="true" prop="deviceNo" label="设备编号"></el-table-column>-->

                    <el-table-column :show-overflow-tooltip="true" prop="deviceSystemName" label="所属专业" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="sysAlarmNo" label="报警编号" align="center">
                        <template slot-scope="scope">
                        <el-button type="text" size="smart" @click="toDetails(scope.$index, scope.row)">{{scope.row.sysAlarmNo}}</el-button>
                    </template>
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="alarmDevice" label="报警设备" align="center"></el-table-column>

                    <!-- alarmDevice -->
                    <el-table-column :show-overflow-tooltip="true" prop="postion" label="设备位置" align="center"></el-table-column>
                    <!-- 设备类别代码 -->
                    <!--<el-table-column :show-overflow-tooltip="true" prop="deviceTypeCode" label="设备类别代码"></el-table-column>-->
                    <!-- 设备类型名称 -->
                    <!--<el-table-column :show-overflow-tooltip="true" prop="deviceTypeName" label="设备类型名称"></el-table-column>-->
                    <!-- 设备专业代码 -->
                    <!--<el-table-column :show-overflow-tooltip="true" prop="deviceSystemCode" label="设备专业代码"></el-table-column>-->
                    <!-- 设备专业名称 -->
                    <!--<el-table-column :show-overflow-tooltip="true" prop="deviceSystemName" label="设备专业名称"></el-table-column>-->
                    <!-- 设备子系统代码 -->
                    <!--<el-table-column :show-overflow-tooltip="true" prop="deviceSubSysCode" label="设备子系统代码"></el-table-column>-->
                    <!-- 设备子系统名称 -->
                    <!--<el-table-column :show-overflow-tooltip="true" prop="deviceSubSysName" label="设备子系统名称"></el-table-column>-->
                    <!-- 设备类别(用于前台页面展示) -->
                    <!--<el-table-column :show-overflow-tooltip="true" prop="deviceTypeShow" label="设备类别(用于前台页面展示)"></el-table-column>-->
                    <!-- 报警名称 -->
                    <el-table-column :show-overflow-tooltip="true" prop="alarmName" label="报警描述" align="center"></el-table-column>
                    <!-- 报警分类(0设备故障 1事件) -->
                    <el-table-column :show-overflow-tooltip="true" prop="alarmType" label="报警分类" :formatter="stateAlarmType" align="center"></el-table-column>
                    <!-- 报警级别 -->
                    <el-table-column :show-overflow-tooltip="true" label="报警级别" :formatter="stateAlarmLevel" align="center">
                        <template slot-scope="scope">
                            <div :style="scope.row.alarmLevel==1?blue:(scope.row.alarmLevel ==2?yellow:red)">
                                <span style="color:white;"> {{scope.row.alarmLevel == 1?'普通':(scope.row.alarmLevel ==2?'重要':'严重') }}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <!-- 报警开始时间 -->
                    <!--<el-table-column :show-overflow-tooltip="true" prop="alarmStartTime" label="报警开始时间"></el-table-column>-->
                    <!-- 报警时间(最新报警时间) -->
                    <el-table-column :show-overflow-tooltip="true" prop="alarmTime" :formatter="alarmTime" label="最近报警时间" width="160" align="center"></el-table-column>
                    <!-- 持续时长 -->
                    <el-table-column :show-overflow-tooltip="true" prop="alrarmDurationTime" label="持续时长(小时)" align="center"></el-table-column>
                    <!-- 报警次数 -->
                    <!--<el-table-column :show-overflow-tooltip="true" prop="alarmCount" label="报警次数"></el-table-column>-->
                    <!-- 报警状态(0 已处理 1未确认  2未处理 3已关闭) -->
                    <!-- <el-table-column :show-overflow-tooltip="true" prop="alarmStatus" label="报警状态" :formatter="stateAlarmStatus"></el-table-column> -->
                    <!-- 备注 -->
                    <!--<el-table-column :show-overflow-tooltip="true" prop="remark" label="备注"></el-table-column>-->
                </el-table>
                <!--分页-->
                <el-pagination v-if="renovatePagination" @size-change="onSizeChange" @current-change="onCurrentChange" :current-page=pageNum :page-sizes="[10, 15, 20, 25]" :page-size=pageSize layout="total, sizes, prev, pager, next, jumper" :total="totolNum">
                </el-pagination>
            </div>

            <!--查看详情提示框-->
            <el-dialog :close-on-click-modal="false" title="查看详情" :visible.sync="detailsTableVisible" width="900px">
                <div class="zr-row">
                    <div class="zi-g-3">
                        <el-form :model="editform" :rules="rules" ref="editform"  label-width="120px">
                            <el-col :span="24" style="margin-bottom: 20px;">
                                <h3>| 设备信息</h3>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="设备编号" >
                                    <el-input v-model="editform.deviceCode" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="设备专业" >
                                    <el-input v-model="editform.deviceSystemName" disabled />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="设备子系统" >
                                    <el-input v-model="editform.deviceSubSysName" disabled />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="设备类别">
                                    <el-input v-model="editform.deviceTypeName" disabled />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="报警设备" >
                                    <el-input v-model="editform.alarmDevice" disabled />
                                </el-form-item>
                            </el-col>
                            <el-col :span="24" style="margin-bottom: 20px;">
                                <h3>| 报警信息</h3>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="报警编号" prop="baoNum">
                                    <el-input v-model="editform.baoNum" disabled />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="报警分类" >
                                    <el-select v-model="editform.alarmType"  style="width: 100%;" :disabled="true">
                                        <el-option v-for="item in alarmTypeList" :label="item.label" :key="item.value" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="报警级别" >
                                    <el-select v-model="editform.alarmLevel"  style="width: 100%;" :disabled="true">
                                        <el-option v-for="item in alarmLevelList" :label="item.label" :key="item.value" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="报警描述" prop="deviceTypeName">
                                    <!-- 设备类型名称 -->
                                    <el-input v-model="editform.alarmName" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="报警时间"  style="overflow: hidden;">
                                    <div>
                                        <div>
                                            <el-steps direction="vertical" class="m-b-10">
                                                <el-step v-for="(item, index) in alarmLogTableData" :key="index" :title="item.alarmTime | dateFormat"></el-step>
                                            </el-steps>
                                        </div>
                                    </div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="持续时长(小时)" prop="deviceTypeCode">
                                    <el-input v-model="editform.alrarmDurationTime" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="报警次数(次)" prop="deviceTypeName">
                                    <el-input v-model="editform.alarmCount" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="当前值" prop="alarmValue">
                                    <el-input v-model="editform.alarmValue" disabled />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="阈值" prop="thresholdValue">
                                    <el-input v-model="editform.thresholdValue" disabled />
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="设备位置" prop="postion">
                                    <el-input v-model="editform.postion" disabled />
                                </el-form-item>
                            </el-col>
                            <el-col :span="24" style="margin-bottom: 20px;">
                                <h3>| 派工详情</h3>
                            </el-col>
                            <el-col :span="24" style="margin-bottom: 20px;">
                                 <el-table :data="detailsData" stripe style="width: 100%;color: black;margin-bottom: 20px;" :row-class-name="tableRowClassName">
                                    <el-table-column :show-overflow-tooltip="true" prop="workTime" :formatter="predictTimeFormatter" label="派工时间" align="center"></el-table-column>
                                    <el-table-column :show-overflow-tooltip="true" prop="workPeople" label="处理人" align="center"></el-table-column>
                                    <el-table-column :show-overflow-tooltip="true" prop="withTime" :formatter="predictTimeFormatter" label="回单时间" align="center"></el-table-column>
                                    <el-table-column :show-overflow-tooltip="true" prop="operationContent" label="派工说明" align="center"></el-table-column>
                                 </el-table>
                            </el-col>
                            <el-col :span="24" style="margin-bottom: 20px;">
                                <h3>| 处理记录</h3>
                            </el-col>
                            <el-col :span="24" style="margin-bottom: 20px;">
                                 <el-table :data="recordData" stripe style="width: 100%;color: black" :row-class-name="tableRowClassName">
                                    <el-table-column :show-overflow-tooltip="true" prop="workTime" :formatter="predictTimeFormatter" label="处理时间" align="center"></el-table-column>
                                    <el-table-column :show-overflow-tooltip="true" prop="workSatus" label="操作" align="center"></el-table-column>
                                    <el-table-column :show-overflow-tooltip="true" prop="workPeople" label="操作人" align="center"></el-table-column>
                                    <el-table-column :show-overflow-tooltip="true" prop="operationContent" label="内容" align="center"></el-table-column>
                                 </el-table>
                            </el-col>

                            <!--<div v-if="editform.alarmStatus === '0'">
                                <el-col :span="12">
                                    <el-form-item label="持续时长(小时)" prop="deviceTypeCode">
                                        
                                        <el-input v-model="editform.alrarmDurationTime" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="报警次数(次)" prop="deviceTypeName">
                                        
                                        <el-input v-model="editform.alarmCount" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="操作人" v-if="editform.alarmStatus !== '3'">
                                        <el-input v-model="editform.handleUserName" disabled></el-input>
                                    </el-form-item>
                                </el-col>

                                <el-col :span="24">
                                    <el-form-item label="操作内容" >
                                        <el-input type="textarea" disabled :autosize="{minRows:5}" v-model="editform.remark" maxlength="100"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="维修类别" prop="deviceSubSysName">
                                        <el-select v-model="editform.repairType"  style="width: 100%;" disabled>
                                            <el-option v-for="item in repairTypeList" :label="item.label" :key="item.value" :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="维修负责人" >
                                        &lt;!&ndash; 报警名称 &ndash;&gt;
                                        <el-input v-model="editform.repairUserName" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="故障类别" prop="faultClass">
                                        &lt;!&ndash; 设备类别(用于前台页面展示) &ndash;&gt;
                                        <el-select v-model="editform.faultClass"  style="width: 100%;" disabled>
                                            <el-option v-for="item in faultClassList" :label="item.label" :key="item.value" :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="维修开始日期" prop="startTime">
                                        <el-date-picker v-model="editform.startTime" type="datetime" value-format="timestamp"
                                                        format="yyyy-MM-dd HH:mm" placeholder="维修开始日期" disabled>
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="维修结束日期" prop="endTime">
                                        <el-date-picker v-model="editform.endTime" type="datetime" value-format="timestamp"
                                                        format="yyyy-MM-dd HH:mm" placeholder="维修结束日期" disabled>
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                    <el-form-item label="维修内容">
                                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="editform.content" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </div>-->
                        </el-form>
                    </div>

                    
                </div>
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
    import { formatDate } from '../../../static/js/date.js'
    import { api, dict, axiosHttp, util } from '@/libs'
    import Vue from 'vue'
    export default {
        // 变量初始化定义
        data() {
            return {
                searchResponsible: [
                    {
                        value: '0',
                        label: '管理员'
                    },
                    {
                        value: '1',
                        label: '设备处'
                    }
                ],
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
                tableData: [],
                detailsData: [],
                recordData: [],
                alarmLogTableData: [],
                deviceSystemNameList: [],
                pageNum: 1,
                pageSize: 15,
                totolNum: 100,
                //刷新分页
                renovatePagination: true,
                searchForm: {},
                editTableVisible: false,
                deleteVisible: false,
                detailsTableVisible: false,
                showRemark: false,
                editform: {},
                deleteIds: '',
                checkedArr: [],
                // 报警级别
                alarmLevelList:[],
                // 报警类别
                alarmTypeList:[],
                // 维修类别 1自维 2外维
                repairTypeList:[{
                    label:'自维',
                    value:'1'
                },{
                    label:'外维',
                    value:'2'
                }],
                faultClassList: [],
                repairType:'',
                // 校验
                rules: {
                // 告警ID
                alarmId: [{
                        required: true,
                        message: '请输入告警ID',
                        trigger: 'blur'
                    }],
                // 告警定义Id
                alarmDefineId: [{
                        required: true,
                        message: '请输入告警定义Id',
                        trigger: 'blur'
                    }],
                // 设备编号
                deviceNo: [{
                        required: true,
                        message: '请输入设备编号',
                        trigger: 'blur'
                    }],
                // 设备类别代码
                deviceTypeCode: [{
                        required: true,
                        message: '请输入设备类别代码',
                        trigger: 'blur'
                    }],
                // 设备类型名称
                deviceTypeName: [{
                        required: true,
                        message: '请输入设备类型名称',
                        trigger: 'blur'
                    }],
                // 设备专业代码
                deviceSystemCode: [{
                        required: true,
                        message: '请输入设备专业代码',
                        trigger: 'blur'
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
                        message: '请输入设备子系统代码',
                        trigger: 'blur'
                    }],
                // 设备类别(用于前台页面展示)
                deviceTypeShow: [{
                        required: true,
                        message: '请输入设备类别(用于前台页面展示)',
                        trigger: 'blur'
                    }],
                // 设备子系统名称
                deviceSubSysName: [{
                        required: true,
                        message: '请输入设备子系统名称',
                        trigger: 'blur'
                    }],
                // 报警名称
                alarmName: [{
                        required: true,
                        message: '请输入报警名称',
                        trigger: 'blur'
                    }],
                // 报警分类(0设备故障 1事件)
                alarmType: [{
                        required: true,
                        message: '请输入报警分类(0设备故障 1事件)',
                        trigger: 'blur'
                    }],
                // 报警级别
                alarmLevel: [{
                        required: true,
                        message: '请输入报警级别',
                        trigger: 'blur'
                    }],
                // 报警开始时间
                alarmStartTime: [{
                        required: true,
                        message: '请输入报警开始时间',
                        trigger: 'blur'
                    }],
                // 报警时间(最新报警时间)
                alarmTime: [{
                        required: true,
                        message: '请输入报警时间(最新报警时间)',
                        trigger: 'blur'
                    }],
                // 报警时常
                alrarmDurationTime: [{
                        required: true,
                        message: '请输入报警时常',
                        trigger: 'blur'
                    }],
                // 报警次数
                alarmCount: [{
                        required: true,
                        message: '请输入报警次数',
                        trigger: 'blur'
                    }],
                // 报警状态(0 已处理 1未确认  2未处理 3已关闭)
                alarmStatus: [{
                        required: true,
                        message: '请输入报警状态(0 已处理 1未确认  2未处理 3已关闭)',
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
            showDeviceSystemName(){
                const _this = this;
                this.$httpPost('/manage/device/queryTreeListByRealId',{pId:'ZD'}).then(res=>{
                    _this.deviceSystemNameList=res.data.body;
                })
            },
            // 初始化表格 搜索功能
            search(type) {
                if(type=='param'){
                    this.pageNum = 1;
                    this.renovatePagination = false;
                }
                let startTime = "";
                let endTime = "";
                if(this.searchForm.alarmTime != undefined) {
                    startTime = formatDate(this.searchForm.alarmTime[0], "yyyy-MM-dd hh:mm");
                    endTime = formatDate(this.searchForm.alarmTime[1], "yyyy-MM-dd hh:mm");
                }
                this.$httpPost('/manage/alarmHis/find', {
                    startTime:startTime,
                    endTime:endTime,
                    page: this.pageNum,
                    size: this.pageSize,
                    deviceSystemName: this.searchForm.deviceSystemName,
                    searchResponsible: this.searchForm.searchResponsible,
                    keyword :this.searchForm.keyword
                }).then(res => {
                    this.tableData = res.data.body.content;
                    this.totolNum = Number(res.data.body.totalElements);
                    this.renovatePagination = true
            })
            },
            tableRowClassName({row, rowIndex}) {
                // if(row.alarmLevel === '01') return 'bg-blue'
                // else if(row.alarmLevel === '02') return 'bg-yellow'
                // else if(row.alarmLevel === '03') return 'bg-red'
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
                        this.$httpPost('/manage/alarmHis/save', {
                        // ID
                        id: this.editform.id,
                        // 告警ID
                        alarmId: this.editform.alarmId,
                        // 告警定义Id
                        alarmDefineId: this.editform.alarmDefineId,
                        // 设备编号
                        deviceNo: this.editform.deviceNo,
                        // 设备类别代码
                        deviceTypeCode: this.editform.deviceTypeCode,
                        // 设备类型名称
                        deviceTypeName: this.editform.deviceTypeName,
                        // 设备专业代码
                        deviceSystemCode: this.editform.deviceSystemCode,
                        // 设备专业名称
                        deviceSystemName: this.editform.deviceSystemName,
                        // 设备子系统代码
                        deviceSubSysCode: this.editform.deviceSubSysCode,
                        // 设备类别(用于前台页面展示)
                        deviceTypeShow: this.editform.deviceTypeShow,
                        // 设备子系统名称
                        deviceSubSysName: this.editform.deviceSubSysName,
                        // 报警名称
                        alarmName: this.editform.alarmName,
                        // 报警分类(0设备故障 1事件)
                        alarmType: this.editform.alarmType,
                        // 报警级别
                        alarmLevel: this.editform.alarmLevel,
                        // 报警开始时间
                        alarmStartTime: this.editform.alarmStartTime,
                        // 报警时间(最新报警时间)
                        alarmTime: this.editform.alarmTime,
                        // 报警时常
                        alrarmDurationTime: this.editform.alrarmDurationTime,
                        // 报警次数
                        alarmCount: this.editform.alarmCount,
                        // 报警状态(0 已处理 1未确认  2未处理 3已关闭)
                        alarmStatus: this.editform.alarmStatus,
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
                this.$httpPost('/manage/alarmHis/delete', {
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
            //时间格式化
            alarmTime(row, column, cellValue) {

                if(row.alarmTime!=null){
                    let date = new Date(parseInt(row.alarmTime));
                    return formatDate(date, "yyyy-MM-dd hh:mm:ss");
                }
                return "";

            },
            predictTimeFormatter(row, column, cellValue) {
                if (row.workTime != null) {
                    return Vue.filter('dateFormat')(row.workTime, 'yyyy-MM-dd hh:mm')
                }
                if (row.withTime != null) {
                    return Vue.filter('dateFormat')(row.withTime, 'yyyy-MM-dd hh:mm')
                }
                if (row.tsTime != null) {
                    return Vue.filter('dateFormat')(row.tsTime, 'yyyy-MM-dd')
                }
                if (row.appraiseTime != null) {
                    return Vue.filter('dateFormat')(row.appraiseTime, 'yyyy-MM-dd')
                }
                if (row.sfTime != null) {
                    return Vue.filter('dateFormat')(row.sfTime, 'yyyy-MM-dd')
                }
            },
            // 表格显示 报警状态（01普通  01重要 03严重）
            stateAlarmStatus: function(row, column, cellValue) {
                switch (row.alarmStatus){
                    case "0":
                        return "已处理";
                    case "1":
                        return "未确认";
                    case "2":
                        return "未处理";
                    case "3":
                        return "已关闭";
                    default:
                        return "";
                }
            },
            // 报警分类(01设备故障 02事件)
            stateAlarmType: function(row, column, cellValue) {
                switch (row.alarmType){
                    case "01":
                        return "设备故障";
                    case "02":
                        return "事件";
                    default:
                        return "";
                }
            },
            // 表格显示 报警级别（01普通  01重要 03严重）
            stateAlarmLevel: function(row, column, cellValue) {
                switch (row.alarmLevel){
                    case "01":
                        return "普通";
                    case "02":
                        return "重要";
                    case "03":
                        return "严重";
                    default:
                        return "";
                }
            },
            // 弹出查看详情弹出框
            toDetails(index, row) {
                const _this = this;
                if(row){
                    if(row.alarmStatus=="3"){
                        this.showRemark=true;
                    }
                    axiosHttp.post('/message/workManagement/get', {
                        alarmId: row.alarmId,
                        id: ''
                    }).then(res => {
                        this.detailsData = res.PGList;
                        this.recordData = res.deList;
                        this.editform = Object.assign({},row,res.alarm);
                    })
                    this.getAlarmLog(row.alarmId)
                }
                this.detailsTableVisible = true;
            },
            getAlarmLog(alarmId){
                this.$httpPost('/manage/alarmLog/find', {
                    alarmId:alarmId

                }).then(res => {
                    this.alarmLogTableData = []
                    let arr = res.data.body.content
                    if(arr.length > 0) {
                        this.alarmLogTableData.push(arr[0])
                        if(arr.length > 1) {
                            this.alarmLogTableData.push(arr[arr.length - 1])
                        }
                    }
                    /*this.alarmLogTableData.sort((a, b) => {
                        if (a.alarmTime < b.alarmTime ) {
                            return 1;
                        }
                        if (a.alarmTime > b.alarmTime ) {
                            return -1;
                        }
                        return 0;
                    })*/
                })
            },
            selectable(row, index) {
                // return false
            }
        },
        // 页面加载时执行
        created: function() {
            dict.dict('alarmLevel').then(payload => this.alarmLevelList = payload)
            dict.dict('alarmType').then(payload => this.alarmTypeList = payload)
            dict.dict('faultClass').then(payload => this.faultClassList = payload)
            this.showDeviceSystemName();
            this.search()
        },
    }
</script>

<style lang="less">
    #alarmHis {
        .el-step__icon.is-text {
            background-color: red;
        }
        .el-step__head.is-wait {
            color: red;
            border-color: red;
        }
        .el-step__title.is-wait {
            color: black;
        }
        .el-dialog__headerbtn .el-dialog__close {
            color: #fff !important;
        }
    }
</style>
