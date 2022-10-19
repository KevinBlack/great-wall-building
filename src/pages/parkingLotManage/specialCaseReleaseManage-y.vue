<template>
    <div class="wrap">
        <div class="subContent zr-row">
            <el-tabs type="card" v-model="tabSelected">
                <el-tab-pane label="特例放行管理" name="firstService">
                    <div class="tableWrap" v-if="firstName === 'firstService'">
                        <!--搜索功能-->
                        <el-form :inline="true" :model="searchForm" class="demo-form-inline zr-row-scatter"
                                 style="margin-left: 0px">
                            <div>
                                <el-form-item style="margin-left: 0px">
                                    <el-button type="primary" @click="FreeRelease()">免费放行</el-button>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="reload()">刷新</el-button>
                                </el-form-item>
                            </div>
                            <div>
                                <el-form-item label="入场时间">
                                    <el-date-picker v-model="searchForm.enterTime" type="datetimerange"
                                                    range-separator="至" start-placeholder="入场开始日期"
                                                    end-placeholder="入场结束日期" format="yyyy-MM-dd HH:mm">
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item label="车牌号">
                                    <el-input placeholder="车牌号" v-model="searchForm.carNum" clearable></el-input>
                                </el-form-item>
                                <!--<el-form-item >
                                    <el-input placeholder="关键字" v-model="searchForm.keyword" clearable ></el-input>
                                </el-form-item>-->
                                <el-form-item>
                                    <el-button type="primary" @click="search()">搜索</el-button>
                                </el-form-item>
                            </div>
                        </el-form>
                        <!--数据表格渲染-->
                        <el-table ref="table" stripe :data="tableData" style="width: 100%" @selection-change="onSelect">
                            <el-table-column type="selection" width="60"
                                             disabled='true'></el-table-column>
                            <el-table-column :show-overflow-tooltip="true" type="index" label="序号"
                                             width="50"></el-table-column>
                            <el-table-column :show-overflow-tooltip="true" prop="carNum" label="车牌号"></el-table-column>
                            <el-table-column :show-overflow-tooltip="true" prop="visitorName"
                                             label="停车场名称"></el-table-column>
                            <el-table-column :show-overflow-tooltip="true" prop="visitorTel"
                                             label="入场时间"></el-table-column>
                            <el-table-column :show-overflow-tooltip="true" label="操作" width="180">
                                <template slot-scope="scope">
                                    <el-button type="text" @click="freeRelease(scope.row)">免费放行</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <!--分页-->
                        <el-pagination v-if="renovatePagination" @size-change="onSizeChange"
                                       @current-change="onCurrentChange" :current-page="pageNum"
                                       :page-sizes="[15, 20, 25, 30]" :page-size="pageSize"
                                       layout="total, sizes, prev, pager, next, jumper" :total="totolNum">
                        </el-pagination>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="特例放行历史记录" name="secondService">
                    <div class="tableWrap" v-if="firstName === 'firstService'">
                        <!--搜索功能-->
                        <el-form :inline="true" :model="searchForm1" class="demo-form-inline zr-row-scatter">
                            <div></div>
                            <div class="zr-row">
                                <el-form-item label="车牌号">
                                    <el-input placeholder="车牌号" v-model="searchForm1.carNum" clearable></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-input placeholder="关键字" v-model="searchForm1.keyword" clearable></el-input>
                                </el-form-item>
                                <el-form-item style="margin-right: 0;">
                                    <el-button type="primary" @click="search1()">搜索</el-button>
                                </el-form-item>
                            </div>
                        </el-form>
                        <!--数据表格渲染-->
                        <el-table ref="table" stripe :data="tableData1" style="width: 100%">
                            <el-table-column type="selection" width="60"
                                             disabled='true'></el-table-column>
                            <el-table-column :show-overflow-tooltip="true" type="index" label="序号"
                                             width="50"></el-table-column>
                            <el-table-column :show-overflow-tooltip="true" prop="carNum" label="车牌号"></el-table-column>
                            <el-table-column :show-overflow-tooltip="true" prop="visitorName"
                                             label="停车场名称"></el-table-column>
                            <el-table-column :show-overflow-tooltip="true" prop="" label="豁免方式"></el-table-column>
                            <el-table-column :show-overflow-tooltip="true" prop="" label="操作人"></el-table-column>
                            <el-table-column :show-overflow-tooltip="true" prop="" label="操作时间"></el-table-column>
                        </el-table>
                        <!--分页-->
                        <el-pagination v-if="renovatePagination" @size-change="onSizeChange1"
                                       @current-change="onCurrentChange1" :current-page="pageNum1"
                                       :page-sizes="[15, 20, 25, 30]" :page-size="pageSize1"
                                       layout="total, sizes, prev, pager, next, jumper" :total="totolNum1">
                        </el-pagination>
                    </div>
                </el-tab-pane>
            </el-tabs>

            <!-- 免费放行 -->
            <el-dialog   title="免费放行" :visible.sync="freeVisible" width="30%">
                <el-form :model="editform" :rules="rules" ref="editform" class="demo-form-inline p-30"
                         label-width="80px">
                    <el-col :span=24>
                        <el-form-item label="豁免方式" prop="freeType" label-width="30%">
                            <el-select v-model="editform.freeType" placeholder="豁免方式">
                                <el-option label="对公" value="对公"></el-option>
                                <el-option label="紧急情况" value="紧急情况"></el-option>
                                <el-option label="VIP" value="VIP"></el-option>
                                <el-option label="商家代付" value="商家代付"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="free()">确 定</el-button>
                <el-button @click="freeVisible = false">取 消</el-button>
            </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import {formatDate} from '../../../static/js/date.js'

    export default {
        // 变量初始化定义
        data() {
            return {
                tableData: [],
                tableData1: [],
                //刷新分页
                renovatePagination: true,
                pageNum: 1,
                pageNum1: 1,
                freeVisible: false,
                pageSize: 15,
                pageSize1: 15,
                totolNum: 100,
                totolNum1: 100,
                searchForm: {},
                searchForm1: {},
                editform: {},
                checkedArr: [],
                deleteIds: '',
                tabSelected: 'firstService',
                checkedArr: [],
                firstName: 'firstService',
                rules: {
                    freeType: [{
                        required: true,
                        message: '请选择豁免类型',
                        trigger: 'change'
                    },],
                },
            }

        },
        // 页面加载时执行
        created: function () {
            this.search();
            this.search1();
        },
        // 自定义方法
        methods: {

            //页码数改变
            onSizeChange(val) {
                this.pageSize = val;
                this.search();
            },
            //页码数改变
            onSizeChange1(val) {
                this.pageSize1 = val;
                this.search1();
            },
            //页码改变
            onCurrentChange(val) {
                this.pageNum = val;
                this.search();
            },
            //页码改变
            onCurrentChange1(val) {
                this.pageNum1 = val;
                this.search1();
            },
            onSelect(val) {
                this.checkedArr = val;
                let idsArr = []
                for (var i = 0; i < val.length; i++) {
                    idsArr.push(val[i].id)
                }
                this.deleteIds = idsArr.join(',')
            },
            //刷新
            reload() {
                this.search();
            },
            //批量放行
            FreeRelease() {
                if (this.checkedArr.length == 0) {
                    this.$message.error('请至少选择一条数据');

                } else {
                    this.freeVisible = true;
                }
            },
            //免费放行按钮
            freeRelease(row) {
                this.deleteIds = row.id;
                this.freeVisible = true;
            },
            //特例放行
            free() {
                this.$httpPost('/manage/park/specialCaseRelease/free', {
                    id: this.deleteIds,
                    freeType: this.editform.freeType,
                }).then(res => {
                    this.freeVisible = false;
                    if (res.data.code == 0) {
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                    } else {
                        this.$message.error('操作失败');
                    }
                })
                this.search();
            },
            // 初始化特例放行管理表格 搜索功能
            search() {
                this.$httpPost('/manage/park/specialCaseRelease/list', {
                    carNum: this.searchForm.carNum,
                    keyword: this.searchForm.keyword,
                    page: this.pageNum,
                    size: this.pageSize
                }).then(res => {
                    this.tableData = res.data.body.dataList;
                    this.totolNum = Number(res.data.body.totalElements)
                })
            },
            //初始化历史记录表格，搜索功能
            search1() {
                this.$httpPost('/manage/park/specialCaseRelease/log/list', {
                    carNum: this.searchForm1.carNum,
                    keyword: this.searchForm1.keyword,
                    page: this.pageNum1,
                    size: this.pageSize1
                }).then(res => {
                    this.tableData1 = res.data.body.dataList;
                    this.totolNum1 = Number(res.data.body.totalElements)
                })
            },
        }
    }
</script>
