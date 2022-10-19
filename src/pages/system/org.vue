
<template>
	<div class="wrap">

		<div class="subContent zr-row ">
				<div class="tableWrap">
					<div class="mgb10">
					<el-row>
                        <el-button type="primary" @click="add">创建</el-button>
                        <el-button type="primary" @click="copyCreat()">类似创建</el-button>
                        <el-button type="primary" @click="handleDelete()">删除</el-button>
                        <el-button type="primary" @click="loadTable()">刷新</el-button>
                        <el-button type="primary" @click="SearchTable()" style="float: right;" plain><i class="el-icon-search"></i>搜索</el-button>
                        <el-select v-model="searcher.customerIdentity" placeholder="客户类型" style="width:200px;float: right;">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="租户" value="租户"></el-option>
                            <el-option label="业主" value="业主"></el-option>
                        </el-select>
                        <el-input v-model="searcher.address" placeholder="联系地址" clearable style="width:200px;float: right;"></el-input>
                        <el-input v-model="searcher.name" placeholder="姓名" clearable style="width:200px;float: right;"></el-input>
					</el-row>
					</div>
					<el-table ref="table" stripe :data="tableData" style="width: 100%" v-loading ="loading1"
					 element-loading-text="拼命加载中"
					  element-loading-spinner="el-icon-loading"
					   element-loading-background="rbg(0,0,0,0.8)"  @selection-change="handleSelectionChange">
						<el-table-column type="selection"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" type="index" label="序号"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="customerIdentity" label="客户类型"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="name" label="姓名"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="sex" label="性别"></el-table-column>
						<!--<el-table-column :show-overflow-tooltip="true" width="120" prop="address" label="迁入区域"></el-table-column>-->
						<el-table-column :show-overflow-tooltip="true" width="120"  prop="phone" label="联系电话"></el-table-column>
						<!--<el-table-column :show-overflow-tooltip="true" prop="idCard" label="身份证号"></el-table-column>-->
						<el-table-column :show-overflow-tooltip="true" width="120" prop="birthday" label="出生日期" :formatter="dateFormat"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="politicalStatus" label="政治面貌"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" width="150" prop="address" label="联系地址"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" width="150" prop="workUnit" label="工作单位"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="status" label="状态"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" label="操作" width="240">
							<template slot-scope="scope">
								<el-button type="text" size="mini" @click="moveTo(scope.$index,scope.row)">客户迁入</el-button>
								<el-button type="text" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
								<el-button type="text" size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
								<el-button type="text" size="mini" @click="lookDetail(scope.$index, scope.row)">查看详情</el-button>
							</template>
						</el-table-column>
					</el-table>
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page=pageNum :page-sizes="[10, 15, 20, 25]" :page-size=pageSize layout="total, sizes, prev, pager, next, jumper" :total=totolNum>
			</el-pagination>
				</div>
		</div>
		<!-- 客户迁入-->
		<el-dialog   :close-on-click-modal="false"  title="客户迁入" :visible.sync="moveToVisible">
			<el-form ref="form" :model="form" :rules="checkinRules" label-width="80px">
				<el-form-item label="房间" prop="houseName">
					<el-input v-model="form.houseName" v-on:click.native="selectHouse" readonly></el-input>
				</el-form-item>
				<el-form-item label="迁入时间" prop="checkinTime">
					<el-col :span="11">
						<el-date-picker type="date" placeholder="选择日期" v-model="form.checkinTime" style="width: 100%;"></el-date-picker>
					</el-col>
				</el-form-item>
				<el-form-item label="迁入说明">
					<el-input type="textarea" v-model="form.remark"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="moveToSave('form')">保存</el-button>
					<el-button @click="moveToVisible = false">取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		<!-- 选择房产信息 -->
		<el-dialog   :close-on-click-modal="false"  title="房产树" :visible.sync="houseTreeVisible">
			<template>
				<el-tree :data="houseTreeData" show-checkbox ref="houseTree" node-key="id" :default-checked-keys="checkedKeys" :check-strictly=true :props="defaultProps">
				</el-tree>
				<el-button type="primary" style="float: right" @click="selectHouseSave()">确定</el-button>
				<el-button style="float: right;margin-right: 10px" @click="houseTreeVisible = false">取消</el-button>
			</template>
		</el-dialog>
		<!-- 编辑客户信息弹出窗 -->
		<el-dialog   :close-on-click-modal="false"  title="客户信息" :visible.sync="editTableVisible" style="width: 115%;">
			<el-form :inline="true" :model="household" :rules="houserules" ref="household" class="demo-form-inline" label-width="80px">
				<el-form-item label="客户姓名" prop="name">
					<el-input v-model="household.name" placeholder="客户名称"></el-input>
				</el-form-item>
				<el-form-item label="性别" prop="sex">
					<el-select v-model="household.sex" placeholder="性别" style="width: 200px;">
						<el-option selected label="男" value="男"></el-option>
						<el-option label="女" value="女"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="客户类型" prop="customerIdentity">
					<el-select v-model="household.customerIdentity" placeholder="客户类型" style="width: 200px;" @change="changeOwner">
						<el-option label="租户" key="租户" value="租户"></el-option>
						<el-option label="业主" key="业主" value="业主"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="联系电话" prop="phone">
					<el-input type="number" v-model="household.phone" placeholder="联系电话"></el-input>
				</el-form-item>
				<el-form-item label="身份证号" prop="idCard">
					<el-input v-model="household.idCard" placeholder="身份证号"></el-input>
				</el-form-item>
				<el-form-item label="出生日期" prop="birthday">
					<el-date-picker v-model="household.birthday" type="date" placeholder="出生日期" style="width: 200px;">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="政治面貌">
                    <el-select v-model="household.politicalStatus" style="width: 200px;" placeholder="政治面貌" >
                        <el-option v-for="item in politicalStatus" :key = item.code :label="item.name" :value="item.code"></el-option>
                    </el-select>
				</el-form-item>
				<el-form-item label="联系地址">
					<el-input v-model="household.address" placeholder="联系地址"></el-input>
				</el-form-item>
				<el-form-item label="工作单位">
					<el-input v-model="household.workUnit" placeholder="工作单位"></el-input>
				</el-form-item>
				<!--<el-form-item label="开户名称">-->
					<!--<el-input v-model="household.accountName" placeholder="开户名称"></el-input>-->
				<!--</el-form-item>-->
				<!--<el-form-item label="开户银行">-->
					<!--<el-input v-model="household.bankName" placeholder="开户银行"></el-input>-->
				<!--</el-form-item>-->
				<!--<el-form-item label="银行账号">-->
					<!--<el-input v-model="household.bankAccount" placeholder="银行账号"></el-input>-->
				<!--</el-form-item>-->
				<!--<el-form-item label="迁入日期" v-if="isOwner">-->
					<!--<el-date-picker v-model="household.checkinTime" type="date" placeholder="迁入日期" style="width: 200px;">-->
					<!--</el-date-picker>-->
				<!--</el-form-item>-->
				<!--<el-form-item label="迁出日期" v-if="isOwner">-->
					<!--<el-date-picker v-model="household.checkoutTime" type="date" placeholder="迁出日期" style="width: 200px;">-->
					<!--</el-date-picker>-->
				<!--</el-form-item>-->
                <el-form-item label="月租金" v-if="isTenant">
                    <el-input type="number" v-model="household.rentMonth" placeholder="月租金"></el-input>
                </el-form-item>
                <el-form-item label="起租日期" v-if="isTenant">
                    <el-date-picker v-model="household.checkinTime" type="date" placeholder="起租日期" style="width: 200px;">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="到期日期" v-if="isTenant">
                    <el-date-picker v-model="household.checkoutTime" type="date" placeholder="到期日期" style="width: 200px;">
                    </el-date-picker>
                </el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="save('household')">确 定</el-button>
				<el-button @click="editTableVisible = false">取 消</el-button>
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
		<el-dialog   :close-on-click-modal="false"  title="提示" :visible.sync="deleteVisible2" width="30%">
			<span>确定删除？</span>
			<span slot="footer" class="dialog-footer">
		    <el-button type="primary" @click="deleteRow2()">确 定</el-button>
		    <el-button @click="deleteVisible2 = false">取 消</el-button>
		  </span>
		</el-dialog>
		<!-- 查看详情-->
		<el-dialog   :close-on-click-modal="false"  title="详情" :visible.sync="detailVisible" style="width: 115%;">
			<el-tabs type="border-card">
				<el-tab-pane label="客户信息">
					<el-form :inline="true" ref="household" class="demo-form-inline" label-width="80px">
						<el-form-item label="客户姓名" prop="name">
							<el-input v-model="household.name" placeholder="业主名称" readonly></el-input>
						</el-form-item>
						<el-form-item label="性别">
							<el-input v-model="household.sex" placeholder="性别" readonly></el-input>
						</el-form-item>
						<el-form-item label="客户类型">
							<el-input v-model="household.customerIdentity" placeholder="客户类型" readonly></el-input>
						</el-form-item>
						<el-form-item label="联系电话">
							<el-input v-model="household.phone" placeholder="联系电话" readonly></el-input>
						</el-form-item>
						<el-form-item label="身份证号">
							<el-input v-model="household.idCard" placeholder="身份证号" readonly></el-input>
						</el-form-item>
						<el-form-item label="出生日期">
							<el-date-picker v-model="household.birthday" type="date" placeholder="出生日期" style="width: 200px;" readonly>
							</el-date-picker>
						</el-form-item>
						<el-form-item label="政治面貌">
							<el-input v-model="household.politicalStatus" placeholder="政治面貌" readonly></el-input>
						</el-form-item>
						<el-form-item label="联系地址">
							<el-input v-model="household.address" placeholder="联系地址" readonly></el-input>
						</el-form-item>
						<el-form-item label="工作单位">
							<el-input v-model="household.workUnit" placeholder="工作单位" readonly></el-input>
						</el-form-item>
						<!--<el-form-item label="开户名称">-->
							<!--<el-input v-model="household.accountName" placeholder="开户名称" readonly></el-input>-->
						<!--</el-form-item>-->
						<!--<el-form-item label="开户银行">-->
							<!--<el-input v-model="household.bankName" placeholder="开户银行" readonly></el-input>-->
						<!--</el-form-item>-->
						<!--<el-form-item label="银行账号">-->
							<!--<el-input v-model="household.bankAccount" placeholder="银行账号" readonly></el-input>-->
						<!--</el-form-item>-->
                        <el-form-item label="迁入日期" v-if="isOwner">
                            <el-date-picker v-model="household.checkinTime" type="date" placeholder="迁入日期" style="width: 200px;" readonly>
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="迁出日期" v-if="isOwner">
                            <el-date-picker v-model="household.checkoutTime" type="date" placeholder="迁出日期" style="width: 200px;" readonly>
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="月租金" v-if="isTenant">
                            <el-input type="number" v-model="household.rentMonth" placeholder="月租金" readonly></el-input >
                        </el-form-item>
                        <el-form-item label="起租日期" v-if="isTenant">
                            <el-date-picker v-model="household.checkinTime" type="date" placeholder="起租日期" style="width: 200px;" readonly>
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="到期日期" v-if="isTenant">
                            <el-date-picker v-model="household.checkoutTime" type="date" placeholder="到期日期" style="width: 200px;" readonly>
                            </el-date-picker>
                        </el-form-item>
					</el-form>
				</el-tab-pane>
				<el-tab-pane label="企业内部员工信息">
					<div style="margin: 15px;">
						<el-button type="primary" @click="addWorker()" plain>创建</el-button>
						<el-button type="primary" @click="copyCreat2()" plain>类似创建</el-button>
						<el-button type="primary" @click="handleDelete2()" plain>删除</el-button>
						<el-button type="primary" @click="SearchTable2()" style="float: right;" plain><i class="el-icon-search"></i>搜索</el-button>
						<el-input v-model="kw" placeholder="请输入员工姓名" clearable style="width:200px;float: right;"></el-input>
					</div>
					<el-table ref="table" stripe :data="tableData2" @selection-change="handleSelectionChange2">
						<el-table-column type="selection"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" type="index" label="序号"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="name" label="员工姓名"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="sex" label="性别"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="phone" label="联系电话"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="address" label="联系地址"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="department" width="100" label="所在部门"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="post" label="职务"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="entryTime" width="100" label="入职时间" :formatter="dateFormat"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" label="操作" width="240">
							<template slot-scope="scope">
								<el-button type="text" size="mini" @click="showWorker(scope.$index, scope.row)">编辑</el-button>
							</template>
						</el-table-column>
					</el-table>
					<div class="block" style="text-align: center;margin-top: 15px;">
						<el-pagination @current-change="handleCurrentChange2" :current-page.sync="current" :page-size="pageSize2" layout="total, prev, pager, next" :total=totolNum2>
						</el-pagination>
					</div>
				</el-tab-pane>
				<el-tab-pane label="房产信息">
					<!--<div style="margin: 15px;">-->
						<!--<el-button type="primary" @click="SearchTable3()" style="float: right;" plain><i class="el-icon-search"></i>搜索</el-button>-->
						<!--<el-input v-model="kw3" placeholder="请输入关键字" clearable style="width:200px;float: right;"></el-input>-->
					<!--</div>-->
					<el-table ref="table"  stripe :data="tableData3">
						<el-table-column :show-overflow-tooltip="true" type="index" label="序号"></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" prop="houseNo" label="房间编号"></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" prop="houseName" label="房间名称"></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" prop="houseStatus" label="房间状态"></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" prop="propertyCard" label="产权证号"></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" prop="makeHouseTime" label="交房日期" :formatter="dateFormat"></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" prop="houseArea" label="建筑面积"></el-table-column>
					</el-table>
					<div class="block" style="text-align: center;margin-top: 15px;">
						<el-pagination @current-change="handleCurrentChange3" :current-page.sync="current" :page-size="pageSize3" layout="total, prev, pager, next" :total=totolNum3>
						</el-pagination>
					</div>
				</el-tab-pane>
			</el-tabs>

		</el-dialog>
		<!-- 编辑员工信息框 -->
		<el-dialog   :close-on-click-modal="false"  title="员工信息" :visible.sync="workerDetail" style="width: 115%;">
			<el-form :inline="true" :model="worker" :rules="workrules" ref="worker" class="demo-form-inline" label-width="80px">
				<el-form-item label="员工姓名" prop="name">
					<el-input v-model="worker.name" placeholder="员工姓名"></el-input>
				</el-form-item>
				<el-form-item label="性别" prop="sex">
					<el-select v-model="worker.sex" placeholder="性别" style="width: 200px;">
						<el-option label="男" value="男"></el-option>
						<el-option label="女" value="女"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="联系电话" prop="phone">
					<el-input v-model="worker.phone" placeholder="联系电话"></el-input>
				</el-form-item>
				<el-form-item label="联系地址">
					<el-input v-model="worker.address" placeholder="联系地址"></el-input>
				</el-form-item>
				<el-form-item label="所在部门">
					<el-input v-model="worker.department" placeholder="所在部门"></el-input>
				</el-form-item>
				<el-form-item label="职务">
					<el-input v-model="worker.post" placeholder="职务"></el-input>
				</el-form-item>
				<el-form-item label="入职时间">
					<el-col :span="11">
						<el-date-picker type="date" placeholder="入职时间" v-model="worker.entryTime" style="width: 200px;"></el-date-picker>
					</el-col>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
		    <el-button type="primary" @click="saveWorkerInfo('worker')">确 定</el-button>
		    <el-button @click="workerDetail = false">取 消</el-button>
		  </span>
		</el-dialog>
		<!--   新建员工信息         -->

	</div>
