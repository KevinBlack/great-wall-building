<template>
	<div class="wrap">
		<!--<div style="margin: 15px;">
			<el-input v-model="kw" placeholder="请输入关键字" clearable style="width:200px;margin-right: 15px;"></el-input>
			<el-button type="primary" @click="SearchTable()" plain><i class="el-icon-search"></i>搜索</el-button>
		</div>-->
		<div class="subContent zr-row">
			<div class="tableWrap">
				<div style="margin: 15px;float:right;">
					<el-input v-model="kw" placeholder="请输入关键字" clearable style="width:200px;margin-right: 15px;"></el-input>
					<el-button type="primary" @click="SearchTable()" >搜索</el-button>
				</div>
				<el-table ref="table" stripe :data="tableData" v-loading ="loading1"
					 element-loading-text="拼命加载中"
					  element-loading-spinner="el-icon-loading"
					   element-loading-background="rbg(0,0,0,0.8)"   >
		            <el-table-column
		                type="index"
		                width="100" label="序号" align="center">
		            </el-table-column>

					<el-table-column :show-overflow-tooltip="true" prop="DEVICE_SUB_SYS_NAME" label="设备子系统" align="center">
						<!-- <template slot-scope="scope">
							<el-button type="text" size="smart" @click="handleClick(scope.row.ID)">{{scope.row.DEVICE_SUB_SYS_NAME}}</el-button>
						</template> -->
					</el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="total" label="数量" align="center">
					</el-table-column>
				</el-table>
				<el-pagination  @current-change="handleCurrentChange" :current-page.sync="current" :page-size="pageSize" layout="total, prev, pager, next" :total="countSize">
				</el-pagination>
		</div>
	</div>
</div>
</template>

<script>
	export default {
		data() {
			return {
				tableData: [],
				kw: '',
				current:1,
				maodian: 1,
				countSize:0,
				pageSize:15,
				loading1:false
			}
		},
		created() {
			this.TableInint();
		},
		methods: {
			TableInint: function() {
				this.loading1 = true;
				this.$httpPost('/manage/device/countDevice', {
					keyword: this.kw
				}).then(res => {
					this.loading1 = false;
					console.log(res.data.code)
					if(res.data.code==0){
						this.tableData=res.data.body.content;
						this.countSize=res.data.body.totalElements;
					}
					// this.loading1 = false;
					// this.tableData =res.data.body ;
					// this.countSize = res.data.body.length;
				})

			},
			SearchTable: function() {
				this.$httpPost('/manage/device/countDevice', {
					keyword: this.kw
				}).then(res => {
					if(res.data.code==0){
						this.tableData=res.data.body.content;
						this.countSize=res.data.body.totalElements;
					}
				})

			},

			handleCurrentChange: function(val){
				this.current = val;
			},
			currentPage: function(){
					this.currentPage = 1;
			},
			handleClick: function(id){
				this.$httpGet('Get', '/manage/device/queryDeviceCount', {
					deviceTypeCode: id
				}).then(res => {
					// if(res.data.body.length == 0){
					// 	return;
					// }
					// this.tableData =res.data.body ;
					// this.countSize =res.data.body.length;

				})
			}




		}
	}
</script>

<style scoped>

</style>
