<template>
	<div class="wrap">

        <div class="subContent zr-row">
            <div class="tableWrap">
            <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                <el-button type="primary" @click="handleAdd('editform')">创建</el-button>
                <el-button type="primary" @click="copyCreat()">类似创建</el-button>
                <el-button type="primary" @click="handleDelete()">删除</el-button>
                <el-button type="primary" @click="loadTable">刷新</el-button>
                <el-form-item label="">
                    <el-input v-model="searchForm.name" clearable placeholder="名称"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-input v-model="searchForm.code" clearable placeholder="编码"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-input v-model="searchForm.typekey" clearable placeholder="类别"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchForms()">搜索</el-button>
                </el-form-item>
            </el-form>
            <el-table ref="table" stripe :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="60"></el-table-column>
                <el-table-column :show-overflow-tooltip="true" type="index" label="序号" width="50"></el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="name" label="名称"></el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="code" label="编码"></el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="active" :formatter="state" label="是否可用"></el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="typekey" label="类别"></el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="sortno" label="排序"></el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="remark" label="备注"></el-table-column>
                <el-table-column :show-overflow-tooltip="true" label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page=pageNum :page-sizes="[10, 15, 20, 25]" :page-size=pageSize layout="total, sizes, prev, pager, next, jumper" :total=totolNum>
            </el-pagination>
        </div>

		<!--编辑弹出窗-->
		<el-dialog   title="新增字典" :visible.sync="editTableVisible" width="900px">
			<el-form  :model="editform" :rules="rules" ref="editform"  label-width="80px">
				<el-col :span="12">
					<el-form-item label="名称" prop="name">
						<el-input v-model="editform.name"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="编码" prop="code">
						<el-input v-model="editform.code"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="是否可用" prop="active" >
						<el-select v-model="editform.active" clearable style="width: 100%;">
							<el-option v-for="item in actives" :label="item.lable" :key="item.key" :value="item.key">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="类别" prop="typekey">
						<el-input v-model="editform.typekey"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="排序" prop="sortno">
						<el-input v-model="editform.sortno"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="备注">
						<el-input type="textarea" v-model="editform.remark"></el-input>
					</el-form-item>
				</el-col>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="save('editform')">确 定</el-button>
				<el-button @click="editClose('editform')">取 消</el-button>
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
		data() {
			return {
				tableData: [],
				pageNum: 1,
				pageSize: 10,
				totolNum: 100,
				searchForm: {},
				editTableVisible: false,
				deleteVisible: false,
				editform: {},
				renameVisible: false,
				deleteIds: '',
				maodian:1,
				checkedArr: [],
				actives: [{
					"lable": "启用",
					"key": 1
				}, {
					"lable": "停用",
					"key": 0
				}],
				rules: {
					companyName: [{
						required: true,
						message: '请输入公司名称',
						trigger: 'blur'
					}],
					name: [{
						required: true,
						message: '请输入名称',
						trigger: 'blur'
					}, ],
					code: [{
						required: true,
						message: '请输入名称',
						trigger: 'blur'
					}, ],
					active: [{
						required: true,
						message: '请选择状态',
						trigger: 'blur'
					}, ],
					typekey: [{
						required: true,
						message: '请输入类别',
						trigger: 'blur'
					}, ],
					sortno: [{
						required: true,
						message: '请输入排序',
						trigger: 'blur'
					}, ],
				},
			}

		},
		created: function() {

			this.loadTable();

		},

		methods: {
			//初始化表格
			loadTable() {
				this.$httpPost('/system/user/dict/findByPageAndParams', {
					"page": this.pageNum,
					"size": this.pageSize
				}).then(res => {
					this.maodian = 1;
					this.tableData = res.data.body.content;
					this.totolNum = Number(res.data.body.totalElements)

				}, function(response) {

				});

			},
			//页码数改变
			handleSizeChange(val) {
				this.pageSize = val;
				this.loadTable();
			},
			//页码改变
			handleCurrentChange(val) {
				this.pageNum = val;
				if(this.maodian == 1){
					this.loadTable();
				}else{
					this.search();
				}

			},
			searchForms() {
                this.pageNum = 1;
				this.$httpPost('/system/user/dict/findByPageAndParams', {
					name: this.searchForm.name,
					code: this.searchForm.code,
					typekey: this.searchForm.typekey,
					page: this.pageNum,
					size: this.pageSize
				}).then(res => {
					this.maodian = 2;
					this.tableData = res.data.body.content;
					this.totolNum = Number(res.data.body.totalElements)
				})
			},
			search() {
				this.$httpPost('/system/user/dict/findByPageAndParams', {
					name: this.searchForm.name,
					code: this.searchForm.code,
					typekey: this.searchForm.typekey,
					page: this.pageNum,
					size: this.pageSize
				}).then(res => {
					this.maodian = 2;
					this.tableData = res.data.body.content;
					this.totolNum = Number(res.data.body.totalElements)
				})
			},
			handleEdit(index, row) {
				this.editform = {};
				this.editform = Object.assign({},row);
				this.editTableVisible = true;
			},
            handleAdd(formName) {
				this.editTableVisible = true;
				this.editform = {}

			},
			// 修改 新增 保存
			save(formrule) {
				this.$refs[formrule].validate((valid) => {
					if(valid) {
						this.$httpPost('/system/user/dict/save', {
							id: this.editform.id,
							name: this.editform.name,
							code: this.editform.code,
							active: this.editform.active,
							typekey: this.editform.typekey,
							sortno: this.editform.sortno,
							remark: this.editform.remark
						}).then(res => {
							this.editTableVisible = false;
							this.loadTable();
						})
					} else {
						return false;
					}
				});
			},
			editClose(formName) {
				this.editTableVisible = false;
				this.editform = {};
				this.$refs[formName].resetFields();
			},
			// 删除操作赋值删除项  并弹窗
			handleDelete(index, row) {
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
				this.$httpPost('/system/user/dict/deleteByIds', {
					id: this.deleteIds
				}).then(res => {
					this.deleteVisible = false;
					this.deleteIds = "";
					this.loadTable();
				})
			},
			// 表格选择改变事件
			handleSelectionChange(val) {
				this.checkedArr = val;
				let idsArr = [];
				for(var i = 0; i < val.length; i++) {
					idsArr.push(val[i].id)
				}
				this.deleteIds = idsArr.join(',');
			},
			// 类似创建
			copyCreat() {
				if(this.checkedArr.length > 1 || this.checkedArr.length == 0) {
					this.$message.error('只能类似创建一条');
				} else {
                    this.editform.deviceName = this.checkedArr[0].deviceName,
                    this.editform.name = this.checkedArr[0].name,
                    this.editform.code = this.checkedArr[0].code,
                    this.editform.active = this.checkedArr[0].active,
                    this.editform.typekey = this.checkedArr[0].typekey,
                    this.editform.sortno = this.checkedArr[0].sortno,
                    this.editform.remark = this.checkedArr[0].remark,
                    this.editTableVisible = true
				}
			},
			state: function(row, column, cellValue) {
				if(row.active === 1) {
					return "启用"
				} else {
					return "停用"
				}
			},
		}
	}
</script>
