<template>
    <div class="wrap">
        <div class="subContent">
            <div class="tableWrap">
                <!--搜索功能-->
                <el-form :inline="true" :model="searchForm" class="demo-form-inline zr-row-scatter">
                    <div class="zr-row">
                        <el-button type="primary" @click="toEdit(0)">新增</el-button>
                        <el-button type="primary" @click="toDelete()">批量删除</el-button>
                        <!--<el-button type="primary" @click="search()">刷新</el-button>-->
                    </div>
                    <div class="zr-row">
                        <el-form-item label="">
                            <!-- 会议室位置 -->
                            <el-input v-model="searchForm.meetRoomArea" clearable placeholder="会议室位置"></el-input>
                        </el-form-item>
                        <el-form-item>
							<el-input placeholder="输入名称，负责人" v-model="searchForm.keyword" clearable></el-input>
						</el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="search('param')">搜索</el-button>
                        </el-form-item>
                    </div>
                </el-form>
                <!--数据表格渲染-->
                <el-table ref="table" stripe :data="tableData" style="width: 100%" @selection-change="onSelect">
                    <!-- <el-table-column type="selection" width="60"></el-table-column> -->
                    <el-table-column type="selection" width="60" disabled='true' align="center"></el-table-column>
                    <el-table-column show-overflow-tooltip type="index" label="序号" width="50" align="center"></el-table-column>
                    <!-- 会议室名称 -->
                    <!--<el-table-column prop="meetRoomName" label="会议室名称"></el-table-column>-->
                    <!-- 会议室名称 -->
                    <el-table-column show-overflow-tooltip prop="meetRoomName" label="会议室名称" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" size="smart" @click="$router.push({path:'/meetRoom/meetRoomDetail',query:{meetRoomInfoId:scope.row.id}})">{{scope.row.meetRoomName}}</el-button>
                        </template>
                    </el-table-column>
                    <!-- 会议室位置 -->
                    <el-table-column show-overflow-tooltip prop="meetRoomArea" label="会议室位置" align="center"></el-table-column>
                    <!-- 容纳人数 -->
                    <el-table-column show-overflow-tooltip prop="meetRoomCapacity" label="容纳人数" align="center"></el-table-column>
                    <!-- 单价 -->
                    <el-table-column show-overflow-tooltip prop="unitPrice" label="单价(元/小时)" align="center"></el-table-column>
                    <!-- 所含设备 -->
                    <el-table-column show-overflow-tooltip prop="deviceId" label="所含设备" :formatter="deviceFormatter" align="center"></el-table-column>
                    <!-- 负责人名字 -->
                    <el-table-column show-overflow-tooltip prop="principalName" label="负责人" align="center"></el-table-column>
                    <!-- 负责人电话 -->
                    <el-table-column show-overflow-tooltip prop="principalTel" label="负责人电话" align="center"></el-table-column>
                    <!-- 状态（0：启用，1：禁用） -->
                    <el-table-column show-overflow-tooltip prop="status" :formatter="statusFormatter" label="状态" align="center"></el-table-column>
                    <el-table-column show-overflow-tooltip label="操作" width="180" align="center">

                    	<template slot-scope="scope">
                    		<el-button type="text" size="mini" :disabled="scope.row.level !== 0"  @click="toEdit(1, scope.$index, scope.row)">编辑</el-button>
                        	<el-button @click.native.prevent="toEnable(scope.$index, scope.row)" type="text" size="mini" v-if="scope.row.status == 1">
                                       	 启用
                            </el-button>
                            <el-button @click.native.prevent="toDisable(scope.$index, scope.row)" :disabled="scope.row.level !== 0" type="text" size="mini" v-else>
                                        	禁用
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页-->
                <el-pagination v-if="renovatePagination" @size-change="onSizeChange" @current-change="onCurrentChange" :current-page="pageNum" :page-sizes="[10, 15, 20, 25]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totolNum">
                </el-pagination>
            </div>

            <!--编辑弹出窗-->
            <el-dialog :title="isDetail?'查看详情':(editform.id?'编辑':'新增')" :visible.sync="formDialogVisible" :before-close="close" width="60%">
                <el-form  :model="editform" :rules="rules" ref="editform"  label-width="100px">
                        <el-col :span="24">
                            <el-form-item label="会议室名称" prop="meetRoomName">
                                <!-- 会议室名称 -->
                                <el-input v-model="editform.meetRoomName" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <!--<el-form-item label="会议室位置" prop="meetRoomArea">
                                <el-input v-model="editform.meetRoomArea" :disabled="isDetail"></el-input>
                            </el-form-item>-->
                            <el-form-item label="会议室位置" prop="meetRoomArea">
								<el-input v-model="editform.meetRoomArea" v-on:click.native="selectHouse" :disabled="isDetail"  placeholder="会议室位置"></el-input>
							</el-form-item>
                        </el-col>
                        <el-col :span="12" class="zr-row">
                            <el-form-item label="面积" prop="meetRoomAcreage">
                                <!-- 面积 -->
                                <el-input v-model="editform.meetRoomAcreage" :disabled="isDetail" type="number"></el-input>
                            </el-form-item>
                            <div class="m-t-5 m-l-5">(平方米)</div>
                        </el-col>
                        <el-col :span="12" class="zr-row">
                            <el-form-item label="容纳人数" prop="meetRoomCapacity">
                                <!-- 容纳人数 -->
                                <el-input v-model="editform.meetRoomCapacity" :disabled="isDetail" type="number"></el-input>
                            </el-form-item>
                            <div class="m-t-5 m-l-5">人</div>
                        </el-col>
                        <el-col :span="24">
                            <!--<el-form-item label="所含设备" prop="deviceId">
                                <el-input v-model="editform.deviceId" :disabled="isDetail"></el-input>
                            </el-form-item>-->
                            <el-form-item label="所含设备" prop="deviceId">
	                            	<el-checkbox-group   v-model="deviceId" @change="deviceIdChange" :disabled="isDetail">
									    <div class="zr-row-wrap">
                                            <el-checkbox v-for="(item,index) in locationList" :label="item.id" :key="index">{{item.name}}</el-checkbox>
                                        </div>
									</el-checkbox-group>
								</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="是否收费" prop="chargeSituation">
                            	<el-radio-group v-model="editform.chargeSituation" @change="chargeSituationChange" :disabled="isDetail">
                                    <el-radio label="0">是</el-radio>
                                    <el-radio label="1">否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" class="zr-row">
                            <el-form-item label="单价" prop="unitPrice">
                                <!-- 单价 -->
                                <el-input v-model="editform.unitPrice" :disabled="unitPriceDetail" type="number"></el-input>
                            </el-form-item>
                            <div class="m-t-5 m-l-5">(元/小时)</div>
                        </el-col>

                        <!--<el-col :span="12">
                            <el-form-item label="负责人id" prop="principalId">
                                <el-input v-model="editform.principalId" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>-->
                        <el-col :span="12">
                            <el-form-item label="负责人" prop="principalName">
                                <!-- 负责人名字 -->
                                <el-input v-model="editform.principalName" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="负责人电话" prop="principalTel">
                                <!-- 负责人电话 -->
                                <el-input v-model="editform.principalTel" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="会议室简介" prop="meetRoomIntroduction">
                                <!-- 会议室简介 -->
                                <el-input maxlength="100" type="textarea" :rows="5"  v-model="editform.meetRoomIntroduction" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <!-- <el-form-item label="会议室照片" prop="photoId">
								<PhotoUpload v-if="formDialogVisible" v-model="editform.photoId" :upload="upload"></PhotoUpload>
                            </el-form-item> -->
                            <el-form-item label="会议室照片:">
                                <el-upload
                                    class="upload-demo"
                                    ref="listUpload"
                                    action="123"
                                    list-type="picture-card"
                                    :auto-upload="false"
                                    :show-file-list="false"
                                    accept="image/jpeg,image/jpg,image/png"
                                    :on-change="fileChange"
                                    :on-remove="handleRemove"
                                    :on-preview="handlePreview"
                                    :before-upload="beforeupload">
                                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                                    <i v-else class="el-icon-plus"></i>
                                    <!-- <i class="el-icon-upload"></i>
                                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                                    <div class="el-upload__tip" slot="tip" style="color: orange;">只能上传jpg/png文件</div> -->
                                </el-upload>
                            </el-form-item>
                        </el-col>

                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="save()">确 定</el-button>
                    <el-button @click="close()">取 消</el-button>
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


             <!--禁用提示框-->
            <el-dialog   title="提示" :visible.sync="disableVisible" width="30%">
                <span>确定禁用？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="disableRow()">确 定</el-button>
                    <el-button @click="disableVisible = false">取 消</el-button>
                </span>
            </el-dialog>

             <!--启用提示框-->
            <el-dialog   title="提示" :visible.sync="enableVisible" width="30%">
                <span>确定启用？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="enableRow()">确 定</el-button>
                    <el-button @click="enableVisible = false">取 消</el-button>
                </span>
            </el-dialog>


             <!-- 选择房产信息 -->
			<el-dialog title="会议室位置" :visible.sync="houseTreeVisible" @close="close2">
				<div v-if="showTree">
					<el-tree :data="houseTreeData" show-checkbox ref="houseTreeData" node-key="id" :default-expanded-keys="checkedKeys" :auto-expand-parent="true" :check-strictly="true" :props="defaultProps">
					</el-tree>
				</div>
				<el-button type="primary" style="float: right" @click="selectHouseSave()">确定</el-button>
				<el-button style="float: right;margin-right: 10px" @click="houseTreeVisible = false">取消</el-button>
			</el-dialog>
        </div>
    </div>
