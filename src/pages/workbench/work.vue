<template>
	<div class="wrap">

	<div class="subContent zr-row">
		<el-tabs v-model="tabSelected" type="card" @tab-click="handleClick">
			<el-tab-pane label="待办任务" name="first">
				<div class="tableWrap" v-if="tabSelected === 'first'">
					<el-table ref="table" stripe :data="tableData" v-loading ="loading1"
						element-loading-text="拼命加载中"
						element-loading-spinner="el-icon-loading"
						element-loading-background="rbg(0,0,0,0.8)">
						<!--<el-table-column type="selection" width="60"></el-table-column>-->
						<el-table-column :show-overflow-tooltip="true" type="index" width="50" label="序号"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" width="150" prop="beforeOperatePerson" label="发送人"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="serveCode" label="内容">
							<template slot-scope="scope">
								<span type="text" style="color: #5677FC;    font-weight: 500;    font-size: 14px;    text-align: center; line-height: 1;
								white-space: nowrap;
								cursor: pointer;
								cursor: pointer;" size="smart" @click="handleEdit(scope.row)">【{{scope.row.serveType}}】 您有新的待办任务，业务单号
									<{{scope.row.serveCode}}>,请及时办理，谢谢！</span>
							</template>
						</el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="serveStatus" :formatter="state" label="状态"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" width="160" prop="updateTime" :formatter="dateFormat" label="发送时间"></el-table-column>
					</el-table>
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page=pageNum :page-sizes="[10, 15, 20, 25]" :page-size=pageSize layout="total, sizes, prev, pager, next, jumper" :total=totolNum>
					</el-pagination>
				</div>
			</el-tab-pane>
			<el-tab-pane label="已办任务" name="second">
				<div class="tableWrap" v-if="tabSelected === 'second'">
					<el-table ref="table" stripe :data="tableData2" v-loading ="loading2"
						element-loading-text="拼命加载中"
						element-loading-spinner="el-icon-loading"
						element-loading-background="rbg(0,0,0,0.8)">
						<!--<el-table-column type="selection" width="60"></el-table-column>-->
						<el-table-column :show-overflow-tooltip="true" type="index" width="50" label="序号"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" width="150" prop="beforeOperatePerson" label="发送人"></el-table-column>
						<!--<el-table-column :show-overflow-tooltip="true" prop="serveCode" @click="openDaveDoneDetail(scope.row) :formatter="content1" label="内容"></el-table-column>-->
						<el-table-column :show-overflow-tooltip="true" prop="serveCode" label="内容">
							<template slot-scope="scope">
								<span type="text" style="color: #5677FC;    font-weight: 500;    font-size: 14px;    text-align: center; line-height: 1;
								white-space: nowrap;
								cursor: pointer;
								cursor: pointer;" size="smart" @click="openDaveDoneDetail(scope.row)">【{{scope.row.serveType}}】 您的业务单号
									<{{scope.row.serveCode}}>,已处理完成，谢谢！</span>
							</template>
						</el-table-column>
						<!--<el-table-column :show-overflow-tooltip="true" width="150" prop="serveStatus" :formatter="state" label="状态"></el-table-column>-->
						<el-table-column :show-overflow-tooltip="true" prop="updateTime" :formatter="dateFormat1" label="发送时间"></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" label="操作" width="180">
                            <template slot-scope="scope">
                                <el-button type="text" @click="serveDetail(scope.row)">查看</el-button>
                            </template>
                        </el-table-column>
					</el-table>
					<el-pagination @size-change="handleSizeChange2" @current-change="handleCurrentChange2" :current-page=pageNum :page-sizes="[10, 15, 20, 25]" :page-size=pageSize layout="total, sizes, prev, pager, next, jumper" :total=totolNum2>
					</el-pagination>
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>
        <el-dialog   title="服务" :visible.sync="serveorderDialog" @close="handleCancle" :params="params" width="900px">
            <modal :params = serveorderParam :updateTem ="true" v-if="serveorderShow" ></modal>
        </el-dialog>
        <el-dialog   title="服务" :visible.sync="haveDoneDetail" @close="haveDoneDetailCancle" :params="haveDoneDetailParams" width="900px">
            <havedonedetail :haveDoneDetailParams=haveDoneDetailParam :updateTem ="true" v-if="haveDoneDetailShow" ></havedonedetail>
        </el-dialog>
        <el-dialog   title="服务进度" :visible.sync="serveDetailVisible" width="900px">
            <div class="zi-g-1 zr-column-center">
                <div class="w-100">
                    <el-steps direction="vertical" class="m-b-20 w-100">
                        <el-step v-for="(item, index) in serviceLogList" :description="item.operationContent" :key="index" :title="item.createTime | dateFormat"></el-step>
                    </el-steps>
                </div>
            </div>
        </el-dialog>
    </div>
