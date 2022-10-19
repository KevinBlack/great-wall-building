<template>
	<div class="wrap">

		<div class="subContent zr-row">
			<el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
				<el-tab-pane label="权限配置" name="first">
					<div class="tableWrap">
						<el-row>
							<el-col :span="8" :lg="4">
								<!--    <el-button type="primary" @click="open3" v-if="!getHiddenButtons(4002)">添加权限组</el-button>-->
								<el-menu mode="vertical" :default-active="defaultId" class="el-menu-vertical-demo">
									<el-menu-item-group>
										<div v-for="(item,index) in RoleGroups" :key="index">
											<el-menu-item :index="tostring(item.id)" @click="select(item.id)" v-if="item.active===1">
												<i class="el-icon-edit" @click="editname(item)"></i> {{item.name}}
											</el-menu-item>
										</div>
									</el-menu-item-group>
								</el-menu>
							</el-col>
							<el-col :span="16" :lg="20">
                                <el-tabs v-model="activeRoleTab" type="card" @tab-click="roleTabClick">
                                    <el-tab-pane label="PC端权限" name="first">
                                        <template>
                                            <el-tree :data="tree" show-checkbox ref="tree" node-key="id" :default-checked-keys="checkkeys" :check-on-click-node="true" :props="defaultProps" class="m10">
                                            </el-tree>
                                            <el-button type="primary" style="float: right" @click="CommitAdd('savePC')">保存权限</el-button>
                                            <el-button style="float: right;margin-right: 10px" @click="cancelAdd()">取消修改</el-button>
                                        </template>
                                    </el-tab-pane>
                                    <el-tab-pane label="APP端权限" name="second">
                                        <template>
                                            <el-tree :data="treeAPP" show-checkbox ref="treeAPP" node-key="id" :default-checked-keys="checkkeys" :check-on-click-node="true" :props="defaultProps" class="m10">
                                            </el-tree>
                                            <el-button type="primary" style="float: right" @click="CommitAdd('saveAPP')">保存权限</el-button>
                                            <el-button style="float: right;margin-right: 10px" @click="cancelAdd()">取消修改</el-button>
                                        </template>
                                    </el-tab-pane>
                                </el-tabs>
							</el-col>
						</el-row>
					</div>
				</el-tab-pane>
				<el-tab-pane label="角色管理" name="second">
					<div class="tableWrap">
                        <el-form :inline="true" :model="searchForm">
                            <el-form-item>
                                <el-button type="primary" @click="addRole">添加角色</el-button>
                            </el-form-item>
                        </el-form>
						<el-table ref="table" stripe :data="RoleGroups" border>
							<el-table-column :show-overflow-tooltip="true" prop="name" label="角色名称"></el-table-column>
                            <el-table-column :show-overflow-tooltip="true" prop="peopleflag" label="角色分类"></el-table-column>
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

				<el-tab-pane label="角色配置" name="roleManage">
                    <div class="tableWrap">

                        <el-form :inline="true" :model="searchForm" class="zr-row zr_justify-end">
                            <el-form-item >
                                <el-input v-model="searchForm.account" placeholder="账号" clearable style="width:200px;float: right;"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-input v-model="searchForm.name" placeholder="姓名" clearable style="width:200px;float: right;"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="searchTable('param')">搜索</el-button>
                            </el-form-item>
                        </el-form>
                        <el-table ref="table" :data="tableData" style="width: 100%" >
                            <el-table-column :show-overflow-tooltip="true" type="index" label="序号"></el-table-column>
                            <el-table-column :show-overflow-tooltip="true" prop="account" label="账号"></el-table-column>
                            <el-table-column :show-overflow-tooltip="true" prop="username" label="姓名"></el-table-column>
                            <el-table-column :show-overflow-tooltip="true" prop="sex" label="性别"></el-table-column>
                            <el-table-column :show-overflow-tooltip="true" prop="roleName" label="角色"></el-table-column>
                            <el-table-column :show-overflow-tooltip="true" label="操作" width="240">
                                <template slot-scope="scope">
                                    <el-button type="text" size="mini" @click="distribute(scope.$index,scope.row)">分配角色</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-pagination v-if="renovatePagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page=pageNum :page-sizes="[10, 15, 20, 25]" :page-size=pageSize layout="total, sizes, prev, pager, next, jumper" :total=totolNum>
                        </el-pagination>
                    </div>
				</el-tab-pane>
			</el-tabs>

            <!-- 分配角色 -->
            <el-dialog   :close-on-click-modal="false"  title="分配角色" :visible.sync="distributeRoleVisible">
                <template>
                    <el-tree :data="RoleGroups1" show-checkbox node-key="id" ref="RoleGroupsTree" :default-checked-keys="checkRolekeys" :check-strictly=true :props="defaultRoleProps">
                    </el-tree>
                    <el-button type="primary" class="m10" style="float: right" @click="SubmitEditRole()">保存</el-button>
                    <el-button style="float: right;" class="m10" @click="distributeRoleVisible = false">取消</el-button>
                </template>
            </el-dialog>
            <!-- 分配角色 -->
            <el-dialog   :close-on-click-modal="false"  title="添加角色" :visible.sync="addRoleVisible" width="800px">
                <el-form :model="editform" :rules="rules" ref="editform" class="p-30" label-width="80px">
                    <el-col :span=24>
						<el-form-item label="角色名称" prop="name">
							<el-input v-model="editform.name" placeholder="角色名称"></el-input>
						</el-form-item>
					</el-col>
                    <el-col :span=24>
						<el-form-item label="角色分类" prop="peopleflag">
							<el-select v-model="editform.peopleflag" placeholder="角色分类" class="w-100">
								<el-option label="物业角色-设备处" value="物业角色-设备处"></el-option>
								<el-option label="物业角色-管理处" value="物业角色-管理处"></el-option>
								<el-option label="企业角色" value="企业角色"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
                    <el-col :span=24>
						<el-form-item label="角色状态" prop="state">
							<el-select v-model="editform.state" placeholder="角色状态" class="w-100">
								<el-option label="启用" value="1"></el-option>
								<el-option label="停用" value="0"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
                </el-form>
                <span slot="footer" class="dialog-footer">
					<el-button type="primary" @click="add('editform')">确 定</el-button>
					<el-button @click="addRoleVisible = false">取 消</el-button>
				</span>
            </el-dialog>
		</div>
	</div>
