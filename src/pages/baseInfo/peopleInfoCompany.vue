<template>
	<div class="wrap">
		<div class="subContent">
			<div class="tableWrap">
				<!--搜索功能-->
				<el-form :inline="true" :model="searchForm" class="demo-form-inline zr-row-scatter">
					<div>
						<el-button type="primary" @click="toAdd()">新增员工</el-button>
<!--						<el-button type="primary" @click="search()">导入</el-button>-->
<!--						<el-button type="primary" @click="search()">导出</el-button>-->
						<el-button type="primary" @click="toDelete()">批量删除</el-button>
					</div>
					<div>
						<el-form-item label="姓名">
							<el-input v-model="searchForm.name" clearable placeholder="姓名"></el-input>
						</el-form-item>
						<el-form-item>
							<el-input placeholder="关键字" v-model="searchForm.keyword" clearable></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="search('param')">搜索</el-button>
						</el-form-item>
					</div>
				</el-form>
				<!--数据表格渲染-->
				<el-table ref="table" stripe :data="tableData" style="width: 100%" @selection-change="onSelect">
					<el-table-column type="selection" width="60" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" type="index" label="序号" width="50" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="name" label="姓名" align="center">
	                    <template slot-scope="scope">
	                        <el-button type="text" size="smart" @click="lookDetail(scope.$index, scope.row)">{{scope.row.name}}</el-button>
	                    </template>
	                </el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="department" label="所在部门" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="post" label="职务" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="sex" label="性别" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="mobile" label="手机号码" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="job" label="是否在职" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" label="操作" width="180" align="center">
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
			<!-- 查看详情-->
	        <el-dialog   title="查看详情" :visible.sync="detailVisible" width="900px">
	            <el-form :model="formInline" :rules="rules" ref="formInline" label-width="80px" class="w-80" style="margin:0 auto">
					<div class="zr-row-scatter">
						<el-form-item label="姓名" prop="name">
							<el-input v-model="formInline.name" disabled></el-input>
						</el-form-item>
						<el-form-item label="性别" prop="sex">
		                    <el-select v-model="formInline.sex" placeholder="性别" disabled>
		                        <el-option label="男" value="男"></el-option>
		                        <el-option label="女" value="女"></el-option>
		                    </el-select>
		               	</el-form-item>
					</div>
					<el-col :span="24">
						<el-form-item label="手机号码" prop="mobile">
							<el-input v-model="formInline.mobile" disabled></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="身份证号" prop="certNo">
							<el-input v-model="formInline.certNo" disabled></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="所属企业" prop="companyId">
							<el-select v-model="formInline.companyId" placeholder="所属企业" class="w-100" @change="companyChange" disabled>
		                        <el-option v-for="item in companys" :key= item.id :label="item.name" :value="item.id"></el-option>
		                   </el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="所在部门" prop="department">
							<el-input v-model="formInline.department" disabled></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="职位" prop="post">
							<el-input v-model="formInline.post" disabled></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="所属区域" prop="areaId">
							<el-select v-model="formInline.areaId" placeholder="所属区域" style="width: 420px;" disabled>
		                        <el-option v-for="item in houseFunctionOption" :key = item.areaId :label="item.areaName" :value="item.areaId"></el-option>
		                   </el-select>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="是否在职" prop="job">
		                    <el-select v-model="formInline.job" placeholder="是否在职" style="width: 200px;" disabled>
		                        <el-option label="是" value="是"></el-option>
		                        <el-option label="否" value="否"></el-option>
		                    </el-select>
		                </el-form-item>
					</el-col>
				</el-form>
	        </el-dialog>
			<!--编辑弹出窗-->
			<el-dialog   :title="editform.id?'编辑':'新增员工'" :visible.sync="editTableVisible" width="50%">
				<el-form :model="editform" :rules="rules" ref="editform" label-width="80px" class="w-80" style="margin:0 auto">
					<div class="zr-row-scatter">
						<el-form-item label="姓名" prop="name">
							<el-input v-model="editform.name"></el-input>
						</el-form-item>
						<el-form-item label="性别" prop="sex">
		                    <el-select v-model="editform.sex" placeholder="性别">
		                        <el-option label="男" value="男"></el-option>
		                        <el-option label="女" value="女"></el-option>
		                    </el-select>
		               	</el-form-item>
					</div>
					<el-col :span="24">
						<el-form-item label="手机号码" prop="mobile">
							<el-input v-model="editform.mobile"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="身份证号" prop="certNo">
							<el-input v-model="editform.certNo"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="所属企业" prop="companyId">
							<el-select v-model="editform.companyId" placeholder="所属企业" class="w-100" @change="companyChange">
		                        <el-option v-for="item in companys" :key= item.id :label="item.name" :value="item.id"></el-option>
		                   </el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="所在部门" prop="department">
							<el-input v-model="editform.department"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="职位" prop="post">
							<el-input v-model="editform.post"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="所属区域" prop="areaId">
							<el-select v-model="editform.areaId" placeholder="所属区域" class="w-100" >
		                        <el-option v-for="item in houseFunctionOption" :key= item.areaId :label="item.areaName" :value="item.areaId"></el-option>
		                   </el-select>
						</el-form-item>
					</el-col>
					<el-col :span="24" v-if="editform.id">
						<el-form-item label="是否在职" prop="job">
		                    <el-select v-model="editform.job" placeholder="是否在职" style="width: 200px;">
		                        <el-option label="是" value="是"></el-option>
		                        <el-option label="否" value="否"></el-option>
		                    </el-select>
		                </el-form-item>
					</el-col>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button type="primary" @click="save('editform')">确 定</el-button>
					<el-button @click="close('editform')">取 消</el-button>
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
	export default {
		// 变量初始化定义
		data() {
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
				//所属企业集合
				companys:[],
				tableData: [],
				pageNum: 1,
				pageSize: 15,
				totolNum: 100,
				//刷新分页
				renovatePagination: true,
				searchForm: {},
				editTableVisible: false,
				deleteVisible: false,
				detailVisible: false,
				editform: {},
				deleteIds: '',
				checkedArr: [],
				houseFunctionOption: [],
				formInline: {
                    user: '',
                    region: '',
                    value1: '',
                    value2: '',
                },
				// 校验
				rules: {
					sex: [{
						required: true,
						message: '请选择性别',
						trigger: 'change'
					}],
					name: [{
							required: true,
							message: '请输入姓名',
							trigger: 'blur'
						},
						{
							min: 2,
							max: 10,
							message: '姓名长度不能大于 10 个字符',
							trigger: 'blur'
						}
					],
					mobile: [{
						required: true,
						validator: checkphone,
						trigger: 'blur'
					}],
					// certNo: [{
					// 	required: false,
					// 	validator: checkCard,
					// 	trigger: 'blur'
					// }],
					companyId:[
						{
							required:true,
							message:'请选择所属企业',
							trigger: 'change'
						}
					],
					areaId: [{
                        required: true,
                        message: '请选择所属区域',
                        trigger: 'change'
                    }],
                    department: [
                        {
                            max: 10,
                            message: '所在部门长度不能大于 10个字符',
                            trigger: 'blur'
                        }
                    ],
                    post: [
                        {
                            max: 10,
                            message: '职务长度不能大于 10个字符',
                            trigger: 'blur'
                        }
                    ],
				},
			}

		},
		// 页面加载时执行
		created: function() {
			this.search();
		},
		// 自定义方法
		methods: {
			//根据公司为所属区域赋值
			companyChange(){
				console.log(this.editform.companyId)
				if(this.editform.companyId){
					this.$httpGet('get', '/manage/houseProperty/findAreaNameByCompanyId', {
						companyId: this.editform.companyId
					}).then(res => {
						console.log(res)
						this.houseFunctionOption = res.data.body;
	            })
				}
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
				if(type == 'param') {
					this.pageNum = 1;
					this.renovatePagination = false;
				}
				this.$httpPost('/manage/peopleInfo/find', {
					name: this.searchForm.name,
					keyword: this.searchForm.keyword,
					peopleFlag:1,
					page: this.pageNum,
					size: this.pageSize

				}).then(res => {
					this.tableData = res.data.body.content;
					this.totolNum = Number(res.data.body.totalElements);
					this.renovatePagination = true
				})
			},
			// 弹出新增弹出框
			toAdd(index, row) {
				this.getCompanys();
				this.houseFunctionOption=[];
				this.editform = {};
				this.editform.job = "是";
				// this.$httpGet('get', '/manage/houseProperty/findAreaNameByCompanyId', {}).then(res => {
				// 	companyId: this.editform.companyId
	            // }).then(res=>{
				// 	this.houseFunctionOption = res.data.body;
				// })
				this.$forceUpdate();
				this.editTableVisible = true;
				if(row) {
					this.editform = Object.assign({}, row);
				}
			},
			// 弹出修改弹出框
			toEdit(index, row) {
				this.getCompanys();
				this.editform = {};
				this.editform.job = "是";
				if(row) {
					this.editform = Object.assign({}, row);
				}
				if(this.editform.companyId){
					this.$httpGet('get', '/manage/houseProperty/findAreaNameByCompanyId', {
						companyId: this.editform.companyId
					}).then(res => {
						this.houseFunctionOption = res.data.body;
					});
				}
				this.$forceUpdate();
				this.editTableVisible = true;
			},
			lookDetail(index, row) {
				this.getCompanys();
                this.$httpGet('get', '/manage/peopleInfo/findEntityById', {
                    id: row.id
                }).then(res => {

                	this.formInline = res.data.body;
                	if(this.formInline.companyId){
                		this.$httpGet('get', '/manage/houseProperty/findAreaNameByCompanyId', {
							companyId: this.formInline.companyId
						}).then(res => {
							this.houseFunctionOption = res.data.body;
						});
                	}
					this.$forceUpdate();
                    this.formInline = res.data.body;
                    if(res.data.body.owner != null) {
                        this.owner = res.data.body.owner;
                    } else {
                        this.owner = {};
                    }
                    this.detailVisible = true;
                });

            },
			// 修改 新增 保存
			save(formrule) {
				this.$refs[formrule].validate((valid) => {
					if(valid) {
						if(this.editform.department&&this.editform.department.length>10){
							this.$message.error("所在部门长度不能大于 10 个字符");
                    		return false;
						}
						if(this.editform.post&&this.editform.post.length>10){
							this.$message.error("职务长度不能大于 10 个字符");
                    		return false;
						}
						this.$httpPost('/manage/peopleInfo/save', {
							id: this.editform.id,
							remark: this.editform.remark,
							sex: this.editform.sex,
							name: this.editform.name,
							mobile: this.editform.mobile,
							certNo: this.editform.certNo,
							department: this.editform.department,
							post: this.editform.post,
							areaId: this.editform.areaId,
							job: this.editform.job,
							peopleFlag: 1,
							companyId: this.editform.companyId
						}).then(res => {
							if(res.data.msg==="success"){
								this.editTableVisible = false;
								if(this.editform.id){
									if(res.data.body){
										let bl = false;
										if(res.data.body.isLogout=="1"){
											this.$message.error("当前登录用户手机号已修改，请重新登录");
											bl=true;
										}
										if(res.data.body.isLogout=="2"){
											this.$message.error("当前登录用户姓名已修改，请重新登录");
											bl=true;
										}
										if(res.data.body.isLogout=="12"){
											this.$message.error("当前登录用户手机及姓名已修改，请重新登录");
											bl=true;
										}
										if(bl){
											this.$httpPost('/auth/oauth/logout', this.ruleForm).then(res =>{
						                    	if(res.data.code==0){
						                    		localStorage.clear();
						                    		this.$router.push('/login');
						                    	}
						                    })
										}
									}
								}
								this.search();
							}
						},error => {
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
				this.$httpPost('/manage/peopleInfo/delete', {
					id: this.deleteIds
				}).then(res => {
					this.deleteVisible = false;
					this.deleteIds = "";
					this.search();
				},error => {
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
			//获取所属企业数组
			getCompanys(){
				this.$httpPost('/system/user/org/getOrgList', {
					flag: 2
				}).then(res => {
					if(res.data.msg==="success"){
						this.companys=res.data.body;
					}
				},error => {
				})
			}
		}
	}
</script>
