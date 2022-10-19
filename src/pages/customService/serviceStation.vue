<template>
    <div class="wrap">
        <div class="subContent">
            <div class="tableWrap">
                <!--搜索功能-->
                <el-form :inline="true" :model="searchForm" class="demo-form-inline zr-row-scatter">
                    <div class="zr-row" style="margin-right:20px">
                        <el-button type="primary" @click="editServe()" class="btnClass">创建</el-button>
                        <!-- <el-button type="primary" @click="editServe()" class="btnClass">编辑</el-button> -->
                        <!-- <el-button type="primary" @click="toDelete()" class="btnClass">删除</el-button> -->
                        <el-button type="primary" @click="toAssign()" class="btnClass last">派工</el-button>
                        <el-button type="primary" @click="toCancleServe()" class="btnClass">取消服务</el-button>
                    </div>
                    <div class="zr-row">
                        <el-form-item label="">
                            <!-- 关键字 -->
                            <el-input v-model="searchForm.keyWord" clearable placeholder="关键字"></el-input>
                        </el-form-item>
                        <el-form-item label="">
                            <DictSelect v-model="searchForm.fuType" selectData="serverType"
                                        placeholder="服务类型"></DictSelect>
                        </el-form-item>
                        <el-form-item label="">
                            <!--服务状态 -->
                            <el-select v-model="searchForm.serverState" placeholder="服务状态" clearable>
                            	<el-option label="待派工" value="1"></el-option>
                            	<el-option label="已派工" value="2"></el-option>
                            	<el-option label="已处理" value="3"></el-option>
                            	<el-option label="已取消" value="4"></el-option>
                                <el-option label="已评价" value="5"></el-option>
                                <el-option label="处理中" value="6"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="">
                            <el-date-picker v-model="searchForm.serverTime" type="daterange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" format="yyyy-MM-dd" align="right">
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
                    <!-- 服务单号 -->
                    <el-table-column show-overflow-tooltip prop="sysAlarmNo" align="center" label="服务单号">
                        <template slot-scope="scope">
                            <el-button type="text" size="smart" @click="toserveDetails(scope.$index, scope.row)">
                                {{scope.row.sysAlarmNo}}
                            </el-button>
                        </template>
                    </el-table-column>
                    <!-- 紧急程度-->
                    <el-table-column :show-overflow-tooltip="true" label="紧急程度" prop="workLevel" align="center">
                         <template slot-scope="scope">
                             <div :style="scope.row.workLevel==1?blue:(scope.row.workLevel ==2?yellow:red)">
                                 <span style="color:white;"> {{scope.row.workLevel == 1?'一般':(scope.row.workLevel ==2?'紧急':'特急') }}</span>
                             </div>
                         </template>
                    </el-table-column>
                    <!-- 服务类型 -->
                    <el-table-column :show-overflow-tooltip="true" prop="fuType" :formatter="serverType" label="服务类型" align="center"></el-table-column>
                    <!-- 预约时间 -->
                    <el-table-column :show-overflow-tooltip="true" prop="tsTime" label="预约时间" :formatter="predictTimeFormatter" align="center"></el-table-column>
                    <!-- 问题描述 -->
                    <el-table-column :show-overflow-tooltip="true" prop="workWt" align="center" label="问题描述"></el-table-column>
                    <!-- 状态 -->
                    <el-table-column :show-overflow-tooltip="true" prop="serverState" label="状态" align="center" :formatter="workState">
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" label="操作" align="center" width="180">
                        <template slot-scope="scope">
                            <!-- <el-button type="text" size="mini" :disabled="false" @click="editServe(scope.$index, scope.row)">编辑</el-button> -->
                            <el-button type="text" size="mini" :disabled="(scope.row.serverState ==3 ||scope.row.serverState ==5)&&(scope.row.sjJe == null || scope.row.sjJe =='' || scope.row.sjJe == 0)?false:true" @click="toCharge(scope.$index, scope.row)">收费</el-button>
                            <el-button type="text" size="mini" :disabled="scope.row.serverState !=3?true:false" @click="toWriteJudge(scope.$index, scope.row)" >录入评价</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页-->
                <el-pagination v-if="renovatePagination" @size-change="onSizeChange" @current-change="onCurrentChange"
                               :current-page="pageNum" :page-sizes="[10, 15, 20, 25]" :page-size="pageSize"
                               layout="total, sizes, prev, pager, next, jumper" :total="totolNum">
                </el-pagination>
            </div>
            <!-- 派工弹出页面 -->
            <el-dialog   :close-on-click-modal="false"  title="派工" :visible.sync="toAltotherDialogVisible"
                       :before-close="close" width="900px">
                <el-form :model="editform1"   ref="editform1" :rules="rules" label-width="80px">
                    <el-row>
                        <div>
                            <el-form-item label="指派给:" prop="ipt_assign">
                                <el-input style="display: inline-block;width: 70%;margin: 0 0 20px 30px;" :disabled="true" v-model="ipt_assign"></el-input>
                            </el-form-item>
                        </div>
                    </el-row>
                    <div style="overflow: hidden;" >
                    	<el-form >
                            <el-form-item :model="toserveform" prop="jobForeman">
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
                    <!-- 派工时间 -->
                        <el-col :span="12">
                            <el-form-item label="派工时间" prop="pgTime">
                                <el-date-picker v-model="editform1.pgTime" type="datetime" value-format="timestamp"  format="yyyy-MM-dd HH:mm">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!-- 派工说明 -->
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="派工说明" prop="content">
                                <el-input v-model="editform1.content" type="textarea" :autosize="{minRows:10}"  maxlength="1000"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="altotherRow()">确 定</el-button>
                    <el-button @click="toAltotherDialogVisible = false">取 消</el-button>
                </span>
            </el-dialog>
            <!-- 新增 -->
            <el-dialog   title="创建" :visible.sync="addEditDialogVisible" :before-close="close" width="900px">
                <el-form :model="editform" :rules="rules" ref="editform" label-width="140px">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="服务类型" prop="fuType">
                               <DictSelect v-model="editform.fuType" selectData="serverType"
                                           placeholder="服务类型" clearable></DictSelect>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="联系人" prop="linkman">
                                <!-- 联系人 -->
                                <el-input v-model="editform.linkman"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="联系电话" prop="linkmanNum">
                                <!-- 联系电话 -->
                                <el-input v-model="editform.linkmanNum"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="紧急程度" prop="workLevel">
                                <!-- 紧急程度 1一般 2紧急 3特急-->
                                <el-select v-model="editform.workLevel" placeholder="紧急程度" clearable>
                                	<el-option label="一般" value="1"></el-option>
                                	<el-option label="紧急" value="2"></el-option>
                                    <el-option label="特急" value="3"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <!-- 时间 -->
                            <el-form-item label="预约时间" prop="tsTime">
                                <el-date-picker
                                     v-model="editform.tsTime"
                                     type="datetime"
                                     value-format="timestamp"
                                     format="yyyy-MM-dd HH:mm"
                                     placeholder="预约时间"
                                     >
                                 </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="公司名称" prop="companyId">
                                <el-select v-model="editform.companyId" placeholder="公司名称" class="w-100" @change="companyChange">
                                     <el-option v-for="item in companys" :key= item.id :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="服务区域" prop="areaName">
                                <el-select v-model="editform.areaName" placeholder="所属区域" class="w-100" >
                                     <el-option v-for="item in houseFunctionOption" :key= item.areaId :label="item.areaName" :value="item.areaName"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <!-- 问题描述 -->
                        <el-col :span="24">
                            <el-form-item label="问题描述" prop="workWt">
                                <el-input v-model="editform.workWt" type="textarea" :autosize="{minRows:5}" :disabled="isDetail" maxlength="100"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <!-- 备注 -->
                        <el-col :span="24">
                            <el-form-item label="备注" prop="remark">
                                <el-input v-model="editform.remark" type="textarea" :autosize="{minRows:5}" :disabled="isDetail" maxlength="100"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span v-if="!isDetail" slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="saveServe()" :disabled="isSuscess">确 定</el-button>
                    <el-button @click="close()">取 消</el-button>
                </span>
            </el-dialog>
            <!--预约服务详情弹出窗-->
            <el-dialog   :close-on-click-modal="false"  title="预约服务详情" :visible.sync="serveDialogVisible" width="900px">
                <span style="font-weight: 600;">基础信息</span>
                <el-form :model="editform"  ref="editform"  label-width="120px">
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
                <span style="font-weight: 600;display: inline-block;margin: 20px 0;">处理记录</span>
                <el-table  :data="dealtableData" border style="width: 85%;margin-left: 15%;">
                    <el-table-column :show-overflow-tooltip="true" prop="workTime" label="处理时间" :formatter="workTimeFormatter" align="center"></el-table-column>
                    <el-table-column prop="workSatus" label="操作" align="center"></el-table-column>
                    <el-table-column prop="workPeople" label="操作人"  align="center"></el-table-column>
                    <el-table-column prop="operationContent" label="内容" align="center"></el-table-column>
                </el-table>
                <!-- 收费信息 -->
                <el-form  label-width="120px" v-show="noShowCharge">
                    <div style="font-weight: 600;margin: 20px 0;">收费信息</div>
                    <span>暂无信息</span>
                </el-form>
                <el-form :model="editform" ref="editform"  label-width="120px" v-show="isShowCharge">
                    <span style="font-weight: 600;display: inline-block;margin: 20px 0;">收费信息</span>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="实收金额" prop="sjJe">
                                <el-input v-model="editform.sjJe" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="收费日期" prop="sfTime">
                                <!-- 收费时间 -->
                                <el-date-picker v-model="editform.sfTime" type="datetime" value-format="timestamp"
                                                format="yyyy-MM-dd"  disabled>
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="明细说明" prop="sfSm">
                                <el-input v-model="editform.sfSm" type="textarea" :autosize="{minRows:5}" disabled maxlength="100"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <!-- 评价信息 -->
                <el-form  label-width="120px" v-show="noShowAppraise">
                    <div style="font-weight: 600;margin: 20px 0;">评价信息</div>
                    <span>暂无信息</span>
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
                                <!-- 收费时间 -->
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
                                <el-input v-model="editform.appraiseCont " type="textarea" :autosize="{minRows:5}" disabled maxlength="100"></el-input>
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
            <!--服务工单详情弹出窗-->
            <el-dialog   :close-on-click-modal="false"  title="服务工单详情" :visible.sync="serveVisible" width="900px">
                        <span style="font-weight: 600;">基本信息</span>
                        <el-form :model="fwgdeditform" ref="fwgdeditform"  label-width="120px">
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="工单编号" prop="workNum">
                                        <el-input v-model="fwgdeditform.workNum" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="工单来源" prop="workType">
                                        <el-input v-model="fwgdeditform.workType" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="服务单号" prop="sysAlarmNo">
                                        <el-input v-model="fwgdeditform.sysAlarmNo" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="服务类型" prop="deviceNo" >
                                        <el-input v-model="fwgdeditform.deviceNo" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="联系人" prop="alarmDevice">
                                        <el-input v-model="fwgdeditform.alarmDevice" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="联系电话" prop="deviceTypeName">
                                        <!-- 设备类别代码 -->
                                        <el-input v-model="fwgdeditform.deviceTypeName" disabled ></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="紧急程度" prop=" alarmLevel">
                                        <el-input v-model="fwgdeditform.alarmLevel" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="预约时间" prop="alarmTime">
                                        <!-- 报警时间 -->
                                        <el-date-picker v-model="fwgdeditform.alarmTime" type="datetime" value-format="timestamp"
                                                        format="yyyy-MM-dd"  disabled>
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="公司名称" prop="CompanyName">
                                        <el-select v-model="editform.companyId" placeholder="公司名称" class="w-100" @change="companyChange">
                                             <el-option v-for="item in companys" :key= item.id :label="item.name" :value="item.id"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="服务区域" prop="">
                                        <el-select v-model="editform.areaId" placeholder="所属区域" class="w-100" >
                                             <el-option v-for="item in houseFunctionOption" :key= item.areaId :label="item.areaName" :value="item.areaId"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <!-- 问题描述 -->
                                <el-col :span="24">
                                    <el-form-item label="问题描述" prop="workWt">
                                        <el-input v-model="fwgdeditform.workWt" type="textarea" :autosize="{minRows:5}" :disabled="isDetail" maxlength="100"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <!-- 备注 -->
                                <el-col :span="24">
                                    <el-form-item label="备注" prop="remark">
                                        <el-input v-model="fwgdeditform.remark" type="textarea" :autosize="{minRows:5}" :disabled="isDetail" maxlength="100"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>

                <span style="font-weight: 600;display:inline-block;margin: 20px 0;">派工记录</span>
                <el-table
                    :data="pgtableData"
                    border
                    style="width: 85%;margin-left: 15%">
                    <el-table-column :show-overflow-tooltip="true" prop="workTime" label="派工时间" :formatter="workTimeFormatter" align="center"></el-table-column>
                    <el-table-column prop="workPeople" label="处理人" align="center"></el-table-column>
                    <el-table-column prop="withTime" label="回单时间" :formatter="withTimeFormatter" align="center"></el-table-column>
                    <el-table-column prop="operationContent" label="派工说明" align="center"></el-table-column>
                </el-table>
                <span style="font-weight: 600;display: inline-block;margin: 20px 0;">处理记录</span><el-button type="primary" style="padding: 6px;margin-left:5px ;" @click="addRecord()">添加记录</el-button>
                <el-table :data="disposetableData" border   style="width: 85%;margin-left: 15%">
                    <el-table-column :show-overflow-tooltip="true" prop="workTime" label="完成时间" :formatter="predictTimeFormatter" align="center"></el-table-column>
                    <el-table-column prop="shi_qk" label="材料使用情况" align="center"></el-table-column>
                    <el-table-column prop="wx_content" label="处理内容" align="center"></el-table-column>
                </el-table>
            </el-dialog>
            <!-- 收费 -->
            <el-dialog   :close-on-click-modal="false"  title="结账收款" :visible.sync="chargeDialogVisible" width="900px">
                        <span style="font-weight: 600;">服务信息</span>
                        <el-form :model="editform"  ref="editform"  label-width="120px">
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
                <!-- 收费信息 -->
                <el-form :model="editformCharge" :rules="rules"  ref="editformCharge"  label-width="120px" >
                    <span style="font-weight: 600;display: inline-block;margin: 20px 0;">收费信息</span>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="实收金额" prop="sjJe">
                                <el-input v-model="editformCharge.sjJe" ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="收费日期" prop="sfTime">
                                <!-- 收费时间 -->
                                <el-date-picker v-model="editformCharge.sfTime" type="date" value-format="timestamp"
                                                format="yyyy-MM-dd">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    </el-row>
                    <el-row>
                        <!-- 明细说明 -->
                        <el-col :span="24">
                            <el-form-item label="明细说明" prop="Sf_Sm">
                                <el-input v-model="editformCharge.Sf_Sm" type="textarea" :autosize="{minRows:5}"  maxlength="100"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="chargeSave()">确 定</el-button>
                    <el-button @click="chargeDialogVisible = false">取 消</el-button>
                </span>
            </el-dialog>
            <!-- 录入评价 -->
            <el-dialog   :close-on-click-modal="false"  title="评价" :visible.sync="writeDialogVisible" width="900px">
                <span style="font-weight: 600;">服务信息</span>
                <el-form :model="editform"  ref="editform"  label-width="120px">
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
                            <el-form-item label="公司名称" prop="CompanyName">
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
                <!-- 评价信息 -->
                <el-form :model="editformAppraise" ref="editformAppraise" :rules="rules"  label-width="120px" >
                    <span style="font-weight: 600;display: inline-block;margin: 20px 0;">评价信息</span>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="评价" prop="appraise">
                                <el-select v-model="editformAppraise.appraise" placeholder="评价" clearable>
                                	<el-option label="满意" value="0"></el-option>
                                	<el-option label="基本满意" value="1"></el-option>
                                    <el-option label="不满意" value="2"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="评价日期" prop="appraiseTime">
                                <!-- 收费时间 -->
                                <el-date-picker v-model="editformAppraise.appraiseTime" type="date" value-format="timestamp"
                                                format="yyyy-MM-dd" >
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="评价人" prop="appraiseName">
                                <el-input v-model="editformAppraise.appraiseName" ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="评价人电话" prop="appraiseNum">
                                <el-input v-model="editformAppraise.appraiseNum" ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <!-- 评价内容 -->
                        <el-col :span="24">
                            <el-form-item label="评价内容" prop="appraiseCont">
                                <el-input v-model="editformAppraise.appraiseCont" type="textarea" :autosize="{minRows:5}"  maxlength="100"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="writeSave()">确 定</el-button>
                    <el-button @click="writeDialogVisible = false">取 消</el-button>
                </span>
            </el-dialog>
            <!--服务添加记录弹出窗-->
            <el-dialog   :close-on-click-modal="false"  title="添加记录" :visible.sync="serverAddDialogVisible" width="700px">
                <el-form :model="editform2" ref="editform2"  label-width="120px">
                    <el-row>
                         <el-col :span="12">
                            <el-form-item label="完成时间" prop="wxStaTime">
                                <el-date-picker v-model="editform2.wxStaTime" type="date" value-format="timestamp"
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
                            <el-form-item label="处理内容" >
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
            <!-- 取消服务弹框 -->
            <el-dialog   :close-on-click-modal="false"  title="取消服务" :visible.sync="cancleDialogVisible"
                       :before-close="close" width="700px">
                <el-form :model="editform1" :rules="rules" ref="editform1" label-width="70px">
                    <el-row>
                        <!-- 取消原因 -->
                        <el-col :span="24">
                            <el-form-item label="取消原因" prop="cancelRy">
                                <el-input v-model="editform1.cancelRy" type="textarea" :autosize="{minRows:5}"  maxlength="1000"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="cancleRow()">确 定</el-button>
                    <el-button @click="cancleDialogVisible = false">取 消</el-button>
                </span>
            </el-dialog>
            <!--删除提示框-->
            <el-dialog   title="提示" :visible.sync="deleteDialogVisible" width="30%">
                <span>确定删除？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="deleteRow()">确 定</el-button>
                    <el-button @click="deleteDialogVisible = false">取 消</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>

    import { api, dict, axiosHttp,util } from '@/libs'
    import Vue from 'vue'
    import { formatDate } from '../../../static/js/date.js'
    import {mapActions} from 'vuex'


    export default {
        // 变量初始化定义
        data:  function() {
            var checkphone = (rule, value, callback) => {
            	if(!value) {
            		return callback(new Error("手机号不能为空"));
            	} else {
            		const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
            		if(reg.test(value)) {
            			callback();
            		} else {
            			return callback(new Error("请输入正确手机号！"));
            		}
            	}
            };
            var checkNumber = (rule, value, callback) => {
            	if(!value) {
            		return callback(new Error("请输入实收金额"));
            	} else {
            		const reg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/
            		if(reg.test(value)) {
            			callback();
            		} else {
            			return callback(new Error("只能输入大于0的数,小数保留两位！"));
            		}
            	}
            };
            return {
                rowId: '',
                alarmId: '',
                workId: '',
                workPeople: '',
                workPeopleId: '',
                workPeopleAll: '',
                workPeopleIdAll: '',
                //所属企业集合
                companys:[],
                tableData: [],
                dealtableData:[],//处理记录
                pgtableData:[],//派工详情
                disposetableData:[],//工单详情--派工详情--服务工单
                submit_usId: [],
                ipt_assign: [],
                roleList: [],
                pageNum: 1,
                pageSize: 15,
                totolNum: 0,
                //刷新分页
                renovatePagination: true,
                searchForm: {},//搜索
                addEditDialogVisible:false,//新增 编辑
                deleteDialogVisible:false,//删除
                againaddEditDialogVisible:false,
                cancleDialogVisible:false,//取消服务
                chargeDialogVisible: false,//收费
                writeDialogVisible: false,//录入评价
                houseFunctionOption: [],
                //是否为详情，并设置是否disable
                isDetail: false,
                showHandleType:false,//指派人员
                serveDialogVisible: false,//服务单号详情
                serveVisible:false,// 服务工单详情
                serverAddDialogVisible:false,
                toAltotherDialogVisible:false,//派工页面
                editform: {},//工单详情 基本信息
                editform1:{},//派工表单
                editform2:{},//添加记录表单
                editformAppraise:{},//录入评价
                editformCharge:{},//收费
                fwgdeditform:{},//服务工单
                addRecordId: '',
                jobForeman:"",
                toserveform:"",
                //树的数据结构
                titles:['人员列表','已选人员'],
                dataList:[],
                value13: [],
                filterMethod(query, item) {
                	return item.pinyin.indexOf(query) > -1;
                },
                serveLevelList:[],
                serverTypeList:[],
                faultClassList: [],
                startDisposeIds: '',
                sysAlarmNos:'',
                isShowCharge:true,//收费信息
                noShowCharge:false,//暂无收费信息
                isShowCancleRn:true,//取消原因
                noShowAppraise:false,//暂无评价信息
                isShowAppraise:true,//评价信息
                isSuscess:false,//控制确定按钮不能重复点
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
                // 校验
                rules: {
                    // 服务类型
                    fuType: [{
                              required: true,
                              message: '请选择服务类型',
                              trigger: 'change'
                          }],
                    //联系人
                    linkman: [{
                              required: true,
                              message: '请输入联系人',
                              trigger: 'blur'
                          },
                            {
                                max: 10,
                                message: '姓名长度不能大于 10 个字符',
                                trigger: 'blur'
                            }],
                    //联系电话
                    linkmanNum: [{
                              required: true,
                              validator: checkphone,
                              trigger: 'blur'
                          },
                            {
                                max: 13,
                                message: '电话长度不能大于 13 个字符',
                                trigger: 'blur'
                            }],
                    //时间
                    tsTime: [{
                              required: true,
                              message: '请选择时间',
                              trigger: 'change'
                          }],
                    //公司名称
                    companyId:[{
                              required: true,
                              message: '请选择时间',
                              trigger: 'change'
                          }],
                    //问题描述
                    workWt:[{
                              required: true,
                              message: '请填写问题内容',
                              trigger: 'blur'
                         }],

                    //评价
                    appraise: [{
                                required: true,
                                message: '请选择评价',
                                trigger: 'change'
                             }],

                    //评价日期
                    appraiseTime:[{
                                required: true,
                                message: '请选择时间',
                                trigger: 'change'
                             }],
                    //评价人
                    appraiseName: [{
                                   required: true,
                                   message: '请输入评价人',
                                   trigger: 'blur'
                               },
                                {
                                    max: 10,
                                    message: '姓名长度不能大于 10 个字符',
                                    trigger: 'blur'
                                }],
                    //评价人电话
                    appraiseNum: [{
                                   required: true,
                                   validator: checkphone,
                                   trigger: 'blur'
                               },
                                {
                                    max: 13,
                                    message: '电话长度不能大于 13 个字符',
                                    trigger: 'blur'
                                }],
                    //收费信息
                        sjJe:   [{
                                   required: true,
                                   validator: checkNumber,
                                   trigger: 'blur'
                               },
                                {
                                    max: 10,
                                    message: '长度不能大于 10 个字符',
                                    trigger: 'blur'
                                }],
                        //收费日期
                        sfTime:  [{
                            required: true,
                            message: '请选择时间',
                            trigger: 'change'
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
               if(this.searchForm.serverTime != undefined) {
                   startTime = formatDate(this.searchForm.serverTime[0], "yyyy-MM-dd");
                   endTime = formatDate(this.searchForm.serverTime[1], "yyyy-MM-dd");
               }
               axiosHttp.post('message/bespeak/find', {
                   // 关键字
                   keyWord: this.searchForm.keyWord,
                   //服务类型
                   fuType: this.searchForm.fuType,
                   //服务状态
                   serverState: this.searchForm.serverState,
                   //数据类型
                   dataType:1,
                   //开始时间
                   startTime:startTime,
                   //结束时间
                   endTime:endTime,
                   page: this.pageNum,
                   size: this.pageSize

               }).then(res => {
                   this.tableData = res.content;
                   this.totolNum = Number(res.totalElements);
                   this.renovatePagination = true;
               })
            },
          //填报
          editServe(index,row){
              this.editform = {};
              this.getCompanys();
              this.houseFunctionOption=[];
              this.$forceUpdate();
              this.addEditDialogVisible = true;

          },
          //确认填报信息提示
          saveServe(){
              this.isSuscess = true;
              this.$refs.editform.validate((valid) => {
                  if(valid) {
                      let serveTime = "";
                      if(this.editform.tsTime != undefined) {
                          serveTime = formatDate(new Date(Number(this.editform.tsTime)), "yyyy-MM-dd hh:mm");
                      }
                      axiosHttp.post('/message/bespeak/save', {
                          // ID
                          id: this.editform.id,
                          // 服务类型
                          fuType: this.editform.fuType,
                          // 联系人 id
                          roleIds: this.editform.roleIds,
                          // 联系人
                          linkman:this.editform.linkman,
                          //联系电话
                          linkmanNum:this.editform.linkmanNum,
                          //紧急程度
                          workLevel:this.editform.workLevel,
                          //工单类型
                          workType:1,
                          // 时间
                          tsTime: serveTime,
                          //公司名称
                          companyName:this.editform.name,
                          //公司id
                          companyId:this.editform.companyId,
                         //服务区域
                          fuQy:this.editform.areaName,
                          //问题描述
                          workWt:this.editform.workWt,
                          //备注
                          remark:this.editform.remark


                      }).then(res => {
                          this.search();
                          this.addEditDialogVisible = false;
                          this.$refs.editform.resetFields();
                          this.getUnReadCount();
                          this.isSuscess = false;
                      })
                  } else {
                      return false;
              	}
              });
          },
            //派工
            toAssign(index, row){
                if (row) {
                    this.startDisposeIds = row.id;
                    this.toAltotherDialogVisible = true;
                } else {
                    if (this.$refs.table.store.states.selection.length > 0) {
                        let arr = this.$refs.table.store.states.selection;
                        console.log(arr);
                        for(var i = 0; i < arr.length; i++) {
                            if(arr[i].serverState != 1){
                                  this.$message.error('请您选择待派工的数据!');
                                  return;
                                }

                            }
                        this.editform1={};
                        let currentTime = new Date().getTime();
                        this.editform1.pgTime = currentTime
                        this.ipt_assign = []
                        this.toAltotherDialogVisible = true;
                    } else {
                        this.$message.error('请至少选择一条数据');
                    }
                }
            },
            //派工 确定
            altotherRow(){
                   this.$refs.editform1.validate((valid) => {
                       if(valid) {
                           if(this.ipt_assign[0].length != 0) {
                                this.$httpPost('/message/bespeak/updatePai', {
                                   // 指派人
                                   workPeople: this.workPeople,
                                   // 指派人id
                                   workPeopleId: this.workPeopleId,
                                   // 指派时间
                                   workTime: this.editform1.pgTime,
                                   // 派工说明
                                   workExplain: this.editform1.content,
                                   workId: this.workId,
                                   id:this.workId
                                }).then(res => {
                                       this.search();
                                       this.sysAlarmNos = "";
                                       this.toAltotherDialogVisible = false;
                                       this.$refs.editform1.resetFields();
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
            //取消服务
            toCancleServe(index,row){
                if (this.$refs.table.store.states.selection.length > 0) {
                    let arr = this.$refs.table.store.states.selection;
                    console.log(arr);
                    for(var i = 0; i < arr.length; i++) {
                        if(arr[i].serverState != 1){
                              this.$message.error('请您选择未分派的数据!');
                              return;
                            }

                        }

                   this.cancleDialogVisible = true;
                } else {
                    this.$message.error('请至少选择一条数据');
                }

            },
            //取消服务 确定
            cancleRow(){
                   this.$refs.editform1.validate((valid) => {
                       if(valid) {
                            this.$httpPost('/message/bespeak/QxManagement', {
                               id: this.startDisposeIds,
                               cancelRy:this.editform1.cancelRy,
                               serverState:4
                            }).then(res => {
                                   this.search();
                                   this.sysAlarmNos = "";
                                   this.cancleDialogVisible = false;
                            })

                       } else {
                           return false;
                       }
                   });
            },
            //收费
            toCharge(index,row){
                this.getCompanys();
                if (row) {
                        //  调用接口 获取详情
                        axiosHttp.post('/message/workManagement/get', {
                            id: row.id,
                            alarmId:row.alarmId,

                        }).then(res => {
                           this.editform=res.result;//基本信息
                           this.dealtableData = res.deList;//处理记录
                           this.addRecordId = res.result.id;
                           this.editform.workLevel = (res.result.workLevel == 1 ? '一般':(res.result.workLevel == 2?'紧急':'特急'));//紧急程度
                           if(this.editform.companyId){
                           	this.$httpGet('get', '/manage/houseProperty/findAreaNameByCompanyId', {
                           		companyId: this.editform.companyId
                           	}).then(res => {
                           		this.houseFunctionOption = res.data.body;
                           	});
                           }
                           this.$forceUpdate();
                        })
                        this.chargeDialogVisible = true;
                        this.editformCharge = {};

                 }
            },
            //收费  保存
            chargeSave(index,row){
               this.$refs.editformCharge.validate((valid) => {
                   if(valid) {
                       let serveTime = "";
                       if(this.editformCharge.sfTime != undefined) {
                           serveTime = formatDate(new Date(Number(this.editformCharge.sfTime)), "yyyy-MM-dd hh:mm:ss");
                       }
                       if(this.editformCharge.sjJe == 0) {
                           this.$message.error('输入金额不能为0,请您重新输入!');
                           return;
                       }
                       axiosHttp.post('/message/bespeak/updateManagement', {
                           // ID
                           id: this.editform.id,
                           //实收金额
                           sjJe: this.editformCharge.sjJe,
                           //收费日期
                           sfTime: serveTime,
                           //明细说明
                           Sf_Sm :this.editformCharge.Sf_Sm,
                           //工单类型
                           workType:1,
                           //收费
                           types:2

                       }).then(res => {
                           this.search();
                           this.chargeDialogVisible = false;
                           this.$refs.editformCharge.resetFields();
                       })
                   } else {
                       return false;
               	}
              });

            },
            //录入评价
            toWriteJudge(index,row){
                this.getCompanys();
                if (row) {
                    console.log(row.id);
                        //  调用接口 获取详情
                        axiosHttp.post('/message/workManagement/get', {
                            id: row.id,
                            alarmId:row.alarmId,

                        }).then(res => {
                           this.editform=res.result;//基本信息
                           this.dealtableData = res.deList;//处理记录
                           this.addRecordId = res.result.id;
                           this.editform.workLevel = (res.result.workLevel == 1 ? '一般':(res.result.workLevel == 2?'紧急':'特级'));//紧急程度
                           if(this.editform.companyId){
                           	this.$httpGet('get', '/manage/houseProperty/findAreaNameByCompanyId', {
                           		companyId: this.editform.companyId
                           	}).then(res => {
                           		this.houseFunctionOption = res.data.body;
                           	});
                           }
                           this.$forceUpdate();
                        })
                        this.writeDialogVisible = true;
                        this.editformAppraise = {};

                 }

            },
            //录入评价 确定
            writeSave(index,row){
                this.$refs.editformAppraise.validate((valid) => {
                    if(valid) {
                        let serveTime = "";
                        if(this.editformAppraise.appraiseTime != undefined) {
                            serveTime = formatDate(new Date(Number(this.editformAppraise.appraiseTime)), "yyyy-MM-dd hh:mm:ss");
                        }
                        axiosHttp.post('/message/bespeak/updateManagement', {
                            // ID
                            id: this.editform.id,
                            //评价
                            appraise: this.editformAppraise.appraise,
                            //评价日期
                            appraiseTime: serveTime,
                            // 评价人 id
                            appraiseId : this.editformAppraise.appraiseId,
                            // 评价人
                            appraiseName: this.editformAppraise.appraiseName,
                            //评价人电话
                            appraiseNum :this.editformAppraise.appraiseNum,
                            //工单类型
                            workType:1,
                            //评价
                            types:1,
                            //评价状态
                            serverState:5,
                            //评价内容
                            appraiseCont:this.editformAppraise.appraiseCont


                        }).then(res => {
                            this.search();
                            this.writeDialogVisible = false;
                            this.$refs.editformAppraise.resetFields();
                        })
                    } else {
                        return false;
                	}
                });
            },
            //服务编号详情
            toserveDetails(index, row) {
                this.getCompanys();
               if (row) {
                       //  调用接口 获取详情
                       axiosHttp.post('/message/workManagement/get', {
                           id: row.id,
                           alarmId:row.alarmId,
                       }).then(res => {
                          this.editform=res.result;//基本信息
                          this.dealtableData = res.deList;//处理记录
                          this.pgtableData = res.PGList; //派工详情
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



                }


            },
            //派工详情---点击工单编号 弹出查看详情弹出框
            toWorkDetails(index, row) {
               this.rowId =  row.id
               this.alarmId = row.alarmId
               if (row) {
                        //  调用接口 获取详情
                        axiosHttp.post('/message/workManagement/get', {
                            id: row.id,
                            alarmId:row.alarmId
                        }).then(res => {
                            this.editform=res.result;//基本信息
                            this.editform.workNum = res.result.workNum;//服务单号
                            this.editform.workType = (res.result.workType == 0 ? '报警信息':'客服中心');//服务类型
                            this.editform.workLevel = (res.result.workLevel == 1 ? '一般':(res.result.workLevel == 2?'紧急':'特急'));//紧急程度
                            this.pgtableData = res.PGList;//派工记录
                            this.disposetableData = res.AddList;//维修记录
                            this.addDataList = res.AddList;;
                            this.addRecordId = res.result.id;
                        })

                       this.serveVisible = true;

                }


            },
            //服务---- 新增  添加记录
            ServerSave() {
                this.$refs.editform3.validate((valid) => {
                    if(valid) {
                        if(this.editform2.wxStaTime <= this.editform2.wxEndTime) {
                            this.$httpPost('/message/workList/save', {
                                // 完成日期
                                wxStaTime: this.editform2.wxStaTime,
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
                        }else {
                            this.$message.warning('结束日期不能早于开始日期')
                        }
                    } else {
                        return false;
                    }
                });
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
            // 关闭弹出框
            close() {
                this.toAltotherDialogVisible = false;//派工
                this.addEditDialogVisible = false;//创建服务
                this.cancleDialogVisible = false;//取消服务
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
                    return Vue.filter('dateFormat')(row.tsTime, 'yyyy-MM-dd hh:mm')
                }
            },
            // 穿梭框更改时出发的事件
            handleChange(value, direction, movedKeys){
                // console.log(value, direction, movedKeys)
                let arrInput = []
                arrInput.push(value.map(e => this.dataList.find(i => i.key === e).label))
                this.ipt_assign = arrInput
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
            // 表格选择改变事件
            onSelect(val) {
                    this.workId = val[0].id
                    this.checkedArr = val;
                    let idsArr = [];
                    let sysAlarmNoArr = [];
                    for (var i = 0; i < val.length; i++) {
                        idsArr.push(val[i].id);
                        sysAlarmNoArr.push(val[i].sysAlarmNo);
                    }
                    this.startDisposeIds = idsArr.join(',');
                    this.sysAlarmNos = sysAlarmNoArr.join(',');



            },
            //服务类型
            serverType: function (row, column, cellValue) {
                if (this.serverTypeList.find(item => item.value === row.fuType)) return this.serverTypeList.find(item => item.value === row.fuType).label
            },
            //服务状态
            workState: function (row, column, cellValue) {
                switch (row.serverState){
                    case 1:
                        return "待派工";
                        break;
                    case 2:
                        return "已派工";
                        break;
                    case 3:
                        return "已处理";
                         break;
                    case 4:
                        return "已取消";
                         break;
                    case 5:
                        return "已评价";
                         break;
                    case 6:
                        return "处理中";
                         break;
                    default:
                         return "";
                         break;
                }
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
<style  lang="less">
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
    .el-dialog__headerbtn .el-dialog__close {
        color: #fff !important;
    }
</style>