</template>

<style>

</style>

<script>
	export default {
		data() {
			return {
				defaultId: "",
				pcMenuRole:"",
				appMenuRole:"",
				userRoleDefault: "",
				activeName2: "first",
                activeRoleTab:"first",
				RoleGroups: [],
                RoleGroups1:[],
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
                rules: {
                    name: [
	                    {
	                        required: true,
	                        message: '请输入角色名称',
	                        trigger: 'blur'
	                    },
						{
							min: 1,
							max: 10,
							message: '长度大于 10 个字符',
							trigger: 'blur'
						}],
                    peopleflag: [{
                        required: true,
                        message: '请选择角色分类',
                        trigger: 'blur'
                    }],
                    state: [{
                        required: true,
                        message: '请选择角色状态',
                        trigger: 'blur'
                    }],
                },
				tree: [],
                treeAPP:[],
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
                searchForm:{},
                tableData: [],
                //刷新分页
				renovatePagination: true,
                pageSize: 15,
                pageNum: 1,
                totolNum: 0,
                distributeRoleVisible: false,
                addRoleVisible:false,
                editform:{},
			}

		},
		created: function() {
			this.$httpPost('/system/user/role/getMenuTree').then(res => {
				let data = res.data.body;
				this.tree = data;
			}, function(response) {

			});
			//加载app菜单列表
			this.getMenu();
			//加载角色列表
            this.selectRole();
            //加载用户信息列表
			this.searchTable();
		},
        watch: {
            editTableVisible(val){
                !val&&setTimeout(() => {
                    this.$refs['editform'].resetFields();
                },0);
            },
        },
		// mixins: [mixin],
		methods: {
            distribute(index, row) {
                this.EditRole(row.id)
                this.distributeRoleVisible = true;
            },
		    searchTable(type) {
		    	if(type == 'param') {
					this.pageNum = 1;
					this.renovatePagination = false;
				}
                this.$httpPost('/system/user/getPageUsers', {
                    account: this.searchForm.account,
                    username: this.searchForm.name,
                    page: this.pageNum,
                    size: this.pageSize
                }).then(res => {
                    this.tableData = res.data.body.content;
                    this.totolNum = Number(res.data.body.totalElements);
                    this.renovatePagination = true
                });
            },
            getMenu() {
                this.$httpPost('/system/menu/getMenu').then(res => {

                    let data = res.data.body;
                    this.treeAPP = data;
                }, function(response) {

                });
            },
            selectRole() {

                this.$httpPost('/system/user/role/getRoleName').then(res => {
                    this.RoleGroups1 = [];
                    let data = res.data.body;
                    this.RoleGroups = data;
                    this.rols = data;
                    for(let i = 0; i < data.length; i++) {
                        if(data[i].active === 1) {
                            this.RoleGroups1.push(data[i]);
                        }
                    }
                    this.select(this.RoleGroups1[0].id);
                    this.defaultId = this.RoleGroups1[0].id;
                }, function(response) {

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
            roleTabClick(tab, event) {
                let name = tab._props.name
                if(name === "second") {
                    // this.loaduser()
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
			CommitAdd(value) {
				if(this.roleid == null) {
					this.$message({
						type: 'error',
						message: '请先选择权限组'

					})
					return false
				}
				let delMenuRole = "";
				if(value=="savePC"){
				    if(this.$refs.tree.getHalfCheckedKeys().length>0){
                        this.menuids = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys())
                        // this.menuids = this.$refs.tree.getCheckedKeys()+","+this.$refs.tree.getHalfCheckedKeys();
                    }else{
                        this.menuids = this.$refs.tree.getCheckedKeys();
                    }
                    delMenuRole = this.pcMenuRole;
                }else if(value=="saveAPP"){
                    this.menuids = this.$refs.treeAPP.getCheckedKeys();
                    delMenuRole = this.appMenuRole;
                }
				this.$httpPost('/system/user/role/saveRolebyId', {
					"roleid": this.roleid,
					"delMenuRole": delMenuRole,
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
					this.$refs.treeAPP.setCheckedKeys([])
					for(let i = 0; i < data.length; i++) {
						this.$refs.tree.setChecked(data[i], true)
						this.$refs.treeAPP.setChecked(data[i], true)
					}

					this.roleid = index;
                    this.pcMenuRole = this.$refs.tree.getCheckedKeys().toString();
                    // if(this.$refs.tree.getHalfCheckedKeys()!=""){
                    //     this.pcMenuRole = this.$refs.tree.getCheckedKeys()+","+this.$refs.tree.getHalfCheckedKeys();
                    // }
					this.appMenuRole = this.$refs.treeAPP.getCheckedKeys().toString();
				}, function(response) {});
			},
			editname(item) {
				const _this = this
				this.$prompt('请输入权限组名称', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputValue: item.name,
					inputValidator: (val,oldVal) => {
						if(val) {
							if(val.length>10) return '长度大于 10 个字符'
						}
						else return '权限组名称不能为空'
					}
				}).then(({
					value
				}) => {
					let parm = JSON.parse(JSON.stringify(item));
					parm.name = value;
					this.$httpPost('/system/user/role/editRole', parm).then(res => {
						if(res.data.code===0){
							item.name = value;
							this.$message({
								type: 'success',
								message: '修改成功'

							});
						}
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
                        this.selectRole();
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
                        this.selectRole();
                        this.$message({
                            type: 'success',
                            message: '停用成功!'
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
            addRole(){
                this.editform = {};
                this.addRoleVisible=true
            },
            add(formrule){
                this.$refs[formrule].validate((valid) => {
                    if(valid) {
                        this.$httpPost("/system/user/role/addRole", {
                            name: this.editform.name,
                            peopleflag: this.editform.peopleflag,
                            state: this.editform.state
                        }).then(res => {
                            let data = res.data
                            if(data.code==0){
                                this.addRoleVisible=false;
                                this.selectRole();
                                this.$message({
                                    type: 'success',
                                    message: '添加成功'
                                });
                            }

                        },error => {
						});
                    } else {
                        return false;
                    }
                });
            },

		}
	}
</script>
