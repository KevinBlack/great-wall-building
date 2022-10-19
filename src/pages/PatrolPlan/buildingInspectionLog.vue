
<template>
    <div class="wrap">
        <div class="subContent zr-row">
            <div class="tableWrap">
                <!--搜索功能-->
                <el-form :inline="true" :model="searchForm" class="demo-form-inline zr-row-scatter">
                    <div></div>
                    <div>
                        <el-form-item label="到访时间">
                            <el-date-picker v-model="searchForm.visitTime" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd HH:mm" align="right">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="来访状态">
                            <!--<el-input v-model="searchForm.visitorStatus" clearable ></el-input>-->
                            <el-select v-model="searchForm.visitorStatus"  clearable placeholder="来访状态">
                                <el-option v-for="item in visitorStatusList" :label="item.label" :key="item.value" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item >
                            <el-input placeholder="关键字" v-model="searchForm.keyword" clearable ></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="search('param')">搜索</el-button>
                        </el-form-item>
                    </div>
                    
                </el-form>
                <!--数据表格渲染-->
                <el-table ref="table" stripe :data="tableData" style="width: 100%" @selection-change="onSelect">
                    <el-table-column type="selection" :selectable='checkboxT' width="60" disabled='true'></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" type="index" label="序号" width="50"></el-table-column>
                    <!--<el-table-column :show-overflow-tooltip="true" prop="visitorName" @click="toEdit(scope.$index, scope.row)" label="来访人"></el-table-column>-->

                    <el-table-column :show-overflow-tooltip="true" prop="visitorName"   label="来访人" >
                        <template slot-scope="scope">
                            <el-button type="text" size="smart" @click="toDetails(scope.$index, scope.row)">{{scope.row.visitorName}}</el-button>
                        </template>
                    </el-table-column>


                    <!--<el-table-column :show-overflow-tooltip="true" prop="visitorUnit" label="来访单位"></el-table-column>-->
                    <el-table-column :show-overflow-tooltip="true" prop="visitorTel" label="来访人电话"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="visitorPlateNum" label="来访车牌号"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="expectArrivalTime"  :formatter="dateFormatExpectArrivalTime" width="200"  label="预计到达时间"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="beVisitName" label="被访人"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="beVisitTel" label="被访人电话"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="beVisitUnit" label="被访单位"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="visitorStatus" :formatter="state" label="来访状态"></el-table-column>
                    <!--<el-table-column :show-overflow-tooltip="true" prop="createTime"  :formatter="dateFormatCreateTime" width="200" label="创建时间"></el-table-column>-->
                    <el-table-column :show-overflow-tooltip="true" prop="visitTime"  :formatter="dateFormatVisitTime" width="200" label="到访时间"></el-table-column>
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
