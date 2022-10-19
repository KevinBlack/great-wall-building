<template>
	<div>
		<div v-if="upload.type">
			<el-upload :action="action" :show-file-list="value !== undefined&&value !== ''&&uploadList.split(',').length === 1?false:true" v-model="uploadList" v-bind="$attrs" :file-list="fileList" :on-success="onSuccess"
				list-type="picture-card" :on-preview="handlePictureCardPreview" :before-upload="beforeAvatarUpload">
        <img v-if="uploadList.length>0&&uploadList.split(',').length === 1" :src="download + uploadList" width="146" height="146" class="brd-5">
        <i class="el-icon-plus" v-else></i>
			</el-upload>
		</div>
		<div v-else>
			<el-upload :action="action" multiple :show-file-list="true" v-model="uploadList" v-bind="$attrs" :file-list="fileList" :on-success="onSuccess" :limit="upload.limit"
				list-type="picture-card" :on-preview="handlePictureCardPreview" :before-upload="beforeAvatarUpload" :on-remove="handleRemove"  :on-exceed="handleExceed" >
				<i class="el-icon-plus"></i>
			</el-upload>
		</div>

		<el-dialog   :visible.sync="dialogVisible" :modal="false" title="查看图片">
			<div class="zr-column-center">
		  		<img width="50%" :src="dialogImageUrl" alt="">
			</div>
		</el-dialog>
	</div>
</template>

<style>

</style>



<script>
	import { api } from '@/libs'
  export default {
  	model: { prop: 'value', event: 'change' },
    name: 'PhotoUpload',
    data() {
    	return {
    		action:api.fileserver+'img/upload',
    		download: api.fileserver + 'download?fileId=',
    		fileList: [],
				dialogVisible: false,
				dialogImageUrl: ''
    	}
    },
    props: {
      value: String,
      upload: { type: Object, required: true }
    },
    computed: {
    	uploadList: {
    		get(val) {
    			return val.value?val.value:''
    		},
    		set(val) {
    			let str = ''
    			val.forEach((item, index) => {
    				if(item.response) str += (item.response.fileId + (val.length === index + 1?'':','))
    			})
          this.$emit('change', str)
    			return str
    		}
    	}
    },
    methods: {
    	onSuccess(response,file,fileList) {
	    	this.uploadList = this.upload.type?[file]:fileList
	    },
	    handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
	    },
	    beforeAvatarUpload(file) {
        let isTrueFormat = false
        let isTrueSize = file.size / 1024 / 1024 < this.upload.size
        this.upload.accept.split(',').forEach(item => {
          if(file.type.indexOf(item.slice(1,item.length)) > -1) isTrueFormat = true
        })
        if (!isTrueFormat) {
          this.$message.error('上传图片只能是' + this.upload.accept + '格式!')
          return false
        }
        if (!isTrueSize) {
          this.$message.error('上传图片大小不能超过 ' + this.upload.size + 'MB!')
          return false
        }
        return isTrueFormat && isTrueSize
      },

    	handleExceed(files, fileList) {
        this.$message.warning('当前限制选择 ' + this.upload.limit + '个文件，本次选择了 ' + files.length + '个文件，共选择了 ' + (files.length + fileList.length) + ' 个文件');
	    },
			handleRemove(file, fileList) {
	    	this.uploadList = fileList
	    },
    },
    mounted() {

    },
    created() {
			let arr = []
			if(this.value !== '' && this.value !== undefined) {
        this.value.split(",").forEach((item, index) => {
          if(this.upload.type) {
            if(index === 0) arr.push({url:this.download+item,response:{fileId:item}})
          }else arr.push({url:this.download+item,response:{fileId:item}})
          this.fileList = arr
          this.uploadList = arr
        })
      }else {
        this.uploadList = []
      }
      if(!this.upload.accept) this.upload.accept = '.jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PNG,.GIF,.BMP,.PDF'
      if(!this.upload.size) this.upload.size = 10
      if(!this.upload.limit) this.upload.limit = 3
    },
  }
</script>
