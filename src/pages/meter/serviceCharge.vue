<template>
    <div class="wrap">
        <div class="subContent">
            <div class="tableWrap">
                <!--搜索功能-->
                <el-form :inline="true" :model="searchForm" class="demo-form-inline zr-row-scatter">
                    <div class="zr-row">
                    </div>

                    <div class="zr-row">
                        <el-form-item >
                            <el-input placeholder="月份" v-model="searchForm.month" clearable ></el-input>
                        </el-form-item>
                        <el-form-item >
                            <el-input placeholder="客户名称" v-model="searchForm.companyName" clearable ></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="search('param')">搜索</el-button>
                        </el-form-item>
                    </div>
                </el-form>

                <!--数据表格渲染-->
                <el-table ref="table" stripe :data="serviceChargeTable.content" style="width: 100%" @selection-change="onSelect">
                    <el-table-column type="selection" :selectable='checkboxT' width="60" disabled='true'></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" type="index" label="全部" width="50"></el-table-column>
                    <!--<el-table-column :show-overflow-tooltip="true" prop="visitorName" @click="toEdit(scope.$index, scope.row)" label="来访人"></el-table-column>-->

                    <el-table-column :show-overflow-tooltip="true" prop="companyName" label="客户名称" >
                        <template slot-scope="scope">
                            <el-button type="text" size="smart" @click="toDetails(scope.$index, scope.row)">{{scope.row.companyName}}</el-button>
                        </template>
                    </el-table-column>
                    <!-- 费用总计 -->
                    <el-table-column :show-overflow-tooltip="true" prop="total" label="费用总计"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="month" label="月份"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" label="操作" width="180"  >
                        <template slot-scope="scope">
                            <el-button type="text" size="mini" @click="openBilling(scope.$index, scope.row)">开收款单</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页-->
                <el-pagination @size-change="onSizeChange" @current-change="onCurrentChange" :current-page="pageNum" :page-sizes="[15, 20, 25, 30]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="Number(serviceChargeTable.totalElements)">
                </el-pagination>
            </div>
        </div>

        <!--编辑弹出窗-->
        <el-dialog   title="费用明细" :visible.sync="formDialogVisible" :before-close="close" width="800px">
            <el-form  :model="editform" :rules="rules" ref="editform"  label-width="120px">
                    <el-col :span="12">
                        <el-form-item label="客户名称" prop="companyName">
                            <!-- 客户名称 -->
                            <el-input v-model="editform.companyName" :disabled="isDetail"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="月份" prop="month">
                            <!-- 月份 -->
                            <el-input v-model="editform.month" :disabled="isDetail"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系人" prop="contacts">
                            <!-- 联系人 -->
                            <el-input v-model="editform.contacts" :disabled="isDetail"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="缴费完成情况" prop="chargeCompleteSituation">
                            <!-- 缴费完成情况 -->
                            <el-input :disabled="isDetail" :value="'已缴费'"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系电话" prop="phone">
                            <!-- 联系电话 -->
                            <el-input v-model="editform.phone" :disabled="isDetail"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="费用合计(元)" prop="total">
                            <!-- 费用合计(元) -->
                            <el-input v-model="editform.total" :disabled="isDetail"></el-input>
                        </el-form-item>
                    </el-col>
            </el-form>

            <el-table :data="tableData1" border class="w-100 m-t-10">
                <el-table-column show-overflow-tooltip label="费用类型" >
                    <template slot-scope="scope">
                        <div type="text" size="smart">服务费</div>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="serve_code" label="服务单号"></el-table-column>
                <el-table-column show-overflow-tooltip prop="serve_area" label="区域名称"></el-table-column>
                <el-table-column show-overflow-tooltip prop="update_time" label="付款时间" width="160">
                    <template slot-scope="scope">
                        <div type="text" size="smart">{{scope.row.update_time, 'yyyy-MM-dd hh:mm:ss' | dateFormat}}</div>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="price" label="缴费金额（元）"></el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="serve_type" label="服务类型">
                    <template slot-scope="scope">
                        <div type="text" size="smart">{{serverList, scope.row.serve_type | findNameFromList}}</div>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>

        <el-dialog   title="费用明细" id="costDetailDialog" class="f-12" :visible.sync="costDetailDialogVisible" v-if="loadTableDialog" :before-close="close" width="1000px">
            <div class="zr-row-center f-18 f-w-700">中国长城科技集团股份有限公司物业服务事业部</div>
            <div class="zr-row-center f-16 f-w-700 m-t-5">服务费用通知单</div>
            <div class="zr-row-scatter">
                <div>客户(租户)：{{selectedRow.companyName}}</div>
                <div>日期：{{firstAndLastList[0], 'yyyy年MM月dd日' | dateFormat}} - {{firstAndLastList[1], 'yyyy年MM月dd日' | dateFormat}}</div>
            </div>
            <div>
                <table border="1" border-collapse="collapse" class="w-100">
                    <thead>
                        <th class="w-40-px">序号</th>
                        <th>服务单号</th>
                        <th>付款时间</th>
                        <th>服务类型</th>
                        <th>费用（元）</th>
                        <th>合计</th>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in billingDetails" :key="index">
                            <td>{{index + 1}}</td>
                            <td>{{item.serve_code}}</td>
                            <td>{{item.update_time, 'yyyy-MM-dd hh:mm:ss' | dateFormat}}</td>
                            <td>{{serverList, item.serve_type | findNameFromList}}</td>
                            <td>{{item.price}}</td>
                            <td :rowspan="billingDetails.length" v-if="index === 0">{{selectedRow.total}}</td>
                        </tr>
                        <tr rowspan="3">
                            <td colspan="6">
                                <div class="zr-row p-l-20 p-r-20">
                                    <div class="w-64-px">说明：</div>
                                    <div class="zr-column" style="width: calc(100% - 64px);">
                                        <div class="zr-row-scatter">
                                            <div>1、收款方：中国长城科技集团股份有限公司</div>
                                            <div>开户行：中信银行深圳南山支行</div>
                                            <div>账号：7441710182100002480</div>
                                        </div>
                                        <div class="zr-row zr_justify-start">2、未交清当月款项，将停止各项服务（如有疑问，请拨：26639997-2128 2124查询）。</div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div class="zr-row-scatter">
                    <div>收费单位：中国长城科技集团股份有限公司</div>
                    <div>物业服务事业部</div>
                    <div>制表日期：{{new Date(), 'yyyy年MM月dd日' | dateFormat}}</div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="print()">打印</el-button>
                <el-button @click="close()">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { axiosHttp, util } from '@/libs'
