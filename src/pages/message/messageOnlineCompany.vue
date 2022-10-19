<template>
    <div class="wrap">
        <div class="subContent zr-row">
            <el-tabs type="card" v-model="tabItem" @tab-click="handleClick">
                     <el-tab-pane label="全部" name="table1">
                        <div class="tableWrap" v-if="tabItem === 'table1'">
                            <!--搜索功能-->
                            <el-form :inline="true" :model="searchForm" class="zr-row-scatter">
                                <div>
                                    <el-checkbox v-model="checked" @change="showIsRead" style="margin-right: 20px;">显示已读</el-checkbox>
                                    <el-button type="primary" @click="toIsRead()">全部设为已读</el-button>
                                </div>
                                <div>
                                </div>
                            </el-form>
                        <!--数据表格渲染-->
                        <el-table ref="table1" stripe :data="tableData" style="width: 100%;margin-top:14px;"
                                  @selection-change="onSelect">
                            <el-table-column type="selection" width="60"></el-table-column>
                            <el-table-column :show-overflow-tooltip="true" type="index" label="序号"
                                           align="center"  width="50"></el-table-column>
                            <!-- 消息来源 -->
                            <el-table-column :show-overflow-tooltip="true" prop="msgType"  :formatter="formatterMsgType"  label="发自" align="center">
                                <template slot-scope="scope">
                                    <span class="red" v-if="scope.row.isRead == 0" ></span>
                                    {{ scope.row.msgType}}
                                </template>
                            </el-table-column>
                            <!-- 消息标题 -->
                            <el-table-column :show-overflow-tooltip="true" prop="title" label="消息标题" align="center"></el-table-column>
                            <!-- 消息内容 -->
                            <el-table-column :show-overflow-tooltip="true" prop="content" label="消息内容" align="center">
                                <template slot-scope="scope">
                                    <el-button type="text" size="smart" @click="toDetails(scope.$index, scope.row)">
                                        {{scope.row.content}}
                                    </el-button>
                                </template>
                            </el-table-column>
                            <el-table-column :show-overflow-tooltip="true" prop="createTime" label="发送时间"
                                          align="center"   :formatter="createTimeFormatter"></el-table-column>
                            <el-table-column :show-overflow-tooltip="true" label="操作" align="center" width="180">
                                <template slot-scope="scope">
                                    <el-button type="text" size="mini" :disabled="scope.row.isRead!=0" @click="toIsRead(scope.$index, scope.row)">设为已读
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
                <el-tab-pane label="通知公告" name="table2">
                    <div class="tableWrap" v-if="tabItem === 'table2'">
                        <!--搜索功能-->
                        <el-form :inline="true" :model="searchForm" class="zr-row-scatter">
                            <div>
                                <el-checkbox v-model="checked" @change="showIsRead" style="margin-right: 20px;">显示已读</el-checkbox>
                                <el-button type="primary" @click="toIsRead()">全部设为已读</el-button>

                            </div>
                            <div>

                            </div>
                        </el-form>
                        <!--数据表格渲染-->
                        <el-table ref="table2" stripe :data="tableData" style="width: 100%;margin-top:14px;"
                                  @selection-change="onSelect">
                            <el-table-column type="selection" width="60"></el-table-column>
                            <el-table-column :show-overflow-tooltip="true" type="index" label="序号"
                                             width="50" align="center"></el-table-column>
                            <!-- 消息类型 -->
                            <!--<el-table-column :show-overflow-tooltip="true" prop="msgType" label="消息类型"></el-table-column>-->
                            <!-- 消息来源 -->
                            <el-table-column :show-overflow-tooltip="true" prop="msgSource"
                                             :formatter="formatterMsgSource" label="发自" align="center">
                                     <template slot-scope="scope">
                                         <span class="red" v-if="scope.row.isRead == 0"></span>
                                         {{ scope.row.msgType}}
                                     </template>
                            </el-table-column>
                            <!-- 消息标题 -->
                            <el-table-column :show-overflow-tooltip="true" prop="title" label="标题" align="center"></el-table-column>
                            <!-- 消息内容 -->
                            <el-table-column :show-overflow-tooltip="true" prop="content" label="内容" align="center">
                                <template slot-scope="scope">
                                    <el-button type="text" size="smart" @click="toDetails(scope.$index, scope.row)">
                                        {{scope.row.content}}
                                    </el-button>
                                </template>
                            </el-table-column>
                            <!-- 发送时间 -->
                            <el-table-column :show-overflow-tooltip="true" prop="createTime" label="时间"
                                             :formatter="createTimeFormatter" align="center"></el-table-column>
                            <!-- 操作 -->
                            <el-table-column :show-overflow-tooltip="true" label="操作" width="180" align="center">
                                <template slot-scope="scope">
                                    <el-button type="text" size="mini" :disabled="scope.row.isRead==1"  @click="toIsRead(scope.$index, scope.row)">设为已读
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
                <el-tab-pane label="缴费消息" name="table3">
                    <div class="tableWrap" v-if="tabItem === 'table3'">
                        <!--搜索功能-->
                       <el-form :inline="true" :model="searchForm" class="zr-row-scatter">
                            <div>
                                <el-checkbox v-model="checked" @change="showIsRead" style="margin-right: 20px;">显示已读</el-checkbox>
                                <el-button type="primary" @click="toIsRead()">全部设为已读</el-button>

                            </div>
                            <div>

                            </div>
                        </el-form>
                        <!--数据表格渲染-->
                        <el-table ref="table3" stripe :data="tableData" style="width: 100%;margin-top:14px;"
                                  @selection-change="onSelect">
                            <el-table-column type="selection" width="60"></el-table-column>
                            <el-table-column :show-overflow-tooltip="true" type="index" label="序号"
                                         align="center"    width="50"></el-table-column>
                            <!-- 消息来源 -->
                            <el-table-column :show-overflow-tooltip="true" prop="msgSource"
                                        align="center"     :formatter="formatterMsgSource" label="发自">
                                             <template slot-scope="scope">
                                                 <span class="red" v-if="scope.row.isRead == 0"></span>
                                                 {{ scope.row.msgType}}
                                             </template>
                            </el-table-column>
                            <!-- 消息标题 -->
                            <el-table-column :show-overflow-tooltip="true" prop="title" label="标题" align="center"></el-table-column>
                            <!-- 消息内容 -->
                            <el-table-column :show-overflow-tooltip="true" prop="content" label="内容" align="center">
                                <template slot-scope="scope">
                                    <el-button type="text" size="smart" @click="toDetails(scope.$index, scope.row)">
                                        <div v-html="scope.row.content">{{scope.row.content}}</div>
                                    </el-button>
                                </template>

                            </el-table-column> -->
                           <el-table-column :show-overflow-tooltip="true" prop="createTime" label="时间"
                                         align="center"    :formatter="createTimeFormatter"></el-table-column>

                            <el-table-column :show-overflow-tooltip="true" label="操作" align="center" width="180">
                                <template slot-scope="scope">
                                    <el-button type="text" :disabled="scope.row.isRead ==1" size="mini"
                                              @click="toIsRead(scope.$index, scope.row)">设为已读
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
                <!-- <el-tab-pane label="访客消息" name="table4">
                    <div class="tableWrap" v-if="tabItem === 'table4'"> -->
                        <!--搜索功能-->
                        <!-- <el-form :inline="true" :model="searchForm" class="zr-row-scatter">
                            <div>
                                <el-checkbox v-model="checked" @change="showIsRead" style="margin-right: 20px;">显示已读</el-checkbox>
                                <el-button type="primary" @click="toIsRead()">全部设为已读</el-button>

                            </div>
                            <div>

                            </div>
                        </el-form> -->
                        <!--数据表格渲染-->
                        <!-- <el-table ref="table4" stripe :data="tableData" style="width: 100%;margin-top:14px;"
                                  @selection-change="onSelect">
                            <el-table-column type="selection" width="60"></el-table-column>
                            <el-table-column :show-overflow-tooltip="true" type="index" label="序号"
                                        align="center"     width="50"></el-table-column> -->
                            <!-- 消息来源 -->
                            <!-- <el-table-column :show-overflow-tooltip="true" prop="msgType"
                                        align="center"     :formatter="formatterMsgSource" label="发自">
                                     <template slot-scope="scope">
                                         <span class="red" v-if="scope.row.isRead == 0" ></span>
                                         {{ scope.row.msgType}}
                                     </template>
                            </el-table-column> -->
                            <!-- 消息标题 -->
                            <!-- <el-table-column :show-overflow-tooltip="true" prop="title" label="标题" align="center"></el-table-column> -->
                            <!-- 消息内容 -->
                            <!-- <el-table-column :show-overflow-tooltip="true" prop="content" label="内容" align="center">
                                <template slot-scope="scope">
                                    <el-button type="text" size="smart" @click="toDetails(scope.$index, scope.row)">
                                        <div v-html="scope.row.content">{{scope.row.content}}</div>
                                    </el-button>
                                </template>

                            </el-table-column>
                            <el-table-column :show-overflow-tooltip="true" prop="createTime" label="时间"
                                        align="center"     :formatter="createTimeFormatter"></el-table-column>

                            <el-table-column :show-overflow-tooltip="true" label="操作" align="center" width="180">
                                <template slot-scope="scope">
                                    <el-button type="text" :disabled="scope.row.isRead!=0" size="mini"
                                               @click="toIsRead(scope.$index, scope.row)">设为已读
                                    </el-button>

                                </template>
                            </el-table-column>
                        </el-table> -->
                        <!--分页-->
                        <!-- <el-pagination v-if="renovatePagination" @size-change="onSizeChange"
                                       @current-change="onCurrentChange" :current-page="pageNum"
                                       :page-sizes="[10, 15, 20, 25]" :page-size="pageSize"
                                       layout="total, sizes, prev, pager, next, jumper" :total="totolNum">
                        </el-pagination>
                    </div>
                </el-tab-pane> -->
                <!-- <el-tab-pane label="会议室消息" name="table5">
                    <div class="tableWrap" v-if="tabItem === 'table5'"> -->
                        <!--搜索功能-->
                        <!-- <el-form :inline="true" :model="searchForm" class="zr-row-scatter">
                            <div>
                                <el-checkbox v-model="checked" @change="showIsRead" style="margin-right: 20px;">显示已读</el-checkbox>
                                <el-button type="primary" @click="toIsRead()">全部设为已读</el-button>

                            </div>
                            <div>

                            </div>
                        </el-form> -->
                        <!--数据表格渲染-->
                        <!-- <el-table ref="table5" stripe :data="tableData" style="width: 100%;margin-top:14px;"
                                  @selection-change="onSelect">
                            <el-table-column type="selection" width="60"></el-table-column>
                            <el-table-column :show-overflow-tooltip="true" type="index" label="序号"
                                        align="center"     width="50"></el-table-column> -->
                            <!-- 消息来源 -->
                           <!-- <el-table-column :show-overflow-tooltip="true" prop="msgType" align="center"
                                             :formatter="formatterMsgSource" label="发自">
                                         <template slot-scope="scope">
                                             <span class="red" v-if="scope.row.isRead == 0" ></span>
                                             {{ scope.row.msgType}}
                                         </template>
                            </el-table-column> -->
                            <!-- 消息标题 -->
                            <!-- <el-table-column :show-overflow-tooltip="true" prop="title" label="标题" align="center"></el-table-column> -->
                            <!-- 消息内容 -->
                            <!-- <el-table-column :show-overflow-tooltip="true" prop="content" label="内容" align="center">
                                <template slot-scope="scope">
                                    <el-button type="text" size="smart" @click="toDetails(scope.$index, scope.row)">
                                        <div v-html="scope.row.content">{{scope.row.content}}</div>
                                    </el-button>
                                </template>

                            </el-table-column>
                            <el-table-column :show-overflow-tooltip="true" prop="createTime" label="时间" align="center"
                                             :formatter="createTimeFormatter"></el-table-column>

                            <el-table-column :show-overflow-tooltip="true" label="操作" width="180" align="center">
                                <template slot-scope="scope">
                                    <el-button type="text" :disabled="scope.row.isRead!=0" size="mini"
                                               @click="toIsRead(scope.$index, scope.row)">设为已读
                                    </el-button>

                                </template>
                            </el-table-column>
                        </el-table>-->
                        <!--分页-->
                        <!--<el-pagination v-if="renovatePagination" @size-change="onSizeChange"
                                       @current-change="onCurrentChange" :current-page="pageNum"
                                       :page-sizes="[10, 15, 20, 25]" :page-size="pageSize"
                                       layout="total, sizes, prev, pager, next, jumper" :total="totolNum">
                        </el-pagination>
                    </div>
                </el-tab-pane> -->
               <!-- <el-tab-pane label="停车场消息" name="table6">
                    <div class="tableWrap" v-if="tabItem === 'table6'"> -->
                        <!--搜索功能-->
                        <!-- <el-form :inline="true" :model="searchForm" class="zr-row-scatter">
                            <div>
                               <el-checkbox v-model="checked" @change="showIsRead" style="margin-right: 20px;">显示已读</el-checkbox>
                                <el-button type="primary" @click="toIsRead()">全部设为已读</el-button>

                            </div>
                            <div>

                            </div>
                        </el-form> -->
                        <!--数据表格渲染-->
                        <!-- <el-table ref="table6" stripe :data="tableData" style="width: 100%;margin-top:14px;"
                                  @selection-change="onSelect">
                            <el-table-column type="selection" width="60"></el-table-column>
                            <el-table-column :show-overflow-tooltip="true" type="index" label="序号" align="center"
                                             width="50"></el-table-column> -->
                            <!-- 消息来源 -->
                            <!-- <el-table-column :show-overflow-tooltip="true" prop="msgType"
                                             :formatter="formatterMsgSource" label="发自">
                                    <template slot-scope="scope">
                                        <span class="red" v-if="scope.row.isRead == 0" ></span>
                                        {{ scope.row.msgType}}
                                    </template>
                            </el-table-column> -->
                            <!-- 消息标题 -->
                            <!-- <el-table-column :show-overflow-tooltip="true" prop="title" label="标题" align="center"></el-table-column>-->
                            <!-- 消息内容 -->
                            <!-- <el-table-column :show-overflow-tooltip="true" prop="content" label="内容" align="center">
                                <template slot-scope="scope">
                                    <el-button type="text" size="smart" @click="toDetails(scope.$index, scope.row)">
                                        <div v-html="scope.row.content">{{scope.row.content}}</div>
                                    </el-button>
                                </template>

                            </el-table-column>
                            <el-table-column :show-overflow-tooltip="true" prop="createTime" label="时间" align="center"
                                             :formatter="createTimeFormatter"></el-table-column>

                            <el-table-column :show-overflow-tooltip="true" label="操作" width="180" align="center">
                                <template slot-scope="scope">
                                    <el-button type="text" :disabled="scope.row.isRead!=0" size="mini"
                                               @click="toIsRead(scope.$index, scope.row)">设为已读
                                    </el-button>

                                </template>
                            </el-table-column>
                        </el-table> -->
                        <!--分页-->
                        <!-- <el-pagination v-if="renovatePagination" @size-change="onSizeChange"
                                       @current-change="onCurrentChange" :current-page="pageNum"
                                       :page-sizes="[10, 15, 20, 25]" :page-size="pageSize"
                                       layout="total, sizes, prev, pager, next, jumper" :total="totolNum">
                        </el-pagination>
                    </div>
                </el-tab-pane> -->
                <!-- <el-tab-pane label="充电桩消息" name="table7">
                    <div class="tableWrap" v-if="tabItem === 'table7'"> -->
                        <!--搜索功能-->
                        <!-- <el-form :inline="true" :model="searchForm" class="zr-row-scatter">
                            <div>
                                <el-checkbox v-model="checked" @change="showIsRead" style="margin-right: 20px;">显示已读</el-checkbox>
                                <el-button type="primary" @click="toIsRead()">全部设为已读</el-button>

                            </div>
                            <div>

                            </div>
                        </el-form> -->
                        <!--数据表格渲染-->
                        <!-- <el-table ref="table7" stripe :data="tableData" style="width: 100%;margin-top:14px;"
                                  @selection-change="onSelect">
                            <el-table-column type="selection" width="60"></el-table-column>
                            <el-table-column :show-overflow-tooltip="true" type="index" label="序号" align="center"
                                             width="50"></el-table-column> -->
                            <!-- 消息来源 -->
                            <!-- <el-table-column :show-overflow-tooltip="true" prop="msgType"
                                             :formatter="formatterMsgSource" label="发自" align="center">
                                        <template slot-scope="scope">
                                            <span class="red" v-if="scope.row.isRead == 0" ></span>
                                            {{ scope.row.msgType}}
                                        </template>
                             </el-table-column> -->
                            <!-- 消息标题 -->
                            <!-- <el-table-column :show-overflow-tooltip="true" prop="title" label="标题" align="center"></el-table-column> -->
                            <!-- 消息内容 -->
                            <!-- <el-table-column :show-overflow-tooltip="true" prop="content" label="内容" align="center">
                                <template slot-scope="scope">
                                    <el-button type="text" size="smart" @click="toDetails(scope.$index, scope.row)">
                                        <div v-html="scope.row.content">{{scope.row.content}}</div>
                                    </el-button>
                                </template>

                            </el-table-column>
                            <el-table-column :show-overflow-tooltip="true" prop="createTime" label="时间" align="center"
                                             :formatter="createTimeFormatter"></el-table-column>

                            <el-table-column :show-overflow-tooltip="true" label="操作" width="180" align="center">
                                <template slot-scope="scope">
                                    <el-button type="text" :disabled="scope.row.isRead!=0" size="mini"
                                               @click="toIsRead(scope.$index, scope.row)">设为已读
                                    </el-button>

                                </template>
                            </el-table-column>
                        </el-table> -->
                        <!--分页-->
                        <!-- <el-pagination v-if="renovatePagination" @size-change="onSizeChange"
                                       @current-change="onCurrentChange" :current-page="pageNum"
                                       :page-sizes="[10, 15, 20, 25]" :page-size="pageSize"
                                       layout="total, sizes, prev, pager, next, jumper" :total="totolNum">
                        </el-pagination>
                    </div>
                </el-tab-pane> -->
                <!--消息详情-->
                <el-dialog :close-on-click-modal="false" title="消息详情" :visible.sync="formDialogVisible"
                           :before-close="close" width="900px">
                    <el-form :model="editform" ref="editform" label-width="80px">
                        <div style="text-align:center;margin-bottom:20px;font-size: 18px;font-weight: 600;">
                            {{editform.title}}
                        </div>
                        <div style="text-align: left;text-indent:2rem; margin-bottom: 40px;  font-size: 14px;" v-html="editform.content">
                            <span>{{editform.content}}</span>
                        </div>
                        <div style="text-align: left;font-size: 14px;">
                            <span style="display: inline-flex;width: 70%;"></span>
                            <span>发送人：</span><span>{{editform.msgType=='通知公告'?editform.createUserId:'系统消息'}}</span>
                        </div>
                        <div style="text-align: left;font-size: 14px;">
                            <span style="display: inline-flex;width: 70%;"></span>
                            <span>发送时间：</span><span>{{createTimeFormatter(editform)}}</span>
                        </div>
                        <div style="text-align: right;font-size: 14px;margin-top: 10px;" v-show="isShow">
                            <el-button type="primary" @click="dealWith()">办理</el-button>
                        </div>
                    </el-form>
                </el-dialog>

                <!--删除提示框-->
                <!-- <el-dialog :close-on-click-modal="false" title="提示" :visible.sync="deleteVisible" width="30%">
                    <span>确定删除？</span>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="deleteRow()">确 定</el-button>
                        <el-button @click="deleteVisible = false">取 消</el-button>
                    </span>
                </el-dialog> -->
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
                checked:false,
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
                isShow:true,//办理按钮
                editform: {},
                deleteIds: '',
                checkedArr: [],
                msgType:"",
                showRead:"",//已读标识
                blMsgType:"",
                //  设置默认页面
                tabItem: "table1",
            }
        },
        methods: {
            handleClick(tab, event) {
                this.pageNum = 1;
                switch(this.tabItem){
                        case 'table1'://全部
                               return this.loadTable('table1');
                               break;
                        case 'table2'://通知公告  7
                               return this.loadTable('table2');
                               break;
                        case 'table3'://缴费消息 2
                                return this.loadTable('table3');
                                break;
                        case 'table4'://访客消息
                               return this.loadTable('table4');
                               break;
                        case 'table6'://会议室消息
                               return this.loadTable('table5');
                               break;
                        case 'table7'://停车场消息
                               return this.loadTable('table6');
                               break;
                        case 'table8'://充电桩消息
                               return this.loadTable('table7');
                               break;
                        default:
                                break;
                    }

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
                    size: this.pageSize,
                    isRead:this.showRead

                }
                if (type === 'table1') {//全部
                    Object.assign(param)
                    if(this.showRead == 1){
                        this.checked = true
                    }else{
                       this.checked = false
                    }
                    this.msgType = "";
                }
                if (type === 'table2') {//通知公告(信息发布 发布的消息)  7
                    Object.assign(param, {msgType: "7"})
                    if(this.showRead ==1){
                        this.checked = true
                    }else{
                       this.checked = false
                    }
                    this.msgType = "7";
                }
                if (type == 'table3') {//缴费消息 2
                    Object.assign(param, {msgType: "2"});
                    if(this.showRead == 1){
                        this.checked = true
                    }else{
                       this.checked = false
                    }
                    this.msgType = "2";
                }

                axiosHttp.post('/message/msgOnline/find', param).then(res => {
                    this.tableData = res.content;
                    this.totolNum = Number(res.totalElements);
                    this.renovatePagination = true
                    //更新未读数量
                    this.getUnReadCount()
                })

            },
            showIsRead: function(val){//显示已读
                this.pageNum = 1
                let param = {
                    page: this.pageNum,
                    size: this.pageSize,
                    msgType:this.msgType
                }
                if(this.checked){
                    Object.assign(param, {isRead: 1});
                    this.showRead = 1;
                }else{
                   Object.assign(param,{isRead: ""});
                   this.showRead = "";
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
                    console.log(this.tabItem);
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
                this.editform = {};
                this.blMsgType = row.msgType;
                if(this.blMsgType == '通知公告' ){
                    this.isShow = false;
                }else{
                    this.isShow = true;
                }
                if (row) {
                    this.editform = Object.assign({}, row);
                    this.updateIsRead(row);
                }
                this.formDialogVisible = true;
                this.isDetail = true

            },
            //时间格式化
            createTimeFormatter(row, column, cellValue) {
                if (row.createTime != null) {
                    return Vue.filter('dateFormat')(row.createTime, 'yyyy-MM-dd hh:mm:ss')
                }
            },
            //设为已读
            isReadRow() {
                axiosHttp.post('/message/msgOnline/upIsRead', {
                    ids: this.deleteIds
                }).then(res => {
                    this.isReadVisible = false
                    this.deleteIds = ""
                    this.loadTable(this.tabItem)
                    //更新未读数量
                    this.getUnReadCount()
                })
            },
            //更新已读
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
            //办理
            dealWith(){
                console.log(this.blMsgType);
                switch(this.blMsgType){
                        case '缴费信息':
                               return this.$router.push('/payment/payment');
                               break;
                        default:
                                break;
                    }
            },
            formatterMsgType(row, column, cellValue, index){
                switch(row.msgType){
                        case '7':
                               return '通知公告';
                               break;
                        case '2':
                               return '缴费消息';
                               break;
                        default:
                                break;
                    }
            },
            ...mapActions(['getUnReadCount'])
        },
        // 页面加载时执行
        created: function () {
            this.tabItem=this.$route.query.tabItem;
            this.loadTable(this.tabItem);
            console.log(this.tabItem)
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

    .red{
        width: 5px;
        height: 5px;
        display: inline-block;
        border-radius: 50%;
        background-color: red;
        position: relative;
        top: -6px;
        left:-4px;
    }
	.el-dialog__headerbtn .el-dialog__close {
	    color: #fff !important;
	}
</style>
