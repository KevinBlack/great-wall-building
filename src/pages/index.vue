<template>
	<div id="indexPage" ref="indexPage" class="wrap p-10" style="box-sizing: border-box;">
		<div v-if="!isYz" class="w-100" ref="content">
			<el-row class="w-100" style="min-height:415px;" :style="{height:heightStyle + 'px'}">
				<!-- <el-col :span="12" class="mk-content">
					<div class="title-ct">
						<h3 style="padding: 10px;">我的待办<router-link to="/workbench/work" style="color: #333;"><span style="float: right;margin-right: 10px; ">更多<i style="vertical-align: text-bottom;" class="icon iconfont icon-chakangengduo-"></i></span></router-link></h3>
						<div class="hr"></div>
						<div v-for="(title, index) in titles" class="zr-column-center" :style="{height:((heightStyle - 20 - 40)/10) + 'px',minHeight:'35.5px'}" :key="index">
							<div class="zr-row-scatter w-100" @click="openServeorderDialog(title)">
								<div class="p-content" :title="'【'+state(title.serveStatus) +'】'+title.serveCode">【{{state(title.serveStatus)}}】业务单号<{{title.serveCode }}>,请及时办理，谢谢！</div>
								<div class="title-p m-r-15">{{title.updateTime | dateFormat}}</div>
							</div>
						</div>
					</div>
				</el-col> -->
				<!--设备处首页begin-->
				<el-col :span="24" class="mk-content" v-show="isSbc">
					<el-row :span="24" class="equipmentIndex_nav">
						<el-col
							class="equipmentIndex_btn"
							:span="3"
							v-for="item in subSystemList"
							:key="item.id"
						>
							<a v-if="item.type==0" @click="csClick(item)"><img class="child_img" :src="item.icon" :alt="item.systemName" /></a>
							<a v-if="item.type==1" @click="bsClick(item)"><img class="child_img" :src="item.icon" :alt="item.systemName" /></a>
							<a v-if="item.type==0" @click="csClick(item)">{{item.systemName}}</a>
							<a v-if="item.type==1" @click="bsClick(item)">{{item.systemName}}</a>
						</el-col>
					</el-row>
					<div class="title-ct">
						<h3 style="padding: 10px;">报警信息<router-link to="/alarm/alarm" style="color: #333;"><span style="float: right;margin-right: 10px; ">更多<i style="vertical-align: text-bottom;" class="icon iconfont icon-chakangengduo-"></i></span></router-link></h3>
						<!--数据表格渲染  去掉了 :row-style="{height: ((heightStyle - 20 - 40 -35)/10<32?32:(heightStyle - 20 - 40 -35)/10) + 'px'}"-->
						<el-table :data="tableData.content" class="w-97" stripe style="margin: auto;"  @selection-change="onSelect">
							<!-- <el-table-column type="selection" :selectable='checkboxT' width="60" align="center"></el-table-column> -->
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
						</el-table>
					</div>
					<div class="Equipment_echarts">
						<ul>
							<li>
								<div>
									<h4>今日设备报警情况</h4>
									<div v-show="hastodayEquipmentAlarm" id="todayEquipmentAlarm" ref="todayEquipmentAlarm" :style="{width: '550px', height: '450px'}"></div>
                                    <div v-show="nonetodayEquipmentAlarm"  :style="{width: '550px', height: '500px',textAlign:'center',paddingTop:'130px'}">今日暂无报警信息</div>
								</div>
							</li>
							<li>
								<div>
									<h4>设备报警趋势</h4>
									<div id="EquipmentAlarm" ref="EquipmentAlarm" :style="{width: '600px', height: '500px'}"></div>
								</div>
							</li>
						</ul>
					</div>
				</el-col>
				<!--设备处首页end-->

				<!-- <el-col :span=12 class="mk-content" v-if="isGlc">
					<VueEcharts v-if="showEchart" :option="data2" :type="'pie'" class="w-100 b-1 c-white" style="min-height:395px;" :style="{height:(heightStyle - 20) + 'px'}"></VueEcharts>
				</el-col>

				<el-col :span=12 class="mk-content" v-if="isGlc">
					<VueEcharts :option="data6" v-if="showEchart" :type="'pie'" class="w-100 b-1 c-white" style="min-height:395px;" :style="{height:(heightStyle - 20) + 'px'}"></VueEcharts>
				</el-col>

				<el-col :span=12 class="mk-content" v-if="isSbc">
					<VueEcharts v-if="showEchart" :option="data3" :type="'pie'" class="w-100 b-1 c-white" style="min-height:395px;" :style="{height:(heightStyle - 20) + 'px'}"></VueEcharts>
				</el-col> -->
				<!--管理处首页begin-->
				<el-col :span=24 class="mk-content" v-show="isGlc">
					<div class="manage_nav">
						<el-row :gutter="10">
							<el-col :span="8">
								<div class="manage_nav1">
									<ul>
										<li><img src="../assets/img/manage_nav_icon1.png" /></li>
										<li>
											<p>今年累计应缴(元)</p>
											<countTo class="count_to" :startVal="startVal" :endVal="PaymentAmountTotal" :duretion="2000" :decimals="decimals"></countTo>
										</li>
										<li>
											<p>今年累计已缴(元)</p>
											<countTo class="count_to" :startVal="startVal" :endVal="PaymentPaidAmount" :duretion="1800" :decimals="decimals"></countTo>
										</li>
									</ul>
								</div>
							</el-col>
							<el-col :span="8">
								<div class="manage_nav2">
									<ul>
										<li><img src="../assets/img/manage_nav_icon2.png" /></li>
										<li>
											<p>累计服务(件)</p>
											<countTo class="count_to" :startVal="startVal" :endVal="workManagementTotal" :duretion="1500"></countTo>
										</li>
										<li>
											<p>今日办理(件)</p>
											<countTo class="count_to" :startVal="startVal" :endVal="workManagementByToday" :duretion="1700"></countTo>
										</li>
									</ul>
								</div>
							</el-col>
							<el-col :span="8">
								<div class="manage_nav3">
									<ul>
										<li><img src="../assets/img/manage_nav_icon3.png" /></li>
										<li>
											<p>累计访客人数(人)</p>
											<countTo class="count_to" :startVal="startVal" :endVal="visitorTotalCount" :duretion="2200"></countTo>
										</li>
										<li>
											<p>今日预约 / 实际访客人数(人)</p>
											<countTo class="count_to" :startVal="startVal" :endVal="visitorCount" :duretion="1600"></countTo><b> / </b>
											<countTo class="count_to" :startVal="startVal" :endVal="visitorExpectArrival" :duretion="1600"></countTo>
										</li>
									</ul>
								</div>
							</el-col>
						</el-row>
					</div>
					<div class="manage_echarts">
						<ul :gutter="10" style="padding: 0 5px;">
							<li>
								<h4>费用缴纳情况</h4>
								<div id="payment" ref="payment" :style="{width: '600px', height: '500px'}"></div>
							</li>
							<li>
								<h4>物业服务情况</h4>
								<div id="payMent" ref="wyfwqk" :style="{width: '550px', height: '500px'}"></div>
							</li>
							<li>
								<h4>访客情况</h4>
								<div id="visitor" ref="visitor" :style="{width: '600px', height: '500px'}"></div>
							</li>
							<li>
								<h4>车位剩余情况</h4>
								<div id="payMent" ref="cwsyqk" :style="{width: '550px', height: '500px'}"></div>
							</li>
						</ul>
					</div>
				</el-col>
				<!--管理处首页end-->
				<!--<el-col :span=24 class="p-10">
					<vue-topo :editable="false" :topo-data="topoData" :isIndex="true">
					</vue-topo>
				</el-col>-->

			</el-row>
		</div>
		<div v-else class="mk-content w-100 h-100" id="login">
            <div class="title-ct" style="background-color: #fff;height: 50%;width: 100%;margin-bottom: 10px;">
            	<h3 style="padding: 10px;border-bottom: 1px solid #eee;margin-bottom: 10px;">快捷入口</h3>
                <el-row :span="24" class="w-100">
                    <el-col  class="equipmentIndex_btn" :span="3"
                        v-for="item in quickPathList"
                        :key="item.id">
                        <a @click="quickPath(item)" class=""><img class="child_img" :src="item.icon" :alt="item.systemName"/></a>
                        <a @click="quickPath(item)">{{item.systemName}}</a>
                    </el-col>
                </el-row>
            </div>
            <div class="title-ct" id="alarm" style="background-color: #fff;">
            	<h3 style="padding: 10px;border-bottom: 1px solid #eee;margin-bottom: 10px;">通知公告<div style="float: right; display:inline-block;color: #333;cursor: pointer;" @click="$router.push({path:'/message/messageOnlineCompany',query:{tabItem:'table2'}})" ><span style="margin-right: 10px; ">更多<i style="vertical-align: text-bottom;" class="icon iconfont icon-chakangengduo-"></i></span></div></h3>
            	<!--数据表格渲染  去掉了 :row-style="{height: ((heightStyle - 20 - 40 -35)/10<32?32:(heightStyle - 20 - 40 -35)/10) + 'px'}"-->
            	<el-table   stripe :data="messageTableData" class="w-97" style="margin:0 auto;" @selection-change="onSelect" :row-class-name="tableRowClassName">
            	    <el-table-column type="selection" width="60"></el-table-column>
            	    <el-table-column :show-overflow-tooltip="true" type="index" label="序号"
            	                     width="50" align="center"></el-table-column>
            	    <!-- 消息类型 -->
            	    <!--<el-table-column :show-overflow-tooltip="true" prop="msgType" label="消息类型"></el-table-column>-->
            	    <!-- 消息来源 -->
            	    <el-table-column :show-overflow-tooltip="true" prop="msgSource"
            	                     label="发自" align="center">
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
            	   <!-- <el-table-column :show-overflow-tooltip="true" label="操作" width="180" align="center">
            	        <template slot-scope="scope">
            	            <el-button type="text" size="mini" :disabled="scope.row.isRead==1"  @click="toIsRead(scope.$index, scope.row)">设为已读
            	            </el-button>
            	        </template>
            	    </el-table-column> -->
            	</el-table>
            </div>
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
                </el-form>
            </el-dialog>
		</div>

		<el-dialog title="服务" :visible.sync="serveorderDialog" @close="handleCancle" :params="params" width="900px">
            <modal :params = serveorderParam :updateTem ="true" v-if="serveorderShow" ></modal>
        </el-dialog>
        <!--选择弹出窗-->
        <!--<el-dialog   title="指派人员" id="editPersonVisible" :visible.sync="editPersonVisible">-->
            <!--<template>-->
                <!--<el-tree :data="serveParPerson" show-checkbox node-key="id" ref="allUser" :default-checked-keys="checkRolekeys" :check-strictly=true :props="defaultRoleProps">-->
                <!--</el-tree>-->
                <!--<span slot="footer" class="dialog-footer">-->
			    <!--<el-button class="ok" type="primary" @click="confirmPerson">确定</el-button>-->
			    <!--<el-button class="cancle" @click="editPersonVisible=false">取 消</el-button>-->
		  	<!--</span>-->
            <!--</template>-->
        <!--</el-dialog>-->
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
	</div>


