<template>
    <div class="error-page">
        房产管理
    </div>
</template>

<template>
    <div class="wrap">
        <div class="table_content ">

            <template>
                <div>
                    <el-row>
                        <el-button>默认按钮</el-button>
                        <!--<el-button type="primary">导入</el-button>-->
                        <!--<el-button type="success">导出</el-button>-->
                        <el-button type="info" @click="add">创建</el-button>
                        <el-button type="warning" @click="copyCreat()">类似创建</el-button>
                        <el-button type="danger" @click="handleDelete()">删除</el-button>
                        <el-button type="info" @click ="loadTable()">刷新</el-button>
                    </el-row>
                    <el-table ref="table" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="60"></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" type="index" width="50"></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" prop="name" label="客户姓名"></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" label="操作" width="180">
                            <template slot-scope="scope">
                                <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </template>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page=pageNum :page-sizes="[10, 15, 20, 25]" :page-size=pageSize layout="total, sizes, prev, pager, next, jumper" :total=totolNum>
            </el-pagination>
        </div>
        <el-upload
				  class="upload-demo"
				  action="/serveorder/img/upload"
				  :on-preview="handlePreview"
				  :on-remove="handleRemove"
				  :before-remove="beforeRemove"
				  multiple
				  :limit="3"
				  :on-exceed="handleExceed"
				  :file-list="fileList">
				  <el-button size="small" type="primary">点击上传</el-button>
				  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
			</el-upload>
        <!--编辑弹出窗-->
        <el-dialog   title="编辑" :visible.sync="editTableVisible">
            <el-form  ref="form" :model="editform" label-width="80px" >
                <el-form-item label="客户姓名">
                    <el-input v-model="editform.name"></el-input>
                </el-form-item>
            </el-form>
            <!--<el-form  ref="form1"  :model="editform1" label-width="80px" >
            <input type="file" name="file">
            	<el-button @click="tijiao">提交</el-button>
            </el-form>-->

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="save">确 定</el-button>
                <el-button @click="editTableVisible = false">取 消</el-button>
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
    </div>
</template>
<script>
     export default {
    data() {
      return {
        fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}]
      };
    },
    methods: {
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      }
    }
  }
</script>

<style scoped>
    .tree_content {
        position: absolute;
        top: 0;
        left: 0;
        width: 200px;
        bottom: 0;
    }

    .table_content {
        height: 100%;
        position: absolute;
        left: 200px;
        top: 0;
        bottom: 0;
        right: 0;
    }
</style>
