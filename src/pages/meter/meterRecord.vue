<template>
    <div class="wrap">
        <div class="subContent">
            <div class="tableWrap">
                <!--搜索功能-->
                <el-form :inline="true" :model="searchForm" class="zr-row-scatter">
                    <div>
                        <el-form-item>
                            <el-button type="primary" @click="toEdit()">新增</el-button>
                        </el-form-item>
                    </div>
                    <div>
                        <el-form-item label="">
                            <el-input v-model="searchForm.keyword" clearable placeholder="关键字"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="search('param')">查询</el-button>
                        </el-form-item>
                    </div>
                </el-form>
                <!--数据表格渲染-->
                <el-table stripe :data="tableData" style="width: 100%">
                    <el-table-column type="selection" width="60"></el-table-column>
                    <el-table-column type="index" label="序号" width="50"></el-table-column>
                    <el-table-column prop="areaName" label="区域名称" show-overflow-tooltip></el-table-column>
                    <!-- 设备号 -->
                    <el-table-column prop="deviceNo" label="设备号" show-overflow-tooltip></el-table-column>
                    <!-- 设备通道说明 -->
                    <!-- <el-table-column prop="devicePassageway" label="设备通道说明" show-overflow-tooltip></el-table-column> -->
                    <!-- 计费类型 -->
                    <el-table-column prop="chargingType" label="计费类型" show-overflow-tooltip>
                    </el-table-column>
                    <!-- 计费方式 -->
                    <el-table-column prop="chargingMode" label="计费方式" show-overflow-tooltip></el-table-column>
                    <!-- 上月读数 -->
                    <el-table-column prop="beforeReadNumber" label="上月读数" show-overflow-tooltip></el-table-column>
                    <!-- 上月抄表时间 -->
                    <el-table-column prop="beforeReadTime" :formatter="dateFormat" label="上月抄表时间" show-overflow-tooltip></el-table-column>
                    <!-- 本月抄表时间 -->
                    <el-table-column prop="readTime" :formatter="dateFormat" label="本月抄表时间" show-overflow-tooltip></el-table-column>
                    <!-- 本月读数 -->
                    <el-table-column prop="readNumber" label="本月读数" show-overflow-tooltip></el-table-column>
                    <!-- 本月用量 -->
                    <el-table-column prop="consumption" label="本月用量" show-overflow-tooltip></el-table-column>
                    <!-- 分摊用量 -->
                    <el-table-column prop="apportionment" label="分摊用量" show-overflow-tooltip></el-table-column>
                    <!-- 计费单价 -->
                    <el-table-column prop="chargingPrice" label="计费单价" show-overflow-tooltip></el-table-column>
                    <!-- 计费费用 -->
                    <el-table-column prop="chargingSum" label="计费费用" show-overflow-tooltip></el-table-column>
                    <el-table-column label="操作" width="180" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" size="mini" @click="toEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button type="text" size="mini" @click="toDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页-->
                <el-pagination v-if="renovatePagination" @size-change="onSizeChange" @current-change="onCurrentChange" :current-page=pageNum :page-sizes="[10, 15, 20, 25]" :page-size=pageSize layout="total, sizes, prev, pager, next, jumper" :total="totolNum">
                </el-pagination>
            </div>
            <!--编辑弹出窗-->
            <el-dialog   :title="isDetail?'查看详情':(editform.id?'编辑':'新增')" :visible.sync="formDialogVisible" :before-close="close" width="50%">
                <el-form  :model="editform" :rules="rules" ref="editform"  label-width="120px">
                        <el-col :span="12">
                            <el-form-item label="区域名称" prop="areaName">
                                <el-input v-model="editform.areaName" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="设备号" prop="deviceNo">
                                <el-input v-model="editform.deviceNo" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="计费类型" prop="chargingType">
                                <el-input v-model="editform.chargingType" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="计费方式" prop="chargingMode">
                                <el-input v-model="editform.chargingMode" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="上月读数" prop="beforeReadNumber">
                                <el-input v-model="editform.beforeReadNumber" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <!-- 上月抄表时间 -->
                            <el-form-item label="上月抄表时间" prop="beforeReadTime">
                                <el-date-picker v-model="editform.beforeReadTime" type="date" value-format="timestamp"
                                                    format="yyyy-MM-dd" placeholder="上月抄表时间">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                       <el-col :span="12">
                           <el-form-item label="本月读数" prop="readNumber">
                               <el-input v-model="editform.readNumber" :disabled="isDetail"></el-input>
                           </el-form-item>
                       </el-col>
                       <el-col :span="12">
                            <!-- 本月抄表时间 -->
                            <el-form-item label="本月抄表时间" prop="readTime">
                                <el-date-picker v-model="editform.readTime" type="date" value-format="timestamp"
                                                    format="yyyy-MM-dd" placeholder="本月抄表时间">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="本月用量" prop="consumption">
                                <el-input  v-model="editform.consumption" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="分摊用量" prop="apportionment">
                                <el-input  v-model="editform.apportionment" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="计费单价(元)" prop="chargingPrice">
                                <el-input  v-model="editform.chargingPrice" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="计费费用(元)" prop="chargingSum">
                                <el-input  v-model="editform.chargingSum" :disabled="isDetail"></el-input>
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
        </div>
    </div>