</template>


<script>
	import { formatDate } from '../../../static/js/date.js'
	//import {ERR_MSG, MENUID, URL} from "../../assets/constants/constant-common";
	//import utils from "../../assets/util/utils";
	//import {mixin}from '../../assets/util/mixin';
	import HaveDoneDetail from "./../dialog/HaveDoneDetail.vue"
	import Modal from "./../dialog/Modal.vue"
	export default {
		components: {
			"modal":Modal,
			"havedonedetail":HaveDoneDetail
 		 },
		data() {
			return {
				loading1:false,
				loading2:false,
				tableData: [],
				tableData2: [],
				tabSelected: "first",
				pageNum: 1,
				pageNum2: 1,
				serveParPerson: [],
				pageSize: 10,
				pageSize2: 10,
				totolNum: 0,
				totolNum2: 0,
                params:{},
                serveorderDialog:false,
                serveorderParam:[],
                serveorderShow:false,
                haveDoneDetail:false,
                haveDoneDetailParams:{},
                haveDoneDetailParam:[],
                haveDoneDetailShow:false,
                serveDetailVisible:false,
                serviceLogList:[],
			}

		},
		created: function() {
			this.loadTable();
		},
		// mixins: [mixin],
		methods: {
			//初始化表格
			loadTable() {
				this.loading1 = true;
				this.$httpPost('/serveorder/serve/info/findServices', {
					"page": this.pageNum,
					"size": this.pageSize,
                    // "serveType":"GPS"
                    // 201809411752181
				}).then(res => {
					if(res) {
						this.tableData = res.data.body.content;
						this.totolNum = Number(res.data.body.totalElements)
					}
					this.loading1 = false
				}, function(response) {
					this.loading1 = false
				});
			},
			loadHaveDone() {
				this.loading2 = true;
				this.$httpPost('/serveorder/serve/info/findByHaveDone', {
					"page": this.pageNum2,
					"size": this.pageSize2,
                    // "serveType":"TXYWL"
				}).then(res => {
					this.loading2 = false;
					if(res.data.body){
						this.tableData2 = res.data.body.content;
						this.totolNum2 = Number(res.data.body.totalElements);
					}
//					this.createTime1 = res.data.body.content.createTime;

				}, function(response) {

				});
			},
			handleClick(tab, event) {
				let name = tab._props.name
				if(name === "second") {
					this.loadHaveDone()
				}
			},
			//时间格式化
			dateFormat(row, column, cellValue) {
				let date = new Date(parseInt(row.updateTime));
				if(date == undefined) {
					return "";
				}
				return formatDate(date, "yyyy-MM-dd hh:mm");
			},
				//时间格式化
			dateFormat1(row, column, cellValue) {
				let date = new Date(parseInt(row.updateTime));
				if(date == undefined) {
					return "";
				}
				return formatDate(date, "yyyy-MM-dd hh:mm");
			},
			state(row, column, cellValue) {

				if(row.serveStatus === "1001") {
					return "待受理";
				} else if(row.serveStatus === "1002") {
					return "待核实";
				} else if(row.serveStatus === "1003") {
					return "待支付";
				} else if(row.serveStatus === "1004") {
					return "待派工";
				} else if(row.serveStatus === "1005") {
					return "待办结";
				} else if(row.serveStatus === "1006") {
					return "已办结";
				} else if(row.serveStatus === "1007") {
					return "已评价";
				} else if(row.serveStatus === "1008") {
					return "重新派工";
				} else if(row.serveStatus === "1009") {
					return "取消服务";
				} else {
					return null;
				}

			},

			content(row, column) {
				let content = "【" + row.serveType + "】 您有新的待办任务，业务单号<" + row.serveCode + ">,请及时办理，谢谢！"
				return content;
			},
			content1(row, column) {
				let content = "【" + row.serveType + "】 您的业务单号<" + row.serveCode + ">,已处理完成，谢谢！"
				return content;
			},
			//页码数改变
			handleSizeChange(val) {
				this.pageSize = val;
				this.loadTable();
			},
			//页码改变
			handleCurrentChange(val) {
				this.pageNum = val;
				this.loadTable();
			},

			//页码数改变
			handleSizeChange2(val) {
				this.pageSize2 = val;
				this.loadHaveDone();
			},
			//页码改变
			handleCurrentChange2(val) {
				this.pageNum2 = val;
				this.loadHaveDone();
			},
			handleEdit(row) {
                this.serveorderParam = row;
                this.serveorderDialog= true;
                this.serveorderShow = true

			},
            handleCancle(){
                this.serveorderShow = false;
                this.pageNum=1;
                this.pageSize=10;
                this.loadTable();
            },
            openDaveDoneDetail(row){
            	this.haveDoneDetailParam = row;
                this.haveDoneDetail= true;
                this.haveDoneDetailShow = true
            },
             haveDoneDetailCancle(){
                this.haveDoneDetailShow = false;
                this.pageNum=1;
                this.pageSize=10;
                this.loadTable();
            },
            serveDetail(row){
                this.serveDetailVisible = true;
                this.$httpPost('/serveorder/serve/log/findLogByCode', {
                    serveCode: row.id
                }).then(res => {
                    this.serviceLogList = res.data.body;
                    for(let i = 0;i<res.data.body.length;i++){
                        if(res.data.body[i].serveStatus=='1001'){
                            res.data.body[i].operationContent = row.customerName+"进行预约服务！";
                        }else if(res.data.body[i].serveStatus=='1002'){
                            res.data.body[i].operationContent = "客服:"+res.data.body[i].createName+"已派工至班组长！";
                        }else if(res.data.body[i].serveStatus=='1003'){
                            res.data.body[i].operationContent = "等待客户支付！";
                        }else if(res.data.body[i].serveStatus=='1004'){
                            res.data.body[i].operationContent = "班组长已确认！";
                        }else if(res.data.body[i].serveStatus=='1005'){
                            res.data.body[i].operationContent = "班组长:"+res.data.body[i].createName+"派工至负责人！";
                        }else if(res.data.body[i].serveStatus=='1006'){
                            res.data.body[i].operationContent = "负责人:"+res.data.body[i].createName+"服务已办结";
                        }else if(res.data.body[i].serveStatus=='1007'){
                            res.data.body[i].operationContent = "客户已对此次服务进行了评价！";
                        }else if(res.data.body[i].serveStatus=='1008'){
                            res.data.body[i].operationContent = "负责人:"+res.data.body[i].createName+"进行了重新派工操作！";
                        }else if(res.data.body[i].serveStatus=='1009'){
                            res.data.body[i].operationContent = res.data.body[i].createName+"取消了服务！";
                        }
                    }


                }, function(response) {

                });
            }
		}
	}
</script>
<style>
	.el-button--text{
		color: #5677FC;
	}
</style>

