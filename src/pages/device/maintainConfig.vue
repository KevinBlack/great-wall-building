
<template>
  <div class="wrap">
    <div class="subContent">
      <div class="tableWrap">
        <!--搜索功能-->
        <el-form :inline="true" :model="searchForm" class="zr-row-scatter">
          <div>
            <el-button type="primary" @click="addMaintainConfig">新增</el-button>
          </div>
          <div>
            <el-form-item label>
              <!-- 保养类型 1周期保养 2动态运行保养 -->
              <el-select v-model="searchForm.maintainType" placeholder="保养类型" clearable>
                <el-option label="静态保养" value="1"></el-option>
                <el-option label="动态保养" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label>
              <el-input placeholder="设备负责人" v-model="searchForm.responsiblePerson" clearable></el-input>
            </el-form-item>
            <el-form-item label>
              <el-input placeholder="关键字" v-model="searchForm.keyword" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search('param')">搜索</el-button>
            </el-form-item>
          </div>
        </el-form>
        <!--数据表格渲染-->
        <el-table
          ref="table"
          stripe
          :data="tableData"
          style="width: 100%"
          @selection-change="onSelect"
        >
          <el-table-column type="selection" width="60" align="center"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" type="index" label="序号" width="50" align="center"></el-table-column>
          <!-- <el-table-column :show-overflow-tooltip="true" prop="deviceClassName" label="设备分类"></el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="deviceSubsystemName"
            label="设备子系统"
            width="100"
          ></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="deviceSystemName" label="设备专业"></el-table-column> -->
          <el-table-column :show-overflow-tooltip="true" prop="deviceSystemName" label="保养设备" align="center"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="type" label="保养类型" align="center">
            <template slot-scope="scope">
                <!-- {{scope.row}} -->
                <span v-if="scope.row.isRuntime==1">静态保养</span>
                <span v-if="scope.row.isSwitch==1">动态保养</span>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="提醒内容" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.isRuntime==1">{{scope.row.runtimeContent}}</span>
                <span v-if="scope.row.isSwitch==1">{{scope.row.switchContent}}</span>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="responsiblePerson" label="设备负责人" align="center"></el-table-column>
          <!--<el-table-column :show-overflow-tooltip="true" prop="reminderPeriod" :formatter="getReminderPeriod" label="日常保养周期" width="120"></el-table-column>-->
          <!--<el-table-column :show-overflow-tooltip="true" prop="reminderName" label="保养时间" width="150"></el-table-column>-->
          <!--<el-table-column :show-overflow-tooltip="true" prop="switchNum" :formatter="getSwitchNum" label="动态保养"></el-table-column>-->
          <el-table-column :show-overflow-tooltip="true" label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              <!-- <el-button type="text" size="mini" @click="toEdit(scope.$index, scope.row)">配置</el-button> -->
              <!-- <el-button
                @click.native.prevent="handleEditActive(scope.$index, scope.row)"
                type="text"
                size="mini"
                v-if="scope.row.active == 1"
              >禁用</el-button>
              <el-button
                @click.native.prevent="handleEditActive(scope.$index, scope.row)"
                type="text"
                size="mini"
                v-else
              >启用</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <!--分页-->
        <el-pagination
          v-if="renovatePagination"
          @size-change="onSizeChange"
          @current-change="onCurrentChange"
          :current-page="pageNum"
          :page-sizes="[10, 15, 20, 25]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totolNum"
        ></el-pagination>
      </div>

      <!--编辑弹出窗-->
      <el-dialog
        :title="isDetail?'查看详情':(editform.id?'保养配置':'新增')"
        :visible.sync="formDialogVisible"
        :before-close="close"
        width="900px"
      >
        <el-form :model="editform" :rules="rules" ref="editform" label-width="100px">
          <el-row class="m-t-10">
            <span style="font-weight: 600;">设备信息</span>
            <!-- <div class="b-0 p-20"> -->
            <!-- <el-col :span="8">
            <el-form-item label="设备专业" prop="deviceSystemId">-->
            <!-- 设备专业代码 -->
            <!-- <el-select v-model="editform.deviceSystemId"  @change="deviceSystemCodeChange" style="width: 100%;" :disabled="isEdit">
	                                    <el-option v-for="item in deviceTree" :label="item.label" :key="item.value" :value="item.value">
	                                    </el-option>
	                                </el-select>
	                            </el-form-item>
            </el-col>-->

            <!-- <el-col :span="8">
            <el-form-item label="设备子系统" prop="deviceSubsystemId">-->
            <!-- 设备子系统代码 -->
            <!-- <el-select v-model="editform.deviceSubsystemId" @change="deviceSubSysCodeChange" style="width: 100%;" :disabled="isEdit">
	                                    <el-option v-for="item in deviceSubSysCodeList" :label="item.label" :key="item.value" :value="item.value">
	                                    </el-option>
	                                </el-select>
	                            </el-form-item>

            </el-col>-->

            <!-- <el-col :span="8">
            <el-form-item label="设备类别" prop="deviceClassId">-->
            <!-- 设备类别代码 -->
            <!-- <el-select v-model="editform.deviceClassId"  @change="deviceTypeCodeChange" style="width: 100%;" :disabled="isEdit">
	                                    <el-option v-for="item in deviceTypeCodeList" :label="item.label" :key="item.value" :value="item.value">
	                                    </el-option>
	                                </el-select>
	                            </el-form-item>
            </el-col>-->
            <!-- </div> -->
            <el-col :span="24" class="p-l-20 p-r-20">
              <el-form-item>
                <span slot="label"><b style="color: red;margin-right: 3px;">*</b>设备</span>
                <!-- 负责人群ID -->
                <!--<el-input v-model="editform.responsiblePersonId"></el-input>-->
                <!-- <el-input v-model="editform.device"></el-input> -->
                <input v-if="editform.id" v-model="editform.deviceSystemName" class="my_input" disabled />
                <div v-else>
                  <!-- <el-input v-model="editform.device" readonly autosize> -->
                    <div  class="input_device">
                    <span style="width:32px;display:inline-block;"></span>
                    <div slot="prefix" class="tag" v-for="item in selected" :key="item.id" >
                      {{item.deviceName}}
                      <i
                        class="el-tag__close el-icon-close btn-delete"
                        @click="deleteDevice(item.id)"
                      />
                    </div>
                    </div>
                    <el-button
                      slot="append"
                      :icon="btnIcon"
                      @click="isShowTable"
                      style="float:right;"
                    ></el-button>
                  <!-- </el-input> -->
                  <div style="width: 594px;float:left;">
                  <el-card class="box-card" v-show="isShow">
                    <el-row :gutter="20">
                      <el-col :span="10">
                        <el-input placeholder="关键字" v-model="deviceKey" class="input-with-select">
                          <el-button slot="append" icon="el-icon-search" @click="searchDevice"></el-button>
                        </el-input>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="32">
                    <el-table
                      ref="multipleTable"
                      :row-key="getRowKey"
                      :data="deviceList"
                      tooltip-effect="dark"
                      style="width: 100%"
                      @selection-change="handleSelectionChange"
                    >
                      <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
                      <el-table-column label="设备名称">
                        <template slot-scope="scope">{{ scope.row.deviceName }}</template>
                      </el-table-column>
                      <el-table-column prop="deviceCode" label="设备编号"></el-table-column>
                    </el-table>
                    <el-pagination
                      v-if="pageShow"
                      small
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :current-page="pageNumDevice"
                      :page-sizes="[5, 10, 15, 20]"
                      :page-size="pageSizeDevice"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="totolNumDevice"
                    ></el-pagination>
                    </el-col>
                    </el-row>
                  </el-card>
                  </div>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="24" class="p-l-20 p-r-20">
              <el-form-item label="负责人群" prop="responsiblePersonId">
                <!-- 负责人群ID -->
                <!--<el-input v-model="editform.responsiblePersonId"></el-input>-->
                <el-select
                  v-model="editform.responsiblePersonId"
                  multiple
                  @change="responsiblePersonChange"
                  style="width: 100%;"
                  :disabled="isDetail"
                >
                  <el-option
                    v-for="item in roleList"
                    :label="item.label"
                    :key="item.value"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-tabs type="border-card" v-model="maintainTypeTab">
            <el-tab-pane label="静态保养" name="tab1">
              <div class="zr-row zr_align-center">
                <el-checkbox v-model="isRuntime" class="m-r-5"></el-checkbox>当运行时长达到
                <!-- 开关次数上限 -->
                <el-input
                  type="number"
                  v-model="editform.runtime"
                  :disabled="isDetail"
                  class="w-25 m-r-5 m-l-5"
                ></el-input>小时以上进行保养
              </div>
              <!--<div class="zr-row">
                                <div>提醒时间</div>
                                <el-select v-model="editform.reminderPeriod" placeholder="请选择" class="w-100-px m-l-20 m-r-20" :disabled="isDetail" @visible-change="setReminderModal" @change="reminderPeriodChange">
                                    <el-option label="请选择" value=""></el-option>
                                    <el-option label="年" value="1"></el-option>
                                    <el-option label="月" value="2"></el-option>
                                    <el-option label="日" value="3"></el-option>
                                </el-select>
                                <div class="m-r-20">
                                    <el-input v-model="showReminderModal.reminderName" disabled style="width:426px"></el-input>
                                    <el-popover v-model="showReminderModal.show" placement="bottom" width="400">
                                        <div v-if="editform.reminderPeriod === '1'">
                                            <div class="zr-row-wrap">
                                                <div v-for="(item, index) in monthList" :key="index" class="b-1 w-96-px h-32-px zr-column-center" :class="item.show?'bg-blue':'bg-white'" @click="item.show = !item.show">
                                                    {{item.value}}月
                                                </div>
                                            </div>
                                            <el-row class="m-t-20" :gutter="20">
                                                <el-col :span="8">
                                                    <el-select v-model="showReminderModal.selectDay" @change="changeDay">
                                                        <el-option v-for="i in 28" :key="i" :label="i + '日'" :value="i">
                                                        </el-option>
                                                    </el-select>
                                                </el-col>
                                                <el-col :span="16">
                                                    <el-time-picker v-model="showReminderModal.selectTime" value-format="HH:mm" format="HH:mm" placeholder="请选择时间" @change="changeTime">
                                                    </el-time-picker>
                                                </el-col>
                                            </el-row>
                                        </div>

                                        <div v-if="editform.reminderPeriod === '2'">
                                            <div class="zr-row-wrap">
                                                <div v-for="(item, index) in dayList" :key="index" class="b-1 w-54-px h-32-px zr-column-center" :class="item.show?'bg-blue':'bg-white'" @click="item.show = !item.show">
                                                    {{item.value}}
                                                </div>
                                            </div>
                                            <el-row>
                                                <el-col :span="16" class="m-t-20">
                                                    <el-time-picker v-model="showReminderModal.selectTime" value-format="HH:mm" format="HH:mm" placeholder="请选择时间" @blur="changeTime">
                                                    </el-time-picker>
                                                </el-col>
                                            </el-row>
                                        </div>

                                        <div v-if="editform.reminderPeriod === '3'">
                                            <div class="zr-row zr_align-center">
                                                每
                                                <el-input v-model="showReminderModal.selectDateRange" class="w-100-px m-l-5 m-r-5" type="number" min="0"></el-input>
                                                天
                                            </div>
                                            <el-row>
                                                <el-col :span="16" class="m-t-20">
                                                    <el-time-picker v-model="showReminderModal.selectTime" value-format="HH:mm" format="HH:mm" placeholder="请选择时间" @blur="changeTime">
                                                    </el-time-picker>
                                                </el-col>
                                            </el-row>
                                        </div>

                                        <el-row class="m-t-20">
                                            <el-col :span="12" class="zr-column-center"><el-button type="primary" @click="saveReminder">保 存</el-button></el-col>
                                            <el-col :span="12" class="zr-column-center"><el-button @click="showReminderModal.show = false">取 消</el-button></el-col>
                                        </el-row>
                                    </el-popover>
                                </div>
                                <div>进行保养</div>
              </div>-->
              <!--<el-col :span="24">
                                保养维护要点配置
              </el-col>-->
              <!--数据表格渲染-->
              <!-- <el-col :span="24" class="zr-column">
                                <div class="zr-row h-48-px f-w-700 c-gray-dark" style="background: #f2f2f2;">
                                    <div class="zi-g-1 zr-column-center">编号</div>
                                    <div class="zi-g-4 zr-column-center">检查项目</div>
                                    <div class="zi-g-4 zr-column-center">必检项</div>
                                    <div class="zi-g-2 zr-column-center">操作</div>
                                </div>
                                <div v-for="(item, index) in data0" :key="index" class="zr-row p-10">
                                    <div class="zi-g-1 zr-column-center">{{index + 1}}</div>
                                    <div class="zi-g-4 zr-column-center">
                                        <el-input v-model="item.content" class="w-100"></el-input>
                                    </div>
                                    <div class="zi-g-4 zr-column-center">
                                        <el-radio-group v-model="item.isWhether">
                                            <el-radio :label="1">是</el-radio>
                                            <el-radio :label="0">否</el-radio>
                                        </el-radio-group>
                                    </div>
                                    <div class="zi-g-2 zr-column-center">
                                        <div class="zr-row">
                                            <i class="iconfont icon-ic_join_dialing_norm" v-if="index === 0" @click="addData0()"></i>
                                            <i class="iconfont icon-chuyidong" v-if="index > 0"  @click="deleteData0(index)"></i>
                                        </div>
                                    </div>
                                </div>
              </el-col>-->

              <!--  <el-col :span="24">
                                质量标准
              </el-col>-->
              <!--数据表格渲染-->
              <!-- <el-col :span="24">
                                <div class="zr-row h-48-px f-w-700 c-gray-dark" style="background: #f2f2f2;">
                                    <div class="zi-g-1 zr-column-center">编号</div>
                                    <div class="zi-g-4 zr-column-center">质量标准</div>
                                    <div class="zi-g-4 zr-column-center">必检项</div>
                                    <div class="zi-g-2 zr-column-center">操作</div>
                                </div>
                                <div v-for="(item, index) in data1" :key="index" class="zr-row p-10">
                                    <div class="zi-g-1 zr-column-center">{{index + 1}}</div>
                                    <div class="zi-g-4 zr-column-center">
                                        <el-input v-model="item.content" class="w-100"></el-input>
                                    </div>
                                    <div class="zi-g-4 zr-column-center">
                                        <el-radio-group v-model="item.isWhether">
                                            <el-radio :label="1">是</el-radio>
                                            <el-radio :label="0">否</el-radio>
                                        </el-radio-group>
                                    </div>
                                    <div class="zi-g-2 zr-column-center">
                                        <div class="zr-row">
                                            <i class="iconfont icon-ic_join_dialing_norm" v-if="index === 0" @click="addData1()"></i>
                                            <i class="iconfont icon-chuyidong" v-if="index > 0"  @click="deleteData1(index)"></i>
                                        </div>
                                    </div>
                                </div>
              </el-col>-->
            </el-tab-pane>
            <el-tab-pane label="动态保养" name="tab2">
              <div class="zr-row zr_align-center">
                <el-checkbox v-model="isSwitch" class="m-r-5"></el-checkbox>当开关次数达到
                <!-- 开关次数上限 -->
                <el-input
                  type="number"
                  v-model="editform.switchNum"
                  :disabled="isDetail"
                  class="w-25 m-r-5 m-l-5"
                ></el-input>次以上进行保养
              </div>
              <!-- <div class="zr-row zr_align-center m-t-20 m-b-20">
                                <el-checkbox v-model="isRuntime" class="m-r-5"></el-checkbox>
              当运行时长达到-->
              <!-- 开关次数上限 -->
              <!--<el-input type="number" v-model="editform.runtime" :disabled="isDetail" class="w-25 m-r-5 m-l-5"></el-input>
                                小时以上进行保养
              </div>-->
              <!-- <el-col :span="24">
                                    保养维护要点配置
              </el-col>-->
              <!--数据表格渲染-->
              <!--<el-col :span="24">
                                    <div class="zr-row h-48-px f-w-700 c-gray-dark" style="background: #f2f2f2;">
                                        <div class="zi-g-1 zr-column-center">编号</div>
                                        <div class="zi-g-4 zr-column-center">检查项目</div>
                                        <div class="zi-g-4 zr-column-center">必检项</div>
                                        <div class="zi-g-2 zr-column-center">操作</div>
                                    </div>
                                    <div v-for="(item, index) in data2" :key="index" class="zr-row p-10">
                                        <div class="zi-g-1 zr-column-center">{{index + 1}}</div>
                                        <div class="zi-g-4 zr-column-center">
                                            <el-input v-model="item.content" class="w-100"></el-input>
                                        </div>
                                        <div class="zi-g-4 zr-column-center">
                                            <el-radio-group v-model="item.isWhether">
                                                <el-radio :label="1">是</el-radio>
                                                <el-radio :label="0">否</el-radio>
                                            </el-radio-group>
                                        </div>
                                        <div class="zi-g-2 zr-column-center">
                                            <div class="zr-row">
                                                <i class="iconfont icon-ic_join_dialing_norm" v-if="index === 0" @click="addData2()"></i>
                                                <i class="iconfont icon-chuyidong" v-if="index > 0"  @click="deleteData2(index)"></i>
                                            </div>
                                        </div>
                                    </div>
              </el-col>-->

              <!--<el-col :span="24">
                                    质量标准
              </el-col>-->
              <!--数据表格渲染-->
              <!--<el-col :span="24">
                                    <div class="zr-row h-48-px f-w-700 c-gray-dark" style="background: #f2f2f2;">
                                        <div class="zi-g-1 zr-column-center">编号</div>
                                        <div class="zi-g-4 zr-column-center">质量标准</div>
                                        <div class="zi-g-4 zr-column-center">必检项</div>
                                        <div class="zi-g-2 zr-column-center">操作</div>
                                    </div>
                                    <div v-for="(item, index) in data3" :key="index" class="zr-row p-10">
                                        <div class="zi-g-1 zr-column-center">{{index + 1}}</div>
                                        <div class="zi-g-4 zr-column-center">
                                            <el-input v-model="item.content" class="w-100"></el-input>
                                        </div>
                                        <div class="zi-g-4 zr-column-center">
                                            <el-radio-group v-model="item.isWhether">
                                                <el-radio :label="1">是</el-radio>
                                                <el-radio :label="0">否</el-radio>
                                            </el-radio-group>
                                        </div>
                                        <div class="zi-g-2 zr-column-center">
                                            <div class="zr-row">
                                                <i class="iconfont icon-ic_join_dialing_norm" v-if="index === 0" @click="addData3()"></i>
                                                <i class="iconfont icon-chuyidong" v-if="index > 0"  @click="deleteData3(index)"></i>
                                            </div>
                                        </div>
                                    </div>
              </el-col>-->
            </el-tab-pane>
          </el-tabs>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="save()">确 定</el-button>
          <el-button @click="close()">取 消</el-button>
        </span>
      </el-dialog>

      <!--删除提示框-->
      <el-dialog title="提示" :visible.sync="deleteVisible" width="30%">
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
import { formatDate } from "../../../static/js/date.js";
import { api, dict, axiosHttp } from "@/libs";
import store from "@/store/index";
import { mapState } from "vuex";
import Vue from "vue";
export default {
  inject:['reloadView'],
  // 变量初始化定义
  data() {
    return {
      multipSelectionAll: [],
      deviceKey:'',
      btnIcon:'el-icon-arrow-down',
      pageShow: true,
      selected: [],
      isShow: false,
      deviceList: [],
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      totolNum: 0,
      pageNumDevice: 1,
      pageSizeDevice: 5,
      totolNumDevice: 0,
      data0: [
        {
          content: "检查设施编号是否明确、整洁，指示灯是否完好。",
          isWhether: 1
        }
      ],
      data1: [{ content: "房内清洁、干燥，温、湿度适中。", isWhether: 1 }],
      data2: [
        {
          content: "检查设施编号是否明确、整洁，指示灯是否完好。",
          isWhether: 1
        }
      ],
      data3: [{ content: "房内清洁、干燥，温、湿度适中。", isWhether: 1 }],
       isSwitch: false,
       isRuntime: false,
      maintainTypeTab: "tab1",
      //刷新分页
      renovatePagination: true,
      searchForm: {},
      deleteVisible: false,
      //保养时间的弹框
      // showReminderModal: {
      //   show: false
      // },
      //monthList: [],
      //dayList: [],
      monthSelectedList: [],
      daySelectedList: [],
      // 角色列表
      roleList: [],
      // ids
      responsiblePersonVal: "",
      // names
      responsiblePersons: "",
      //是否为详情，并设置是否disable
      isDetail: false,
      isEdit: false,
      formDialogVisible: false,
      editform: {},
      deleteIds: "",
      checkedArr: [],
      deviceSystemCodeList: [],
      deviceSubSysCodeList: [],
      deviceTypeCodeList: [],
      // 校验
      rules: {
        // 设备专业id
        // deviceSystemId: [
        //   {
        //     required: true,
        //     message: "请选择设备专业",
        //     trigger: "change"
        //   }
        // ],
        // // 设备子系统id
        // deviceSubsystemId: [
        //   {
        //     required: true,
        //     message: "请选择设备子系统",
        //     trigger: "change"
        //   }
        // ],
        // // 设备类别id
        // deviceClassId: [
        //   {
        //     required: true,
        //     message: "请选择设备类别",
        //     trigger: "change"
        //   }
        // ],
        // 负责人群ID
        responsiblePersonId: [
          {
            required: true,
            message: "请选择负责人群",
            trigger: "change"
          }
        ],
        // 提醒时间周期 1年 2月 3日
        // reminderPeriod: [
        //   {
        //     message: "请选择保养类型",
        //     trigger: "change"
        //   }
        // ],
        // 提醒时间
        reminderTime: [
          {
            required: true,
            message: "请选择提醒时间",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    ...mapState({
      deviceTree: state => state.deviceTree
    })
  },
  // 自定义方法
  methods: {
    getRowKey(row){
      return row.id
    },
    searchDevice(){
       this.$httpGet("get", "/manage/device/findByPage", {
        keyWord: this.deviceKey,
        page: this.pageNum,
        size: this.pageSize
      }).then(res => {
        this.deviceList = res.data.body.content;
        // let transArr = res.data.body.content;
        this.deviceList.forEach((item,i)=>{
          this.multipSelectionAll.forEach((multItem,j)=>{
            if (this.deviceList[i].id == this.multipSelectionAll[j].id) {
              this.$refs.multipleTable.toggleRowSelection(this.deviceList[i],true)
            } else {
              this.$refs.multipleTable.clearSelection();
            }
          })
        })
        this.totolNumDevice = Number(res.data.body.totalElements);
      });
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    isShowTable() {
      this.isShow = !this.isShow;
      if(this.isShow){
          this.btnIcon='el-icon-arrow-up';
      }else{
        this.btnIcon='el-icon-arrow-down';
      }
    },
    //设备页码数改变
    handleSizeChange(val) {
      this.pageSize = val;
      let n = this.totolNumDevice / val;
      n = Math.ceil(n);
      if (n < this.pageNumDevice) {
        this.pageNumDevice = 1;
      }
      this.getDeviceList();
    },
    //设备页码改变
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getDeviceList();
    },
    // 删除操作赋值删除项  并弹窗
    handleDelete(index, row) {
      if (row) {
        this.deleteIds = row.id;
        this.deleteVisible = true;
      } else {
        if (this.$refs.table.store.states.selection.length > 0) {
          this.deleteVisible = true;
        } else {
          this.$message.error("请至少选择一条数据");
        }
      }
    },
    // 删除 行  包括单选和多选
    deleteRow() {
     axiosHttp.post("/manage/maintainConfig/delete", {
        id: this.deleteIds
      }).then(res => {
        this.deleteVisible = false;
        this.deleteIds = "";
        this.search();
      });
    },
    //删除选择的设备
    deleteDevice(val) {
      const getIndex = (arr, item) => {
        for (var i in arr) {
          if (arr[i].id == item) {
            return i;
          }
        }
      };
      let index = getIndex(this.selected, val);
      this.$refs.multipleTable.toggleRowSelection(this.selected[index]);
      //this.selected.splice(1,1);
      // console.log(this.selected)
    },
    //设备选择值
    handleSelectionChange(val) {
        this.multipSelectionAll = val;
        // this.selected = Array.from(new Set(this.selected.concat(val)));
        this.selected = val
    },
    //获取设备列表
    getDeviceList() {
      this.$httpGet("get", "/manage/device/findByPage", {
        page: this.pageNum,
        size: this.pageSize
      }).then(res => {
        this.deviceList = res.data.body.content;
        this.totolNumDevice = Number(res.data.body.totalElements);
      });
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
    // 初始化表格 搜索功能
    search(type) {
      if (type == "param") {
        this.pageNum = 1;
        this.renovatePagination = false;
      }
      this.$httpPost("/manage/maintainConfig/find", {
        // 备注
        maintainType: this.searchForm.maintainType,
        responsiblePerson: this.searchForm.responsiblePerson,
        keyword: this.searchForm.keyword,
        page: this.pageNum,
        size: this.pageSize
      }).then(res => {
        this.tableData = res.data.body.content;
        this.totolNum = Number(res.data.body.totalElements);
        this.renovatePagination = true;
      });
    },
    //设置提醒时间弹框的显示隐藏
    // setReminderModal(type) {
    //   if (this.editform.reminderPeriod === "")
    //     this.showReminderModal.show = false;
    //   else {
    //     if (!type && this.editform.reminderPeriod != undefined)
    //       this.showReminderModal.show = true;
    //   }
    // },
    //提醒时间的类型变化
    // reminderPeriodChange(type) {
    //   this.showReminderModal.reminderName = "";
    //   this.editform.reminderTime = "";
    // },
    //修改提醒时间弹框的日期
    // changeDay() {
    //   this.$forceUpdate();
    // },
    // changeTime() {
    //   this.$forceUpdate();
    // },
    // saveReminder() {
    //   this.monthSelectedList = this.monthList.filter(item => item.show);
    //   this.daySelectedList = this.dayList.filter(item => item.show);
    //   if (this.editform.reminderPeriod === "1") {
    //     if (this.monthSelectedList.length === 0) {
    //       this.$message.error("请至少选择一个月份");
    //       return;
    //     }
    //     if (!this.showReminderModal.selectDay) {
    //       this.$message.error("请选择日");
    //       return;
    //     }
    //   } else if (this.editform.reminderPeriod === "2") {
    //     if (this.daySelectedList.length === 0) {
    //       this.$message.error("请至少选择一个日");
    //       return;
    //     }
    //   } else if (this.editform.reminderPeriod === "3") {
    //     if (!this.showReminderModal.selectDateRange) {
    //       this.$message.error("请输入天数");
    //       return;
    //     }
    //   }
    //   if (!this.showReminderModal.selectTime) {
    //     this.$message.error("请选择时间");
    //     return;
    //   }
    //   const reg = /^[0-9]*[1-9][0-9]*$/;
    //   if (
    //     this.editform.reminderPeriod === "3" &&
    //     (Number(this.showReminderModal.selectDateRange) === 0 ||
    //       !reg.test(this.showReminderModal.selectDateRange))
    //   ) {
    //     this.$message.error("时间间隔必须为正整数");
    //     return;
    //   }
    //   this.showReminderModal.show = false;
    //   if (this.editform.reminderPeriod === "1") {
    //     if (this.monthSelectedList)
    //       this.monthSelectedList = this.monthSelectedList.map((item, index) => {
    //         if (index === this.monthSelectedList.length - 1)
    //           return item.value + "";
    //         else return item.value + "、";
    //       });
    //     this.editform.reminderName =
    //       "每年" +
    //       this.monthSelectedList.join("") +
    //       "月" +
    //       (this.showReminderModal.selectDay
    //         ? "的" + this.showReminderModal.selectDay + "号"
    //         : "") +
    //       (this.showReminderModal.selectTime
    //         ? "的" + this.showReminderModal.selectTime
    //         : "");

    //     this.monthSelectedListTemp = this.monthSelectedList.map(
    //       item => (item = item.replace("、", ";"))
    //     );
    //     this.editform.reminderTime =
    //       this.monthSelectedListTemp.join("") +
    //       (this.showReminderModal.selectDay
    //         ? "," + this.showReminderModal.selectDay
    //         : "") +
    //       (this.showReminderModal.selectTime
    //         ? "," + this.showReminderModal.selectTime
    //         : "");
    //   } else if (this.editform.reminderPeriod === "2") {
    //     if (this.daySelectedList)
    //       this.daySelectedList = this.daySelectedList.map((item, index) => {
    //         if (index === this.daySelectedList.length - 1)
    //           return item.value + "";
    //         else return item.value + "、";
    //       });
    //     this.editform.reminderName =
    //       "每月" +
    //       this.daySelectedList.join("") +
    //       "号" +
    //       (this.showReminderModal.selectTime
    //         ? "的" + this.showReminderModal.selectTime
    //         : "");

    //     this.daySelectedListTemp = this.daySelectedList.map(
    //       item => (item = item.replace("、", ";"))
    //     );
    //     this.editform.reminderTime =
    //       this.daySelectedListTemp.join("") +
    //       (this.showReminderModal.selectTime
    //         ? "," + this.showReminderModal.selectTime
    //         : "");
    //   } else if (this.editform.reminderPeriod === "3") {
    //     this.editform.reminderName =
    //       "每" +
    //       this.showReminderModal.selectDateRange +
    //       "天" +
    //       (this.showReminderModal.selectTime
    //         ? "的" + this.showReminderModal.selectTime
    //         : "");
    //     this.editform.reminderTime =
    //       this.showReminderModal.selectDateRange +
    //       (this.showReminderModal.selectTime
    //         ? "," + this.showReminderModal.selectTime
    //         : "");
    //   }
    //   console.log(
    //     this.editform.reminderTime,
    //     "7777777",
    //     this.editform.reminderName
    //   );
    //   this.showReminderModal.reminderName =
    //     "将于" + this.editform.reminderName + "提醒";
    // },
    // addData0() {
    //   this.data0.push({ isWhether: 1 });
    // },
    // deleteData0(index) {
    //   this.data0.splice(index, 1);
    // },
    // addData1() {
    //   this.data1.push({ isWhether: 1 });
    // },
    // deleteData1(index) {
    //   this.data1.splice(index, 1);
    // },
    // addData2() {
    //   this.data2.push({ isWhether: 1 });
    // },
    // deleteData2(index) {
    //   this.data2.splice(index, 1);
    // },
    // addData3() {
    //   this.data3.push({ isWhether: 1 });
    // },
    // deleteData3(index) {
    //   this.data3.splice(index, 1);
    // },
    //新增保养配置
    addMaintainConfig() {
       this.isSwitch = 0;
       this.isRuntime = 0;
      this.maintainTypeTab = "tab1";
      this.deviceSubSysCodeList = [];
      this.deviceTypeCodeList = [];
      // 初始化提醒时间框开始
      // this.monthList.map(item => (item = Object.assign(item, { show: false })));
      // this.dayList.map(item => (item = Object.assign(item, { show: false })));
      // this.showReminderModal = { show: false };
      // 初始化提醒时间框结束
      // this.editform = {
      //   responsiblePersonId: []
      // };
      // this.data0 = [
      //   {
      //     content: "检查设施编号是否明确、整洁，指示灯是否完好。",
      //     isWhether: 1
      //   }
      // ];
      // this.data1 = [
      //   { content: "房内清洁、干燥，温、湿度适中。", isWhether: 1 }
      // ];
      // this.data2 = [
      //   {
      //     content: "检查设施编号是否明确、整洁，指示灯是否完好。",
      //     isWhether: 1
      //   }
      // ];
      // this.data3 = [
      //   { content: "房内清洁、干燥，温、湿度适中。", isWhether: 1 }
      // ];
      // this.editform.reminderTime = "";
      this.editform.switchNum = "";
      this.editform.runtime = "";
      this.formDialogVisible = true;
      this.isDetail = false;
      this.isEdit = false;
      this.$forceUpdate();
    },
    // 弹出修改弹出框
    toEdit(index, row) {
      this.maintainTypeTab = "tab1";
      // 初始化提醒时间框开始
      // this.monthList.map(item => (item = Object.assign(item, { show: false })));
      // this.dayList.map(item => (item = Object.assign(item, { show: false })));
      // this.showReminderModal = { show: false };
      // 初始化提醒时间框结束
      //this.showReminderModal.reminderName = row.reminderName;
      // this.deviceSystemCodeChange(row.deviceSystemId);
      // this.deviceSubSysCodeChange(row.deviceSubsystemId);
      this.editform = Object.assign({ responsiblePersonId: [] }, row);
      this.isSwitch = !!this.editform.isSwitch;
      this.isRuntime = !!this.editform.isRuntime;
      // const arr = row.reminderTime.split(",");
      if (this.editform.reminderPeriod === "") {
        this.monthList.map(
          item => (item = Object.assign(item, { show: false }))
        );
        this.dayList.map(item => (item = Object.assign(item, { show: false })));
        this.showReminderModal = { show: false };
      } else if (this.editform.reminderPeriod === "1") {
        const monthSelectedList = arr[0].split(";");
        this.monthList.map(
          item =>
            (item = monthSelectedList.contains(item.value)
              ? Object.assign(item, { show: true })
              : Object.assign(item, { show: false }))
        );
        this.showReminderModal.selectDay = arr[1];
        this.showReminderModal.selectTime = arr[2];
      } else if (this.editform.reminderPeriod === "2") {
        // const daySelectedList = arr[0].split(";");
        // this.dayList.map(
        //   item =>
        //     (item = daySelectedList.contains(item.value)
        //       ? Object.assign(item, { show: true })
        //       : Object.assign(item, { show: false }))
        // );
        // this.showReminderModal.selectTime = arr[1];
      } else if (this.editform.reminderPeriod === "3") {
        // this.showReminderModal.selectDateRange = arr[0];
        // this.showReminderModal.selectTime = arr[1];
      }
      if (this.editform.responsiblePersonId) {
        axiosHttp
          .post("/message/msgInform/selectActiveRole", {
            ids: row.responsiblePersonId
          })
          .then(res => {
            this.editform.responsiblePersonId = res.split(",");
            this.responsiblePersonVal = this.editform.responsiblePersonId.join(
              ","
            );
          });
      } else {
        this.editform.responsiblePersonId = [];
      }
      this.$httpPost("/manage/maintainPoints/findAllByEntity", {
        maintainConfigId: this.editform.id
      }).then(res => {
        this.data0 = res.data.body.data0;
        this.data1 = res.data.body.data1;
        this.data2 = res.data.body.data2;
        this.data3 = res.data.body.data3;
      });
      this.formDialogVisible = true;
      row.deviceClassName = this.editform.deviceSystemName
      row.deviceName = this.editform.deviceSystemName
      this.selected = []
      this.selected.push(row)
      this.isDetail = false;
      this.isEdit = true;
      this.$forceUpdate();
    },
    //负责人群更改
    responsiblePersonChange(selVal) {
      let arr = [];
      selVal.forEach(item =>
        arr.push(this.roleList.find(roleItem => roleItem.value === item).label)
      );
      this.responsiblePersons = arr.join(",");
      this.responsiblePersonVal = selVal.join(",");
    },
    //  获取角色列表
    selectRole() {
      this.$httpPost("/system/user/role/getRoleName").then(
        res => {
          if (res.data.msg === "success") {
            var dataArr = res.data.body;
            if (dataArr.length != 0) {
              for (var i = 0; i < dataArr.length; i++) {
                if (dataArr[i].active === 1) {
                  var newObj = new Object();
                  newObj.label = dataArr[i].name;
                  newObj.value = dataArr[i].id;
                  this.roleList.push(newObj);
                }
              }
            } else {
              this.roleList = [];
            }
          } else {
            Toast("加载服务类型失败");
          }
        },
        function(response) {}
      );
    },
    // 修改 新增 保存
    save() {
      const responsiblePersonId = this.editform.responsiblePersonId;
      var devicesIds=[];
      var devicesNames=[];
      if(this.selected.length <1){
        this.$message.error('请选择设备')
        return
      }
      if(this.selected){
          for(var i in this.selected){
             devicesIds.push(this.selected[i].id);
             devicesNames.push(this.selected[i].deviceName);
          }
      }
      // this.data0.map(item => (item = Object.assign(item, { flag: 0 })));
      // this.data1.map(item => (item = Object.assign(item, { flag: 1 })));
      // this.data2.map(item => (item = Object.assign(item, { flag: 2 })));
      // this.data3.map(item => (item = Object.assign(item, { flag: 3 })));
      if (!this.editform.id) this.editform.active = 1;
        // if (
        //   this.data0.find(item => !item.content) ||
        //   this.data1.find(item => !item.content) ||
        //   this.data2.find(item => !item.content) ||
        //   this.data3.find(item => !item.content)
        // ) {
        //   this.$message.error("请输入项目内容！");
        // } else {
          this.$refs.editform.validate(valid => {
            if (valid) {
              axiosHttp
                .post("/manage/maintainConfig/saveMaintainConfig", {
                  // 序号
                  id: this.editform.id,
                 // devices:this.selected,
                 deviceSystemId: devicesIds.join(','),
                 deviceSystemName: devicesNames.join(','),
                  // 设备专业id
                 // deviceSystemId: this.editform.deviceSystemId,
                  // 设备子系统id
                  //deviceSubsystemId: this.editform.deviceSubsystemId,
                  // 设备类别id
                 // deviceClassId: this.editform.deviceClassId,
                  // 设备专业名称
                  // deviceSystemName: this.editform.deviceSystemName,
                  // 设备子系统名称
                  // deviceSubsystemName: this.editform.deviceSubsystemName,
                  // 设备类别名称
                  deviceClassName: this.editform.deviceSystemName,
                  // 提醒时间周期 1年 2月 3日
                 // reminderPeriod: this.editform.reminderPeriod,
                  // 提醒时间
                  //reminderTime: this.editform.reminderTime,
                  // 提醒时间
                  //reminderName: this.showReminderModal.reminderName,
                  // 开关次数上限
                  switchNum: this.editform.switchNum,
                  // 1，启用，0，停用
                  isSwitch: this.isSwitch?1:0,
                  // 运行时长上限
                  runtime: this.editform.runtime,
                  // 1，启用，0，停用
                  isRuntime: this.isRuntime?1:0,
                  // 1，启用，0，停用
                  active: this.editform.active,
                  // data0: this.data0,
                  // data1: this.data1,
                  // data2: this.data2,
                  // data3: this.data3,
                  responsiblePersonId: this.responsiblePersonVal===''?this.editform.responsiblePersonVal:this.responsiblePersonVal,
                  responsiblePerson: this.responsiblePersons===''?this.editform.responsiblePersons:this.responsiblePersons
                })
                .then(
                  res => {
                    console.log(this.editform)
                    this.formDialogVisible = false;
                    this.search();
                  },
                  error => {}
                );
            } else {
              return false;
            }
          });
        // }

    },
    // 关闭弹出框
    close() {
      this.formDialogVisible = false;
      this.$refs.editform.resetFields();
      this.reloadView()
    },
    // 表格选择改变事件
    onSelect(val) {
      this.checkedArr = val;
      let idsArr = [];
      for (var i = 0; i < val.length; i++) {
        idsArr.push(val[i].id);
      }
      this.deleteIds = idsArr.join(",");
    },
    // 弹出查看详情弹出框
    toDetails(index, row) {
      const _this = this;
      this.editform = {
        responsiblePersonId: []
      };
      if (row) {
       // this.deviceSystemCodeChange(row.deviceSystemCode);
        //this.deviceSubSysCodeChange(row.deviceSubSysCode);
        this.editform = Object.assign({}, row);
        if (this.editform.responsiblePersonId) {
          this.editform.responsiblePersonId = row.responsiblePersonId.split(
            ","
          );
          this.responsiblePersonVal = this.editform.responsiblePersonId.join(
            ","
          );
        } else {
          this.editform.responsiblePersonId = [];
        }
      }
      this.$httpPost("/manage/maintainPoints/findAllByEntity", {
        maintainConfigId: this.editform.id
      }).then(res => {
        this.data0 = res.data.body.data0;
        this.data1 = res.data.body.data1;
        this.data2 = res.data.body.data2;
        this.data3 = res.data.body.data3;
      });
      this.formDialogVisible = true;
      this.isDetail = true;
      this.isEdit = true;
    },
    // deviceSystemCodeChange(realId) {
    //  // this.editform.deviceSubsystemId = "";
    //   this.editform.deviceClassId = "";
    //   if (this.deviceTree.find(item => item.value === realId))
    //     this.deviceSubSysCodeList = this.deviceTree.find(
    //       item => item.value === realId
    //     ).children;
    //   if (this.deviceTree.find(item => item.value === realId))
    //     this.editform.deviceSystemName = this.deviceTree.find(
    //       item => item.value === realId
    //     ).label;
    // },
    // deviceSubSysCodeChange(realId) {
    //   this.editform.deviceClassId = "";
    //   this.deviceTree.forEach(item => {
    //     const obj = item.children.find(subItem => subItem.value === realId);
    //     if (obj) {
    //       this.deviceTypeCodeList = obj.children;
    //       this.editform.deviceSubsystemName = obj.label;
    //     }
    //   });
    // },
    deviceTypeCodeChange(realId) {
      const obj = this.deviceTypeCodeList.find(item => item.value === realId);
      this.$forceUpdate();
      this.editform.deviceClassName = obj.label;
    },
    getReminderPeriod(row, column, cellValue) {
      if (cellValue == "1") {
        return "年";
      } else if (cellValue == "2") {
        return "月";
      } else if (cellValue == "3") {
        return "日";
      } else {
        return "无";
      }
    },
    getSwitchNum(row, column, cellValue) {
      let value = "";
      if (row.isSwitch == "1") {
        value += "开关次数达到" + row.switchNum + "次以上";
      }
      if (row.isRuntime == "1") {
        if (value == "") {
          value += "运行时长达到" + row.runtime + "小时以上";
        } else {
          value += ";且运行时长达到" + row.runtime + "小时以上";
        }
      }
      if (value == "") {
        value = "无";
      }
      return value;
    },
    handleEditActive(index, row) {
      let activetmp = "";
      if (row.active == "0") {
        activetmp = "1";
      } else {
        activetmp = "0";
      }
      this.$http("post", "/manage/maintainConfig/editActive", {
        id: row.id,
        active: activetmp
      }).then(res => {
        if (res.data.code == 0) {
          this.search();
        } else {
        }
      });
    }
  },
  // 页面加载时执行
  created() {
    this.getDeviceList();
    /*this.$http('post','/system/user/testMaintainConfigJob',{
                }).then(res => {
                    if (res.data.code == 0) {
                    } else {
                    }
                });*/
    store
      .dispatch("getRoleList")
      .then(
        res =>
          (this.roleList = res
            .filter(resItem => resItem.active === 1)
            .map(item => (item = { label: item.name, value: item.id })))
      );
    // store.dispatch("getDeviceTree");
    this.search();
    // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].forEach(item => {
    //   this.monthList.push({ value: item + "", show: false });
    // });
    // for (let i = 1; i < 29; i++) {
    //   this.dayList.push({ value: i + "", show: false });
    // }
  }
};
</script>
<style scoped lang="less">
.my_input {
  width: 99%;
  height: 30px;
  border: 1px solid #DCDFE6;
  border-radius: 3px;
  padding-left: 5px;
  background-color: #F0F2F5;
}
.input_device {
  border: 1px solid #e9e9eb;
  width: 594px;
  // height: 32px;
  display:inline-block;
  // line-height: 32pxt;
}
.tag {
  margin: 4px 3px;
  height: 24px;
  padding: 0 8px;
  line-height: 24px;
  background-color: #f4f4f5;
  border-color: #e9e9eb;
  color: #909399;
  box-sizing: border-box;
  display: inline-block;
  font-size: 12px;
  border: 1px solid #d9ecff;
  white-space: nowrap;
  border-radius: 4px;
   float:left;
   overflow: hidden;
}
.btn-delete {
  margin-left: 5px;
  height: 13px;
  width: 13px;
  // display: inline-block;
  background-color: #c0c4cc;
  border-radius: 50%;
  display: inline-block;
  transform: translateY(0.5px);
}
.el-icon-close:hover {
  color: #fff;
}
</style>
