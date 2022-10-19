<template>
    <div class="wrap">
        <div class="subContent zr-row">
            <el-tabs type="card" v-model="tabItem" @tab-click="handleClick">
                <el-tab-pane label="未读" name="table1">
                    <div class="tableWrap" v-if="tabItem === 'table1'">
                        <!--搜索功能-->
                        <el-form :inline="true" :model="searchForm" class="zr-row-scatter">
                            <div>
                                <el-button type="primary" @click="toIsRead()">批量设为已读</el-button>
                                <el-button type="primary" @click="toDelete()">批量删除</el-button>
                            </div>
                            <div>

                            </div>
                        </el-form>
                        <!--数据表格渲染-->
                        <el-table ref="table1" stripe :data="tableData" style="width: 100%;margin-top:14px;"
                                  @selection-change="onSelect">
                            <el-table-column type="selection" width="60"></el-table-column>
                            <el-table-column :show-overflow-tooltip="true" type="index" label="序号"
                                             width="50"></el-table-column>
                            <!-- 消息类型 -->
                            <!--<el-table-column :show-overflow-tooltip="true" prop="msgType" label="消息类型"></el-table-column>-->
                            <!-- 消息来源 -->
                            <el-table-column :show-overflow-tooltip="true" prop="msgSource"
                                             :formatter="formatterMsgSource" label="消息来源"></el-table-column>
                            <!-- 消息标题 -->
                            <el-table-column :show-overflow-tooltip="true" prop="title" label="消息标题"></el-table-column>
                            <!-- 消息内容 -->
                            <el-table-column :show-overflow-tooltip="true" prop="content" label="消息内容">
                                <template slot-scope="scope">
                                    <el-button type="text" size="smart" @click="toDetails(scope.$index, scope.row)">
                                        {{scope.row.content}}
                                    </el-button>
                                </template>
                            </el-table-column>
                            <!-- 接收人ID -->
                            <!--<el-table-column :show-overflow-tooltip="true" prop="customerId" label="接收人ID"></el-table-column>-->
                            <!-- 接收人姓名 -->
                            <!--<el-table-column :show-overflow-tooltip="true" prop="customerName" label="接收人姓名"></el-table-column>-->
                            <!-- 接收人手机号 -->
                            <!--<el-table-column :show-overflow-tooltip="true" prop="customerPhone" label="接收人手机号"></el-table-column>-->
                            <!-- 是否读取（0未读  1已读） -->
                            <!--<el-table-column :show-overflow-tooltip="true" prop="isRead" label="是否读取（0未读  1已读）"></el-table-column>-->
                            <el-table-column :show-overflow-tooltip="true" prop="createTime" label="发送时间"
                                             :formatter="createTimeFormatter"></el-table-column>
                            <!-- 备注 -->
                            <!--<el-table-column :show-overflow-tooltip="true" prop="remark" label="备注"></el-table-column>-->
                            <el-table-column :show-overflow-tooltip="true" label="操作" width="180">
                                <template slot-scope="scope">
                                    <el-button type="text" size="mini" @click="toIsRead(scope.$index, scope.row)">设为已读
                                    </el-button>
                                    <el-button type="text" size="mini" @click="toDelete(scope.$index, scope.row)">删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <!--分页-->
                        <el-pagination v-if="renovatePagination" @size-change="onSizeChange"
                                       @current-change="onCurrentChange" :current-page="pageNum"
                                       :page-sizes="[10, 15, 20, 25]" :page-size="pageSize"
                                       layout="total, sizes, prev, pager, next, jumper" :total="totolNum">
                        </el-pagination>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="已读" name="table3">
                    <div class="tableWrap" v-if="tabItem === 'table3'">
                        <!--搜索功能-->
                        <el-form :inline="true" :model="searchForm" class="zr-row-scatter">
                            <div>
                                <el-button type="primary" @click="toDelete()">批量删除</el-button>
                            </div>
                            <div>

                            </div>
                        </el-form>
                        <!--数据表格渲染-->
                        <el-table ref="table3" stripe :data="tableData" style="width: 100%;margin-top:14px;"
                                  @selection-change="onSelect">
                            <el-table-column type="selection" width="60"></el-table-column>
                            <el-table-column :show-overflow-tooltip="true" type="index" label="序号"
                                             width="50"></el-table-column>
                            <!-- 消息类型 -->
                            <!--<el-table-column :show-overflow-tooltip="true" prop="msgType" label="消息类型"></el-table-column>-->
                            <!-- 消息来源 -->
                            <el-table-column :show-overflow-tooltip="true" prop="msgSource"
                                             :formatter="formatterMsgSource" label="消息来源"></el-table-column>
                            <!-- 消息标题 -->
                            <el-table-column :show-overflow-tooltip="true" prop="title" label="消息标题"></el-table-column>
                            <!-- 消息内容 -->
                            <el-table-column :show-overflow-tooltip="true" prop="content" label="消息内容">
                                <template slot-scope="scope">
                                    <el-button type="text" size="smart" @click="toDetails(scope.$index, scope.row)">
                                        {{scope.row.content}}
                                    </el-button>
                                </template>
                            </el-table-column>
                            <!-- 接收人ID -->
                            <!--<el-table-column :show-overflow-tooltip="true" prop="customerId" label="接收人ID"></el-table-column>-->
                            <!-- 接收人姓名 -->
                            <!--<el-table-column :show-overflow-tooltip="true" prop="customerName" label="接收人姓名"></el-table-column>-->
                            <!-- 接收人手机号 -->
                            <!--<el-table-column :show-overflow-tooltip="true" prop="customerPhone" label="接收人手机号"></el-table-column>-->
                            <!-- 是否读取（0未读  1已读） -->
                            <!--<el-table-column :show-overflow-tooltip="true" prop="isRead" label="是否读取（0未读  1已读）"></el-table-column>-->
                            <el-table-column :show-overflow-tooltip="true" prop="createTime" label="发送时间"
                                             :formatter="createTimeFormatter"></el-table-column>
                            <!-- 备注 -->
                            <!--<el-table-column :show-overflow-tooltip="true" prop="remark" label="备注"></el-table-column>-->
                            <el-table-column :show-overflow-tooltip="true" label="操作" width="180">
                                <template slot-scope="scope">
                                    <!--<el-button type="text" size="mini" @click="toIsRead(scope.$index, scope.row)">设为已读
                                    </el-button>-->
                                    <el-button type="text" size="mini" @click="toDelete(scope.$index, scope.row)">删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <!--分页-->
                        <el-pagination v-if="renovatePagination" @size-change="onSizeChange"
                                       @current-change="onCurrentChange" :current-page="pageNum"
                                       :page-sizes="[10, 15, 20, 25]" :page-size="pageSize"
                                       layout="total, sizes, prev, pager, next, jumper" :total="totolNum">
                        </el-pagination>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="全部" name="table2">
                    <div class="tableWrap" v-if="tabItem === 'table2'">
                        <!--搜索功能-->
                        <el-form :inline="true" :model="searchForm" class="zr-row-scatter">
                            <div>
                                <el-button type="primary" @click="toIsRead()">批量设为已读</el-button>
                                <el-button type="primary" @click="toDelete()">批量删除</el-button>
                            </div>
                            <div>

                            </div>
                        </el-form>
                        <!--数据表格渲染-->
                        <el-table ref="table2" stripe :data="tableData" style="width: 100%;margin-top:14px;"
                                  @selection-change="onSelect">
                            <el-table-column type="selection" width="60"></el-table-column>
                            <el-table-column :show-overflow-tooltip="true" type="index" label="序号"
                                             width="50"></el-table-column>
                            <!-- 消息类型 -->
                            <!--<el-table-column :show-overflow-tooltip="true" prop="msgType" label="消息类型"></el-table-column>-->
                            <!-- 消息来源 -->
                            <el-table-column :show-overflow-tooltip="true" prop="msgSource"
                                             :formatter="formatterMsgSource" label="消息来源"></el-table-column>
                            <!-- 消息标题 -->
                            <el-table-column :show-overflow-tooltip="true" prop="title" label="消息标题"></el-table-column>
                            <!-- 消息内容 -->
                            <el-table-column :show-overflow-tooltip="true" prop="content" label="消息内容">
                                <template slot-scope="scope">
                                    <el-button type="text" size="smart" @click="toDetails(scope.$index, scope.row)">
                                        <div v-html="scope.row.content">{{scope.row.content}}</div>
                                    </el-button>
                                </template>

                            </el-table-column>
                            <!-- 接收人ID -->
                            <!--<el-table-column :show-overflow-tooltip="true" prop="customerId" label="接收人ID"></el-table-column>-->
                            <!-- 接收人姓名 -->
                            <!--<el-table-column :show-overflow-tooltip="true" prop="customerName" label="接收人姓名"></el-table-column>-->
                            <!-- 接收人手机号 -->
                            <!--<el-table-column :show-overflow-tooltip="true" prop="customerPhone" label="接收人手机号"></el-table-column>-->
                            <!-- 是否读取（0未读  1已读） -->
                            <!--<el-table-column :show-overflow-tooltip="true" prop="isRead" label="是否读取（0未读  1已读）"></el-table-column>-->
                            <el-table-column :show-overflow-tooltip="true" prop="createTime" label="发送时间"
                                             :formatter="createTimeFormatter"></el-table-column>
                            <!-- 备注 -->
                            <!--<el-table-column :show-overflow-tooltip="true" prop="remark" label="备注"></el-table-column>-->
                            <el-table-column :show-overflow-tooltip="true" label="操作" width="180">
                                <template slot-scope="scope">
                                    <el-button type="text" :disabled="scope.row.isRead!=0" size="mini"
                                               @click="toIsRead(scope.$index, scope.row)">设为已读
                                    </el-button>
                                    <el-button type="text" size="mini" @click="toDelete(scope.$index, scope.row)">删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <!--分页-->
                        <el-pagination v-if="renovatePagination" @size-change="onSizeChange"
                                       @current-change="onCurrentChange" :current-page="pageNum"
                                       :page-sizes="[10, 15, 20, 25]" :page-size="pageSize"
                                       layout="total, sizes, prev, pager, next, jumper" :total="totolNum">
                        </el-pagination>
                    </div>
                </el-tab-pane>


                <!--编辑弹出窗-->
                <el-dialog :close-on-click-modal="false" title="消息详情" :visible.sync="formDialogVisible"
                           :before-close="close" width="900px">
                    <el-form :model="editform" ref="editform" label-width="80px">
                        <div style="text-align: center;margin-bottom:4px;font-size: 16px;">
                            {{editform.title}}
                        </div>
                        <div style="text-align: center;margin-bottom:10px;font-size: 12px;">
                            <span>发自：{{editform.msgSource==1?'系统消息':''}}</span>
                            <span style="margin-left:20px;">{{createTimeFormatter(editform)}}</span>
                        </div>

                        <div style="font-size: 14px;" v-html="editform.content">
                            <span>{{editform.content}}</span>

                        </div>
                        <el-button type="text" size="smart" @click="showDetails(editform)"
                                   v-if="editform.msgType==3||editform.msgType==4">查看详情
                        </el-button>
                    </el-form>
                    <div class="zr-row" v-if="showDetailsDiv" id="alarm">
                        <div class="zi-g-3">
                            <div class="m-l-30 p-10 c-blue f-w-700" v-dict:alarmStatus="alarmform.alarmStatus"></div>
                            <el-form :model="alarmform" ref="editform" label-width="120px">
                                <el-col :span="24">
                                    <el-form-item label="设备编号">
                                        <el-input v-model="alarmform.deviceCode" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                    <el-form-item label="报警设备">
                                        <el-input v-model="alarmform.alarmDevice" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="报警分类">
                                        <el-select v-model="alarmform.alarmType" style="width: 100%;" :disabled="true">
                                            <el-option v-for="item in alarmTypeList" :label="item.label"
                                                       :key="item.value" :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="报警级别">
                                        <el-select v-model="alarmform.alarmLevel" style="width: 100%;" :disabled="true">
                                            <el-option v-for="item in alarmLevelList" :label="item.label"
                                                       :key="item.value" :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                    <el-form-item label="设备类别" prop="deviceTypeCode">
                                        <!-- 设备类别代码 -->
                                        <el-input v-model="alarmform.deviceTypeShow" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                    <el-form-item label="报警描述" prop="deviceTypeName">
                                        <!-- 设备类型名称 -->
                                        <el-input v-model="alarmform.alarmName" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="持续时长(小时)" prop="deviceTypeCode">
                                        <!-- 设备类别代码 -->
                                        <el-input v-model="alarmform.alrarmDurationTime" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="报警次数(次)" prop="deviceTypeName">
                                        <!-- 设备类型名称 -->
                                        <el-input v-model="alarmform.alarmCount" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-form>
                        </div>

                        <div class="zi-g-1 zr-column-center">
                            <div>
                                <el-steps direction="vertical" class="m-b-10">
                                    <el-step v-for="(item, index) in alarmLogTableData" :key="index"
                                             :title="item.alarmTime | dateFormat"></el-step>
                                </el-steps>
                                报警时间
                            </div>
                        </div>
                    </div>
                </el-dialog>

                <!--删除提示框-->
                <el-dialog :close-on-click-modal="false" title="提示" :visible.sync="deleteVisible" width="30%">
                    <span>确定删除？</span>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="deleteRow()">确 定</el-button>
                        <el-button @click="deleteVisible = false">取 消</el-button>
                    </span>
                </el-dialog>

                <!--确定设为已读提示框-->
                <el-dialog :close-on-click-modal="false" title="提示" :visible.sync="isReadVisible" width="30%">
                    <span>确定设为已读？</span>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="isReadRow()">确 定</el-button>
                        <el-button @click="isReadVisible = false">取 消</el-button>
                    </span>
                </el-dialog>


            </el-tabs>
        </div>
    </div>
