<template>
    <div class="wrap">

		<div class="subContent zr-row " style="background: #F2F2F2;">
        <div class="tree_content ">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="" style="width: 90%;margin: 5%;">
                    <el-input v-model="treeKey" @clear="handleClear" clearable placeholder="按enter键进行搜索"></el-input>
                </el-form-item>
            </el-form>
            <ul id="resTree" class="ztree"></ul>
        </div>
        <div class="main_content">
                <div class="tableWrap">
                    <!--搜索功能-->
                    <el-form :model="searchForm" class="demo-form-inline zr-row-scatter">
                    	<div>
                    		<!--
                        <el-button class="tright" style="margin-left: 10px;" type="primary" @click="add">创建</el-button>
                        <el-button class="tright" type="primary" @click="handleDelete">删除</el-button>
                        <el-button class="tright" type="primary" @click="loadTable5">刷新</el-button>-->
                    	</div>

                            <div class="zr-row">
                        	<el-form-item >
	                            <el-input v-model="searchForm.username" placeholder="姓名" clearable></el-input>
	                        </el-form-item>
	                        <el-form-item>
	                            <el-input v-model="searchForm.mobile" placeholder="手机号" clearable></el-input>
	                        </el-form-item>
	                        <el-select v-model="searchForm.active" placeholder="用户状态" style="width: 200px;" clearable>
                                <el-option label="启用" value="1"></el-option>
                                <el-option label="禁用" value="0"></el-option>
                            </el-select>
	                        <el-form-item style="margin-right:0">
	                            <el-button type="primary" @click="searchTable">搜索</el-button>
	                        </el-form-item>
                            </div>
                    </el-form>
                    <el-table ref="table" stripe :data="tableData" v-loading ="loading1"
					 element-loading-text="拼命加载中"
					  element-loading-spinner="el-icon-loading"
					   element-loading-background="rbg(0,0,0,0.8)"  style="width: 100%" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="60" align="center"></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" type="index" label="序号" width="50" align="center"></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" prop="account" width="120" label="账号" align="center"></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" prop="username" label="姓名" align="center"></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" prop="mobile" width="120" label="手机号" align="center"></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" prop="sex" label="性别" align="center"></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" prop="userType" :formatter="getUserType" label="用户类型" align="center"></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" prop="map.company" width="160"  label="所属企业" align="center"></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" prop="map.department" width="140"  label="所属部门" align="center"></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" prop="active" :formatter="getActive" label="用户状态" align="center"></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" label="操作" width="230" align="center">
                            <template slot-scope="scope">
                                 <el-button type="text" size="mini" @click="distribute(scope.$index,scope.row)">分配角色</el-button>
                            	<el-button @click.native.prevent="handleEditActive(scope.$index, scope.row)" type="text" size="mini" v-if="scope.row.active == 1">
                                        禁用
                                    </el-button>
                                    <el-button @click.native.prevent="handleEditActive(scope.$index, scope.row)" type="text" size="mini" v-else>
                                        启用
                                    </el-button>
                                <!--<el-button type="text" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                <el-button type="text" size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>-->
                                <el-button type="text" size="mini" @click="handleEditPassword(scope.$index, scope.row)">重置密码</el-button>
                                <!--<el-button type="text" size="mini" @click="lookDetail(scope.$index, scope.row)">查看详情</el-button>-->
                            </template>
                        </el-table-column>
                    </el-table>
            <el-pagination v-if="renovatePagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page=pageNum :page-sizes="[10, 15, 20, 25]" :page-size=pageSize layout="total, sizes, prev, pager, next, jumper" :total=totolNum>
            </el-pagination>
                </div>
        </div>
        <!--编辑弹出窗-->
        <el-dialog   :close-on-click-modal="false"  title="用户信息" :visible.sync="editTableVisible" style="width: 115%;">
            <el-form :inline="true" :model="editform" :rules="rules" ref="editform" class="demo-form-inline" label-width="80px">
            	<el-form-item label="部门" prop="name">
                    <el-input v-model="name" placeholder="部门" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="账号" prop="account">
                    <el-input v-model="editform.account" placeholder="账号"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="username">
                    <el-input v-model="editform.username" type="num" placeholder="姓名"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-select v-model="editform.sex" placeholder="性别" style="width: 200px;">
                        <el-option label="男" value="男"></el-option>
                        <el-option label="女" value="女"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="手机号码" prop="mobile">
                    <el-input type="number" v-model="editform.mobile" placeholder="手机号码"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editform.email" placeholder="邮箱"></el-input>
                </el-form-item>
                <el-form-item label="微信号码" >
                    <el-input type="number" v-model="editform.weixinId" placeholder="微信号码"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="save('editform')" :disabled="isDisabled">确 定</el-button>
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
        <!-- 树节点编辑 -->
        <el-dialog   title="树节点编辑" :visible.sync="editTreeNodeVisible" >
            <el-form :model="treeNode" :rules="rulesTreeNode" ref="treeNode22" class="demo-form-inline" label-width="80px">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="treeNode.name" style="width:70%"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editTreeNode('treeNode22')">确 定</el-button>
                <el-button @click="editTreeNodeVisible = false">取 消</el-button>
            </span>
        </el-dialog>
         <!-- 分配角色 -->
            <el-dialog   :close-on-click-modal="false"  title="分配角色" :visible.sync="distributeRoleVisible">
                <template>
                    <el-tree :data="RoleGroups1" show-checkbox node-key="id" ref="RoleGroupsTree" :default-checked-keys="checkRolekeys" :check-strictly=true :props="defaultRoleProps">
                    </el-tree>
                    <el-button type="primary" class="m10" style="float: right" @click="SubmitEditRole()">保存</el-button>
                    <el-button style="float: right;" class="m10" @click="distributeRoleVisible = false">取消</el-button>
                </template>
            </el-dialog>
        <div id="rMenu">
            <ul>
                <li id="m_add" @click="handleAddNode()">增加同级菜单</li>
                <li id="m_check" @click="handleAddSubNode()">增加子级菜单</li>
                <li id="m_unCheck" @click="handleRename()">重命名</li>
                <li id="m_del" @click="removeTreeNode()">删除节点</li>
            </ul>
        </div>
        </div>
    </div>
