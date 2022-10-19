<template>
    <div class="wrap" id="alarm">
        <div class="subContent">
            <div class="tableWrap">
                <!--搜索功能-->
                <el-form :inline="true" :model="searchForm" class="demo-form-inline zr-row-scatter">
                    <div class="zr-row">
                       <!-- <el-button type="primary" @click="handleOpenAddDialog" v-if="hasRoleDuty">添 加</el-button> -->
                       <el-button type="primary" @click="handleCloseAlarm" v-if="hasRoleDuty">关闭报警</el-button>
                        <!-- <el-button type="primary" @click="toAlarmBatch()" v-if="hasRoleDuty">报警处理</el-button> -->
                       <!-- <el-button type="primary" @click="toDelete()">批量删除</el-button> -->
                    </div>
                    <div class="zr-row">
                        <el-form-item label="">
                            <el-input v-model="searchForm.keyword" clearable placeholder="关键字" />
                        </el-form-item>
                        <el-form-item label="">
                            <el-select v-model="searchForm.searchAlarmStatus" clearable style="width: 100%;" placeholder="报警状态" >
                                <el-option v-for="item in searchAlarmStatus" :label="item.label" :key="item.value" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="">
                            <el-select v-model="searchForm.deviceSystemName" clearable style="width: 100%;" placeholder="所属专业" >
                                <el-option v-for="item in deviceSystemNameList" :label="item.name" :key="item.name" :value="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="">
                            <el-date-picker v-model="searchForm.alarmTime" type="datetimerange" range-separator="至" start-placeholder="报警开始时间" end-placeholder="报警结束时间" format="yyyy-MM-dd HH:mm" align="right">
                            </el-date-picker>
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" @click="search('param')">搜索</el-button>
                        </el-form-item>
                    </div>
                </el-form>
                <!--数据表格渲染-->
                <el-table :data="tableData" stripe style="width: 100%;color: black" @selection-change="onSelect" :row-class-name="tableRowClassName">
                    <el-table-column type="selection" :selectable='checkboxT' width="60" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" type="index" label="序号" width="50" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="deviceSystemName" label="所属专业" align="center" width="100"></el-table-column>
                    <!-- 报警状态(0 已处理 1未确认  2未处理 3已关闭) -->
                    <el-table-column :show-overflow-tooltip="true" prop="alarmStatus" label="报警状态" align="center" width="100" :formatter="stateAlarmStatus"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" label="报警级别" align="center" :formatter="stateAlarmLevel">
                        <template slot-scope="scope">
                            <div :style="scope.row.alarmLevel==1?blue:(scope.row.alarmLevel ==2?yellow:red)">
                                <span style="color:white;"> {{scope.row.alarmLevel == 1?'普通':(scope.row.alarmLevel ==2?'重要':'严重') }}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="baoNum" label="报警编号" align="center">
                        <template slot-scope="scope">
                        <el-button type="text" size="smart" @click="toDetails(scope.$index, scope.row)">{{scope.row.baoNum}}</el-button>
                    </template>
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="alarmDevice" label="报警设备" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="postion" label="设备位置" align="center"></el-table-column>
                    <!-- 报警分类(0设备故障 1事件) -->
                    <el-table-column :show-overflow-tooltip="true" prop="alarmType" label="报警分类" align="center" :formatter="stateAlarmType"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="alarmName" label="报警描述" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="alarmTime" :formatter="alarmTime" label="最近报警时间" align="center" width="200"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="alrarmDurationTime" label="持续时长(小时)" align="center" width="160"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" size="mini" :disabled="scope.row.alarmStatus==='0' || scope.row.alarmStatus==='4' || scope.row.alarmStatus==='5'" @click="toAlarmBatch(scope.$index, scope.row)">报警处理</el-button>
                            <el-button type="text" v-if="false" :disabled="scope.row.alarmEditorState==0 || scope.row.alarmEditorState==null" size="mini" @click="handleShowInfoEdit(scope.$index, scope.row)">编辑</el-button>
                        </template>
                    </el-table-column>


                    <!-- <el-table-column :show-overflow-tooltip="true" type="index" label="序号" width="50"></el-table-column> -->
                    <!-- 告警定义Id -->
                    <!--<el-table-column :show-overflow-tooltip="true" prop="alarmDefineId" label="告警定义Id"></el-table-column>-->
                    <!-- 设备编号 -->
                    <!--<el-table-column :show-overflow-tooltip="true" prop="deviceNo" label="设备编号"></el-table-column>-->
                    <!-- 设备类别代码 -->
                    <!--<el-table-column :show-overflow-tooltip="true" prop="deviceTypeCode" label="设备类别代码"></el-table-column>-->
                    <!-- 设备类型名称 -->
                    <!--<el-table-column :show-overflow-tooltip="true" prop="deviceTypeName" label="设备类型名称"></el-table-column>-->
                    <!-- 设备专业代码 -->
                    <!--<el-table-column :show-overflow-tooltip="true" prop="deviceSystemCode" label="设备专业代码"></el-table-column>-->
                    <!-- 设备专业名称 -->
                    <!-- 设备子系统代码 -->
                    <!--<el-table-column :show-overflow-tooltip="true" prop="deviceSubSysCode" label="设备子系统代码"></el-table-column>-->
                    <!-- 设备子系统名称 -->
                    <!--<el-table-column :show-overflow-tooltip="true" prop="deviceSubSysName" label="设备子系统名称"></el-table-column>-->
                    <!-- 设备类别(用于前台页面展示) -->
                    <!--<el-table-column :show-overflow-tooltip="true" prop="deviceTypeShow" label="设备类别(用于前台页面展示)"></el-table-column>-->
                    <!-- 报警开始时间 -->
                    <!--<el-table-column :show-overflow-tooltip="true" prop="alarmStartTime" label="报警开始时间"></el-table-column>-->
                    <!-- 报警次数 -->
                    <!--<el-table-column :show-overflow-tooltip="true" prop="alarmCount" label="报警次数"></el-table-column>-->
                    <!-- 备注 -->
                    <!--<el-table-column :show-overflow-tooltip="true" prop="remark" label="备注"></el-table-column>-->
                </el-table>
                <!--分页-->
                <el-pagination v-if="renovatePagination" @size-change="onSizeChange" @current-change="onCurrentChange" :current-page=pageNum :page-sizes="[10, 15, 20, 25]" :page-size=pageSize layout="total, sizes, prev, pager, next, jumper" :total=totolNum>
                </el-pagination>
            </div>

            <!--添加报警信息弹框-->
            <el-dialog :close-on-click-modal="false"  title="创建报警信息" :visible.sync="addAlarmInfoVisible" width="900px">
                <div class="zr-row">
                    <div class="zi-g-3">
                        <el-form :model="alarmform" :rules="rules" ref="alarmform"  label-width="120px">
                            <el-col :span="24" style="margin-bottom: 20px;">
                                <h3>| 设备信息</h3>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="设备编号" prop="deviceNo">
                                    <el-input v-model="alarmform.deviceNo" />
                                </el-form-item>
                            </el-col>
                            <!-- x -->
                            <el-col :span="12">
                                <el-form-item label="设备专业" >
                                    <el-input v-model="alarmform.deviceSystemCode" />
                                </el-form-item>
                            </el-col>
                            <!-- x -->
                            <el-col :span="12">
                                <el-form-item label="设备子系统" >
                                    <el-input v-model="alarmform.deviceSubSysName" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="设备类别">
                                    <el-input v-model="alarmform.deviceTypeShow" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="报警设备" >
                                    <el-input v-model="alarmform.alarmDevice" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="24" style="margin-bottom: 20px;">
                                <h3>| 报警信息</h3>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="报警分类" prop="alarmType">
                                    <el-select v-model="alarmform.alarmType"  style="width: 100%;">
                                        <el-option v-for="item in alarmTypeList" :label="item.label" :key="item.value" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="报警级别" prop="alarmLevel">
                                    <el-select v-model="alarmform.alarmLevel"  style="width: 100%;">
                                        <el-option v-for="item in alarmLevelList" :label="item.label" :key="item.value" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="报警描述">
                                    <el-input type="textarea" v-model="alarmform.alarmName" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="报警时间"  style="overflow: hidden;">
                                    <el-date-picker v-model="alarmform.alarmTime" type="datetime" value-format="timestamp" format="yyyy-MM-dd HH:mm" placeholder="报警时间" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="持续时长(小时)" prop="alrarmDurationTime">
                                    <el-input v-model="alarmform.alrarmDurationTime" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="报警次数(次)" prop="alarmCount">
                                    <el-input v-model="alarmform.alarmCount" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="当前值" prop="alarmValue">
                                    <el-input v-model="alarmform.alarmValue" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="阈值" prop="thresholdValue">
                                    <el-input v-model="alarmform.thresholdValue" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="设备位置" prop="postion">
                                    <el-input v-model="alarmform.postion" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="24" style="text-align: center;">
                                <el-button type="primary" @click="handleAddAlarmInfo('alarmform')">确 定</el-button>
                                <el-button @click="addAlarmInfoVisible = false">取 消</el-button>
                            </el-col>
                        </el-form>
                    </div>
                </div>
            </el-dialog>
            <!--查看详情提示框-->
            <el-dialog :close-on-click-modal="false"  title="报警信息" :visible.sync="detailsTableVisible" width="900px">
                <div class="zr-row">
                    <div class="zi-g-3">
                        <el-form :model="checkform" :rules="rules" ref="checkform"  label-width="120px">
                            <el-col :span="24" style="margin-bottom: 20px;">
                                <h3>| 设备信息</h3>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="设备编号" prop="deviceCode">
                                    <el-input v-model="checkform.deviceCode" disabled />
                                </el-form-item>
                            </el-col>
                            <!-- x -->
                            <el-col :span="12">
                                <el-form-item label="设备专业" >
                                    <el-input v-model="checkform.deviceSystemName" disabled />
                                </el-form-item>
                            </el-col>
                            <!-- x -->
                            <el-col :span="12">
                                <el-form-item label="设备子系统" >
                                    <el-input v-model="checkform.deviceSubSysName" disabled />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="设备类别">
                                    <el-input v-model="checkform.deviceTypeName" disabled />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="报警设备" >
                                    <el-input v-model="checkform.alarmDevice" disabled />
                                </el-form-item>
                            </el-col>
                            <!-- <el-col :span="24" style="margin-bottom: 20px;">
                                <h3>| 报警定义</h3>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="报警名称" prop="alarmType">
                                    <el-input v-model="checkform.alarmType" disabled />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="负责人群" prop="alarmLevel">
                                    <el-input v-model="checkform.alarmLevel" disabled />
                                </el-form-item>
                            </el-col> -->
                            <el-col :span="24" style="margin-bottom: 20px;">
                                <h3>| 报警信息</h3>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="报警编号" prop="baoNum">
                                    <el-input v-model="checkform.baoNum" disabled />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="报警分类" >
                                    <el-select v-model="checkform.alarmType"  style="width: 100%;" :disabled="true">
                                        <el-option v-for="item in alarmTypeList" :label="item.label" :key="item.value" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="报警级别" >
                                    <el-select v-model="checkform.alarmLevel"  style="width: 100%;" :disabled="true">
                                        <el-option v-for="item in alarmLevelList" :label="item.label" :key="item.value" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="报警描述">
                                    <el-input type="textarea" v-model="checkform.alarmName" disabled />
                                </el-form-item>
                            </el-col>
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
                            <el-col :span="12">
                                <el-form-item label="持续时长(小时)" prop="alrarmDurationTime">
                                    <el-input v-model="checkform.alrarmDurationTime" disabled />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="报警次数(次)" prop="alarmCount">
                                    <el-input v-model="checkform.alarmCount" disabled />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="当前值" prop="alarmValue">
                                    <el-input v-model="checkform.alarmValue" disabled />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="阈值" prop="thresholdValue">
                                    <el-input v-model="checkform.thresholdValue" disabled />
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="设备位置" prop="postion">
                                    <el-input v-model="checkform.postion" disabled />
                                </el-form-item>
                            </el-col>
                            <el-col :span="24" style="margin-bottom: 20px;">
                                <h3>| 派工详情</h3>
                            </el-col>
                            <el-col :span="24">
                                 <el-table :data="detailsData" stripe style="width: 100%;color: black;margin-bottom: 20px;" :row-class-name="tableRowClassName">
                                    <el-table-column :show-overflow-tooltip="true" prop="workTime" :formatter="predictTimeFormatter" label="派工时间" align="center"></el-table-column>
                                    <el-table-column :show-overflow-tooltip="true" prop="workPeople" label="处理人" align="center"></el-table-column>
                                    <el-table-column :show-overflow-tooltip="true" prop="withTime" :formatter="redictTimeFormatter" label="回单时间" align="center"></el-table-column>
                                    <el-table-column :show-overflow-tooltip="true" prop="operationContent" label="派工说明" align="center"></el-table-column>
                                 </el-table>
                            </el-col>
                            <el-col :span="24" style="margin-bottom: 20px;">
                                <h3>| 处理记录</h3>
                            </el-col>
                            <el-col :span="24">
                                 <el-table :data="recordData" stripe style="width: 100%;color: black" :row-class-name="tableRowClassName">
                                    <el-table-column :show-overflow-tooltip="true" prop="workTime" :formatter="predictTimeFormatter" label="处理时间" align="center"></el-table-column>
                                    <el-table-column :show-overflow-tooltip="true" prop="workSatus" label="操作" align="center"></el-table-column>
                                    <el-table-column :show-overflow-tooltip="true" prop="workPeople" label="操作人" align="center"></el-table-column>
                                    <el-table-column :show-overflow-tooltip="true" prop="operationContent" label="内容" align="center"></el-table-column>
                                 </el-table>
                            </el-col>
                        </el-form>
                    </div>
                </div>
            </el-dialog>
            <!--编辑弹出窗-->
            <el-dialog :close-on-click-modal="false"  title="报警信息编辑" :visible.sync="editTableVisible" width="900px" :before-close="closeDialog">
               <div class="zr-row">
                    <div class="zi-g-3">
                        <el-form :model="editform" :rules="rules" ref="editform"  label-width="120px">
                            <el-col :span="24" style="margin-bottom: 20px;">
                                <h3>| 设备信息</h3>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="设备编号" prop="deviceCode">
                                    <el-input v-model="editform.deviceCode" />
                                </el-form-item>
                            </el-col>
                            <!-- x -->
                            <el-col :span="12">
                                <el-form-item label="设备专业" >
                                    <el-input v-model="editform.deviceSystemCode" />
                                </el-form-item>
                            </el-col>
                            <!-- x -->
                            <el-col :span="12">
                                <el-form-item label="设备子系统" >
                                    <el-input v-model="editform.deviceSubSysName" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="设备类别">
                                    <el-input v-model="editform.deviceTypeShow" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="报警设备" >
                                    <el-input v-model="editform.alarmDevice" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="24" style="margin-bottom: 20px;">
                                <h3>| 报警信息</h3>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="报警分类" prop="alarmType">
                                    <el-select v-model="editform.alarmType"  style="width: 100%;">
                                        <el-option v-for="item in alarmTypeList" :label="item.label" :key="item.value" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="报警级别" prop="alarmLevel">
                                    <el-select v-model="editform.alarmLevel"  style="width: 100%;">
                                        <el-option v-for="item in alarmLevelList" :label="item.label" :key="item.value" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="报警描述">
                                    <el-input type="textarea" v-model="editform.alarmName" />
                                </el-form-item>
                            </el-col>
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
                            <el-col :span="12">
                                <el-form-item label="持续时长(小时)" prop="alrarmDurationTime">
                                    <el-input v-model="editform.alrarmDurationTime" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="报警次数(次)" prop="alarmCount">
                                    <el-input v-model="editform.alarmCount" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="当前值" prop="alarmValue">
                                    <el-input v-model="editform.alarmValue" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="阈值" prop="thresholdValue">
                                    <el-input v-model="editform.thresholdValue" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="设备位置" prop="postion">
                                    <el-input v-model="editform.postion" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="24" style="text-align: center;">
                                <el-button type="primary" @click="handleInfoEidt('editform')">确 定</el-button>
                                <el-button @click="editTableVisible = false">取 消</el-button>
                            </el-col>
                        </el-form>
                    </div>
                </div>
            </el-dialog>
            <!--删除提示框-->
            <el-dialog   :close-on-click-modal="false"  title="提示" :visible.sync="deleteVisible" width="30%">
                <span>确定删除？</span>
                <span slot="footer" class="dialog-footer">
		        <el-button type="primary" @click="deleteRow()">确 定</el-button>
                <el-button @click="deleteVisible = false">取 消</el-button>
		        </span>
            </el-dialog>
            <!--确认提示框-->
            <el-dialog   :close-on-click-modal="false"  title="提示" :visible.sync="alarmStatusVisible" width="30%">
                <span v-show="showAffirmDialog">是否确认报警？</span>
                <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="updateAlarmStatus()">确 定</el-button>
                <el-button @click="alarmStatusVisible = false">取 消</el-button>
		        </span>
            </el-dialog>
            <!--关闭报警提示框-->
            <el-dialog :close-on-click-modal="false" title="关闭报警" :visible.sync="showCloseDialog" width="30%">
                <div style="overflow: hidden;">
                    <el-form label-width="80px">
                        <el-form-item label="关闭原因" prop="remark">
                            <el-input type="textarea" :autosize="{minRows:5}" v-model="remark" maxlength="100" />
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="updateAlarmStatus()">确 定</el-button>
                <el-button @click="showCloseDialog = false">取 消</el-button>
		        </span>
            </el-dialog>
            <!--报警处理提示框-->
            <el-dialog :close-on-click-modal="false"  title="报警处理" :visible.sync="showAlarmDialog" width="1000px">
                <div style="overflow: hidden;">
                    <el-form  label-width="120px">
                        <el-form-item label="处理类型"  >
                            <el-radio-group v-model="handleType"  @change="handleTypeChange" >
                                <el-radio label="0">直接处理</el-radio>
                                <el-radio v-if="isAssign" label="1">派工</el-radio>
                                <el-radio label="2">关闭报警</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-form>
                </div>
                <div style="overflow: hidden;" v-if="showHandleType">
        			<el-form :rules="rules" v-if="toWorkVisible" label-width="120px">
                        <div>
                            <el-form-item label="指派给:" prop="ipt_assign">
                                <el-input style="display: inline-block;width: 100%;margin: 0 0 20px 0px;" :disabled="true" v-model="ipt_assign" />
                            </el-form-item>
                        </div>
                        <el-form-item :model="toWorkform" prop="jobForeman">
                            <el-row :gutter="20">
                                <el-col :span="8">
                                    <el-card style="height: 285px;over-flow: hidden;overflow-y: auto;">
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
                    <el-form label-width="120px" :rules="rules">
                        <el-form-item>
                            <span slot="label"><b style="color: red;">*</b>{{ handleTypeLabel }}</span>
                            <el-input type="textarea" :autosize="{minRows:5}" v-model="remark" maxlength="100" />
                        </el-form-item>
                        <el-form-item :label="handleTypeLabel1" prop="startTime" style="overflow: hidden;" v-if="showTime" label-width="120px">
                            <el-date-picker v-model="editform.startTime" type="datetime" value-format="timestamp"
                                            format="yyyy-MM-dd HH:mm" placeholder="派工时间" >
                            </el-date-picker>
                        </el-form-item>
                    </el-form>
                </div>
              <!--查看详情提示框-->
                <div class="zr-row">
                    <div class="zi-g-3" style="width: 100%">
                        <!-- <div class="m-l-30 p-10 c-blue f-w-700" v-dict:alarmStatus="editform.alarmStatus"></div> -->
                        <el-form :model="editform" ref="editform" label-width="120px">
                            <el-col :span="24">
                                <el-form-item label="设备编号" >
                                    <el-input v-model="editform.deviceCode" disabled />
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="报警设备" >
                                    <el-input v-model="editform.alarmDevice" disabled />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="报警分类" >
                                    <el-select v-model="editform.alarmType"  style="width: 100%;" disabled>
                                        <el-option v-for="item in alarmTypeList" :label="item.label" :key="item.value" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="报警级别" >
                                    <el-select v-model="editform.alarmLevel"  style="width: 100%;" disabled>
                                        <el-option v-for="item in alarmLevelList" :label="item.label" :key="item.value" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="设备类别" prop="deviceTypeCode">
                                    <!-- 设备类别代码 -->
                                    <el-input v-model="editform.deviceTypeShow" disabled />
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="报警描述" prop="deviceTypeName">
                                    <!-- 设备类型名称 -->
                                    <el-input v-model="editform.alarmName" disabled />
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="报警时间" prop="alarmTime">
                                    <!-- 设备类型名称 -->
                                    <el-date-picker v-model="editform.alarmTime" type="datetime" value-format="timestamp" format="yyyy-MM-dd HH:mm" disabled></el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="持续时长(小时)" prop="deviceTypeCode">
                                    <!-- 设备类别代码 -->
                                    <el-input v-model="editform.alrarmDurationTime" disabled />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="报警次数(次)" prop="deviceTypeName">
                                    <!-- 设备类型名称 -->
                                    <el-input v-model="editform.alarmCount" disabled />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="当前值" prop="alarmValue">
                                    <!-- 设备类型名称 -->
                                    <el-input v-model="editform.alarmValue" disabled />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="阈值" prop="thresholdValue">
                                    <!-- 设备类型名称 -->
                                    <el-input v-model="editform.thresholdValue" disabled />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="安装位置" prop="postion">
                                    <!-- 设备类型名称 -->
                                    <el-input v-model="editform.postion" disabled />
                                </el-form-item>
                            </el-col>
                        </el-form>
                    </div>
                </div>
                <div style="overflow: hidden;" >
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="showAlarmDialogSub('editform',dataFrom)">确 定</el-button>
                    <el-button @click="showAlarmDialog = false">取 消</el-button>
		        </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import { formatDate } from '../../../static/js/date.js'
    import { api, dict, axiosHttp, util } from '@/libs'
    import Vue from 'vue'
    import {mapActions} from 'vuex'

    export default {
        // 变量初始化定义
        data() {
            return {
                baoNum: '',
                dataFrom: 0,
                isAssign: false,
                searchAlarmStatus: [
                    {
                        value: '0',
                        label: '已处理'
                    },
                    {
                        value: '1',
                        label: '待处理'
                    },
                    {
                        value: '4',
                        label: '已派工'
                    },
                    {
                        value: '5',
                        label: '处理中'
                    }
                ],
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
                workLevel: 0,
                workPeople: '',
                workPeopleId: '',
                submit_usId: [],
                ipt_assign: [],
                roleList: [],
                tableData: [],
                detailsData: [],
                recordData: [],
                alarmLogTableData: [],
                deviceSystemNameList: [],
                arrInput: [],
                users: [],
                pageNum: 1,
                pageSize: 15,
                totolNum: 100,
                //刷新分页
                addAlarmInfoVisible: false,
                renovatePagination: true,
                showAlarmDialog: false,
                searchForm: {},
                editTableVisible: false,
                deleteVisible: false,
                // 有专业工程师的角色  显示按钮
                hasRoleEngineer: false,
                hasRoleDuty: true,
                showAffirmDialog:false,
                showCloseDialog:false,
                alarmStatusVisible:false,
                detailsTableVisible:false,
                toWorkVisible:false,
                showHandleType:true,
                showTime:false,
                deviceSystemCode:"",
                toWorkform:"",
                jobForeman:"",
                handleType:"0",
                handleTypeLabel:"报警处理",
                editform: {},
                alarmform: {},
                checkform: {},
                // 报警级别
                alarmLevelList:[],
                // 报警类别
                alarmTypeList:[],
                //树的数据结构
                titles:['人员列表','已选人员'],
            	dataList:[],
                value13: [],
                filterMethod(query, item) {
  					return item.pinyin.indexOf(query) > -1;
				},
                // 维修类别 1自维 2外维
                repairTypeList:[{
                    label:'自维',
                    value:'1'
                },{
                    label:'外维',
                    value:'2'
                }],
                repairType:'',
                // 耗材
                content:'',
                // 故障类别 1机械故障 2突发事件 3线路故障 4 签报 5 内部维修 6 日常维修 7 保修
                faultClassList:[],
                faultClass:'',
                //  维修开始时间
                startTime:'',
                //  维修结束时间
                endTime:'',
                name:'',
                deleteIds: '',
                alarmStatus: '',
                remark: '',
                checkedArr: [],
                // 校验
                rules: {
                    // 告警定义Id
                    alarmDefineId: [{ required: true, message: '请输入告警定义Id', trigger: 'blur' }],
                    // 设备编号
                    deviceCode: [{ required: true, message: '请输入设备编号', trigger: 'blur' }],
                    deviceNo: [{ required: true, message: '请输入设备编号', trigger: 'blur' }],
                    // 设备类别代码
                    deviceTypeCode: [{ required: true, message: '请输入设备类别代码', trigger: 'blur' }],
                    // 设备类型名称
                    deviceTypeName: [{ required: true, message: '请输入设备类型名称', trigger: 'blur' }],
                    // 设备专业代码
                    deviceSystemCode: [{ required: true, message: '请输入设备专业代码', trigger: 'blur' }],
                    // 设备专业名称
                    deviceSystemName: [{ required: true, message: '请输入设备专业名称', trigger: 'blur' }],
                    // 设备子系统代码
                    deviceSubSysCode: [{ required: true, message: '请输入设备子系统代码', trigger: 'blur' }],
                    // 设备子系统名称
                    deviceSubSysName: [{ required: true, message: '请输入设备子系统名称', trigger: 'blur' }],
                    // 设备类别(用于前台页面展示)
                    deviceTypeShow: [{ required: true, message: '请输入设备类别(用于前台页面展示)', trigger: 'blur' }],
                    // 报警名称
                    alarmName: [{ required: true, message: '请输入报警名称', trigger: 'blur' }],
                    // 报警分类(0设备故障 1事件)
                    alarmType: [{ required: true, message: '请选择报警分类', trigger: 'change' }],
                    // 报警级别
                    alarmLevel: [{ required: true, message: '请选择报警级别', trigger: 'blur' }],
                    // 报警开始时间
                    alarmStartTime: [{ required: true, message: '请选择报警开始时间', trigger: 'blur' }],
                    // 报警时间(最新报警时间)
                    alarmTime: [{ required: true, message: '请选择报警时间', trigger: 'blur' }],
                    // 持续时长
                    alrarmDurationTime: [{ required: true, message: '请输入持续时长', trigger: 'blur' }],
                    // 维修开始日期
                    startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
                    // 维修结束日期
                    endTime: [{ required: true, message: '请选择结束时间', trigger: 'blur' }],
                    // 维修类别 1自维 2外维
                    repairType: [{ required: true, message: '请选择维修类别 ', trigger: 'change' }],
                    // 故障类别 1机械故障 2突发事件 3线路故障 4签报 5内部维修 6日常维修 7保修
                    faultClass: [{ required: true, message: '请选择故障类别', trigger: 'change' }],
                    // 报警次数
                    alarmCount: [{ required: true, message: '请输入报警次数', trigger: 'blur' }],
                    // 报警状态(0 已处理 1未确认  2未处理 3已关闭)
                    alarmStatus: [{ required: true, message: '请输入报警状态(0 已处理 1未确认  2未处理 3已关闭)', trigger: 'blur' }],
                    // 备注
                    remark: [{ required: true, message: '请输入内容', trigger: 'blur' }],
                    // 指派给
                    ipt_assign: [{ required: true, message: '请选择指派人员', trigger: 'blur' }],
                    jobForeman: [{ required: true, message: '请选择指派人员', trigger: 'blur' }],
                }
            }

        },
        // 页面加载时执行
        created: function() {
            this.search();
            this.initServerType();
            this.username();
            this.hasRoles();
            this.showDeviceSystemName();
            this.handleRoleList();
        },
        // 自定义方法
        methods: {
            ...mapActions(['getUnReadCount']),
            // 编辑报警信息
            handleInfoEidt(formrule){
                this.$refs[formrule].validate((valid) => {
                    if(valid) {
                        this.$httpPost('/manage/equipmentRepair/save', {
                            alarmId:this.editform.id,
                            // 设备编号
                            deviceId: this.editform.deviceCode,
                            deviceTypeName: this.editform.deviceTypeName,
                            deviceSystemCode: this.deviceSystemCode,
                            // 维修开始日期
                            startTime :this.editform.startTime,
                            // 维修结束日期
                            endTime :this.editform.endTime,
                            deviceName :this.editform.alarmDevice,
                            // 故障类别
                            faultClass:this.editform.faultClass,
                            //  维修类别
                            repairType:this.editform.repairType,
                            // 耗材
                            content: this.editform.content,
                            // 数据来源 1告警来源 2手动添加
                            source:'1',
                        }).then(res => {
                            this.deviceSystemCode = "";
                            this.editTableVisible = false;
                            this.search();
                        })
                    }
                });
            },
            handleShowInfoEdit(index, row){
                this.editTableVisible = !this.editTableVisible
                this.editform = row
                this.editform.startTime = new Date()
            },
            // 添加报警信息
            handleAddAlarmInfo(){
                this.$httpPost('/manage/alarm/save', {
                    deviceCode: this.alarmform.deviceNo,
                    deviceSystemCode: this.alarmform.deviceSystemCode,
                    deviceSubSysName: this.alarmform.deviceSubSysName,
                    deviceTypeShow: this.alarmform.deviceTypeShow,
                    alarmDevice: this.alarmform.alarmDevice,
                    alarmType: this.alarmform.alarmType,
                    alarmLevel: this.alarmform.alarmLevel,
                    alarmName: this.alarmform.alarmName,
                    alarmTime: this.alarmform.alarmTime,
                    alrarmDurationTime: this.alarmform.alrarmDurationTime,
                    alarmCount: this.alarmform.alarmCount,
                    alarmValue: this.alarmform.alarmValue,
                    thresholdValue: this.alarmform.thresholdValue,
                    postion: this.alarmform.postion,
                    alarmEditorState: 1 
                }).then(res => {
                    this.alarmform = {}
                    this.addAlarmInfoVisible = !this.addAlarmInfoVisible
                    this.search()
                })
            },
            handleOpenAddDialog(){
                this.addAlarmInfoVisible = !this.addAlarmInfoVisible
            },
            // 关闭报警
            handleCloseAlarm(){
                if(this.checkedArr.length === 0) {
                    this.$message.error('请至少选择一条数据！');
                    return;
                }
                this.showCloseDialog = !this.showCloseDialog
            },
            // 穿梭框更改时出发的事件
            handleChange(value, direction, movedKeys){
                this.arrInput = []
                this.ipt_assign = []
                this.arrInput.push(value.map(e => this.dataList.find(i => i.key === e).label))
                this.ipt_assign = this.ipt_assign.concat(this.arrInput)
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
            // 获取所有人员列表(500)
            handleAllPersonList(){
                this.$httpPost('/system/userRole/getUserNameList', { roleIds:{} }).then(res => {
                    this.dataList = []
                    this.value13 = []
                    this.dataList = res.data.body
                })
            },
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
            showDeviceSystemName(){
                const _this = this;
                this.$httpPost('/manage/device/queryTreeListByRealId',{pId:'ZD'}).then(res=>{
                    _this.deviceSystemNameList=res.data.body;
                })
            },
            tableRowClassName({row, rowIndex}) {
                // if(row.alarmLevel === '01') return 'bg-blue'
                // else if(row.alarmLevel === '02') return 'bg-yellow'
                // else if(row.alarmLevel === '03') return 'bg-red'
            },
            // 初始化表格 搜索功能
            search(type) {
                if(type=='param'){
                    this.pageNum = 1;
                    this.renovatePagination = false;
                }
                let startTime = "";
                let endTime = "";
                if(this.searchForm.alarmTime != undefined) {
                    startTime = formatDate(this.searchForm.alarmTime[0], "yyyy-MM-dd hh:mm");
                    endTime = formatDate(this.searchForm.alarmTime[1], "yyyy-MM-dd hh:mm");
                }
                this.$httpPost('/manage/alarm/find', {
                    startTime:startTime,
                    endTime:endTime,
                    page: this.pageNum,
                    size: this.pageSize,
                    deviceSystemName :this.searchForm.deviceSystemName,
                    alarmStatus :this.searchForm.searchAlarmStatus,
                    keyword :this.searchForm.keyword
                }).then(res => {
                    this.tableData = res.data.body.content;
                    console.log(this.tableData)
                    this.totolNum = Number(res.data.body.totalElements);
                    this.renovatePagination = true
                })
            },
            // 修改 新增 保存
            save(formrule) {
                this.$refs[formrule].validate((valid) => {
                    if(valid) {
                        if(this.editform.startTime <= this.editform.endTime) {
                            this.$httpPost('/manage/equipmentRepair/save', {
                                alarmId:this.editform.id,
                                // 设备编号
                                deviceId: this.editform.deviceCode,
                                deviceTypeName: this.editform.deviceTypeName,
                                deviceSystemCode: this.deviceSystemCode,
                                // 维修开始日期
                                startTime :this.editform.startTime,
                                // 维修结束日期
                                endTime :this.editform.endTime,
                                deviceName :this.editform.alarmDevice,
                                // 故障类别
                                faultClass:this.editform.faultClass,
                                //  维修类别
                                repairType:this.editform.repairType,
                                // 耗材
                                content: this.editform.content,
                                // 数据来源 1告警来源 2手动添加
                                source:'1',
                            }).then(res => {
                                this.deviceSystemCode = "";
                                this.editTableVisible = false;
                                this.search();
                            })
                        }else {
                            this.$message.warning('结束日期不能早于开始日期')
                        }
                    } else {
                        return false;
                    }
                });
            },
            // 弹出修改弹出框
            toEdit(index, row) {
                this.editform = {};
                this.editTableVisible = true;
                if(row){
                    this.deviceSystemCode=row.deviceSystemCode;
                    this.editform = Object.assign({},row);
                }
            },
            initServerType(){
                this.$http("post", "/system/user/dict/findListByType", {typekey:"alarmLevel"}).then( res =>{
                    if(res.data.msg === "success") {
                        var dataArr = res.data.body;
                        if(dataArr.length!= 0){
                            for(var i = 0;i<dataArr.length;i++){
                                var newObj = new Object();
                                newObj.label = dataArr[i].name;
                                newObj.value = dataArr[i].code;
                                this.alarmLevelList.push(newObj);
                            }
                        }else{
                            this.alarmLevelList=[];
                        }
                    }else{
                        Toast("加载服务类型失败");
                    }
                });
                this.$http("post", "/system/user/dict/findListByType", {typekey:"alarmType"}).then( res =>{
                    if(res.data.msg === "success") {
                        var dataArr = res.data.body;
                        if(dataArr.length!= 0){
                            for(var i = 0;i<dataArr.length;i++){
                                var newObj = new Object();
                                newObj.label = dataArr[i].name;
                                newObj.value = dataArr[i].code;
                                this.alarmTypeList.push(newObj);
                            }
                        }else{
                            this.alarmTypeList=[];
                        }
                    }else{
                        Toast("加载服务类型失败");
                    }
                });
                this.$http("post", "/system/user/dict/findListByType", {typekey:"faultClass"}).then( res =>{
                    if(res.data.msg === "success") {
                        var dataArr = res.data.body;
                        if(dataArr.length!= 0){
                            for(var i = 0;i<dataArr.length;i++){
                                var newObj = new Object();
                                newObj.label = dataArr[i].name;
                                newObj.value = dataArr[i].code;
                                this.faultClassList.push(newObj);
                            }
                        }else{
                            this.faultClassList=[];
                        }
                    }else{
                        Toast("加载服务类型失败");
                    }
                });

            },

            // 关闭弹出框
            close(formName) {
                this.editTableVisible = false;
                this[formName] = {};
                this.$refs[formName].resetFields();
            },
            // 关闭弹出框
            closeDialog() {
                this.editTableVisible = false;
                this.$refs.editform.resetFields();
            },
            // 删除操作赋值删除项  并弹窗
            toDelete(index, row) {
                if(index == undefined) {
                    //					没勾选
                    if(this.deleteIds == "") {
                        this.$message.error('请至少选择一条数据！');
                        return;
                    }
                }
                if(row) {
                    this.deleteIds = row.id;
                }
                this.deleteVisible = true;

            },
            // 删除 行  包括单选和多选
            deleteRow() {
                this.$httpPost('/manage/alarm/delete', {
                    id: this.deleteIds
                }).then(res => {
                    this.deleteVisible = false;
                    this.deleteIds = "";
                    this.search();
                })
            },
            // 表格选择改变事件
            onSelect(val) {
                this.checkedArr = val;
                this.workLevel = val[0].alarmLevel
                this.alarmStatus = val[0].alarmStatus
                let idsArr = [];
                for(var i = 0; i < val.length; i++) {
                    idsArr.push(val[i].id)
                }
                this.deleteIds = idsArr.join(',');
            },
            // showButton(row){
            //     if(row.alarmEditorStatus !== null && row.alarmEditorStatus=="1"){
            //         return true;
            //     }else {
            //         return false;
            //     }
            // },
		    //树数据	
            hasRoles(){
                this.$httpPost('/manage/alarm/hasRoles', {
                    id: this.deleteIds
                }).then(res => {
                    if(res.data.code==0&&res.data.body.roles.length>0){
                        for(var i=0;i<res.data.body.roles.length;i++){
                            if(res.data.body.roles[i]=="1007"){

                                this.hasRoleEngineer=true;
                            }
                            if(res.data.body.roles[i]=="1008"){
                                this.hasRoleDuty=true;
                            }
                        }
                        // for()
                    }
                })
            },
            // 修改状态
            updateAlarmStatus() {
                if(this.remark==""){
                    this.$message.error('请输入内容！');
                    return;
                }
                this.$httpPost('/manage/alarm/updateAlarmStatus', {
                    ids: this.deleteIds,
                    remark: this.remark,
                    handleType: '2'
                }).then(res => {
                    this.alarmStatusVisible = false;
                    this.showCloseDialog = false;
                    this.deleteIds = "";
                    this.deleteIds = "";
                    this.remark = "";
                    this.search();
                })
            },
            // 显示
            toAlarmStatusBatch(value){
                this.alarmStatus=value;
                //	没勾选
                if(this.deleteIds == "") {
                    this.$message.error('请至少选择一条数据！');
                    return;
                }
                if(value==2){
                    this.showAffirmDialog=true;
                    this.alarmStatusVisible=true;
                }
                if(value ==3){
                    this.showAffirmDialog=false;
                    this.showCloseDialog=true;
                }
            },

            toAlarmBatch(index,row){
                this.deleteIds = row.id;
                this.editform = {};
                if(row){
                    this.editform = Object.assign({},row);
                    this.editform.startTime = new Date()
                    if(this.editform.alarmStatus === '1' || this.editform.alarmStatus === '2'){
                        this.isAssign = true;
                    }
                }
                //	没勾选
                if(!this.deleteIds) {
                    this.$message.error('请至少选择一条数据！');
                    return;
                }
                // this.toDetails(null,this.checkedArr[0])
                this.handleAllPersonList();
                this.baoNum = row.baoNum
                this.showAlarmDialog=true;
            },
            //时间格式化
            alarmTime(row, column, cellValue) {
                if(row.alarmTime!=null){
                    return Vue.filter('dateFormat')(row.alarmTime,'yyyy-MM-dd hh:mm')
                }
            },
            predictTimeFormatter(row, column, cellValue) {
                if (row.workTime != null) {
                    return Vue.filter('dateFormat')(row.workTime, 'yyyy-MM-dd hh:mm')
                }
                // if (row.withTime != null) {
                //     return Vue.filter('dateFormat')(row.withTime, 'yyyy-MM-dd hh:mm:ss')
                // }
                // if (row.tsTime != null) {
                //     return Vue.filter('dateFormat')(row.tsTime, 'yyyy-MM-dd')
                // }
                // if (row.appraiseTime != null) {
                //     return Vue.filter('dateFormat')(row.appraiseTime, 'yyyy-MM-dd')
                // }
                // if (row.sfTime != null) {
                //     return Vue.filter('dateFormat')(row.sfTime, 'yyyy-MM-dd')
                // }
            },
            redictTimeFormatter(row, column, cellValue) {
                if (row.withTime != null) {
                    return Vue.filter('dateFormat')(row.withTime, 'yyyy-MM-dd hh:mm')
                }
            },
            // 表格显示 报警状态（01普通  01重要 03严重）
            stateAlarmStatus: function(row, column, cellValue) {
                switch (row.alarmStatus){
                    case "0":
                        return "已处理";
                    case "1":
                        return "待处理";
                    case "2":
                        return "待处理";
                    case "3":
                        return "已关闭";
                    case "4":
                        return "已派工";
                    case "5":
                        return "处理中";
                    default:
                        return "";
                }
            },
            //复选框
            checkboxT(row,index){
                // alert(row.visitorStatus)
                if( row.alarmStatus==='0' || row.alarmStatus==='1' || row.alarmStatus==='2' ) {
                    return 1;
                } else {
                    return 0;
                }

            },
            // 报警分类(01设备故障 02事件)
            stateAlarmType: function(row, column, cellValue) {
                switch (row.alarmType){
                    case "01":
                        return "设备故障";
                    case "02":
                        return "事件";
                    default:
                        return "";
                }
            },
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
            // 表格显示 报警级别（01普通  01重要 03严重）
            stateAlarmLevel: function(row, column, cellValue) {
                switch (row.alarmLevel){
                    case "01":
                        return "普通";
                    case "02":
                        return "重要";
                    case "03":
                        return "严重";
                    default:
                        return "";
                }
            },
            // 弹出查看详情弹出框
            toDetails(index, row) {
                const _this = this;
                this.editform = {};
                this.detailsTableVisible = false;
                if(row){
                    this.checkform = Object.assign({},row);
                    axiosHttp.post('/message/workManagement/get', {
                        alarmId: row.id,
                        id: ''
                    }).then(res => {
                        this.detailsData = res.PGList;
                        this.recordData = res.deList;
                    })
                    // 查询报警报警详细时间
                    this.getAlarmLog(row.id);
                }
                this.detailsTableVisible = true;
            },
            getAlarmLog(alarmId){
                this.$httpPost('/manage/alarmLog/find', {
                    alarmId:alarmId
                    // page: this.pageNum,
                    // size: this.pageSize

                }).then(res => {
                    console.log(res)
                    this.alarmLogTableData = []
                    let arr = res.data.body.content
                    if(arr.length > 0) {
                        this.alarmLogTableData.push(arr[0])
                        if(arr.length > 1) {
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
            username(){
                let username = localStorage.getItem('csmpLoginName');
                // alert(username)
                this.name=username;
                // return username ? username : this.name;
            },
            handleTypeChange(val){
                this.toWorkVisible=false
                this.dataFrom = val
                if(val==0){
                	this.showTime=false;
                    this.toWorkVisible=false
                    this.handleTypeLabel='处理内容'
                }else if(val==1){
                    this.value13 = []
                    this.arrInput = []
                    this.ipt_assign = []
                    this.dataList = []
                	this.showTime=true;
                    this.toWorkVisible=true
                    this.handleTypeLabel='派工说明'
                    this.handleTypeLabel1='派工时间'
                        this.$httpPost('/system/user/role/getUserByRole', {
                        "code": "10002"
                    }).then(response => {
                        let data = response.data.body;
                        this.users = data;
                    });
                }else if(val==2){
                	this.showTime=false;
                    this.toWorkVisible=false
                    this.handleTypeLabel='关闭原因'
                }
            },
            showAlarmDialogSub(formrule, dataFrom){
                this.$refs[formrule].validate((valid) => {
                    if(this.remark==""){
                        this.$message.error('请输入内容！');
                        return;
                    }
                    if(dataFrom !=1){
                        this.$httpPost('/manage/alarm/updateAlarmStatus', {
                            ids: this.deleteIds,             
                            handleType: dataFrom,            
                            remark: this.remark
                        }).then(res =>{
                            this.alarmStatusVisible = false;
                            this.showCloseDialog = false;
                            this.deleteIds = "";
                            this.remark = "";
                            this.showAlarmDialog = false;
                            this.getUnReadCount();
                            this.search();
                        })
                    } else {
                        // this.$httpPost('/manage/alarm/updateAlarmStatus', {
                            console.log()
                        if(this.ipt_assign[0].length === 0){
                            this.$message.error('请选择指派人员！');
                            return;
                        }
                        this.$httpPost('/message/workManagement/save', {
                            alarmId: this.deleteIds,
                            GDType: 0,
                            workPeople: this.workPeople,
                            workPeopleId: this.workPeopleId,
                            workExplain: this.remark,
                            workTime: this.editform.startTime,
                            workLevel: this.workLevel,
                            sysAlarmNo: this.baoNum
                        }).then(res => {
                            this.alarmStatusVisible = false;
                            this.showCloseDialog = false;
                            this.deleteIds = "";
                            this.remark = "";
                            this.baoNum = "";
                            this.showAlarmDialog = false;
                            this.getUnReadCount();
                            this.search();
                        })
                    }
                    
                })
            }
        }
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
        .el-card__header {
            padding: 5px 20px !important;
        }
        .el-dialog__headerbtn .el-dialog__close {
            color: #fff !important;
        }
    }
</style>