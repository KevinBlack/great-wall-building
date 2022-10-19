
<template>
    <div class="wrap">
        <div class="subContent zr-row">
            <div class="tableWrap">
                <!--搜索功能-->
                <el-form :inline="true" :model="searchForm" class="demo-form-inline" style="margin-left: 600px">
                	<el-form-item >
                        <el-input placeholder="计划名称" v-model="searchForm.planName" clearable ></el-input>
                    </el-form-item>
                    <el-form-item label="开始日期">
                        <el-date-picker v-model="searchForm.visitTime" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd HH:mm" align="right">
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="search()">搜索</el-button>
                    </el-form-item>
                </el-form>
                <!--数据表格渲染-->
                <el-table ref="table" stripe :data="tableData" style="width: 100%" @selection-change="onSelect">
                    <el-table-column type="selection" :selectable='checkboxT' width="60" disabled='true'></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" type="index" label="序号" width="50"></el-table-column>
<!--                    <el-table-column :show-overflow-tooltip="true" prop="bnm" label="计划名称"></el-table-column>-->
<!--                    <el-table-column :show-overflow-tooltip="true" prop="hid" label="所属机构"></el-table-column>-->
                    <el-table-column :show-overflow-tooltip="true" prop="tds"   label="名称"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="tnm" label="点位"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="ts" label="采集时间"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="val" label="采集值"></el-table-column>
<!--                    <el-table-column :show-overflow-tooltip="true" prop="vq"  label="开始日期"></el-table-column>-->
<!--                    <el-table-column :show-overflow-tooltip="true" prop="vt"   width="200" label="结束日期"></el-table-column>-->
                </el-table>
                <!--分页-->
               <!-- <el-pagination v-if="renovatePagination" @size-change="onSizeChange" @current-change="onCurrentChange" :current-page="pageNum" :page-sizes="[15, 20, 25, 30]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totolNum">
                </el-pagination>-->
            </div>




        </div>
    </div>
</template>

<script>
    import { formatDate } from '../../../static/js/date.js'
    import store from '@/store/index'
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
        	const _this = this;
            this.search();
           	const intervalTemp = setInterval(() => {
                _this.search()
            }, 3000)
           	store.commit('SET_PUSH_INTERVAL',intervalTemp)
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
             	/*let startTime = "";
				let endTime = "";
            	if(this.searchForm.visitTime != undefined) {
					startTime = formatDate(this.searchForm.visitTime[0], "yyyy-MM-dd hh:mm");

					endTime = formatDate(this.searchForm.visitTime[1], "yyyy-MM-dd hh:mm");
				}*/
                this.$httpPost('/system/topo/list', {
                	/*startTime:startTime,
                	endTime:endTime,
                    carNum: this.searchForm.carNum,
                    keyword: this.searchForm.keyword,
                    page: this.pageNum,
                    size: this.pageSize*/
                }).then(res => {
                    this.tableData = res.data.body;
                    // this.totolNum = Number(res.data.body.totalElements)
                })
            },
        }
    }
</script>
