<template>
    <div class="wrap">
        <div class="subContent">
            <div class="tableWrap">
                <!--搜索功能-->
                <el-form :inline="true" :model="searchForm" class="demo-form-inline zr-row-scatter">
                    <div class="zr-row">
                        <el-button type="primary" @click="toStartDispose()" class="btnClass">开始处理</el-button>
                        <el-button type="primary" @click="toAltother()" class="btnClass">转派</el-button>
                        <el-button type="primary" @click="toReback()" class="btnClass">回单</el-button>
                        <el-button type="primary" @click="toPrint()" class="btnClass last">打印派工单</el-button>
                    </div>
                    <div class="zr-row">
                        <el-form-item label="">
                            <!-- 关键字 -->
                            <el-input v-model="searchForm.keyWord" clearable placeholder="关键字"></el-input>
                        </el-form-item>
                        <el-form-item label="">
                            <!-- 工单来源 0报警信息 1服务台 -->
                            <el-select v-model="searchForm.workType" placeholder="工单来源" clearable>
                            	<el-option label="报警信息" value="0"></el-option>
                            	<el-option label="服务台" value="1,2"></el-option>
                            </el-select>

                        </el-form-item>
                        <el-form-item label="">
                            <!--工单状态 -->
                            <el-select v-model="searchForm.workState" placeholder="工单状态" clearable>
                            	<el-option label="待开始" value="0"></el-option>
                            	<el-option label="进行中" value="1"></el-option>
                                <el-option label="已回单" value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="">
                            <el-date-picker v-model="searchForm.workTime" type="daterange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" format="yyyy-MM-dd" align="right">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="search('param')">搜索</el-button>
                        </el-form-item>
                    </div>
                </el-form>
                <!--数据表格渲染-->
                <el-table ref="table" stripe :data="tableData" style="width: 100%" @selection-change="onSelect">
                    <el-table-column type="selection" width="60"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" type="index" label="序号" align="center" width="50"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="workState"
                                     label="工单状态" align="center">
                        <template slot-scope="scope">
                            <div :style="scope.row.workState==0?yellow:(scope.row.workState==1 || scope.row.workState==2?blue:green)">
                                <span style="color:white;"> {{scope.row.workState == 0 ?'待开始':(scope.row.workState == 1||scope.row.workState == 2?'进行中':(scope.row.workState == 3?'已回单':''))}}</span>
                            </div>
                        </template>

                    </el-table-column>
                    <!-- 工单编号 -->
                    <el-table-column show-overflow-tooltip prop="workNum" align="center" label="工单编号">
                        <template slot-scope="scope">
                            <el-button type="text" size="smart" @click="toWorkDetails(scope.$index, scope.row)">
                                {{scope.row.workNum}}
                            </el-button>
                        </template>
                    </el-table-column>
                    <!-- 报警编号/服务单号 -->
                    <el-table-column show-overflow-tooltip prop="sysAlarmNo" align="center" label="报警编号/服务单号">
                           <template slot-scope="scope">
                               <el-button type="text" size="smart" @click="toAlarmorServeDetails(scope.$index, scope.row)">
                                   {{scope.row.sysAlarmNo}}
                               </el-button>
                           </template>

                    </el-table-column>
                    <!-- 派工时间 -->
                    <el-table-column :show-overflow-tooltip="true" prop="workTime" label="派工时间"
                                     :formatter="workTimeFormatter" align="center"></el-table-column>

                    <!-- 处理人 -->
                    <el-table-column :show-overflow-tooltip="true" prop="workPeople"
                                     label="处理人" align="center"></el-table-column>
                    <!-- 工单来源 -->
                    <el-table-column :show-overflow-tooltip="true" prop="workType" :formatter="workType"
                                     label="工单来源" align="center"></el-table-column>
                     <!-- (scope.row.workLevel || scope.row.serveLevel)=='1'?'blue':((scope.row.workLevel || scope.row.serveLevel)=='2'?'yellow':'red') -->
                   <!-- 严重级别/紧急程度-->
                   <el-table-column :show-overflow-tooltip="true" label="严重级别/紧急程度" prop="workLevel || serveLevel" align="center"  :formatter="stateWorkLevel">
                        <template slot-scope="scope">
                            <div :style="scope.row.workLevel==1?blue:(scope.row.workLevel ==2?yellow:red)">
                                <span style="color:white;"> {{scope.row.workType == 0?(scope.row.workLevel == 1?'普通':(scope.row.workLevel ==2?'重要':'严重')):(scope.row.workLevel == 1?'一般':(scope.row.workLevel ==2?'紧急':'特急')) }}</span>
                            </div>
                        </template>
                   </el-table-column>
                </el-table>

                <!--分页-->
                <el-pagination v-if="renovatePagination" @size-change="onSizeChange" @current-change="onCurrentChange"
                               :current-page="pageNum" :page-sizes="[10, 15, 20, 25]" :page-size="pageSize"
                               layout="total, sizes, prev, pager, next, jumper" :total="totolNum">
                </el-pagination>
            </div>
            <!-- 转派弹出页面 -->
            <el-dialog   :close-on-click-modal="false"  title="转派" :visible.sync="toAltotherDialogVisible"
                       :before-close="close" width="900px">
                <el-form :model="editform1"  ref="editform1" :rules="rules" label-width="80px">
                    <el-row>
                        <el-col :span="12">
                            <!-- 指派给 -->
                            <el-form-item label="指派给" prop="ipt_assign">
                                <el-input class="zpPeople" style="display: inline-block;width: 70%;margin: 0 0 20px 30px;" :disabled="true" v-model="ipt_assign"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <div style="overflow: hidden;" >
                    	<el-form>
                            <el-form-item :model="toWorkform" prop="jobForeman" id="role">
                                <el-row :gutter="20">
                                    <el-col :span="8">
                                        <el-card style="height: 300px;over-flow: hidden;overflow-y: auto;">
                                            <div slot="header" style="padding: 0;height: 30px;">
                                                <span style="font-size: 16px;">角色名称</span>
                                            </div>
                                            <div v-for="item in roleList" :key="item.id">
                                                <a href="#" @click="handlePersonList(item.id)">{{ item.name }}</a>
                                            </div>
                                        </el-card>
                                    </el-col>
                                    <!--树数据-->
                                    <el-col :span="16">
                                        <el-transfer
                                            :titles="titles"
                                            v-model="value13"
                                            :data="dataList"
                                            @change="handleChange">
                                        </el-transfer>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                        </el-form>
                    </div>
                    <el-row>
                        <el-col :span="12">
                            <!-- 派工时间 -->
                            <el-form-item label="派工时间" prop="pgTime">
                                <el-date-picker v-model="editform1.pgTime" type="datetime" value-format="timestamp"
                                                format="yyyy-MM-dd HH:mm">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!-- 派工说明 -->
                    <el-row id="pgsm">
                        <el-col :span="24">
                            <el-form-item label="派工说明" prop="content">
                                <el-input v-model="editform1.content" type="textarea" :autosize="{minRows:10}"  maxlength="1000"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="altotherRow()">确 定</el-button>
                    <el-button @click="closeAltother()">取 消</el-button>
                </span>
            </el-dialog>
            <!--报警工单详情弹出窗-->
            <el-dialog   :close-on-click-modal="false"  title="报警工单详情" :visible.sync="alarmDialogVisible" width="900px">
                        <span style="font-weight: 600;">基本信息</span>
                        <el-form :model="editform" ref="editform"  label-width="120px">
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="工单编号" prop="workNum">
                                        <el-input v-model="editform.workNum" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="工单来源" prop="workType">
                                        <el-input v-model="editform.workType" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="报警编号" prop="baoNum">
                                        <el-input v-model="editform.baoNum" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="设备编号" prop="deviceCode" >
                                        <el-input v-model="editform.deviceCode" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="报警设备" prop="alarmDevice">
                                        <el-input v-model="editform.alarmDevice" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="设备类别" prop="deviceTypeName">
                                        <!-- 设备类别代码 -->
                                        <el-input v-model="editform.deviceTypeName" disabled ></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="报警分类" prop="alarmType">
                                        <el-input v-model="editform.alarmType" disabled :formatter="alarmTypeFormatter(editform.alarmType)"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="报警级别" prop="alarmLevel">
                                        <el-input v-model="editform.alarmLevel" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item label="报警描述" prop="alarmName">
                                        <!-- 设备类型名称 -->
                                        <el-input v-model="editform.alarmName" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <!-- <el-form-item label="报警时间" prop="alarmTime">
                                    <el-date-picker v-model="editform.alarmTime" type="datetime" value-format="timestamp"
                                                    format="yyyy-MM-dd HH:mm"  disabled>
                                    </el-date-picker>
                                </el-form-item> -->
                                <el-col :span="24">
                                    <el-form-item label="报警时间"  style="overflow: hidden;">
                                        <div>
                                            <div>
                                                <el-steps direction="vertical">
                                                    <el-step v-for="(item, index) in alarmLogTableData" :key="index" :title="item.alarmTime | dateFormat"></el-step>
                                                </el-steps>
                                            </div>
                                        </div>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="持续时长(小时)" prop="alrarmDurationTime">
                                        <!-- 设备类别代码 -->
                                        <el-input v-model="editform.alrarmDurationTime" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="报警次数(次)" prop="alarmCount">
                                        <!-- 设备类型名称 -->
                                        <el-input v-model="editform.alarmCount" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="当前值" prop="alarmValue">
                                        <!-- 设备类型名称 -->
                                        <el-input v-model="editform.alarmValue" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="阈值" prop="thresholdValue">
                                        <!-- 设备类型名称 -->
                                        <el-input v-model="editform.thresholdValue" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            <el-row>
                            </el-row>
                                <el-col :span="24">
                                    <el-form-item label="位置" prop="postion">
                                        <!-- 设备类型名称 -->
                                        <el-input v-model="editform.postion" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>

                <span style="font-weight: 600;display:inline-block;margin: 20px 0;">派工记录</span>
                <el-table
                    :data="pgtableData"
                    border
                    style="width: 100%;margin: 0 auto;">
                    <el-table-column :show-overflow-tooltip="true" prop="workTime" label="派工时间" :formatter="workTimeFormatter" align="center"></el-table-column>
                    <el-table-column prop="workPeople" label="处理人" align="center"></el-table-column>
                    <el-table-column prop="withTime" label="回单时间" :formatter="withTimeFormatter" align="center"></el-table-column>
                    <el-table-column prop="operationContent" label="派工说明" align="center"></el-table-column>
                </el-table>
                <span style="font-weight: 600;display: inline-block;margin: 20px 0;">处理记录</span><el-button type="primary" style="padding: 6px;margin-left:5px ;" :disabled="isDisabled" @click="addRecord()">添加记录</el-button>
                <el-table
                    :data="disposetableData"
                    border
                    style="width: 100%;margin: 0 auto;">
                    <el-table-column :show-overflow-tooltip="true" prop="wx_sta_time" label="维修开始日期" :formatter="wxstartTime" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="wx_end_time" label="维修结束日期" :formatter="wxendTime" align="center"></el-table-column>
                    <el-table-column prop="operation_people" label="维修人" align="center"></el-table-column>
                    <el-table-column prop="gz_type" label="故障类别"  align="center" :formatter="faultClass"></el-table-column>
                    <el-table-column prop="wx_type" label="维修类别" align="center" :formatter="repairType"></el-table-column>
                    <el-table-column prop="shi_qk" label="材料使用情况" align="center"></el-table-column>
                    <el-table-column prop="wx_content" label="维修内容" align="center"></el-table-column>
                </el-table>
            </el-dialog>
            <!--报警工单 派工单 -->
            <el-dialog  :close-on-click-modal="false"  title="报警派工单" :visible.sync="alarmPgdVisible"  width="700px" >
                <div id="printAlarmPgd">
                    <div style="width: 100%;padding:10px 0;font-size: 20px;font-weight: 500; text-align: center;">报警派工单</div>
                    <el-form :model="editform" ref="editform"  label-width="120px">
                                <el-row>
                                    <el-col :span="24">
                                        <el-form-item label="工单编号" prop="workNum">
                                            <el-input v-model="editform.workNum" disabled></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="24">
                                        <el-form-item label="报警编号" prop="baoNum">
                                            <el-input v-model="editform.baoNum" disabled></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="24">
                                        <el-form-item label="设备编号" prop="deviceCode" >
                                            <el-input v-model="editform.deviceCode" disabled></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item label="报警设备" prop="alarmDevice">
                                            <el-input v-model="editform.alarmDevice" disabled></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="设备类别" prop="deviceTypeName">
                                            <!-- 设备类别代码 -->
                                            <el-input v-model="editform.deviceTypeName" disabled ></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item label="报警分类" prop="alarmType">
                                            <el-input v-model="editform.alarmType" disabled :formatter="alarmTypeFormatter(editform.alarmType)"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="报警级别" prop="alarmLevel">
                                            <el-input v-model="editform.alarmLevel" disabled></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="24">
                                        <el-form-item label="报警描述" prop="alarmName">
                                            <!-- 设备类型名称 -->
                                            <el-input v-model="editform.alarmName" disabled></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="24">
                                        <el-form-item label="报警时间"  style="overflow: hidden;">
                                            <div>
                                                <div id="pgdAlarmTime">
                                                    <el-steps direction="vertical">
                                                        <el-step v-for="(item, index) in alarmLogTableData" :key="index" :title="item.alarmTime | dateFormat"></el-step>
                                                    </el-steps>
                                                </div>
                                            </div>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item label="持续时长(小时)" prop="alrarmDurationTime">
                                            <!-- 设备类别代码 -->
                                            <el-input v-model="editform.alrarmDurationTime" disabled></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="报警次数(次)" prop="alarmCount">
                                            <!-- 设备类型名称 -->
                                            <el-input v-model="editform.alarmCount" disabled></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item label="当前值" prop="alarmValue">
                                            <!-- 设备类型名称 -->
                                            <el-input v-model="editform.alarmValue" disabled></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="阈值" prop="thresholdValue">
                                            <!-- 设备类型名称 -->
                                            <el-input v-model="editform.thresholdValue" disabled></el-input>
                                        </el-form-item>
                                    </el-col>
                                <el-row>
                                </el-row>
                                    <el-col :span="24">
                                        <el-form-item label="设备位置" prop="postion">
                                            <!-- 设备类型名称 -->
                                            <el-input v-model="editform.postion" disabled></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                </el-row>
                                    <el-col :span="24">
                                        <el-form-item label="处理情况" >
                                            <table>
                                                <thead>
                                                    <th>维修结束日期</th>
                                                    <th>维修人</th>
                                                    <th>维修内容</th>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="item in disposetableData" :key="item.id">
                                                        <td>{{item.wx_end_time, 'yyyy-MM-dd hh:mm' | dateFormat}}</td>
                                                        <td>{{item.operation_people}}</td>
                                                        <td>{{item.wx_content}}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <!-- <el-table
                                                :data="disposetableData" border  style="width: 100%;">
                                                <el-table-column prop="wx_end_time" label="维修结束日期" :formatter="wxendTime" align="center"></el-table-column>
                                                <el-table-column prop="operation_people"  label="维修人" align="center"></el-table-column>
                                                <el-table-column prop="wx_content"  label="维修内容" align="center"></el-table-column>
                                            </el-table> -->
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" v-print="'#printAlarmPgd'">打 印</el-button>
                    <el-button @click="alarmPgdVisible = false">取 消</el-button>
                </span>
            </el-dialog>
            <!--报警添加记录弹出窗-->
            <el-dialog   :close-on-click-modal="false"  title="添加记录" :visible.sync="addDialogVisible" width="700px">
                <el-form :model="editform2" :rules="rules" ref="editform2"  label-width="120px">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="故障类别" prop="gzType">
                                <!-- 故障类别 1机械故障 2突发事件 3线路故障 4签报 5内部维修 6日常维修 7保修 -->
                                <el-select v-model="editform2.gzType" style="width: 100%;" clearable>
                                    <el-option label="机械故障" value="1"></el-option>
                                    <el-option label="突发事件" value="2"></el-option>
                                    <el-option label="线路故障" value="3"></el-option>
                                    <el-option label="签报" value="4"></el-option>
                                    <el-option label="内部维修" value="5"></el-option>
                                    <el-option label="日常维修" value="6"></el-option>
                                    <el-option label="保修" value="7"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="维修类别" prop="wxType">
                                <!-- 维修类别 1自维 2 外维 -->
                                <el-select v-model="editform2.wxType" style="width: 100%;" clearable>
                                    <el-option label="自维" value="1"></el-option>
                                    <el-option label="外维" value="2"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="维修人员" prop="operationPeople">
                                <!-- 维修人员 -->
                                <el-input v-model="editform2.operationPeople"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                         <el-col :span="12">
                             <!-- 维修开始日期 -->
                            <el-form-item label="维修开始日期" prop="wxStaTime">
                                <el-date-picker v-model="editform2.wxStaTime" type="date" value-format="timestamp"
                                                format="yyyy-MM-dd" placeholder="维修开始日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                         <el-col :span="12">
                             <!-- 维修结束日期 -->
                            <el-form-item label="维修结束日期" prop="wxEndTime">
                                <el-date-picker v-model="editform2.wxEndTime" type="date" value-format="timestamp"
                                                format="yyyy-MM-dd" placeholder="维修结束日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="材料使用情况" prop="">
                                <!-- 材料使用情况 -->
                                <el-input v-model="editform2.shiQk"  :autosize="{minRows:5}"  maxlength="100"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="维修内容" prop="wxContent">
                                <!-- 维修内容 -->
                                <el-input v-model="editform2.wxContent" type="textarea" :autosize="{minRows:6}"  maxlength="1000"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="save()">确 定</el-button>
                    <el-button @click="close()">取 消</el-button>
                </span>
            </el-dialog>
            <!-- 服务工单详情 -->
            <el-dialog   :close-on-click-modal="false"  title="服务工单详情" :visible.sync="serveDialogVisible" width="900px">
                        <span style="font-weight: 600;">基本信息</span>
                        <el-form :model="editform" ref="editform"  label-width="120px">
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="工单编号" prop="workNum">
                                        <el-input v-model="editform.workNum" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="工单来源" prop="workType">
                                        <el-input v-model="editform.workType" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="服务单号" prop="sysAlarmNo">
                                        <el-input v-model="editform.sysAlarmNo" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="服务类型" prop="fuType">
                                        <el-select v-model="editform.fuType"  style="width: 100%;" disabled>
                                            <el-option v-for="item in serverTypeList" :label="item.label" :key="item.value" :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="联系人" prop="linkman">
                                        <el-input v-model="editform.linkman" disabled></el-input>
                                    </el-form-item>
                                 </el-col>
                                 <el-col :span="12">
                                    <el-form-item label="联系电话" prop="linkmanNum" >
                                        <el-input v-model="editform.linkmanNum" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="紧急程度" prop="workLevel">
                                        <el-input v-model="editform.workLevel" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="预约时间" prop="tsTime">
                                        <el-date-picker v-model="editform.tsTime" type="datetime" value-format="timestamp"
                                                                format="yyyy-MM-dd HH:mm"  disabled>
                                        </el-date-picker>
                                     </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="公司名称" prop="companyName">
                                        <el-select v-model="editform.companyId" placeholder="公司名称" @change="companyChange" disabled>
                                             <el-option v-for="item in companys" :key= item.id :label="item.name" :value="item.id"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="服务区域" prop="fuQy">
                                        <el-input v-model="editform.fuQy" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item label="问题描述" prop="workWt">
                                        <el-input v-model="editform.workWt" type="textarea" :autosize="{minRows:5}" disabled maxlength="100"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item label="备注" prop="remark">
                                        <el-input v-model="editform.remark" type="textarea" :autosize="{minRows:5}" disabled maxlength="100"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                <span style="font-weight: 600;display:inline-block;margin: 20px 0;">派工记录</span>
                <el-table  :data="pgtableData"  border  style="width: 85%;margin-left: 15%">
                    <el-table-column :show-overflow-tooltip="true" prop="workTime" label="派工时间" :formatter="workTimeFormatter" align="center"></el-table-column>
                    <el-table-column prop="workPeople" label="处理人" align="center"></el-table-column>
                    <el-table-column prop="withTime" label="回单时间" :formatter="withTimeFormatter" align="center"></el-table-column>
                    <el-table-column prop="operationContent" label="派工说明" align="center"></el-table-column>
                </el-table>
                <span style="font-weight: 600;display: inline-block;margin: 20px 0;">处理记录</span><el-button type="primary" style="padding: 6px;margin-left:5px ;" :disabled="isDisabled" @click="addServerRecord()">添加记录</el-button>
                <el-table :data="disposetableData"  border  style="width: 85%;margin-left: 15%">
                    <el-table-column :show-overflow-tooltip="true" prop="wx_sta_time" label="完成时间" :formatter="fwStartTime" align="center"></el-table-column>
                    <el-table-column prop="shi_qk" label="材料使用情况" align="center"></el-table-column>
                    <el-table-column prop="wx_content" label="处理内容" align="center"></el-table-column>
                </el-table>
            </el-dialog>
            <!-- 服务工单-派工单 -->
            <el-dialog     :close-on-click-modal="false"  title="服务派工单" :visible.sync="serverPgdVisible" width="700px">
                <div id="printServerPgd">
                    <div style="width: 100%;padding:10px 0;font-size: 20px;font-weight: 500; text-align: center;">服务派工单</div>
                    <el-form :model="editform" ref="editform"  label-width="120px">
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="工单编号" prop="workNum">
                                    <el-input v-model="editform.workNum" disabled></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="服务单号" prop="sysAlarmNo">
                                    <el-input v-model="editform.sysAlarmNo" disabled></el-input>
                                 </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="服务类型" prop="fuType">
                                    <el-select v-model="editform.fuType"  style="width: 100%;" disabled>
                                        <el-option v-for="item in serverTypeList" :label="item.label" :key="item.value" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="联系人" prop="linkman">
                                    <el-input v-model="editform.linkman" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="联系电话" prop="linkmanNum" >
                                    <el-input v-model="editform.linkmanNum" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="紧急程度" prop="workLevel">
                                        <el-input v-model="editform.workLevel" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="预约时间" prop="tsTime">
                                        <el-date-picker v-model="editform.tsTime" type="datetime" value-format="timestamp"  format="yyyy-MM-dd HH:mm"  disabled>
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item label="公司名称" prop="companyName">
                                        <el-select v-model="editform.companyId" placeholder="公司名称" @change="companyChange" disabled>
                                            <el-option v-for="item in companys" :key= item.id :label="item.name" :value="item.id"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item label="服务区域" prop="fuQy">
                                        <el-input v-model="editform.fuQy" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                            <el-col :span="24">
                                <el-form-item label="问题描述" prop="workWt">
                                    <el-input v-model="editform.workWt" type="textarea" :autosize="{minRows:5}" disabled maxlength="100"></el-input>
                                </el-form-item>
                            </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item label="备注" prop="remark">
                                        <el-input v-model="editform.remark" type="textarea" :autosize="{minRows:5}" disabled maxlength="100"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item label="处理情况" >
                                         	<table>
                                                <thead>
                                                    <th>完成时间</th>
                                                    <th>处理人</th>
                                                    <th>处理内容</th>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="item in disposetableData" :key="item.id">
                                                        <td>{{item.wx_sta_time, 'yyyy-MM-dd hh:mm' | dateFormat}}</td>
                                                        <td>{{item.operation_people}}</td>
                                                        <td>{{item.wx_content}}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        <!-- <el-table :data="disposetableData"  border  style="width: 100%;">
                                            <el-table-column :show-overflow-tooltip="true" prop="wx_sta_time" label="完成时间" :formatter="fwStartTime" align="center"></el-table-column>
                                            <el-table-column prop="shi_qk" label="材料使用情况" align="center"></el-table-column>
                                            <el-table-column prop="wx_content" label="处理内容" align="center"></el-table-column>
                                        </el-table> -->
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </div>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" v-print="'#printServerPgd'">打 印</el-button>
                    <el-button @click="serverPgdVisible = false">取 消</el-button>
                </span>
            </el-dialog>
            <!--服务添加记录弹出窗-->
            <el-dialog   :close-on-click-modal="false"  title="添加记录" :visible.sync="serverAddDialogVisible" width="700px">
                <el-form :model="editform2" :rules="rules" ref="editform2"  label-width="120px">
                    <el-row>
                         <el-col :span="12">
                            <el-form-item label="完成时间" prop="wxStaTime">
                                <el-date-picker v-model="editform2.wxStaTime" type="datetime" value-format="timestamp"
                                                format="yyyy-MM-dd HH:mm" placeholder="完成时间">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="材料使用情况" >
                                <!-- 材料使用情况 -->
                                <el-input v-model="editform2.shiQk"  :autosize="{minRows:5}"  maxlength="100"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="处理内容" prop="wxContent">
                                <el-input v-model="editform2.wxContent" type="textarea" :autosize="{minRows:6}"  maxlength="1000"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="ServerSave()">确 定</el-button>
                    <el-button @click="close()">取 消</el-button>
                </span>
            </el-dialog>
            <!--服务编号详情弹出窗-->
            <el-dialog   :close-on-click-modal="false"  title="服务信息" :visible.sync="servesysAlarmNoDialogVisible" width="900px">
                <span style="font-weight: 600;">服务信息</span>
                <el-form :model="editform" ref="editform"  label-width="120px">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="服务单号" prop="sysAlarmNo">
                                <el-input v-model="editform.sysAlarmNo" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="服务类型" prop="fuType">
                                <el-select v-model="editform.fuType"  style="width: 100%;" disabled>
                                    <el-option v-for="item in serverTypeList" :label="item.label" :key="item.value" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="联系人" prop="linkman">
                                <el-input v-model="editform.linkman" disabled></el-input>
                            </el-form-item>
                         </el-col>
                         <el-col :span="12">
                            <el-form-item label="联系电话" prop="linkmanNum" >
                                <el-input v-model="editform.linkmanNum" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="紧急程度" prop="workLevel">
                                <el-input v-model="editform.workLevel" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="预约时间" prop="tsTime">
                                <el-date-picker v-model="editform.tsTime" type="datetime" value-format="timestamp"
                                                        format="yyyy-MM-dd HH:mm"  disabled>
                                </el-date-picker>
                             </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="公司名称" prop="companyName">
                            	<el-select v-model="editform.companyId" placeholder="公司名称"  @change="companyChange" disabled>
                                    <el-option v-for="item in companys" :key= item.id :label="item.name" :value="item.id"></el-option>
                               </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                           <el-form-item label="服务区域" prop="fuQy">
                                 <el-input v-model="editform.fuQy" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="问题描述" prop="workWt">
                                <el-input v-model="editform.workWt" type="textarea" :autosize="{minRows:5}" disabled maxlength="100"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="备注" prop="remark">
                                <el-input v-model="editform.remark" type="textarea" :autosize="{minRows:5}" disabled maxlength="100"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span style="font-weight: 600;display:inline-block;margin: 20px 0;">派工详情</span>
                <el-table  :data="pgtableData"   border  style="width: 85%;margin-left: 15%;">
                    <el-table-column :show-overflow-tooltip="true" prop="workTime" label="派工时间" :formatter="workTimeFormatter" align="center"></el-table-column>
                    <el-table-column prop="workPeople" label="处理人" align="center"></el-table-column>
                    <el-table-column prop="withTime" label="回单时间" :formatter="withTimeFormatter" align="center"></el-table-column>
                    <el-table-column prop="operationContent" label="派工说明" align="center"></el-table-column>
                    <!-- <el-table-column prop="workNum" label="工单编号" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" size="smart" @click="toWorkDetails(scope.$index, scope.row)">
                                {{scope.row.workNum}}
                            </el-button>
                        </template>
                    </el-table-column> -->
                </el-table>
                <!-- 处理进度 -->
                <span style="font-weight: 600;display: inline-block;margin: 20px 0;">处理进度</span>
                <el-table  :data="dealtableData"  border  style="width: 85%;margin-left: 15%;">
                    <el-table-column :show-overflow-tooltip="true" prop="workTime" label="处理时间" :formatter="workTimeFormatter" align="center"></el-table-column>
                    <el-table-column prop="workSatus" label="操作" align="center"></el-table-column>
                    <el-table-column prop="workPeople" label="操作人"  align="center"></el-table-column>
                    <el-table-column prop="operationContent" label="内容" align="center"></el-table-column>
                </el-table>
                <!-- 支付信息 -->
                <el-form  label-width="120px" v-show="noShowCharge">
                    <div style="font-weight: 600;margin: 20px 0;">支付信息</div>
                    <span>暂无支付信息</span>
                </el-form>
                <el-form :model="editform" ref="editform"  label-width="120px" v-show="isShowCharge">
                    <span style="font-weight: 600;display: inline-block;margin: 20px 0;">支付信息</span>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="支付金额" prop="sjJe">
                                <el-input v-model="editform.sjJe" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="支付日期" prop=" sfTime ">
                                <el-date-picker v-model="editform. sfTime " type="date" value-format="timestamp"
                                                format="yyyy-MM-dd"  disabled>
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <!-- 评价信息 -->
                <el-form  label-width="120px" v-if="noShowAppraise">
                    <div style="font-weight: 600;margin: 20px 0;">评价信息</div>
                    <span>暂无评价信息</span>
                </el-form>
                <el-form :model="editform" ref="editform"  label-width="120px" v-show="isShowAppraise">
                    <span style="font-weight: 600;display: inline-block;margin: 20px 0;">评价信息</span>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="评价" prop="appraise">
                                <el-input v-model="editform.appraise" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="评价日期" prop="appraiseTime">
                                <el-date-picker v-model="editform.appraiseTime" type="datetime" value-format="timestamp"
                                                format="yyyy-MM-dd"  disabled>
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="评价人" prop="appraiseName">
                                <el-input v-model="editform.appraiseName" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="评价人电话" prop="appraiseNum">
                                <el-input v-model="editform.appraiseNum" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <!-- 评价内容 -->
                        <el-col :span="24">
                            <el-form-item label="评价内容" prop="appraiseCont">
                                <el-input v-model="editform.appraiseCont" type="textarea" :autosize="{minRows:5}" disabled maxlength="100"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <!-- 已取消服务 -->
                <el-form label-width="120px" v-show="isShowCancleRn">
                    <span style="font-weight: 600;display: inline-block;margin: 20px 0;">已取消服务</span>
                    <el-row>
                        <!-- 取消原因 -->
                        <el-col :span="24">
                            <el-form-item label="取消原因" prop="cancelRy">
                                <el-input v-model="editform.cancelRy" disabled ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-dialog>
            <!--报警编号详情弹出窗-->
            <el-dialog   :close-on-click-modal="false"  title="报警信息" :visible.sync="detailsTableVisible" width="900px">
                        <span style="font-weight: 600;">基本信息</span>
                        <el-form :model="editform" ref="editform"  label-width="120px">
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="报警编号" prop="baoNum">
                                        <el-input v-model="editform.baoNum" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="设备编号" prop="deviceCode" >
                                        <el-input v-model="editform.deviceCode" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="报警设备" prop="alarmDevice">
                                        <el-input v-model="editform.alarmDevice" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="设备类别" prop="deviceTypeName">
                                        <!-- 设备类别代码 -->
                                        <el-input v-model="editform.deviceTypeName" disabled ></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="报警分类" prop="alarmType">
                                        <el-input v-model="editform.alarmType" disabled :formatter="alarmTypeFormatter(editform.alarmType)"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="报警级别" prop="alarmLevel">
                                        <el-input v-model="editform.alarmLevel" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item label="报警描述" prop="alarmName">
                                        <!-- 设备类型名称 -->
                                        <el-input v-model="editform.alarmName" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item label="报警时间"  style="overflow: hidden;">
                                        <div>
                                            <div>
                                                <el-steps direction="vertical">
                                                    <el-step v-for="(item, index) in alarmLogTableData" :key="index" :title="item.alarmTime | dateFormat"></el-step>
                                                </el-steps>
                                            </div>
                                        </div>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="持续时长(小时)" prop="alrarmDurationTime">
                                        <!-- 设备类别代码 -->
                                        <el-input v-model="editform.alrarmDurationTime" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="报警次数(次)" prop="alarmCount">
                                        <!-- 设备类型名称 -->
                                        <el-input v-model="editform.alarmCount" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="当前值" prop="alarmValue">
                                        <!-- 设备类型名称 -->
                                        <el-input v-model="editform.alarmValue" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="阈值" prop="thresholdValue">
                                        <!-- 设备类型名称 -->
                                        <el-input v-model="editform.thresholdValue" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            <el-row>
                            </el-row>
                                <el-col :span="24">
                                    <el-form-item label="位置" prop="postion">
                                        <!-- 设备类型名称 -->
                                        <el-input v-model="editform.postion" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>

                <span style="font-weight: 600;display:inline-block;margin: 20px 0;">派工记录</span>
                <el-table
                    :data="pgtableData"
                    border
                    style="width: 85%;margin-left:15%;">
                    <el-table-column :show-overflow-tooltip="true" prop="workTime" label="派工时间" :formatter="workTimeFormatter" align="center"></el-table-column>
                    <el-table-column prop="workPeople" label="处理人" align="center"></el-table-column>
                    <el-table-column prop="withTime" label="回单时间" :formatter="withTimeFormatter" align="center"></el-table-column>
                    <el-table-column prop="operationContent" label="派工说明" align="center"></el-table-column>
                </el-table>
               <!-- 处理进度 -->
               <span style="font-weight: 600;display: inline-block;margin: 20px 0;">处理进度</span>
               <el-table  :data="dealtableData"  border  style="width: 85%;margin-left: 15%;">
                   <el-table-column :show-overflow-tooltip="true" prop="workTime" label="处理时间" :formatter="workTimeFormatter" align="center"></el-table-column>
                   <el-table-column prop="workSatus" label="操作" align="center"></el-table-column>
                   <el-table-column prop="workPeople" label="操作人"  align="center"></el-table-column>
                   <el-table-column prop="operationContent" label="内容" align="center"></el-table-column>
               </el-table>
            </el-dialog>
            <!--开始处理提示框-->
            <el-dialog   title="提示" :visible.sync="handelVisible" width="30%">
                <span>确定开始处理？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="handelRow()">确 定</el-button>
                    <el-button @click="handelVisible = false">取 消</el-button>
                </span>
            </el-dialog>
             <!-- 回单提示框 -->
            <el-dialog   title="提示" :visible.sync="rebackVisible" width="30%">
                <span>确定回单？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="rebackRow()">确 定</el-button>
                    <el-button @click="rebackVisible = false">取 消</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>

    import { api, dict, axiosHttp, util,filter } from '@/libs'
    import Vue from 'vue'
    import { formatDate } from '../../../static/js/date.js'
    import {mapActions} from 'vuex'


    export default {
        // 变量初始化定义
        data() {
            return {
                rowId: '',
                alarmId: '',
                workId: '',
                workPeople: '',
                workPeopleId: '',
                workPeopleAll: '',
                workPeopleIdAll: '',
                print_wx_sta_time:'',
                print_wx_end_time:'',
                tableData: [],
                pgtableData:[],//派工表格
                disposetableData:[],//处理记录
                dealtableData:[],//服务 处理进度
                detailsData:[],//报警详情 列表项
                recordData:[],//报警详情 列表项
                submit_usId: [],
                ipt_assign: [],
                roleList: [],
                pageNum: 1,
                pageSize: 15,
                totolNum: 0,
                //刷新分页
                renovatePagination: true,
                searchForm: {},
                handelVisible: false,//开始处理
                rebackVisible: false,//回单
                alarmPgdVisible: false,//报警打印派工单
                serverPgdVisible: false,//服务打印派工单
                //是否为详情，并设置是否disable
                isDetail: false,
                isDisabled:false,//添加记录按钮
                showHandleType:false,//指派人员
                alarmDialogVisible: false,//报警工单详情
                serveDialogVisible: false,//服务工单详情
                serverAddDialogVisible:false,//服务弹出页面
                toAltotherDialogVisible:false,//转派页面
                addDialogVisible:false,//添加记录
                servesysAlarmNoDialogVisible:false,//服务编号
                detailsTableVisible:false,//报警编号
                editform: {},//工单详情 基本信息
                editform1: {},//转派表单
                editform2:{},//添加记录表单
                editform3:{},//服务添加记录
                addDataList:[],
                addRecordId: '',
                jobForeman:"",
                toWorkform:"",
                //所属企业集合
                companys:[],
                houseFunctionOption: [],
                serverTypeList:[],
                //树的数据结构
                titles:['人员列表','已选人员'],
                dataList:[],
                value13: [],
                filterMethod(query, item) {
                	return item.pinyin.indexOf(query) > -1;
                },
                workLevelList:[],
                faultClassList: [],
                startDisposeIds: '',
                alarmIds:'',
                sysAlarmNos:'',
                isShowCharge:true,//收费信息
                noShowCharge:false,//暂无收费信息
                isShowCancleRn:true,//取消原因
                noShowAppraise:false,//暂无评价信息
                isShowAppraise:true,//评价信息
                gdworkType:"",//工单类型
                alarmDeviceNo:"",//报警编号
                AlarmType:"",//报警分类
                DeviceName:"",//报警设备
                alarmLogTableData: [],
                arrInput:[],
                repairTypeList: [{
                    label:'自维',
                    value:'1'
                },{
                    label:'外维',
                    value:'2'
                }],
                blue:{
                    background:'blue',
                    width:'45%',
                    margin:'auto'

                },
                yellow:{
                    background:'orange',
                    width:'45%',
                    margin:'auto'
                },
                red:{
                    background:'red',
                    width:'45%',
                    margin:'auto'
                },
                green:{
                    background:'green',
                    width:'45%',
                    margin:'auto'
                },
                // 校验
                rules: {
                    //故障类别
                    gzType: [{
                              required: true,
                              message: '请选择评价',
                              trigger: 'change'
                          }],
                    //维修类别
                    wxType: [{
                              required: true,
                              message: '请选择维修类型',
                              trigger: 'change'
                          }],
                    //维修人
                    operationPeople: [{
                                   required: true,
                                   message: '请输入评价人',
                                   trigger: 'blur'
                               },
                                {
                                    max: 10,
                                    message: '姓名长度不能大于 10 个字符',
                                    trigger: 'blur'
                                }],
                    //维修开始日期
                    wxStaTime: [{
                              required: true,
                              message: '请选择时间',
                              trigger: 'change'
                          }],
                    //维修结束日期
                    wxEndTime:[{
                                required: true,
                                message: '请选择时间',
                                trigger: 'change'
                             }],
                    //维修内容 处理内容
                    wxContent:[{
                              required: true,
                              message: '请填写内容',
                              trigger: 'blur'
                              },{
                              max: 100,
                              message: '内容长度不能大于 100 个字符',
                              trigger: 'blur'
                            }],
                    //派工时间
                    pgTime:[{
                        required: true,
                        message: '请选择时间',
                        trigger: 'change'
                    }],
                    //派工说明
                    content:[{
                        required: true,
                        message: '请输入内容',
                        trigger: 'blur'
                    }],
                    //指派人
                    // ipt_assign:[{
                    //     required: true,
                    //     message: '请选择人员',
                    //     trigger: 'blur'
                    // }]

                   }
            }

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
                if (type == 'param') {
                    this.pageNum = 1;
                    this.renovatePagination = false;
                }
                let startTime = "";
                let endTime = "";
                if(this.searchForm.workTime != undefined) {
                    startTime = formatDate(this.searchForm.workTime[0], "yyyy-MM-dd");
                    endTime = formatDate(this.searchForm.workTime[1], "yyyy-MM-dd");
                }
                axiosHttp.post('message/workManagement/find', {
                    // 关键字
                    keyWord: this.searchForm.keyWord,
                    //工单来源
                    workType: this.searchForm.workType,
                   //工单状态
                    workState: this.searchForm.workState,
                    //开始时间
                    startTime:startTime,
                    //结束时间
                    endTime:endTime,
                    page: this.pageNum,
                    size: this.pageSize

                }).then(res => {
                    this.tableData = res.content;
                    this.totolNum = Number(res.totalElements);
                    this.renovatePagination = true
                })
            },
            //处理记录 完成时间
            fwStartTime(row, column, cellValue) {
                if(row.wx_sta_time!=null){
                    return Vue.filter('dateFormat')(row.wx_sta_time,'yyyy-MM-dd hh:mm')
                }
            },
            //维修开始时间格式化
            wxstartTime(row, column, cellValue) {
                if(row.wx_sta_time!=null){
                    return Vue.filter('dateFormat')(row.wx_sta_time,'yyyy-MM-dd')
                }
            },
            //维修结束时间格式化
            wxendTime(row, column, cellValue) {
                if(row.wx_end_time!=null){
                    return Vue.filter('dateFormat')(row.wx_end_time,'yyyy-MM-dd')
                }
            },
            //派工时间
            workTimeFormatter(row, column, cellValue){
                if (row.workTime != null) {
                    return Vue.filter('dateFormat')(row.workTime, 'yyyy-MM-dd hh:mm')
                }

            },
            //回单时间
            withTimeFormatter(row, column, cellValue){
                if (row.withTime != null) {
                    return Vue.filter('dateFormat')(row.withTime, 'yyyy-MM-dd hh:mm')
                }
            },
            //时间格式化
            predictTimeFormatter(row, column, cellValue) {
                if (row.tsTime != null) {
                    return Vue.filter('dateFormat')(row.tsTime, 'yyyy-MM-dd')
                }

            },
            // 维修类别 1自维 2外维
            repairType: function(row, column, cellValue) {
                switch (row.wx_type){
                    case "1":
                        return "自维";
                    case "2":
                        return "外维";
                    default:
                        return "";
                }
            },

            // 故障类别 1 机械故障 2 突发事件 3 线路故障 4 签报 5 内部维修 6 日常维修 7 保修
            faultClass: function(row, column, cellValue) {
                switch (row.gz_type){
                    case "1":
                        return "机械故障";
                    case "2":
                        return "突发事件";
                    case "3":
                        return "线路故障";
                    case "4":
                        return "签报";
                    case "5":
                        return "内部维修";
                    case "6":
                        return "日常维修";
                    case "7":
                        return "保修";
                    default:
                        return "";
                }
            },
            //报警分类 0设备故障 1事件
            alarmTypeFormatter(type){
                switch (type){
                    case "01":
                        return type = "设备故障";
                    case "02":
                        return type = "事件";
                    default:
                        return "";
                }
            },
            //根据公司为所属区域赋值
            companyChange(){
            	console.log(this.editform.companyId);
            	if(this.editform.companyId){
            		this.$httpGet('get', '/manage/houseProperty/findAreaNameByCompanyId', {
            			companyId: this.editform.companyId
            		}).then(res => {
            			console.log(res)
            			this.houseFunctionOption = res.data.body;
                    })
            	}
            },
            //获取所属企业数组
            getCompanys(){
            	this.$httpPost('/system/user/org/getOrgList', {
            		flag: 2
            	}).then(res => {
            		if(res.data.msg==="success"){
            			this.companys=res.data.body;
            		}
            	},error => {
            	})
            },
            //报警工单详情--添加记录
            addRecord(){
                this.editform2 = {};
                this.addDialogVisible = true;
            },
            //服务工单详情--添加记录
            addServerRecord(){
                this.editform2 = {};
                this.serverAddDialogVisible = true;
            },
            // 关闭弹出框
            close() {
                this.toAltotherDialogVisible = false;//转派
                this.addDialogVisible = false;//报警工单 --添加记录
                this.serverAddDialogVisible = false;//服务工单--添加记录
                this.servesysAlarmNoDialogVisible = false;//服务编号详情
                this.detailsTableVisible = false;//报警编号详情
                //this.$refs.editform.resetFields();
                // this.$refs.editform1.resetFields();
            },
            //打印派工单
            toPrint(){
                //this.$message.success('待完善');
                if (this.$refs.table.store.states.selection.length > 0) {
                    if (this.$refs.table.store.states.selection.length > 1) {
                        this.$message.error('只能选择一条数据!');
                        return;
                    }
                    if (this.$refs.table.store.states.selection.length = 1) {
                        let arr = this.$refs.table.store.states.selection;
                        if(arr[0].workType == 0){//报警工单详情
                            //  调用接口 获取详情
                            axiosHttp.post('/message/workManagement/get', {
                                id: arr[0].id,
                                alarmId:arr[0].alarmId
                            }).then(res => {
                                this.editform=res.alarm;//基本信息
                                this.alarmDeviceNo = res.alarm.deviceCode
                                this.AlarmType = res.alarm.alarmType
                                this.DeviceName = res.alarm.deviceName
                                this.editform.workNum = res.result.workNum;//服务单号
                                this.editform.workType = (res.result.workType == 0 ? '报警信息':'服务台');//服务类型
                                this.editform.alarmType = (res.alarm.alarmType == "01" ? '设备故障':(res.alarm.alarmType == "02"?'事件':''));//报警分类
                                this.editform.alarmLevel = (res.alarm.alarmLevel == "01" ? '普通':(res.alarm.alarmLevel == "02"?'重要':(res.alarm.alarmLevel == "03"?'严重':'')));//报警级别
                                this.pgtableData = res.PGList;//派工记录
                                this.disposetableData = res.AddList;//维修记录
                                this.addDataList = res.AddList;;
                                this.addRecordId = res.result.id;
                                //
                            })
                            // 查询报警报警详细时间
                            this.getAlarmLog(arr[0].alarmId);
                            this.alarmPgdVisible = true;
                            this.serverPgdVisible = false;

                        }else{//服务工单详情
                            this.getCompanys();
                             //  调用接口 获取详情
                             axiosHttp.post('/message/workManagement/get', {
                                 id: arr[0].id,
                                 alarmId:arr[0].alarmId
                             }).then(res => {
                                 this.editform=res.result;//基本信息
                                 this.editform.workNum = res.result.workNum;//服务单号
                                 this.editform.workType = (res.result.workType == 0 ? '报警信息':'服务台');//服务类型
                                 this.editform.workLevel = (res.result.workLevel == 1 ? '一般':(res.result.workLevel == 2?'紧急':'特急'));//紧急程度
                                 this.pgtableData = res.PGList;//派工记录
                                 this.disposetableData = res.AddList;//维修记录
                                 this.addDataList = res.AddList;;
                                 this.addRecordId = res.result.id;
                                 if(this.editform.companyId){
                                 	this.$httpGet('get', '/manage/houseProperty/findAreaNameByCompanyId', {
                                 		companyId: this.editform.companyId
                                 	}).then(res => {
                                 		this.houseFunctionOption = res.data.body;
                                 	});
                                 }
                                 this.$forceUpdate();

                             })

                            this.serverPgdVisible = true;
                            this.alarmPgdVisible = false;
                        }




                    }

                } else {
                    this.$message.error('请选择一条数据');
                }
            },
            //点击工单编号 弹出查看详情弹出框
            toWorkDetails(index, row) {
               this.rowId =  row.id
               this.alarmId = row.alarmId
               this.gdworkType = row.workType
               this.editform2 = {};
               if (row) {
                   if(row.isRead == 0){
                       this.isDisabled = true
                     }else{
                        this.isDisabled = false
                     };
                   if(row.workType == 0){//报警工单详情
                       //  调用接口 获取详情
                       axiosHttp.post('/message/workManagement/get', {
                           id: row.id,
                           alarmId:row.alarmId
                       }).then(res => {
                           this.editform=res.alarm;//基本信息
                           this.alarmDeviceNo = res.alarm.deviceCode
                           this.AlarmType = res.alarm.alarmType
                           this.DeviceName = res.alarm.deviceName
                           this.editform.workNum = res.result.workNum;//服务单号
                           this.editform.workType = (res.result.workType == 0 ? '报警信息':'服务台');//服务类型
                           this.editform.alarmType = (res.alarm.alarmType == "01" ? '设备故障':(res.alarm.alarmType == "02"?'事件':''));//报警分类
                           this.editform.alarmLevel = (res.alarm.alarmLevel == "01" ? '普通':(res.alarm.alarmLevel == "02"?'重要':(res.alarm.alarmLevel == "03"?'严重':'')));//报警级别
                           this.pgtableData = res.PGList;//派工记录
                           this.disposetableData = res.AddList;//维修记录
                           this.addDataList = res.AddList;;
                           this.addRecordId = res.result.id;
                           //
                       })
                       // 查询报警报警详细时间
                       this.getAlarmLog(row.alarmId);
                       this.alarmDialogVisible = true;
                       this.serveDialogVisible = false;

                   }else{//服务工单详情
                       this.getCompanys();
                        //  调用接口 获取详情
                        axiosHttp.post('/message/workManagement/get', {
                            id: row.id,
                            alarmId:row.alarmId
                        }).then(res => {
                            this.editform=res.result;//基本信息
                            this.editform.workNum = res.result.workNum;//服务单号
                            this.editform.workType = (res.result.workType == 0 ? '报警信息':'服务台');//服务类型
                            this.editform.workLevel = (res.result.workLevel == 1 ? '一般':(res.result.workLevel == 2?'紧急':'特急'));//紧急程度
                            this.pgtableData = res.PGList;//派工记录
                            this.disposetableData = res.AddList;//维修记录
                            this.addDataList = res.AddList;;
                            this.addRecordId = res.result.id;
                            if(this.editform.companyId){
                            	this.$httpGet('get', '/manage/houseProperty/findAreaNameByCompanyId', {
                            		companyId: this.editform.companyId
                            	}).then(res => {
                            		this.houseFunctionOption = res.data.body;
                            	});
                            }
                            this.$forceUpdate();

                        })

                       this.serveDialogVisible = true;
                       this.alarmDialogVisible = false;
                   }



                }


            },
            getAlarmLog(alarmId){
                this.$httpPost('/manage/alarmLog/find', {
                    alarmId:alarmId
                    // page: this.pageNum,
                    // size: this.pageSize

                }).then(res => {
                    console.log(res);
                    this.alarmLogTableData = []
                    let arr = res.data.body.content
                    if(arr.length > 0) {
                        this.alarmLogTableData.push(arr[0])
                        if(arr.length > 1) {
                            this.alarmLogTableData.push(arr[arr.length - 1])
                        }
                    }
                })
            },
            //报警---- 新增 保存 添加记录
            save() {
                this.$refs.editform2.validate((valid) => {
                    if(valid) {
                        if(this.editform2.wxStaTime <= this.editform2.wxEndTime) {
                            this.$httpPost('/message/workList/save', {
                                //报警分类
                                alarmType:this.AlarmType,
                                //设备编号
                                deviceNo:this.alarmDeviceNo,
                                //报警ID
                                alarmId:this.alarmId,
                                //工单类型
                                workType:this.gdworkType,
                                //报警设备
                                deviceName:this.DeviceName,
                                // 维修负责人
                                wrokId: this.addRecordId,
                                // 维修人
                                operationPeople: this.editform2.operationPeople,
                                // 故障类别 1机械故障 2突发事件 3线路故障 4签报 5内部维修 6日常维修 7保修
                                gzType: this.editform2.gzType,
                                //维修类别 1自维 2 外维
                                wxType:this.editform2.wxType,
                                // 维修开始日期
                                wxStaTime: this.editform2.wxStaTime,
                                // 维修结束日期
                                wxEndTime: this.editform2.wxEndTime,
                                //材料使用情况
                                shiQk:this.editform2.shiQk,
                                // 维修内容
                                wxContent: this.editform2.wxContent,
                            }).then(res => {
                                axiosHttp.post('/message/workManagement/get', {
                                    id: this.rowId,
                                    alarmId : this.alarmId
                                }).then(res => {
                                    this.disposetableData = res.AddList;//维修记录
                                })
                                this.addDialogVisible = false;

                            })
                        }else {
                            this.$message.warning('结束日期不能早于开始日期')
                        }
                    } else {
                        return false;
                    }
                });
            },
            //服务---- 新增 保存 添加记录
            ServerSave() {
                this.$refs.editform2.validate((valid) => {
                    if(valid) {
                        let wxStaTime = ""
                        wxStaTime = Vue.filter('dateFormat')(this.editform2.wxStaTime, 'yyyy-MM-dd hh:mm')
                        console.log(this.editform2.wxStaTime)
                            this.$httpPost('/message/workList/save', {
                                // 维修负责人
                                wrokId: this.addRecordId,
                                // 完成日期
                                wxStaTime: wxStaTime,
                                //材料使用情况
                                shiQk:this.editform2.shiQk,
                                // 处理内容
                                wxContent: this.editform2.wxContent,
                            }).then(res => {
                                axiosHttp.post('/message/workManagement/get', {
                                    id: this.rowId,
                                    alarmId : this.alarmId
                                }).then(res => {
                                    this.disposetableData = res.AddList;//处理记录
                                })
                                this.serverAddDialogVisible = false;

                            })

                    } else {
                        return false;
                    }
                });
            },
            //服务编号 报警编号 详情
            toAlarmorServeDetails(index,row){
                if (row) {
                    if(row.workType == 1){//预约服务详情
                        //  调用接口 获取详情
                        axiosHttp.post('/message/workManagement/get', {
                            id: row.id,
                            alarmId:row.alarmId

                        }).then(res => {
                            console.log(res)
                            this.editform=res.result;//基本信息
                            this.dealtableData = res.deList;//处理记录
                            this.pgtableData = res.PGList;//派工记录
                            this.addRecordId = res.result.id;
                            this.editform.workLevel = (res.result.workLevel == 1 ? '一般':(res.result.workLevel == 2?'紧急':'特急'));//紧急程度
                            if(res.result.appraise == '0'){
                                this.editform.appraise = '满意'
                            }
                            if(res.result.appraise == '1'){
                                this.editform.appraise = '基本满意'
                            }
                            if(res.result.appraise == '2'){
                                this.editform.appraise = '不满意'
                            }
                            if(res.result.cancelRy == null){//不展示取消原因
                                this.isShowCancleRn = false;
                            }else{
                                this.isShowCancleRn = true;
                            }
                            if(res.result.sjJe ==null){//是否展示收费信息
                                this.isShowCharge = false;
                                this.noShowCharge = true;
                            }else{
                                this.isShowCharge = true;
                                this.noShowCharge = false;
                            }
                            if(res.result.appraise == null){//是否展示评价信息
                                this.isShowAppraise = false;
                                this.noShowAppraise = true;
                            }else{
                                this.isShowAppraise = true;
                                this.noShowAppraise = false;
                            }
                        })
                        this.servesysAlarmNoDialogVisible = true;

                    }else{
                        //  调用接口 获取详情 报警
                        axiosHttp.post('/message/workManagement/get', {
                            id: row.id,
                            alarmId:row.alarmId

                        }).then(res => {
                            this.editform=res.alarm;//基本信息
                            this.editform.workNum = res.result.workNum;//服务单号
                            this.editform.workType = (res.result.workType == 0 ? '报警信息':'服务台');//服务类型
                            this.editform.alarmType = (res.alarm.alarmType == "01" ? '设备故障':(res.alarm.alarmType == "02"?'事件':''));//报警分类
                            this.editform.alarmLevel = (res.alarm.alarmLevel == "01" ? '普通':(res.alarm.alarmLevel == "02"?'重要':(res.alarm.alarmLevel == "03"?'严重':'')));//报警级别
                            this.pgtableData = res.PGList;//派工记录
                            this.dealtableData = res.deList;//处理进度
                        })
                        // 查询报警报警详细时间
                        this.getAlarmLog(row.alarmId);
                        this.detailsTableVisible = true;
                    }

                 }
            },

            // 开始处理
            toStartDispose(index, row) {
                if (row) {
                    this.startDisposeIds = row.id;
                    this.alarmIds = row.alarmId;
                    this.handelVisible = true;
                } else {
                    if (this.$refs.table.store.states.selection.length > 0) {
                        let arr = this.$refs.table.store.states.selection;
                        console.log(arr);
                        for(var i = 0; i < arr.length; i++) {
                            if( arr[i].isRead == 0){
                                  this.$message.error('您无处理权限!');
                                  return;
                                }else{
                                    if(arr[i].workState != 0){
                                        this.$message.error('请选择待开始的数据!');
                                        return;
                                    }
                                    // if(arr[i].workState==3){
                                    //     this.$message.error('所选数据包含已回单数据，不用开始处理，请重新选择!');
                                    //     return;
                                    // }
                                }

                            }
                        this.handelVisible = true;
                    } else {
                        this.$message.error('请至少选择一条数据');
                    }
                }

            },
            //确定 开始处理 行  包括单选和多选
            handelRow() {
                axiosHttp.post('/message/workManagement/getSta', {
                    workId: this.startDisposeIds,
                    alarmId:this.alarmIds
                }).then(res => {
                    this.handelVisible = false;
                    this.startDisposeIds = "";
                    this.search();
                })
            },
            //弹出转派页面
            toAltother(index, row){
                if (this.$refs.table.store.states.selection.length > 0) {
                        let arr = this.$refs.table.store.states.selection;
                        for(var i = 0; i < arr.length; i++) {
                            if( arr[i].isRead == 0){
                                  this.$message.error('您无处理权限!');
                                  return;
                                }else{
                                    if(arr[i].workState == 0){
                                        this.$message.error('请先开始处理这条数据!');
                                        return;
                                    }
                                    if(arr[i].workState==3){
                                        this.$message.error('所选数据包含已回单数据,不能转派,请重新选择!');
                                        return;
                                    }
                                }

                            }
                        this.ipt_assign = []
                        this.editform1 = {}
                        let currentTime = new Date().getTime();
                        this.editform1.pgTime = currentTime
                        this.toAltotherDialogVisible = true;
                    } else {
                        this.$message.error('请至少选择一条数据');
                    }

            },
            //确定 转派 确定
            altotherRow(){
                   this.$refs.editform1.validate((valid) => {
                       if(valid) {
                            if(this.ipt_assign[0].length != 0) {
                                this.workPeopleAll += ',' + this.workPeople
                                this.workPeopleIdAll += ',' + this.workPeopleId
                                this.$httpPost('/message/workManagement/savePaiGong', {
                                    sysAlarmNo: this.sysAlarmNos,
                                    // 指派人
                                    workPeople: this.workPeople,
                                    // 指派人id
                                    workPeopleId: this.workPeopleId,
                                    // 指派时间
                                    workTime: this.editform1.pgTime,
                                    // 派工说明
                                    workExplain: this.editform1.content,
                                    // 所有人
                                    workPeopleAll: this.workPeopleAll,
                                    workPeopleIdAll: this.workPeopleIdAll,
                                    workId: this.workId
                                }).then(res => {
                                       this.search();
                                       this.sysAlarmNos = "";
                                       this.toAltotherDialogVisible = false;
                                       this.getUnReadCount();
                                })
                          }else{
                             this.$message.warning('指派人不能为空')
                          }

                       } else {
                           return false;
                       }
                   });
            },
            // 穿梭框更改时出发的事件
            handleChange(value, direction, movedKeys){
                //console.log(value, direction, movedKeys)
                this.arrInput = []
                this.arrInput.push(value.map(e => this.dataList.find(i => i.key === e).label))
                this.ipt_assign = this.arrInput
                this.submit_usId = JSON.parse(JSON.stringify(this.value13))
                let arrTest = util.flattenArray(this.ipt_assign)
                this.workPeople = arrTest.join(',')
                this.workPeopleId = this.submit_usId.join(',')
            },
            // 获取角色列表
            handleRoleList(){
                this.$httpPost('/system/user/role/getRoleName').then(res => {
                    this.roleList = res.data.body
                })
            },
            // 点击角色,获取对应人员列表
            handlePersonList(e){
                this.$httpPost('/system/userRole/getUserNameList', {
                    roleIds: e
                }).then(res => {
                    let perArr = JSON.parse(JSON.stringify(res.data.body))
                    this.dataList = []
                    this.value13 = []
                    for(let i=0; i< perArr.length; i++){
                        this.dataList.push({
                            key: perArr[i].userId,
                            label: perArr[i].userName
                        })
                    }
                })
            },
            //关闭转派页面
            closeAltother(){
                this.toAltotherDialogVisible = false;
            },
            // 回单
            toReback(index, row) {
                if (row) {
                    this.startDisposeIds = row.id;
                    this.alarmIds = row.alarmId;
                    this.rebackVisible = true;
                } else {
                    if (this.$refs.table.store.states.selection.length > 0) {
                        let arr = this.$refs.table.store.states.selection;
                        console.log(arr);
                        for(var i = 0; i < arr.length; i++) {
                            if( arr[i].isRead == 0){
                                  this.$message.error('您无处理权限!');
                                  return;
                                }else{
                                    if(arr[i].workState == 0){
                                        this.$message.error('请先开始处理这条数据!');
                                        return;
                                    }
                                    if(arr[i].workState == 3){
                                        this.$message.error('所选数据包含已回单数据,不能再回单,请重新选择!');
                                        return;
                                    }
                                }

                        }
                        this.rebackVisible = true;
                    } else {
                        this.$message.error('请至少选择一条数据');
                    }
                }

            },
            //确定 回单
            rebackRow() {
                axiosHttp.post('/message/workManagement/updatePGHD', {
                    workId: this.startDisposeIds,
                    alarmId:this.alarmIds
                }).then(res => {
                    this.rebackVisible = false;
                    this.startDisposeIds = "";
                    this.search();
                })
            },
            // 表格选择改变事件
            onSelect(val) {
                this.workPeopleAll = ''
                this.workPeopleIdAll = ''
                this.workPeopleAll = val[0].workPeople
                this.workPeopleIdAll = val[0].workPeopleId
                this.workId = val[0].id
                this.checkedArr = val;
                let idsArr = [];
                let alarmArr = [];
                let sysAlarmNoArr = [];
                for (var i = 0; i < val.length; i++) {
                    idsArr.push(val[i].id);
                    sysAlarmNoArr.push(val[i].sysAlarmNo);
                    alarmArr.push(val[i].alarmId);
                }
                this.startDisposeIds = idsArr.join(',');
                this.sysAlarmNos = sysAlarmNoArr.join(',');
                this.alarmIds = alarmArr.join(',');
            },
             // 工单来源(类型) （0报警  1服务台(服务)）
            workType: function (row, column, cellValue) {
                switch (row.workType){
                    case 0:
                        return "报警信息";
                    case 1:
                        return "服务台";
                    default:
                        return "";
                }
            },
            stateWorkLevel: function(row, column, cellValue) {
                if(this.workLevelList.find(item => item.value == row.workLevel)) return this.workLevelList.find(item => item.value == row.workLevel).label

            },
            // 工单状态 （0待开始  1进行中 2转派 3已回单）
            workState: function(row, column, cellValue) {
                if(this.workStateList.find(item => item.value == row.workState)) return this.workStateList.find(item => item.value == row.workState).label

            },
            ...mapActions(['getUnReadCount'])


        },

        // 页面加载时执行
        created: function () {
            this.search();
            this.handleRoleList();
            this.getCompanys();
            dict.dict('serverType').then(payload => this.serverTypeList = payload);
        }
    }