</template>

<script>
	import { formatDate } from '../../static/js/date.js'
	import countTo from 'vue-count-to'
	import Modal from "./dialog/Modal.vue"
	import { axiosHttp, dict, api } from '@/libs'
    import {mapActions} from 'vuex'
	import Vue from 'vue'
	export default {
		components: {
			"modal":Modal,
			countTo
		},
		data: function() {
        	let colors = ['#5793f3', '#ED4A4B', '#675bba']
			return {
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
				startVal: 0,
				decimals: 2,
				endVal1: 1234.68,
				endVal2: 4324.56,
				endVal3: 456342,
				endVal4: 46346,
				endVal5: 11234,
				endVal6: 885431,
				workManagementTotal: 0,
				workManagementByToday: 0,
				PaymentAmountTotal: 0,
				PaymentPaidAmount: 0,
				visitorTotalCount: 0,
				visitorCount: 0,
				visitorExpectArrival: 0,
                alarmLogTableData: [],
                pageNum: 1,
                pageSize: 10,
				totolNum: 100,
				tableData: [],
                messageTableData: [],
                formDialogVisible: false,
                hastodayEquipmentAlarm:false,
                nonetodayEquipmentAlarm:false,
                editform: {},
                isDetail: false,
				titles: [],
                editPersonVisible:false,
                serveorderParam: {},
                serveorderDialog:false,
                params:{},
                serveParPerson:[],
                checkRolekeys:[],
                defaultRoleProps:{},
				serveorderShow:false,
				showEchart: false,
                // 报警级别
				alarmLevelList:[],
				heightStyle: '',
				heightStyle2: '',
				isSbc: false,
				isGlc: false,
				isYz: false,
            	topoData: {},
				colors: ['#5793f3', '#ED4A4B', '#675bba'],
				data1: {
					x: {},
					y: {name: '金额',series: []},
					legend: [],
				},
				data2:{
					legend: [],
					series :
					{
						name: '',
						list:[]
					}
				},
                data3:{
                    legend: [],
                    series :
					{
						name: '',
						list:[]
					}

				},
				data6:{
					title: '租赁情况',
                    legend: ['已租面积','空置面积','自用面积'],
                    series :
					{
						name: '租赁情况',
						list:[
							{name:'已租面积',value:'4444'},
							{name:'空置面积',value:'3333'},
							{name:'自用面积',value:'1111'}
						]
					}

				},
               quickPathList: [
                	{
                		id:1,
                		icon:require('../../static/img/myservice.png'),
                		systemName: "服务预约",
                		background: "",
                		url:"propertyService/serviceBooking",
                	},
                	{
                		id:2,
                		icon:require('../../static/img/consulting-sercice.png'),
                		systemName: "快捷缴费",
                		background: "",
                		url:"payment/payment",
                	},
                    {
                    	id:3,
                    	icon:require('../../static/img/appointment.png'),
                    	systemName: "会议室预约",
                    	background: "",
                    	url:"meetRoom/meetRoomReserve",
                    },
                    {
                    	id:4,
                    	icon:require('../../static/img/appointment.png'),
                    	systemName: "访客管理",
                    	background: "",
                    	url:"visitor/visitorInfo",
                    }
                ],
				subSystemList: [
					{
						id:1,
						ip: "192.168.1.107",
						username:"HT167",
						icon:require('../assets/img/equipmentIndex_nav_icon1_1.png'),
						systemName: "门禁系统",
						background: "",
						url:"",
						type: 0
					},
					{
						id:2,
						ip: "192.168.1.107",
						username:"HT167",
						icon:require('../assets/img/equipmentIndex_nav_icon1_2.png'),
						systemName: "信息发布系统",
						background: "",
						url:"",
						type: 0
					},
					{
						id:3,
						ip: "192.168.1.107",
						username:"HT167",
						icon:require('../assets/img/equipmentIndex_nav_icon1_3.png'),
						systemName: "UPS",
						background: "",
						url:"",
						type: 0
					},
					{
						id:4,
						ip: "192.168.1.107",
						username:"HT167",
						icon:require('../assets/img/equipmentIndex_nav_icon1_4.png'),
						systemName: "视频监控系统",
						background: "",
						url:"",
						type: 0
					},
					{
						id:5,
						ip: "192.168.1.107",
						username:"HT167",
						icon:require('../assets/img/equipmentIndex_nav_icon1_5.png'),
						systemName: "楼宇自控系统",
						background: "",
						url:"",
						type: 0
					},
					{
						id:6,
						ip: "192.168.1.107",
						username:"HT167",
						icon:require('../assets/img/equipmentIndex_nav_icon1_6.png'),
						systemName: "智能照明系统",
						background: "",
						url:"",
						type: 0
					},
					{
						id:7,
						ip: "192.168.1.107",
						username:"HT167",
						icon:require('../assets/img/equipmentIndex_nav_icon1_7.png'),
						systemName: "能源监控系统",
						background: "",
						url:"",
						type: 0
					},
					{
						id:8,
						ip: "192.168.1.107",
						username:"HT167",
						icon:require('../assets/img/equipmentIndex_nav_icon1_8.png'),
						systemName: "电力系统",
						background: "",
						url:"",
						type: 0
					},
					{
						id:9,
						ip: "192.168.1.107",
						username:"HT167",
						icon:require('../assets/img/equipmentIndex_nav_icon2_1.png'),
						systemName: "残卫报警系统",
						background: "",
						url:"",
						type: 0
					},
					{
						id:10,
						ip: "192.168.1.107",
						username:"HT167",
						icon:require('../assets/img/equipmentIndex_nav_icon2_2.png'),
						systemName: "网络管理系统",
						background: "",
						url:"",
						type: 0
					},
					{
						id:11,
						ip: "192.168.1.107",
						username:"HT167",
						icon:require('../assets/img/equipmentIndex_nav_icon2_3.png'),
						systemName: "电子巡更系统",
						background: "",
						url:"",
						type: 0
					},
					{
						id:12,
						ip: "192.168.1.107",
						username:"HT167",
						icon:require('../assets/img/equipmentIndex_nav_icon2_4.png'),
						systemName: "停车场系统",
						background: "",
						url:"",
						type: 0
					},
					{
						id:13,
						ip: "192.168.1.107",
						username:"HT167",
						icon:require('../assets/img/equipmentIndex_nav_icon2_5.png'),
						systemName: "电梯管理系统",
						background: "",
						url:"",
						type: 0
					},
					{
						id:14,
						ip: "192.168.1.107",
						username:"HT167",
						icon:require('../assets/img/equipmentIndex_nav_icon2_6.png'),
						systemName: "消防控制系统",
						background: "",
						url:"",
						type: 0
					},
					{
						id:15,
						ip: "192.168.1.107",
						username:"HT167",
						icon:require('../assets/img/equipmentIndex_nav_icon2_7.png'),
						systemName: "灾备系统",
						background: "",
						url:"",
						type: 0
					},
					{
						id:16,
						ip: "192.168.1.107",
						username:"HT167",
						icon:require('../assets/img/equipmentIndex_nav_icon2_8.png'),
						systemName: "充电桩系统",
						background: "",
						url:"",
						type: 0
					}
				],
				detailsTableVisible: false,
				detailsData: [],
				recordData: [],
				checkform: {},
				alarmTypeList:[],
				rules: {},
				faultClassList: []
			}
		},
		methods: {
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
			// Echarts
			handleEchartsData(){
				// 今日设备报警情况
				axiosHttp.post('/manage/devicePageHome/getDevicePageByToday', { params: 1 }).then(res => {
					   console.log(res)
                        const severValue = res[0].name1
                        const importValue = res[0].name2
                        const nomalValue = res[0].name3
                        let alarmSum = severValue + importValue +nomalValue
                        if(alarmSum !== 0){
                            this.hastodayEquipmentAlarm = true
                            this.nonetodayEquipmentAlarm = false
                        }else{
                            this.hastodayEquipmentAlarm = false
                            this.nonetodayEquipmentAlarm = true
                        }
                        let tdEmAm = this.$echarts.init(this.$refs.todayEquipmentAlarm)
                        if(tdEmAm){
                        	tdEmAm.setOption({
                        		title: {
                        			text: '设备报警总数',
                        			subtext: alarmSum + '个',
                        			textAlign: 'center',
                        			x: '50%',
                        			y: '45%'
                        		},
                        		tooltip: {
                        			trigger: 'item'
                        		},
                        		legend: {
                        			orient: 'vertical',
                        			right: 0,
                        			top: 0,
                                    selectedMode:false,
                        			data: ['严重报警','重要报警','普通报警']
                        		},
                        		color: ['#E64141', '#DFAD4E', '#4272C1'],
                        		series: [{
                        			name: '报警类型',
                        			type: 'pie',
                        			radius: ['50%', '70%'],
                        			avoidLabelOverlap: false,
                        			label: {
                        				show: false,
                        				position: 'center'
                        			},
                        			emphasis: {
                        				label: {
                        					show: true,
                        					fontSize: '14',
                        					fontWeight: 'bold',
                        					padding: [80, 0, 0, 0]
                        				}
                        			},
                        			labelLine: {
                        				show: false
                        			},
                        			itemStyle: {
                        				normal: {
                        					boeder: 10,
                        					borderColor: '#ffffff'
                        				}
                        			},
                        			data: [
                        				{ 'value': severValue, 'name': '严重报警'},
                        				{ 'value': importValue, 'name': '重要报警'},
                        				{ 'value': nomalValue, 'name': '普通报警'}
                        			]
                        		}]
                        	})
                        }else{
                        	console.log("容器未加载")
                        }


				})

				// 设备报警趋势
				axiosHttp.post('/manage/devicePageHome/getDevicePageByMoreDays', { params: 1 }).then(res => {
					let tansArr = []
					res.forEach(element => {
						tansArr.push(eval(element))
					})
					let tansArr1 = []
					for (let i = 0; i < res.length; i++) {
						for(let key in res[i]) {
							tansArr1.push(parseInt(res[i][key]))
							break
						}
					}
					let tdEmAm = this.$echarts.init(this.$refs.EquipmentAlarm)
					if(tdEmAm){
						tdEmAm.setOption({
							legend: {selectedMode:false},
							tooltip: {},
							dataset: {
								// dimensions: ['天', '报警设备数量'],
								dimensions: ['月份','报警设备数量',''],
								source: tansArr
							},
							xAxis: {type: 'category', axisLabel:{interval:0,rotate:40}, name: '天'},
							yAxis: {minInterval: 1, name: '个'},
							series: [
								{type: 'bar', data: tansArr1, itemStyle:{ color: '#3cc2c2' }},
								{type: 'bar', itemStyle:{ color: '#3cc2c2' }}
							]
						})
					}else{
						console.log("容器未加载")
					}
				})

				// count-to
				axiosHttp.post('/manage/managePageHome/getStatisticInfo', { params: 1 }).then(res => {
					res.forEach(element => {
						if(element.workManagementTotal) {
							this.workManagementTotal = element.workManagementTotal
						} else if(element.workManagementByToday) {
							this.workManagementByToday = element.workManagementByToday
						} else if(element.PaymentAmountTotal) {
							this.PaymentAmountTotal = element.PaymentAmountTotal
						} else if(element.PaymentPaidAmount) {
							this.PaymentPaidAmount = element.PaymentPaidAmount
						} else if(element.visitorTotalCount) {
							this.visitorTotalCount = element.visitorTotalCount
						} else if(element.visitorCount) {
							this.visitorCount = element.visitorCount
						} else if(element.visitorExpectArrival) {
							this.visitorExpectArrival = element.visitorExpectArrival
						}
					})
				})

				// 费用缴纳情况
				axiosHttp.post('/manage/managePageHome/get_meter_regular_charge_collect_info', { params: 1 }).then(res => {
					let tansArr = []
					res.forEach(element => {
						tansArr.push(eval(element))
					})
					let tdEmAm = this.$echarts.init(this.$refs.payment)
					if(tdEmAm){
						tdEmAm.setOption({
							legend: {selectedMode:false},
							tooltip: {},
							dataset: {
								dimensions: ['月份','应收','实收'],
								source: tansArr
							},
							xAxis: {type: 'category', axisLabel:{interval:0,rotate:40}, name: '月'},
							yAxis: {minInterval: 1, name: '元'},
							series: [
								{type: 'bar', itemStyle:{ color: '#e96e50' }},
								{type: 'bar', itemStyle:{ color: '#3cc2c2' }}
							]
						})
					}else{
						console.log("容器未加载")
					}
				})

				// 物业服务情况
				axiosHttp.post('/manage/managePageHome/getBeSpeak', { params: 1 }).then(res => {
					const VALUE2 = res[1].VALUE2
					const VALUE1 = res[0].VALUE1
					let sum = VALUE2 + VALUE1
					let tdEmAm = this.$echarts.init(this.$refs.wyfwqk)
					if(tdEmAm){
						tdEmAm.setOption({
							title: {
								text: '今年服务总数',
								subtext:  sum + '件',
								textAlign: 'center',
								x: '50%',
								y: '45%'
							},
							tooltip: {
								trigger: 'item'
							},
							legend: {
								orient: 'vertical',
								right: 0,
								top: 200,
                                selectedMode:false,
								data: ['已办理', '剩余未办理']
							},
							color: ['#7ec34c', '#4272c1'],
							series: [{
								name: '物业服务',
								type: 'pie',
								radius: ['50%', '70%'],
								avoidLabelOverlap: false,
								label: {
									show: false,
									position: 'center'
								},
								emphasis: {
									label: {
										show: true,
										fontSize: '14',
										fontWeight: 'bold',
										padding: [80, 0, 0, 0]
									}
								},
								labelLine: {
									show: false
								},
								itemStyle: {
									normal: {
										boeder: 10,
										borderColor: '#ffffff'
									}
								},
								data: [
									{ 'value': VALUE1, 'name': '已办理'},
									{ 'value': VALUE2, 'name': '剩余未办理'}
								]
							}]
						})
					}else{
						console.log("容器未加载")
					}
				})

				// 访客情况
				axiosHttp.post('/manage/managePageHome/devicePageService/get_visitor_info_charts', { params: 1 }).then(res => {
					let tansArr = []
					res.forEach(element => {
						tansArr.push(eval(element))
					})
					let tdEmAm = this.$echarts.init(this.$refs.visitor)
					if(tdEmAm){
						tdEmAm.setOption({
							legend: {selectedMode:false},
							tooltip: {},
							dataset: {
								dimensions: ['月份','预约来访','实际到访'],
								source: tansArr
							},
							xAxis: {type: 'category', axisLabel:{interval:0,rotate:40}, name: '月'},
							yAxis: {minInterval: 1, name: '人'},
							series: [
								{type: 'bar', itemStyle:{ color: '#dfad4e' }},
								{type: 'bar', itemStyle:{ color: '#a071d6' }}
							]
						})
					}else{
						console.log("容器未加载")
					}
				})

				// 车位剩余情况
				axiosHttp.post('/manage/managePageHome/getCarPark', { params: 1 }).then(res => {
					let transArr = []
					let pieData = JSON.stringify(res)
					let alarmSum = 0
					for (const i in res) {
						if (res[i].NAME) {
							transArr.push(res[i].NAME.toString())
							alarmSum += res[i].VALUE
						}
					}
					let tdEmAm = this.$echarts.init(this.$refs.cwsyqk)
					if(tdEmAm){
						tdEmAm.setOption({
							title: {
								text: '车位总数',
								subtext:  '110个',
								textAlign: 'center',
								x: '50%',
								y: '45%'
							},
							tooltip: {
								trigger: 'item'
							},
							legend: {
								orient: 'vertical',
								right: 10,
								top: 200,
                                selectedMode:false,
								data: ['今日占用', '剩余车位']
							},
							series: [{
								name: '车位情况',
								type: 'pie',
								radius: ['50%', '70%'],
								avoidLabelOverlap: false,
								label: {
									show: false,
									position: 'center'
								},
								emphasis: {
									label: {
										show: true,
										fontSize: '14',
										fontWeight: 'bold',
										padding: [80, 0, 0, 0]
									}
								},
								labelLine: {
									show: false
								},
								itemStyle: {
									normal: {
										boeder: 10,
										borderColor: '#ffffff'
									}
								},
								// data: pieData
								data: [
									{ 'value': 30, 'name': '今日占用'},
									{ 'value': 80, 'name': '剩余车位'}
								]
							}]
						})
					}else{
						console.log("容器未加载")
					}
				})
			},
			// system
			csClick(item) {
				location.href =
				api.baseUrl +
				"/system/subSystem/download" +
				"?ip=" +
				item.ip +"&username="+item.username+"&systemName="+item.systemName+"&token=" +window.localStorage.csmpToken;
			},
			//BS系统点击事件
			bsClick(item) {
				location.href=item.url
			},
			goBack() {
				this.$router.go(-1);
			},
            tableRowClassName({row, rowIndex}) {
                // if(row.alarmLevel === '01') return 'bg-blue'
                // else if(row.alarmLevel === '02') return 'bg-yellow'
                // else if(row.alarmLevel === '03') return 'bg-red'
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
            // 表格选择改变事件
            onSelect(val) {
                this.checkedArr = val;
                let idsArr = [];
                for(var i = 0; i < val.length; i++) {
                    idsArr.push(val[i].id)
                }
                this.deleteIds = idsArr.join(',');
            },
            //时间格式化
            alarmTime(row, column, cellValue) {
                if(row.alarmTime!=null){
                    return Vue.filter('dateFormat')(row.alarmTime,'yyyy-MM-dd hh:mm:ss')
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
			state(row) {
				if(row === "1001") {
					return "待受理";
				} else if(row === "1002") {
					return "待核实";
				} else if(row === "1003") {
					return "待支付";
				} else if(row === "1004") {
					return "待派工";
				} else if(row === "1005") {
					return "待办结";
				} else if(row === "1006") {
					return "已办结";
				} else if(row === "1007") {
					return "已评价";
				} else if(row === "1008") {
					return "重新派工";
				} else if(row === "1009") {
					return "取消服务";
				} else {
					return null;
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
            openServeorderDialog(row){
                this.serveorderParam = row;
                this.serveorderDialog= true;
                this.serveorderShow = true
            },
            handleCancle(){
                this.serveorderShow = false;
                // this.pageInit();
			},
			pageInit() {
                this.$httpPost('/serveorder/serve/info/findServices', {
					'page': '1',
					'size': '10'
				}).then(res => {
					if(res) {
						var data = res.data.body.content;
						for(var m = 0; m < data.length; m++) {
							var temp = data[m];
							// temp.updateTime = this.dateFormat(temp.updateTime);
							// temp.serveStatus = this.state(temp.serveStatus);
							// temp.serveCode = "业务单号<" + temp.serveCode + ">,请及时办理，谢谢！"
							// temp.serveCode = "业务单号<" + temp.serveCode + ">,请及时办理，谢谢！"
						}
						this.titles = res.data.body.content;
					}

				});

				axiosHttp.post('/manage/alarm/find', {
                    page: this.pageNum,
                    size: this.pageSize
                }).then((res) => {
					this.tableData = res
				})
			},
            quickPath(item){
                this.$router.push(item.url) //企业端
            },
            msgpageInit() {
                let param = {
                    page: this.pageNum,
                    size: this.pageSize,
                    isRead:this.showRead

                }
                Object.assign(param, {msgType: "7"})
            	axiosHttp.post('/message/msgOnline/find', param).then(res => {
            	    this.messageTableData = res.content;
            	    //更新未读数量
            	    this.getUnReadCount()
            	})
            },
            // 弹出查看详情弹出框
            toDetails(index, row) {
                this.editform = {};
                if (row) {
                    this.editform = Object.assign({}, row);
                    this.updateIsRead(row);
                }
                this.formDialogVisible = true;
                this.isDetail = true

            },
            //更新已读
            updateIsRead(row) {
                if (row.isRead == "0") {
                    this.$httpPost('/message/msgOnline/upIsRead', {
                        // ID
                        ids: row.id,
                    }).then(res => {
                        this.msgpageInit()
                        this.getUnReadCount()
                    })
                }

            },
            // 关闭弹出框
            close() {
                this.formDialogVisible = false;
                this.$refs.editform.resetFields();
            },
            //时间格式化
            createTimeFormatter(row, column, cellValue) {
                if (row.createTime != null) {
                    return Vue.filter('dateFormat')(row.createTime, 'yyyy-MM-dd hh:mm:ss')
                }
            },
			creatEchart() {
				this.initServerType();
				// axiosHttp.post('/manage/feeCount/count').then(res => {
				// 	let dataArr = res.months.map(item => item = [])
				// 	res.prices.forEach((item, index) => {
				// 		this.data1.y.series.push({
				// 			type:'line',
				// 			name : item.name,
				// 			yAxis: 1,
				// 			barGap: 0,
				// 			data: item.price.map(priceItem => priceItem = (priceItem/10000).toFixed(2)),
				// 			// itemStyle:{normal:{color:this.colors[index]}}
				// 		})
				// 		this.data1.legend.push(item.name)
				// 		item.price.forEach((priceItem, priceIndex) => {
				// 			dataArr[priceIndex].push({name:item.name,val:priceItem})
				// 		})
				// 	})
				// 	this.data1.tooltipFormatter = (item, ticket, callback) => {
				// 		let str = ''
				// 		dataArr[item[0].dataIndex].forEach(item => {
				// 			str += item.name + '  ' + item.val.toFixed(2) + '元<br/>'
				// 		})
                //         return str
                //     },
				// 	this.data1.title = '费用总计'
				// 	this.data1.x =  {name: '月份',list: res.months}
				// 	this.data1.y.name = '金额（万元）'

				// 	axiosHttp.post('/system/index/serveCount').then(res => {
				// 		Object.values(res.serveCount).forEach(item => {
				// 			this.data2.legend.push(item.name)
				// 			this.data2.series.list.push({value:item.value,name:item.name})
				// 		})
				// 		this.data2.title = '服务类型'
				// 		this.data2.series.name = '服务类型'

				// 		axiosHttp.post('/system/index/alarmCount').then(res => {
				// 			this.showEchart = true
				// 			Object.values(res.alarmCount).forEach(item => {
				// 				this.data3.legend.push(item.name)
				// 				this.data3.series.list.push({
				// 					value:item.value,
				// 					name:item.name,
				// 					itemStyle: {
				// 						normal: {
				// 							color: item.name === '普通告警'?'#4a90e2':(item.name === '重要告警'?'#FFC125':'#F44336')
				// 						}
				// 					}
				// 				})
				// 			})
				// 			this.data3.title = '告警'
				// 			this.data3.series.name = '告警'
				// 		})
				// 	})
				// })
			},
            ...mapActions(['getUnReadCount'])
		},
		mounted () {
			window.onresize = () => {
				window.location.reload()
			}
			axiosHttp.post('/system/index/getRoleGroup').then(res => {
				if(res.roleGroup) {
					if(res.roleGroup.contains('物业角色-设备处')) {
						this.isSbc = true;
						this.isGlc = false;
					}
					if(res.roleGroup.contains('物业角色-管理处')) {
						this.isSbc = false;
						this.isGlc = true
					}
					if(res.roleGroup.contains('物业角色-设备处') && res.roleGroup.contains('物业角色-管理处')) {
						this.isSbc = true;
						this.isGlc = false;
					}
					if(res.roleGroup.contains('企业角色')) this.isYz = true
					if(!this.isYz) {
						this.pageInit()
						this.creatEchart()
                        this.handleEchartsData()
						dict.dict('alarmLevel').then(res => this.alarmLevelList = res)
						let h = document.documentElement.clientHeight || document.body.clientHeight
						this.heightStyle = (h - 50 -20)/2
					}else{
                        this.msgpageInit()
                    }
				}
			})
			const initNoedsWidth = this.$refs.content.offsetWidth
			const initNoedsHeight = initNoedsWidth/4 * 3
			// this.$nextTick(()=>{

			// })
			//this.handleEchartsData()
			/*axiosHttp.post('/manage/topoNode/queryNodes',{floorId:1}).then(res => {
				this.topoData = res
				this.topoData.nodes.forEach(item => {
					item.x = item.x/res.width * initNoedsWidth
					item.y = item.y/res.height * initNoedsHeight
				})
			})*/
		},
		created() {
		},
	}
</script>

<style lang="less">
	#indexPage {
		height: 100%;
		.el-table__header-wrapper {
			height: 35px;
		}
		.el-table__body {
			height: inherit;
		}
	}
	.error-page {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: 100%;
		height: 100%;
		background: #f3f3f3;
		box-sizing: border-box;
	}

	.error-code {
		line-height: 1;
		font-size: 250px;
		font-weight: bolder;
		color: #2d8cf0;
	}

	.error-code span {
		color: #00a854;
	}

	.error-desc {
		font-size: 30px;
		color: #777;
	}

	.error-handle {
		margin-top: 30px;
		padding-bottom: 200px;
	}

	.error-btn {
		margin-left: 100px;
	}

	.mk-content {
		padding: 10px;
		/*border: 1px solid #ebebeb;*/
        .el-table::before {
            background-color: #fff;
        }
		.equipmentIndex_nav {
			box-sizing: border-box;
			padding-top: 10px;
			height: 193px;
			background: url('../assets/img/equipmentIndex_nav_bg.jpg') no-repeat center top;
			background-size: cover;
			.equipmentIndex_btn {
				height: 69px;
				text-align: center;
				margin-bottom: 20px;
				a {
					display: block;
					width: 100px;
					height: 22px;
					line-height: 22px;
					margin: 5px auto 30px;
					color: #fff;
					cursor: pointer;
				}
			}
			.top_35 {
				margin-bottom: 35px;
			}
		}

		.title-ct {
			background-color: white;
			padding-bottom: 20px;
			margin-bottom: 10px;
		}

		.equipment_echarts {
			background-color: #fff;
			height:600px;
			margin-bottom: 20px;
			box-sizing: border-box;

			h4 {
				padding-left: 20px;
				font-size: 14px;
				color: #666;
				height: 40px;
				line-height: 40px;
			}
		}

		.manage_nav {
			margin-bottom: 20px;
			.manage_nav1, .manage_nav2, .manage_nav3 {
				width: 100%;
				height: 118px;
				border-radius: 5px;
				box-sizing: border-box;
				padding: 41px 5px;
				ul {
					li {
						float: left;
						list-style: none;
						box-sizing: border-box;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						p {
							color: #fff;
						}
						.count_to, b {
							color: #fff;
							font-weight: bolder;
							font-size: 30px;
							line-height: 40px;
						}
					}
					li:nth-child(1){
						width: 15%;
					}
					li:nth-child(2){
						width: 36%;
					}
					li:nth-child(3){
						width: 49%;
					}
				}
			}
			.manage_nav1 {
				background: url('../assets/img/manage_nav_bg1.png') no-repeat center top;
				background-size: cover;
			}
			.manage_nav2 {
				background: url('../assets/img/manage_nav_bg2.png') no-repeat center top;
				background-size: cover;
			}
			.manage_nav3 {
				background: url('../assets/img/manage_nav_bg3.png') no-repeat center top;
				background-size: cover;
			}
		}

		.manage_echarts, .Equipment_echarts {
			ul {
				li {
					list-style: none;
					float: left;
					width: 49%;
					margin-left: 0.5%;
					background-color: #fff;
					height:550px;
					margin-bottom: 7px;
					box-sizing: border-box;
					padding: 20px 0 0 20px;
					h4 {
						color: #666;
					}
				}
			}
			.manage_echarts_con {
				width: 100%;
				height: 200px;
				// background-color: #fff;
				margin-bottom: 20px;
			}
		}
		.Equipment_echarts {
			width: 100%;
			ul {
				width: 100%;
				li:nth-child(1){
					margin-left: 0;
					margin-right: 0.5%;
				}
				li:nth-child(2){
					width: 50%;
				}
			}
		}
	}



	.title {
		padding: 0 20px 0 5px;
		display: block;
  		  line-height: 25px;
    	white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	.title-p {
		color: #333;
		font-size: 14px;
		float: right;
		display: inline-block;
		max-width: 20%;
	}

	.paymy {
		font-weight: bold;
		line-height: 30px;
		font-size: 20px;
		color: #333333;
	}

	.p-content {
		max-width: 80%;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		color: #333;
		text-indent: 15px;
		display: inline-block;
		font-size: 14px;
	}

	h3 {
		font-size: 14px;
		text-indent: 15px;
	}

	.hr {
		border-bottom:1px solid #e5e5e5
	}
	.w20{
		width: 20%;
		float: left;
		text-align: center;
	}
	.w20 i,.w25 i  {
    font-size: 40px;
		display: inline-block;
		color: #b3b3b3;
	}
	.w25{
		width: 25%;
		float: left;
		font-size: 14px;
		color: #333;
		text-align: center;
	}
	.havePading .w25{
		padding-top: 15px;
	}
	.active .w25 {
		color: #24b34c;
		font-size: 14px;
	}
	.active .w25 span{
		font-size: 20px;
	}
	.signbox{
		display: flex;
		display: -webkit-flex;
		justify-content: space-around;
		text-align: center;
		margin-top: 97px;
	}
	.signbox i{
		font-size: 40px;
		color: #B3B3B3;
	}
	.signbox .item .info{
		font-size: 14px;
		color: #24b34c;
		margin-top: 4px;
	}
	.signbox .item .info.active{

		color:#f88c00;
	}
	.signbox .item .info span{
		font-size: 20px;
	}
	.signbox .item .titleinfo{
		color: #333333;
		font-size: 14px;
		padding-top: 15px
	}
    #login{
        .el-table::before {
            background-color: #fff;
        }
        .equipmentIndex_btn {
        	height: 69px;
        	text-align: center;
        	margin-bottom: 20px;
        	a {
        		display: block;
        		width: 100px;
        		margin: 0 auto ;
        		color: #000;
        		cursor: pointer;
        	}
            img{
                width: 64px;
                height: 64px;
            }
        }
        .top_35 {
        	margin-bottom: 35px;
        }
    }
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
