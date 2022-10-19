
<template>
	<div class="wrap">
		<div class="subContent zr-row ">
			<div class="tableWrap">
                    <el-form :inline="true" :model="searchForm" class="demo-form-inline zr-row-scatter">
                    	<div class="zr-row">
	                        <el-button class="m-l-0" type="primary" @click="add">新增客户</el-button>
	                        <!--<el-button type="primary" @click="loadTable">导入</el-button>-->
	                        <!--<el-button type="primary" @click="loadTable">导出</el-button>-->
                    		<el-button type="primary" @click="handleDelete">批量删除</el-button>
                    	</div>
                        <div class="zr-row">
                        	<el-form-item>
	                            <el-input v-model="searchForm.name" placeholder="客户名称" clearable></el-input>
	                        </el-form-item>
	                        <el-form-item >
		                        <el-input placeholder="关键字" v-model="searchForm.keyword" clearable ></el-input>
		                    </el-form-item>
	                        <el-form-item>
	                            <el-button type="primary" @click="searchTable">搜索</el-button>
	                        </el-form-item>
                        </div>
                    </el-form>
					<el-table ref="table" stripe :data="tableData" style="width: 100%" v-loading ="loading1"
					         element-loading-text="拼命加载中"  element-loading-spinner="el-icon-loading"   element-loading-background="rbg(0,0,0,0.8)"  @selection-change="handleSelectionChange">
						<el-table-column type="selection"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" type="index" label="序号" align="center"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="name" label="客户名称" align="center">
	                        <template slot-scope="scope">
	                            <el-button type="text" size="smart" @click="lookDetail(scope.$index, scope.row)">{{scope.row.name}}</el-button>
	                        </template>
	                    </el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="contacts" label="联系人" align="center"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="idCard" label="身份证号" align="center"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="phone" label="联系电话" align="center"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="area" label="所属区域" align="center"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" label="操作" width="160" align="center">
							<template slot-scope="scope">
								<el-button type="text" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
								<el-button  type="text" size="mini" disabled v-if="scope.row.flag == 1">
                                        删除
                                    </el-button>
                                    <el-button @click.native.prevent="handleDelete(scope.$index, scope.row)" type="text" size="mini" v-else>
                                        删除
                                    </el-button>
							</template>
						</el-table-column>
					</el-table>
                    <el-pagination  v-if="renovatePagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page=pageNum :page-sizes="[10, 15, 20, 25]" :page-size=pageSize layout="total, sizes, prev, pager, next, jumper" :total="totolNum" >
                    </el-pagination>
			</div>
		</div>
		<!-- 选择房产信息 -->
		<el-dialog   title="所属区域" :visible.sync="houseTreeVisible" @close="close">
			<div v-if="showTree">
				<el-tree :data="houseTreeData" show-checkbox ref="houseTreeData" node-key="id" :default-expanded-keys="checkedKeys" :auto-expand-parent="true" :check-strictly="true" :props="defaultProps">
				</el-tree>
			</div>
			<el-button type="primary" style="float: right" @click="selectHouseSave()">确定</el-button>
			<el-button style="float: right;margin-right: 10px" @click="houseTreeVisible = false">取消</el-button>
		</el-dialog>
		<!-- 编辑客户信息弹出窗 -->
		<el-dialog   :title="dailogTitleType" :visible.sync="editTableVisible" width="900px">
			<el-form :model="household" :rules="houserules" ref="household" label-width="140px">
				<el-row :gutter="20">
					<el-col :span="12">
						客户信息
						<div class="b-1 p-20">
							<el-form-item label="客户名称" prop="name">
								<el-input v-model="household.name" placeholder="客户名称"></el-input>
							</el-form-item>
							<el-form-item label="联系人" prop="contacts">
								<el-input v-model="household.contacts" placeholder="联系人"></el-input>
							</el-form-item>
							<el-form-item label="身份证号" prop="idCard">
								<el-input v-model="household.idCard" placeholder="身份证号"></el-input>
							</el-form-item>
							<el-form-item label="联系电话" prop="phone">
								<el-input type="number" v-model="household.phone" placeholder="联系电话"></el-input>
							</el-form-item>
							<el-form-item label="所属区域" prop="area">
								<el-input v-model="household.area" v-on:click.native="selectHouse"   placeholder="所属区域"></el-input>
							</el-form-item>
						</div>
					</el-col>
					<el-col :span="12">
						开票信息
						<div class="b-1 p-20">
							<el-form-item label="开户银行" prop="openBank">
								<el-input v-model="household.openBank" placeholder="开户银行"></el-input>
							</el-form-item>
							<el-form-item label="银行账号" prop="accountNo">
								<el-input v-model="household.accountNo" maxlength="50" placeholder="银行账号"></el-input>
							</el-form-item>
							<el-form-item label="纳税人识别号">
								<el-input v-model="household.taxNo" maxlength="50" placeholder="纳税人识别号"></el-input>
							</el-form-item>
							<el-form-item label="电话" prop="mobile">
								<el-input v-model="household.mobile" maxlength="50" placeholder="电话"></el-input>
							</el-form-item>
							<el-form-item label="开票地址" prop="billingAddress">
								<el-input v-model="household.billingAddress" placeholder="开票地址"></el-input>
							</el-form-item>
						</div>
					</el-col>
				</el-row>

				<el-row class="m-t-10">
					工商信息
					<div class="b-1 p-20">
						<el-form-item label="统一社会信用代码" prop="unifiedCode">
							<el-input v-model="household.unifiedCode" placeholder="统一社会信用代码"></el-input>
						</el-form-item>
						<el-form-item label="通讯地址" prop="address">
							<el-input v-model="household.address" placeholder="通讯地址"></el-input>
						</el-form-item>
						<el-form-item label="登记机关" prop="registAuth">
							<el-input v-model="household.registAuth" placeholder="登记机关"></el-input>
						</el-form-item>
						<el-form-item label="注册地址" prop="registAddress">
							<el-input v-model="household.registAddress" placeholder="注册地址"></el-input>
						</el-form-item>
						<el-form-item label="经营范围" prop="scopeBusiness">
							<el-input v-model="household.scopeBusiness" placeholder="经营范围"></el-input>
						</el-form-item>
					</div>
				</el-row>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="save('household')">确 定</el-button>
				<el-button @click="editTableVisible = false">取 消</el-button>
			</span>
		</el-dialog>
		<!-- 新增编辑设置费用弹出窗 -->
		<el-dialog   :title="dailogTitleTypeFeiyong" :visible.sync="editTableVisibleFeiyong" width="900px">
			<el-form :model="householdfeiyong" :rules="addSzFeiyongrules" ref="householdfeiyong" label-width="140px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="收费组" prop="chargeZu">
                            <!-- <el-select v-model="householdfeiyong.chargeZu" filterable placeholder="" @blur="handleSelectBlur" style="width: 100%;" >
                                <el-option v-for="item in chargeZuList" :label="item.chargeZu" :key="item.chargeZu" :value="item.chargeZu">
                                </el-option>
                            </el-select> -->
                            <el-select  v-model="householdfeiyong.chargeZu" clearable filterable   allow-create default-first-option  placeholder="请选择收费组">
                                <el-option v-for="item in chargeZuList" :label="item.chargeZu" :key="item.chargeZu" :value="item.chargeZu">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="收费项" prop="feeType">
                            <el-select v-model="householdfeiyong.feeType" clearable filterable   allow-create default-first-option  placeholder="请选择收费项" style="width: 100%;" >
                                <el-option v-for="item in feeTypeList" :label="item.feeType" :key="item.feeType" :value="item.feeType">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="开始计算时间" prop="startTime">
                            <el-date-picker v-model="householdfeiyong.startTime" :picker-options="dailogTitleTypeFeiyong==='新增费用信息'?pickerOptionsAdd:pickerOptionsEdit" type="date" format="yyyy-MM-dd" value-format="timestamp"  placeholder="选择日期"> </el-date-picker>
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="截止计算时间" prop="endTime">
                            <el-date-picker v-model="householdfeiyong.endTime" type="date"  format="yyyy-MM-dd"  value-format="timestamp" placeholder="选择日期"> </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="收费周期" prop="billingCycle">
                            <el-select v-model="householdfeiyong.billingCycle" @change="billingCycleChange" style="width: 100%;" >
                                <!--<el-option v-for="item in billingCycleList" :label="item.label" :key="item.value" :value="item.value">
                                </el-option>-->
                                <el-option label="年" value="年"></el-option>
                                <el-option label="月" value="月"></el-option>
                                <el-option label="季" value="季"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="预计结算时间" prop="startTime">
                            <!-- <el-input v-model="householdfeiyong.settlementTime" ></el-input> -->
                            <el-date-picker v-model="householdfeiyong.startTime" type="date" format="yyyy-MM-dd" value-format="timestamp" disabled=""> </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="费用(元)" prop="amount">
                            <el-input v-model="householdfeiyong.amount" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="备注" >
                            <el-input v-model="householdfeiyong.costBz" ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="saveFeiyong('householdfeiyong')" :disabled="isSuccess">确 定</el-button>
				<el-button @click="editTableVisibleFeiyong = false">取 消</el-button>
			</span>
		</el-dialog>
		<!--删除提示框-->
		<el-dialog   title="提示" :visible.sync="deleteVisible" width="30%">
			<span>确定删除？</span>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="deleteRow()">确 定</el-button>
				<el-button @click="deleteVisible = false">取 消</el-button>
			</span>
		</el-dialog>
		<!--删除费用提示框-->
		<el-dialog   title="提示" :visible.sync="deleteVisibleFeiyong" width="30%">
			<span>确定删除？</span>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="deleteRowFeiyong()">确 定</el-button>
				<el-button @click="deleteVisibleFeiyong = false">取 消</el-button>
			</span>
		</el-dialog>
		<el-dialog   title="提示" :visible.sync="deleteVisible2" width="30%">
			<span>确定删除？</span>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="deleteRow2()">确 定</el-button>
				<el-button @click="deleteVisible2 = false">取 消</el-button>
			</span>
		</el-dialog>
		<!-- 查看详情-->
		<el-dialog   title="详情" :visible.sync="detailVisible" width="1100px" :before-close="closeDetail">
			<el-tabs type="border-card" v-model="tabSelected">
				<el-tab-pane label="客户信息" name="first">
					<el-form :model="household" :rules="houserules" ref="household" label-width="140px">
						<el-row :gutter="20">
							<el-col :span="12">
								客户信息
								<div class="b-1 p-20">
									<el-form-item label="客户名称" prop="name">
										<el-input v-model="household.name" placeholder="客户名称" disabled></el-input>
									</el-form-item>
									<el-form-item label="联系人" prop="contacts">
										<el-input v-model="household.contacts" placeholder="联系人" disabled></el-input>
									</el-form-item>
									<el-form-item label="身份证号" prop="idCard">
										<el-input v-model="household.idCard" placeholder="身份证号" disabled></el-input>
									</el-form-item>
									<el-form-item label="联系电话" prop="phone">
										<el-input type="number" v-model="household.phone" placeholder="联系电话" disabled></el-input>
									</el-form-item>
									<el-form-item label="所属区域" prop="area">
										<el-input v-model="household.area" :title="household.area"  disabled  placeholder="所属区域"></el-input>
									</el-form-item>
								</div>
							</el-col>
							<el-col :span="12">
								开票信息
								<div class="b-1 p-20">
									<el-form-item label="开户银行">
										<el-input v-model="household.openBank" placeholder="开户银行" disabled></el-input>
									</el-form-item>
									<el-form-item label="银行账号">
										<el-input v-model="household.accountNo" placeholder="银行账号" disabled></el-input>
									</el-form-item>
									<el-form-item label="纳税人识别号">
										<el-input v-model="household.taxNo" placeholder="纳税人识别号" disabled></el-input>
									</el-form-item>
									<el-form-item label="电话">
										<el-input v-model="household.mobile" placeholder="电话" disabled></el-input>
									</el-form-item>
									<el-form-item label="开票地址">
										<el-input v-model="household.billingAddress" placeholder="开票地址" disabled></el-input>
									</el-form-item>
								</div>
							</el-col>
						</el-row>

						<el-row class="m-t-10">
							工商信息
							<div class="b-1 p-20">
								<el-form-item label="统一社会信用代码">
									<el-input v-model="household.unifiedCode" disabled  placeholder="统一社会信用代码"></el-input>
								</el-form-item>
								<el-form-item label="通讯地址">
									<el-input v-model="household.address" disabled  placeholder="通讯地址"></el-input>
								</el-form-item>
								<el-form-item label="登记机关">
									<el-input v-model="household.registAuth" disabled  placeholder="登记机关"></el-input>
								</el-form-item>
								<el-form-item label="注册地址">
									<el-input v-model="household.registAddress" disabled  placeholder="注册地址"></el-input>
								</el-form-item>
								<el-form-item label="经营范围">
									<el-input v-model="household.scopeBusiness" disabled  placeholder="经营范围"></el-input>
								</el-form-item>
							</div>
						</el-row>
					</el-form>
				</el-tab-pane>
				<el-tab-pane label="员工信息" name="second" id="second">
					<el-form :inline="true" :model="searchForm" class="demo-form-inline zr-row-scatter">
                    	<!-- <div class="zr-row">
	                        <el-button class="m-l-0" type="primary" @click="add">新增员工</el-button>
                    		<el-button type="primary" @click="handleDelete">复制新增</el-button>
                    	</div> -->
                        <div class="zr-row zr_justify-end">
							<el-input v-model="kw" placeholder="关键字" clearable style="width:200px;"></el-input>
							<el-button type="primary" @click="searchTable2()" plain><i class="el-icon-search"></i>搜索</el-button>
						</div>
                    </el-form>
					<el-table ref="table" stripe :data="tableData2" class="m-t-20" v-if="showSecondTable">
						<el-table-column type="selection"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" type="index" label="序号" align="center"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="name" label="姓名" align="center"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="company" label="工作单位" align="center"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="department" label="所在部门" align="center"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="post" label="职务" align="center"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="sex" label="性别" align="center"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="mobile" label="联系方式" align="center"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="job" label="是否在职" align="center"></el-table-column>
						<!-- <el-table-column :show-overflow-tooltip="true" label="操作" width="160">
							<template slot-scope="scope">
								<el-button type="text" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
								<el-button  type="text" size="mini" disabled v-if="scope.row.flag == 1">
                                        删除
                                    </el-button>
                                    <el-button @click.native.prevent="handleDelete(scope.$index, scope.row)" type="text" size="mini" v-else>
                                        删除
                                    </el-button>
							</template>
						</el-table-column> -->
					</el-table>
					<div class="block" style="text-align: center;margin-top: 15px;">
						<el-pagination  v-if="renovatePagination2" @current-change="handleCurrentChange2" :current-page.sync="current" :page-size="pageSize2" layout="total, prev, pager, next" :total="totolNum2">
						</el-pagination>
					</div>
				</el-tab-pane>
				<el-tab-pane label="设置费用" name="forth" id="forth">
					<el-form :inline="true" :model="searchForm" class="demo-form-inline zr-row-scatter">
                    	<div class="zr-row">
	                        <el-button type="primary" @click="addFeiyong">添加</el-button>
                    		<el-button type="primary" @click="handleDeleteFeiyong">批量删除</el-button>
                    	</div>
                    </el-form>
					<el-table ref="table" stripe :data="tableDataFeiyong" class="m-t-20" v-if="showSecondTable" @selection-change="handleSelectionChangeFeiyong">
						<el-table-column type="selection"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" type="index" label="序号" align="center"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="chargeZu" label="收费组" align="center"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="feeType" label="收费项" align="center"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="amount" label="费用" align="center"></el-table-column>
						<!-- <el-table-column :show-overflow-tooltip="true" prop="costBz" label="备注"></el-table-column> -->
						<el-table-column :show-overflow-tooltip="true" prop="startTime" label="开始计算时间" :formatter="startTimeFormatter" align="center"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="endTime" label="截止计算时间" :formatter="endTimeFormatter" align="center"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="billingCycle" label="收费周期" align="center"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="startTime" label="预计结算时间" align="center" :formatter="startTimeFormatter"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" label="操作" width="160" align="center">
							<template slot-scope="scope">
								<el-button type="text" size="mini" @click="handleEditFeiyong(scope.$index, scope.row)">编辑</el-button>
								<el-button  type="text" size="mini" disabled v-if="scope.row.flag == 1">
                                        删除
                                    </el-button>
                                    <el-button @click.native.prevent="handleDeleteFeiyong(scope.$index, scope.row)" type="text" size="mini" v-else>
                                        删除
                                    </el-button>
							</template>
						</el-table-column>
					</el-table>
					<div class="block" style="text-align: center;margin-top: 15px;">
						<el-pagination  v-if="renovatePaginationFeiyong" @current-change="handleCurrentChangeFeiyong" :current-page.sync="pageNumFeiyong" @size-change="handleSizeChangeFeiyong" :page-size="pageSizeFeiyong" layout="total, prev, pager, next" :total="totolNumFeiyong">
						</el-pagination>
					</div>
				</el-tab-pane>
			</el-tabs>
		</el-dialog>
	</div>