</template>

<script>
    import { api, dict, axiosHttp,util } from '@/libs'
    import Vue from 'vue'
	import { formatDate } from '../../../static/js/date.js'
    export default {
        // 变量初始化定义
        data: function() {
            var checkNumber = (rule, value, callback) => {
            	if(!value) {
            		return callback(new Error("请输入分摊用量"));
            	} else {
            		const reg = /^[0-9]*$/
            		if(reg.test(value)) {
            			callback();
            		} else {
            			return callback(new Error("只能输入大于等于0的数字！"));
            		}
            	}
            };
			var beforeRead = (rule, value, callback) => {
				if(!value) {
					return callback(new Error("请输入上月读数"));
				} else {
                    const reg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/
                    if(reg.test(value)) {
                        if(this.editform.readNumber){
                            if(value <= this.editform.beforeReadNumber){
                                this.editform.consumption =  Number((value - this.editform.beforeReadNumber).toString().match(/^\d+(?:\.\d{0,2})?/))
                                this.$forceUpdate()
                                if(this.editform.chargingPrice){
                                     this.editform.chargingSum =  Number((this.editform.chargingPrice * this.editform.consumption).toString().match(/^\d+(?:\.\d{0,2})?/))
                                     this.$forceUpdate()
                                }
                            }else{
                                return callback(new Error("上月读数须小于本月读数"));
                            }
                        }
                    	callback();
                    } else {
                    	return callback(new Error("只能输入大于0的数,小数保留两位！"));
                    }

				}
			};
            var presentRead = (rule, value, callback) => {
				if(!value) {
					return callback(new Error("请输入本月读数"));
				} else {
                    const reg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/
                    if(reg.test(value)) {
                        if(this.editform.beforeReadNumber){
                            if(value >= this.editform.beforeReadNumber){
                                this.editform.consumption =  Number((value - this.editform.beforeReadNumber).toString().match(/^\d+(?:\.\d{0,2})?/))
                                this.$forceUpdate()
                                if(this.editform.chargingPrice){
                                     this.editform.chargingSum =  Number((this.editform.chargingPrice * this.editform.consumption).toString().match(/^\d+(?:\.\d{0,2})?/))
                                     this.$forceUpdate()
                                }
                            }else{
                                return callback(new Error("本月读数须大于等于上月读数"));
                            }

                        }
                    	callback();
                    } else {
                    	return callback(new Error("只能输入大于0的数,小数保留两位！"));
                    }

				}
			};
            var chargingPrice = (rule, value, callback) => {
            	if(!value) {
            		return callback(new Error("请输入计费单价"));
            	} else {
                    const reg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/
                    if(reg.test(value)) {
                        if(this.editform.consumption || this.editform.consumption === 0){
                             this.editform.chargingSum =  Number((this.editform.chargingPrice * this.editform.consumption).toString().match(/^\d+(?:\.\d{0,2})?/))
                             this.$forceUpdate()
                        }

                        callback();

                    } else {
                    	return callback(new Error("只能输入大于0的数,小数保留两位！"));
                    }


            	}
            };
            return {
                tableData: [],
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
                      //区域名称
                      areaName: [{
                              required: true,
                              message: '请输入区域名称',
                              trigger: 'blur'
                          }],
                      // 设备号
                      deviceNo: [{
                              required: true,
                              message: '请输入设备号',
                              trigger: 'blur'
                          }],
                      // 计费类型
                      chargingType: [{
                              required: true,
                              message: '请输入计费类型',
                              trigger: 'blur'
                          }],
                     // 计费方式
                     chargingMode: [{
                              required: true,
                              message: '请输入计费方式',
                              trigger: 'blur'
                          }],
                      // 上月读数
                      beforeReadNumber:[{
                              required: true,
                              validator: beforeRead,
                              trigger: 'change'
                          }],
                     // 上月抄表时间
                     beforeReadTime: [{
                              required: true,
                              message: '请选择上月抄表时间',
                              trigger: 'change'
                          }],
                     // 本月抄表时间
                    readTime: [{
                                required: true,
                                message: '请选择本月抄表时间',
                                trigger: 'change'
                            }],
                      // 本月读数
                      readNumber: [{
                              required: true,
                              validator: presentRead,
                              trigger: 'change'
                          }],
                     //分摊用量
                      apportionment: [{
                               required: true,
                               validator: checkNumber,
                               trigger: 'change'
                           }],
                     // 计费单价
                     chargingPrice: [{
                              required: true,
                              validator: chargingPrice,
                              trigger: 'change'
                          }]

                },
            }

        },
        // 页面加载时执行
        created: function() {
            this.search();
        },
        // 自定义方法
        methods: {
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
                this.$httpPost('/manage/meterRecord/find', {
                    keyword: this.searchForm.keyword,
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
                this.editform = {}
                this.formDialogVisible = true;
                this.isDetail=false;
                if(row){
                    this.editform = Object.assign({itemIndex:index},row);

                }
            },
            // 修改 新增 保存
            save() {
                this.$refs.editform.validate((valid) => {
                    if(valid) {
                        if(this.editform.beforeReadTime > this.editform.readTime){
                            this.$message.error('上月抄表时间须早于本月抄表时间');
                            return
                        }
                        axiosHttp.post('/manage/meterRecord/save', {
                            // id
                            id: this.editform.id,
                            // 区域名称
                            areaName: this.editform.areaName,
                            // 设备号
                            deviceNo: this.editform.deviceNo,
                            // 计费类型
                            chargingType: this.editform.chargingType,
                            // 计费方式
                            chargingMode: this.editform.chargingMode,
                            // 上月读数
                            beforeReadNumber: this.editform.beforeReadNumber,
                            // 上月抄表时间
                            beforeReadTime: this.editform.beforeReadTime,
                            // 本月抄表时间
                            readTime: this.editform.readTime,
                            // 本月读数
                            readNumber: this.editform.readNumber,
                            // 本月用量
                            consumption: this.editform.consumption,
                            // 分摊用量
                            apportionment: this.editform.apportionment,
                            // 计费单价
                            chargingPrice: this.editform.chargingPrice,
                            // 计费费用
                            chargingSum: this.editform.chargingSum
                        }).then(res => {
                            this.search()
                            this.formDialogVisible = false;
                        })
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
                axiosHttp.post('/manage/meterRecord/delete', {
                    id: this.deleteIds
                }).then(res => {
                    this.deleteVisible = false;
                this.deleteIds = "";
                this.search();
            })
            },
            // 同步
            syncMeterRecord() {
                this.$httpPost('/manage/meterRecord/syncMeterRecord', {
                }).then(res => {
                    this.search();
            })
            },
            // 时间格式化
            dateFormat(row, column, cellValue) {
            	if(cellValue==null||cellValue==""){
            		return "";
            	}
                let date = new Date(parseInt(cellValue));
                if(date == undefined) {
                    return "";
                }
                return formatDate(date, "yyyy-MM-dd");
            }
        }
    }
</script>
