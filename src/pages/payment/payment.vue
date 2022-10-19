
<template>
    <div class="wrap">
    	<!--<div class="subContent zr-row " style="background: #F2F2F2;">-->
        <!-- <div class="tree_content ">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="" style="width: 90%;margin: 5%;">
                    <el-input v-model="treeKey" @clear="handleClear" clearable placeholder="按enter键进行搜索"></el-input>
                </el-form-item>
            </el-form>
            <ul id="resTree" class="ztree"></ul>
        </div> -->
        <div class="subContent">
            <div class="tableWrap">
                <!--搜索功能-->
                <el-form :inline="true" :model="searchForm" class="demo-form-inline zr-row-scatter">
                    <div class="zr-row">
                        <el-button type="primary" @click="handleExport">导出</el-button>
                    </div>
                    <div class="zr-row">
                            <el-form-item label="">
                                <!-- 客户名称 -->
                                <el-input v-model="searchForm.month" clearable placeholder="请输入月份"></el-input>
                            </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="search('param')">查询</el-button>
                        </el-form-item>
                    </div>
                </el-form>
                <!--数据表格渲染-->
                <el-table ref="table" stripe :data="tableData" v-loading ="loading1"
					 element-loading-text="拼命加载中"
					  element-loading-spinner="el-icon-loading"
					   element-loading-background="rbg(0,0,0,0.8)"  style="width: 100%" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="60"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" type="index" label="全部" align="center" width="50"></el-table-column>
                    <!-- 费用总计 -->
                    <el-table-column :show-overflow-tooltip="true" prop="amountTotal" label="费用总计（元）" align="center"></el-table-column>
                    <!-- 月份 -->
                    <el-table-column :show-overflow-tooltip="true" prop="month" label="月份" align="center"></el-table-column>
                    <!-- 缴费状态 -->
                    <el-table-column :show-overflow-tooltip="true" prop="chargeStatus" label="缴费状态" align="center" :formatter="dateFormatChargeStatus"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" label="操作" align="center" width="280">
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.chargeStatus === '0'" type="text" size="mini" @click="openBilling(scope.$index, scope.row, scope.row.chargeStatus)">立即缴费</el-button>
                            <el-button v-if="scope.row.chargeStatus === '1'" type="text" size="mini" @click="openBilling(scope.$index, scope.row, scope.row.chargeStatus)">明细</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页-->
                <el-pagination v-if="renovatePagination" @size-change="onSizeChange" @current-change="onCurrentChange" :current-page="pageNum" :page-sizes="[10, 15, 20, 25]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totolNum">
                </el-pagination>
            </div>

            <!--编辑弹出窗-->
            <el-dialog title="费用明细" :visible.sync="costDetailDialogVisible" :before-close="close" width="1000px">
                <!-- <el-form v-if="!listStatus" :model="editform" :rules="rules" ref="editform"  label-width="120px"> -->
                <el-form :model="editform" :rules="rules" ref="editform"  label-width="120px">
                        <el-col :span="12">
                            <el-form-item label="费用合计(元)" prop="total_amount">
                                <!-- 费用合计(元) -->
                                <el-input v-model="editform.total_amount" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="待缴金额(元)" prop="unpay_amount">
                                <!-- 待缴金额(元) -->
                                <el-input v-model="editform.unpay_amount" disabled></el-input>
                            </el-form-item>
                        </el-col>
                </el-form>

                <el-table
                    :data="tableData1"
                    border
                    style="width: 100%"
                >
                    <el-table-column prop="chargeZu" label="费用分组" align="center"></el-table-column>
                    <el-table-column prop="feeType" label="费用类型" align="center">
                    	<template slot-scope="scope">
                            <div v-dict:chargeType="scope.row.feeType">{{scope.row.feeType}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="amount" label="金额(元)"></el-table-column>
                    <el-table-column prop="month" label="所属月份"></el-table-column>
                    <el-table-column prop="chargeStatus" label="缴费状态" :formatter="dateFormatListChargeStatus"></el-table-column>
                    <el-table-column prop="paymentMethod" label="缴费方式"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="chargeTime" label="缴费时间" width="160">
                        <template slot-scope="scope">
                            {{scope.row.chargeTime, 'yyyy-MM-dd hh:mm:ss' | dateFormat}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="remark" label="退回原因"></el-table-column>
                    <el-table-column prop="paymentMethod" label="操作" align="center" width="200">
                        <template slot-scope="scope">
                            <el-button type="text" size="mini" v-if="scope.row.file_Id === '1' || scope.row.paymentMethod === ''" @click="handleDownloadProof(scope.$index, scope.row, scope.row.file_Id, scope.row.chargeStatus)">凭证</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination v-if="renovatePagination" @size-change="handleListSizeChange" @current-change="handleListCurrentChange" :current-page="listPageNum" :page-sizes="[10, 15, 20, 25]" :page-size="listPageSize" layout="total, sizes, prev, pager, next, jumper" :total="listTotolNum">
                </el-pagination>
            </el-dialog>
            <!--上传文件-->
            <el-dialog :title="uploadTitle" :visible.sync="isUploadList" :close-on-click-modal="false" width="800px">
                <el-form label-width="80px" ref="uploadForm" :model="uploadForm">
                    <!-- <el-form-item label="选择文件:">
                        <el-input type="file" name="file" /><span v-if="hadeFile">{{ uploadedFileName }}</span>
                    </el-form-item> -->
                    <el-form-item label="选择文件:">
                        <el-upload
                            class="upload-demo"
                            ref="listUpload"
                            action="123"
                            drag
                            multiple
                            :auto-upload="false"
                            accept="image/jpeg,image/jpg,image/png"
                            :limit="1"
                            :on-change="fileChange"
                            :on-exceed="handleExceed"
                            :before-remove="beforeRemove"
                            :before-upload="beforeupload"
                            :file-list="fileList">
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                            <div class="el-upload__tip" slot="tip" style="color: orange;">只能上传jpg/png文件</div>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="缴费时间:" style="overflow: hidden;">
                        <el-date-picker
                            v-model="uploadForm.charge_time"
                            type="datetime"
                            value-format="timestamp"
                            format="yyyy-MM-dd HH:mm"
                            placeholder="请选择"
                            width="80%">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-input type="text" value="线下支付" disabled />
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="handleUpload()">确 定</el-button>
                    <el-button @click="isUploadList = false">取 消</el-button>
                </span>
            </el-dialog>


            <!-- <el-dialog title="费用明细" id="costDetailDialog" class="f-12" :visible.sync="costDetailDialogVisible" v-if="loadTableDialog&&detailList.length > 0" :before-close="close" width="1000px">
                <div class="zr-row-center f-18 f-w-700">中国长城科技集团股份有限公司物业服务事业部</div>
                <div class="zr-row-center f-16 f-w-700 m-t-5">能源费用通知单</div>
                <div class="zr-row-scatter">
                    <div>客户(租户)：{{detailList[0].company}}</div>
                    <div>日期：{{firstAndLastList[0], 'yyyy年MM月dd日' | dateFormat}} - {{firstAndLastList[1], 'yyyy年MM月dd日' | dateFormat}}</div>
                </div>
                <div>
                    <table border="1" border-collapse="collapse" class="w-100">
                        <thead>
                            <th class="w-40-px">序号</th>
                            <th class="w-40-px">位置</th>
                            <th>水量（吨）</th>
                            <th>水费（元）</th>
                            <th>空调用水量（吨）</th>
                            <th>空调用水费（元）</th>
                            <th>电量（度）</th>
                            <th>电费（元）</th>
                            <th>空调用电量（度）</th>
                            <th>空调用电费（元）</th>
                            <th>空调加班电量（度）</th>
                            <th>空调加班费用（元）</th>
                            <th>合计（元）</th>
                            <th class="w-40-px">备注</th>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td >{{detailList[0].areaName}}</td>
                                <td v-for="(item, index) in detailListTr" :key="index">
                                    {{item}}
                                </td>
                                <td></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>合计</td>
                                <td colspan="2">
                                    <div class="zr-row-scatter border-none p-5">
                                        <div>水费</div>
                                        <div>{{detailTotalTr[0]}}</div>
                                    </div>
                                </td>
                                <td colspan="2">
                                    <div class="zr-row-scatter border-none p-5">
                                        <div>水量</div>
                                        <div>{{detailTotalTr[1]}}</div>
                                    </div>
                                </td>
                                <td colspan="2">
                                    <div class="zr-row-scatter border-none p-5">
                                        <div>电费</div>
                                        <div>{{detailTotalTr[2]}}</div>
                                    </div>
                                </td>
                                <td colspan="2">
                                    <div class="zr-row-scatter border-none p-5">
                                        <div>电量</div>
                                        <div>{{detailTotalTr[3]}}</div>
                                    </div>
                                </td>
                                <td colspan="2">
                                    <div class="zr-row-scatter border-none p-5">
                                        <div>其他</div>
                                        <div>0.00</div>
                                    </div>
                                </td>
                                <td>{{detailTotalTr[4]}}</td>
                                <td></td>
                            </tr>
                            <tr rowspan="3">
                                <td colspan="14">
                                    <div class="zr-row p-l-20 p-r-20">
                                        <div class="w-64-px">说明：</div>
                                        <div class="zr-column" style="width: calc(100% - 64px);">
                                            <div class="zr-row-scatter">
                                                <div>1、收款方：中国长城科技集团股份有限公司</div>
                                                <div>开户行：中信银行深圳南山支行</div>
                                                <div>账号：7441710182100002480</div>
                                            </div>
                                            <div class="zr-row zr_justify-start">注：长城电脑  水费单价4.995元/吨；电费单价0.8589元/度。</div>
                                            <div class="zr-row zr_justify-start">2、未交清当月款项，将停止各项服务（如有疑问，请拨：26639997-2128 2124查询）。</div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="zr-row-scatter">
                        <div>收费单位：中国长城科技集团股份有限公司</div>
                        <div>物业服务事业部</div>
                        <div>制表日期：{{new Date(), 'yyyy年MM月dd日' | dateFormat}}</div>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="print()">打印</el-button>
                    <el-button @click="close()">取 消</el-button>
                </span>
            </el-dialog> -->

            <!--删除提示框-->
            <el-dialog title="提示" :visible.sync="deleteVisible" width="30%">
                <span>是否确认收费？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="deleteRow()">确 定</el-button>
                    <el-button @click="deleteVisible = false">取 消</el-button>
                </span>
            </el-dialog>
            <!--凭证预览框-->
            <el-dialog title="凭证预览" :visible.sync="imgVisible" width="40%">
                <img :src="imgSrc" width="98%" />
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import { axiosHttp, dict, util, api } from '@/libs'
    import { formatDate } from '../../../static/js/date.js'
    export default {
        inject:['reloadView'],
        // 变量初始化定义
        data() {
            return {
                imgSrc: '',
                indexNumber: 1,
                imgVisible: false,
                listStatus: '',
                uploadId: '',
                fileList: [],
                uploadForm: {
                    charge_time: new Date(),
                    file: ''
                },
                param:"",//表单要提交的参数
                src:"",
                uploadTitle: '',
                uploadedFileName: '',
                isUploadList: false,
                hadeFile: false,
				loading1:false,
                tableData: [],
                tableData1: [],
                pageNum: 1,
                pageSize: 15,
                totolNum: 0,
                listPageNum: 1,
                listPageSize: 10,
                listTotolNum: 0,
                //刷新分页
                renovatePagination: true,
                searchForm: {},
                deleteVisible: false,
                //是否为详情，并设置是否disable
                isDetail:false,
                //开收款单时延迟加载
                loadTableDialog: false,
                formDialogVisible :false,
                costDetailDialogVisible: false,
                editform: {},
                deleteIds: '',
                checkedArr: [],
                addSubNodeVisible: false,
                addNodeVisible: false,
                renameVisible: false,
                //对应月份的第一天和最后一天的数组
                firstAndLastList: [],
                resSetting: {
                    view: {
                        dblClickExpand: true,
                        fontCss: this.getFont,
                        showIcon: false,
                        expand: false
                    },
                    data: {
                        simpleData: {
                            enable: true,
                            idKey: "realId",
                            pIdKey: "pId"
                        },
                    },
                    callback: {
                        onClick: this.treeClick,
                        onRightClick: this.onRightClick
                    }
                },
                rightClickNode: "",
                deviceTypeCode: "",
                subNodeModel: "",
                nodeModel: "",
                reName: "",
                treeKey: "",
                resTree: "",
                resTreeNodes: [],
                rMenu: "",
                houseFunctionOption: [],
                houseStatusOption: [],
                //已选row
                selectedRow: {},
                //明细单
                detailList:[],
                detailListTr: [],
                chargeCompleteSituationList: [],
                // 校验
                rules: {
                // // mid
                // mid: [{
                //         required: true,
                //         message: '请输入mid',
                //         trigger: 'blur'
                //     }],
                // // 区域名称
                // areaId: [{
                //         required: true,
                //         message: '请输入区域名称',
                //         trigger: 'blur'
                //     }],
                // // 用户编号
                // userNum: [{
                //         required: true,
                //         message: '请输入用户编号',
                //         trigger: 'blur'
                //     }],
                // // 客户名称
                // userName: [{
                //         required: true,
                //         message: '请输入客户名称',
                //         trigger: 'blur'
                //     }],
                // // 联系电话
                // userTel: [{
                //         required: true,
                //         message: '请输入联系电话',
                //         trigger: 'blur'
                //     }],
                // // 用户备注
                // userMark: [{
                //         required: true,
                //         message: '请输入用户备注',
                //         trigger: 'blur'
                //     }],
                // // 区域名称
                // areaName: [{
                //         required: true,
                //         message: '请输入区域名称',
                //         trigger: 'blur'
                //     }],
                // // 设备号
                // deviceNo: [{
                //         required: true,
                //         message: '请输入设备号',
                //         trigger: 'blur'
                //     }],
                // // 缴费状态
                // chargeStatus: [{
                //         required: true,
                //         message: '请输入缴费状态',
                //         trigger: 'blur'
                //     }],
                // // 缴费方式
                // chargeFashion: [{
                //         required: true,
                //         message: '请输入缴费方式',
                //         trigger: 'blur'
                //     }],
                // // 费用类型
                // chargingType: [{
                //         required: true,
                //         message: '请输入费用类型',
                //         trigger: 'blur'
                //     }],
                // // 缴费完成情况
                // chargeCompleteSituation: [{
                //         required: true,
                //         message: '请输入缴费完成情况',
                //         trigger: 'blur'
                //     }],
                // // 缴费时间
                // chargeTime: [{
                //         required: true,
                //         message: '请输入缴费时间',
                //         trigger: 'blur'
                //     }],
                // // 月份
                // month: [{
                //         required: true,
                //         message: '请输入月份',
                //         trigger: 'blur'
                //     }],
                // // 已缴金额(元)
                // paidAmount: [{
                //         required: true,
                //         message: '请输入已缴金额(元)',
                //         trigger: 'blur'
                //     }],
                // // 待缴金额(元)
                // unpaidAmount: [{
                //         required: true,
                //         message: '请输入待缴金额(元)',
                //         trigger: 'blur'
                //     }],
                // // 备注
                // remark: [{
                //         required: true,
                //         message: '请输入备注',
                //         trigger: 'blur'
                //     }],
                },
            }

        },
        mounted() {
            let _this = this;
            document.onkeydown = function(e) {
                if(!e) {
                    e = window.event
                }
                if((e.keyCode || e.which) == 13) {
                    _this.findInTree();

                }
            }
            // this.rMenu = $("#rMenu");
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
            // 弹出修改弹出框
            toEdit(index, row) {
                this.editform = {};
                this.formDialogVisible = true;
                this.isDetail=false;
                if(row){
                    this.editform = Object.assign({},row);
                }
            },
            getFont(treeId, node) {
                return node.font ? node.font : {};
            },
            // 修改 新增 保存
            save() {
                this.$refs.editform.validate((valid) => {
                    if(valid) {
                        axiosHttp.post('/manage/meterRegularCharge/save', {
                            // 序号
                            id: this.editform.id,
                            // mid
                            mid: this.editform.mid,
                            // 区域名称
                            areaId: this.editform.areaId,
                            // 用户编号
                            userNum: this.editform.userNum,
                            // 客户名称
                            userName: this.editform.userName,
                            // 联系电话
                            userTel: this.editform.userTel,
                            // 用户备注
                            userMark: this.editform.userMark,
                            // 区域名称
                            areaName: this.editform.areaName,
                            // 设备号
                            deviceNo: this.editform.deviceNo,
                            // 缴费状态
                            chargeStatus: this.editform.chargeStatus,
                            // 缴费方式
                            chargeFashion: this.editform.chargeFashion,
                            // 费用类型
                            chargingType: this.editform.chargingType,
                            // 缴费完成情况
                            chargeCompleteSituation: this.editform.chargeCompleteSituation,
                            // 缴费时间
                            chargeTime: this.editform.chargeTime,
                            // 月份
                            month: this.editform.month,
                            // 已缴金额(元)
                            paidAmount: this.editform.paidAmount,
                            // 待缴金额(元)
                            unpaidAmount: this.editform.unpaidAmount,
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
            //打印
            print() {
                axiosHttp.post('/manage/meterRecord/print',{id:this.selectedRow.id})
            },
            // 关闭弹出框
            close() {
                this.formDialogVisible = false
                this.costDetailDialogVisible = false
                // this.$refs.editform.resetFields();
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
                axiosHttp.post('/manage/meterRegularChargeDetail/getByAreaIdAndMonth', {
                    areaId: this.editform.areaId,
                    month: this.editform.month,
                    page: this.pageNum,
                    size: this.pageSize,
                }).then(res => {
                    this.tableData1 = res
                })
            },
            // 添加同级菜单
            // handleAddNode() {
            // 	this.clickFlag = 0;
            //     this.treeNode = {};
            //     this.treeNode.id = null;
            //     this.treeNode.upperId = this.rightClickNode.pId;
            //     if (this.treeNode.upperId == null) {
            //         this.treeNode.upperId = '-1';
            //     }
            //     this.treeNode.rank = this.rightClickNode.rank;
            //     this.editTreeNodeVisible = true;
            // },
            // 添加子级菜单
            // handleAddSubNode() {
            // 	this.clickFlag = 1;
            //     this.treeNode = {};
            //     this.treeNode.id = null;
            //     this.treeNode.upperId = this.rightClickNode.id;
            //     if (this.rightClickNode.rank == 1) {
            //         this.treeNode.rank = 2;
            //     } else if (this.rightClickNode.rank == 2) {
            //         this.treeNode.rank = 3;
            //     }
            //     this.editTreeNodeVisible = true;
            // },
            // 重命名
            // handleRename() {
            // 	this.clickFlag = 2;
            //     this.treeNode = {};
            //     this.treeNode.id = this.rightClickNode.id;
            //     this.treeNode.upperId = this.rightClickNode.pId;
            //     this.treeNode.houseName = this.rightClickNode.name;
            //     this.treeNode.rank = this.rightClickNode.rank;
            //     this.editTreeNodeVisible = true;
            // },
            // 树节点编辑
            // editTreeNode(formrule) {
            //     this.$refs[formrule].validate((valid) => {
            //     	let rankNo = this.treeNode.rank;
            //     	let nodeName = this.treeNode.houseName;
            //     	let checkNameReg=/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
            //     	if(rankNo==1){
            //     		if(nodeName.length>20){
            //     			this.$refs[formrule].fields[0].error="园区名称长度超限！";
            //     			this.$message.error("园区名称长度不能大于20个字符");
            //     			return false;
            //     		}
            //     		if(nodeName.length<4){
            //     			//this.$refs[formrule].fields[0].error="园区名称长度不足！";
            //     			this.$message.error("园区名称长度不能小于4个字符");
            //     			return false;
            //     		}
            //     		if (checkNameReg.test(nodeName) == false){
            //     			//this.$refs[formrule].fields[0].error="园区名称不合法！";
            //     			this.$message.error("园区名称仅支持中文因为及数字");
            //     			return false;
			// 			}
            //     	}else if(rankNo==2){
            //     		if(nodeName.length>10){
            //     			//this.$refs[formrule].fields[0].error="楼宇名称长度超限！";
            //     			this.$message.error("楼宇名称长度不能大于10个字符");
            //     			return false;
            //     		}
            //     		if(nodeName.length<2){
            //     			//this.$refs[formrule].fields[0].error="楼宇名称长度不足！";
            //     			this.$message.error("楼宇名称长度不能小于2个字符");
            //     			return false;
            //     		}
            //     		if (checkNameReg.test(nodeName) == false){
            //     			//this.$refs[formrule].fields[0].error="楼宇名称不合法！";
            //     			this.$message.error("楼宇名称仅支持中文因为及数字");
            //     			return false;
			// 			}
            //     	}else if(rankNo==3){
            //     		if(nodeName.length<2){
            //     			//this.$refs[formrule].fields[0].error="楼层名称长度不足！"
            //     			this.$message.error("楼层名称长度不能小于2个字符");
            //     			return false;
            //     		}
            //     		if(nodeName.length>5){
            //     			//this.$refs[formrule].fields[0].error="楼层名称长度超限！";
            //     			this.$message.error("楼层名称长度不能大于5个字符");
            //     			return false;
            //     		}
            //     		let floorSta = nodeName.substr(0,1);
            //     		if(!(floorSta=="B" || !isNaN(floorSta))){
            //     			//this.$refs[formrule].fields[0].error="楼层名称不合法！";
            //     			this.$message.error("请以“B或数字+层”格式命名，如：一层（1层）、负一层（B1层）");
            //     			return false;
            //     		}
            //     		let floorStr = nodeName.substring(1,nodeName.length-1);
            //     		if(isNaN(floorStr)){
            //     			//this.$refs[formrule].fields[0].error="楼层名称不合法！";
            //     			this.$message.error("请以“B或数字+层”格式命名，如：一层（1层）、负一层（B1层）");
            //     			return false;
            //     		}
            //     		let floorEnd = nodeName.substr(nodeName.length-1,1);
            //     		if(floorEnd!="层"){
            //     			//this.$refs[formrule].fields[0].error="楼层名称不合法！";
            //     			this.$message.error("请以“B或数字+层”格式命名，如：一层（1层）、负一层（B1层）");
            //     			return false;
            //     		}

            //     	}
            //         if (valid) {this.$httpPost('/manage/houseProperty/saveorupdate', {
            //                 id: this.treeNode.id,
            //                 remark: 'tree',
            //                 upperId: this.treeNode.upperId,
            //                 houseName: this.treeNode.houseName,
            //                 houseNo: this.treeNode.rank
            //             }).then(res => {
            //                 this.editTreeNodeVisible = false;
            //                 if(this.clickFlag===0){
            //                 	if(parseInt(this.treeNode.rank)===1){
			// 						this.loadTree();
			// 					}else{
			// 						this.loadTree(this.treeNode.upperId,1);
			// 					}
            //                 }else if(this.clickFlag===1){
            //                 	this.loadTree(this.treeNode.upperId,1);
            //                 }else if(this.clickFlag===2){
            //                 	this.loadTree(this.treeNode.id,1);
            //                 }
            //             })
            //         } else {
            //             return false;
            //         }
            //     });
            // },
            loadTree(id,flag) {
                // this.$http('get', '/manage/houseProperty/zTree', {}).then(res => {
                //     this.resTreeNodes = res.data.body;
                //     $.fn.zTree.init($("#resTree"), this.resSetting, this.resTreeNodes);
                //     this.resTree = $.fn.zTree.getZTreeObj("resTree");
                //     if(id){
                //     	this.$forceUpdate()
				// 		let firstNode;
				// 		if(flag===1){
				// 			firstNode = this.resTree.getNodeByParam("id", id, null);
				// 		}
				// 		this.resTree.expandNode(firstNode);
	            //         this.resTree.selectNode(firstNode);
	            //         this.upperId = firstNode.realId;
	            //         this.treeRank = firstNode.rank;
				// 	}else{
				// 		var firstNode = this.resTree.getNodes()[0];
	            //         this.resTree.selectNode(firstNode);
	            //         this.upperId = this.resTree.getNodes()[0].realId;
	            //         this.treeRank = firstNode.rank;
				// 	}

                    this.loadTable();
                // })
            },
            // 模糊搜索树
            findInTree() {
                // if(this.treeKey == "") {
                //     return
                // }
                // let nodes = this.resTree.getNodesByParamFuzzy('name', this.treeKey);
                // if(nodes.length == 0) {
                //     this.handleClear();
                //     return
                // }
                // this.handleClear();

                // let resTreeNodes = this.resTree.transformToArray(this.resTree.getNodes());
                // for(var i = 0; i < nodes.length; i++) {
                //     for(var j = 0; j < resTreeNodes.length; j++) {
                //         if(resTreeNodes[j].id == nodes[i].id) {
                //             for(var n = 0; n < resTreeNodes.length; n++) {
                //                 if(resTreeNodes[n].realId == resTreeNodes[j].pId) {
                //                     this.resTree.expandNode(resTreeNodes[n], true, false, false);
                //                     this.resTree.updateNode(resTreeNodes[n]);
                //                 }
                //             }
                //             resTreeNodes[j].font = {
                //                 'background': '#9abeff',
                //                 'color': '#333'
                //             }
                //             this.resTree.updateNode(resTreeNodes[j]);
                //         }
                //     }
                // }
            },
            handleClear() {
                // $.fn.zTree.init($("#resTree"), this.resSetting, this.resTreeNodes);
                // this.resTree = $.fn.zTree.getZTreeObj("resTree");
                // var firstNode = this.resTree.getNodes()[0]
                // this.resTree.selectNode(firstNode)
                // this.upperId = this.resTree.getNodes()[0].realId;
                // this.loadTable();
            },
            // 树节点点击
            treeClick(e, treeId, treeNode) {
                this.pageNum = 1;
                this.upperId = treeNode.realId;
                this.treeRank = treeNode.rank;
                this.treeNode = treeNode;
                this.loadTable();
            },
            // 树节点右击
            // onRightClick(event, treeId, treeNode) {
            	// if(treeNode.rank == 1) {
                // 	$("#m_add").html("添加园区");
                // 	$("#m_check").html("添加楼宇");
                // }else if(treeNode.rank == 2) {
                // 	$("#m_add").html("添加楼宇");
                // 	$("#m_check").html("添加楼层");
                // }else if(treeNode.rank == 3) {
                // 	$("#m_add").html("添加楼层");
                // }
                // if(!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
                //     this.resTree.cancelSelectedNode();
                //     this.showRMenu("root", event.clientX, event.clientY);

                // } else if(treeNode && !treeNode.noR) {
                //     this.resTree.selectNode(treeNode);
                //     this.showRMenu("root", event.clientX, event.clientY);
                // }

                // if(treeNode.rank == 3) {
                //     if(!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
                //         this.resTree.cancelSelectedNode();
                //         this.showRMenu("node", event.clientX, event.clientY);

                //     } else if(treeNode && !treeNode.noR) {
                //         this.resTree.selectNode(treeNode);
                //         this.showRMenu("node", event.clientX, event.clientY);
                //     }
                // }
                // this.rightClickNode = treeNode;
            // },
            // 显示菜单
            showRMenu(type, x, y) {
                $("#rMenu ul").show();
                if(type == "root") {
                    $("#m_del").show();
                    $("#m_check").show();
                    $("#m_unCheck").show();
                } else {
                    $("#m_del").show();
                    $("#m_check").hide();
                    $("#m_unCheck").show();
                }

                y += document.body.scrollTop;
                x += document.body.scrollLeft;
                this.rMenu.css({
                    "top": y - 90 + "px",
                    "left": x - 200 + "px",
                    "visibility": "visible"
                });

                $("body").bind("mousedown", this.onBodyMouseDown);
            },
            // 隐藏菜单
            hideRMenu() {
                if(this.rMenu) this.rMenu.css({
                    "visibility": "hidden"
                });
                $("body").unbind("mousedown", this.onBodyMouseDown);
            },
            editClose() {
                this.editTableVisible = false
                this.editform = {}
            },
            onBodyMouseDown(event) {
                if(!(event.target.id == "rMenu" || $(event.target).parents("#rMenu").length > 0)) {
                    this.rMenu.css({
                        "visibility": "hidden"
                    });
                }
            },
            //删除节点
            removeTreeNode() {
                if (this.rightClickNode.id == '2c90813b6503718b01650391850e007a') {
                    this.$message.warning('根节点不能删除');
                } else {
                	this.$http('post', '/manage/houseProperty/find', {
	                    remark: 'house',
	                    treepath: this.rightClickNode.realId,
	                    page: this.pageNum,
	                    size: this.pageSize
	                }).then(res => {
	                    let count = Number(res.data.body.totalElements)
	                    if(count>0){
							this.$message({
								type: 'warning',
								message: '该分类下存在区域不能删除'
							});
						}else{
							if (confirm('删除本节点将删除所有包含的节点，确定删除么？')) {
		                        this.$httpGet('get', '/manage/houseProperty/del', {
		                            "id": this.rightClickNode.id
		                        }).then(res => {
		                            this.$message({
		                                type: 'success',
		                                message: '删除成功'
		                            });
		                            this.hideRMenu();
		                            this.loadTree(this.rightClickNode.pId,1);
		                        });
		                    } else {
		                        this.hideRMenu();
		                    }
						}
	                })

                }
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
                axiosHttp.post('/manage/meterRegularChargeCollect/changeStatus', {
                    id: this.deleteIds,
                    areaId : this.areaId
                }).then(res => {
                    this.deleteVisible = false;
                    this.deleteIds = "";
                    this.search();
                })
            },
            //表格选择改变事件
            handleSelectionChange(val) {
                this.checkedArr = val;
                let idsArr = []
                for(var i = 0; i < val.length; i++) {
                    idsArr.push(val[i].id)
                }
                this.deleteIds = idsArr.join(',')
            },
            //确认收费
            confirmCharge(index, row) {
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
            //开收款单
            openBilling(index, row, status) {
                this.selectedRow = row
                this.loadTableDialog = false
                this.listStatus = status
                this.detailListTr = []
                this.detailTotalTr = []
                this.costDetailDialogVisible = true
                this.firstAndLastList = util.getFirstAndLast(row.month)
                this.editform = {}
                if(row){
                    this.handleListSrarch(row)
                }
            },



            // 明细查询
            handleListSrarch(row){
                this.listId = row.id
                this.areaId = row.areaId,
                this.month = row.month,
                this.userTel = row.userTel
                axiosHttp.post('/manage/meterRegularChargeDetail/getDetail', {
                    id : row.id,
                    areaId : row.areaId,
                    month : row.month,
                    userTel : row.userTel,
                    page: this.listPageNum,
                    size: this.listPageSize,
                }).then(res => {
                    this.editform = Object.assign({},res.payInfo);
                    this.tableData1 = res.content
                    this.listTotolNum = Number(res.totalElements)
                })
            },
            handleListSizeChange(val){
                this.listPageSize = val
                this.handleListSrarchReset()
            },
            handleListCurrentChange(val){
                this.listPageNum = val
                this.handleListSrarchReset()
            },
            handleListSrarchReset(){
                axiosHttp.post('/manage/meterRegularChargeDetail/getDetail', {
                    id : this.listId,
                    areaId : this.areaId,
                    month : this.month,
                    userTel : this.userTel,
                    page: this.listPageNum,
                    size: this.listPageSize
                }).then(res => {
                    this.tableData1 = res.content
                    this.listTotolNum = Number(res.totalElements)
                })
            },
            // 上传判断
            handleDownloadProof(index, row, fielId, status){
                this.uploadId = row.id
                if (fielId === '0') {
                    this.isUploadList = !this.isUploadList
                    this.uploadTitle = '上传凭证'
                } else if (fielId === '1')  {
                    if (status === '1') {
                        this.uploadTitle = '凭证预览'
                        // let routeData = this.$router.resolve({
                        //     path: '/manage/meterRegularChargeDetail/previewCertificates',
                        //     query: {
                        //         id: row.id
                        //     }
                        // })
                        // window.open(routeData.href, '_blank')
                        // window.open('http://192.168.1.107:5000/api/manage/meterRegularChargeDetail/previewCertificates?id='+row.id, '_blank')
                        this.imgVisible = true
                        this.imgSrc = api.baseUrl + "/manage/meterRegularChargeDetail/previewCertificates?id=" + row.id
                    } else {
                        this.isUploadList = !this.isUploadList
                        this.uploadTitle = '修改凭证'
                        axiosHttp.post('/manage/meterRegularChargeDetail/getCertificatesDetail', {
                            id: row.id,
                            areaId : this.areaId
                        }).then(res => {
                            this.hadeFile = true
                            let imgFile = {
                                name: res.fileName,
                                id: res.file_id
                            }
                            this.fileList = []
                            this.fileList.push(imgFile)
                            console.log(imgFile)
                            this.uploadForm.charge_time = res.charge_time
                        })
                    }
                }
            },
            handleUpload(){
                let charge_time = formatDate(new Date(Number(this.uploadForm.charge_time)), "yyyy-MM-dd hh:mm");
                let formData = new FormData()
                //下面append的东西就会到form表单数据的fields中；
                formData.append('charge_time', charge_time);
                // formData.append('fId', this.fileList[0].id);
                formData.append('id', this.uploadId);
                formData.append('file', this.uploadForm.file)
                formData.append('areaId', this.areaId)
                let config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                };
                //然后通过下面的方式把内容通过axios来传到后台
                //下面的this.$reqs 是在主js中通过Vue.prototype.$reqs = axios 来把axios赋给它;
                axiosHttp.post("/manage/meterRegularChargeDetail/uploadCertificates", formData, config).then(res => {
                    this.isUploadList = false
                    this.$message.success('上传成功！');
                    
                    axiosHttp.post('/manage/meterRegularChargeDetail/getDetail', {
                        id : this.listId,
                        areaId : this.areaId,
                        month : this.month,
                        userTel : this.userTel,
                        page: this.listPageNum,
                        size: this.listPageSize
                    }).then(res => {
                        this.tableData1 = res.content
                        this.listTotolNum = Number(res.totalElements)
                        this.listPageNum = res.totalPages
                        this.reloadView()
                    })
                }).catch(error => {
                    this.$message.error('请选择附件')
                })
            },
            handleRemove(file, fileList) {
            },
            handlePreview(file) {
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`);
            },
            fileChange(file, fileList) {
                this.uploadForm.file = file.raw
            },
            //阻止upload的自己上传，进行再操作
            beforeupload(file) {
                //创建临时的路径来展示图片
                var windowURL = window.URL || window.webkitURL;
                this.src = windowURL.createObjectURL(file);
                // this.param = new FormData();
                // this.uploadForm.append('file', file, file.name);
                // return false;
            },
            //覆盖默认的上传行为
            httprequest() {

            },
            // 导出
            handleDataManage(arr) {
                this.indexNumber = 1
                let transArray = []
                arr.forEach(element => {
                    let transObj = {
                        index: 0,
                        areaName: '',
                        month: '',
                        amountTotal: ''
                    }
                    transObj.index = this.indexNumber++
                    transObj.areaName = element.areaName                       
                    transObj.month = element.month                       
                    transObj.amountTotal = element.amountTotal
                    transObj.chargeStatus = (element.chargeStatus === '0' ? '未缴清' : '已缴清')
                    transArray.push(transObj) 
                });
                //列标题，逗号隔开，每一个逗号就是隔开一个单元格
                let str = `序号,公司名称,月份,待缴金额,缴费状态\n`;
                //增加\t为了不让表格显示科学计数法或者其他格式
                for(let i = 0 ; i < transArray.length ; i++ ){
                    for(let item in transArray[i]){
                        str+=`${transArray[i][item] + '\t'},`;
                    }
                    str+='\n';
                }
                //encodeURIComponent解决中文乱码
                let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
                //通过创建a标签实现
                let link = document.createElement("a");
                link.href = uri;
                //对下载的文件命名
                link.download =  "收费中心数据表.xls";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            },
            handleExport() {
                if (this.checkedArr.length === 0) {
                    this.$confirm('确认要导出所有数据吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                       axiosHttp.post('/manage/meterRegularChargeCollect/find',{
                           page: '',
                           size: ''
                       }).then(res => {
                           this.handleDataManage(res.content)
                       })
                    }).catch(() => {
                        this.$message({
                        type: 'info',
                        message: '已取消操作'
                        })
                    })
                } else {
                    this.handleDataManage(this.checkedArr)
                }

            },



            //复选框
            checkboxT(row,index){
                if(row.chargeStatus === '0'){
                    return 1;
                }else{
                    return 0;
                }

            },
            // 初始化表格 搜索功能
            search(type) {
                if(type=='param'){
                    this.pageNum = 1;
                    this.renovatePagination = false;
                }
                axiosHttp.post('/manage/meterRegularChargeCollect/find', {
                    // mid
                    mid: this.searchForm.mid,
                    // 用户编号
                    userNum: this.searchForm.userNum,
                    // 客户名称
                    userName: this.searchForm.userName,
                    // 联系电话
                    userTel: this.searchForm.userTel,
                    // 用户备注
                    userMark: this.searchForm.userMark,
                    // 区域名称
                    areaName: this.searchForm.areaName,
                    // 设备号
                    deviceNo: this.searchForm.deviceNo,
                    // 缴费状态
                    chargeStatus: this.searchForm.chargeStatus,
                    // 缴费方式
                    chargeFashion: this.searchForm.chargeFashion,
                    // 费用类型
                    chargingType: this.searchForm.chargingType,
                    // 缴费完成情况
                    chargeCompleteSituation: this.searchForm.chargeCompleteSituation,
                    // 缴费时间
                    chargeTime: this.searchForm.chargeTime,
                    // 月份
                    month: this.searchForm.month,
                    // 已缴金额(元)
                    paidAmount: this.searchForm.paidAmount,
                    // 待缴金额(元)
                    unpaidAmount: this.searchForm.unpaidAmount,
                    // 备注
                    remark: this.searchForm.remark,
                    treePath:this.treeNode?this.treeNode.id:'',
                    page: this.pageNum,
                    size: this.pageSize

                }).then(res => {
                    this.tableData = res.content;
                    this.totolNum = Number(res.totalElements);
                    this.renovatePagination = true
                })

            },
			// 初始化表格
			loadTable() {
                this.loading1 = true
                let params =  {
					page: this.pageNum,
                    size: this.pageSize,
                    month: this.searchForm.month,
                    areaName: this.searchForm.areaName,
                    userName: this.searchForm.userName
                }
                // if(this.treeNode) Object.assign(params,{treePath:this.treeNode.id})
				axiosHttp.post('/manage/meterRegularChargeCollect/find',params).then(res => {
					this.loading1=false;
					this.tableData = res.content;
					this.totolNum = Number(res.totalElements)
				})

			},
			//同步数据
            insert(){
            	axiosHttp.post('/manage/meterRegularChargeCollect/insert', {
                }).then(res => {
                },error => {
                })
            },
             // 表格显示 状态渲染 (0：未缴费，1：已缴费)
            dateFormatChargeStatus: function(row, column, cellValue) {
                switch (row.chargeStatus){
                    case "0":
                        return "未缴清";
                    case "1":
                        return "已缴清";
                    default:
                        return "";
                }
            },
            dateFormatListChargeStatus: function(row, column, cellValue) {
                switch (row.chargeStatus){
                    case "0":
                        return "未缴费";
                    case "1":
                        return "已缴费";
                    case "2":
                        return "被退回";
                    case "3":
                        return "有凭证";
                    default:
                        return "";
                }
            }
        },
        // 页面加载时执行
        created: function() {
            this.loadTree();
            this.insert();
            dict.dict('chargeCompleteSituation').then(res => this.chargeCompleteSituationList = res)
            this.$http('post', '/system/user/dict/findListByType', {
                typekey: "areaFunction",
            }).then(res => {
                this.houseFunctionOption = res.data.body
            })
            this.$http('post', '/system/user/dict/findListByType', {
                typekey: "areaStatus",
            }).then(res => {
                this.houseStatusOption = res.data.body
            })
        },
    }
</script>

<style lang="less">
#costDetailDialog {
    table{
        border-collapse:collapse;
        border:solid 1px Black;
        text-align: center;
    }
}
.unpay {
    .el-input__inner {
        color: red !important;
    }
}
.el-dialog__headerbtn .el-dialog__close {
            color: #fff !important;
        }
</style>

