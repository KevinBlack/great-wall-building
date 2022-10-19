<template>
    <div  class="wrap">
		<div class="subContent zr-row " style="background: #F2F2F2;">
        <div class="tree_content ">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="" style="width: 90%;margin: 5%;">
                    <el-input v-model="treeKey" @clear="handleClear" clearable placeholder="按enter键进行搜索"></el-input>
                </el-form-item>
            </el-form>
            <ul id="resTree" class="ztree"></ul>
        </div>
        <div class="main_content ">
                <div class="tableWrap">
                    <el-form :model="searchForm" class="demo-form-inline zr-row-scatter w-100">
                        <div class="zr-row">
                        	<el-button style="margin-left:0;" type="primary" @click="add">新增区域</el-button>
<!--                        	<el-button type="primary" @click="loadTable">导入</el-button>-->
<!--                        	<el-button type="primary" @click="loadTable">导出</el-button>-->
                        	<el-button type="primary" @click="handleDelete">批量删除</el-button>
                        </div>

                        <div class="zr-row">
                        	<el-form-item label="">
	                            <el-input v-model="searchForm.houseName" placeholder="区域名称" clearable></el-input>
	                        </el-form-item>
	                        <el-form-item label="">
	                            <el-select v-model="searchForm.houseFunction" placeholder="区域功能" clearable>
	                                <el-option v-for="item in houseFunctionOption" :key = item.code :label="item.name" :value="item.code"></el-option>
	                            </el-select>
	                        </el-form-item>
	                        <el-form-item >
		                        <el-input placeholder="关键字" v-model="searchForm.keyword" clearable ></el-input>
		                    </el-form-item>
	                        <el-form-item style="margin-right: 0;">
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
                        <el-table-column :show-overflow-tooltip="true" prop="houseNo" label="区域编号" align="center">
	                        <template slot-scope="scope">
	                            <el-button type="text" size="smart" @click="lookDetail(scope.$index, scope.row)">{{scope.row.houseNo}}</el-button>
	                        </template>
	                    </el-table-column>
                        <el-table-column :show-overflow-tooltip="true" prop="houseName" label="区域名称" align="center"></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" prop="houseFunction" label="区域功能" :formatter="getHouseFunction" align="center"></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" prop="houseStatus" label="区域状态" :formatter="getHouseStatus" align="center"></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" prop="propertyCard" label="产权证号" align="center"></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" prop="houseArea" label="建筑面积(/平方米)" width="140" align="center"></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" label="操作" width="120" align="center">
                            <template slot-scope="scope">
                                <el-button type="text" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                <el-button type="text" size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
            <el-pagination v-if="renovatePagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page=pageNum :page-sizes="[10, 15, 20, 25]" :page-size=pageSize layout="total, sizes, prev, pager, next, jumper" :total="totolNum">
            </el-pagination>
                </div>
        </div>
        <!--编辑弹出窗-->
        <el-dialog   :title="houseDailogTitle" :visible.sync="editTableVisible" style="width: 115%;">
            <el-form :model="editform" :rules="rules" ref="editform" class="w-80" label-width="140px" style="margin: 0 auto;">
                <el-form-item label="园区">
                    <el-input v-model="editform.park" placeholder="园区" disabled></el-input>
                </el-form-item>
                <el-form-item label="楼宇">
                    <el-input v-model="editform.building" placeholder="楼宇" disabled></el-input>
                </el-form-item>
                <el-form-item label="楼层">
                    <el-input v-model="editform.floor" placeholder="楼层" disabled></el-input>
                </el-form-item>
                <el-form-item label="区域名称" prop="houseName">
                    <el-input v-model="editform.houseName" placeholder="区域名称"></el-input>
                </el-form-item>

                <div class="zr-row-scatter">
                	<el-form-item label="区域状态" prop="houseStatus">
	                    <el-select v-model="editform.houseStatus" placeholder="区域状态" style="width: 200px;">
	                         <el-option v-for="item in houseStatusOption" :key = item.code :label="item.name" :value="item.code"></el-option>
	                    </el-select>
	                </el-form-item>

	                <el-form-item label="区域功能" prop="houseFunction">
	                    <el-select v-model="editform.houseFunction" placeholder="区域功能" style="width: 200px;">
	                        <el-option v-for="item in houseFunctionOption" :key = item.code :label="item.name" :value="item.code"></el-option>
	                    </el-select>
	                </el-form-item>
                </div>

                <el-form-item label="产权证号" prop="propertyCard">
                    <el-input v-model="editform.propertyCard" placeholder="产权证号"></el-input>
                </el-form-item>

                <el-form-item label="建筑面积(/平方米)" prop="houseArea">
                    <el-input type="number" v-model="editform.houseArea" placeholder="建筑面积(/平方米)"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="save('editform')" :disabled="isDisabled">确 定</el-button>
                <el-button @click="editTableVisible = false">取 消</el-button>
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
        <!-- 查看详情-->
        <el-dialog   title="查看详情" :visible.sync="detailVisible" width="700px" style="width: 115%;">
            <el-form :model="formInline" class="w-80" label-width="130px" style="margin: 0 auto;">
                <el-form-item label="园区">
                    <el-input v-model="formInline.park" placeholder="园区" disabled></el-input>
                </el-form-item>
                <el-form-item label="楼宇">
                    <el-input v-model="formInline.building" placeholder="楼宇" disabled></el-input>
                </el-form-item>
                <el-form-item label="楼层">
                    <el-input v-model="formInline.floor" placeholder="楼层" disabled></el-input>
                </el-form-item>
                <el-form-item label="区域名称">
                    <el-input v-model="formInline.houseName" placeholder="区域名称" disabled></el-input>
                </el-form-item>
                <div class="zr-row-scatter">
                	<el-form-item label="区域状态">
                        <el-input v-model="formInline.houseStatus" placeholder="区域状态" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="区域功能">
                        <el-input v-model="formInline.houseFunction" placeholder="区域功能" disabled></el-input>
                    </el-form-item>
                </div>
                <el-form-item label="产权证号">
                    <el-input v-model="formInline.propertyCard" placeholder="产权证号" disabled></el-input>
                </el-form-item>
                <el-form-item label="建筑面积(/平方米)">
                    <el-input v-model="formInline.houseArea" placeholder="建筑面积(/平方米)" disabled></el-input>
                </el-form-item>

            </el-form>
        </el-dialog>
        <!-- 树节点编辑 -->
        <el-dialog   title="树节点编辑" :visible.sync="editTreeNodeVisible" >
            <el-form :model="treeNode" :rules="rulesTreeNode" ref="treeNode22" class="demo-form-inline" label-width="80px">
                <el-form-item label="名称" prop="houseName">
                    <el-input v-model="treeNode.houseName" style="width:70%"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editTreeNode('treeNode22')">确 定</el-button>
                <el-button @click="editTreeNodeVisible = false">取 消</el-button>
            </span>
        </el-dialog>
        <div id="rMenu">
            <ul>
                <li id="m_add" @click="handleAddNode()" >增加同级菜单</li>
                <li id="m_check" @click="handleAddSubNode()" >增加子级菜单</li>
                <li id="m_unCheck" @click="handleRename()">重命名</li>
                <li id="m_del" @click="removeTreeNode()">删除</li>
            </ul>
        </div>
        </div>
    </div>
