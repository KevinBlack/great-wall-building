<template>
	<div class="wrap">

		<div class="subContent zr-row">
			<el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
				<el-tab-pane label="权限组管理" name="first">
					<div class="tableWrap">
						<el-row>
							<el-col :lg="3" :span="5">
								<!--    <el-button type="primary" @click="open3" v-if="!getHiddenButtons(4002)">添加权限组</el-button>-->
								<el-menu mode="vertical" :default-active="defaultId" class="el-menu-vertical-demo">
									<el-menu-item-group>
										<template v-for="(item,index) in RoleGroups"  >
											<el-menu-item :index="tostring(item.id)" @click="select(item.id)" v-if="item.active===1">
												<i class="el-icon-edit" @click="editname(item)"></i> {{item.name}}
											</el-menu-item>
										</template>
									</el-menu-item-group>
								</el-menu>
							</el-col>
							<el-col :span="19">
								<template>
									<el-tree :data="tree" show-checkbox ref="tree" node-key="id" :default-checked-keys="checkkeys" :check-on-click-node="true" :check-strictly=true :props="defaultProps" class="m10">
									</el-tree>
									<el-button type="primary" style="float: right" @click="CommitAdd()">保存权限</el-button>
									<el-button style="float: right;margin-right: 10px" @click="cancelAdd()">取消修改</el-button>
								</template>

							</el-col>
						</el-row>
					</div>
				</el-tab-pane>
				<el-tab-pane label="配置管理" name="second">
					<div class="tableWrap">
						<el-table ref="table" stripe :data="RoleGroups" border>
							<el-table-column :show-overflow-tooltip="true" prop="name" label="权限组名称"></el-table-column>
							<el-table-column :show-overflow-tooltip="true" :formatter="state" label="权限组状态"></el-table-column>
							<el-table-column :show-overflow-tooltip="true" fixed="right" label="操作" width="120">
                                <template slot-scope="scope">
                                    <el-button @click.native.prevent="stopRow(scope.$index, RoleGroups)" type="text" size="mini" v-if="scope.row.active == 1">
                                        停用
                                    </el-button>
                                    <el-button @click.native.prevent="startRow(scope.$index, RoleGroups)" type="text" size="mini" v-else>
                                        启用
                                    </el-button>
                                </template>
							</el-table-column>
						</el-table>
					</div>
				</el-tab-pane>

				<!--<el-tab-pane label="角色管理" name="third">-->
					<!--<div class="tableWrap">-->
						<!--<el-row>-->
							<!--<el-select v-model="username" @clear="loaduser" @change="selectuser" style="margin-bottom:10px;" clearable filterable placeholder="用户名">-->
								<!--<el-option v-for="item in allusers" :key = "item.index" :label="item.username" :value="item.id">-->
								<!--</el-option>-->
							<!--</el-select>-->
							<!--<el-button type="primary" @click="selectuser">搜索</el-button>-->
						<!--</el-row>-->
						<!--<el-col :lg="3" :span="5">-->

							<!--<el-menu mode="vertical" :default-active="userRoleDefault" class="el-menu-vertical-demo">-->
								<!--<el-menu-item-group>-->
									<!--<template v-for="item in users" >-->
										<!--<el-menu-item :index="tostring(item.id)" @click="EditRole(item.id)">-->
											<!--&lt;!&ndash;<i class="el-icon-edit" @click="editname(item)"></i>&ndash;&gt;-->
											<!--{{item.username}}-->
										<!--</el-menu-item>-->
									<!--</template>-->
								<!--</el-menu-item-group>-->
							<!--</el-menu>-->
						<!--</el-col>-->
						<!--<el-col :span="19">-->
							<!--<template>-->
								<!--<el-tree :data="RoleGroups" show-checkbox node-key="id" ref="RoleGroupsTree" :default-checked-keys="checkRolekeys" :check-strictly=true :props="defaultRoleProps">-->
								<!--</el-tree>-->
								<!--<el-button type="primary" class="m10" style="float: right" @click="SubmitEditRole()">保存</el-button>-->
								<!--<el-button style="float: right;" class="m10">取消</el-button>-->
							<!--</template>-->
						<!--</el-col>-->
					<!--</div>-->
				<!--</el-tab-pane>-->

				<el-tab-pane label="角色管理" name="roleManage">
                    <div class="tableWrap">
                        <div class="mgb10">
                            <el-row>
                                <el-button type="primary" @click="searchTable()" style="float: right;" plain><i class="el-icon-search"></i>搜索</el-button>
                                <el-input v-model="searcher.name" placeholder="姓名" clearable style="width:200px;float: right;"></el-input>
                                <el-input v-model="searcher.account" placeholder="账号" clearable style="width:200px;float: right;"></el-input>
                            </el-row>
                        </div>
                        <el-table ref="table" :data="tableData" style="width: 100%" >
                            <!--<el-table-column type="selection"></el-table-column>-->
                            <el-table-column :show-overflow-tooltip="true" type="index" label="#"></el-table-column>
                            <el-table-column :show-overflow-tooltip="true" prop="account" label="账号"></el-table-column>
                            <el-table-column :show-overflow-tooltip="true" prop="username" label="姓名"></el-table-column>
                            <el-table-column :show-overflow-tooltip="true" prop="sex" label="性别"></el-table-column>
                            <el-table-column :show-overflow-tooltip="true" prop="roleName" label="角色"></el-table-column>
                            <!--<el-table-column :show-overflow-tooltip="true" width="120"  prop="phone" label="联系电话"></el-table-column>-->
                            <!--<el-table-column :show-overflow-tooltip="true" width="120" prop="birthday" label="出生日期"></el-table-column>-->
                            <!--<el-table-column :show-overflow-tooltip="true" prop="politicalStatus" label="政治面貌"></el-table-column>-->
                            <!--<el-table-column :show-overflow-tooltip="true" width="150" prop="address" label="联系地址"></el-table-column>-->
                            <!--<el-table-column :show-overflow-tooltip="true" width="150" prop="workUnit" label="工作单位"></el-table-column>-->
                            <!--<el-table-column :show-overflow-tooltip="true" prop="status" label="状态"></el-table-column>-->
                            <el-table-column :show-overflow-tooltip="true" label="操作" width="240">
                                <template slot-scope="scope">
                                    <el-button type="text" size="mini" @click="distribute(scope.$index,scope.row)" v-if="scope.row.userType == 0">分配角色</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page=pageNum :page-sizes="[10, 15, 20, 25]" :page-size=pageSize layout="total, sizes, prev, pager, next, jumper" :total=totolNum>
                        </el-pagination>
                    </div>
				</el-tab-pane>
			</el-tabs>

            <!-- 分配角色 -->
            <el-dialog   :close-on-click-modal="false"  title="分配角色" :visible.sync="distributeRoleVisible">
                <template>
                    <el-tree :data="RoleGroups" show-checkbox node-key="id" ref="RoleGroupsTree" :default-checked-keys="checkRolekeys" :check-strictly=true :props="defaultRoleProps">
                    </el-tree>
                    <el-button type="primary" class="m10" style="float: right" @click="SubmitEditRole()">保存</el-button>
                    <el-button style="float: right;" class="m10" @click="distributeRoleVisible = false">取消</el-button>
                </template>
            </el-dialog>
		</div>
	</div>
