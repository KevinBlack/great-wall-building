
<template>
    <div class="wrap">
        <div class="subContent">
            <div class="tableWrap">
                <!--搜索功能-->
                <el-form :inline="true" :model="searchForm" class="demo-form-inline zr-row-scatter">
                    <div class="zr-row">
                        <el-button type="primary" @click="toEdit()">新增维修</el-button>
                        <el-button type="primary" @click="toDelete()">批量删除</el-button>
                        <!--<el-button type="primary" @click="search()">刷新</el-button>-->
                        <el-button type="primary" @click="search()">导出</el-button>
                    </div>
                    <div class="zr-row">
                        <el-form-item label="">
                            <el-date-picker v-model="searchForm.repairTime" type="datetimerange" range-separator="至" start-placeholder="维修开始日期" end-placeholder="维修结束日期" format="yyyy-MM-dd" align="right">
                            </el-date-picker>
                        </el-form-item>
                        <!--<el-form-item label="" >
                            <el-select clearable v-model="searchForm.faultClass" placeholder="故障类别"   style="width: 100%;" :disabled="isDetail">
                                <el-option v-for="item in faultClassList" :label="item.label" :key="item.value" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>-->
                         <el-form-item label="">
                            <!-- 保养类型 1周期保养 2动态运行保养 -->
                            <el-select v-model="searchForm.maintainType" placeholder="设备分类" clearable>
					        	<el-option label="周期保养" value="1"></el-option>
					        	<el-option label="动态运行保养" value="2"></el-option>
					        </el-select>
                        </el-form-item>
                        <el-form-item label="">
                            <el-input placeholder="关键字" v-model="searchForm.keyword" clearable ></el-input>
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
                    <!-- 设备编号 -->
                    <el-table-column :show-overflow-tooltip="true" prop="deviceId" label="维修编号"></el-table-column>
                    <!-- 维修设备 -->
                    <el-table-column :show-overflow-tooltip="true" prop="deviceName" label="维修设备"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="deviceId" label="设备编号"></el-table-column>
                    <!-- 维修类别 1自维 2外维 -->
                    <el-table-column :show-overflow-tooltip="true" prop="repairType" label="维修类别" :formatter="repairType"></el-table-column>

                    <!-- 故障类别 1机械故障 2突发事件 3线路故障 4签报 5内部维修 6日常维修 7保修 -->
                    <el-table-column :show-overflow-tooltip="true" prop="faultClass" label="故障类别" :formatter="faultClass"></el-table-column>
                    <!-- 维修开始日期 -->
                    <el-table-column :show-overflow-tooltip="true" prop="startTime" label="维修开始日期" :formatter="startTime" width="120" ></el-table-column>
                    <!-- 维修结束日期 -->
                    <el-table-column :show-overflow-tooltip="true" prop="endTime" label="维修结束日期" :formatter="endTime" width="120"></el-table-column>
                    <!-- 维修结束日期 -->
                    <!--<el-table-column :show-overflow-tooltip="true" prop="createTime" label="维修登记时间" :formatter="createTime" width="160"></el-table-column>-->
                    <!-- 维修内容 -->
                    <!--<el-table-column :show-overflow-tooltip="true" prop="content" label="维修内容"></el-table-column>-->
                    <!-- 维修负责人 -->
                    <el-table-column :show-overflow-tooltip="true" prop="user.username" label="维修人员" width="100"></el-table-column>
                    <!-- 数据来源 1自动生成 2手动添加 -->
                    <!--<el-table-column :show-overflow-tooltip="true" prop="source" label="数据来源 1自动生成 2手动添加"></el-table-column>-->
                    <!-- 备注 -->
                    <!--<el-table-column :show-overflow-tooltip="true" prop="remark" label="备注"></el-table-column>-->
                    <el-table-column :show-overflow-tooltip="true" label="操作" width="180">
                        <template slot-scope="scope">
                            <el-button type="text" size="mini" @click="toEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button type="text" size="mini" @click="toDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页-->
                <el-pagination v-if="renovatePagination" @size-change="onSizeChange" @current-change="onCurrentChange" :current-page=pageNum :page-sizes="[10, 15, 20, 25]" :page-size=pageSize layout="total, sizes, prev, pager, next, jumper" :total=totolNum>
                </el-pagination>
            </div>

            <!--编辑弹出窗-->
            <el-dialog   :title="isDetail?'查看详情':(editform.id?'编辑':'新增')" :visible.sync="formDialogVisible" :before-close="close" width="900px">
                <el-form  :model="editform" :rules="rules" ref="editform"  label-width="120px">
                    <div class="p-10 f-w-700 m-b-10">设备信息</div>
                    <el-row class="m-t-10">
                        <div class="b-0 p-20">
                            <el-col :span="8">
                                <el-form-item label="设备编号" prop="deviceId">
                                    <!-- 设备编号 -->
                                    <el-input v-model="editform.deviceId" :disabled="isDetail||!!editform.id"  ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="设备专业" prop="deviceSystemName">
                                    <el-input v-model="editform.deviceSystemName" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="设备子系统" prop="deviceSubSysName">
                                    <el-input v-model="editform.deviceSubSysName" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="设备类别" prop="deviceTypeName">
                                    <el-input v-model="editform.deviceTypeName" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="维修设备" prop="deviceName">
                                    <el-input v-model="editform.deviceName" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="设备位置" prop="postion">
                                    <el-input v-model="editform.postion" disabled></el-input>
                                </el-form-item>
                            </el-col>
                        </div>
                    </el-row>
                    <div class="p-10 f-w-700 m-b-10">维修信息</div>
                   		<el-row>
                   			<el-col :span="24">
	                            <el-form-item label="维修编号">
	                                <!-- 维修编号 -->
	                                <el-input v-model="username" :disabled="true"></el-input>
	                            </el-form-item>
	                        </el-col>
	                        <el-col :span="24">
	                            <el-form-item label="维修人员">
	                                <!-- 维修人员 -->
	                                <el-input v-model="username" :disabled="true"></el-input>
	                            </el-form-item>
	                        </el-col>
                   		</el-row>
                        <el-row>
	                        <el-col :span="12">
	                            <el-form-item label="故障类别" prop="faultClass">
	                                <!-- 故障类别 1机械故障 2突发事件 3线路故障 4签报 5内部维修 6日常维修 7保修 -->
	                                <!--<el-input v-model="editform.faultClass" :disabled="isDetail"></el-input>-->
	                                <el-select v-model="editform.faultClass"    style="width: 100%;" :disabled="isDetail">
	                                    <el-option v-for="item in faultClassList" :label="item.label" :key="item.value" :value="item.value">
	                                    </el-option>
	                                </el-select>
	                            </el-form-item>
	                        </el-col>	
	                        <el-col :span="12">
	                            <el-form-item label="维修类别" prop="repairType">
	                                <!-- 维修类别 1自维 2 外维 -->
	                                <!--<el-input v-model="editform.repairType" :disabled="isDetail"></el-input>-->
	                                <el-select v-model="editform.repairType"    style="width: 100%;" :disabled="isDetail">
	                                    <el-option v-for="item in repairTypeList" :label="item.label" :key="item.value" :value="item.value">
	                                    </el-option>
	                                </el-select>
	                            </el-form-item>
	                        </el-col>
                        </el-row>
                        <el-row>
	                         <el-col :span="12">
	                             <!-- 维修开始日期 -->
	                            <el-form-item label="维修开始日期" prop="startTime">
	                                <el-date-picker v-model="editform.startTime" type="date" value-format="timestamp"
	                                                format="yyyy-MM-dd" placeholder="维修开始日期" :disabled="isDetail">
	                                </el-date-picker>
	                            </el-form-item>
	                        </el-col>
	                         <el-col :span="12">
	                             <!-- 维修结束日期 -->
	                            <el-form-item label="维修结束日期" prop="endTime">
	                                <el-date-picker v-model="editform.endTime" type="date" value-format="timestamp"
	                                                format="yyyy-MM-dd" placeholder="维修结束日期" :disabled="isDetail">
	                                </el-date-picker>
	                            </el-form-item>
	                        </el-col>
                        </el-row>
                        <el-col :span="24">
                            <el-form-item label="材料使用情况" >
                                <!-- 材料使用情况 -->
                                <el-input v-model="editform.content"  :autosize="{minRows:5}" :disabled="isDetail" maxlength="100"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="维修内容" >
                                <!-- 维修内容 -->
                                <el-input v-model="editform.content" type="textarea" :autosize="{minRows:5}" :disabled="isDetail" maxlength="100"></el-input>
                            </el-form-item>
                        </el-col>
                        <!--<el-col :span="12">
                            <el-form-item label="备注" prop="remark">
                                &lt;!&ndash; 备注 &ndash;&gt;
                                <el-input v-model="editform.remark" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>-->
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
    import { formatDate } from '../../../static/js/date.js'
    import Vue from 'vue'
    export default {
        // 变量初始化定义
        data:function() {
            var deviceId = (rule, value, callback) => {

                if(!value) {
                    return callback(new Error("请输入设备编号"));
                } else {
                    this.$httpGet('get', '/manage/device/queryByDeviceCodeList', {
                        deviceCode: this.editform.deviceId
                    }).then(res => {
                        if (res.data.code == 0) {
                            let device = res.data.body;
                            if(device){
                                this.editform.deviceSystemName  = device.deviceSystemName;
                                this.editform.deviceSubSysName  = device.deviceSubSysName;
                                this.editform.deviceTypeName  = device.deviceTypeName;
                                this.editform.deviceName  = device.deviceName;
                                this.editform.postion  = device.postion;
                                this.deviceSystemCode  = device.deviceSystemCode;
                            }else{
                                this.$message.error('设备编号不存在');
                                return;
                            }
                            this.$forceUpdate();
                            callback();
                        } else {
                        }

                    })
                }
            };
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
                username: '',
                deviceSystemCode: '',
                checkedArr: [],
                faultClassList: [],
                repairTypeList: [{
                    label:'自维',
                    value:'1'
                },{
                    label:'外维',
                    value:'2'
                }],
                // 校验
                rules: {
                // 设备编号
                deviceId: [{
                        required: true,
                        message: '请输入设备编号',
                        validator:deviceId,
                        trigger: 'blur'
                    }],
                // 维修类别 1自维 2外维
                repairType: [{
                        required: true,
                        message: '请选择维修类别 ',
                        trigger: 'change'
                    }],
                // 维修负责人
                repairUserId: [{
                        required: true,
                        message: '请选择维修负责人',
                        trigger: 'blur'
                    }],
                // 故障类别 1机械故障 2突发事件 3线路故障 4签报 5内部维修 6日常维修 7保修
                faultClass: [{
                        required: true,
                        message: '请选择故障类别',
                        trigger: 'change'
                    }],
                // 维修开始日期
                startTime: [{
                        required: true,
                        message: '请选择维修开始日期',
                        trigger: 'blur'
                    }],
                // 维修结束日期
                endTime: [{
                        required: true,
                        message: '请选择维修结束日期',
                        trigger: 'blur'
                    }],
                // 维修内容
                content: [{
                        required: true,
                        message: '请输入维修内容',
                        trigger: 'blur'
                    }],
                // 数据来源 1自动生成 2手动添加
                source: [{
                        required: true,
                        message: '请输入数据来源 1自动生成 2手动添加',
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
        // 页面加载时执行
        created: function() {
            this.initServerType();
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
                const param = {
                    faultClass:this.searchForm.faultClass,
                    page: this.pageNum,
                    size: this.pageSize
                }
                let startTime = "" ,endTime = ""
                if(type=='param'){
                    this.pageNum = 1;
                    this.renovatePagination = false;
                }
                if(this.searchForm.repairTime != undefined) {
                    Object.assign(param,{startTime:formatDate(this.searchForm.repairTime[0], "yyyy-MM-dd hh:mm"),endTime:formatDate(this.searchForm.repairTime[1], "yyyy-MM-dd 23:59")})
                }
                this.$httpPost('/manage/equipmentRepair/find', param).then(res => {
                    this.tableData = res.data.body.content;
                    this.totolNum = Number(res.data.body.totalElements);
                    this.renovatePagination = true
                })
            },
            //时间格式化
            startTime(row, column, cellValue) {
                if(row.startTime!=null){
                    return Vue.filter('dateFormat')(row.startTime,'yyyy-MM-dd')
                }
            },
            //时间格式化
            endTime(row, column, cellValue) {
                if(row.endTime!=null){
                    return Vue.filter('dateFormat')(row.endTime,'yyyy-MM-dd')
                }
            },
            //时间格式化
            createTime(row, column, cellValue) {
                if(row.createTime!=null){
                    return Vue.filter('dateFormat')(row.createTime,'yyyy-MM-dd hh:mm:ss')
                }
            },


            // 维修类别 1自维 2外维
            repairType: function(row, column, cellValue) {
                switch (row.repairType){
                    case "1":
                        return "自维";
                    case "2":
                        return "外维";
                    default:
                        return "";
                }
            },

            // 故障类别 1 机械故障 2 突发事件 3 线路故障 4 签报 5 内部维修 6 日常维修 7 保修
            faultClass: function(row, column, cellValue) {
                switch (row.faultClass){
                    case "1":
                        return "机械故障";
                    case "2":
                        return "突发事件";
                    case "3":
                        return "线路故障";
                    case "4":
                        return "签报";
                    case "5":
                        return "内部维修";
                    case "6":
                        return "日常维修";
                    case "7":
                        return "保修";
                    default:
                        return "";
                }
            },
            // 弹出修改弹出框
            toEdit(index, row) {
                this.editform = {};
                this.formDialogVisible = true;
                this.isDetail=false;
                if(row){
                    this.username=row.user.username;
                    this.editform = Object.assign({},row);
                }else {
                    this.username=localStorage.getItem('csmpLoginName');
                }
                this.$httpGet('get', '/manage/device/queryByDeviceCode', {
                    deviceCode: this.editform.deviceId
                }).then(res => {
                    if (res.data.code == 0) {
                        let device = res.data.body;
                        if(device){
                            this.editform.deviceSystemName  = device.deviceSystemName;
                            this.editform.deviceSubSysName  = device.deviceSubSysName;
                            this.editform.deviceTypeName  = device.deviceTypeName;
                            this.editform.deviceName  = device.deviceName;
                            this.editform.postion  = device.postion;
                        }else{
                            this.$message.error('设备编号不存在');
                            return;
                        }
                    } else {
                    }
                    this.$forceUpdate();
                })

            },
            // 修改 新增 保存
            save() {
                this.$refs.editform.validate((valid) => {
                    if(valid) {
                        if(this.editform.startTime <= this.editform.endTime) {
                            this.$httpPost('/manage/equipmentRepair/save', {
                            // 序号
                            id: this.editform.id,
                            deviceSystemCode: this.deviceSystemCode,
                            // 设备编号
                            deviceId: this.editform.deviceId,
                            deviceTypeName: this.editform.deviceTypeName,
                            // 维修类别 1自维 2外维
                            repairType: this.editform.repairType,
                            // 维修负责人
                            // repairUserId: this.editform.repairUserId,
                            // 故障类别 1机械故障 2突发事件 3线路故障 4签报 5内部维修 6日常维修 7保修
                            faultClass: this.editform.faultClass,
                            deviceName: this.editform.deviceName,
                            // 维修开始日期
                            startTime: this.editform.startTime,
                            // 维修结束日期
                            endTime: this.editform.endTime,
                            // 维修内容
                            content: this.editform.content,
                            // 数据来源 1自动生成 2手动添加
                            source: "2",
                            // 备注
                            remark: this.editform.remark,
                            }).then(res => {
                                this.search();
                                this.deviceSystemCode = "";
                                this.formDialogVisible = false;
                            })
                        }else {
                            this.$message.warning('结束日期不能早于开始日期')
                        }
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
                this.$httpPost('/manage/equipmentRepair/delete', {
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

            initServerType(){
                this.$http("post", "/system/user/dict/findListByType", {typekey:"faultClass"}).then( res =>{
                    if(res.data.msg === "success") {
                        var dataArr = res.data.body;
                        if(dataArr.length!= 0){
                            for(var i = 0;i<dataArr.length;i++){
                                var newObj = new Object();
                                newObj.label = dataArr[i].name;
                                newObj.value = dataArr[i].code;
                                this.faultClassList.push(newObj);
                            }
                        }else{
                            this.faultClassList=[];
                        }
                    }else{
                        Toast("加载服务类型失败");
                    }
                });
            },

        }
    }
</script>