</template>
<script>
	import { formatDate } from '../../../static/js/date.js'
	export default {
		data: function() {
			var checkphone = (rule, value, callback) => {
				if(!value) {
					return callback(new Error("手机号不能为空"));
				} else {
					const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
					if(reg.test(value)) {
						callback();
					} else {
						return callback(new Error("请输入正确手机号！"));
					}
				}
			};
			var checkCard = (rule, value, callback) => {
				if(!value) {
					return callback(new Error("身份证号不能为空"));
				} else {
					const reg = /(^\d{15}&)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
					if(reg.test(value)) {
						callback();
					} else {
						return callback(new Error("请输入正确身份证号！"));
					}
				}
			};
			return {
				loading:false,
				pageSize: 10,
				pageNum: 1,
				totolNum: 100,
				tableData: [],
				pageSize2: 10,
				pageNum2: 1,
				totolNum2: 100,
				tableData2: [],
				tableData3: [],
				pageSize3: 10,
				pageNum3: 1,
				totolNum3: 100,
				kw3:"",
				tenant: [],
				household: {},
				current: 1,
				form: {},
				houseTree:{},
				kw: '',
				moveid: '',
				houserules: {
					name: [{
							required: true,
							message: '请输入客户姓名',
							trigger: 'blur'
						},
						{
							min: 2,
							max: 15,
							message: '长度小于 10 个字符',
							trigger: 'blur'
						}
					],
					sex: [{
						required: true,
						message: "请选择性别",
						trigger: 'change'
					}],
					customerIdentity: [{
						required: true,
						message: "请选择客户类型",
						trigger: 'change'
					}],
					phone: [{
						required: true,
						validator: checkphone,
						trigger: 'blur'
					}],
					idCard: [{
						required: true,
						validator: checkCard,
						trigger: 'blur'
					}],
					birthday: [{
						required: true,
						message: "请选择出生日期",
						trigger: 'blur'
					}],
				},
				workrules: {
					name: [{
							required: true,
							message: '请输入员工姓名',
							trigger: 'blur'
						},
						{
							min: 2,
							max: 15,
							message: '长度在 2 到 15 字符',
							trigger: 'blur'
						}
					],
					sex: [{
						required: true,
						message: "请选择性别",
						trigger: 'blur'
					}],
					phone: [{
						required: true,
						validator: checkphone,
						trigger: 'blur'
					}],
				},
				editTableVisible: false,
				deleteVisible: false,
				deleteVisible2: false,
				moveToVisible: false,
				detailVisible: false,
				workerDetail: false,
				cpnId: '',
				worker: [],
				deleteIds: '',
				deleteIds2: '',
				checkedArr: [],
				checkedArr2: [],
				houseTreeVisible: false,
				houseTreeData: [],
				checkedKeys: [],
				defaultProps: {
					children: 'children',
					label: 'label'
				},
                searcher: {},
                isOwner: false,
                isTenant: false,
                politicalStatus: [],
                checkinRules: {
                    houseName: [
                        {
                            required: true,
                            message: '请选择房间',
                            trigger: 'change'
                        }
                    ],
                    checkinTime: [
                        {
                            required: true,
                            message: '请选择迁入时间',
                            trigger: 'blur'
                        }
                    ],
                }
			}
		},
		created() {
			this.loadTable();
			this.$httpPost('/manage/houseProperty/tree').then(res => {
				let data = res.data.body;
				this.houseTreeData = data;
			}, function(response) {

			});
            this.$http('post', '/system/user/dict/findListByType', {
                typekey: "politicalStatus",
            }).then(res => {
                this.politicalStatus = res.data.body;
            });
		},
		watch: {
			editTableVisible(val){
				!val&&setTimeout(() => {
					this.$refs['household'].resetFields();
				},0);
			},
            houseTreeVisible(val){
                !val&&setTimeout(() => {
                    this.$refs.houseTree.setCheckedKeys([]);
				},0);
			},
			workerDetail(val){
				!val&&setTimeout(() => {
					this.$refs['worker'].resetFields();
				},0);
			},
            moveToVisible(val){
				!val&&setTimeout(() => {
					this.$refs['form'].resetFields();
				},0);
			},
		},
		methods: {
            changeOwner() {
                if (this.household.customerIdentity == '租户') {
                    this.isTenant = true;
                    this.isOwner = false;
                } else if (this.household.customerIdentity == '业主') {
                    this.isTenant = false;
                    this.isOwner = true;
                }
            },
			loadTable() {
				this.loading1=true;
				this.$http('post', '/manage/customerInfo/list', {
					page: this.pageNum,
					size: this.pageSize
				}).then(res => {
					this.loading1 = false;
					this.tableData = res.data.body.content;
					this.totolNum = Number(res.data.body.totalElements)
				})
			},
			SearchTable() {
				this.$http('post', '/manage/customerInfo/list', {
					name: this.searcher.name,
					address: this.searcher.address,
                    customerIdentity: this.searcher.customerIdentity,
					page: 1,
					size: this.pageSize
				}).then(res => {
					this.tableData = res.data.body.content;
					this.totolNum = Number(res.data.body.totalElements)
				})
			},
			reloadForm(id, isSave) {
				this.$httpGet('get', '/manage/customerInfo/findEntityById', {
					id: id
				}).then(res => {
					this.household = res.data.body;
                    this.changeOwner();
					if(isSave == true) {
						this.household.id = '';
					}
				});
			},
			reloadForm2(id, isSave) {
				this.$httpGet('get', '/manage/customerEmployee/findEntityById', {
					id: id
				}).then(res => {
					this.worker = res.data.body;
					if(isSave == true) {
						this.worker.id = '';
					}
				});
			},
			handleEdit(index, row) {
				this.reloadForm(row.id, false);
				this.editTableVisible = true;
			},
			lookDetail(index, row) {
				this.reloadForm(row.id, false);
				this.cpnId = row.id;
				this.loadTable2(row.id);
				this.loadTable3();
			},
			loadTable2(ownerId) {
				this.$http('post', '/manage/customerEmployee/list', {
					customerInfoId: ownerId,
					page: this.pageNum2,
					size: this.pageSize2,
				}).then(res => {
					this.detailVisible = true;
					this.tableData2 = res.data.body.content;
					this.totolNum2 = Number(res.data.body.totalElements);
				});
			},
			loadTable3() {
				this.$http('post', '/manage/customerCheckin/findEntity', {
					customerId: this.cpnId,
				}).then(res => {
					if(res.data.body == null){
						this.tableData3 = [];
                        this.totolNum3 = 0;
					}else{
						this.loadTable4(res.data.body.houseId);
					}

				});
			},
			loadTable4(ownerId) {
				this.$http('post', '/manage/houseProperty/findPageByIds', {
					ids: ownerId,
					page: this.pageNum3,
					size: this.pageSize3,
				}).then(res => {
					this.detailVisible = true;
					this.tableData3 = res.data.body.content;
					this.totolNum3 = Number(res.data.body.totalElements);
				});
			},
			add() {
				this.household = {};
                this.isTenant = false;
                this.isOwner = false;
				this.editTableVisible = true;
			},
			handleDelete(index, row) {
                if(row) {
                    this.deleteIds = row.id;
                    this.deleteVisible = true;
                } else {
                    if (this.deleteIds.length > 0) {
                        this.deleteVisible = true;
                    } else {
                        this.$message.error('请先选择客户');
                    }
                }
			},
			deleteRow() {
				this.$httpGet('get', '/manage/customerInfo/del', {
					id: this.deleteIds
				}).then(res => {
					this.deleteVisible = false;
					this.loadTable()
				})
			},
			handleDelete2(index, row) {
				this.deleteVisible2 = true;
				if(row) {
					this.deleteIds2 = row.id;
				}
			},
			deleteRow2() {
				this.$httpGet('get', '/manage/customerEmployee/del', {
					id: this.deleteIds2
				}).then(res => {
					this.deleteVisible2 = false;
					this.loadTable2(this.cpnId);
				})
			},
			save(formrule) {
				this.$refs[formrule].validate((valid) => {
					if(valid) {
						this.$http('post', '/manage/customerInfo/saveorupdate', {
                            status: this.household.status,
							accountName: this.household.accountName,
							address: this.household.address,
							bankAccount: this.household.bankAccount,
							bankName: this.household.bankName,
							id: this.household.id,
							birthday: this.household.birthday,
							idCard: this.household.idCard,
							name: this.household.name,
							phone: this.household.phone,
							politicalStatus: this.household.politicalStatus,
							sex: this.household.sex,
							workUnit: this.household.workUnit,
							customerIdentity: this.household.customerIdentity,
							checkinTime: this.household.checkinTime,
							checkoutTime: this.household.checkoutTime,
							rentMonth: this.household.rentMonth,
						}).then(res => {
						    if (res.data.code == 0) {
                                this.editTableVisible = false;
                                this.loadTable();
                            }
						})
					} else {
						return false;
					}
				});
			},
			handleSizeChange(val) {
				this.pageSize = val;
				this.loadTable();
			},
			handleCurrentChange(val) {
				this.pageNum = val;
				this.loadTable();
			},
			handleCurrentChange2(val) {
				this.pageNum2 = val;
				this.loadTable2(this.cpnId);
			},
			handleCurrentChange3(val) {
				this.pageNum3 = val;
				this.loadTable3(this.cpnId);
			},
			handleSelectionChange(val) {
				this.checkedArr = val;
				let idsArr = []
				for(var i = 0; i < val.length; i++) {
					idsArr.push(val[i].id)
				}
				this.deleteIds = idsArr.join(',')
			},
			handleSelectionChange2(val) {
				this.checkedArr2 = val;
				let idsArr = []
				for(var i = 0; i < val.length; i++) {
					idsArr.push(val[i].id)
				}
				this.deleteIds2 = idsArr.join(',')
			},
			copyCreat() {
				if(this.checkedArr.length > 1 || this.checkedArr.length == 0) {
					this.$message.error('只能类似创建一条');
				} else {
					this.reloadForm(this.checkedArr[0].id, true);
					this.editTableVisible = true;
				}
			},
			copyCreat2() {
				if(this.checkedArr2.length > 1 || this.checkedArr2.length == 0) {
					this.$message.error('只能类似创建一条');
				} else {
					this.reloadForm2(this.checkedArr2[0].id, true);
					this.workerDetail = true;
				}
			},
			selectHouse() {
				this.houseTreeVisible = true;
				this.$nextTick(res => {
					this.$refs.houseTree.setCheckedNodes([]);
				})
			},
			selectHouseSave() {
				this.houseTreeVisible = false;
				this.form.houseId = this.$refs.houseTree.getCheckedKeys().toString();
				var houseName = '';
				var checkedNodes = this.$refs.houseTree.getCheckedNodes();
				if (checkedNodes != null && checkedNodes.length > 0) {
                    for (var i = 0; i < checkedNodes.length; i++) {
                        if (i != 0) {
                            houseName += ',';
                        }
                        houseName += checkedNodes[i].label;


                    }
                }
                this.form.houseName = houseName;
			},
			moveTo(index, row) {
				this.form = {};
				this.household = row;
				this.moveToVisible = true;
			},
			moveToSave(rules) {
                this.$refs[rules].validate( (valid) => {
                    if (valid) {
                        this.$http('post', '/manage/customerCheckin/saveorupdate', {
                            houseId: this.form.houseId,
                            customerId: this.household.id,
                            checkinType: this.household.customerIdentity,
                            remark: this.form.remark,
                            checkinTime: this.form.checkinTime,
                        }).then(res => {
                            this.moveToVisible = false;
                            this.loadTable();
                        })
                    } else {
                        return false;
                    }
                });
			},
			showWorker(index, row) {
				this.reloadForm2(row.id, false);
				this.workerDetail = true;
			},
			saveWorkerInfo(formrule) {
				this.$refs[formrule].validate((valid) => {
					if(valid) {
						this.$http('post', '/manage/customerEmployee/saveorupdate', {
							customerInfoId: this.cpnId,
							id: this.worker.id,
							name: this.worker.name,
							sex: this.worker.sex,
							phone: this.worker.phone,
							address: this.worker.address,
							department: this.worker.department,
							post: this.worker.post,
							entryTime: this.worker.entryTime,
						}).then(res => {
							this.workerDetail = false;
							this.loadTable2(this.cpnId);
						})
					} else {
						return false;
					}
				});
			},
			addWorker() {
				this.worker = {};
				this.workerDetail = true;
			},

			SearchTable2() {
				this.$http('post', '/manage/customerEmployee/list', {
					name: this.kw,
					customerInfoId: this.cpnId,
					page: this.pageNum2,
					size: this.pageSize2,
				}).then(res => {
					this.detailVisible = true;
					this.tableData2 = res.data.body.content;
					this.totolNum2 = Number(res.data.body.totalElements);
				});
			},
			SearchTable3() {
				this.$http('post', 'findPageByIds', {
					name: this.kw3,
					ids: this.cpnId,
					page: this.pageNum3,
					size: this.pageSize3,
				}).then(res => {
					this.detailVisible = true;
					this.tableData3 = res.data.body.content;
					this.totolNum3= Number(res.data.body.totalElements);
				});
			},
			//时间格式化
			dateFormat(row, column, cellValue) {
				if(cellValue == null) {
					return "";
				} else {
					let date = new Date(parseInt(cellValue));
					return formatDate(date, "yyyy-MM-dd");
				}
			},

		}
	}
</script>

<style scoped>
	.table_content {
		height: 100%;
		margin: 20px;
		top: 0;
		bottom: 0;
		right: 0;
	}
</style>