</template>
<script>
    import { formatDate } from '../../../static/js/date.js'
    export default {
        data: function() {
            return {
                defaultRoleProps: {
					//            children: 'children',
					label: 'name'
				},
                checkRolekeys: [],
                RoleGroups1:[],
                distributeRoleVisible: false,
            	loading1:false,
                addSubNodeVisible: false,
                addNodeVisible: false,
                renameVisible: false,
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
                pageSize: 15,
                pageNum: 1,
                //刷新分页
				renovatePagination: true,
                totolNum: 100,
                tableData: [],
                pageSize2: 15,
                pageNum2: 1,
                totolNum2: 100,
                owner: {},
                tenant: {},
                tableData2: [],
                upperId: "-1",
                orgId:"-1",
                id:"",
                formInline: {
                    user: '',
                    region: '',
                    value1: '',
                    value2: '',
                },
                rules: {

                    account: [{
                        required: true,
                        message: '请输入账号',
                        trigger: 'blur'
                    }],
                    username: [{
                        required: true,
                        message: '请输入姓名',
                        trigger: 'blur'
                    }],
                    sex: [{
                        required: true,
                        message: '请选择性别',
                        trigger: 'blur'
                    }],
                    mobile: [{
                        required: true,
                        message: '请输入手机号码',
                        trigger: 'blur'
                    }],
                     email: [{
                        required: true,
                        message: '请输入邮箱',
                        trigger: 'blur'
                    }],

                },
                current: 1,
                countSize: 0,
                editTableVisible: false,
                deleteVisible: false,
                detailVisible: false,
                editform: {},
                deleteIds: '',
                checkedArr: [],
                treeNode: {},
                editTreeNodeVisible: false,
                rulesTreeNode: {
                    name: [{
                        required: true,
                        message: '请输入名称',
                        trigger: 'blur'
                    }]
                },
                searchForm: {active:""},
                fileList: [],
                kw: '',
                name:"",
                isDisabled: false,
                customerInfoId: null,
                treeRank: 1
            }
        },
        methods: {
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
            distribute(index, row) {
                this.EditRole(row.id)
                this.distributeRoleVisible = true;
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
            downloadFile() {
                if (this.formInline.attachment == null) {
                    this.$message.warning('没有附件');
                } else {
                    window.open(api.fileserver + '/download?fileId=' + this.formInline.attachment , '_blank');
                }
            },
            submitUpload(){
                this.$refs.upload.submit();
            },
            myUpload(content) {
                let param = new FormData();
                param.append('file', content.file);
                let config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                };
                this.axios.post(api.fileserver + content.action, param, config).then(res => {
                    this.editform.attachment = res.data.fileId;
                })
            },
            getFont(treeId, node) {
                return node.font ? node.font : {};
            },
            // 添加同级菜单
            handleAddNode() {
                this.treeNode = {};
                this.treeNode.id = null;
                this.treeNode.upperId = this.rightClickNode.pId;
                if (this.treeNode.upperId == null) {
                    this.treeNode.upperId = '-1';
                }
                this.treeNode.type=1;
                this.treeNode.rank = this.rightClickNode.rank;
                this.editTreeNodeVisible = true;
            },
            // 添加子级菜单
            handleAddSubNode() {
                this.treeNode = {};
                this.treeNode.id = null;
                this.treeNode.upperId = this.rightClickNode.id;
                this.treeNode.rank = this.rightClickNode.rank;
                this.treeNode.type=2;
                this.editTreeNodeVisible = true;
            },
            // 重命名
            handleRename() {
                this.treeNode = {};
                this.treeNode.id = this.rightClickNode.id;
                this.treeNode.upperId = this.rightClickNode.pId;
                if (this.treeNode.upperId == null) {
                    this.treeNode.upperId = '-1';
                }
                this.treeNode.houseName = this.rightClickNode.name;
                this.treeNode.rank = this.rightClickNode.rank;
                this.treeNode.type=3;
                this.editTreeNodeVisible = true;
            },
            // 树节点编辑
            editTreeNode(formrule) {
                console.log(this.treeNode.name)
                console.log(this.treeNode.rank)
                this.$refs[formrule].validate((valid) => {
                    if (valid) {this.$httpPost('/system/user/org/update', {
                            id: this.treeNode.id,
                            upperId: this.treeNode.upperId,
                            name: this.treeNode.name,
                            rank: this.treeNode.rank,
                            type: this.treeNode.type
                        }).then(res => {
                            this.editTreeNodeVisible = false;
                            this.loadTree();
                        })
                    } else {
                        return false;
                    }
                });
            },
            loadTree() {
                this.$http('get', '/system/user/org/zTree', {}).then(res => {
                    this.resTreeNodes = res.data.body;
                    $.fn.zTree.init($("#resTree"), this.resSetting, this.resTreeNodes);
                    this.resTree = $.fn.zTree.getZTreeObj("resTree");
                    // var firstNode = this.resTree.getNodes()[0];
                    // this.resTree.selectNode(firstNode);
                    this.upperId = this.resTree.getNodes()[0].realId;
                    this.treeRank = firstNode.rank;
                    //this.id = this.resTree.getNodes()[0].realId;
                    this.loadTable5();
                    this.name = this.resTree.getNodes()[0].name;
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
                this.loadTable5();
            },
            // 树节点点击
            treeClick(e, treeId, treeNode) {
                this.pageNum = 1;
                this.id = treeNode.id;
                this.name = treeNode.name;
                this.treeRank = treeNode.rank;
                this.loadTable5();
            },
            // 树节点右击
            onRightClick(event, treeId, treeNode) {
                // if(!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
                //     this.resTree.cancelSelectedNode();
                //     this.showRMenu("root", event.clientX, event.clientY);

                // } else if(treeNode && !treeNode.noR) {
                //     this.resTree.selectNode(treeNode);
                //     this.showRMenu("root", event.clientX, event.clientY);
                // }
                // if(treeNode.rank == 2) {
                //     if(!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
                //         this.resTree.cancelSelectedNode();
                //         this.showRMenu("node", event.clientX, event.clientY);

                //     } else if(treeNode && !treeNode.noR) {
                //         this.resTree.selectNode(treeNode);
                //         this.showRMenu("node", event.clientX, event.clientY);
                //     }
                // }
                // if(treeNode.rank > 2) {
                //     if(!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
                //         this.resTree.cancelSelectedNode();
                //         this.showRMenu("root", event.clientX, event.clientY);

                //     } else if(treeNode && !treeNode.noR) {
                //         this.resTree.selectNode(treeNode);
                //         this.showRMenu("root", event.clientX, event.clientY);
                //     }
                // }
                // this.rightClickNode = treeNode;
            },
            // 显示菜单
            showRMenu(type, x, y) {
                $("#rMenu ul").show();
                if(type == "root") {
                    $("#m_add").show();
                    $("#m_del").show();
                    $("#m_check").show();
                    $("#m_unCheck").show();
                } else {
                    $("#m_add").hide();
                    $("#m_del").hide();
                    $("#m_check").show();
                    $("#m_unCheck").hide();
                }

                y += this.$root.$children[0].$children[0].$refs.contentBox.scrollTop;
                x += this.$root.$children[0].$children[0].$refs.contentBox.scrollLeft;
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
                if (this.rightClickNode.id == 'o_10001') {
                    this.$message.warning('根节点不能删除');
                } else if (this.rightClickNode.id == 'o_10002') {
                    this.$message.warning('业主/租户不能删除');
                } else {
                    if (confirm('确定删除么？')) {
                        this.$httpPost( '/system/user/org/delDep', {
                            "id": this.rightClickNode.id
                        }).then(res => {
                            this.$message({
                                type: 'success',
                                message: '删除成功'
                            });
                            this.hideRMenu();
                            this.loadTree();
                        });
                    } else {
                        this.hideRMenu();
                    }
                }
            },
            loadTable() {
            	this.loading1 = true;
                this.$http('post', '/system/user/getPageUsers', {
                    mobile: this.searchForm.mobile,
                    username: this.searchForm.username,
                    active: this.searchForm.active,
                    page: this.pageNum,
                    size: this.pageSize
                }).then(res => {
                	this.loading1=false;
                    this.tableData = res.data.body.content;
                    this.totolNum = Number(res.data.body.totalElements);

                })

            },
            loadTable5() {
            	this.loading1 = true;
                this.$http('post', '/system/user/org/findPageByIds', {
                    id: this.id,
                    mobile: this.searchForm.mobile,
                    username: this.searchForm.username,
                    active: this.searchForm.active,
                    page: this.pageNum,
                    size: this.pageSize
                }).then(res => {
                	this.loading1=false;
                	if (res&&res.data.code === 1) {
                        this.tableData = [];
                        this.totolNum = 0;
                    } else if (res&&res.data.code === 0) {
                        this.tableData = res.data.body.content;
                        this.totolNum = Number(res.data.body.totalElements)
                	}
                })

            },
            handleEdit(index, row) {
                this.editTableVisible = true;
                this.editform = row;
                this.$refs['editform'].resetFields();
            },
            handleEditActive(index, row) {
            	let activetmp = "";
            	if(row.active=="0"){
            		activetmp = "1";
            	}else{
            		activetmp = "0";
            	}
                this.$http('post','/system/user/updateActive',{
                    userId: row.id,
                    active: activetmp
                }).then(res => {
                    if (res.data.code == 0) {
                        this.loadTable5()
                    } else {
                    }
                });
            },
            handleEditPassword(index, row) {
                this.$http('post','/system/user/update',{
                    userId: row.id,
                    password: 'F80D7973D8AE51C2CDB17B167E225B40'
                }).then(res => {
                    if (res.data.code == 0) {
                        this.$message.success('重置密码成功');
                    } else {
                    }
                });
            },
            add() {
                this.editform = {};
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
                        this.$message.error('请先选择用户');
                    }
                }
            },
            deleteRow() {
                this.$httpPost('/system/user/org/delete', {
                    id: this.deleteIds
                }).then(res => {
                    this.deleteVisible = false;
                    this.loadTable5()
                })
            },
            save(formrule) {
            	var pId = this.upperId;

            	if (this.editform.id != null) {
            	    pId = this.editform.upperId;
                }
                this.$refs[formrule].validate((valid) => {
                    if(valid) {
                        this.isDisabled = true;
                        this.$httpPost('/system/user/org/save', {
                        	orgId :this.id,
                            id: this.editform.id,
                            account: this.editform.account,
                            username: this.editform.username,
                            userType: this.editform.userType,
                            sex: this.editform.sex,
                            duty: this.editform.duty,
                            email: this.editform.email,
                            errorCount: this.editform.errorCount,
                            mobile: this.editform.mobile,
                            weixinId: this.editform.weixinId,
                        }).then(res => {
                            this.editTableVisible = false;
                            this.isDisabled = false;
                            this.loadTable5();
                        })
                    } else {
                        return false;
                    }
                });
            },
            handleSizeChange(val) {
                if (this.totolNum > 0) {
                    this.pageSize = val;
                    this.loadTable5();
                }
            },
            handleCurrentChange(val) {
                if (this.totolNum > 0) {
                    this.pageNum = val;
                    this.loadTable5();
                }
            },
            handleCurrentChange2(val) {
                if (this.totolNum2 > 0) {
                    this.pageNum2 = val;
                    this.loadTable2();
                }
            },
            handleSelectionChange(val) {
                this.checkedArr = val;
                let idsArr = []
                for(var i = 0; i < val.length; i++) {
                    idsArr.push(val[i].id)
                }
                this.deleteIds = idsArr.join(',')
            },
            copyCreat() {
                if(this.checkedArr.length > 1 || this.checkedArr.length == 0) {
                    this.$message.error('只能类似创建一条');
                } else {
                    this.editform = this.checkedArr[0];
                    this.editform.id = null;
                    this.editTableVisible = true
                }
            },
            searchTable() {
                this.pageNum = 1;
				this.renovatePagination = false;
                this.$http('post', '/system/user/org/findPageByIds', {
                	id : this.id,
                    mobile: this.searchForm.mobile,
                    username: this.searchForm.username,
                    active: this.searchForm.active,
                    page: this.pageNum,
                    size: this.pageSize
                }).then(res => {
                	if(res.data.msg == "success") {
                		this.tableData = res.data.body.content;
                   	    this.totolNum = Number(res.data.body.totalElements);
                	}else{
                		this.loadTable5();
                	}
					this.renovatePagination = true
//                  this.handleCurrentChange(1);
                })

            },
            searchTable2() {
                if (this.customerInfoId == null) {
                    this.tableData2 = [];
                    this.totolNum2 = 0;
                } else {
                    this.$http('post', '/manage/customerEmployee/list', {
                        name: this.kw,
                        customerInfoId: this.customerInfoId,
                        page: this.pageNum2,
                        size: this.pageSize2,
                    }).then(res => {
                        this.tableData2 = res.data.body.content;
                        this.totolNum2 = Number(res.data.body.totalElements);
                    });
                }
            },
            // 时间格式化
            dateFormat(row, column, cellValue) {
                let date = new Date(parseInt(cellValue));
                if(date == undefined) {
                    return "";
                }
                return formatDate(date, "yyyy-MM-dd");
            },
            getUserType(row, column, cellValue) {
                if (cellValue == 0) {
                    return '后台用户';
                } else {
                    return '外部用户';
                }
            },
            getActive(row, column, cellValue) {
                if (cellValue == 0) {
                    return '禁用';
                } else {
                    return '启用';
                }
            }
        },
        watch: {
			editTableVisible(val){
				!val&&setTimeout(() => {
					this.$refs['editform'].resetFields();
				},0);
			},
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
            this.rMenu = $("#rMenu");
        },
        created() {
            this.loadTree();
            this.loadTable5();
            //加载角色列表
            this.selectRole();
        },
    }
</script>

<style scoped>
</style>