</template>
<script>
    import { api } from '@/libs'
    import { formatDate } from '../../../static/js/date.js'
    export default {
        data: function() {
            var checkAreaNumber = (rule, value, callback) => {
            	if(!value) {
            		return callback(new Error("建筑面积不能为空"));
            	} else {
            		const reg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/
            		if(reg.test(value)) {
            			callback();
            		} else {
            			return callback(new Error("只能输入大于0的数,小数保留两位！"));
            		}
            	}
            };
            return {
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
                rightClickNode: {},
                deviceTypeCode: "",
                subNodeModel: "",
                nodeModel: "",
                reName: "",
                treeKey: "",
                resTree: "",
                resTreeNodes: [],
                rMenu: "",
                //刷新分页
				renovatePagination: true,
                pageSize: 15,
                pageNum: 1,
                totolNum: 100,
                tableData: [],
                pageSize2: 15,
                pageNum2: 1,
                totolNum2: 100,
                owner: {},
                tenant: {},
                tableData2: [],
                upperId: "-1",
                clickFlag: 0,
                houseDailogTitle:"",
                formInline: {
                    user: '',
                    region: '',
                    value1: '',
                    value2: '',
                },
                rules: {
                    houseName: [
	                    {
	                        required: true,
	                        message: '请输入区域名称',
	                        trigger: 'blur'
	                    },
                        {
                            min: 1,
                            max: 20,
                            message: '区域名称长度不能大于 20 个字符',
                            trigger: 'blur'
                        }
                    ],
                    propertyCard: [
                        {
                            max: 20,
                            message: '产权证号长度不能大于 20 个字符',
                            trigger: 'blur'
                        }
                    ],
                    houseArea: [{
                        required: true,
                        validator: checkAreaNumber,
                        trigger: 'blur'
                    },
                        {
                            max: 10,
                            message: '建筑面积长度不能大于 10 个字符',
                            trigger: 'blur'
                        }
                    ],

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
                    houseName: [{
                        required: true,
                        message: '请输入名称',
                        trigger: 'blur'
                    }]
                },
                searchForm: {},
                fileList: [],
                kw: '',
                isDisabled: false,
                customerInfoId: null,
                treeRank: 1,
                houseFunctionOption: [],
                houseStatusOption: [],
            }
        },
        methods: {
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
                    this.$message.success('文件上传成功');
                })
            },
            getFont(treeId, node) {
                return node.font ? node.font : {};
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
                this.treeNode.ranks = this.rightClickNode.ranks;
                this.editTreeNodeVisible = true;
            },
            // 添加子级菜单
            handleAddSubNode() {
            	this.clickFlag = 1;
                this.treeNode = {};
                this.treeNode.id = null;
                this.treeNode.upperId = this.rightClickNode.id;
                if (this.rightClickNode.ranks == 1) {
                    this.treeNode.ranks = 2;
                } else if (this.rightClickNode.ranks == 2) {
                    this.treeNode.ranks = 3;
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
                this.treeNode.ranks = this.rightClickNode.ranks;
                this.editTreeNodeVisible = true;
            },
            // 树节点编辑
            editTreeNode(formrule) {
                this.$refs[formrule].validate((valid) => {
                	let rankNo = this.treeNode.ranks;
                	let nodeName = this.treeNode.houseName;
                	let checkNameReg=/^[\u4e00-\u9fa5_0-9]+$/;
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
                			this.$message.error("园区名称仅支持中文及数字");
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
                            houseNo: this.treeNode.ranks
                        }).then(res => {
                            this.editTreeNodeVisible = false;
                            if(this.clickFlag===0){
                            	if(parseInt(this.treeNode.ranks)===1){
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
	                    this.treeRank = firstNode.ranks;
					}else{
						var firstNode = this.resTree.getNodes()[0];
	                    this.resTree.selectNode(firstNode);
	                    this.upperId = this.resTree.getNodes()[0].realId;
	                    this.treeRank = firstNode.ranks;
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
                this.treeRank = treeNode.ranks;
                this.treeNode = treeNode;
                this.loadTable();
            },
            // 树节点右击
            onRightClick(event, treeId, treeNode) {
            	if(treeNode.ranks == 1) {
                	$("#m_add").html("添加园区");
                	$("#m_check").html("添加楼宇");
                }else if(treeNode.ranks == 2) {
                	$("#m_add").html("添加楼宇");
                	$("#m_check").html("添加楼层");
                }else if(treeNode.ranks == 3) {
                	$("#m_add").html("添加楼层");
                }
                if(!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
                    this.resTree.cancelSelectedNode();
                    this.showRMenu("root", event.clientX, event.clientY);

                } else if(treeNode && !treeNode.noR) {
                    this.resTree.selectNode(treeNode);
                    this.showRMenu("root", event.clientX, event.clientY);
                }

                if(treeNode.ranks == 3) {
                    if(!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
                        this.resTree.cancelSelectedNode();
                        this.showRMenu("node", event.clientX, event.clientY);

                    } else if(treeNode && !treeNode.noR) {
                        this.resTree.selectNode(treeNode);
                        this.showRMenu("node", event.clientX, event.clientY);
                    }
                }
                this.rightClickNode = treeNode;
            },
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
            loadTable() {
            	this.loading1 = true;
                this.$http('post', '/manage/houseProperty/find', {
                	houseName: this.searchForm.houseName,
                    houseFunction: this.searchForm.houseFunction,
                    keyword: this.searchForm.keyword,
                    remark: 'house',
                    treepath: this.upperId,
                    page: this.pageNum,
                    size: this.pageSize
                }).then(res => {
                	this.loading1=false;
                    this.tableData = res.data.body.content;
                    this.totolNum = Number(res.data.body.totalElements)
                })

            },
            handleEdit(index, row) {
                this.$httpGet('get', '/manage/houseProperty/findEntityById', {
                    id: row.id
                }).then(res => {
                	this.houseDailogTitle = "编辑区域";
                    this.editform = res.data.body;
                    if(res.data.body.houseArea) this.editform.houseArea = res.data.body.houseArea.toString()
                    this.editTableVisible = true;
                    // this.$refs['editform'].resetFields();
                });
            },
            lookDetail(index, row) {
                this.$httpGet('get', '/manage/houseProperty/all', {
                    id: row.id
                }).then(res => {
                    this.detailVisible = true;
                    this.formInline = res.data.body.house;
                    this.formInline.houseFunction = this.getHouseFunction({},{},this.formInline.houseFunction);
                    this.formInline.houseStatus = this.getHouseStatus({},{},this.formInline.houseStatus);
                    if(res.data.body.owner != null) {
                        this.owner = res.data.body.owner;
                    } else {
                        this.owner = {};
                    }
                    if(res.data.body.tenant != null) {
                        this.tenant = res.data.body.tenant;
                        this.customerInfoId = res.data.body.tenant.id;
                        this.loadTable2();
                    } else {
                        this.tenant = {};
                        if (res.data.body.owner != null) {
                            this.customerInfoId = res.data.body.owner.id;
                            this.loadTable2();
                        } else {
                            this.tableData2 = [];
                            this.totolNum2 = 0;
                        }
                    }
                });

            },
            loadTable2() {
                this.$http('post', '/manage/customerEmployee/list', {
                    name: this.kw,
                    customerInfoId: this.customerInfoId,
                    page: this.pageNum2,
                    size: this.pageSize2,
                }).then(res => {
                    this.tableData2 = [];
                    this.totolNum2 = 0;
                    this.tableData2 = res.data.body.content;
                    this.totolNum2 = Number(res.data.body.totalElements)
                })
            },
            add() {
                if (this.treeRank == 3) {
                	this.houseDailogTitle = "新增区域";
                    this.editform = {};
                    let house3 = this.treeNode.name;
                    let house2 = this.treeNode.getParentNode().name;
	            	let house1 = this.treeNode.getParentNode().getParentNode().name;
	            	this.editform.park = house1;
	            	this.editform.building = house2;
	            	this.editform.floor = house3;
                    this.editTableVisible = true;
                } else {
                    this.$message.warning('请选择楼层后进行新增区域');
                }
            },
            handleDelete(index, row) {
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
            deleteRow() {
                this.$httpGet('get', '/manage/houseProperty/del', {
                    id: this.deleteIds
                }).then(res => {
                    this.deleteVisible = false;
                    this.loadTable()
                })
            },
            save(formrule) {
            	var pId = this.upperId;
            	if (this.editform.id != null) {
            	    pId = this.editform.upperId;
                }
            	self.errorMsg = '';

                this.$refs[formrule].validate((valid) => {
                    if(valid) {
                        this.isDisabled = true;
                        this.$httpPost('/manage/houseProperty/saveorupdate', {
                            attachment: this.editform.attachment,
                            remark: 'house',
                            id: this.editform.id,
                            upperId: pId,
                            houseName: this.editform.houseName,
                            houseNum: this.editform.houseNum,
                            houseStatus: this.editform.houseStatus,
                            houseArea: this.editform.houseArea,
                            makeHouseTime: this.editform.makeHouseTime,
                            issueCertificateTime: this.editform.issueCertificateTime,
                            houseFunction: this.editform.houseFunction,
                            houseNo: this.editform.houseNo,
                            houseInnerArea: this.editform.houseInnerArea,
                            publicArea: this.editform.publicArea,
                            contractArea: this.editform.contractArea,
                            payArea: this.editform.payArea,
                            usedArea: this.editform.usedArea,
                            propertyArea: this.editform.propertyArea,
                            functionCoefficient: this.editform.functionCoefficient,
                            publicCoefficient: this.editform.publicCoefficient,
                            assortArea: this.editform.assortArea,
                            watermeterNo: this.editform.watermeterNo,
                            gasMeterNo: this.editform.gasMeterNo,
                            ammeterNo: this.editform.ammeterNo,
                            propertyCard: this.editform.propertyCard,
                            park: this.editform.park,
                            building: this.editform.building,
                            floor: this.editform.floor,
                        }).then(res => {
                            this.editTableVisible = false;
                            this.isDisabled = false;
                            this.loadTable();
                        })
                    } else {
                        return false;
                    }
                });
            },
            handleSizeChange(val) {
                if (this.totolNum > 0) {
                    this.pageSize = val;
                    this.loadTable();
                }
            },
            handleCurrentChange(val) {
                if (this.totolNum > 0) {
                    this.pageNum = val;
                    this.loadTable();
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
                if (this.treeRank == 3) {
                    if(this.checkedArr.length > 1 || this.checkedArr.length == 0) {
                        this.$message.error('只能类似创建一条');
                    } else {
                        this.$httpGet('get', '/manage/houseProperty/findEntityById', {
                            id: this.checkedArr[0].id
                        }).then(res => {
                            this.editform = res.data.body;
                            this.editform.id = null;
                            this.editTableVisible = true
                        });
                    }
                } else {
                    this.$message.warning('选择楼层才能创建房间');
                }
            },
            searchTable() {
            	this.pageNum = 1;
            	this.renovatePagination = false;
                this.$http('post', '/manage/houseProperty/find', {
                    houseName: this.searchForm.houseName,
                    houseFunction: this.searchForm.houseFunction,
                    keyword: this.searchForm.keyword,
                    treepath: this.upperId,
                    remark: 'house',
                    page: this.pageNum,
                    size: this.pageSize
                }).then(res => {
                    this.tableData = res.data.body.content;
                    this.totolNum = Number(res.data.body.totalElements)
                    this.renovatePagination = true
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
            // 导出Excel
            exportExcel() {
                window.location.href = api.baseUrl + "/manage/houseProperty/exportExcel?ids=" + this.deleteIds + '&token=' + window.localStorage.csmpToken;
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
            handleExceed(files, fileList) {
                // this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
                this.$message.warning('当前限制选择 1 个文件');
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`);
            },
            // 获取房间功能
            getHouseFunction(row, column, cellValue) {
                var result = '';
                if (cellValue == 'qlsy') {
                    result = '裙楼商业';
                } else if (cellValue == 'xzl') {
                    result = '写字楼';
                }
                return result;
            },
            // 获取房间状态
            getHouseStatus(row, column, cellValue) {
                var result = '';
                if (cellValue == 'yz') {
                    result = '已租';
                } else if (cellValue == 'xz') {
                    result = '闲置';
                } else if (cellValue == 'yd') {
                    result = '预定';
                }
                return result;
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
            this.$http('post', '/system/user/dict/findListByType', {
                typekey: "areaFunction",
            }).then(res => {
                this.houseFunctionOption = res.data.body;
            });
            this.$http('post', '/system/user/dict/findListByType', {
                typekey: "areaStatus",
            }).then(res => {
                this.houseStatusOption = res.data.body;
            });
            console.log('111',this.$root)
        },
    }
</script>

<style scoped>
</style>