</template>

<style>

</style>

<script>
	//import {ERR_MSG, MENUID, URL} from "../../assets/constants/constant-common";
	//import utils from "../../assets/util/utils";
	//import {mixin}from '../../assets/util/mixin';
	export default {
		data() {
			return {
				defaultId: "",
				userRoleDefault: "",
				activeName2: "first",
				RoleGroups: [],
				RoleMenus: [],
				dialogFormVisible: false,
				dialogFormVisible2: false,
				roleid: null,
				menuids: null,
				form: "",
				users: [],
				allusers: [],
				username: null,
				name: null,
				Edituserid: null,
				Editindex: null,
				elmenuid: 0,
				rols: [],
				tree: [],
				defaultProps: {
					children: 'children',
					label: 'label'
				},
				defaultRoleProps: {
					//            children: 'children',
					label: 'name'
				},
				checkkeys: [],
				checkRolekeys: [],
                searcher:{},
                tableData: [],
                pageSize: 10,
                pageNum: 1,
                totolNum: 0,
                distributeRoleVisible: false
			}

		},
		created: function() {
			this.$httpPost('/system/user/role/getMenuTree').then(res => {
				let data = res.data.body;
				this.tree = data;
			}, function(response) {

			});
			this.$httpPost('/system/user/role/getRoleName').then(res => {

				let data = res.data.body;
				this.RoleGroups = data;
				this.rols = data;
				for(let i = 0; i < data.length; i++) {
					if(data[i].active === 1) {
						this.select(data[i].id);
						this.defaultId = data[i].id;
						return;
					}
				}

			}, function(response) {

			});
			this.searchTable();
		},
		// mixins: [mixin],
		methods: {
            distribute(index, row) {
                this.EditRole(row.id)
                this.distributeRoleVisible = true;
            },
		    searchTable() {
                this.$httpPost('/system/user/getPageUsers', {
                    account: this.searcher.account,
                    username: this.searcher.name,
                    page: this.pageNum,
                    size: this.pageSize
                }).then(res => {
                    this.tableData = res.data.body.content;
                    this.totolNum = Number(res.data.body.totalElements);
                });
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.searchTable();
            },
            handleCurrentChange(val) {
                this.pageNum = val;
                this.searchTable();
            },
			tostring(id) {
				var str = String(id);
				return str;
			},
			SubmitEditRole() {
				let ids = this.$refs.RoleGroupsTree.getCheckedKeys();
				this.$httpPost('/system/user/editUserRole', {
					"id": this.Edituserid,
					"roleid": ids
				}).then(res => {
					//          this.users[this.Editindex].id=id;
					this.$message({
						type: 'success',
						message: '修改成功'

					});
					this.dialogFormVisible2 = false;
					this.distributeRoleVisible = false;
					this.searchTable();
				}, function(response) {

				});

			},
			EditRole(userid) {
				this.Edituserid = userid;
				this.userRoleDefault = userid
				//        this.Editindex=index;
				//        this.dialogFormVisible2=true

				this.$httpPost('/system/user/getUserRole', {
					"userid": this.Edituserid
				}).then(response => {
					let data = response.data.body;
					this.$refs.RoleGroupsTree.setCheckedKeys([])
					for(let i = 0; i < data.length; i++) {
						this.$refs.RoleGroupsTree.setChecked(data[i], true)
					}

					//	            this.Edituserid=index;

				}, function(response) {});

			},
			selectuser() {
				if(this.username != "" && this.username != null) {
					this.EditRole(this.username);
					this.$httpPost('/system/user/getUserName', {
						"userid": this.username
					}).then(response => {
						let data = response.data.body;
						this.users = [];
						this.users = data;
						//            this.userRoleDefault=this.username
						this.EditRole(this.username);
					}, function(response) {

					});
				} else {
					this.loaduser();
				}

			},
			handleClick(tab, event) {
				let name = tab._props.name
				if(name === "third") {
					this.loaduser()
				}
			},
			loaduser: function() {

				this.$httpPost('/system/user/getUserName', {
					"userid": ""
				}).then(response => {
					let data = response.data.body;
					this.users = data;
					this.allusers = data;
					if(this.Edituserid == "" || this.Edituserid == null) {
						this.userRoleDefault = data[0].id;
						this.EditRole(data[0].id);
					} else {
						this.EditRole(this.Edituserid);
					}
				}, function(response) {

				});

			},
			roles: function(row, column, cellValue) {
				let roleid = row.roleid;
				if(roleid == null || roleid == "") {
					return "暂未分配"
				} else {
					let groupa = this.RoleGroups;
					for(let i = 0; i < groupa.length; i++) {
						if(roleid == groupa[i].id) {
							return groupa[i].name
						}

					}

				}

			},
			state: function(row, column, cellValue) {
				if(row.active === 1) {
					return "启用"
				} else {
					return "停用"
				}

			},
			cancelAdd() {
				if(this.roleid != null) {
					this.select(this.roleid);
				}

			},
			CommitAdd() {
				if(this.roleid == null) {
					this.$message({
						type: 'error',
						message: '请先选择权限组'

					})
					return false
				}
				this.menuids = this.$refs.tree.getCheckedKeys();
				this.$httpPost('/system/user/role/saveRolebyId', {
					"roleid": this.roleid,
					"menuids": this.menuids
				}).then(response => {
					this.$message({
						type: 'success',
						message: '修改成功'

					});

				}, function(response) {

				});

			},
			select(index) {
				this.$httpPost('/system/user/role/getRoleById', {
					"roleid": index
				}).then(response => {
					let data = response.data.body;
					this.$refs.tree.setCheckedKeys([])
					for(let i = 0; i < data.length; i++) {
						this.$refs.tree.setChecked(data[i], true)
					}

					this.roleid = index;

				}, function(response) {});
			},
			editname(item) {
				this.$prompt('请输入权限组名称', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputValue: item.name
				}).then(({
					value
				}) => {
					item.name = value;
					this.$httpPost('/system/user/role/editRole', item).then(response => {
						this.$message({
							type: 'success',
							message: '修改成功'

						});
					}, function(response) {

					});

				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消修改'
					});
				});
			},
			open3() {
				this.$prompt('请输入权限组名称', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',

				}).then(({
					value
				}) => {
					this.$http.post(URL + MENUID.addRole, {
						"name": value,
						"rolestate": 1
					}).then(function(response) {

						let rel = response.body.rel;
						if(!rel) {
							this.$message({
								type: 'error',
								message: '创建失败'

							});
							return
						} else {
							let data = response.body.data;
							this.RoleGroups.push(data)
						}

					}, function(response) {

					});
					this.$message({
						type: 'success',
						message: '创建成功'

					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消输入'
					});
				});
			},
			deleteRow(index, rowmenu) {
				this.$confirm('此操作将移除该菜单权限, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let menuid = rowmenu[index].menuid
					let roleid = this.roleid;
					this.$http.post(URL, utils.getRequestData(MENUID.DeleteMediaHandler, {
						"roleid": roleid,
						"menuid": menuid
					})).then(function(response) {
						let data = response.data;
						if(!utils.isSuccess(data.state)) return;
						this.RoleMenus.splice(index, 1);

					}, function(response) {

					});
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
					return false

				});

			},
			startRow(index, rowmenu) {
				this.$confirm('此操作将启用该权限组, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let infos = rowmenu[index]
					infos.active = 1;
					this.$httpPost('/system/user/role/editRole', infos).then(response => {
						this.RoleGroups[index].active = 1;
						this.$message({
							type: 'success',
							message: '启用成功!'
						});

					}, function(response) {

					});

				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});
					return false

				});

			},
			stopRow(index, rowmenu) {
				this.$confirm('此操作将停用该权限组, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let infos = rowmenu[index]
					infos.active = 0;
					this.$httpPost('/system/user/role/editRole', infos).then(response => {
						this.RoleGroups[index].active = 0;

					}, function(response) {

					});
					this.$message({
						type: 'success',
						message: '停用成功!'
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});
					return false

				});

			},

		}
	}
</script>
