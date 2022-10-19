
<template>
    <div class="wrap">
        <div class="subContent">
            <div class="tableWrap">
                <!--搜索功能-->
                <el-form :inline="true" :model="searchForm" class="demo-form-inline zr-row-scatter">
                    <div class="zr-row">
                        <el-button type="primary" @click="toEdit()">添加来访</el-button>
                        <el-button type="primary" @click="toVisitorStatusBatch(1)">批量同意</el-button>
                        <el-button type="primary" @click="toVisitorStatusBatch(4)">批量拒绝</el-button>
                        <el-button type="primary" @click="toDelete()">批量删除</el-button>
                        <!--<el-button type="primary" @click="search()">刷新</el-button>-->
                    </div>

                    <div class="zr-row">
                        <el-form-item label="">
                            <el-date-picker v-model="searchForm.expectArrivalTime" type="datetimerange" range-separator="至" start-placeholder="预计到达时间开始日期" end-placeholder="预计到达时间结束日期" format="yyyy-MM-dd HH:mm" align="right">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="">
                            <!--<el-input v-model="searchForm.visitorStatus" clearable ></el-input>-->
                            <el-select v-model="searchForm.visitorStatus"  clearable placeholder="来访状态">
                                <el-option v-for="item in visitorStatusList" :label="item.name" :key="item.code" :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item >
                            <el-input placeholder="关键字" v-model="searchForm.keyword" clearable ></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="search('param')">搜索</el-button>
                        </el-form-item>
                    </div>
                </el-form>
                <!--数据表格渲染-->
                <el-table ref="table" stripe :data="visitorReservationTable.content" style="width: 100%" @selection-change="onSelect">
                    <el-table-column type="selection" :selectable='checkboxT' width="60" disabled='true' align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" type="index" label="序号" width="50" align="center"></el-table-column>
                    <!--<el-table-column :show-overflow-tooltip="true" prop="visitorName" @click="toEdit(scope.$index, scope.row)" label="来访人"></el-table-column>-->

                    <el-table-column :show-overflow-tooltip="true" prop="visitorName" label="来访人" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" size="smart" @click="toDetails(scope.$index, scope.row)">{{scope.row.visitorName}}</el-button>
                        </template>
                    </el-table-column>


                    <!--<el-table-column :show-overflow-tooltip="true" prop="visitorUnit" label="来访单位"></el-table-column>-->
                    <el-table-column :show-overflow-tooltip="true" prop="visitorTel" label="来访人电话" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="visitorPlateNum" label="来访车牌号" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="expectArrivalTime"  :formatter="dateFormatExpectArrivalTime"  label="预计到达时间" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="visitorStatus" :formatter="visitorStatusFormatter" label="来访状态" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="createTime"  :formatter="dateFormatCreateTime"  label="创建时间" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" label="操作" width="180"  align="center">
                        <template slot-scope="scope" >
                            <!--<el-button type="text" size="mini" @click="toEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button type="text" size="mini" @click="toDelete(scope.$index, scope.row)">删除</el-button>-->
                            <el-button type="text"  :disabled="scope.row.visitorStatus!=0" size="mini" @click="toVisitorStatus(scope.$index, scope.row,1)">同意</el-button>
                            <el-button type="text"  :disabled="scope.row.visitorStatus!=0" size="mini" @click="toVisitorStatus(scope.$index, scope.row,4)">拒绝</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页-->
                <el-pagination @size-change="onSizeChange" @current-change="onCurrentChange" :current-page="pageNum" :page-sizes="[15, 20, 25, 30]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="Number(visitorReservationTable.totalElements)">
                </el-pagination>
            </div>

            <!--编辑弹出窗-->
            <el-dialog   title="添加来访" :visible.sync="editTableVisible" width="840px">
                <el-form  :model="editform" :rules="rules" ref="editform"  label-width="110px">
                        <el-col :span="12">
                            <el-form-item label="来访人" prop="visitorName">
                                <el-input v-model="editform.visitorName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="随行人数" prop="togetherNum">
                                <el-input v-model="editform.togetherNum" type="number" min="0"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="来访单位" prop="visitorUnit">
                                <el-input v-model="editform.visitorUnit"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="来访人电话" prop="visitorTel">
                                <el-input v-model="editform.visitorTel"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="来访人车牌号" prop="visitorPlateNum">
                                <el-input v-model="editform.visitorPlateNum"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="预计到达时间" prop="expectArrivalTime">
                                <el-date-picker v-model="editform.expectArrivalTime" type="datetime" value-format="timestamp" @click.native="setClickDatePickerTime"
                                    format="yyyy-MM-dd HH:mm" placeholder="预计到达时间" :picker-options="pickerOptions" :default-value="new Date()">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="来访事由" prop="visitorCause">
                                <!--<el-input v-model="editform.visitorCause"></el-input>-->
                                <el-select v-model="editform.visitorCause"  style="width: 100%;">
                                    <el-option v-for="item in visitorCauseList" :label="item.name" :key="item.code" :value="item.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>

                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="save('editform')">下一步</el-button>
                    <el-button @click="close('editform')">取 消</el-button>
		        </span>
            </el-dialog>

            <!--查看详情弹出窗-->
            <el-dialog   title="查看详情" :visible.sync="detailsTableVisible" width="900px" @close="closeTableVisible">
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
                        <div class="zr-row">
                            <div class="zi-g-2 p-r-30 zr-row zr_justify-end">所属区域</div>
                            <div class="zi-g-3 p-l-30">{{editform.beVisitFloor}}</div>
                        </div>

                        <div v-if="visitStatusVisible">
                            <div class="zr-column-center m-t-20">
                                <div class="zr-row">
                                    <img :src="baseUrl + '/serveorder/qrcode?id='+editform.serialNum+'&floor='+editform.beVisitFloor+''" width="100" height="100">
                                    <div class="zr-column">
                                        <div class="zi-g-1 zr-row">
                                            <div class="zr-column-center">请分享</div>
                                            <div class="zr-row zi_align-center m-l-20">
                                                <el-popover
                                                    placement="top-start"
                                                    title=""
                                                    width="200"
                                                    trigger="hover"
                                                    content="">
                                                    <i class="iconfont icon-weixin f-26 c-green" slot="reference"></i>
                                                    <div class="zr-column-center">
                                                        扫一扫分享到微信
                                                        <div id="qrcode" class="m-t-10 p-10"></div>
                                                    </div>
                                                </el-popover>
                                                <el-tooltip class="item" effect="dark" content="复制链接" placement="top-start">
                                                    <i class="iconfont icon-lianjie f-26 c-lightblue" :data-clipboard-text="baseUrl + '/serveorder/qrcode?id='+editform.serialNum+'&floor='+editform.beVisitFloor+'&nowTime=' + Date.now()" @click="copyLink"></i>
                                                </el-tooltip>
                                            </div>
                                        </div>
                                        <div class="zi-g-1">
                                            <div>有效时间：</div>
                                            <div>{{start }}~{{end }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </el-dialog>
            <!--添加来访结果弹出窗-->
            <el-dialog   title="添加来访" :visible.sync="addVisitVisible" width="900px" @close="closeTableVisible">
        		<div class="zr-column-center" >
                	<span style="color:blue ;font-size:17px;margin-bottom: 25px" >您已预约成功!</span>
                </div>
                <div class="zr-column">
                    <div class="zr-row">
                        <div class="zi-g-1 p-r-30 zr-row zr_justify-end">来访人</div>
                        <div class="zi-g-1 p-l-30">{{editform.visitorName || '--'}}</div>
                    </div>
                    <div class="zr-row">
                        <div class="zi-g-1 p-r-30 zr-row zr_justify-end">随行人数</div>
                        <div class="zi-g-1 p-l-30">{{editform.togetherNum || 0}}</div>
                    </div>
                    <div class="zr-row">
                        <div class="zi-g-1 p-r-30 zr-row zr_justify-end">来访单位</div>
                        <div class="zi-g-1 p-l-30">{{editform.visitorUnit || '--'}}</div>
                    </div>
                    <div class="zr-row">
                        <div class="zi-g-1 p-r-30 zr-row zr_justify-end">来访人电话</div>
                        <div class="zi-g-1 p-l-30">{{editform.visitorTel || '--'}}</div>
                    </div>
                    <div class="zr-row">
                        <div class="zi-g-1 p-r-30 zr-row zr_justify-end">来访人车牌号</div>
                        <div class="zi-g-1 p-l-30">{{editform.visitorPlateNum || '--'}}</div>
                    </div>
                    <div class="zr-row">
                        <div class="zi-g-1 p-r-30 zr-row zr_justify-end">预计到达时间</div>
                        <div class="zi-g-1 p-l-30">{{editform.expectArrivalTime | dateFormat}}</div>
                    </div>
                    <div class="zr-row">
                        <div class="zi-g-1 p-r-30 zr-row zr_justify-end">来访事由</div>
                        <div class="zi-g-1 p-l-30" v-dict:visitorCause="editform.visitorCause"></div>
                    </div>
                </div>
                <div class="zr-column-center">
	                    <div class="zr-row w-100">
                            <div class="zi-g-1 zr-row zr_justify-end p-r-20">
                                <img :src="baseUrl + '/serveorder/qrcode?id='+editform.serialNum+'&floor='+editform.beVisitFloor+''" width="100" height="100">
                            </div>
	                        <div class="zi-g-1 zr-column">
	                            <div class="zi-g-1 zr-row">
	                                <div class="zr-column-center">请分享</div>
	                                <div class="zr-row zi_align-center m-l-20">
                                        <el-popover
                                            placement="top-start"
                                            title=""
                                            width="200"
                                            trigger="hover"
                                            content="">
                                            <i class="iconfont icon-weixin f-26 c-green" slot="reference"></i>
                                            <div class="zr-column-center">
                                                扫一扫分享到微信
                                                <div id="qrcode" class="m-t-10 p-10"></div>
                                            </div>
                                        </el-popover>
	                                    <!--<i class="iconfont icon-xiazai1 f-26 c-blue"></i>-->
                                        <el-tooltip class="item" effect="dark" content="复制链接" placement="top-start">
                                            <i class="iconfont icon-lianjie f-26 c-lightblue" :data-clipboard-text="baseUrl + '/serveorder/qrcode?id='+editform.serialNum+'&floor='+editform.beVisitFloor+'&nowTime=' + Date.now()" @click="copyLink"></i>
                                        </el-tooltip>
	                                </div>
	                            </div>
	                            <div class="zi-g-1">
	                                <div>有效时间：</div>
	                                <div>{{start }}~{{end }}</div>
	                            </div>
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
    import formValidation from '@/config/formValidation.js'
    import { formatDate } from '../../../static/js/date.js'
    import QRCode from 'qrcodejs2'
    import store from '@/store/index'
    import { mapState } from 'vuex'
    import { axiosHttp, api } from '@/libs'
    import Vue from 'vue'
    export default {
        // 变量初始化定义
        data() {
            const _this =this
            return {
                tableData: [],
                pageNum: 1,
                pageSize: 15,
                totolNum: 100,
                searchForm: {},
                addVisitVisible:false,
                editTableVisible: false,
                detailsTableVisible: false,
                visitorStatusVisible: false,
                deleteVisible: false,
                showAgree: false,
                showRefuse: false,
                btnStatus: false,
                leaveVisible:false,
                visitVisible:false,
                visitStatusVisible:false,
                editform: {},
                visitorStatus1:'',
                deleteIds: '',
                visitorStatus:'',
                clickDatePickerTime: Date.now(),
                start:'',
                end:'',
                checkedArr: [],
                baseUrl: api.baseUrl,
                //二维码定时器
                imgInterval: {},
                pickerOptions: {
                    disabledDate(time) {
                        // const todayStartTime = new Date(Vue.filter('dateFormat')(new Date(),'yyyy-MM-dd 00:00:00')).getTime()
                        // if(time.getTime() === todayStartTime) {
                        //     return time.getTime() + Date.now() - todayStartTime < Date.now()
                        // }
                        return time.getTime() < Date.now() - 8.64e7
                    },
                },
                // 校验
                rules: {
                    visitorName: [
                        {required: true,message: '请输入来访人',trigger: 'blur'},
                        { max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
                    ],
                    visitorUnit: [{
                            required: true,
                            message: '请输入来访单位',
                            trigger: 'blur'
                        },
                        { max: 30, message: '长度不能超过30个字符', trigger: 'blur' }],
                    visitorTel: [{
                            required: true,
                            validator: formValidation.mobile,
                            trigger: 'blur'
                        }],
                    togetherNum: [{
                        validator: formValidation.age,
                        trigger: 'blur'
                        }],
                    visitorPlateNum: [{
                        validator: formValidation.plateNum,
                        trigger: 'blur'
                        }],
                        // { max: 10, message: '长度不能超过10个字符', trigger: 'blur' }],
                    expectArrivalTime: [{
                            required: true,
                            // message: '请输入预计到达时间',
                            validator: (rule, value, callback) => {
                                if(_this.clickDatePickerTime <= value) {
                                    callback()
                                }else {
                                    callback('预计到达时间必须大于当前时间')
                                }
                            },
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
                            trigger: 'change'
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
                copyBtn:{},
            }

        },
        computed: {
          ...mapState({
            // editform: state => state.visitorReservation,
            visitorReservationTable: state => state.visitorReservationTable,
            visitorCauseList: state => state.visitorCauseList,
            visitorStatusList: state => state.visitorStatusList,
          })
        },
        // 自定义方法
        methods: {
            setClickDatePickerTime() {
                this.clickDatePickerTime = new Date(Vue.filter('dateFormat')(Date.now())).getTime()
            },
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
                }
                let expectStartTime = "";
                let expectEndTime = "";
                if(this.searchForm.expectArrivalTime != undefined) {
                    expectStartTime = formatDate(this.searchForm.expectArrivalTime[0], "yyyy-MM-dd hh:mm");
                    expectEndTime = formatDate(this.searchForm.expectArrivalTime[1], "yyyy-MM-dd hh:mm");
                }
                store.dispatch('getVisitorReservationList', {
                    // expectArrivalTime: this.searchForm.expectArrivalTime,
                    flag: 1,
                    expectStartTime: expectStartTime,
                    expectEndTime: expectEndTime,
                    visitorStatus: this.searchForm.visitorStatus,
                    keyword: this.searchForm.keyword,
                    page: this.pageNum,
                    size: this.pageSize

                })
            },
            // 弹出修改弹出框
            toEdit(index, row) {
                const _this = this
                this.editTableVisible = true
                this.$nextTick(() => {
                    this.$refs.editform.clearValidate()
                })
                this.editform = {togetherNum:0};
                if(row){
                    this.editform = Object.assign({},row);
                }
            },
            // 弹出查看详情弹出框
            toDetails(index, row) {
                const _this = this
                this.editform = {};
                this.visitStatusVisible = false;
                this.detailsTableVisible = false;
                this.leaveVisible = false;
                this.visitVisible = false;
                if(row){
                    this.editform = Object.assign({},row);
                }
                if(this.editform.visitorStatus !="0" && this.editform.visitorStatus !="4" ){
                	this.visitStatusVisible = true;
                    this.qrcode()
                    this.imgInterval = setInterval(() => {
                        _this.qrcode()
                    }, 30000)
                }
                if(this.editform.visitorStatus =="2"  ){
                	this.visitVisible = true;
                }else if(this.editform.visitorStatus =="3"){
                	this.leaveVisible = true;
               		this.visitVisible = true;
                }
                this.detailsTableVisible = true;
                this.getConfigTime();
            },
            //获取二维码有效时间
			getConfigTime(){
				 this.$httpPost('/system/configtime/getConfigTime', {
                    expectArrivalTime: this.editform.expectArrivalTime
                }).then(res => {
                    this.start = res.data.body.startTime;
                    this.end = res.data.body.endTime;
                })
			},
            // 修改 新增 保存
            save(formrule) {
                const _this = this
            	this.$refs[formrule].validate((valid) => {
            		if(valid) {
            			if(this.editform.expectArrivalTime>Date.now()) {
                            axiosHttp.post('/serveorder/visitorInfo/save', {
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
                                this.editform = res;
                                this.editTableVisible = false;
                                this.search();
                                this.addVisitVisible = true;
                                _this.qrcode()
                                this.imgInterval = setInterval(() => {
                                    _this.qrcode()
                                }, 30000)
                                this.getConfigTime();
                            })
                        }else {
                            this.$message({
                                message: '预约时间必须大于当前时间',
                                type: 'warning'
                            });
                        }
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
            //关闭详情弹框
            closeTableVisible(){
                clearInterval(this.imgInterval)
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
                    return Vue.filter('dateFormat')(row.expectArrivalTime)
                }
                return "";

            },
            dateFormatCreateTime(row, column, cellValue) {

                if(row.createTime!=null){
                    return Vue.filter('dateFormat')(row.createTime, "yyyy-MM-dd hh:mm:ss")
                }
                return "";

            },
            //时间格式化
            dateFormatTime(row, column, cellValue) {

                if(row!=null){
                    return Vue.filter('dateFormat')(row, "yyyy-MM-dd hh:mm:ss")
                }
                return "";

            },
            // 表格显示 状态渲染 (0待确认、1未到访、2已到访、3已离开、4已拒绝、5已过期)
            visitorStatusFormatter: function(row, column, cellValue) {
                //alert(row.visitorStatus);
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
                //alert(row.visitorStatus);
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
            //复选框
            checkboxT(row,index){
                // alert(row.visitorStatus)
                if(row.visitorStatus!=0){
                    return 0;
                }else{
                    return 1;
                }

            },
            //生成二维码
            qrcode () {
                this.$nextTick(function () {
                    if(document.getElementById('qrcode').getElementsByTagName('img').length > 0) {
                        Object.entries(document.getElementById('qrcode').getElementsByTagName('img')).forEach((item, index) => {
                            document.getElementById('qrcode').removeChild(document.getElementById('qrcode').getElementsByTagName('img')[index])
                        })
                    }
                    let qrcode = new QRCode('qrcode', {
                        width: 100,
                        height: 100, // 高度
                        text: this.baseUrl + '/serveorder/qrcode?id='+this.editform.serialNum+'&floor='+this.editform.beVisitFloor+'&nowTime='+new Date().getTime() // 二维码内容serialNum
                        // render: 'canvas' // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
                        // background: '#f0f'
                        // foreground: '#ff0'
                    })
                    console.log(document.getElementById('qrcode').getElementsByTagName('img'))
                })
            },
           //复制链接
            copyLink() {
                const _this = this;
                var clipboard = new this.clipboard('.c-lightblue');
                clipboard.on('success', function() {
                    _this.$message.success('已复制到粘贴板');
                });
            }

        },
        // 页面加载时执行
        created: function() {
            this.search();
            store.dispatch('getCauseOrStatusList', {typekey:"visitorCause"})
            store.dispatch('getCauseOrStatusList', {typekey:"visitorStatus"})
        },
    }
</script>
