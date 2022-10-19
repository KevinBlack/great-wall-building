<template>
  <div class="wrap">
  
				<div class="subContent zr-row">
					<div class="tableWrap">
					<el-form :inline="true" :model="searchForm" class="demo-form-inline">
						<el-button type="primary" @click="exportExcel()" >导出</el-button>
						<el-button type="primary" @click="search()">刷新</el-button>
						<el-form-item label="">
							<el-input v-model="searchForm.operatemodule" clearable placeholder="操作模块"></el-input>
						</el-form-item>
						<el-form-item label="">
							<el-input v-model="searchForm.operatetype"  clearable placeholder="操作类型"></el-input>
						</el-form-item>
						<el-form-item label="">
						 <el-date-picker
					      v-model="searchForm.createTime"
					      type="datetimerange"
					      :picker-options="pickerOptions2"
					      range-separator="至"
					      start-placeholder="开始日期"
					      end-placeholder="结束日期"
					      format="yyyy-MM-dd hh:mm"
					      align="right">
					    </el-date-picker>
						</el-form-item>
						
							<!--<el-form-item label="">
							<el-input v-model="searchForm.startTime" placeholder="开始时间"></el-input>
						</el-form-item>
							<el-form-item label="">
							<el-input v-model="searchForm.endTime" placeholder="结束时间"></el-input>
						</el-form-item>-->
						<el-form-item>
							<el-button type="primary" @click="search()">搜索</el-button>
						</el-form-item>
					</el-form>
					<el-table ref="table" stripe  :data="tableData" style="width: 100%" v-loading ="loading1"
					 element-loading-text="拼命加载中"
					  element-loading-spinner="el-icon-loading"
					   element-loading-background="rbg(0,0,0,0.8)"  >
						<!--<el-table-column type="selection" width="60"></el-table-column>-->
						<el-table-column :show-overflow-tooltip="true" type="index" width="50" label="序号"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="createTime" :formatter="dateFormat" label="操作时间"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="operateuser" label="操作用户"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="operatemodule" label="操作模块"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="operatetype" label="操作类型"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="operateobject" label="操作内容"></el-table-column>
						<!--<el-table-column :show-overflow-tooltip="true" prop="devicePersonTel" label="责任人联系电话" width="150"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="manufacturer" label="生产厂家"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="useStatus" label="使用状态"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" label="操作" width="180">-->
							<!--<template slot-scope="scope">
								<el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
								<el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
							</template>
						</el-table-column>-->
					</el-table>
				</div>
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page=pageNum :page-sizes="[10, 15, 20, 25]" :page-size=pageSize layout="total, sizes, prev, pager, next, jumper" :total=totolNum>
			</el-pagination>
  </div>
  </div>
</template>

<script>
import {formatDate} from '../../../static/js/date.js'
import { api } from '@/libs'
export default {
        data() {
          return{
          	loading1:false,
          	tableData:[],
          	pageNum:1,
          	pageSize:10,
          	totolNum:100,
          	searchForm: {},
          	pickerOptions2: {
	          shortcuts: [{
	            text: '最近一周',
	            onClick(picker) {
	              const end = new Date();
	              const start = new Date();
	              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
	              picker.$emit('pick', [start, end]);
	            }
	          }, {
	            text: '最近一个月',
	            onClick(picker) {
	              const end = new Date();
	              const start = new Date();
	              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
	              picker.$emit('pick', [start, end]);
	            }
	          }, {
	            text: '最近三个月',
	            onClick(picker) {
	              const end = new Date();
	              const start = new Date();
	              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
	              picker.$emit('pick', [start, end]);
		            }
		          }]
		        }
//	        	value5: ''
          }
          
       },
       created:function(){
        
				this.loadTable();

      },
    methods: {
    	//初始化表格
			loadTable() {
				this.loading1 = true;
				 this.$httpPost('/system/user/logger/findByPageAndParams', {
	         	"page": this.pageNum,
						"size": this.pageSize
         }).then(res =>{
         	this.loading1 = false;
					this.tableData = res.data.body.content;
					this.totolNum = Number(res.data.body.totalElements)
					
        }, function (response) {

        });

			},
      //			页码数改变
			handleSizeChange(val) {
				this.pageSize = val;
				this.search();
			},
//			页码改变
			handleCurrentChange(val) {
				this.pageNum = val;
				this.search();
			},
			//导出
			exportExcel(){
//				if(this.deleteIds==""){
//					this.$message.error('请选择导出项！');
//				}
				location.href= api.baseUrl+'/manage/device/exportExcel'+'?ids='+this.deleteIds+'&token='+window.localStorage.csmpToken;
			},
			search() {
//				this.pageNum = 1;
				let startTime = "";
				let endTime = "";
				if (this.searchForm.createTime != undefined) {
             startTime = formatDate(this.searchForm.createTime[0],"yyyy-MM-dd hh:mm");
             endTime = formatDate(this.searchForm.createTime[1],"yyyy-MM-dd hh:mm");
          }
//				alert(formatDate(this.searchForm.createTime[0],"yyyy-MM-dd hh:mm"));
				this.$httpPost('/system/user/logger/findByPageAndParams', {
					operatemodule: this.searchForm.operatemodule,
					operatetype: this.searchForm.operatetype,
					startTime: startTime,
					endTime: endTime,
					page: this.pageNum,
					size: this.pageSize
				}).then(res => {
					this.tableData = res.data.body.content;
					this.totolNum = Number(res.data.body.totalElements)
				})
			},
			 //时间格式化
       dateFormat(row, column,cellValue) {
       	  let date = new Date(parseInt(row.createTime));
          if (date == undefined) {
             return "";
          }
          return formatDate(date,"yyyy-MM-dd hh:mm");
       }
	}
}
</script>