</template>

<script>
	import formValidation from '@/config/formValidation.js'
	import { api } from '@/libs'
    import { axiosHttp } from '@/libs'
    export default {
        // 变量初始化定义
        data: function() {
            var checkAreaNumber = (rule, value, callback) => {
            	if(!value) {
            		return callback(new Error("面积不能为空"));
            	} else {
            		const reg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/
            		if(reg.test(value)) {
            			callback();
            		} else {
            			return callback(new Error("只能输入大于0的数,小数保留两位！"));
            		}
            	}
            };
            var checkDJNumber = (rule, value, callback) => {
                if(this.editform.chargeSituation !== '1'){
                  if(!value ) {
                  	return callback(new Error("单价不能为空"));
                  } else {
                  	const reg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/
                  	if(reg.test(value)) {
                  		callback();
                  	} else {
                  		return callback(new Error("只能输入大于0的数,小数保留两位！"));
                  	}
                  }
               }else{
                   callback();
               }


            };
            var checkNumber = (rule, value, callback) => {
            	if(!value) {
            		return callback(new Error("容纳人数不能为空"));
            	} else {
            		const reg = /^([1-9][0-9]*)$/
            		if(reg.test(value)) {
            			callback();
            		} else {
            			return callback(new Error("只能输入大于0的整数！"));
            		}
            	}
            };
            return {
                uploadId: '',
                imageUrl: '',
                uploadForm: {
                    file: ''
                },
                fId: 0,
            	download :api.fileserver + 'download?fileId=',
            	action:api.fileserver+'img/upload',
                tableData: [],
                locationList:[],
                checkedKeys: [],
                defaultProps: {
					children: 'children',
					label: 'label'
				},
				//上传图片的对象
				upload: {
				},
                deviceId:[],
				houseTreeData: [],
				unitPriceDetail:false,
                pageNum: 1,
                pageSize: 15,
                totolNum: 0,
                //刷新分页
                renovatePagination: true,
                showTree: true,
                houseTreeVisible: false,
                searchForm: {},
                deleteVisible: false,
                //是否为详情，并设置是否disable
                isDetail:false,
                formDialogVisible :false,
                dialogImageUrl: '',
        		dialogVisible: false,
                editform: {},
                deleteIds: '',
                checkedArr: [],
                disableVisible:false,
                enableVisible:false,
                // 校验
                rules: {
                // 会议室名称
                meetRoomName: [{
                        required: true,
                        message: '请输入会议室名称',
                        trigger: 'blur'
                    }],
                // 会议室位置
                meetRoomArea: [{
                        required: true,
                        message: '请选择会议室位置',
                        trigger: 'change'
                    }],
                // 容纳人数
                meetRoomCapacity: [{
                        required: true,
                        validator: checkNumber,
                        trigger: 'blur'
                    }],
                     // 面积
                meetRoomAcreage: [{
                        required: true,
                        validator: checkAreaNumber,
                        trigger: 'blur'
                    }],
                principalTel: [{
                        required: true,
                        validator: formValidation.mobile,
                        trigger: 'blur'
                    }],
                   //单价
                unitPrice: [{
                        required: true,
                        validator: checkDJNumber,
                        trigger: 'blur'
                    }],


                },
            }

        },
        // 页面加载时执行
        created: function() {
            this.search();
            this.loadhouseTree();
            this.showDeviceTree()
        },
        watch: {
            houseTreeVisible(val){
                !val&&setTimeout(() => {
                    if(this.showTree) this.$refs.houseTreeData.setCheckedKeys([]);
				},0);
			}
		},
        // 自定义方法
        methods: {
            // 上传
            handleUpload(){
                let formData = new FormData()
                formData.append('id', this.uploadId);
                formData.append('fId', this.fId);
                formData.append('file', this.uploadForm.file)
                let config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                };
                //然后通过下面的方式把内容通过axios来传到后台
                //下面的this.$reqs 是在主js中通过Vue.prototype.$reqs = axios 来把axios赋给它;
                axiosHttp.post("/serveorder/meetRoomInfo/uploadCertificates", formData, config).then(res => {
                    this.search();
                    this.$forceUpdate()
                    this.formDialogVisible = false;
                }).catch(error => {
                    // this.$message.error('请选择附件')
                })
            },
            fileChange(file) {
                this.uploadForm.file = file.raw
                this.imageUrl = URL.createObjectURL(file.raw)
            },
            handleRemove(file) {
                console.log(file)
            },
            handlePreview(file) {
                console.log(file)
            },
            //阻止upload的自己上传，进行再操作
            beforeupload(file) {
                //创建临时的路径来展示图片
                var windowURL = window.URL || window.webkitURL;
                this.src = windowURL.createObjectURL(file);
            },
            //覆盖默认的上传行为
            httprequest() {

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
                if(type=='param'){
                    this.pageNum = 1;
                    this.renovatePagination = false;
                }
                axiosHttp.post('/serveorder/meetRoomInfo/find', {
                    // 会议室位置
                    meetRoomArea: this.searchForm.meetRoomArea,
                    //关键字
                    keyword:this.searchForm.keyword,
                    page: this.pageNum,
                    size: this.pageSize

                }).then(res => {
                    this.tableData = res.content;
                    this.totolNum = Number(res.totalElements);
                    this.renovatePagination = true
            })
            },
             // 设备名称
            deviceFormatter: function(row, column, cellValue) {
            	if(cellValue && cellValue.length>0){
            		let deviceIds = cellValue.split(',');
            		let arr = []
            		deviceIds.forEach(item => {
	                    const obj = this.locationList.find(locationItem => locationItem.id === item)
	                    if(obj) {
	                        arr.push(obj.name);
	                    }
	                })
            		return arr.join(',');
            	}
            },
            //加载设备
            showDeviceTree(){
            	axiosHttp.post('/serveorder/meetRoomInfo/deviceDict', {
                    }).then(res => {
                        res.forEach(item=>{
                    })
                        this.locationList = res;
                })
            },
            //设备选择
            deviceIdChange(val){

            	this.editform.deviceId = val.join()

            },
            //加载位置树
			loadhouseTree() {
				this.$httpPost('/manage/houseProperty/tree').then(res => {
					let data = res.data.body;
					if(data!=null) {
                        for (let i = 0; i < data.length; i++) {
                            data[i]['disabled'] = true;
                            if (data[i].children != null) {
                                for (let j = 0; j < data[i].children.length; j++) {
                                    data[i].children[j]['disabled'] = true;
                                    if (data[i].children[j].children != null) {
                                        for (let k = 0; k < data[i].children[j].children.length; k++) {
                							data[i].children[j].children[k]['disabled'] = true;
                                        }
                                    }
                                }
                            }
                        }
                    }
					this.houseTreeData = data;
				}, function(response) {

				});
			},

            selectHouse() {
				this.houseTreeVisible = true;
				this.showTree = true
				this.$nextTick(() => {
					if(this.editform.areaId&&this.editform.areaId.length>0){
						let areaId = this.editform.areaId.split(",");
						this.$refs.houseTreeData.setCheckedKeys([])
						for(let i = 0; i < areaId.length; i++) {
							this.$refs.houseTreeData.setChecked(areaId[i], true);
							this.checkedKeys.push(areaId[i])
                        }
					}
				});
			},
			//保存位置
			selectHouseSave() {
                let transArr = this.$refs.houseTreeData.getCheckedKeys()
                if (transArr.length>1) {
                    this.$message.error("请选择一个位置!")
                    return
                }
				let areaId = this.$refs.houseTreeData.getCheckedKeys().toString();
				this.editform.areaId = areaId;
				var houseName = '';
				this.$httpGet('get', '/manage/houseProperty/findAreaNameByIds', {
					id: areaId
				}).then(res => {
					this.editform.meetRoomArea = res.data.body.areaName;
					this.houseTreeVisible = false;

				});

			},
			chargeSituationChange(value){
				if("0"== value ){
					this.unitPriceDetail = false;
				}else{
                    this.editform.unitPrice=0;
					this.unitPriceDetail = true;
				}
			},
            // 弹出修改弹出框
            toEdit(fId, index, row) {
                this.editform = {chargeSituation:'0'};
                this.deviceId = [];
                this.formDialogVisible = true;
                this.isDetail=false;

                if (row && row.level === 0) {
                    this.uploadId = row.id
                    if(row.photoId) {
                        this.fId = fId
                        this.imageUrl = api.baseUrl + "/serveorder/meetRoomInfo/getFileUrl?id=" + row.id
                    } else {
                        this.fId = 0
                    }
                    this.editform = Object.assign({itemIndex:index},row);
                    this.chargeSituationChange(row.chargeSituation);
                    if(row.deviceId) this.deviceId = row.deviceId.split(",");

                } else if(row && row.level>0){
                    this.$message.error('该会议室有未使用订单,不允许执行此操作!')
                    return
                } else {
                    this.$nextTick(() => {
                        this.$refs.editform.resetFields();
                    })
                }

            },
            // 修改 新增 保存
            save() {
                this.$refs.editform.validate((valid) => {
                    if(valid) {
                        axiosHttp.post('/serveorder/meetRoomInfo/save', {
                        // 主键
                        id: this.editform.id,
                        // 会议室名称
                        meetRoomName: this.editform.meetRoomName,
                        // 会议室位置
                        meetRoomArea: this.editform.meetRoomArea,
                         // 面积
                        meetRoomAcreage: this.editform.meetRoomAcreage,
                        // 容纳人数
                        meetRoomCapacity: this.editform.meetRoomCapacity,
                        // 是否收费（0：收费，1：不收费）
                        chargeSituation: this.editform.chargeSituation,
                        // 单价
                        unitPrice: this.editform.unitPrice,
                        // 所含设备id
                        deviceId: this.editform.deviceId,
                        // 负责人id
                        principalId: this.editform.principalId,
                        // 负责人名字
                        principalName: this.editform.principalName,
                        // 会议室照片
                        photoId: this.editform.photoId,
                        // 负责人电话
                        principalTel: this.editform.principalTel,
                        // 状态（0：启用，1：禁用）
                        status: this.editform.status,
                        // 会议室简介
                        meetRoomIntroduction: this.editform.meetRoomIntroduction,
                        // 其他服务
                        otherService: this.editform.otherService,
                        // 备注
                        remark: this.editform.remark,
                        }).then(res => {
                            this.imageUrl = ''
                            this.uploadId = res.id
                            this.handleUpload()
                            this.search();
                            this.formDialogVisible = false;
                    })

                } else {
                    return false;
            }
            });
            },
             // 表格显示 状态渲染 (0启用、1禁用)
            statusFormatter: function(row, column, cellValue) {
                switch (row.status){
                    case '1':
                        return "禁用";
                    default:
                        return "启用";
                }
            },
            // 删除操作赋值删除项  并弹窗
            toDelete(index, row) {
                if(row) {
                    this.deleteIds = row.id;
                    this.deleteVisible = true;
                } else {
                    if (this.$refs.table.store.states.selection.length > 0) {
                        let arr = this.$refs.table.store.states.selection;
                        for(var i = 0; i < arr.length; i++) {
                            if( arr[i].level > 0){
                                  this.$message.error('所选会议室包含未使用订单,不允许执行此操作!')
                                  return
                                }

                            }
                        this.deleteVisible = true;
                    } else {
                        this.$message.error('请至少选择一条数据');
                    }
                }

            },
            // 删除 行  包括单选和多选
            deleteRow() {
                console.log(this.deleteIds)
                this.$httpPost('/serveorder/meetRoomInfo/delete', {
                    id: this.deleteIds
                }).then(res => {
                    this.deleteVisible = false;
                this.deleteIds = "";
                this.search();
            })
            },
            // 关闭弹出框
            close() {
                this.formDialogVisible = false;
                this.$refs.editform.resetFields();
                this.showTree = false
                this.imageUrl = ''
            },
            close2() {
                this.showTree = false
            },
            // 禁用
            toDisable(index, row) {
                if (row.level>0) {
                    this.$message.error('该会议室有未使用订单,不允许执行此操作!')
                    return
                } else {
                    if(row) {
                        this.deleteIds = row.id;
                        this.disableVisible = true;
                    } else {
                        if (this.$refs.table.store.states.selection.length > 0) {
                            this.disableVisible = true;
                        } else {
                            this.$message.error('请至少选择一条数据');
                        }
                    }
                }
            },
             // 启用
            toEnable(index, row) {
                if(row) {
                    this.deleteIds = row.id;
                    this.enableVisible = true;
                } else {
                    if (this.$refs.table.store.states.selection.length > 0) {
                        this.enableVisible = true;
                    } else {
                        this.$message.error('请至少选择一条数据');
                    }
                }

            },
            // 启用
            enableRow() {
                axiosHttp.post('/serveorder/meetRoomInfo/save', {
                    id: this.deleteIds,
                    status:'0'
                }).then(res => {
                    this.enableVisible = false;
                this.deleteIds = "";
                this.search();
             })
            },
            // 禁用
            disableRow() {
                axiosHttp.post('/serveorder/meetRoomInfo/save', {
                    id: this.deleteIds,
                    status:'1'
                }).then(res => {
                    this.disableVisible = false;
                this.deleteIds = "";
                this.search();
             })
            },
            // 表格选择改变事件
            onSelect(val) {
                this.checkedArr = val;
                val.forEach(element => {
                        let idsArr = [];
                        for(var i = 0; i < val.length; i++) {
                            idsArr.push(val[i].id)
                        }
                        this.deleteIds = idsArr.join(',');

                });
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
            },
        }
    }
</script>
<style lang="less" scoped>
.el-checkbox{
    margin: 0px 10px;
}
.el-checkbox+.el-checkbox {
    margin: 0px 10px;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
