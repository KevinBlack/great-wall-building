<template>
  <div class="wrap">
    <div class="subContent zr-row" style="background: #f2f2f2;">
      <div class="tree_content">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label style="margin: 5%;width: 90%;">
            <el-input v-model="treeKey" @clear="handleClear" clearable placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-form>
        <ul id="resTree" class="ztree"></ul>
      </div>
      <div class="main_content">
        <div class="tableWrap">
          <el-form :inline="true" :model="searchForm" class="demo-form-inline zr-row-scatter">
            <div class="zr-row">
              <el-button class="tright" type="primary" @click="exportExcel()">导出</el-button>
              <el-upload class="tright" :show-file-list="false" style="margin-left: 10px;" :on-success="handleSuccess" :on-error="handleUploadError" :action="importUrl">
                <el-button size="small" type="primary">导入</el-button>
              </el-upload>
              <el-button class="tright" style="margin-left: 10px;" type="primary" @click="add">创建</el-button>
              <!--<el-button class="tright" type="primary" @click="copyCreat()">类似创建</el-button>-->
              <el-button class="tright" type="primary" @click="handleDelete()">批量删除</el-button>
              <el-button class="tright" type="primary" @click="loadTable()">刷新</el-button>
              <el-button class="tright" type="primary" @click="syncVideoDevice()">视频设备同步</el-button>
              <el-button class="tright" type="primary" v-show="isShow" @click="addRoot()">添加根目录</el-button>
            </div>

            <div class="zr-row">
              <el-form-item label>
                <el-input v-model="searchForm.deviceName" clearable placeholder="设备名称"></el-input>
              </el-form-item>
              <el-form-item label>
                <el-input v-model="searchForm.postion" clearable placeholder="安装位置"></el-input>
              </el-form-item>
              <el-form-item>
                <el-input v-model="searchForm.deviceModel" clearable placeholder="型号"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="search('param')">搜索</el-button>
              </el-form-item>
            </div>
          </el-form>
          <el-table
            ref="table"
            stripe
            :data="tableData"
            v-loading="loading1"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rbg(0,0,0,0.8)"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="60"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" type="index" width="50" label="序号" align="center"></el-table-column>
            <el-table-column :show-overflow-tooltip="true"  width="100"  prop="deviceName"  label="设备名称" align="center"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="deviceCode" label="设备编号" align="center"></el-table-column>
            <!--<el-table-column :show-overflow-tooltip="true" prop="deviceTypeCode" label="设备类型代码"></el-table-column>-->
            <el-table-column :show-overflow-tooltip="true" prop="deviceTypeName" label="设备类别" align="center"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="spec" label="规格型号" align="center"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="devicePerson"  width="120"  label="设备责任人" align="center"></el-table-column>
            <!--<el-table-column :show-overflow-tooltip="true" prop="devicePersonTel" label="责任人联系电话" width="150"></el-table-column>-->
            <el-table-column :show-overflow-tooltip="true" prop="postion" label="安装位置" align="center"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="操作" width="250" align="center">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button type="text" size="mini" @click="hisRepair(scope.row.deviceCode)">历史维修</el-button>
                <el-button type="text" size="mini" @click="hisMonitor(scope.row)">历史保养</el-button>
                <el-button type="text" size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-pagination
          v-if="pageShow"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[10, 15, 20, 25]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totolNum"
        ></el-pagination>
      </div>
      <!--编辑弹出窗-->
      <el-dialog
        :title="editform.id?'编辑':'新增'"
        :visible.sync="editTableVisible"
        style="widthhandleCurrentChange: 100%;"
      >
        <el-form :inline="true" :model="editform" :rules="rules" ref="editform" label-width="125px">
          <!-- <el-tabs type="border-card" >
          <el-tab-pane label="基本信息" name="tab1">-->
          <el-col :span="12">
            <el-form-item label="设备编号" prop="deviceCode">
              <el-input v-model="editform.deviceCode" style="width: 230px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备名称" prop="deviceName">
              <el-input v-model="editform.deviceName" style="width: 230px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备类别" prop="belongSystem">
              <el-input v-model="editform.belongSystem" style="width: 230px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="制造厂家" prop="manufacturer">
              <el-input v-model="editform.manufacturer" style="width: 230px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规格型号" prop="spec">
              <el-input v-model="editform.spec" style="width: 230px;"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
		                    <el-form-item label="规格" prop="spec">
		                        <el-input v-model="editform.spec"></el-input>
		                    </el-form-item>
          </el-col>-->
          <el-col :span="12">
            <el-form-item label="购置日期" prop="buyDate">
              <!-- <el-input v-model="editform.buyDate"></el-input> -->
              <el-date-picker
                v-model="editform.buyDate"
                type="date"
                placeholder="选择购置日期"
                value-format="timestamp"
                style="width: 230px;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出厂日期" prop="factoryTime">
              <!-- <el-input v-model="editform.factoryTime"></el-input> -->
              <el-date-picker
                v-model="editform.factoryTime"
                type="date"
                placeholder="选择出厂日期"
                value-format="timestamp"
                style="width: 230px;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出厂编号" prop="manufactureCode">
              <el-input v-model="editform.manufactureCode" style="width: 230px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="安装日期" prop="installTime">
              <!-- <el-input v-model="editform.installTime"></el-input> -->
              <el-date-picker
                v-model="editform.installTime"
                type="date"
                placeholder="选择安装日期"
                value-format="timestamp"
                style="width: 230px;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="安装单位" prop="installUnit">
              <el-input v-model="editform.installUnit" style="width: 230px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="安装位置" prop="postion">
              <el-input v-model="editform.postion" style="width: 230px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="使用日期" prop="useDate">
              <!-- <el-input v-model="editform.useDate"></el-input> -->
              <el-date-picker
                v-model="editform.useDate"
                type="date"
                placeholder="选择使用日期"
                value-format="timestamp"
                style="width: 230px;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="使用期限" prop="useLimit">
              <!-- <el-input v-model="editform.useLimit"></el-input> -->
              <el-input v-model="editform.useLimit" style="width: 230px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报废时间" prop="scrapTime">
              <!-- <el-input v-model="editform.scrapTime"></el-input> -->
              <el-date-picker
                v-model="editform.scrapTime"
                type="date"
                placeholder="选择报废时间"
                value-format="timestamp"
                style="width: 230px;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="质保开始日期" prop="qualityStartTime">
              <!-- <el-input v-model="editform.qualityStartTime"></el-input> -->
              <el-date-picker
                v-model="editform.qualityStartTime"
                type="date"
                placeholder="选择质保开始日期"
                value-format="timestamp"
                style="width: 230px;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="质保年限" prop="qualityYear">
              <el-input v-model="editform.qualityYear" style="width: 230px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="质保结束日期" prop="qualityEndTime">
              <!-- <el-input v-model="editform.qualityEndTime"></el-input> -->
              <el-date-picker
                v-model="editform.qualityEndTime"
                type="date"
                placeholder="选择质保结束日期"
                value-format="timestamp"
                style="width: 230px;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位" prop="unit">
              <el-input v-model="editform.unit" style="width: 230px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数量" prop="number">
              <el-input v-model="editform.number" style="width: 230px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备责任人" prop="devicePerson">
              <el-input v-model="editform.devicePerson" style="width: 230px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="责任人联系电话" prop="devicePersonTel">
              <el-input v-model="editform.devicePersonTel" style="width: 230px;"></el-input>
            </el-form-item>
          </el-col>

          <!--<el-col :span="12">
		                    <el-form-item label="子系统设备编号" prop="deviceNo">
		                        <el-input v-model="editform.deviceNo"></el-input>
		                    </el-form-item>
		                </el-col>
		                <el-col :span="12">
		                    <el-form-item label="规格型号">
		                        <el-input v-model="editform.spec"></el-input>
		                    </el-form-item>
		                </el-col>
		                <el-col :span="12">
		                    <el-form-item label="所属专业">
		                        <el-select v-model="editform.belongSystem" clearable  :disabled="true">
		                            <el-option v-for="item in belongSystems" :label="item.lable" :key="item.key" :value="item.key">
		                            </el-option>
		                        </el-select>
		                    </el-form-item>
		                </el-col>
		                <el-col :span="12">
		                    <el-form-item label="设备责任人">
		                        <el-input v-model="editform.devicePerson"></el-input>
		                    </el-form-item>
		                </el-col>
		                <el-col :span="12">
		                    <el-form-item label="生产厂家">
		                        <el-input v-model="editform.manufacturer"></el-input>
		                    </el-form-item>
		                </el-col>
		                <el-col :span="12">
		                    <el-form-item label="出厂日期" prop="factoryTime">
		                        <el-date-picker v-model="editform.factoryTime" type="datetime" value-format="timestamp"
		                                        format="yyyy-MM-dd" placeholder="选择日期">
		                        </el-date-picker>
		                    </el-form-item>
		                </el-col>
		                <el-col :span="12">
		                    <el-form-item label="安装日期" prop="installTime">
		                        <el-date-picker v-model="editform.installTime" type="datetime" value-format="timestamp"
		                                        format="yyyy-MM-dd" placeholder="选择日期">
		                        </el-date-picker>
		                    </el-form-item>
		                </el-col>
		                <el-col :span="12">
		                    <el-form-item label="安装单位">
		                        <el-input v-model="editform.installUnit"></el-input>
		                    </el-form-item>
		                </el-col>
		                <el-col :span="12">
		                    <el-form-item label="安装位置">
		                        <el-input v-model="editform.postion"></el-input>
		                    </el-form-item>
		                </el-col>
		                <el-col :span="12">
		                    <el-form-item label="备注">
		                        <el-input v-model="editform.remark"></el-input>
		                    </el-form-item>
          </el-col>-->

          <!-- </el-tab-pane>
                    <el-tab-pane label="附属设备" name="tab2">
                        <el-col :span="12">
		                    <el-form-item label="设备名称" prop="deviceName">
		                        <el-input v-model="editform.deviceName"></el-input>
		                    </el-form-item>
		                </el-col>
		                <el-col :span="12">
		                    <el-form-item label="数量" prop="deviceName">
		                        <el-input v-model="editform.deviceName"></el-input>
		                    </el-form-item>
		                </el-col>
		                <el-col :span="12">
		                    <el-form-item label="出厂日期" prop="deviceName">
		                        <el-input v-model="editform.deviceName"></el-input>
		                    </el-form-item>
		                </el-col>
		                <el-col :span="12">
		                    <el-form-item label="设备类别" prop="deviceName">
		                        <el-input v-model="editform.deviceName"></el-input>
		                    </el-form-item>
		                </el-col>
		                <el-col :span="12">
		                    <el-form-item label="使用状态" prop="deviceName">
		                        <el-input v-model="editform.deviceName"></el-input>
		                    </el-form-item>
		                </el-col>
		                <el-col :span="12">
		                    <el-form-item label="规格型号" prop="deviceName">
		                        <el-input v-model="editform.deviceName"></el-input>
		                    </el-form-item>
		                </el-col>
		                <el-col :span="12">
		                    <el-form-item label="安装位置" prop="deviceName">
		                        <el-input v-model="editform.deviceName"></el-input>
		                    </el-form-item>
		                </el-col>
		                <el-col :span="12">
		                    <el-form-item label="设备等级" prop="deviceName">
		                        <el-input v-model="editform.deviceName"></el-input>
		                    </el-form-item>
		                </el-col>
		                <el-col :span="12">
		                    <el-form-item label="主要性能参数" prop="deviceName">
		                        <el-input v-model="editform.deviceName"></el-input>
		                    </el-form-item>
		                </el-col>
		                <el-col :span="12">
		                    <el-form-item label="制造商" prop="deviceName">
		                        <el-input v-model="editform.deviceName"></el-input>
		                    </el-form-item>
		                </el-col>
		                <el-col :span="12">
		                    <el-form-item label="备注" prop="deviceName">
		                        <el-input v-model="editform.deviceName"></el-input>
		                    </el-form-item>
		                </el-col>
                    </el-tab-pane>
                    <el-tab-pane label="技术参数" name="tab3">
          <div class="tableWrap">-->
          <!--<el-form :inline="true" :model="searchForm" class="demo-form-inline zr-row-scatter">
								<div class="zr-row">
									<el-form-item label="">
			                            <el-input placeholder="关键字" v-model="searchForm.keyword" clearable ></el-input>
			                        </el-form-item>
			                        <el-form-item>
			                            <el-button type="primary" @click="search('param')">搜索</el-button>
			                        </el-form-item>
								</div>
          </el-form>-->
          <!-- <el-table ref="table" stripe :data="tableData" v-loading ="loading1"
						 element-loading-text="拼命加载中"
						  element-loading-spinner="el-icon-loading"
						   element-loading-background="rbg(0,0,0,0.8)"  style="width: 100%" @selection-change="handleSelectionChange">
								<el-table-column type="selection" width="60"></el-table-column>
								<el-table-column :show-overflow-tooltip="true" type="index" width="50" label="序号"></el-table-column>
								<el-table-column :show-overflow-tooltip="true" width="100" prop="deviceName" label="参数名称"></el-table-column>
								<el-table-column :show-overflow-tooltip="true" prop="deviceCode" label="技术参数（机械）"></el-table-column>
								<el-table-column :show-overflow-tooltip="true" prop="belongSystem" label="技术参数（电气）"></el-table-column>
								<el-table-column :show-overflow-tooltip="true" prop="spec" label="补充说明"></el-table-column>
								<el-table-column :show-overflow-tooltip="true" prop="devicePerson"  width="120" label="备注"></el-table-column>
								<el-table-column :show-overflow-tooltip="true" label="操作" width="250">
									<template slot-scope="scope">
										<el-button type="text" size="mini" @click="">编辑</el-button>
										<el-button type="text" size="mini" @click="">历史维修</el-button>
										<el-button type="text" size="mini" @click="">历史保养</el-button>
										<el-button type="text" size="mini" @click="">删除</el-button>
									</template>
								</el-table-column>
          </el-table>-->
          <!--分页-->
          <!-- <el-pagination  v-if="pageShow" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page=pageNum :page-sizes="[10, 15, 20, 25]" :page-size=pageSize layout="total, sizes, prev, pager, next, jumper" :total=totolNum>
							</el-pagination>
						</div>
                    </el-tab-pane>
                    <el-tab-pane label="维修记录" name="tab4">
                    	<div class="tableWrap">
							<el-form :inline="true" :model="searchForm" class="demo-form-inline zr-row-scatter">
								<div class="zr-row">
									<el-form-item label="">
			                            <el-input placeholder="关键字" v-model="searchForm.keyword" clearable ></el-input>
			                        </el-form-item>
			                        <el-form-item>
			                            <el-button type="primary" @click="search('param')">搜索</el-button>
			                        </el-form-item>
								</div>
							</el-form>
							<el-table ref="table" stripe :data="tableData" v-loading ="loading1"
						 element-loading-text="拼命加载中"
						  element-loading-spinner="el-icon-loading"
						   element-loading-background="rbg(0,0,0,0.8)"  style="width: 100%" @selection-change="handleSelectionChange">
								<el-table-column type="selection" width="60"></el-table-column>
								<el-table-column :show-overflow-tooltip="true" type="index" width="50" label="序号"></el-table-column>
								<el-table-column :show-overflow-tooltip="true" width="100" prop="deviceName" label="维修编号"></el-table-column>
								<el-table-column :show-overflow-tooltip="true" prop="deviceCode" label="维修类别"></el-table-column>
								<el-table-column :show-overflow-tooltip="true" prop="belongSystem" label="故障类别"></el-table-column>
								<el-table-column :show-overflow-tooltip="true" prop="spec" label="维修开始日期"></el-table-column>
								<el-table-column :show-overflow-tooltip="true" prop="devicePerson"  width="120" label="维修结束日期"></el-table-column>
								<el-table-column :show-overflow-tooltip="true" prop="postion" label="维修人员"></el-table-column>
          </el-table>-->
          <!--分页-->
          <!-- <el-pagination  v-if="pageShow" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page=pageNum :page-sizes="[10, 15, 20, 25]" :page-size=pageSize layout="total, sizes, prev, pager, next, jumper" :total=totolNum>
							</el-pagination>
						</div>
                    </el-tab-pane>
                    <el-tab-pane label="保养记录" name="tab5">
                    	<div class="tableWrap">
							<el-form :inline="true" :model="searchForm" class="demo-form-inline zr-row-scatter">
								<div class="zr-row">
									<el-form-item label="">
			                            <el-input placeholder="关键字" v-model="searchForm.keyword" clearable ></el-input>
			                        </el-form-item>
			                        <el-form-item>
			                            <el-button type="primary" @click="search('param')">搜索</el-button>
			                        </el-form-item>
								</div>
							</el-form>
							<el-table ref="table" stripe :data="tableData" v-loading ="loading1"
						 element-loading-text="拼命加载中"
						  element-loading-spinner="el-icon-loading"
						   element-loading-background="rbg(0,0,0,0.8)"  style="width: 100%" @selection-change="handleSelectionChange">
								<el-table-column type="selection" width="60"></el-table-column>
								<el-table-column :show-overflow-tooltip="true" type="index" width="50" label="序号"></el-table-column>
								<el-table-column :show-overflow-tooltip="true" width="100" prop="deviceName" label="保养内容"></el-table-column>
								<el-table-column :show-overflow-tooltip="true" prop="deviceCode" label="保养负责人"></el-table-column>
								<el-table-column :show-overflow-tooltip="true" prop="spec" label="保养开始日期"></el-table-column>
								<el-table-column :show-overflow-tooltip="true" prop="devicePerson"  width="120" label="保养结束日期"></el-table-column>
								<el-table-column :show-overflow-tooltip="true" prop="postion" label="保养类型"></el-table-column>
          </el-table>-->
          <!--分页-->
          <!-- <el-pagination  v-if="pageShow" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page=pageNum :page-sizes="[10, 15, 20, 25]" :page-size=pageSize layout="total, sizes, prev, pager, next, jumper" :total=totolNum>
							</el-pagination>
						</div>
                    </el-tab-pane>

          </el-tabs>-->
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="save('editform')">确 定</el-button>
          <el-button @click="editClose()">取 消</el-button>
        </span>
      </el-dialog>
      <!--编辑弹出窗-->
      <el-dialog title="重命名" :visible.sync="renameVisible">
        名称：
        <el-input v-model="reName"></el-input>类别代码：
        <el-input v-model="realId"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="rename()">确 定</el-button>
          <el-button @click="renameVisible=false">取 消</el-button>
        </span>
      </el-dialog>
      <!--添加同级菜单弹出窗-->
      <el-dialog title="添加同级菜单" :visible.sync="addNodeVisible">
        名称：
        <el-input v-model="nodeModel"></el-input>类别代码：
        <el-input v-model="nameCode"></el-input>
        <!-- 上传图标：<PhotoUpload v-if="addNodeVisible" v-model="uploadId" :upload="upload"></PhotoUpload> -->
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addNode()">确 定</el-button>
          <el-button @click="addNodeVisible=false">取 消</el-button>
        </span>
      </el-dialog>
      <!--添加子级菜单弹出窗-->
      <el-dialog title="添加子级菜单" :visible.sync="addSubNodeVisible">
        名称：
        <el-input v-model="subNodeModel"></el-input>类别代码：
        <el-input v-model="nameCode"></el-input>
        <!-- 上传图标：<PhotoUpload v-if="addSubNodeVisible" v-model="uploadId" :upload="upload"></PhotoUpload> -->
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addSubNode()">确 定</el-button>
          <el-button @click="addSubNodeVisible=false">取 消</el-button>
        </span>
      </el-dialog>
      <!--删除提示框-->
      <el-dialog title="提示" :visible.sync="deleteVisible" width="30%">
        <span>确定删除？</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="deleteRow()">确 定</el-button>
          <el-button @click="handleClose()">取 消</el-button>
        </span>
      </el-dialog>
      <el-dialog title="添加跟目录" :visible.sync="addRootVisible">
        名称：
        <el-input v-model="rootName"></el-input>类别代码：
        <el-input v-model="rootCode"></el-input>
        <!-- 上传图标：<PhotoUpload v-if="addSubNodeVisible" v-model="uploadId" :upload="upload"></PhotoUpload> -->
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addRootSubmit()">确 定</el-button>
          <el-button @click="addRootVisible=false">取 消</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="历史维修"
        :visible.sync="hisRepairDialog"
        style="widthhandleCurrentChange: 100%;"
      >
        <el-table ref="table1" stripe :data="hisRepairTableData" style="width: 100%">
          <el-table-column :show-overflow-tooltip="true" type="index" label="序号" width="50"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="repairNo" label="维修编号">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="smart"
                @click="openRepair(scope.row)"
              >{{scope.row.repairNo}}</el-button>
            </template>
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            prop="repairType"
            label="维修类别"
            :formatter="repairType"
          ></el-table-column>

          <!-- 故障类别 1机械故障 2突发事件 3线路故障 4签报 5内部维修 6日常维修 7保修 -->
          <el-table-column
            :show-overflow-tooltip="true"
            prop="faultClass"
            label="故障类别"
            :formatter="faultClass"
          ></el-table-column>
          <!-- 维修开始日期 -->
          <el-table-column
            :show-overflow-tooltip="true"
            prop="startTime"
            label="维修开始日期"
            :formatter="startTime"
            width="120"
          ></el-table-column>
          <!-- 维修结束日期 -->
          <el-table-column
            :show-overflow-tooltip="true"
            prop="endTime"
            label="维修结束日期"
            :formatter="endTime"
            width="120"
          ></el-table-column>
          <!-- 维修结束日期 -->
          <!-- <el-table-column
            :show-overflow-tooltip="true"
            prop="createTime"
            label="维修登记时间"
            :formatter="createTime"
            width="160"
          ></el-table-column>-->
          <!-- 维修内容 -->
          <!--<el-table-column :show-overflow-tooltip="true" prop="content" label="维修内容"></el-table-column>-->
          <!-- 维修负责人 -->
          <el-table-column :show-overflow-tooltip="true" prop="repairUser" label="维修人员" width="100"></el-table-column>
        </el-table>
        <el-pagination
          v-if="hisRepairRenovatePagination"
          @size-change="hisRepairOnSizeChange"
          @current-change="hisRepairOnCurrentChange"
          :current-page="hisRepairPageNum"
          :page-sizes="[10, 15, 20, 25]"
          :page-size="hisRepairPageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="hisRepairTotolNum"
        ></el-pagination>
      </el-dialog>
      <el-dialog
        title="历史保养"
        :visible.sync="hisMaintainDialog"
        style="widthhandleCurrentChange: 100%;"
      >
        <el-table ref="table2" stripe :data="hisMaintainTableData" style="width: 100%">
          <el-table-column :show-overflow-tooltip="true" type="index" label="序号" width="50"></el-table-column>
          <!-- 保养设备 -->
          <el-table-column :show-overflow-tooltip="true" prop="content" label="保养内容">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="smart"
                @click="openMaintain(scope.row)"
              >{{scope.row.content}}</el-button>
            </template>
          </el-table-column>
          <!-- 保养负责人 -->
          <el-table-column
            :show-overflow-tooltip="true"
            prop="maintainUserId"
            label="保养负责人"
            width="100"
          ></el-table-column>
          <!-- 设备编号 -->
          <!-- <el-table-column :show-overflow-tooltip="true" prop="deviceId" label="设备编号"></el-table-column> -->
          <!-- 保养开始日期 -->
          <el-table-column
            :show-overflow-tooltip="true"
            prop="startTime"
            label="保养开始日期"
            :formatter="startTime"
            width="120"
          ></el-table-column>
          <!-- 保养结束日期 -->
          <el-table-column
            :show-overflow-tooltip="true"
            prop="endTime"
            label="保养结束日期"
            :formatter="endTime"
            width="120"
          ></el-table-column>

          <!-- 保养描述
          <el-table-column :show-overflow-tooltip="true" prop="description" label="保养描述"></el-table-column>-->
          <!-- 保养类型 1静态保养 2动态保养 -->
          <el-table-column
            :show-overflow-tooltip="true"
            prop="maintainType"
            :formatter="getMaintainType"
            label="保养类型"
          ></el-table-column>
        </el-table>
        <el-pagination
          v-if="hisMaintainRenovatePagination"
          @size-change="hisMaintainOnSizeChange"
          @current-change="hisMaintainOnCurrentChange"
          :current-page="hisMaintainPageNum"
          :page-sizes="[10, 15, 20, 25]"
          :page-size="hisMaintainPageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="hisMaintainTotolNum"
        ></el-pagination>
      </el-dialog>

      <div id="rMenu">
        <ul>
          <li id="m_add" @click="handleAddNode()">增加同级菜单</li>
          <li id="m_check" @click="handleAddSubNode()">增加子级菜单</li>
          <li id="m_unCheck" @click="handleRename()">重命名</li>
          <li id="m_del" @click="removeTreeNode()">删除节点</li>
        </ul>
      </div>
    </div>
    <!-- 历史维修记录弹框 -->
    <el-dialog
      :title="isDetail?'查看详情':(editform.id?'编辑':'新增')"
      :visible.sync="formDialogVisible"
      width="900px"
    >
      <el-form :model="editform" :rules="rules" ref="editform" label-width="120px">
        <div class="p-10 f-w-700 m-b-10">设备信息</div>
        <el-row class="m-t-10">
          <div class="b-0 p-20">
            <el-col :span="8">
              <el-form-item label="设备编号" prop="deviceId">
                <!-- 设备编号 -->
                <el-input v-model="editform.deviceId" :disabled="isDetail||!!editform.id"></el-input>
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
                <el-input v-model="editform.deviceTypeName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="维修设备" prop="deviceName">
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
        <div class="p-10 f-w-700 m-b-10">维修信息</div>
        <el-row>
          <el-col :span="24">
            <el-form-item label="维修编号">
              <!-- 维修编号 -->
              <el-input v-model="editform.repairNo" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="维修人员">
              <!-- 维修人员 -->
              <el-input v-model="editform.repairUser" :disabled="isDetail"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="故障类别" prop="faultClass">
              <!-- 故障类别 1机械故障 2突发事件 3线路故障 4签报 5内部维修 6日常维修 7保修 -->
              <!--<el-input v-model="editform.faultClass" :disabled="isDetail"></el-input>-->
              <el-select v-model="editform.faultClass" style="width: 100%;" :disabled="isDetail">
                <el-option
                  v-for="item in faultClassList"
                  :label="item.label"
                  :key="item.value"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="维修类别" prop="repairType">
              <!-- 维修类别 1自维 2 外维 -->
              <!--<el-input v-model="editform.repairType" :disabled="isDetail"></el-input>-->
              <el-select v-model="editform.repairType" style="width: 100%;" :disabled="isDetail">
                <el-option
                  v-for="item in repairTypeList"
                  :label="item.label"
                  :key="item.value"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <!-- 维修开始日期 -->
            <el-form-item label="维修开始日期" prop="startTime">
              <el-date-picker
                v-model="editform.startTime"
                type="date"
                value-format="timestamp"
                format="yyyy-MM-dd"
                placeholder="维修开始日期"
                :disabled="isDetail"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- 维修结束日期 -->
            <el-form-item label="维修结束日期" prop="endTime">
              <el-date-picker
                v-model="editform.endTime"
                type="date"
                value-format="timestamp"
                format="yyyy-MM-dd"
                placeholder="维修结束日期"
                :disabled="isDetail"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-col :span="24">
          <el-form-item label="材料使用情况">
            <!-- 材料使用情况 -->
            <el-input
              v-model="editform.material"
              :autosize="{minRows:5}"
              :disabled="isDetail"
              maxlength="100"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="维修内容">
            <!-- 维修内容 -->
            <el-input
              v-model="editform.content"
              type="textarea"
              :autosize="{minRows:5}"
              :disabled="isDetail"
              maxlength="100"
            ></el-input>
          </el-form-item>
        </el-col>
        <!--<el-col :span="12">
                            <el-form-item label="备注" prop="remark">
                                &lt;!&ndash; 备注 &ndash;&gt;
                                <el-input v-model="editform.remark" :disabled="isDetail"></el-input>
                            </el-form-item>
        </el-col>-->
      </el-form>
      <!-- <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="save()">确 定</el-button>
                    <el-button @click="close()">取 消</el-button>
      </span>-->
    </el-dialog>

    <!--历史保养弹出窗-->
    <el-dialog title="查看详情" :visible.sync="MaintainformDialogVisible" width="950px">
      <el-form :model="editform" :rules="rules" ref="editform" label-width="120px">
        <el-row class="m-t-10">
          <span style="font-weight: 600;">设备信息</span>
          <div class="b-0 p-20">
            <el-col :span="8">
              <el-form-item label="设备编号" prop="deviceId">
                <!-- 设备编号 -->
                <el-input v-model="editform.deviceId" disabled></el-input>
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
                <el-input v-model="editform.deviceTypeName" disabled></el-input>
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
          <span style="font-weight: 600;">保养信息</span>
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
              <el-form-item label="保养人" prop="maintainPerson">
                <!-- 保养负责人 -->
                <el-input v-model="editform.maintainPerson" disabled></el-input>
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
      <!-- <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="save()">确 定</el-button>
                    <el-button @click="close()">取 消</el-button>
      </span>-->
    </el-dialog>
  </div>
