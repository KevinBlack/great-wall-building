
<template>
    <div class="wrap">
    	<!--<div class="subContent zr-row " style="background: #F2F2F2;">-->
        <div class="tree_content" style="display:none;">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="" style="width: 90%;margin: 5%;">
                    <el-input v-model="treeKey" @clear="handleClear" clearable placeholder="按enter键进行搜索"></el-input>
                </el-form-item>
            </el-form>
            <ul id="resTree" class="ztree"></ul>
        </div>
        <div class="subContent">
            <div class="tableWrap">
                <!--搜索功能-->
                <el-form :inline="true" :model="searchForm" class="demo-form-inline zr-row-scatter">
                    <div class="zr-row">
                        <el-button type="primary" @click="confirmCharge(2)">确认收费</el-button>
                        <!-- <el-button type="primary">催 缴</el-button> -->
                        <el-button type="primary" @click="handleExport">导 出</el-button>
                    </div>
                    <div class="zr-row">
                    		<!-- <el-form-item label="">
                                <el-input v-model="searchForm.month" clearable placeholder="月份"></el-input>
                            </el-form-item>
                            <el-form-item label="">
                                <el-input v-model="searchForm.areaName" clearable placeholder="区域名称"></el-input>
                            </el-form-item> -->
                            <el-form-item label="">
                                <el-input v-model="searchForm.areaName" clearable placeholder="客户名称"></el-input>
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
                    <el-table-column type="selection" width="60" disabled='true'></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" type="index" label="序号" align="center" width="50"></el-table-column>
                    <!-- 客户名称 -->
                    <el-table-column :show-overflow-tooltip="true" prop="areaName" label="客户名称" align="center"></el-table-column>
                    <!-- 费用总计 -->
                    <el-table-column :show-overflow-tooltip="true" prop="amountTotal" label="费用总计（元）" align="center"></el-table-column>
                    <!-- 月份 -->
                    <el-table-column :show-overflow-tooltip="true" prop="month" label="月份" align="center"></el-table-column>
                    <!-- 缴费状态 -->
                    <el-table-column :show-overflow-tooltip="true" prop="chargeStatus" label="缴费状态" align="center" :formatter="dateFormatChargeCompleteSituation"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" label="操作" align="center" width="180">
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.chargeStatus === '0'" type="text" size="mini" @click="confirmCharge(1, scope.row)">确认收费</el-button>
                            <el-button v-if="scope.row.chargeStatus === '0'" type="text" size="mini" @click="handleconfirm(1, scope.row)">催缴</el-button>
                            <el-button type="text" size="mini" @click="openBilling(scope.$index, scope.row)">明细</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页-->
                <el-pagination v-if="renovatePagination" @size-change="onSizeChange" @current-change="onCurrentChange" :current-page="pageNum" :page-sizes="[10, 15, 20, 25]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totolNum">
                </el-pagination>
            </div>

            <!--明细弹出窗-->
            <el-dialog title="费用明细" :visible.sync="costDetailDialogVisible" :before-close="close" width="1000px">
                <el-form :model="editform" :rules="rules" ref="editform"  label-width="120px">
                    <el-col :span="12">
                        <el-form-item label="客户名称" prop="areaName">
                            <!-- 客户名称 -->
                            <el-input v-model="editform.areaName" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系电话" prop="userTel">
                            <!-- 联系电话 -->
                            <el-input v-model="editform.userTel" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="月份" prop="month">
                            <!-- 月份 -->
                            <el-input v-model="editform.month" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" >
                        <el-form-item label="缴费完成情况" prop="payStatus">
                            <!-- 缴费完成情况 -->
                            <el-input disabled v-model="editform.payStatus"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="费用合计(元)" prop="amountTotal">
                            <!-- 费用合计(元) -->
                            <el-input v-model="editform.amountTotal" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="已缴金额(元)" prop="payAmount">
                            <!-- 已缴金额(元) -->
                            <el-input v-model="editform.payAmount" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="待缴金额(元)" prop="unpayAmount">
                            <!-- 待缴金额(元) -->
                            <el-input v-model="editform.unpayAmount" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-form>
                <el-col :span="24">
                    <h4>费用明细</h4>
                </el-col>
                <el-table :data="tableData1" border style="width: 100%">
                    <el-table-column prop="chargeZu" label="费用分组" align="center"></el-table-column>
                    <el-table-column prop="feeType" label="费用类型" align="center">
                    	<template slot-scope="scope">
                            <div v-dict:chargeType="scope.row.feeType">{{scope.row.feeType}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="amount" label="金额(元)" align="center"></el-table-column>
                    <el-table-column prop="chargeStatus" label="缴费状态" :formatter="dateFormatChargeStatus" align="center"></el-table-column>
                    <el-table-column prop="paymentMethod" label="缴费方式" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="chargeTime" label="缴费时间" align="center" width="160">
                        <template slot-scope="scope">
                            {{scope.row.chargeTime, 'yyyy-MM-dd hh:mm:ss' | dateFormat}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="remark" label="退回原因" align="center"></el-table-column>
                    <el-table-column prop="paymentMethod" label="操作" align="center" width="300">
                        <template slot-scope="scope">
                            <el-button type="text" v-if="scope.row.file_Id==='1' && scope.row.paymentMethod != '现场支付'" size="mini" @click="handleDownloadProof(scope.$index, scope.row)">凭证预览</el-button>
                            <el-button type="text" v-if="scope.row.chargeStatus==='3'" size="mini" @click="handleShowInfoEdit(scope.$index, scope.row, status='1', 1)">确认</el-button>
                            <el-button type="text" v-if="scope.row.chargeStatus==='0'|| scope.row.chargeStatus==='2'" size="mini" @click="handleShowInfoEdit(scope.$index, scope.row, status='1', 0)">确认收费</el-button>
                            <el-button type="text" v-if="scope.row.chargeStatus==='3' && scope.row.file_Id==='1'" size="mini" @click="handleShowInfoEdit(scope.$index, scope.row, status='2')">退回</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination v-if="renovatePagination" @size-change="handleListSizeChange" @current-change="handleListCurrentChange" :current-page="listPageNum" :page-sizes="[10, 15, 20, 25]" :page-size="listPageSize" layout="total, sizes, prev, pager, next, jumper" :total="listTotolNum">
                </el-pagination>
            </el-dialog>
            <!--凭证弹出窗-->
            <!-- <el-dialog   title="凭证" id="listDialog" class="f-12" :visible.sync="listDialogVisible" :before-close="close" width="1000px">
                <img :src="imageUrl" />
            </el-dialog> -->
            <!--退回提示框-->
            <el-dialog :close-on-click-modal="false"  title="退回" :visible.sync="showReturnDialog" width="30%">
                <div style="overflow: hidden;">
                    <el-form :rules="rules" label-width="80px">
                        <el-form-item label="退回原因" prop="remark">
                            <el-input type="textarea" :autosize="{minRows:5}" v-model="remark" maxlength="100" />
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="handleReturn()">确 定</el-button>
                    <el-button @click="showReturnDialog = false">取 消</el-button>
		        </span>
            </el-dialog>
            <!--确认收费提示框-->
            <el-dialog   title="提示" :visible.sync="deleteVisible" width="30%">
                <span>是否确认收费？</span>
                <el-table :data="payTableData" border style="width: 100%">
                    <el-table-column prop="area_name" label="客户名称" align="center"></el-table-column>
                    <el-table-column prop="month" label="月份" align="center"></el-table-column>
                    <el-table-column prop="unAmount" label="待缴金额" align="center"></el-table-column>
                </el-table>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="deleteRow()">确 定</el-button>
                    <el-button @click="deleteVisible = false">取 消</el-button>
                </span>
            </el-dialog>
            <!--确认收费提示框-->
            <el-dialog title="凭证预览" :visible.sync="imgVisible" width="40%">
                <img :src="imgSrc" width="98%">
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import { axiosHttp, dict, util, api } from '@/libs'
    import { formatDate } from '../../../static/js/date.js'
    export default {
        // 变量初始化定义
        data() {
            return {
                indexNumber: 1,
                imgSrc: '',
                imgVisible: false,
                payStatus: 0,
                payAmount: '',
				unpayAmount: '',
                imageUrl: '',
                onOff: false,
                listDialogVisible: false,
                showReturnDialog: false,
                returnParams: {},
                status: '',
                remark: '',
                listId: '',
                chargeZu: '',
                feeType: '',
                areaId: '',
                chargeTime: '',
                month: '',
                userTel: '',
				loading1:false,
                tableData: [],
                tableData1: [],
                payTableData: [],
                pageNum: 1,
                pageSize: 15,
                totolNum: 0,
                listPageNum: 1,
                listPageSize: 15,
                listTotolNum: 0,
                //刷新分页
                renovatePagination: true,
                searchForm: {},
                deleteVisible: false,
                circle: false,
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
            handleAddNode() {
            	this.clickFlag = 0;
                this.treeNode = {};
                this.treeNode.id = null;
                this.treeNode.upperId = this.rightClickNode.pId;
                if (this.treeNode.upperId == null) {
                    this.treeNode.upperId = '-1';
                }
                this.treeNode.rank = this.rightClickNode.rank;
                this.editTreeNodeVisible = true;
            },
            // 添加子级菜单
            handleAddSubNode() {
            	this.clickFlag = 1;
                this.treeNode = {};
                this.treeNode.id = null;
                this.treeNode.upperId = this.rightClickNode.id;
                if (this.rightClickNode.rank == 1) {
                    this.treeNode.rank = 2;
                } else if (this.rightClickNode.rank == 2) {
                    this.treeNode.rank = 3;
                }
                this.editTreeNodeVisible = true;
            },
            // 重命名
            handleRename() {
            	this.clickFlag = 2;
                this.treeNode = {};
                this.treeNode.id = this.rightClickNode.id;
                this.treeNode.upperId = this.rightClickNode.pId;
                this.treeNode.houseName = this.rightClickNode.name;
                this.treeNode.rank = this.rightClickNode.rank;
                this.editTreeNodeVisible = true;
            },
            // 树节点编辑
            editTreeNode(formrule) {
                this.$refs[formrule].validate((valid) => {
                	let rankNo = this.treeNode.rank;
                	let nodeName = this.treeNode.houseName;
                	let checkNameReg=/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
                	if(rankNo==1){
                		if(nodeName.length>20){
                			this.$refs[formrule].fields[0].error="园区名称长度超限！";
                			this.$message.error("园区名称长度不能大于20个字符");
                			return false;
                		}
                		if(nodeName.length<4){
                			//this.$refs[formrule].fields[0].error="园区名称长度不足！";
                			this.$message.error("园区名称长度不能小于4个字符");
                			return false;
                		}
                		if (checkNameReg.test(nodeName) == false){
                			//this.$refs[formrule].fields[0].error="园区名称不合法！";
                			this.$message.error("园区名称仅支持中文因为及数字");
                			return false;
						}
                	}else if(rankNo==2){
                		if(nodeName.length>10){
                			//this.$refs[formrule].fields[0].error="楼宇名称长度超限！";
                			this.$message.error("楼宇名称长度不能大于10个字符");
                			return false;
                		}
                		if(nodeName.length<2){
                			//this.$refs[formrule].fields[0].error="楼宇名称长度不足！";
                			this.$message.error("楼宇名称长度不能小于2个字符");
                			return false;
                		}
                		if (checkNameReg.test(nodeName) == false){
                			//this.$refs[formrule].fields[0].error="楼宇名称不合法！";
                			this.$message.error("楼宇名称仅支持中文因为及数字");
                			return false;
						}
                	}else if(rankNo==3){
                		if(nodeName.length<2){
                			//this.$refs[formrule].fields[0].error="楼层名称长度不足！"
                			this.$message.error("楼层名称长度不能小于2个字符");
                			return false;
                		}
                		if(nodeName.length>5){
                			//this.$refs[formrule].fields[0].error="楼层名称长度超限！";
                			this.$message.error("楼层名称长度不能大于5个字符");
                			return false;
                		}
                		let floorSta = nodeName.substr(0,1);
                		if(!(floorSta=="B" || !isNaN(floorSta))){
                			//this.$refs[formrule].fields[0].error="楼层名称不合法！";
                			this.$message.error("请以“B或数字+层”格式命名，如：一层（1层）、负一层（B1层）");
                			return false;
                		}
                		let floorStr = nodeName.substring(1,nodeName.length-1);
                		if(isNaN(floorStr)){
                			//this.$refs[formrule].fields[0].error="楼层名称不合法！";
                			this.$message.error("请以“B或数字+层”格式命名，如：一层（1层）、负一层（B1层）");
                			return false;
                		}
                		let floorEnd = nodeName.substr(nodeName.length-1,1);
                		if(floorEnd!="层"){
                			//this.$refs[formrule].fields[0].error="楼层名称不合法！";
                			this.$message.error("请以“B或数字+层”格式命名，如：一层（1层）、负一层（B1层）");
                			return false;
                		}

                	}
                    if (valid) {this.$httpPost('/manage/houseProperty/saveorupdate', {
                            id: this.treeNode.id,
                            remark: 'tree',
                            upperId: this.treeNode.upperId,
                            houseName: this.treeNode.houseName,
                            houseNo: this.treeNode.rank
                        }).then(res => {
                            this.editTreeNodeVisible = false;
                            if(this.clickFlag===0){
                            	if(parseInt(this.treeNode.rank)===1){
									this.loadTree();
								}else{
									this.loadTree(this.treeNode.upperId,1);
								}
                            }else if(this.clickFlag===1){
                            	this.loadTree(this.treeNode.upperId,1);
                            }else if(this.clickFlag===2){
                            	this.loadTree(this.treeNode.id,1);
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            loadTree(id,flag) {
                this.$http('get', '/manage/houseProperty/zTree', {}).then(res => {
                    this.resTreeNodes = res.data.body;
                    $.fn.zTree.init($("#resTree"), this.resSetting, this.resTreeNodes);
                    this.resTree = $.fn.zTree.getZTreeObj("resTree");
                    if(id){
                    	this.$forceUpdate()
						let firstNode;
						if(flag===1){
							firstNode = this.resTree.getNodeByParam("id", id, null);
						}
						this.resTree.expandNode(firstNode);
	                    this.resTree.selectNode(firstNode);
	                    this.upperId = firstNode.realId;
	                    this.treeRank = firstNode.rank;
					}else{
						var firstNode = this.resTree.getNodes()[0];
	                    this.resTree.selectNode(firstNode);
	                    this.upperId = this.resTree.getNodes()[0].realId;
	                    this.treeRank = firstNode.rank;
					}

                    this.loadTable();
                })
            },
            // 模糊搜索树
            findInTree() {
                if(this.treeKey == "") {
                    return
                }
                let nodes = this.resTree.getNodesByParamFuzzy('name', this.treeKey);
                if(nodes.length == 0) {
                    this.handleClear();
                    return
                }
                this.handleClear();

                let resTreeNodes = this.resTree.transformToArray(this.resTree.getNodes());
                for(var i = 0; i < nodes.length; i++) {
                    for(var j = 0; j < resTreeNodes.length; j++) {
                        if(resTreeNodes[j].id == nodes[i].id) {
                            for(var n = 0; n < resTreeNodes.length; n++) {
                                if(resTreeNodes[n].realId == resTreeNodes[j].pId) {
                                    this.resTree.expandNode(resTreeNodes[n], true, false, false);
                                    this.resTree.updateNode(resTreeNodes[n]);
                                }
                            }
                            resTreeNodes[j].font = {
                                'background': '#9abeff',
                                'color': '#333'
                            }
                            this.resTree.updateNode(resTreeNodes[j]);
                        }
                    }
                }
            },
            handleClear() {
                $.fn.zTree.init($("#resTree"), this.resSetting, this.resTreeNodes);
                this.resTree = $.fn.zTree.getZTreeObj("resTree");
                var firstNode = this.resTree.getNodes()[0]
                this.resTree.selectNode(firstNode)
                this.upperId = this.resTree.getNodes()[0].realId;
                this.loadTable();
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
            // 	if(treeNode.rank == 1) {
            //     	$("#m_add").html("添加园区");
            //     	$("#m_check").html("添加楼宇");
            //     }else if(treeNode.rank == 2) {
            //     	$("#m_add").html("添加楼宇");
            //     	$("#m_check").html("添加楼层");
            //     }else if(treeNode.rank == 3) {
            //     	$("#m_add").html("添加楼层");
            //     }
            //     if(!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
            //         this.resTree.cancelSelectedNode();
            //         this.showRMenu("root", event.clientX, event.clientY);

            //     } else if(treeNode && !treeNode.noR) {
            //         this.resTree.selectNode(treeNode);
            //         this.showRMenu("root", event.clientX, event.clientY);
            //     }

            //     if(treeNode.rank == 3) {
            //         if(!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
            //             this.resTree.cancelSelectedNode();
            //             this.showRMenu("node", event.clientX, event.clientY);

            //         } else if(treeNode && !treeNode.noR) {
            //             this.resTree.selectNode(treeNode);
            //             this.showRMenu("node", event.clientX, event.clientY);
            //         }
            //     }
            //     this.rightClickNode = treeNode;
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
            // toDelete(index, row) {
            //     if(row) {
            //         this.deleteIds = row.id;
            //         this.deleteVisible = true;
            //     } else {
            //         if (this.$refs.table.store.states.selection.length > 0) {
            //             this.deleteVisible = true;
            //         } else {
            //             this.$message.error('请至少选择一条数据');
            //         }
            //     }

            // },
            // 删除 行  包括单选和多选
            deleteRow() {
                axiosHttp.post('/manage/meterRegularChargeCollect/changeStatus', {
                    id: this.deleteIds,
                    // chargeZu: this.tableData.chargeZu,
                    // freeType: this.tableData.freeType
                }).then(res => {
                    // 插入消息
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
            handleconfirm(index, row) {
                this.deleteIds = row.id
                this.checkedArr.push(row)
                axiosHttp.post('/manage/meterRegularChargeCollect/getUnPayAmountByCompanyAndMonth', this.checkedArr).then(res => {
                    let area_id = res[0].area_id
                    let months = res[0].month
                    let unAmounts = res[0].unAmount
                    axiosHttp.post('/manage/meterRegularChargeDetail/updateSend',{
                        areaId: area_id,
                        month: months,
                        unAmount: unAmounts
                    }).then(res => {
                        this.$message.success('催缴成功!')
                    })
                })
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
            //确认收费
            confirmCharge(index, row) {
                this.payTableData = []

                if (index === 1) {
                    this.deleteIds = row.id
                    this.checkedArr.push(row)
                    axiosHttp.post('/manage/meterRegularChargeCollect/getUnPayAmountByCompanyAndMonth', this.checkedArr).then(res => {
                        this.payTableData = res
                        this.deleteVisible = true;
                        this.checkedArr = []
                        this.toDetails(index, row)
                    })
                } else {
                    if (this.$refs.table.store.states.selection.length > 0) {
                        let tansArr = []
                        this.checkedArr.forEach((item) => {
                            tansArr.push(item.chargeStatus)
                        })
                        if (tansArr.includes('1')) {
                            this.$message.error('请不要选择已缴清条目');
                            return
                        } else {
                            axiosHttp.post('/manage/meterRegularChargeCollect/getUnPayAmountByCompanyAndMonth', this.checkedArr).then(res => {
                                this.payTableData = res
                                this.deleteVisible = true;
                                this.checkedArr = []
                            })
                        }
                    } else {
                        this.$message.error('请至少选择一条数据');
                    }
                }

            },
            //开收款单
            openBilling(index, row) {
                this.selectedRow = row
                this.loadTableDialog = false
                this.detailListTr = []
                this.detailTotalTr = []
                this.costDetailDialogVisible = true
                this.firstAndLastList = util.getFirstAndLast(row.month)
                this.editform = {}
                if(row){
                    this.editform = Object.assign({},row);
                    this.handleListSrarch(row)
                }
            },
            // 明细查询
            handleListSrarch(row){
                this.listId = row.id
                this.chargeZu = row.chargeZu,
                this.feeType = row.feeType,
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
                    this.tableData1 = res.content
                    this.payAmount = res.payInfo.pay_amount;
					this.payStatus = res.payInfo.STATUS;
					this.unpayAmount = res.payInfo.unpay_amount;
                    this.$set(this.editform, 'payAmount', this.payAmount)
                    this.$set(this.editform, 'payStatus', this.payStatus)
                    this.$set(this.editform, 'unpayAmount', this.unpayAmount)
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
                    size: this.listPageSize,
                }).then(res => {
                    this.tableData1 = res.content
                    this.listTotolNum = Number(res.totalElements)
                })
            },
            // 确认/退回
            handleShowInfoEdit(index, row, status, payStatus){

                if (status == '1') {
                    // if (status == '0') {
                    //     this.payStatus = 0
                    // } else {
                    //     this.payStatus = 1
                    // }
                    if (row.chargeTime) {
                        this.chargeTime = row.chargeTime
                    } else {
                        this.chargeTime = formatDate(new Date(), "yyyy-MM-dd hh:mm");
                    }

                    axiosHttp.post('/manage/meterRegularChargeDetail/updateConfiremByDetail', {
                        id: this.listId,
                        chargeZu: this.chargeZu,
                        chargeTime: this.chargeTime,
                        feeType: this.feeType,
                        areaId : this.areaId,
                        month : this.month,
                        userTel : this.userTel,
                        page: 1 ,
                        size: this.pageSize,
                        payStatus: payStatus,
                        sid: row.id,
                        status: status,
                    }).then(res => {
                        this.tableData1 = res.content
                        this.costDetailDialogVisible = false
                    })
                } else if (status == '2')  {
                    this.returnParams = row
                    this.status = '2'
                    this.chargeTime = row.chargeTime
                    this.showReturnDialog = true
                }
            },
            // 确定退回
            handleReturn(){
                if(this.remark==""){
                    this.$message.error('请输入内容！');
                    return;
                }
                axiosHttp.post('/manage/meterRegularChargeDetail/updateConfiremByDetail', {
                    id : this.listId,
                    chargeZu: this.chargeZu,
                    chargeTime: this.chargeTime,
                    feeType: this.feeType,
                    areaId : this.returnParams.areaId,
                    month : this.returnParams.month,
                    userTel : this.returnParams.userTel,
                    page: this.pageNum,
                    size: this.pageSize,
                    sid: this.returnParams.id,
                    status: this.status,
                    remark: this.remark
                }).then(res=>{
                    this.tableData1 = res.content
                })
                this.returnParams = {}
                this.status = ''
                this.showReturnDialog = false
                this.$forceUpdate()
            },
            // 凭据预览
            handleDownloadProof(index, row){
                // this.listDialogVisible = true
                // axiosHttp.get('/manage/meterRegularChargeDetail/previewCertificates', {
                //     params: {
                //         id: row.id,
                //         responseType: "arraybuffer"
                //     }
                // }).then(response => {
                //     return 'data:image/png;base64,' + btoa(new Uint8Array(response.data).reduce((data,byte)=>data+String.fromCharCode(byte),''))
                // }).then(data => {
                //     this.imageUrl = data
                // })
                // axiosHttp.get('/manage/meterRegularChargeDetail/previewCertificates', { params: { id: row.id, responseType: "arraybuffer" } } ).then(res=>{
                //     this.imageUrl = URL.createObjectURL(new Blob([res]))
                // })
                // window.open('http://192.168.1.107:5000/api/manage/meterRegularChargeDetail/previewCertificates?id='+row.id, '_blank')
                // axiosHttp.get('/manage/meterRegularChargeDetail/previewCertificates', {
                //     headers: {
                //         'token': window.localStorage.csmpToken
                //     },
                //     params: {
                //        id: row.id
                //     }
                // }).then(res => {
                //     this.imgVisible = true
                //     this.imgSrc = 'http://192.168.1.107:5000/api/manage/meterRegularChargeDetail/previewCertificates?id=' + row.id
                // })
                this.imgVisible = true
                this.imgSrc = api.baseUrl + "/manage/meterRegularChargeDetail/previewCertificates?id=" + row.id

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
                if(this.treeNode) Object.assign(params,{treePath:this.treeNode.id})
				axiosHttp.post('/manage/meterRegularChargeCollect/find',params).then(res => {
					this.loading1=false;
                    this.tableData = res.content;
					this.totolNum = Number(res.totalElements)
				})

			},
			//同步数据
            // insert(){
            // 	axiosHttp.post('/manage/meterRegularChargeCollect/insert', {
            //     }).then(res => {
            //     },error => {
            //     })
            // },
             // 表格显示 状态渲染 (0：未缴费，1：已缴费)
            dateFormatChargeStatus: function(row, column, cellValue) {
                switch (row.chargeStatus){
                    case "0":
                        return "未缴费";
                    case "1":
                        return "已缴费";
                    case "2":
                        return "已退回";
                    case "3":
                        return "有凭证";
                    default:
                        return "";
                }
            },
              // 表格显示 状态渲染 (0：未缴清，1：已缴清)
            dateFormatChargeCompleteSituation: function(row, column, cellValue) {
                switch (row.chargeStatus){
                    case "0":
                        return "未缴清";
                    case "1":
                        return "已缴清";
                    default:
                        return "";
                }
            },
        },
        // 页面加载时执行
        created: function() {
            this.loadTree();
            // this.insert();
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
