
<template>
  <div class="wrap">
    <div class="subContent">
      <div class="tableWrap">
        <!--搜索功能-->
        <el-form :inline="true" :model="searchForm" class="demo-form-inline zr-row-scatter">
          <div class="zr-row">
            <!--<el-button type="primary" @click="toEdit()">新增保养</el-button>
            <el-button type="primary" @click="toDelete()">删除</el-button>-->
            <el-button type="primary" @click="exportExcel()">导出</el-button>
            <el-button type="primary" @click="toUpkeep()">批量保养</el-button>
          </div>
          <div class="zr-row">
            <!--<el-form-item label="">
                    		<el-date-picker v-model="searchForm.alarmTime" type="datetimerange" range-separator="至" start-placeholder="保养开始日期" end-placeholder="保养结束日期" format="yyyy-MM-dd HH:mm" align="right">
                            </el-date-picker>
            </el-form-item>-->
            <el-form-item label>
              <!-- 保养类型 1周期保养 2动态运行保养 -->
              <el-select v-model="searchForm.maintainType" placeholder="保养类型" clearable>
                <el-option label="静态保养" value="1"></el-option>
                <el-option label="动态保养" value="2"></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label>

              <el-select v-model="searchForm.maintainType" placeholder="设备分类" clearable>
                <el-option label="静态保养" value="1"></el-option>
                <el-option label="动态保养" value="2"></el-option>
              </el-select>
            </el-form-item> -->
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
          <el-table-column :show-overflow-tooltip="true" prop="deviceName" label="保养设备" align="center"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="deviceId" label="设备编号" align="center"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="deviceClassName" label="设备类别" align="center"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="deviceSubsystemName" label="设备子系统" width="100" align="center"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="deviceSystemName" label="设备专业" align="center"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="maintainType" :formatter="getMaintainType" label="保养类型" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.isRuntime==1">静态保养</span>
              <span v-if="scope.row.isSwitch==1">动态保养</span>
            </template>
          </el-table-column>
          <!--<el-table-column :show-overflow-tooltip="true" prop="deviceSystemName" label="提醒内容"></el-table-column>-->
          <el-table-column :show-overflow-tooltip="true" prop="description" label="保养描述" align="center"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="nowTime" :formatter="nowTime" label="保养提醒时间" align="center">
          </el-table-column>
          <!--<el-table-column :show-overflow-tooltip="true" prop="isRemind" :formatter="getIsRemind" label="是否已提醒" width="100"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="reminderPeriod" :formatter="getReminderPeriod" label="日常保养周期" width="120"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="nowTime" :formatter="getNowTime" label="本次保养时间" width="120"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="switchNum" :formatter="getSwitchNum" label="动态保养"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="runtime" label="开关运行次数" width="120"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="maintainType" :formatter="getMaintainType" label="保养类型"></el-table-column>-->
          <el-table-column :show-overflow-tooltip="true" label="保养登记" width="180" align="center">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="toEdit(scope.$index, scope.row)"
                type="text"
                size="mini"
                v-if="scope.row.isRemind == 1"
              >保养登记</el-button>
              <el-button disabled type="text" size="mini" v-else>保养登记</el-button>
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

      <!--编辑弹出窗 保养登记-->
      <el-dialog title="保养登记" :visible.sync="formDialogVisible" :before-close="close" width="950px">
        <el-form :model="editform" :rules="rules" ref="editform" label-width="120px">
          <el-row class="m-t-10">
            设备信息
            <div class="b-0 p-20">
              <el-col :span="8">
                <el-form-item label="设备编号" prop="deviceId">
                  <!-- 设备编号 -->
                  <el-input
                    v-model="editform.deviceId"
                    disabled
                    @blur.prevent="queryByDeviceCode()"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="设备专业" prop="deviceSystemName">
                  <el-input v-model="editform.deviceSystemName" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="设备子系统" prop="deviceSubSysName">
                  <el-input v-model="editform.deviceSubSysName" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="设备类别" prop="deviceTypeName">
                  <el-input v-model="editform.deviceClassName" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="保养设备" prop="deviceName">
                  <el-input v-model="editform.deviceName" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="设备位置" prop="postion">
                  <el-input v-model="editform.postion" disabled></el-input>
                </el-form-item>
              </el-col>
            </div>
          </el-row>
          <el-row class="m-t-10">
            保养配置
            <div class="b-0 p-20">
              <el-col :span="12">
                <el-form-item label="保养类型" prop="maintainType">
                  <!-- 保养类型 1周期保养 2动态运行保养 -->
                  <el-select v-model="editform.maintainType" placeholder="保养类型" disabled>
                    <el-option label="静态保养" value="1"></el-option>
                    <el-option label="动态保养" value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="保养负责人" prop="createUserId">
                  <!-- 保养负责人 -->
                  <el-input v-model="editform.responsiblePerson" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="配置内容" prop="createUserId">
                  <!-- 保养负责人 -->
                  <el-input v-model="editform.description" disabled></el-input>
                </el-form-item>
              </el-col>
            </div>
          </el-row>
          <el-row class="m-t-10">
            保养信息
            <div class="b-0 p-20">
              <el-col :span="12">
                <!-- 保养开始日期 -->
                <el-form-item label="保养开始日期" prop="startTime">
                  <el-date-picker
                    v-model="editform.startTime"
                    type="date"
                    value-format="timestamp"
                    format="yyyy-MM-dd"
                    placeholder="保养开始日期"
                    :disabled="isDetail"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <!-- 保养结束日期 -->
                <el-form-item label="保养结束日期" prop="endTime">
                  <el-date-picker
                    v-model="editform.endTime"
                    type="date"
                    value-format="timestamp"
                    format="yyyy-MM-dd"
                    placeholder="保养结束日期"
                    :disabled="isDetail"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="保养人" prop="createUserId">
                  <!-- 保养负责人 -->
                  <el-input v-model="editform.maintainPerson"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="保养内容" prop="content">
                  <!-- 保养内容 -->
                  <el-input
                    type="textarea"
                    :rows="2"
                    v-model="editform.content"
                    :disabled="isDetail"
                    maxlength="100"
                  ></el-input>
                </el-form-item>
              </el-col>
            </div>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="save()">确 定</el-button>
          <el-button @click="close()">取 消</el-button>
        </span>
      </el-dialog>

      <!--批量保养弹出窗-->
      <el-dialog title="批量保养" :visible.sync="upkeep" :before-close="close2" width="900px">
        <el-form :model="editform" :rules="rules" ref="editform" label-width="120px">
          <el-row class="m-t-10">
            设备信息
            <div class="b-0 p-20">
              <el-col :span="8">
                <el-form-item label="设备类别" prop="deviceTypeName">
                  <el-input v-model="editform.deviceTypeName" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="设备专业" prop="deviceSystemName">
                  <el-input v-model="editform.deviceSystemName" disabled></el-input>
                </el-form-item>
              </el-col>
              <!--<el-col :span="8">
		                            <el-form-item label="设备专业" prop="deviceSystemName">
		                                <el-input v-model="editform.deviceSystemName" disabled></el-input>
		                            </el-form-item>
              </el-col>-->
              <el-col :span="8">
                <el-form-item label="设备子系统" prop="deviceSubSysName">
                  <el-input v-model="editform.deviceSubSysName" disabled></el-input>
                </el-form-item>
              </el-col>

              <!-- <el-col :span="8">
		                            <el-form-item label="保养设备" prop="deviceName">
		                                <el-input v-model="editform.deviceName" disabled></el-input>
		                            </el-form-item>
              </el-col>-->
            </div>
          </el-row>
          <el-row class="m-t-10">
            保养信息
            <div class="b-0 p-20">
              <el-col :span="8">
                <el-form-item label="保养人" prop="maintainPerson">
                  <!-- 保养负责人 -->
                  <el-input v-model="editform.maintainPerson"></el-input>
                </el-form-item>
              </el-col>
              <!--<el-col :span="8">
		                            <el-form-item label="保养类型" prop="maintainType">
		                            		     保养类型 1周期保养 2动态运行保养
		                                <el-select v-model="editform.maintainType" placeholder="保养类型" disabled>
					                        <el-option label="日常周期保养" value="1"></el-option>
					                        <el-option label="动态运行保养" value="2"></el-option>
					                    </el-select>
		                            </el-form-item>
              </el-col>-->

              <el-col :span="8">
                <!-- 保养开始日期 -->
                <el-form-item label="保养开始日期" prop="startTime">
                  <el-date-picker
                    v-model="editform.startTime"
                    type="date"
                    value-format="timestamp"
                    format="yyyy-MM-dd"
                    placeholder="保养开始日期"
                    :disabled="isDetail"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <!-- 保养结束日期 -->
                <el-form-item label="保养结束日期" prop="endTime">
                  <el-date-picker
                    v-model="editform.endTime"
                    type="date"
                    value-format="timestamp"
                    format="yyyy-MM-dd"
                    placeholder="保养结束日期"
                    :disabled="isDetail"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </div>
          </el-row>
          <el-row></el-row>

          <el-col :span="24" class="p-l-20 p-r-20">
            <el-form-item label="保养内容" prop="content">
              <!-- 保养内容 -->
              <el-input
                type="textarea"
                :rows="2"
                v-model="editform.content"
                :disabled="isDetail"
                maxlength="100"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="save2()">确 定</el-button>
          <el-button @click="close2()">取 消</el-button>
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
  // 变量初始化定义
  data() {
    var checkStartTime = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请选择保养开始日期"));
      } else {
        callback();
      }
    };
    var checkEndTime = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请选择保养结束日期"));
      } else {
        let startTime = this.editform.startTime;
        if (startTime <= value) {
          callback();
        } else {
          callback();
        }
      }
    };
    return {
      indexNumber: 1,
      tableData: [],
      data0: [],
      pageNum: 1,
      pageSize: 15,
      totolNum: 0,
      //刷新分页
      renovatePagination: true,
      searchForm: {},
      deleteVisible: false,
      //是否为详情，并设置是否disable
      isDetail: false,
      formDialogVisible: false,
      upkeep: false,
      editform: {},
      deleteIds: "",
      //选择的设备类型
      typeIds: "",
      deviceIds: "",
      checkedArr: [],
      //批量任务
      isupkeep: true,
      // 校验
      rules: {
        // 设备编号
        deviceId: [
          {
            required: true,
            message: "请输入设备编号",
            trigger: "blur"
          }
        ],
        // 保养类型 1周期保养 2动态运行保养
        maintainType: [
          {
            required: true,
            message: "请选择保养类型",
            trigger: "blur"
          }
        ],
        // 保养开始日期
        startTime: [
          {
            required: true,
            validator: checkStartTime,
            trigger: "blur"
          }
        ],
        // 保养结束日期
        endTime: [
          {
            required: true,
            validator: checkEndTime,
            trigger: "blur"
          }
        ],
        // 保养内容
        content: [
          {
            required: true,
            message: "请输入保养内容",
            trigger: "blur"
          }
        ]
      }
    };
  },
  // 页面加载时执行
  created: function() {
    this.search();
  },
  // 自定义方法
  methods: {
    // 导出
    handleDataManage(arr) {
      this.indexNumber = 1
      let transArray = []
      arr.forEach(element => {
          let transObj = {
              index: 0,
              deviceName: '',
              deviceId: '',
              deviceClassName: '',
              deviceSubsystemName: '',
              deviceSystemName: '',
              maintainType: '',
              description: '',
              nowTime: '',
          }
          transObj.index = this.indexNumber++
          transObj.deviceName = element.deviceName
          transObj.deviceId = element.deviceId
          transObj.deviceClassName = element.deviceClassName
          transObj.deviceSubsystemName = element.deviceSubsystemName
          transObj.deviceSystemName = element.deviceSystemName
          transObj.maintainType = (element.maintainType === '1' ? '静态保养' : '动态保养')
          transObj.description = element.description
          transObj.nowTime = Vue.filter('dateFormat')(element.nowTime,'yyyy-MM-dd hh:mm:ss')
          transArray.push(transObj)
      });
      //列标题，逗号隔开，每一个逗号就是隔开一个单元格
      let str = `序号,保养设备,设备编号,设备类别,设备子系统,设备专业,保养类型,保养描述,保养提醒时间\n`;
      //增加\t为了不让表格显示科学计数法或者其他格式
      for(let i = 0 ; i < transArray.length ; i++ ){
          for(let item in transArray[i]){
              str+=`${transArray[i][item] + '\t'},`;
          }
          str+='\n';
      }
      //encodeURIComponent解决中文乱码
      let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
      //通过创建a标签实现
      let link = document.createElement("a");
      link.href = uri;
      //对下载的文件命名
      link.download =  "保养任务数据表.xls";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    exportExcel() {
      /*if(this.deleteIds==""){
					this.$message.error('请选择导出项！');
				}*/
      // location.href =
      //   api.baseUrl +
      //   "/manage/device/exportExcel" +
      //   "?ids=" +
      //   this.deleteIds +
      //   "&token=" +
      //   window.localStorage.csmpToken;
        if (this.checkedArr.length === 0) {
          this.$confirm('确认要导出所有数据吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            axiosHttp.post('/manage/maintainTask/find',{
              page: '',
              size: ''
            }).then(res => {
              this.handleDataManage(res.content)
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            })
          })

        } else {
          this.handleDataManage(this.checkedArr)
        }
      },
      //时间转换
      nowTime(row, column, cellValue) {
                if(row.nowTime!=null){
                    return Vue.filter('dateFormat')(row.nowTime,'yyyy-MM-dd hh:mm:ss')
                }
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
      let startTime = "";
      let endTime = "";
      if (this.searchForm.alarmTime != undefined) {
        startTime = formatDate(
          this.searchForm.alarmTime[0],
          "yyyy-MM-dd hh:mm"
        );
        endTime = formatDate(this.searchForm.alarmTime[1], "yyyy-MM-dd hh:mm");
      }
      this.$httpPost("/manage/maintainTask/find", {
        keyword: this.searchForm.keyword,
        startTime: startTime, // 保养开始日期
        endTime: endTime, // 保养结束日期
        maintainType: this.searchForm.maintainType, // 保养类型 1周期保养 2动态运行保养
        page: this.pageNum,
        size: this.pageSize
      }).then(res => {
        this.tableData = res.data.body.content;
        this.totolNum = Number(res.data.body.totalElements);
        this.renovatePagination = true;
      });
    },
    // 弹出修改弹出框
    toEdit(index, row) {
      this.editform = {};
      this.data0 = [];
      if (row) {
        this.editform = Object.assign({}, row);
        this.$httpGet("get", "/manage/device/queryByDeviceCode", {
          deviceCode: row.deviceId
        }).then(res => {
          if (res.data.code == 0) {
            let device = res.data.body;
            if (device) {
              console.log(11)
              console.log(device)
              this.editform.deviceSystemName = device.deviceSystemName;
              this.editform.deviceSubSysName = device.deviceSubSysName;
              this.editform.deviceTypeName = device.deviceTypeName;
              this.editform.deviceName = device.deviceName;
              this.editform.postion = device.postion;
              this.editform.createUserId = device.createUserId;
              this.$forceUpdate()
            } else {
              this.$message.error("设备编号不存在");
              return;
            }
            this.$httpPost(
              "/manage/maintainPoints/queryAllByMaintainConfigId",
              {
                maintainConfigId: this.editform.maintainConfigId,
                id: this.editform.id
              }
            ).then(res => {
              this.data0 = res.data.body.data0;
            });
          } else {
            this.$message.error(res.data.msg);
          }
        });
      }
      this.formDialogVisible = true;
      this.isDetail = false;
    },
    // 修改 新增 保存
    save() {
      this.$refs.editform.validate(valid => {
        if (valid) {
          if (this.editform.startTime <= this.editform.endTime) {
            let isSuccess = true;
            this.data0.forEach(item => {
              if (item.IS_WHETHER === 1) {
                if (item.IS_CHECK === null) {
                  this.$message.error("必检项必须选择！");
                  isSuccess = false;
                  return;
                }
              }
            });
            if (!isSuccess) return false;
            this.$httpPost("/manage/maintainTask/save", {
              id: this.editform.id, // 序号
              deviceId: this.editform.deviceId, // 设备编号
              deviceClassName: this.editform.deviceClassName, // 设备分类名称
              maintainType: this.editform.maintainType, // 保养类型 1周期保养 2动态运行保养
              maintainUserId: this.editform.responsiblePerson, // 保养负责人
              startTime: this.editform.startTime, // 保养开始日期
              endTime: this.editform.endTime, // 保养结束日期
              maintainPerson:this.editform.maintainPerson,//保养人
              content: this.editform.content, // 保养内容
              data0: this.data0
              //source: '2',数据来源 1自动生成 2手动添加
            }).then(res => {
              this.formDialogVisible = false;
              this.search();
            });
          } else {
            this.$message.warning("结束日期不能早于开始日期");
          }
        } else {
          return false;
        }
      });
    },
    // 批量提交
    save2() {
      this.$refs.editform.validate(valid => {
        if (valid) {
          this.$httpPost("/manage/maintainTask/updateByParam", {
            ids: this.deleteIds, //
            deviceIds: this.deviceIds, // 设备编号
            deviceName: this.editform.deviceName, // 设备名称
            maintainType: this.editform.maintainType, // 保养类型 1静态保养 2动态保养
            maintainUserId: this.editform.createUserId, // 保养负责人
            startTime: this.editform.startTime, // 保养开始日期
            endTime: this.editform.endTime, // 保养结束日期
            content: this.editform.content, // 保养内容
            deviceClassName: this.editform.deviceTypeName, //设备分类名称
            deviceClassId: this.editform.deviceTypeId, //设备分类ID
            maintainPerson: this.editform.maintainPerson
          }).then(res => {
            this.upkeep = false;
            this.search();
          });
        } else {
          return false;
        }
      });
    },
    // 关闭弹出框
    close() {
      this.formDialogVisible = false;
      this.$refs.editform.resetFields();
    },
    // 关闭弹出框
    close2() {
      this.upkeep = false;
      this.$refs.editform.resetFields();
    },
    // 删除操作赋值删除项  并弹窗
    toDelete(index, row) {
      if (index == undefined) {
        //					没勾选
        if (this.deleteIds == "") {
          this.$message.error("请至少选择一条数据！");
          return;
        }
      }
      if (row) {
        this.deleteIds = row.id;
      }
      this.deleteVisible = true;
    },
    // 批量操作
    toUpkeep(index, row) {
      if (!this.isupkeep) {
        this.$message.error("请选择相同类型！");
        return;
      }
      if (index == undefined) {
        //没勾选
        if (this.deleteIds == "") {
          this.$message.error("请至少选择一条数据！");
          return;
        }
      }
      let deviceArr2 = [];
      deviceArr2 = this.deviceIds.split(",");
      if (this.deleteIds) {
        this.editform = Object.assign({}, row);
        this.$httpGet("get", "/manage/device/queryByDeviceCode", {
          deviceCode: deviceArr2[0]
        }).then(res => {
          if (res.data.code == 0) {
            let device = res.data.body;
            console.log(device);
            if (device) {
              this.editform.deviceSystemName = device.deviceSystemName;
              this.editform.deviceSubSysName = device.deviceSubSysName;
              this.editform.deviceTypeName = device.deviceTypeName;
              this.editform.deviceName = device.deviceName;
              this.editform.postion = device.postion;
              this.editform.createUserId = device.createUserId;
              this.editform.maintainType = "1";
            } else {
              this.$message.error("设备编号不存在");
              return;
            }
          } else {
            this.$message.error(res.data.msg);
          }
          this.$forceUpdate();
        });
      }
      this.upkeep = true;
    },
    // 删除 行  包括单选和多选
    deleteRow() {
      this.$httpPost("/manage/maintainTask/delete", {
        id: this.deleteIds
      }).then(res => {
        this.deleteVisible = false;
        this.deleteIds = "";
        this.search();
      });
    },
    // 表格选择改变事件
    onSelect(val) {
      this.checkedArr = val;
      let idsArr = [];
      let typesArr = [];
      let deviceArr = [];
      for (var i = 0; i < val.length; i++) {
        idsArr.push(val[i].id);
        typesArr.push(val[i].deviceClassId);
        deviceArr.push(val[i].deviceId);
      }
      this.deleteIds = idsArr.join(",");
      this.typeIds = typesArr.join(",");
      this.deviceIds = deviceArr.join(",");
      if (typesArr.length > 1) {
        var type = typesArr[0];
        for (var i = 0; i < typesArr.length; i++) {
          if (type != typesArr[i]) {
            // this.$message.error('请选择相同类型！');
            this.isupkeep = false;
            return;
            //console.log("请选择相同类型")
          } else {
            this.isupkeep = true;
          }
        }
      } else {
        this.isupkeep = true;
      }
    },
    // 弹出查看详情弹出框
    toDetails(index, row) {
      const _this = this;
      this.editform = {};
      if (row) {
        this.editform = Object.assign({}, row);
      }
      this.formDialogVisible = true;
      this.isDetail = true;
    },
    // 弹出查看详情弹出框
    queryByDeviceCode() {
      this.$httpGet("get", "/manage/device/queryByDeviceCode", {
        deviceCode: this.editform.deviceId
      }).then(res => {
        if (res.data.code == 0) {
          let device = res.data.body;
          if (device) {
            this.editform.deviceSystemName = device.deviceSystemName;
            this.editform.deviceSubSysName = device.deviceSubSysName;
            this.editform.deviceTypeName = device.deviceTypeName;
            this.editform.deviceName = device.deviceName;
            this.editform.postion = device.postion;
            this.editform.maintainUserId = device.createUserId;
          } else {
            this.$message.error("设备编号不存在");
            return;
          }
          this.$forceUpdate();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 获取房间状态
    getMaintainType(row, column, cellValue) {
      var result = "";
      if (cellValue == "1") {
        result = "静态保养";
      } else if (cellValue == "2") {
        result = "动态保养";
      }
      return result;
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
          value += "运行时长达到" + row.runtimes + "小时以上";
        } else {
          value += ";且运行时长达到" + row.runtimes + "小时以上";
        }
      }
      if (value == "") {
        value = "无";
      }
      return value;
    },
    getIsRemind(row, column, cellValue) {
      if (cellValue == "1") {
        return "是";
      } else {
        return "否";
      }
    },
    // 时间格式化
    dateFormat(row, column, cellValue) {
      if (cellValue == null || cellValue == "") {
        return "";
      }
      let date = new Date(parseInt(cellValue));
      if (date == undefined) {
        return "";
      }
      return formatDate(date, "yyyy-MM-dd hh:mm");
    },
    // 时间格式化
    getNowTime(row, column, cellValue) {
      if (cellValue == null || cellValue == "") {
        return "";
      }
      let date = new Date(parseInt(cellValue));
      if (date == undefined) {
        return "";
      }
      return formatDate(date, "yyyy年MM月dd号  hh:mm");
    }
  }
};
</script>
<style lang="less">
.wrap{
  .el-dialog__headerbtn .el-dialog__close {
      color: #fff !important;
  }
}
</style>
