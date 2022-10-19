
<template>
    <div class="wrap">
        <div class="subContent zr-row">
            <div class="tableWrap">
                <!--搜索功能-->
                <el-form :inline="true" :model="searchForm" class="demo-form-inline zr-row-scatter zr_justify-end" >
                	<div></div>
                    <div>
                       <el-form-item >
                           <el-input placeholder="计划名称" v-model="searchForm.taskName" clearable ></el-input>
                       </el-form-item>
                       <el-form-item label="开始日期">
                           <el-date-picker v-model="searchForm.taskStartTime" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd HH:mm" align="right">
                           </el-date-picker>
                       </el-form-item>
                       
                       <el-form-item>
                           <el-button type="primary" @click="search()">搜索</el-button>
                       </el-form-item>
                    </div>
                    
                </el-form>
                <!--数据表格渲染 @selection-change="onSelect"  :selectable='checkboxT'-->
                <el-table ref="table" stripe :data="tableData" style="width: 100%" >
                    <el-table-column type="selection"  width="60" disabled='true'></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" type="index" label="序号" width="50"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="lineName" label="计划名称"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="taskName" label="所属机构"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="taskCreateTime"   label="线路"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="taskEndTime" label="状态"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="beVisitTel" label="巡检周期"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="beVisitUnit" label="巡检类型"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="visitorStatus"  label="开始日期"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="visitTime"   width="200" label="结束日期"></el-table-column>
                </el-table>
                <!--分页-->
                <el-pagination v-if="renovatePagination" @size-change="onSizeChange" @current-change="onCurrentChange" :current-page="pageNum" :page-sizes="[15, 20, 25, 30]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totolNum">
                </el-pagination>
            </div>




        </div>
    </div>
</template>

<script>
    import { formatDate } from '../../../static/js/date.js'
    import { api } from '@/libs'
    import Vue from 'vue'
    export default {
        // 变量初始化定义
        data() {
            return {
                tableData: [],
                //刷新分页
                renovatePagination: true,
                pageNum: 1,
                pageSize: 15,
                totolNum: 0,
                searchForm: {},
                editform: {},
                deleteIds: '',
                checkedArr: [],
            }

        },
        // 页面加载时执行
        created: function() {
        	const _this = this;
            this.search();
           	/*const intervalTemp = setInterval(() => {
                _this.search()
            }, 3000)*/
           	// store.commit('SET_PUSH_INTERVAL',intervalTemp)
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
            search() {
             	let startTime = "";
				let endTime = "";
            	if(this.searchForm.taskStartTime != undefined) {
					startTime = formatDate(this.searchForm.visitTime[0], "yyyy-MM-dd hh:mm");

					endTime = formatDate(this.searchForm.visitTime[1], "yyyy-MM-dd hh:mm");
				}
                this.$http("post",'/manage/patrol/patrolTaskList', {
                	startTime:startTime,
                	endTime:endTime,
                    taskName: this.searchForm.taskName,
                    page: this.pageNum,
                    size: this.pageSize
                }).then(res => {
                    this.tableData = res.data.body.list;
                    this.totolNum = Number(res.data.body.page.totalRows)
                })
            },
        }
    }
</script>
