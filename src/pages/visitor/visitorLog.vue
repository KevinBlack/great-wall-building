
<template>
    <div class="wrap">
        <div class="subContent zr-row">
            <div class="tableWrap">
                <!--搜索功能-->
                <el-form :inline="true" :model="searchForm" class="demo-form-inline zr-row zr_justify-end">
                    <el-form-item label="">
                        <el-date-picker v-model="searchForm.expectArrivalTime" type="datetimerange" range-separator="至" start-placeholder="预计到达开始时间" end-placeholder="预计到达结束时间" format="yyyy-MM-dd HH:mm" align="right">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="">
                        <!--<el-input v-model="searchForm.visitorStatus" clearable ></el-input>-->
                        <el-select v-model="searchForm.visitorStatus"  clearable placeholder="来访状态">
                            <el-option v-for="item in visitorStatusList" :label="item.label" :key="item.value" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item >
                        <el-input placeholder="关键字" v-model="searchForm.keyword" clearable ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="search('param')">搜索</el-button>
                    </el-form-item>
                </el-form>
                <!--数据表格渲染-->
                <el-table ref="table" stripe :data="tableData" style="width: 100%" @selection-change="onSelect">
                    <el-table-column type="selection" :selectable='checkboxT' width="60" disabled='true' align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" type="index" label="序号" width="50" align="center"></el-table-column>
                    <!--<el-table-column :show-overflow-tooltip="true" prop="visitorName" @click="toEdit(scope.$index, scope.row)" label="来访人"></el-table-column>-->

                    <el-table-column :show-overflow-tooltip="true" prop="visitorName"  align="center" label="来访人" >
                        <template slot-scope="scope">
                            <el-button type="text" size="smart" @click="toDetails(scope.$index, scope.row)">{{scope.row.visitorName}}</el-button>
                        </template>
                    </el-table-column>


                    <!--<el-table-column :show-overflow-tooltip="true" prop="visitorUnit" label="来访单位"></el-table-column>-->
                    <el-table-column :show-overflow-tooltip="true" prop="visitorTel" label="来访人电话" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="visitorPlateNum" label="来访车牌号" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="expectArrivalTime"  :formatter="dateFormatExpectArrivalTime" width="200"  label="预计到达时间" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="beVisitName" label="被访人" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="beVisitTel" label="被访人电话" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="beVisitUnit" label="被访单位" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="visitorStatus" :formatter="state" label="来访状态" align="center"></el-table-column>
                    <!--<el-table-column :show-overflow-tooltip="true" prop="createTime"  :formatter="dateFormatCreateTime" width="200" label="创建时间"></el-table-column>-->
                    <el-table-column :show-overflow-tooltip="true" prop="visitTime"  :formatter="dateFormatVisitTime" width="200" label="到访时间" align="center"></el-table-column>
                </el-table>
                <!--分页-->
                <el-pagination v-if="renovatePagination" @size-change="onSizeChange" @current-change="onCurrentChange" :current-page="pageNum" :page-sizes="[15, 20, 25, 30]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totolNum">
                </el-pagination>
            </div>




            <!--查看详情弹出窗-->
            <el-dialog   title="查看详情" :visible.sync="detailsTableVisible" width="900px">
                <div class="zr-row">
                    <div class="zi-120px">
                    	<span style="color:blue;font-size:17px;" v-dict:visitorStatus="editform.visitorStatus"></span>
                    </div>
                    <div class="zr-column w-65">
                        <div class="zr-row">
                            <div class="zi-g-2 p-r-30 zr-row zr_justify-end">来访人</div>
                            <div class="zi-g-3 p-l-30">{{editform.visitorName || '--'}}</div>
                        </div>
                        <div class="zr-row">
                            <div class="zi-g-2 p-r-30 zr-row zr_justify-end">随行人数</div>
                            <div class="zi-g-3 p-l-30">{{editform.togetherNum || 0}}</div>
                        </div>
                        <div class="zr-row">
                            <div class="zi-g-2 p-r-30 zr-row zr_justify-end">来访单位</div>
                            <div class="zi-g-3 p-l-30">{{editform.visitorUnit || '--'}}</div>
                        </div>
                        <div class="zr-row">
                            <div class="zi-g-2 p-r-30 zr-row zr_justify-end">来访人电话</div>
                            <div class="zi-g-3 p-l-30">{{editform.visitorTel || '--'}}</div>
                        </div>
                        <div class="zr-row">
                            <div class="zi-g-2 p-r-30 zr-row zr_justify-end">来访人车牌号</div>
                            <div class="zi-g-3 p-l-30">{{editform.visitorPlateNum || '--'}}</div>
                        </div>
                        <div class="zr-row">
                            <div class="zi-g-2 p-r-30 zr-row zr_justify-end">被访人</div>
                            <div class="zi-g-3 p-l-30">{{editform.beVisitName || '--'}}</div>
                        </div>
                        <div class="zr-row">
                            <div class="zi-g-2 p-r-30 zr-row zr_justify-end">被访单位</div>
                            <div class="zi-g-3 p-l-30">{{editform.beVisitUnit || '--'}}</div>
                        </div>
                        <div class="zr-row">
                            <div class="zi-g-2 p-r-30 zr-row zr_justify-end">被访人电话</div>
                            <div class="zi-g-3 p-l-30">{{editform.beVisitTel || '--'}}</div>
                        </div>
                        <div class="zr-row">
                            <div class="zi-g-2 p-r-30 zr-row zr_justify-end">预计到达时间</div>
                            <div class="zi-g-3 p-l-30">{{editform.expectArrivalTime | dateFormat}}</div>
                        </div>
                        <div class="zr-row">
                            <div class="zi-g-2 p-r-30 zr-row zr_justify-end">来访事由</div>
                            <div class="zi-g-3 p-l-30" v-dict:visitorCause="editform.visitorCause"></div>
                        </div>
                        <div class="zr-row" v-if="editform.visitorStatus === 2 || editform.visitorStatus === 3">
                            <div class="zi-g-2 p-r-30 zr-row zr_justify-end">到访时间</div>
                            <div class="zi-g-3 p-l-30">{{editform.visitTime | dateFormat}}</div>
                        </div>
                        <div class="zr-row" v-if="editform.visitorStatus === 3">
                            <div class="zi-g-2 p-r-30 zr-row zr_justify-end">离开时间</div>
                            <div class="zi-g-3 p-l-30">{{editform.leaveTime | dateFormat}}</div>
                        </div>
                    </div>
                </div>
            </el-dialog>

            <!--删除提示框-->
            <el-dialog   title="提示" :visible.sync="deleteVisible" width="30%">
                <span>确定删除？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="deleteRow()">确 定</el-button>
                    <el-button @click="deleteVisible = false">取 消</el-button>
		        </span>
            </el-dialog>
            <!--删除提示框-->
            <el-dialog   title="提示" :visible.sync="visitorStatusVisible" width="30%">
                <span v-show="showAgree">是否确认同意？</span>
                <span v-show="showRefuse">是否确认拒绝？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="updateVisitorStatus()">确 定</el-button>
                    <el-button @click="visitorStatusVisible = false">取 消</el-button>
		        </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import { formatDate } from '../../../static/js/date.js'
    export default {
        // 变量初始化定义
        data() {
            return {
                tableData: [],
                //刷新分页
                renovatePagination: true,
                pageNum: 1,
                pageSize: 15,
                totolNum: 100,
                searchForm: {},
                editTableVisible: false,
                detailsTableVisible: false,
                visitorStatusVisible: false,
                visitorStatus:'',
                deleteVisible: false,
                showAgree: false,
                showRefuse: false,
                btnStatus: false,
                leaveVisible:false,
                visitVisible:false,
                editform: {},
                deleteIds: '',
                checkedArr: [],
                visitorStatusList:[],
                visitorCauses:[],
                // 校验
                rules: {
                    visitorName: [{
                        required: true,
                        message: '请输入来访人',
                        trigger: 'blur'
                    }],

                    visitorUnit: [{
                        required: true,
                        message: '请输入来访单位',
                        trigger: 'blur'
                    }],
                    visitorTel: [{
                        required: true,
                        message: '请输入来访人电话',
                        trigger: 'blur'
                    }],
                    visitorPlateNum: [{
                        required: true,
                        message: '请输入来访车牌号',
                        trigger: 'blur'
                    }],
                    expectArrivalTime: [{
                        required: true,
                        message: '请输入预计到达时间',
                        trigger: 'blur'
                    }],
                    visitorStatus: [{
                        required: true,
                        message: '请输入来访状态',
                        trigger: 'blur'
                    }],
                    visitorCause: [{
                        required: true,
                        message: '请输入来访事由',
                        trigger: 'blur'
                    }],
                    beVisitId: [{
                        required: true,
                        message: '请输入被访人ID',
                        trigger: 'blur'
                    }],
                    beVisitName: [{
                        required: true,
                        message: '请输入被访人',
                        trigger: 'blur'
                    }],
                    beVisitTel: [{
                        required: true,
                        message: '请输入被访人电话',
                        trigger: 'blur'
                    }],
                    beVisitUnit: [{
                        required: true,
                        message: '请输入被访单位',
                        trigger: 'blur'
                    }],
                    qrCode: [{
                        required: true,
                        message: '请输入二维码',
                        trigger: 'blur'
                    }],
                    remark: [{
                        required: true,
                        message: '请输入备注',
                        trigger: 'blur'
                    }],
                    channel: [{
                        required: true,
                        message: '请输入预约渠道',
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
                if(type=='param'){
                    this.pageNum = 1;
                    this.renovatePagination = false
                }
                let expectStartTime = "";
                let expectEndTime = "";
                if(this.searchForm.expectArrivalTime != undefined) {
                    expectStartTime = formatDate(this.searchForm.expectArrivalTime[0], "yyyy-MM-dd hh:mm");
                    expectEndTime = formatDate(this.searchForm.expectArrivalTime[1], "yyyy-MM-dd hh:mm");
                }
                this.$httpPost('/serveorder/visitorInfo/find', {


                    expectStartTime: expectStartTime,
                    expectEndTime: expectEndTime,
                    visitorStatus: this.searchForm.visitorStatus,
                    keyword: this.searchForm.keyword,
                    page: this.pageNum,
                    size: this.pageSize

                }).then(res => {
                    this.tableData = res.data.body.content;
                    this.totolNum = Number(res.data.body.totalElements)
                    this.renovatePagination = true
                })
            },
            // 弹出修改弹出框
            toEdit(index, row) {
                this.editform = {};
                this.editTableVisible = true;
                if(row){
                    this.editform = Object.assign({},row);
                }
            },
            // 弹出查看详情弹出框
            toDetails(index, row) {
                this.editform = {};
                this.detailsTableVisible = false;
                this.leaveVisible = false;
                this.visitVisible = false;
                if(row){
                    this.editform = Object.assign({},row);
                }
                if(this.editform.visitorStatus =="3" || this.editform.visitorStatus =="" || this.editform.visitorStatus =="5"){
                	this.leaveVisible = true;
                	this.visitVisible = true;
                }else if(this.editform.visitorStatus =="2"){
                	this.visitVisible = true;
                }
                this.detailsTableVisible = true;
            },

            // 修改 新增 保存
            save(formrule) {
                this.$refs[formrule].validate((valid) => {
                    if(valid) {
                        this.$httpPost('/serveorder/visitorInfo/save', {
                            id: this.editform.id,
                            visitorName: this.editform.visitorName,
                            togetherNum: this.editform.togetherNum,
                            visitorUnit: this.editform.visitorUnit,
                            visitorTel: this.editform.visitorTel,
                            visitorPlateNum: this.editform.visitorPlateNum,
                            expectArrivalTime: this.editform.expectArrivalTime,
                            visitorStatus: this.editform.visitorStatus,
                            visitorCause: this.editform.visitorCause,
                            beVisitId: this.editform.beVisitId,
                            beVisitName: this.editform.beVisitName,
                            beVisitTel: this.editform.beVisitTel,
                            beVisitUnit: this.editform.beVisitUnit,
                            qrCode: this.editform.qrCode,
                            remark: this.editform.remark,
                            channel: this.editform.channel,
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
                this.$httpPost('/serveorder/visitorInfo/delete', {
                    id: this.deleteIds
                }).then(res => {
                    this.deleteVisible = false;
                    this.deleteIds = "";
                    this.search();
                })
            },
            // 显示
            toVisitorStatus(index, row,value){
                this.visitorStatus=value;
                if(value==1){
                    this.showAgree=true;
                    this.showRefuse=false;
                }
                if(value ==4){
                    this.showAgree=false;
                    this.showRefuse=true;
                }

                if(index == undefined) {
                    //	没勾选
                    if(this.deleteIds == "") {
                        this.$message.error('请至少选择一条数据！');
                        return;
                    }
                }
                if(row) {
                    this.deleteIds = row.id;
                }
                this.visitorStatusVisible=true;
            },
            // 显示
            toVisitorStatusBatch(value){
                this.visitorStatus=value;
                if(value==1){
                    this.showAgree=true;
                    this.showRefuse=false;
                }
                if(value ==4){
                    this.showAgree=false;
                    this.showRefuse=true;
                }

                //	没勾选
                if(this.deleteIds == "") {
                    this.$message.error('请至少选择一条数据！');
                    return;
                }

                this.visitorStatusVisible=true;
            },
            // 修改状态
            updateVisitorStatus() {
                this.$httpPost('/serveorder/visitorInfo/updateVisitorStatus', {
                    ids: this.deleteIds,
                    visitorStatus:this.visitorStatus
                }).then(res => {
                    this.visitorStatusVisible = false;
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
            dateFormatExpectArrivalTime(row, column, cellValue) {

                if(row.expectArrivalTime!=null){
                    let date = new Date(parseInt(row.expectArrivalTime));
                    return formatDate(date, "yyyy-MM-dd hh:mm");
                    // return Vue.filter('dateFormat')(row.expectArrivalTime)
                }
                return "";

            },
            dateFormatVisitTime(row, column, cellValue) {
                if(row.visitTime!=null){
                    let date = new Date(parseInt(row.visitTime));
                    return formatDate(date, "yyyy-MM-dd hh:mm:ss");
                }
                return "";

            },
            //时间格式化
            dateFormatTime(row, column, cellValue) {

                if(row!=null){
                    let date = new Date(parseInt(row));
                    return formatDate(date, "yyyy-MM-dd hh:mm:ss");
                }
                return "";

            },
            initServerType(){
                this.$http("post", "/system/user/dict/findListByType", {typekey:"visitorCause"}).then( res =>{
                    if(res.data.msg === "success") {
                        var dataArr = res.data.body;
                        if(dataArr.length!= 0){
                            for(var i = 0;i<dataArr.length;i++){
                                var newObj = new Object();
                                newObj.label = dataArr[i].name;
                                newObj.value = dataArr[i].code;
                                this.visitorCauses.push(newObj);
                            }
                        }else{
                            this.visitorCauses=[];
                        }
                    }else{
                        Toast("加载服务类型失败");
                    }
                });
                this.$http("post", "/system/user/dict/findListByType", {typekey:"visitorStatus"}).then( res =>{
                    if(res.data.msg === "success") {
                        var dataArr = res.data.body;
                        if(dataArr.length!= 0){
                            for(var i = 0;i<dataArr.length;i++){
                                var newObj = new Object();
                                newObj.label = dataArr[i].name;
                                newObj.value = dataArr[i].code;
                                this.visitorStatusList.push(newObj);
                            }
                        }else{
                            this.visitorStatusList=[];
                        }
                    }else{
                        Toast("加载服务类型失败");
                    }
                })
            },
            //复选框
            checkboxT(row,index){
                // alert(row.visitorStatus)
                if(row.visitorStatus!=0){
                    return 0;
                }else{
                    return 1;
                }

            },
            // 表格显示 状态渲染 (0待确认、1未到访、2已到访、3已离开、4已拒绝、5已过期)
            state: function(row, column, cellValue) {
                switch (row.visitorStatus){
                    case 0:
                        return "待确认";
                    case 1:
                        return "未到访";
                    case 2:
                        return "已到访";
                    case 3:
                        return "已离开";
                    case 4:
                        return "已拒绝";
                    case 5:
                        return "已过期";
                    default:
                        return "已过期";
                }
            },
            state1: function(row, column, cellValue) {
//          	alert(row.visitorStatus);
                switch (row){
                    case 0:
                        return "待确认";
                    case 1:
                        return "未到访";
                    case 2:
                        return "已到访";
                    case 3:
                        return "已离开";
                    case 4:
                        return "已拒绝";
                    case 5:
                        return "已过期";
                    default:
                        return "已过期";
                }
            },
                //来访事由
              Cause: function(row, column, cellValue) {
                switch (row){
                    case 0:
                        return "商务洽谈";
                    case 1:
                        return "个人预约";
                    case 2:
                        return "面试";
                    default:
                        return "";
                }
            },
        }
    }
</script>
