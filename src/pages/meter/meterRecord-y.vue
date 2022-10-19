
<template>
    <div class="wrap">
        <div class="subContent">
            <div class="tableWrap">
                <!--搜索功能-->
                <el-form :inline="true" :model="searchForm" class="zr-row-scatter">
                    <div>
                    	<el-form-item>
                            <el-button type="primary" @click="syncMeterRecord()">同步</el-button>
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
                    <el-table-column prop="devicePassageway" label="设备通道说明" show-overflow-tooltip></el-table-column>
                    <!-- 计费类型 -->
                    <el-table-column prop="chargingType" label="计费类型" show-overflow-tooltip>
                    	<template slot-scope="scope">
                            <div v-dict:chargeType="scope.row.chargingType"></div>
                        </template>
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
                </el-table>
                <!--分页-->
                <el-pagination v-if="renovatePagination" @size-change="onSizeChange" @current-change="onCurrentChange" :current-page=pageNum :page-sizes="[10, 15, 20, 25]" :page-size=pageSize layout="total, sizes, prev, pager, next, jumper" :total=totolNum>
                </el-pagination>
            </div>
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
	import { formatDate } from '../../../static/js/date.js'
    export default {
        // 变量初始化定义
        data() {
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
            },
        }
    }
</script>