</template>
<script>
    import { api, dict, axiosHttp, util, filter } from '@/libs'
    import Vue from 'vue'
	import { formatDate } from '../../../static/js/date.js'
	export default {
		data: function() {
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
			var checkCard = (rule, value, callback) => {
				if(!value) {
					return callback(new Error("身份证号不能为空"));
				} else {
					const reg = /(^\d{15}&)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
					if(reg.test(value)) {
						callback();
					} else {
						return callback(new Error("请输入正确身份证号！"));
					}
				}
			};
			var checkNumber = (rule, value, callback) => {
				if(!value) {
					callback();
				} else {
					const reg = /^[0-9]*$/
					if(reg.test(value)) {
						callback();
					} else {
						return callback(new Error("只能输入数字！"));
					}
				}
			};
            var checkSfNumber = (rule, value, callback) => {
				if(!value) {
					return callback(new Error("费用不能为空"));
				} else {
					const reg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/
					if(reg.test(value)) {
						callback();
					} else {
						return callback(new Error("只能输入大于0的数,小数保留两位！"));
					}
				}
			};
            var  dateTimeData = _ => {
                    var date=new Date;
                    var year=date.getFullYear();
                    var month=date.getMonth()+1;
                    var day=date.getDate();
                    var template = ''
                    function isRunYear(fullYear){
                        return (fullYear % 4 == 0 && (fullYear % 100 != 0 || fullYear % 400 == 0));
                    }
                    switch (month){
                        case 1:
                        case 3:
                        case 5:
                        case 7:
                        case 8:
                        case 10:
                        case 12:
                            return template = 31 - day;
                        case 4:
                        case 6:
                        case 9:
                        case 11:
                            return template = 30 - day;
                        case 2:
                            if(isRunYear(year)){
                                return template = 29 - day;
                            }else{
                                return template = 28 - day;
                            }

                    }

                };
			return {
				loading:false,
				//刷新分页
				renovatePagination: true,
				//刷新分页
				renovatePagination2: true,
				renovatePaginationFeiyong: true,
				pageSize: 15,
				pageNum: 1,
				totolNum: 100,
				tableData: [],
				pageSize2: 10,
				pageNum2: 1,
				pageNumFeiyong: 1,
				pageSizeFeiyong:10,
				totolNum2: 100,
				totolNumFeiyong:100,
				tableData2: [],
				tableDataFeiyong:[],
				tableData3: [],
				pageSize3: 15,
				pageNum3: 1,
				totolNum3: 100,
				kw3:"",
				tenant: [],
				household: {},
				householdfeiyong: {},
				current: 1,
				form: {},
				showTree: true,
				//houseTree:[],
				//详情的tab切换
				tabSelected: 'first',
				//员工信息table刷新
				showSecondTable: false,
				kw: '',
				moveid: '',
                sfZqValue:'',
                pickerOptionsAdd: {
                    disabledDate(time) {
                        return time.getTime() < (Date.now()- 3600 * 1000 * 24)
                    }
                },
                pickerOptionsEdit: {
                    disabledDate(time) {
                        return time.getTime() < (Date.now() + 3600 * 1000 * 24 * dateTimeData())

                    }
                },
				houserules: {
					name: [{
							required: true,
							message: '请输入客户名称',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 30,
							message: '长度大于 30 个字符',
							trigger: 'blur'
						}
					],
					contacts: [{
							required: true,
							message: '请输入联系人',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 10,
							message: '长度大于 10 个字符',
							trigger: 'blur'
						}
					],
					phone: [{
						required: true,
						validator: checkphone,
						trigger: 'blur'
					}],
					idCard: [{
						required: true,
						validator: checkCard,
						trigger: 'blur'
					}],
					area: [{
						required: true,
						message: "请选择所属区域",
						trigger: 'blur'
					},{
						required: true,
						message: "请选择所属区域",
						trigger: 'change'
					}],
					openBank: [
                        {
                            max: 20,
                            message: '开户银行长度不能大于 20 个字符',
                            trigger: 'blur'
                        }
                    ],
                    billingAddress: [
                        {
                            max: 50,
                            message: '开票地址长度不能大于 50 个字符',
                            trigger: 'blur'
                        }
                    ],
                    unifiedCode: [
                        {
                            max: 20,
                            message: '统一社会信用代码长度不能大于 20个字符',
                            trigger: 'blur'
                        }
                    ],
                    address: [
                        {
                            max: 50,
                            message: '通信地址长度不能大于 50个字符',
                            trigger: 'blur'
                        }
                    ],
					registAuth: [
                        {
                            max: 20,
                            message: '登记机关长度不能大于 20个字符',
                            trigger: 'blur'
                        }
                    ],
                    registAddress: [
                        {
                            max: 50,
                            message: '注册地址长度不能大于 50个字符',
                            trigger: 'blur'
                        }
                    ],
                    scopeBusiness: [
                        {
                            max: 100,
                            message: '经营范围长度不能大于 100个字符',
                            trigger: 'blur'
                        }
                    ],
                    accountNo: [
                        {
                            validator: checkNumber,
							trigger: 'blur'
                        }
                    ],
                    mobile: [
                        {
                            validator: checkNumber,
							trigger: 'blur'
                        }
                    ]
				},
				housefeiyongrules: {
					name: [{
							required: true,
							message: '请输入客户名称',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 30,
							message: '长度大于 30 个字符',
							trigger: 'blur'
						}
					],
					contacts: [{
							required: true,
							message: '请输入联系人',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 10,
							message: '长度大于 10 个字符',
							trigger: 'blur'
						}
					],
					phone: [{
						required: true,
						validator: checkphone,
						trigger: 'blur'
					}],
					idCard: [{
						required: true,
						validator: checkCard,
						trigger: 'blur'
					}],
					area: [{
						required: true,
						message: "请选择所属区域",
						trigger: 'blur'
					},{
						required: true,
						message: "请选择所属区域",
						trigger: 'change'
					}],
					openBank: [
                        {
                            max: 20,
                            message: '开户银行长度不能大于 20 个字符',
                            trigger: 'blur'
                        }
                    ],
                    billingAddress: [
                        {
                            max: 50,
                            message: '开票地址长度不能大于 50 个字符',
                            trigger: 'blur'
                        }
                    ],
                    unifiedCode: [
                        {
                            max: 20,
                            message: '统一社会信用代码长度不能大于 20个字符',
                            trigger: 'blur'
                        }
                    ],
                    address: [
                        {
                            max: 50,
                            message: '通信地址长度不能大于 50个字符',
                            trigger: 'blur'
                        }
                    ],
					registAuth: [
                        {
                            max: 20,
                            message: '登记机关长度不能大于 20个字符',
                            trigger: 'blur'
                        }
                    ],
                    registAddress: [
                        {
                            max: 50,
                            message: '注册地址长度不能大于 50个字符',
                            trigger: 'blur'
                        }
                    ],
                    scopeBusiness: [
                        {
                            max: 100,
                            message: '经营范围长度不能大于 100个字符',
                            trigger: 'blur'
                        }
                    ],
                    accountNo: [
                        {
                            validator: checkNumber,
							trigger: 'blur'
                        }
                    ],
                    mobile: [
                        {
                            validator: checkNumber,
							trigger: 'blur'
                        }
                    ],
				},
                addSzFeiyongrules:{
                   chargeZu: [{
						required: true,
						message: "请选择收费组",
						trigger: 'change'
					}],
                   feeType: [{
						required: true,
						message: "请选择收费项",
						trigger: 'blur'
					},{
						required: true,
						message: "请选择收费项",
						trigger: 'change'
					}],
                   startTime: [{
						required: true,
						message: "请选择开始时间",
						trigger: 'change'
					}],
                   endTime: [{
						required: true,
						message: "请选择截止时间",
						trigger: 'change'
					}],
                   billingCycle: [{
						required: true,
						message: "请选择收费周期",
						trigger: 'change'
					}],
                   settlementTime: [{
						required: true,
                        message: "请填写预计结算时间",
						trigger: 'blur'
					}],
                   amount: [{
						required: true,
						validator: checkSfNumber,
						trigger: 'blur'
					}]
                },
				editTableVisible: false,
				//是否显示费用设置详情
				editTableVisibleFeiyong:false,
				deleteVisible: false,
				deleteVisibleFeiyong:false,
				deleteVisible2: false,
				detailVisible: false,
				chargeZu:'',
				chargeZuList:[],
				feeType:'',
				feeTypeList:[],
				billingCycle:'',
				billingCycleList:[],
				cpnId: '',
                AreaId:'',
                isSuccess: false,
                oldStartTime:'',
				worker: [],
				deleteIds: '',
				deleteFlag:true,
				deleteIdsFeiyong: '',
				deleteFlagFeiyong:true,
				deleteIds2: '',
				dailogTitleType:'',
				dailogTitleTypeFeiyong:'',
				checkedArr: [],
				checkedArrFeiyong: [],
				checkedArr2: [],
				houseTreeVisible: false,
				houseTreeData: [],
				checkedKeys: [],
				defaultProps: {
					children: 'children',
					label: 'label'
				},
                searchForm: {},
                isOwner: false,
                isTenant: false,
                politicalStatus: [],
                settlementTime:'',
                checkinRules: {
                    houseName: [
                        {
                            required: true,
                            message: '请选择房间',
                            trigger: 'change'
                        }
                    ],
                    checkinTime: [
                        {
                            required: true,
                            message: '请选择迁入时间',
                            trigger: 'blur'
                        }
                    ],
                }
			}
		},
		created() {
			this.loadTable();
			this.loadhouseTree();
            this.$http('post', '/system/user/dict/findListByType', {
                typekey: "politicalStatus",
            }).then(res => {
                this.politicalStatus = res.data.body;
            });
		},
		watch: {
			editTableVisible(val){
				!val&&setTimeout(() => {
					this.$refs['household'].resetFields();
				},0);
			},
            houseTreeVisible(val){
                !val&&setTimeout(() => {
                    if(this.showTree) this.$refs.houseTreeData.setCheckedKeys([]);
				},0);
			},
		},
		methods: {
            //开始时间格式化
            startTimeFormatter(row, column, cellValue) {
                if (row.startTime != null) {
                    return Vue.filter('dateFormat')(row.startTime, 'yyyy-MM-dd')
                }
            },
            //截止时间格式化
            endTimeFormatter(row, column, cellValue) {
                if (row.endTime != null) {
                    return Vue.filter('dateFormat')(row.endTime, 'yyyy-MM-dd')
                }
            },
            billingCycleChange(val){
               this.sfZqValue = val;
            },
            changeOwner() {
                if (this.household.customerIdentity == '租户') {
                    this.isTenant = true;
                    this.isOwner = false;
                } else if (this.household.customerIdentity == '业主') {
                    this.isTenant = false;
                    this.isOwner = true;
                }
			},
			close() {
				this.showTree = false
			},
			//关闭详情弹框
			closeDetail() {
				this.detailVisible = false
				this.showSecondTable = false
			},
			loadTable() {
				this.loading1=true;
				this.$http('post', '/manage/customerInfo/find', {
					name: this.searchForm.name,
                    keyword: this.searchForm.keyword,
					page: this.pageNum,
					size: this.pageSize
				}).then(res => {
					this.loading1 = false;
					this.tableData = res.data.body.content;
					this.totolNum = Number(res.data.body.totalElements)
				})
			},
			loadhouseTree() {
				this.$httpPost('/manage/houseProperty/tree').then(res => {
					let data = res.data.body;
					if(data!=null) {
                        for (let i = 0; i < data.length; i++) {
                            data[i]['disabled'] = true;
                            if (data[i].children != null) {
                                for (let j = 0; j < data[i].children.length; j++) {
                                    data[i].children[j]['disabled'] = true;
                                    if (data[i].children[j].children != null) {
                                        for (let k = 0; k < data[i].children[j].children.length; k++) {
                							data[i].children[j].children[k]['disabled'] = true;
                                        }
                                    }
                                }
                            }
                        }
                    }
					this.houseTreeData = data;
					console.log(this.houseTreeData)
				}, function(response) {

				});
			},
			searchTable() {
				this.pageNum = 1;
				this.renovatePagination = false;
				this.$http('post', '/manage/customerInfo/find', {
					name: this.searchForm.name,
                    keyword: this.searchForm.keyword,
					page: this.pageNum,
					size: this.pageSize
				}).then(res => {
					this.tableData = res.data.body.content;
					this.totolNum = Number(res.data.body.totalElements)
					this.renovatePagination = true
				})
			},
			reloadForm(id, isSave) {
				this.$httpGet('get', '/manage/customerInfo/findEntityById', {
					id: id
				}).then(res => {
                    console.log(res)
					this.household = res.data.body;
					let areaId = this.household.areaId;
					this.$httpGet('get', '/manage/houseProperty/findAreaNameByIds', {
						id: areaId
					}).then(res => {
						this.household .area = res.data.body.areaName;
					});
                    this.changeOwner();
					if(isSave == true) {
						this.household.id = '';
					}
				});
			},
			reloadFormFeiyong(id, isSave) {
				this.$http('post', '/manage/meterDetail/get', {
					id: id
				}).then(res => {
                    console.log(res)
					this.householdfeiyong = res.data.body;
					let areaId = this.householdfeiyong.areaId;
					/*this.$httpGet('get', '/manage/houseProperty/findAreaNameByIds', {
						id: areaId
					}).then(res => {
						this.householdfeiyong .area = res.data.body.areaName;
					});
                    this.changeOwner();*/
					if(isSave == true) {
						this.householdfeiyong.id = '';
					}
				});
			},
			handleEdit(index, row) {
				this.reloadForm(row.id, false);
				this.dailogTitleType ="编辑";
				this.editTableVisible = true;
			},
			handleEditFeiyong(index, row) {
				this.reloadFormFeiyong (row.id, false);
				this.dailogTitleTypeFeiyong ="编辑";
                this.oldStartTime = row.startTime;
				this.editTableVisibleFeiyong  = true;
			},
			lookDetail(index, row) {
				this.tabSelected = 'first'//默认显示第一个tab
				this.reloadForm(row.id, false);//客户信息
				this.cpnId = row.id;
                this.AreaId = row.id;
				this.loadTable2(row.id);//员工信息列表
				this.loadTableFeiyong(row.id);//设置费用列表
				this.loadTable3();
				this.showSecondTable = true
				this.kw = ''//关键字
			},
            //详情---员工信息 列表数据
			loadTable2(ownerId) {
				this.$http('post', '/manage/peopleInfo/find', {
					customerInfoId: ownerId,
					keyword: this.kw,
					page: this.pageNum2,
					size: this.pageSize2,
				}).then(res => {
					this.detailVisible = true;
					this.tableData2 = res.data.body.content;
					this.totolNum2 = Number(res.data.body.totalElements);
				});
			},
            //详情---设置费用 列表数据
			loadTableFeiyong(ownerId) {
				this.$http('post', '/manage/meterDetail/getSheZhiList', {
					areaId: ownerId,
					//keyword: this.kw,
					page: this.pageNumFeiyong,
					size: this.pageSizeFeiyong,
				}).then(res => {
                    console.log(res)
					this.detailVisible = true;
					this.tableDataFeiyong = res.data.body.content;
					this.totolNumFeiyong = Number(res.data.body.totalElements);
                    this.renovatePaginationFeiyong = true
				});
			},
			loadTable3() {
				this.$http('post', '/manage/customerCheckin/findEntity', {
					customerId: this.cpnId,
				}).then(res => {
					if(res.data.body == null){
						this.tableData3 = [];
                        this.totolNum3 = 0;
					}else{
						this.loadTable4(res.data.body.houseId);
					}

				});
			},
			loadTable4(ownerId) {
				this.$http('post', '/manage/houseProperty/findPageByIds', {
					ids: ownerId,
					page: this.pageNum3,
					size: this.pageSize3,
				}).then(res => {
					this.detailVisible = true;
					this.tableData3 = res.data.body.content;
					this.totolNum3 = Number(res.data.body.totalElements);
				});
			},
			add() {
				this.household = {};
                this.isTenant = false;
                this.isOwner = false;
                //this.editTableVisible.title = "新增客户";
				this.dailogTitleType ="新增客户";
				this.checkedKeys = []
				this.showTree = true
				this.editTableVisible = true;
				this.$forceUpdate()
				console.log(this.checkedKeys)
			},
			addFeiyong() {
				this.householdfeiyong = {};
				this.dailogTitleTypeFeiyong ="新增费用信息";
				this.editTableVisibleFeiyong = true;
				this.$http('post', '/manage/meterDetail/getShouFeiZu', {types:0}).then(res => {
					this.chargeZuList = res.data.body;
	            })
				this.$http('post', '/manage/meterDetail/getShouFeiZu', {types:1}).then(res => {
					this.feeTypeList = res.data.body;
	            })
				this.$forceUpdate();
				console.log(this.checkedKeys)
			},
			handleDelete(index, row) {
                if(row) {
                    this.deleteIds = row.id;
                    this.deleteVisible = true;
                } else {
                    if (this.$refs.table.store.states.selection.length > 0) {
                    	if(!this.deleteFlag){
                    		this.$message.error('物业公司不可删除');
                    		return;
                    	}else{
                    		this.deleteVisible = true;
                    	}
                    } else {
                        this.$message.error('请至少选择一条数据');
                    }
                }
			},
			handleDeleteFeiyong(index, row) {
                if(row) {
                    this.deleteIdsFeiyong = row.id;
                    this.deleteVisibleFeiyong = true;
                } else {
                	console.log(this.$refs)
                    if (this.$refs.table.store.states.selection.length > 0) {
                    	this.deleteVisibleFeiyong = true;
                    } else {
                        this.$message.error('请至少选择一条数据');
                    }
                }
			},
			deleteRow() {
				this.$httpGet('get', '/manage/customerInfo/del', {
					id: this.deleteIds
				}).then(res => {
					this.deleteVisible = false;
					this.loadTable()
				})
			},
			deleteRowFeiyong() {
				this.$http('post', '/manage/meterDetail/delete', {
					id: this.deleteIdsFeiyong
				}).then(res => {
					this.deleteVisibleFeiyong = false;
					this.loadTableFeiyong(this.AreaId)
				})
			},
			save(formrule) {
				this.$refs[formrule].validate((valid) => {
					if(valid) {
						this.$http('post', '/manage/customerInfo/saveorupdate', {
							address: this.household.address,
							id: this.household.id,
							idCard: this.household.idCard,
							name: this.household.name,
							phone: this.household.phone,
							contacts: this.household.contacts,
							area: this.household.area,
							areaId: this.household.areaId,
							openBank: this.household.openBank,
							accountNo: this.household.accountNo,
							taxNo: this.household.taxNo,
							mobile: this.household.mobile,
							billingAddress: this.household.billingAddress,
							unifiedCode: this.household.unifiedCode,
							registAuth: this.household.registAuth,
							registAddress: this.household.registAddress,
							scopeBusiness: this.household.scopeBusiness,
							flag:this.household.flag,
						}).then(res => {
						    if (res.data.code == 0) {
                                this.editTableVisible = false;
                                this.loadTable();
                            } else if (res.data.code == 1) {
                            }
						},error => {
						})
					} else {
						return false;
					}
				});
			},
			saveFeiyong(formrule) {
				this.$refs[formrule].validate((valid) => {
					if(valid) {
                        if(this.householdfeiyong.startTime < this.householdfeiyong.endTime) {
                            let settlementDate = Vue.filter('dateFormat')(this.householdfeiyong.startTime, 'yyyy-MM-dd')
                            if(this.sfZqValue === '年'){
                                this.settlementTime =settlementDate.substring(0,7);
                                console.log(this.settlementTime)
                            }else if(this.sfZqValue === '季' ||this.sfZqValue === '月'){
                                this.settlementTime = settlementDate.slice(-2);
                                console.log(this.settlementTime)
                            }
                            let startTime = "",endTime="";
                            startTime = formatDate(new Date(Number(this.householdfeiyong.startTime)), "yyyy-MM-dd");
                            endTime = formatDate(new Date(Number(this.householdfeiyong.endTime)), "yyyy-MM-dd");
                            if(this.oldStartTime && this.oldStartTime == this.householdfeiyong.startTime){
                                this.$message.warning('请修改开始日期')
                                return
                            }
                            this.$http('post', '/manage/meterDetail/save', {
                                id:this.householdfeiyong.id,
                                areaId:this.AreaId,
                                chargeZu: this.householdfeiyong.chargeZu,
                                feeType: this.householdfeiyong.feeType,
                                startTime: startTime,
                                endTime: endTime,
                                billingCycle: this.householdfeiyong.billingCycle,
                                settlementTime: this.settlementTime,
                                amount: this.householdfeiyong.amount,
                                costBz: this.householdfeiyong.costBz
                            }).then(res => {
                                if (res.data.code == 0) {
                                    this.editTableVisibleFeiyong = false;
                                    this.loadTableFeiyong(this.AreaId);//设置费用列表
                                    this.$refs.householdfeiyong.resetFields();

                                } else if (res.data.code == 1) {
                                }
                            },error => {

                            })
                        }else{
                            this.$message.warning('结束日期不能早于开始日期')

                        }
					} else {
						return false;
					}
				});
			},
			handleSizeChange(val) {
				this.pageSize = val;
				this.loadTable();
			},
			handleCurrentChange(val) {
				this.pageNum = val;
				this.loadTable();
			},
			handleCurrentChange2(val) {
				this.pageNum2 = val;
				this.loadTable2(this.cpnId);
			},
            handleSizeChangeFeiyong(val) {
                this.pageSizeFeiyong = val;
                this.loadTableFeiyong(this.cpnId);
            },
			handleCurrentChangeFeiyong(val) {
				this.pageNumFeiyong = val;
				this.loadTableFeiyong(this.cpnId);
			},
			handleSelectionChange(val) {
				console.log(val)
				this.checkedArr = val;
				let idsArr = []
				let flag = "";
				for(var i = 0; i < val.length; i++) {
					if(val[i].flag=="1"){
						flag+=val[i].flag;
					}
					idsArr.push(val[i].id)
				}
				if(flag!=""){
					this.deleteFlag = false;
				}else{
					this.deleteFlag = true;
				}
				this.deleteIds = idsArr.join(',')
			},
			handleSelectionChangeFeiyong(val) {
				console.log(val)
				this.checkedArrFeiyong = val;
				let idsArr = []
				//let flag = "";
				for(var i = 0; i < val.length; i++) {
					/*if(val[i].flag=="1"){
						flag+=val[i].flag;
					}*/
					idsArr.push(val[i].id)
				}
				/*if(flag!=""){
					this.deleteFlagFeiyong = false;
				}else{
					this.deleteFlagFeiyong = true;
				}*/
				this.deleteIdsFeiyong = idsArr.join(',')
			},
			selectHouse() {
				this.houseTreeVisible = true;
				this.showTree = true
				this.$nextTick(() => {
					if(this.household.areaId&&this.household.areaId.length>0){
						let areaId = this.household.areaId.split(",");
						this.$refs.houseTreeData.setCheckedKeys([])
						for(let i = 0; i < areaId.length; i++) {
							this.$refs.houseTreeData.setChecked(areaId[i], true);
							this.checkedKeys.push(areaId[i])
							//this.$refs.houseTreeData.checkedKeys=
							//this.$refs.houseTreeData.store.nodesMap[areaids[i]].expanded = true;
						}
					}
				});
			},
			selectHouseSave() {
				let areaId = this.$refs.houseTreeData.getCheckedKeys().toString();
				this.household.areaId = areaId;
				var houseName = '';
				this.$httpGet('get', '/manage/houseProperty/findAreaNameByIds', {
					id: areaId
				}).then(res => {
					this.household.area = res.data.body.areaName;
					this.houseTreeVisible = false;
				});

				/*var checkedNodes = this.$refs.houseTreeData.getCheckedNodes();
				if (checkedNodes != null && checkedNodes.length > 0) {
                    for (var i = 0; i < checkedNodes.length; i++) {
                        if (i != 0) {
                            houseName += ',';
                        }
                        houseName += checkedNodes[i].label;
                    }
                }
                this.household.areas = houseName;*/
			},
			searchTable2() {
				this.pageNum2 = 1;
				this.renovatePagination2 = false;
				this.$http('post', '/manage/peopleInfo/find', {
					keyword: this.kw,
					customerInfoId: this.cpnId,
					page: this.pageNum2,
					size: this.pageSize2,
				}).then(res => {
					this.detailVisible = true;
					this.tableData2 = res.data.body.content;
					this.totolNum2 = Number(res.data.body.totalElements);
					this.renovatePagination2 = true
				});
			},
			//时间格式化
			dateFormat(row, column, cellValue) {
				if(cellValue == null) {
					return "";
				} else {
					let date = new Date(parseInt(cellValue));
					return formatDate(date, "yyyy-MM-dd");
				}
			}

		}
	}
</script>

<style  lang="less">
	.table_content {
		height: 100%;
		margin: 20px;
		top: 0;
		bottom: 0;
		right: 0;
	}

    .el-dialog__headerbtn .el-dialog__close {
        color: #fff !important;
    }
</style>