export default {
    data() {
        return {
            searchForm:{},
            visitorReservationTable: {},
            pageNum: 1,
            pageSize: 15,
            totolNum: 100,
            serviceChargeTable: {},
            formDialogVisible: false,
            costDetailDialogVisible: false,
            editform: {},
            rules: {},
            //是否为详情，并设置是否disable
            isDetail: false,
            tableData1: [],
            selectedRow: {},
            billingDetails: [],
            //对应月份的第一天和最后一天的数组
            firstAndLastList: [],
            //开收款单时延迟加载
            loadTableDialog: false,
            serverList:[
                {
                value: '',
                label: '全部'
                },
                {
                value: 'WX',
                label: '维修'
                },
                {
                value: 'GPS',
                label: '给排水'
                },
                {
                value: 'GPDJZM',
                label: '供配电及照明'
                },
                {
                value: 'NTKT',
                label: '暖通空调'
                },
                {
                value: 'KTYS',
                label: '空调延时'
                },
                {
                value: 'JZ',
                label: '建筑'
                },
                {
                value: 'XF',
                label: '消防'
                },
                {
                value: 'TXYWL',
                label: '通信与网络'
                },
                {
                value: 'QJ',
                label: '清洁'
                },
                {
                value: 'XS',
                label: '消杀'
                },
                {
                value: 'LH',
                label: '绿化'
                },
                {
                value: 'XHFW',
                label: '鲜花服务'
                }
            ]
        }
    },
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
        // 弹出查看详情弹出框
        toDetails(index, row) {
            const _this = this
            this.editform = {}
            this.formDialogVisible = true
            this.isDetail = true
            if(row){
                this.editform = Object.assign({},row)
            }
            axiosHttp.post('/serveorder/serve/info/queryList',{
                month: row.month,
                companyId: row.companyId
            }).then(res => {
                this.tableData1 = res
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
        //复选框
        checkboxT(row,index){
            // alert(row.visitorStatus)
            if(row.visitorStatus!=0){
                return 0;
            }else{
                return 1;
            }

        },
        // 关闭弹出框
        close(formName) {
            this.formDialogVisible = false
            this.costDetailDialogVisible = false
            this[formName] = {};
            // this.$refs[formName].resetFields();
        },
        //关闭详情弹框
        closeTableVisible(){
            clearInterval(this.imgInterval)
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
            this.$httpPost('/serveorder/visitorInfo/delete', {
                id: this.deleteIds
            }).then(res => {
                this.deleteVisible = false;
                this.deleteIds = "";
                this.search();
            })
        },
        //开收款单
        openBilling(index, row) {
            this.firstAndLastList = util.getFirstAndLast(row.month)
            this.selectedRow = row
            this.loadTableDialog = false
            this.costDetailDialogVisible = true
            axiosHttp.post('/serveorder/serve/info/queryList',{
                month: row.month,
                companyId: row.companyId
            }).then(res => {
                this.billingDetails = res
                this.loadTableDialog = true
            })
        },
        //打印
        print() {
            axiosHttp.post('/serveorder/serve/info/print',{
                companyName:this.selectedRow.companyName,
                companyId:this.selectedRow.companyId,
                total:this.selectedRow.total,
                month:this.selectedRow.month
            })
        },
        // 初始化表格 搜索功能
        search(type) {
            if(type=='param'){
                this.pageNum = 1
            }
            let expectStartTime = ""
            let expectEndTime = ""
            axiosHttp.post('/serveorder/serve/info/getTotal ',{
                flag: 1,
                month: this.searchForm.companyName,
                month: this.searchForm.month,
                page: this.pageNum,
                size: this.pageSize
            }).then(res => {
                this.serviceChargeTable = res
            })
        },
    },
    created () {
        this.search()
    }
}
</script>

<style lang="less">
#costDetailDialog {
    table{
        border-collapse:collapse;
        border:solid 1px Black;
        text-align: center;
    }
}
</style>
