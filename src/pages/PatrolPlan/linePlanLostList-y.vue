
<template>
    <div class="wrap">
        <div class="subContent zr-row">
            <div class="tableWrap">
                <!--搜索功能-->
                <el-form :inline="true" :model="searchForm" class="demo-form-inline zr-row-scatter" >
                	<div></div>
                    <div>
                        <el-form-item>
                             <el-input placeholder="计划名称" v-model="searchForm.planName" clearable ></el-input>
                         </el-form-item>
                         <el-form-item label="" >
                        						<el-date-picker v-model="searchForm.enterTime" type="datetimerange" range-separator="至" start-placeholder="巡检开始日期" end-placeholder="巡检结束日期" format="yyyy-MM-dd HH:mm" >
                        						</el-date-picker>
                        					</el-form-item>
                        <el-form-item label="">
                             <el-input placeholder="巡检人员/任务组" v-model="searchForm.keyword" clearable ></el-input>
                         </el-form-item>
                         <!--<el-form-item >
                             <el-input placeholder="关键字" v-model="searchForm.keyword" clearable ></el-input>
                         </el-form-item>-->
                         <el-form-item>
                             <el-button type="primary" @click="search('param')">搜索</el-button>
                         </el-form-item>
                    </div>
                </el-form>
                <!--数据表格渲染-->
                <el-table ref="table" stripe :data="tableData" style="width: 100%" @selection-change="onSelect">
                    <el-table-column type="selection" :selectable='checkboxT' width="60" disabled='true'></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" type="index" label="序号" width="50"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="visitorTel" label="计划名称"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="visitorPlateNum" label="巡检日期"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="beVisitName" label="线路名称"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="beVisitTel" label="开始时间"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="beVisitUnit" label="结束时间"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="visitorStatus"  label="漏点数"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="visitorStatus"  label="总点数"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="visitorStatus"  label="巡检人员/任务组"></el-table-column>
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
    export default {
        // 变量初始化定义
        data() {
            return {
                tableData: [],
                //刷新分页
                renovatePagination: true,
                pageNum: 1,
                pageSize: 15,
                totolNum: 100,
                searchForm: {},
                editform: {},
                deleteIds: '',
                checkedArr: [],
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
                this.$httpPost('/manage/charge/findChargeOrder', {
                    carNum: this.searchForm.carNum,
                    keyword: this.searchForm.keyword,
                    page: this.pageNum,
                    size: this.pageSize
                }).then(res => {
                    this.tableData = res.data.body.dataList;
                    this.totolNum = Number(res.data.body.totalElements)
                })
            },
        }
    }
</script>