</script>
<style >
    .btnClass{
        padding: 6px 8px !important;
    }
    .last{
        margin-right: 5px;
    }

    .el-transfer__button:nth-child(2) {
       margin-left: 16px !important;
    }
    .el-dialog .el-button+.el-button {
        margin-left: 40px;
    }
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
    .el-card__header {
        padding: 5px 20px !important;
    }
    .el-dialog__headerbtn .el-dialog__close {
        color: #fff !important;
    }

    #pgdAlarmTime .el-step__head.is-wait {
        display: none;
    }
      #printServerPgd table, #printAlarmPgd table{
            font-family:"宋体";
            border-collapse:collapse;
            width:99.5%;
        }
        #printServerPgd table thead ,#printAlarmPgd table thead {

           border: 1px solid #eee;
        }
        #printServerPgd table thead th,#printAlarmPgd table thead th{
            height: 40px;
            font-size: 13px;
            width: 30%;
            text-align: center;
           border: 1px solid #eee;
        }
        #printServerPgd table tbody tr,#printAlarmPgd table tbody tr{
            font-size:13px;
            border: 1px solid #eee;
            height: 40px;
            text-align: center;
        }
        #printServerPgd table tbody td,#printAlarmPgd table tbody td{
            font-size: 13px;
            text-align: center;
            border: 1px solid #eee;
        }


</style>
