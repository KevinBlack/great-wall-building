
<template>
    <div class="wrap">
        <div class="subContent">
            <div class="tableWrap">
                <!--搜索功能-->
                <el-form :inline="true" :model="searchForm" class="demo-form-inline zr-row-scatter">
                    <div class="zr-row">
                        <!--<el-button type="primary" @click="toEdit()">创建</el-button>
                        <el-button type="primary" @click="toDelete()">删除</el-button>
                        <el-button type="primary" @click="search()">刷新</el-button>-->
                    </div>
                    <div class="zr-row">

                            <el-form-item label="">
                                <!-- 提交时间 -->
                                <!--<el-input v-model="searchForm.submitTime" clearable placeholder="提交时间"></el-input>-->
                                <el-date-picker v-model="searchForm.submitTime" type="datetimerange" range-separator="至" start-placeholder="预约开始时间" end-placeholder="预约结束时间" format="yyyy-MM-dd HH:mm" align="right">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="">
                                <el-input v-model="searchForm.keyword" clearable placeholder="会议室名、单位名、预约人"></el-input>
                            </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="search('param')">查询</el-button>
                        </el-form-item>
                    </div>
                </el-form>
                <!--数据表格渲染-->
                <el-table ref="table" stripe :data="tableData" style="width: 100%" @selection-change="onSelect">
                    <el-table-column type="selection" width="60"></el-table-column>
                    <el-table-column type="index" label="序号" width="50" align="center">
                    </el-table-column>
                    <!-- 预约号 -->
                    <el-table-column prop="reservationId" label="预约号" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" size="smart" @click="toDetails(scope.$index, scope.row)">{{scope.row.reservationId}}</el-button>
                        </template>
                    </el-table-column>
                    <!-- 预约单位 -->
                    <el-table-column prop="reservationUnit" label="预约单位" align="center">
                        <!-- <template slot-scope="scope">
                            <el-button type="text" size="smart" @click="toDetails(scope.$index, scope.row)">{{scope.row.reservationUnit}}</el-button>
                        </template> -->
                    </el-table-column>
                    <!-- 会议室名称 -->
                    <el-table-column prop="meetRoomName" label="会议室名称" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" size="smart" @click="$router.push({path:'/meetRoom/meetRoomDetail',query:{meetRoomInfoId:scope.row.meetRoomInfoId}})">{{scope.row.meetRoomName}}</el-button>
                        </template>
                    </el-table-column>
                    <!-- 提交时间 -->
                    <el-table-column prop="preMeetStartTime" label="预约开始时间" :formatter="dateFormatSubmitTime" align="center"></el-table-column>
                    <!-- 预约人名字 -->
                    <el-table-column prop="reservationPeopleName" label="预约人名字" align="center"></el-table-column>
                    <!-- 联系方式 -->
                    <el-table-column prop="tel" label="联系方式" align="center"></el-table-column>
                    <!-- 状态(0：待使用，1：已使用，2：已取消） -->
                    <el-table-column prop="status" label="状态" :formatter="statusFormatter" align="center"></el-table-column>
                    <el-table-column label="操作" width="180" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" size="mini" :disabled="scope.row.status==='0'?false:true" @click="cancelRow(scope.$index, scope.row)">取消预约</el-button>
                            <!-- <el-button type="text" size="mini" @click="toDetails(scope.$index, scope.row)">查看</el-button> -->
                            <!--<el-button type="text" size="mini" @click="toDelete(scope.$index, scope.row)">删除</el-button>-->
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页-->
                <el-pagination v-if="renovatePagination" @size-change="onSizeChange" @current-change="onCurrentChange" :current-page="pageNum" :page-sizes="[10, 15, 20, 25]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totolNum">
                </el-pagination>
            </div>

            <!--编辑弹出窗-->
            <el-dialog   title="查看详情" :visible.sync="formDialogVisible" width="900px">
                <div class="zr-row">
                    <div class="zr-column w-65" style="border-right:1px solid black">
                        <div class="zr-row">
                            <div class="zi-g-3 p-l-30">预约号：{{editform.reservationId || '--'}}</div>
                        </div>
                        <div class="zr-row">
                            <div class="zi-g-3 p-l-30">{{this.statusName || '--'}}</div>
                        </div>
                        <div class="zr-row">
                            <div class="zi-g-3 p-l-30">{{editform.meetRoomName || '--'}}</div>
                        </div>
                        <div class="zr-row">
                            <!--<div class="zi-g-3 p-l-30">{{editform.preMeetStartTime || dateFormat}} 至 {{editform.preMeetEndTime || dateFormat}}</div>-->
                            <div class="zi-g-3 p-l-30">{{editform.preMeetStartTime | dateFormat}} 至 {{editform.preMeetEndTime | dateFormat}}</div>
                        </div>
                        <div class="zr-row">
                            <div class="zi-g-3 p-l-30">共 {{editform.durationTime || '--'}} 小时</div>
                        </div>
                        <div class="zr-row">
                            <div class="zi-g-3 p-l-30">
                                <el-button v-if="this.statusBool" type="primary" @click="cancelRowDetails()">取消预约</el-button>
                            </div>
                        </div>
                    </div>
                    <div class="zr-column w-65">
                        <div class="zr-row">
                            <div class="zi-g-3 p-l-30">预约单位：{{editform.reservationUnit || '--'}}</div>
                        </div>
                        <div class="zr-row">
                            <div class="zi-g-3 p-l-30">预约人：{{editform.reservationPeopleName || '--'}}</div>
                        </div>
                        <div class="zr-row">
                            <div class="zi-g-3 p-l-30">联系电话：{{editform.tel || '--'}}</div>
                        </div>
                        <div class="zr-row">
                            <div class="zi-g-3 p-l-30">参会人数：{{editform.participationPeopleNumber || '--'}}</div>
                        </div>
                        <div class="zr-row">
                            <div class="zi-g-3 p-l-30">提供设备：{{editform.deviceId || '--'}}</div>
                        </div>
                        <!-- <div class="zr-row">
                            <div class="zi-g-3 p-l-30">其他服务：{{editform.otherService || '--'}}</div>
                        </div> -->
                        <div class="zr-row">
                            <div class="zi-g-3 p-l-30">备注：{{editform.remark || '--'}}</div>
                        </div>

                    </div>
                </div>
            </el-dialog>




            <!--<el-dialog   :title="isDetail?'查看详情':(editform.id?'编辑':'新增')" :visible.sync="formDialogVisible" :before-close="close" width="60%">
                <el-form  :model="editform"  ref="editform"  label-width="80px">
                        <el-col :span="12">
                            <el-form-item label="预约号" >
                                &lt;!&ndash; 预约号 &ndash;&gt;
                                <el-input v-model="editform.reservationId" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="会议室id" >
                                &lt;!&ndash; 会议室id &ndash;&gt;
                                <el-input v-model="editform.meetRoomInfoId" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="测试" >
                                &lt;!&ndash; 会议室id &ndash;&gt;
                                <el-input v-model="editform.durationTime" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="预约单位" >
                                &lt;!&ndash; 预约单位 &ndash;&gt;
                                <el-input v-model="editform.reservationUnit" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="会议室id" >
                                &lt;!&ndash; 会议室id &ndash;&gt;
                                <el-input v-model="editform.meetRoomId" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="会议室名称" >
                                &lt;!&ndash; 会议室名称 &ndash;&gt;
                                <el-input v-model="editform.meetRoomName" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                         <el-col :span="12">
                             &lt;!&ndash; 提交时间 &ndash;&gt;
                            <el-form-item label="提交时间">
                                <el-date-picker v-model="editform.submitTime" type="datetime" value-format="timestamp"
                                                format="yyyy-MM-dd HH:mm" placeholder="提交时间" :disabled="isDetail">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="预约人id" >
                                &lt;!&ndash; 预约人id &ndash;&gt;
                                <el-input v-model="editform.reservationPeopleId" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="预约人名字" >
                                &lt;!&ndash; 预约人名字 &ndash;&gt;
                                <el-input v-model="editform.reservationPeopleName" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="联系方式" >
                                &lt;!&ndash; 联系方式 &ndash;&gt;
                                <el-input v-model="editform.tel" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="状态(0：待使用，1：已使用，2：已取消）" >
                                &lt;!&ndash; 状态(0：待使用，1：已使用，2：已取消） &ndash;&gt;
                                <el-input v-model="editform.status" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="参会人数" >
                                &lt;!&ndash; 参会人数 &ndash;&gt;
                                <el-input v-model="editform.participationPeopleNumber" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="其他服务" >
                                &lt;!&ndash; 其他服务 &ndash;&gt;
                                <el-input v-model="editform.otherService" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="提供设备" >
                                &lt;!&ndash; 提供设备 &ndash;&gt;
                                <el-input v-model="editform.deviceId" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                         <el-col :span="12">
                             &lt;!&ndash; 预定会议开始时间 &ndash;&gt;
                            <el-form-item label="预定会议开始时间">
                                <el-date-picker v-model="editform.preMeetStartTime" type="datetime" value-format="timestamp"
                                                format="yyyy-MM-dd HH:mm" placeholder="预定会议开始时间" :disabled="isDetail">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                         <el-col :span="12">
                             &lt;!&ndash; 预定会议结束时间 &ndash;&gt;
                            <el-form-item label="预定会议结束时间">
                                <el-date-picker v-model="editform.preMeetEndTime" type="datetime" value-format="timestamp"
                                                format="yyyy-MM-dd HH:mm" placeholder="预定会议结束时间" :disabled="isDetail">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                         <el-col :span="12">
                             &lt;!&ndash; 开始时间 &ndash;&gt;
                            <el-form-item label="开始时间">
                                <el-date-picker v-model="editform.startTime" type="datetime" value-format="timestamp"
                                                format="yyyy-MM-dd HH:mm" placeholder="开始时间" :disabled="isDetail">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                         <el-col :span="12">
                             &lt;!&ndash; 结束时间 &ndash;&gt;
                            <el-form-item label="结束时间">
                                <el-date-picker v-model="editform.endTime" type="datetime" value-format="timestamp"
                                                format="yyyy-MM-dd HH:mm" placeholder="结束时间" :disabled="isDetail">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="备注" >
                                &lt;!&ndash; 备注 &ndash;&gt;
                                <el-input v-model="editform.remark" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                </el-form>
                &lt;!&ndash;<span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="save()">确 定</el-button>
                    <el-button @click="close()">取 消</el-button>
                </span>&ndash;&gt;
            </el-dialog>-->

            <!--删除提示框-->
            <el-dialog   title="提示" :visible.sync="deleteVisible" width="30%">
                <span>确定删除？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="deleteRow()">确 定</el-button>
                    <el-button @click="deleteVisible = false">取 消</el-button>
                </span>
            </el-dialog>
            <!--取消提示框-->
            <el-dialog   title="提示" :visible.sync="cancelVisible" width="30%">
                <span>确定取消预约？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="cancelMeetRoomReserve()">确 定</el-button>
                    <el-button @click="cancelVisible = false">取 消</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import { axiosHttp } from '@/libs'
    import { formatDate } from '../../../static/js/date.js'
    import Vue from 'vue'
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
                cancelVisible:false,
                formDialogVisible :false,
                editform: {},
                deleteIds: '',
                cancelId: '',
                statusName: '',
                checkedArr: [],
                statusBool: false,
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
                let startTime = "";
                let endTime = "";
                if(this.searchForm.submitTime != undefined) {
                    startTime = formatDate(this.searchForm.submitTime[0], "yyyy-MM-dd hh:mm");
                    endTime = formatDate(this.searchForm.submitTime[1], "yyyy-MM-dd hh:mm");
                }


                axiosHttp.post('/serveorder/meetRoomReserve/find', {
                    startTime: startTime,
                    endTime: endTime,
                    keyword: this.searchForm.keyword,
                    page: this.pageNum,
                    size: this.pageSize

                }).then(res => {
                    this.tableData = res.content;
                    console.log(typeof(this.tableData[0].status))
                    this.totolNum = Number(res.totalElements);
                    this.renovatePagination = true
                })
            },
            // 弹出修改弹出框
            toEdit(index, row) {
                this.editform = {};
                if(row){
                    this.editform = Object.assign({},row);
                }
                this.formDialogVisible = true;
                this.isDetail=false;
            },
            dateFormatSubmitTime(row, column, cellValue) {

                if(row.preMeetStartTime!=null){
                    return Vue.filter('dateFormat')(row.preMeetStartTime, "yyyy-MM-dd hh:mm")
                }
                return "";

            },
            // 修改 新增 保存
            save() {
                this.$refs.editform.validate((valid) => {
                    if(valid) {
                        axiosHttp.post('/serveorder/meetRoomReserve/save', {
                        // id
                        id: this.editform.id,
                        // 预约号
                        reservationId: this.editform.reservationId,
                        // 会议室id
                        meetRoomInfoId: this.editform.meetRoomInfoId,
                        // 预约单位
                        reservationUnit: this.editform.reservationUnit,
                        // 会议室id
                        meetRoomId: this.editform.meetRoomId,
                        // 会议室名称
                        meetRoomName: this.editform.meetRoomName,
                        // 提交时间
                        submitTime: this.editform.submitTime,
                        // 预约人id
                        reservationPeopleId: this.editform.reservationPeopleId,
                        // 预约人名字
                        reservationPeopleName: this.editform.reservationPeopleName,
                        // 联系方式
                        tel: this.editform.tel,
                        // 状态(0：待使用，1：已使用，2：已取消）
                        status: this.editform.status,
                        // 参会人数
                        participationPeopleNumber: this.editform.participationPeopleNumber,
                        // 其他服务
                        otherService: this.editform.otherService,
                        // 提供设备
                        deviceId: this.editform.deviceId,
                        // 预定会议开始时间
                        preMeetStartTime: this.editform.preMeetStartTime,
                        // 预定会议结束时间
                        preMeetEndTime: this.editform.preMeetEndTime,
                        // 开始时间
                        startTime: this.editform.startTime,
                        // 结束时间
                        endTime: this.editform.endTime,
                        // 备注
                        remark: this.editform.remark,
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
                axiosHttp.post('/serveorder/meetRoomReserve/delete', {
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
                this.statusBool=false;
                this.editform = {};
                if(row){
                    this.editform = Object.assign({},row);
                    axiosHttp.post('/serveorder/meetRoomInfo/get', {
                        id: row.meetRoomInfoId
                    }).then(res => {
                        this.editform.deviceId = res.deviceName
                    })
                    if(row.status==0){
                        this.statusBool=true;
                    }
                    switch (row.status){
                        case "0":
                            this.statusName= "待使用";
                            break;
                        case "1":
                            this.statusName= "已使用";
                            break;
                        case "2":
                            this.statusName= "已取消";
                            break;
                        default:
                            this.statusName= "已取消";
                    }
                    this.cancelId = row.id;
                }
                this.formDialogVisible = true;
                this.isDetail = true
            },

            //  取消预约弹出框
            cancelRow(index,row){
                if(row) {
                    this.cancelId = row.id;
                    this.cancelVisible = true;
                } else {
                    if (this.$refs.table.store.states.selection.length > 0) {
                        this.cancelVisible = true;
                    } else {
                        this.$message.error('请至少选择一条数据');
                    }
                }
            },
            cancelRowDetails(){
                    this.cancelVisible = true;
            },
            // 状态(0：待使用，1：已使用，2：已取消）
            statusFormatter: function(row, column, cellValue) {
                switch (row.status){
                    case "0":
                        return "待使用";
                    case "1":
                        return "已使用";
                    case "2":
                        return "已取消";
                    default:
                        return "";
                }
            },

            // 取消预约
            cancelMeetRoomReserve(){
                axiosHttp.post('/serveorder/meetRoomReserve/cancelMeetRoomReserve', {
                    // id
                    id: this.cancelId,
                }).then(res => {
                    this.$message.success('取消成功');
                    this.cancelVisible = false;
                    this.formDialogVisible = false;
                    this.search();

                })
            }
        }
    }
</script>