</template>

<script>
    import {axiosHttp} from '@/libs'
    import {dict} from '@/libs'
    import Vue from 'vue'
    import {mapActions} from 'vuex'

    export default {
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
                isDetail: false,
                isReadVisible: false,
                formDialogVisible: false,
                editform: {},
                alarmform: {},
                deleteIds: '',
                checkedArr: [],
                // 报警级别
                alarmLevelList: [],
                alarmLogTableData: [],
                // 报警类别
                alarmTypeList: [],
                faultClassList: [],
                showDetailsDiv: false,
                //  设置默认页面
                tabItem: "table1",
            }
        },

        methods: {
            handleClick(tab, event) {
                this.pageNum = 1
                if (this.tabItem === 'table1') {
                    this.loadTable('table1')
                }else if(this.tabItem ==='table3'){
                    this.loadTable('table3')
                } else {
                    this.loadTable('table2')
                }
            },
            showDetails(val) {

                //  3 报警  4 保养
                if (val.msgType == 3) {
                    //调用接口
                    axiosHttp.post('/manage/alarm/get', {id: val.alarmId}).then(res => {
                        console.info(res)
                        this.alarmform = res;
                    })

                    // 查询报警报警详细时间
                    this.getAlarmLog(val.alarmId);

                    this.showDetailsDiv = true;
                }
                //

                val.msgType;
                val.alarmId;
            },
            getAlarmLog(alarmId) {
                this.$httpPost('/manage/alarmLog/find', {
                    alarmId: alarmId
                    // page: this.pageNum,
                    // size: this.pageSize

                }).then(res => {
                    this.alarmLogTableData = []
                    // console.info(res.data.body.content);
                    let arr = res.data.body.content
                    if (arr.length > 0) {
                        this.alarmLogTableData.push(arr[0])
                        if (arr.length > 1) {
                            this.alarmLogTableData.push(arr[arr.length - 1])
                        }
                    }
                    // this.alarmLogTableData.sort((a, b) => {
                    //     if (a.alarmTime < b.alarmTime ) {
                    //         return 1;
                    //     }
                    //     if (a.alarmTime > b.alarmTime ) {
                    //         return -1;
                    //     }
                    //     return 0;
                    // })
                })
            },

            //页码数改变
            onSizeChange(val) {
                this.pageSize = val;
                this.loadTable(this.tabItem)
            },
            //页码改变
            onCurrentChange(val) {
                this.pageNum = val;
                this.loadTable(this.tabItem)
            },
            loadTable(type) {
                let param = {
                    page: this.pageNum,
                    size: this.pageSize
                }
                if (type === 'table1') {
                    Object.assign(param, {isRead: 0})
                }
                if (type == 'table3') {
                    Object.assign(param, {isRead: 1})
                }

                axiosHttp.post('/message/msgOnline/find', param).then(res => {
                    this.tableData = res.content;
                    this.totolNum = Number(res.totalElements);
                    this.renovatePagination = true

                    //更新未读数量
                    this.getUnReadCount()
                })

            },
            // 弹出修改弹出框
            toEdit(index, row) {
                this.editform = {};
                this.formDialogVisible = true;
                this.isDetail = false;
                if (row) {
                    this.editform = Object.assign({}, row);
                }
            },
            // 关闭弹出框
            close() {
                this.formDialogVisible = false;
                this.$refs.editform.resetFields();
            },
            // 删除操作赋值删除项  并弹窗
            toDelete(index, row) {
                if (row) {
                    this.deleteIds = row.id;
                    this.deleteVisible = true;
                } else {
                    if (this.$refs[this.tabItem].store.states.selection.length > 0) {
                        this.deleteVisible = true;
                    } else {
                        this.$message.error('请至少选择一条数据');
                    }
                }

            },

            // 修改为已读  并弹窗
            toIsRead(index, row) {
                if (row) {
                    this.deleteIds = row.id;
                    this.isReadVisible = true;
                } else {
                    if (this.$refs[this.tabItem].store.states.selection.length > 0) {
                        this.isReadVisible = true;
                    } else {
                        this.$message.error('请至少选择一条数据');
                    }
                }

            },
            // 删除 行  包括单选和多选
            deleteRow() {
                axiosHttp.post('/message/msgOnline/delete', {
                    id: this.deleteIds
                }).then(res => {
                    this.deleteVisible = false
                    this.deleteIds = ""
                    this.loadTable(this.tabItem)
                })
            },
            // 表格选择改变事件
            onSelect(val) {
                this.checkedArr = val;
                let idsArr = [];
                for (var i = 0; i < val.length; i++) {
                    idsArr.push(val[i].id)
                }
                this.deleteIds = idsArr.join(',');
            },
            // 弹出查看详情弹出框
            toDetails(index, row) {
                const _this = this;
                this.showDetailsDiv = false;
                this.editform = {};
                if (row) {
                    this.editform = Object.assign({}, row);
                    _this.updateIsRead(row);
                }
                this.formDialogVisible = true;
                this.isDetail = true

                //更新未读数
                this.updateIsRead(row)
            },
            //时间格式化
            createTimeFormatter(row, column, cellValue) {
                if (row.createTime != null) {
                    return Vue.filter('dateFormat')(row.createTime, 'yyyy-MM-dd hh:mm:ss')
                }
            },

            initServerType() {
                this.$http("post", "/system/user/dict/findListByType", {typekey: "alarmLevel"}).then(res => {
                    if (res.data.msg === "success") {
                        var dataArr = res.data.body;
                        if (dataArr.length != 0) {
                            for (var i = 0; i < dataArr.length; i++) {
                                var newObj = new Object();
                                newObj.label = dataArr[i].name;
                                newObj.value = dataArr[i].code;
                                this.alarmLevelList.push(newObj);
                            }
                        } else {
                            this.alarmLevelList = [];
                        }
                    } else {
                        Toast("加载服务类型失败");
                    }
                });
                this.$http("post", "/system/user/dict/findListByType", {typekey: "alarmType"}).then(res => {
                    if (res.data.msg === "success") {
                        var dataArr = res.data.body;
                        if (dataArr.length != 0) {
                            for (var i = 0; i < dataArr.length; i++) {
                                var newObj = new Object();
                                newObj.label = dataArr[i].name;
                                newObj.value = dataArr[i].code;
                                this.alarmTypeList.push(newObj);
                            }
                        } else {
                            this.alarmTypeList = [];
                        }
                    } else {
                        Toast("加载服务类型失败");
                    }
                });
                this.$http("post", "/system/user/dict/findListByType", {typekey: "faultClass"}).then(res => {
                    if (res.data.msg === "success") {
                        var dataArr = res.data.body;
                        if (dataArr.length != 0) {
                            for (var i = 0; i < dataArr.length; i++) {
                                var newObj = new Object();
                                newObj.label = dataArr[i].name;
                                newObj.value = dataArr[i].code;
                                this.faultClassList.push(newObj);
                            }
                        } else {
                            this.faultClassList = [];
                        }
                    } else {
                        Toast("加载服务类型失败");
                    }
                });

            },


            isReadRow() {
                axiosHttp.post('/message/msgOnline/upIsRead', {
                    ids: this.deleteIds
                }).then(res => {
                    this.isReadVisible = false
                    this.deleteIds = ""
                    this.loadTable(this.tabItem)
                })
            },
            updateIsRead(row) {
                if (row.isRead == "0") {
                    this.$httpPost('/message/msgOnline/upIsRead', {
                        // ID
                        ids: row.id,
                    }).then(res => {
                        this.loadTable(this.tabItem)
                        this.getUnReadCount()
                    })
                }

            },
            //格式化消息来源
            formatterMsgSource(row, column, cellValue, index) {
                if (row.msgSource === "1") {
                    return '系统消息'
                } else {
                    return '系统消息'
                }

            },
            ...mapActions(['getUnReadCount'])
        },
        // 页面加载时执行
        created: function () {
            this.loadTable('table1');
            this.initServerType();
        },
    }
</script>

<style lang="less">
    #alarm {
        .el-step__icon.is-text {
            background-color: red;
        }

        .el-step__head.is-wait {
            color: red;
            border-color: red;
        }

        .el-step__title.is-wait {
            color: black;
        }
    }
</style>
