<template>
    <div class="wrap">
        <div class="subContent zr-row">
            <div class="tableWrap">
                <!--搜索功能-->
                <el-form :inline="true" :model="searchForm" class="demo-form-inline zr-row-scatter" >

                	<el-form-item style="margin-left:0">
                        <el-button type="primary" @click="reload()">刷新</el-button>
                    </el-form-item>


                	<el-form-item label="入场时间" style="margin-left: 390px">
						<el-date-picker v-model="searchForm.enterTime" type="datetimerange" range-separator="至" start-placeholder="入场开始日期" end-placeholder="入场结束日期" format="yyyy-MM-dd HH:mm" >
						</el-date-picker>
					</el-form-item>
                    <el-form-item label="车牌号">
                        <el-input placeholder="车牌号" v-model="searchForm.carNum" clearable ></el-input>
                    </el-form-item>
                    <!--<el-form-item >
                        <el-input placeholder="关键字" v-model="searchForm.keyword" clearable ></el-input>
                    </el-form-item>-->
                    <el-form-item>
                        <el-button type="primary" @click="search()">搜索</el-button>
                    </el-form-item>

                </el-form>
                <!--数据表格渲染-->
                <el-table ref="table" stripe :data="tableData" style="width: 100%">
                    <el-table-column type="selection" width="60" disabled='true'></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" type="index" label="序号" width="50"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="carNum" label="车牌号"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="visitorName"   label="停车场名称" ></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="visitorTel" label="入场时间"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="expectArrivalTime" label="出场时间"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="beVisitName" label="缴费方式"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="beVisitTel" label="应缴金额"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="beVisitUnit" label="实缴金额"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="visitorStatus"  label="支付状态"></el-table-column>
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
            reload(){
            	this.search();
            },
            // 初始化表格 搜索功能
            search() {
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
