
<template>
    <div class="wrap">
        <div class="subContent">
            <div class="tableWrap">
                <!--搜索功能-->
                <el-form :inline="true" :model="searchForm" class="demo-form-inline zr-row-scatter">
                    <div class="zr-row">
                        <el-button type="primary" @click="toEdit()">新增保养</el-button>
                        <el-button type="primary" @click="toDelete()">批量删除</el-button>
                        <el-button type="primary" @click="exportExcel()">导出</el-button>
                    </div>
                    <div class="zr-row">
                    	<el-form-item label="">
                    		<el-date-picker v-model="searchForm.alarmTime" type="datetimerange" range-separator="至" start-placeholder="保养开始日期" end-placeholder="保养结束日期" format="yyyy-MM-dd" align="right">
                            </el-date-picker>
		                </el-form-item>
                        <el-form-item label="">
                            <!-- 保养类型 1周期保养 2动态运行保养 -->
                            <el-select v-model="searchForm.maintainType" placeholder="保养类型" clearable>
					        	<el-option label="静态保养" value="1"></el-option>
					        	<el-option label="动态保养" value="2"></el-option>
					        </el-select>
                        </el-form-item>
                        <!-- <el-form-item label="">

                            <el-select v-model="searchForm.maintainType" placeholder="设备分类" clearable>
					        	<el-option label="周期保养" value="1"></el-option>
					        	<el-option label="动态运行保养" value="2"></el-option>
					        </el-select>
                        </el-form-item> -->
                        <el-form-item label="">
                            <el-input placeholder="关键字" v-model="searchForm.keyword" clearable ></el-input>
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
                     <!-- 保养设备 -->
                    <el-table-column :show-overflow-tooltip="true" prop="deviceName" label="保养设备" align="center"></el-table-column>
                    <!-- 设备编号 -->
                    <el-table-column :show-overflow-tooltip="true" prop="deviceId" label="设备编号" align="center"></el-table-column>
                    <!-- 保养开始日期 -->
                    <el-table-column :show-overflow-tooltip="true" prop="startTime" label="保养开始日期" :formatter="dateFormat"  align="center"></el-table-column>
                    <!-- 保养结束日期 -->
                    <el-table-column :show-overflow-tooltip="true" prop="endTime"   label="保养结束日期" :formatter="dateFormat"  align="center"></el-table-column>
                    <!-- 保养负责人 -->
                    <el-table-column :show-overflow-tooltip="true" prop="maintainUserId" label="保养负责人"  align="center"></el-table-column>
                    <!-- 保养描述
                    <el-table-column :show-overflow-tooltip="true" prop="description" label="保养描述"></el-table-column> -->
                    <!-- 保养类型 1周期保养 2动态运行保养 -->
                    <el-table-column :show-overflow-tooltip="true" prop="maintainType" :formatter="getMaintainType" label="保养类型" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" label="操作" width="100" align="center">
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

            <!--编辑弹出窗-->
            <el-dialog   :title="isDetail?'查看详情':(editform.id?'编辑':'新增')" :visible.sync="formDialogVisible" :before-close="close" width="950px">
                <el-form  :model="editform" :rules="rules" ref="editform"  label-width="120px">
                        <el-row class="m-t-10">
							<span style="font-weight: 600;">设备信息</span>
							<div class="b-0 p-20">
								<el-col :span="8">
		                            <el-form-item label="设备编号" prop="deviceId">
		                                <!-- 设备编号 -->
		                                <el-input v-model="editform.deviceId" :disabled="isDetail||!!editform.id"  @blur.prevent="queryByDeviceCode()"></el-input>
		                            </el-form-item>
	                            </el-col>
	                            <el-col :span="8">
		                            <el-form-item label="设备专业" prop="deviceSystemName">
		                                <el-input v-model="editform.deviceSystemName" disabled></el-input>
		                            </el-form-item>
	                            </el-col>
	                            <el-col :span="8">
		                            <el-form-item label="设备子系统" prop="deviceSubSysName">
		                                <el-input v-model="editform.deviceSubSysName" disabled></el-input>
		                            </el-form-item>
		                        </el-col>
		                        <el-col :span="8">
		                            <el-form-item label="设备类别" prop="deviceTypeName">
		                                <el-input v-model="editform.deviceTypeName" disabled></el-input>
		                            </el-form-item>
		                        </el-col>
		                        <el-col :span="8">
		                            <el-form-item label="保养设备" prop="deviceName">
		                                <el-input v-model="editform.deviceName" disabled></el-input>
		                            </el-form-item>
	                            </el-col>
	                            <el-col :span="8">
		                            <el-form-item label="设备位置" prop="postion">
		                                <el-input v-model="editform.postion" disabled></el-input>
		                            </el-form-item>
	                            </el-col>
	                        </div>
						</el-row>
						<!-- <el-row class="m-t-10">
                            <span style="font-weight: 600;">保养配置</span>
							<div class="b-0 p-20">
								<el-col :span="12">
		                            <el-form-item label="保养类型" prop="maintainType">

		                                <el-select v-model="editform.maintainType" placeholder="保养类型" disabled >
					                        <el-option label="静态保养" value="1"></el-option>
					                        <el-option label="动态保养" value="2"></el-option>
					                    </el-select>
		                            </el-form-item>
		                        </el-col>
		                        <el-col :span="12">
		                            <el-form-item label="保养负责人" prop="maintainUserId">

		                                <el-input v-model="editform.maintainUserId" disabled></el-input>
		                            </el-form-item>
		                        </el-col>
		                        <el-col :span="24">
                                    <el-form-item label="配置内容" prop="content">

		                                <el-input type="textarea" :rows="2"  v-model="editform.content" disabled maxlength="100"></el-input>
		                            </el-form-item>
                                </el-col>
		                    </div>
						</el-row> -->


						<el-row class="m-t-10">
                            <span style="font-weight: 600;">保养信息</span>
							<div class="b-0 p-20">
								<el-col :span="12">
		                             <!-- 保养开始日期 -->
		                            <el-form-item label="保养开始日期" prop="startTime">
		                                <el-date-picker v-model="editform.startTime" type="date" value-format="timestamp"
		                                                format="yyyy-MM-dd" placeholder="保养开始日期" :disabled="isDetail">
		                                </el-date-picker>
		                            </el-form-item>
		                        </el-col>
		                        <el-col :span="12">
	                                <!-- 保养结束日期 -->
	                                <el-form-item label="保养结束日期" prop="endTime">
	                                    <el-date-picker v-model="editform.endTime" type="date" value-format="timestamp"
	                                            format="yyyy-MM-dd" placeholder="保养结束日期" :disabled="isDetail">
	                                    </el-date-picker>
	                                </el-form-item>
	                            </el-col>
		                        <el-col :span="24">
		                            <el-form-item label="保养人" prop="maintainPerson">
		                                <!-- 保养负责人 -->
		                                <el-input v-model="editform.maintainPerson"></el-input>
		                            </el-form-item>
		                        </el-col>
		                        <el-col :span="24">
                                    <el-form-item label="保养内容" prop="content">
		                                <!-- 保养内容 -->
		                                <el-input type="textarea" :rows="2" v-model="editform.content" :disabled="isDetail" maxlength="100"></el-input>
		                            </el-form-item>
                                </el-col>
		                    </div>
						</el-row>



                        <!--<el-row class="p-l-20 p-r-20">
                            <el-col :span="24">
                                <el-form-item label="保养内容">
                                    <el-input maxlength="100" type="textarea" :rows="2"  v-model="editform.content" :disabled="isDetail"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-col :span="24" v-if="!!this.editform.maintainConfigId && !! this.editform.maintainTaskId">
                        	保养项目
                        </el-col>-->
                        <!--数据表格渲染-->
                       <!-- <el-col :span="24" class="zr-column">
                            <div v-for="(item, index) in data0" :key="index" class="p-10 b-b-1">
                            	<div class="zr-row">
	                                <div class="zr-column-center">{{index + 1}}.</div>
	                                <div>
	                                    {{item.CONTENT}}<span v-if="item.IS_WHETHER">(必检项)</span>
	                                </div>
                            	</div>
                                <div class="m-t-5">
                                    <el-radio-group v-model="item.IS_CHECK">
                                        <el-radio :label="1">是</el-radio>
                                        <el-radio :label="0">否</el-radio>
                                    </el-radio-group>
                                </div>
                            </div>
                   		</el-col>-->
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
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import { axiosHttp } from "@/libs";
    export default {
        // 变量初始化定义
        data() {
        	var checkStartTime = (rule, value, callback) => {
				if(!value) {
					return callback(new Error("请选择保养开始日期"));
				} else {
					callback();
				}
			};
			var checkEndTime = (rule, value, callback) => {
				if(!value) {
					return callback(new Error("请选择保养结束日期"));
				} else {
					callback();
				}
			};
            return {
                indexNumber: 1,
                tableData: [],
                data0: [],
                pageNum: 1,
                pageSize: 15,
                totolNum: 0,
                //刷新分页
                renovatePagination: true,
                searchForm: {},
                deleteVisible: false,
                //是否为详情，并设置是否disable
                isDetail:false,
                formDialogVisible :false,
                editform: {},
                deleteIds: '',
                checkedArr: [],
                // 校验
                rules: {
                // 设备编号
                deviceId: [{
                        required: true,
                        message: '请输入设备编号',
                        trigger: 'blur'
                    }],
                // 保养类型 1周期保养 2动态运行保养
                maintainType: [{
                        required: true,
                        message: '请选择保养类型',
                        trigger: 'change'
                    }],
                // 保养开始日期
                startTime: [{
						required: true,
						validator: checkStartTime,
						trigger: 'blur'
					}],
                // 保养结束日期
                endTime: [{
						required: true,
						validator: checkEndTime,
						trigger: 'blur'
					}],
                // 保养内容
                content: [{
                        required: true,
                        message: '请输入保养内容',
                        max: 100,
                        message: '保养内容长度不能大于 100个字符',
                        trigger: 'blur'
                    }],
                },
            }

        },
        // 页面加载时执行
        created: function() {
            this.search();
        },
        // 自定义方法
        methods: {
            // 导出
            handleDataManage(arr) {
            this.indexNumber = 1
            let transArray = []
            arr.forEach(element => {
                let transObj = {
                    index: 0,
                    deviceName: '',
                    deviceId: '',
                    startTime: '',
                    endTime: '',
                    maintainUserId: '',
                    maintainType: ''
                }
                transObj.index = this.indexNumber++
                transObj.deviceName = element.deviceName
                transObj.deviceId = element.deviceId
                transObj.startTime = Vue.filter('dateFormat')(element.startTime,'yyyy-MM-dd hh:mm:ss')
                transObj.endTime = Vue.filter('dateFormat')(element.endTime,'yyyy-MM-dd hh:mm:ss')
                transObj.maintainUserId = (element.maintainUserId === null ? '' : element.maintainUserId)
                transObj.maintainType = (element.maintainType === '1' ? '静态保养' : (element.maintainType === '2' ? '动态保养' : ''))
                transArray.push(transObj)
            });
            //列标题，逗号隔开，每一个逗号就是隔开一个单元格
            let str = `序号,保养设备,设备编号,保养开始日期,保养结束日期,保养负责人,保养类型\n`;
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
            link.download =  "保养记录数据表.xls";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            },
            exportExcel() {
                if (this.checkedArr.length === 0) {
                    this.$confirm('确认要导出所有数据吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        axiosHttp.post('/manage/maintainEquipment/find',{
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
                let startTime="";
                let endTime="";
                if(this.searchForm.alarmTime != undefined) {
                    startTime = Vue.filter('dateFormat')(this.searchForm.alarmTime[0],'yyyy-MM-dd')
                    endTime = Vue.filter('dateFormat')(this.searchForm.alarmTime[1],'yyyy-MM-dd')
                }
                this.$httpPost('/manage/maintainEquipment/find', {
                    keyword: this.searchForm.keyword,
                    startTime: startTime,// 保养开始日期
                    endTime: endTime,// 保养结束日期
                    maintainType: this.searchForm.maintainType,// 保养类型 1周期保养 2动态运行保养
                    page: this.pageNum,
                    size: this.pageSize

                }).then(res => {
                    this.tableData = res.data.body.content;
                    this.totolNum = Number(res.data.body.totalElements);
                    this.renovatePagination = true
            })
            },
            // 弹出修改弹出框
            toEdit(index, row) {
                console.log(row)
            	this.data0 = []
            	this.editform = {};
				if(row){
			        this.editform = Object.assign({},row);
			        this.queryByDeviceCode();
			        if(!!this.editform.maintainConfigId && !! this.editform.maintainTaskId){
			        	this.$httpPost('/manage/maintainPoints/queryAllByMaintainConfigId', {
			                    maintainConfigId: this.editform.maintainConfigId,
			                    id:this.editform.maintainTaskId
			               }).then(res => {
								this.data0=res.data.body.data0;
			            	})
			        }

			    }
                this.formDialogVisible = true;
	            this.isDetail=false;
            },
            // 修改 新增 保存
            save() {
            	if(!this.editform.source){
                	this.editform.source = '2';
                }
                this.$refs.editform.validate((valid) => {
                    if(valid) {
	                    if(this.editform.startTime <= this.editform.endTime) {
	                        if(!!this.editform.maintainConfigId && !! this.editform.maintainTaskId){
	                        	let isSuccess = true
				            	this.data0.forEach(item => {
				            		if(item.IS_WHETHER === 1) {
				            			if(item.IS_CHECK === null){
				            				this.$message.error('必检项必须选择！')
				            				isSuccess = false
				            				return
				            			}
				            		}
				            	})
					           	if(!isSuccess) return false
				            	this.$httpPost('/manage/maintainTask/save', {
		                        id: this.editform.maintainTaskId,// 序号
		                        data0:this.data0,
		                        //source: '2',数据来源 1自动生成 2手动添加
		                        }).then(res => {
		                        	this.formDialogVisible = false;
		                        	this.search();
		                    	})
	                       	}
                            this.$httpPost('/manage/maintainEquipment/save', {
                            id: this.editform.id,// 序号
                            deviceId: this.editform.deviceId,// 设备编号
                            deviceName: this.editform.deviceName,// 设备编号
                            maintainType: this.editform.maintainType,// 保养类型 1周期保养 2动态运行保养
                            maintainUserId: this.editform.maintainUserId,// 保养负责人
                            maintainPerson: this.editform.maintainPerson,//保养人
                            startTime: this.editform.startTime,// 保养开始日期
                            endTime: this.editform.endTime,// 保养结束日期
                            content: this.editform.content,// 保养内容
                            source: this.editform.source,// 数据来源 1自动生成 2手动添加
                            deviceSystemId: this.editform.deviceSystemId,
                            deviceTypeName: this.editform.deviceTypeName,
                            }).then(res => {
                                this.formDialogVisible = false;
                                this.search();
                            })
                        }else {
                            this.$message.warning('结束日期不能早于开始日期')
                        }
                    } else {
                        return false;
            		}
            	});
            },
            // 关闭弹出框
            close() {
                this.formDialogVisible = false;
                this.$refs.editform.resetFields();
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
                this.$httpPost('/manage/maintainEquipment/delete', {
                    id: this.deleteIds
                }).then(res => {
                    this.deleteVisible = false;
                this.deleteIds = "";
                this.search();
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
            // 弹出查看详情弹出框
            queryByDeviceCode() {
            	this.$httpGet('get', '/manage/device/queryByDeviceCodeList', {
					deviceCode: this.editform.deviceId
				}).then(res => {
					if (res.data.code == 0) {
                        let device = res.data.body;
						if(device){
							this.editform.deviceSystemName  = device.deviceSystemName;
							this.editform.deviceSystemId  = device.deviceSystemCode;
							this.editform.deviceSubSysName  = device.deviceSubSysName;
							this.editform.deviceTypeName  = device.deviceTypeName;
							this.editform.deviceName  = device.deviceName;
							this.editform.postion  = device.postion;
							//this.editform.maintainUserId =  device.createUserId;
						}else{
							this.$message.error('设备编号不存在');
	                    	return;
						}
						this.$forceUpdate();
                    } else {
                    }

				})
            },
            // 获取房间状态
            getMaintainType(row, column, cellValue) {
                var result = '';
                if (cellValue == '1') {
                    result = '静态保养';
                } else if (cellValue == '2') {
                    result = '动态保养';
                }
                return result;
            },
            // 时间格式化
            dateFormat(row, column, cellValue) {
                if(cellValue!=null){
                    return Vue.filter('dateFormat')(cellValue,'yyyy-MM-dd')
                }
            }
        }
    }
</script>