</template>

<script>
import { api } from "@/libs";
import Vue from "vue";
export default {
  data: function() {
    var checkphone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确手机号！"));
        }
      }
    };
    return {
        repairTypeList: [
          {
            label:'自维',
            value:'1'
          },
          {
            label:'外维',
            value:'2'
          }
        ],
        faultClassList:[],
        MaintainformDialogVisible: false,
        formDialogVisible: false,
        editform: {},
        isDetail: true,
        loading1: false,
        pageShow: true,
        hisRepairRenovatePagination: true,
        hisMaintainRenovatePagination: true,
        addSubNodeVisible: false,
        addNodeVisible: false,
        renameVisible: false,
        subNodeModel: "",
        nodeModel: "",
        uploadId: "",
        rootName: "",
        rootCode: "",
        addRootVisible: false,
        //上传图片的对象
        upload: {
            type: "single"
        },
        //已经渲染过的父节点id数组
        showedIconList: [],
        reName: "",
        realId: "",
        nameCode: "",
        ranks: "1",
        treeKey: "",
        resTree: "",
        resTreeNodes: [],
        pageSize: 10,
        pageNum: 1,
        totolNum: 0,
        hisRepairPageSize: 10,
        hisRepairTotolNum: 0,
        hisRepairPageNum: 1,
        hisMaintainPageSize: 10,
        hisMaintainTotolNum: 0,
        hisMaintainPageNum: 1,
        tableData: [],
        hisRepairTableData: [],
        hisMaintainTableData: [],
        items: [],
        deviceSystemCode: "",
        deviceSystemName: "",
        deviceSubSysCode: "",
        deviceSubSysName: "",
        deviceTypeCode: "",
        deviceCodeShow: false,
        isShow: false,
        deviceTypeName: "",
        importUrl: api.baseUrl + "/manage/device/importExcel?token=" + window.localStorage.csmpToken,
        resSetting: {
            view: {
              dblClickExpand: true,
              fontCss: this.getFont,
              showIcon: false,
              expand: false
            },
            data: {
              simpleData: {
                  enable: true,
                  idKey: "realId",
                  pIdKey: "pId"
              }
            },
            callback: {
              onClick: this.treeClick,
              onRightClick: this.onRightClick,
              beforeExpand: this.beforeExpand,
              onExpand: this.onExpand,
              onDrag: this.onDrag
            },
            async: {
              enable: true,
              url: api.baseUrl + "/manage/device/findByPage",
              autoParam: ["realId=deviceTypeCode"],
              otherParam: { page: "1", size: "999999" },
              type: "get",
              headers: {
                  token: window.localStorage.csmpToken
              },
              dataFilter: this.dataFilter
            }
        },
        belongSystems: [
            {
              lable: "强电系统",
              key: "强电系统"
            },
            {
              lable: "弱电系统",
              key: "弱电系统"
            },
            {
              lable: "消防给排水系统",
              key: "消防给排水系统"
            },
            {
              lable: "空调系统",
              key: "空调系统"
            },
            {
              lable: "能源系统",
              key: "能源系统"
            }
        ],
        rules: {
            deviceCode:[
              {
                required:true,
                message:'请输入设备编号',
                trigger:"blur"
              }
            ],
            deviceName: [
              {
                required: true,
                message: "请输入设备名称",
                trigger: "blur"
              },
              {
                min: 2,
                message: "长度在 2个字以上",
                trigger: "blur"
              }
            ],
            factoryTime: [
              {
                required: false,
                message: "选择时间",
                trigger: "blur"
              }
            ],
            deviceNo: [
              {
                required: true,
                message: "请输入设备编号",
                trigger: "blur"
              }
            ],
            installTime: [
              {
                required: false,
                message: "选择时间",
                trigger: "blur"
              }
            ]
            /*deviceModel: [{
                            required: true,
                            message: '请输入设备型号',
                            trigger: 'blur'
                        }, ],*/
            /*devicePersonTel: [{
                            required: false,
                            validator: checkphone,
                            trigger: 'blur'
                        }, ]*/
        },
        editTableVisible: false,
        deleteVisible: false,
        editform: {},
        deleteIds: "",
        checkedArr: [],
        searchForm: {},
        rMenu: "",
        rightClickNode: "",
        alarmId: "",
        maintainId: "",
        hisRepairDialog: false,
        hisMaintainDialog: false
    };
  },
  created() {
    this.loadTree();
    this.isAdmin();
     this.initServerType();
  },
  mounted() {
    let _this = this;
    document.onkeydown = function(e) {
      if (!e) {
        e = window.event;
      }
      if ((e.keyCode || e.which) == 13) {
        _this.findInTree();
      }
    };
    this.rMenu = $("#rMenu");
  },
  methods: {
    // 导入
    handleSuccess() {
      this.$message.success('数据导入成功!')
    },
    handleUploadError() {
      this.$message.error(err)
    },
    // 打开保养记录
    openMaintain(row){
      this.editform={};
      this.editform.deviceId=row.deviceId;
      let transId = row.maintainTaskId
       this.$httpGet("get", "/manage/device/queryByDeviceCode", {
          deviceCode: row.deviceId
        }).then(res=>{
          if(res.data.code==0){
             let device = res.data.body;
            if (device) {
              this.editform.deviceSystemName = device.deviceSystemName;
              this.editform.deviceSubSysName = device.deviceSubSysName;
              this.editform.deviceTypeName = device.deviceTypeName;
              this.editform.deviceName = device.deviceName;
              this.editform.postion = device.postion;
              this.editform.createUserId = device.createUserId;
              if (transId === null) {
                this.editform.startTime=row.startTime;
                this.editform.endTime=row.endTime;
                this.editform.maintainPerson='';
                this.editform.content=row.content;
                this.editform.maintainPerson=row.maintainPerson;
                this.MaintainformDialogVisible=true;this.MaintainformDialogVisible=true;
              } else {
                this.$httpPost('/manage/maintainEquipment/findByEntity',{
                  maintainTaskId: row.maintainTaskId
                  // deviceId:row.deviceId
                }).then(res=>{
                  if(res.data.code==0){
                    this.editform.startTime=res.data.body.startTime;
                    this.editform.endTime=res.data.body.endTime;
                    this.editform.maintainPerson=res.data.body.maintainPerson;
                    this.editform.content=res.data.body.content;
                  }
                  this.MaintainformDialogVisible=true;this.MaintainformDialogVisible=true;
                })
              }

            } else {
              this.$message.error("设备编号不存在");
              return;
            }
          }
        })

    },
    // 打开维修记录详情
    openRepair(row){
      console.log(row)
      this.formDialogVisible=true;
      this.editform={}
      this.$httpPost('/manage/equipmentRepair/get',{
          id:row.id
      }).then(res=>{
        console.log(res.data.code)
        console.log(res.data.body)
        if(res.data.code==0){
          this.editform=res.data.body
          this.$httpGet('get', '/manage/device/queryByDeviceCode', {
                    deviceCode: this.editform.deviceId
                }).then(res => {
                    if (res.data.code == 0) {
                        let device = res.data.body;
                        if(device){
                            this.editform.deviceSystemName  = device.deviceSystemName;
                            this.editform.deviceSubSysName  = device.deviceSubSysName;
                            this.editform.deviceTypeName  = device.deviceTypeName;
                            this.editform.deviceName  = device.deviceName;
                            this.editform.postion  = device.postion;
                        }else{
                            this.$message.error('设备编号不存在');
                            return;
                        }
                    } else {
                    }
                    this.$forceUpdate();
                })
        }
      })
      //this.editform.deviceId=row.deviceId


    },
    // 查询报警记录
    hisRepair(id) {
      this.alarmId = id;
      this.$httpPost("/manage/equipmentRepair/findByDeviceId", {
        page: this.hisRepairPageNum,
        size: this.hisRepairPageSize,
        deviceId: id
      }).then(res => {
        this.hisRepairTableData = res.data.body.content;
        this.hisRepairTotolNum = Number(res.data.body.totalElements);
        this.hisRepairRenovatePagination = true;
      });
      this.hisRepairDialog = true;
    },
    // 页码改变
    hisRepairOnCurrentChange(val) {
      this.hisRepairPageNum = val;
      this.hisRepairSearch();
    },
    hisRepairOnSizeChange(val) {
      this.hisRepairPageSize = val;
      this.hisRepairSearch();
    },
    // 历史保养
    hisMaintainOnCurrentChange(val) {
      this.hisMaintainPageNum = val;
      this.hisMaintainSearch();
    },
    hisMaintainOnSizeChange(val) {
      this.hisMaintainPageSize = val;
      this.hisMaintainSearch();
    },
    // 时间格式化
    startTime(row, column, cellValue) {
      if (row.startTime != null) {
        return Vue.filter("dateFormat")(row.startTime, "yyyy-MM-dd");
      }
    },
    // 时间格式化
    endTime(row, column, cellValue) {
      if (row.endTime != null) {
        return Vue.filter("dateFormat")(row.endTime, "yyyy-MM-dd");
      }
    },
    // 时间格式化
    createTime(row, column, cellValue) {
      if (row.createTime != null) {
        return Vue.filter("dateFormat")(row.createTime, "yyyy-MM-dd");
      }
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
    // 维修类别 1自维 2外维
    repairType: function(row, column, cellValue) {
      switch (row.repairType) {
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
      switch (row.faultClass) {
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
    hisRepairSearch() {
      // this.pageNum = 1;
      this.pageShow = false;
      this.$httpPost("/manage/alarmHis/find", {
        page: this.hisRepairPageNum,
        size: this.hisRepairPageSize,
        deviceId: this.alarmId
      }).then(res => {
        this.hisRepairTableData = res.data.body.content;
        this.hisRepairPageNum = Number(res.data.body.number) + 1;
        this.hisRepairTotolNum = Number(res.data.body.totalElements);
        this.hisRepairRenovatePagination = true;
      });
    },
    hisMonitor(id) {
      this.maintainId = id;
      this.$httpPost("/manage/maintainEquipment/find", {
        page: this.hisMaintainPageNum,
        size: this.hisMaintainPageSize,
        deviceId: id.deviceCode
      }).then(res => {
        this.hisMaintainTableData = res.data.body.content;
        this.hisMaintainTotolNum = Number(res.data.body.totalElements);
        this.hisMaintainRenovatePagination = true;
      });
      this.hisMaintainDialog = true;
    },

    // 添加同级目录
    addNode() {
      this.$httpGet("get", "/manage/device/tree/save", {
        // id:this.rightClickNode.id,
        pId: this.rightClickNode.pId,
        ranks: this.rightClickNode.ranks,
        name: this.nodeModel,
        realId: this.nameCode,
        type: "1"
        // icon: this.uploadId
      }).then(res => {
        this.addNodeVisible = false;
        this.nameCode = "";
        if (parseInt(this.rightClickNode.ranks) === 1) {
          this.loadTree();
        } else {
          this.loadTree(this.rightClickNode.pId, 2);
        }
      });
    },
    // 添加子级菜单
    addSubNode() {
      this.$httpGet("get", "/manage/device/tree/save", {
        pId: this.rightClickNode.realId,
        ranks: parseInt(this.rightClickNode.ranks) + 1,
        name: this.subNodeModel,
        realId: this.nameCode,
        type: "1"
        // icon: this.uploadId
      }).then(res => {
        this.addSubNodeVisible = false;
        this.nameCode = "";
        this.loadTree(this.rightClickNode.id, 1);
      });
    },
    // 掉起弹窗
    handleAddNode() {
      this.nodeModel = "";
      this.addNodeVisible = true;
      this.uploadId = "";
    },
    // 掉起弹窗
    handleAddSubNode() {
      this.subNodeModel = "";
      this.addSubNodeVisible = true;
      this.uploadId = "";
    },
    isAdmin() {
      this.$httpPost("/system/user/role/isAdmin", {}).then(res => {
        if (res.data.code == 0 && res.data.body == true) {
          // 显示添加按钮
          this.isShow = true;
        }
      });
    },
    addRoot() {
      this.addRootVisible = true;
    },
    addRootSubmit() {
      this.$httpPost("/manage/device/addRoot", {
        rootName: this.rootName,
        rootCode: this.rootCode
      }).then(res => {
        if (res.data.code == 0) {
          this.addRootVisible = false;
          this.loadTree(this.rightClickNode.pId, 1);
        }
      });
    },
    // 掉起弹窗
    handleRename() {
      this.renameVisible = true;
      this.reName = this.rightClickNode.name;
      this.realId = this.rightClickNode.realId;
    },
    // 重命名
    rename() {
      this.$httpGet("get", "/manage/device/tree/save", {
        id: this.rightClickNode.id,
        pId: this.rightClickNode.pId,
        realId: this.realId,
        ranks: this.rightClickNode.ranks,
        name: this.reName,
        type: "1"
      }).then(res => {
        this.renameVisible = false;
        this.loadTree(this.rightClickNode.id, 1);
      });
    },
    // 删除节点
    removeTreeNode() {
      this.$httpGet("get", "/manage/device/findByPage", {
        deviceTypeCode: this.rightClickNode.realId,
        page: this.pageNum,
        size: this.pageSize
      }).then(res => {
        let count = Number(res.data.body.totalElements);
        if (count > 0) {
          this.$message({
            type: "warning",
            message: "该分类下存在设备不能删除"
          });
        } else {
          if (confirm("删除本节点将删除所有包含的节点，确定删除么？")) {
            this.$httpPost("/manage/device/tree/deleteById", {
              id: this.rightClickNode.id
            }).then(
              res => {
                this.$message({
                  type: "success",
                  message: "删除成功"
                });
                this.hideRMenu();
                this.loadTree(this.rightClickNode.pId, 2);
              },
              function(response) {}
            );
          } else {
            this.hideRMenu();
          }
        }
      });
    },
    // 加载树
    loadTree(id, flag) {
      this.$http("get", "/manage/device/tree/1", {}).then(res => {
        this.resTreeNodes = res.data.body;

        this.resTreeNodes.forEach(item => {
          if (!item.icon) item.icon = "static/img/diy/4.png";
        });
        this.resTreeNodes.forEach(item => {
          if (item.ranks === "3")
            item.children = item.children ? item.children : [];
        });

        $.fn.zTree.init($("#resTree"), this.resSetting, this.resTreeNodes);
        this.resTree = $.fn.zTree.getZTreeObj("resTree");
        // this.resTree.getNodes().forEach(item => {
        // 	if(item.icon !== 'static/img/diy/4.png') {
        // 		let img = document.createElement('img')
        // 		img.className = 'iconImg'
        // 		img.style.width = '16px'
        // 		img.style.marginTop = '6px'
        // 		img.src = api.fileserver + 'download?fileId=' + item.icon
        // 		document.getElementById(item.tId + '_a').removeChild(document.getElementById(item.tId + '_ico'))
        // 		document.getElementById(item.tId + '_a').insertBefore(img,document.getElementById(item.tId + '_span'))
        // 	}
        // })
        if (id) {
          let firstNode;
          if (flag === 1) {
            firstNode = this.resTree.getNodeByParam("id", id, null);
          } else {
            firstNode = this.resTree.getNodeByParam("realId", id, null);
          }
          this.resTree.selectNode(firstNode);
          this.deviceTypeCode = this.resTree.getNodes()[0].realId;
          this.resTree.expandNode(firstNode);
          // firstNode.children.forEach(item => {
          // 	if(item.icon !== 'static/img/diy/4.png') {
          // 		let img = document.createElement('img')
          // 		img.className = 'iconImg'
          // 		img.style.width = '16px'
          // 		img.style.marginTop = '6px'
          // 		img.src = api.fileserver + 'download?fileId=' + item.icon
          // 		document.getElementById(item.tId + '_a').removeChild(document.getElementById(item.tId + '_ico'))
          // 		document.getElementById(item.tId + '_a').insertBefore(img,document.getElementById(item.tId + '_span'))
          // 	}
          // })
        } else {
          this.showedIconList = [];
          var firstNode = this.resTree.getNodes()[0];
          this.resTree.selectNode(firstNode);
          this.deviceTypeCode = this.resTree.getNodes()[0].realId;
        }
        this.loadTable();
      });
    },
    // 模糊搜索树
    findInTree() {
      if (this.treeKey == "") {
        return;
      }
      let nodes = this.resTree.getNodesByParamFuzzy("name", this.treeKey);
      if (nodes.length == 0) {
        this.handleClear();
        return;
      }
      this.handleClear();

      let resTreeNodes = this.resTree.transformToArray(this.resTree.getNodes());
      for (var i = 0; i < nodes.length; i++) {
        for (var j = 0; j < resTreeNodes.length; j++) {
          if (resTreeNodes[j].id == nodes[i].id) {
            for (var n = 0; n < resTreeNodes.length; n++) {
              if (resTreeNodes[n].realId == resTreeNodes[j].pId) {
                this.resTree.expandNode(resTreeNodes[n], true, false, false);
                this.resTree.updateNode(resTreeNodes[n]);
              }
            }
            resTreeNodes[j].font = {
              background: "#9abeff",
              color: "#333"
            };
            this.resTree.updateNode(resTreeNodes[j]);
          }
        }
      }
    },
    // 清空搜索树框
    handleClear() {
      //				let resTreeNodes = this.resTree.transformToArray(this.resTree.getNodes());;
      //				for(var j = 0; j < resTreeNodes.length; j++) {
      //					delete resTreeNodes[j].font;
      //					this.resTree.expandNode(resTreeNodes[j], false, false, false)
      //				}
      //				$.fn.zTree.init($("#resTree"), this.resSetting, resTreeNodes);

      $.fn.zTree.init($("#resTree"), this.resSetting, this.resTreeNodes);
      this.resTree = $.fn.zTree.getZTreeObj("resTree");
      var firstNode = this.resTree.getNodes()[0];
      this.resTree.selectNode(firstNode);
      this.deviceTypeCode = this.resTree.getNodes()[0].realId;
      this.loadTable();
    },
    // 初始化表格
    loadTable() {
      this.loading1 = true;
      this.$httpGet("get", "/manage/device/findByPage", {
        deviceTypeCode: this.deviceTypeCode,
        page: this.pageNum,
        size: this.pageSize
      }).then(res => {
        this.loading1 = false;
        this.tableData = res.data.body.content;
        this.totolNum = Number(res.data.body.totalElements);
      });
      this.$http("post", "/system/user/dict/findListByType", {
        typekey: "deviceUseStuats"
      }).then(res => {
        this.items = res.data.body;
      });
    },
    syncVideoDevice() {
      this.$http("post", "/manage/device/syncVideoDevice", {}).then(res => {
        this.loadTable();
      });
    },
    handleEdit(index, row) {
        console.log(row)
      this.editform = Object.assign({}, row);
      this.editform.belongSystem = row.deviceTypeName;
      this.deviceCodeShow = true;
      this.editTableVisible = true;
    },
    add() {
      if (this.ranks != 4) {
        // this.deviceTypeCode.length
        this.$alert("请选择四级类别", "提示", {
          confirmButtonText: "确定",
          callback: action => {}
        });
        return;
      }
      this.editform = {};
      this.editform.belongSystem = this.deviceTypeName;
      this.deviceCodeShow = false;
      this.editTableVisible = true;
    },
    getFont(treeId, node) {
      return node.font ? node.font : {};
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
      this.$httpGet("get", "/manage/device/deleteByIds", {
        id: this.deleteIds
      }).then(res => {
        this.deleteVisible = false;
        this.deleteIds = "";
        this.loadTable();
      });
    },
    exportExcel() {
      if(this.deleteIds==""){
        this.$confirm('确认要导出所有数据吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            location.href =
            api.baseUrl +
            "/manage/device/exportExcel" +
            "?ids=" +
            this.deleteIds +
            "&token=" +
            window.localStorage.csmpToken;
        }).catch(() => {
            this.$message({
            type: 'info',
            message: '已取消操作'
            })
        })
      } else {
        location.href =
        api.baseUrl +
        "/manage/device/exportExcel" +
        "?ids=" +
        this.deleteIds +
        "&token=" +
        window.localStorage.csmpToken;
      }
    },
    // 修改 新增 保存
    save(formrule) {
      this.$refs[formrule].validate(valid => {
        if (valid) {
          this.$httpPost("/manage/device/save", {
            id: this.editform.id,
            deviceName: this.editform.deviceName,
            deviceNo: this.editform.deviceNo,
            deviceCode: this.editform.deviceCode,
            deviceSystemName: this.deviceSystemName,
            deviceSubSysCode: this.deviceSubSysCode,
            deviceSubSysName: this.deviceSubSysName,
            deviceSystemCode: this.deviceSystemCode,
            deviceTypeCode: this.deviceTypeCode,
            deviceTypeName: this.deviceTypeName,
            spec: this.editform.spec,
            belongSystem: this.editform.belongSystem,
            deviceModel: this.editform.deviceModel,
            devicePerson: this.editform.devicePerson,
            devicePersonTel: this.editform.devicePersonTel,
            manufacturer: this.editform.manufacturer,
            factoryTime: this.editform.factoryTime,
            installTime: this.editform.installTime,
            installUnit: this.editform.installUnit,
            postion: this.editform.postion,
			remark: this.editform.remark,
			// 购置日期
			buyDate: this.editform.buyDate,
			// 出厂编号
			manufactureCode: this.editform.manufactureCode,
			// 使用日期
			useDate: this.editform.useDate,
			// 使用期限
			useLimit: this.editform.useLimit,
			// 报废时间
			scrapTime: this.editform.scrapTime,
			// 质保开始日期
			qualityStartTime: this.editform.qualityStartTime,
			// 质保年限
			qualityYear: this.editform.qualityYear,
			// 质保结束日期
			qualityEndTime: this.editform.qualityEndTime,
			// 单位
			unit: this.editform.unit,
			// 数量
			number: this.editform.number
          }).then(
            res => {
              if (res.data.code === 0) {
                this.editTableVisible = false;
                this.deviceCodeShow = false;
                this.loadTable();
              } else {
              }
            },
            error => {}
          );
        } else {
          return false;
        }
      });
    },
    // 页码数改变
    handleSizeChange(val) {
      this.pageSize = val;
      let n = this.totolNum / val;
      n = Math.ceil(n);
      if (n < this.pageNum) {
        this.pageNum = 1;
      }
      this.search();
    },
    // 页码改变
    handleCurrentChange(val) {
      this.pageNum = val;
      this.search();
    },
    // 表格选择改变事件
    handleSelectionChange(val) {
      this.checkedArr = val;
      let idsArr = [];
      for (var i = 0; i < val.length; i++) {
        idsArr.push(val[i].id);
      }
      this.deleteIds = idsArr.join(",");
    },
    // 类似创建
    copyCreat() {
      if (this.checkedArr.length > 1 || this.checkedArr.length == 0) {
        this.$message.error("只能类似创建一条");
      } else {
        if (this.deviceTypeCode.length < 6) {
          this.$alert("请选择三级类别", "提示", {
            confirmButtonText: "确定",
            callback: action => {}
          });
          return;
        }
        (this.editform.deviceName = this.checkedArr[0].deviceName),
          (this.editform.deviceTypeName = this.checkedArr[0].deviceTypeName),
          (this.editform.deviceModel = this.checkedArr[0].deviceModel),
          (this.editform.deviceCount = this.checkedArr[0].deviceCount),
          (this.editform.devicePerson = this.checkedArr[0].devicePerson),
          (this.editform.devicePersonTel = this.checkedArr[0].devicePersonTel),
          (this.editform.manufacturer = this.checkedArr[0].manufacturer),
          (this.editTableVisible = true);
      }
    },
    // form搜索
    search(type) {
      if (type == "param") {
        this.pageNum = 1;
        this.pageShow = false;
      }
      this.$httpGet("get", "/manage/device/findByPage", {
        deviceTypeCode: this.deviceTypeCode,
        deviceName: this.searchForm.deviceName,
        deviceModel: this.searchForm.deviceModel,
        postion: this.searchForm.postion,
        page: this.pageNum,
        size: this.pageSize
      }).then(res => {
        this.tableData = res.data.body.content;
        this.pageNum = Number(res.data.body.number) + 1;
        this.totolNum = Number(res.data.body.totalElements);
        this.pageShow = true;
      });
    },
    // 取消删除
    handleClose() {
      // this.deleteIds = "";
      this.deleteVisible = false;
      this.$forceUpdate();
    },
    // 树节点展开前
    beforeExpand(treeId, treeNode) {
      // if(treeNode.ranks === '3') this.resTree.reAsyncChildNodes(treeNode, "refresh")
    },
    // 树节点展开后
    onExpand(event, treeId, treeNode) {
      // if(!this.showedIconList.includes(treeNode.id)) {
      // 	treeNode.children.forEach(item => {
      // 		if(item.icon !== 'static/img/diy/4.png') {
      // 			let img = document.createElement('img')
      // 			img.className = 'iconImg'
      // 			img.style.width = '16px'
      // 			img.style.marginTop = '6px'
      // 			img.src = api.fileserver + 'download?fileId=' + item.icon
      // 			document.getElementById(item.tId + '_a').removeChild(document.getElementById(item.tId + '_ico'))
      // 			document.getElementById(item.tId + '_a').insertBefore(img,document.getElementById(item.tId + '_span'))
      // 		}
      // 	})
      // 	this.showedIconList.push(treeNode.id)
      // }
    },
    // 异步加载数据的接口回调
    dataFilter(treeId, parentNode, res) {
      const childNodes = res.body.content;
      if (childNodes.length > 0) {
        childNodes.forEach(item => {
          item.name = item.deviceName;
        });
        return childNodes;
      } else return null;
    },
    // 树节点点击
    treeClick(e, treeId, treeNode) {
      console.log(treeNode)
      this.deviceTypeCode = treeNode.realId;
      this.pageNum = 1;
      // this.search();
      if (treeNode.ranks == 4) {
        this.deviceSystemCode = treeNode.getParentNode().getParentNode().realId;
        this.deviceSystemName = treeNode.getParentNode().getParentNode().name;
        this.deviceSubSysCode = treeNode.getParentNode().realId;
        this.deviceSubSysName = treeNode.getParentNode().name;
        this.deviceTypeName = treeNode.name;
        // this.editform.belongSystem=treeNode.realId;
      }
      this.ranks = treeNode.ranks;
      this.loadTable();
    },
    // 树节点右击
    onRightClick(event, treeId, treeNode) {
      if (
        !treeNode &&
        event.target.tagName.toLowerCase() != "button" &&
        $(event.target).parents("a").length == 0
      ) {
        this.resTree.cancelSelectedNode();
        this.showRMenu("root", event.clientX, event.clientY);
      } else if (treeNode && !treeNode.noR) {
        this.resTree.selectNode(treeNode);
        this.showRMenu("root", event.clientX, event.clientY);
      }
      if (treeNode.ranks == 4) {
        if (
          !treeNode &&
          event.target.tagName.toLowerCase() != "button" &&
          $(event.target).parents("a").length == 0
        ) {
          this.resTree.cancelSelectedNode();
          this.showRMenu("node", event.clientX, event.clientY);
        } else if (treeNode && !treeNode.noR) {
          this.resTree.selectNode(treeNode);
          this.showRMenu("node", event.clientX, event.clientY);
        }
      }
      this.rightClickNode = treeNode;
    },
    // 显示菜单
    showRMenu(type, x, y) {
      $("#rMenu ul").show();
      if (type == "root") {
        $("#m_del").show();
        $("#m_check").show();
        $("#m_unCheck").show();
      } else {
        $("#m_del").show();
        $("#m_check").hide();
        $("#m_unCheck").show();
      }

      y += this.$root.$children[0].$children[0].$refs.contentBox.scrollTop;
      x += this.$root.$children[0].$children[0].$refs.contentBox.scrollLeft;
      this.rMenu.css({
        top: y - 50 + "px",
        left: x - 200 + "px",
        visibility: "visible"
      });

      $("body").bind("mousedown", this.onBodyMouseDown);
    },
    // 隐藏菜单
    hideRMenu() {
      if (this.rMenu)
        this.rMenu.css({
          visibility: "hidden"
        });
      $("body").unbind("mousedown", this.onBodyMouseDown);
    },
    editClose() {
      this.deviceCodeShow = false;
      this.editTableVisible = false;
      this.editform = {};
    },
    onBodyMouseDown(event) {
      if (
        !(
          event.target.id == "rMenu" ||
          $(event.target).parents("#rMenu").length > 0
        )
      ) {
        this.rMenu.css({
          visibility: "hidden"
        });
      }
    },
    initServerType(){
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
    }
  }
};
</script>

<style scoped>
div#rMenu {
  position: absolute;
  visibility: hidden;
  top: 0;
  background-color: #555;
  text-align: left;
  padding: 2px;
}

div#rMenu ul li {
  margin: 1px 0;
  padding: 0 5px;
  cursor: pointer;
  list-style: none outside none;
  background-color: #dfdfdf;
}

.iconImg {
  width: 16px;
  margin-top: 6px;
}
</style>
