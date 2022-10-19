<!--
 * @Author: caojing
 * @Date: 2018-11-23 10:28:53
 * @LastEditors: caojing
 * @LastEditTime: 2018-11-27 10:12:26
 -->
<template>
    <div class="shapebarWrap">
        <div class="shapebarHead c-gray b-b-1">
            设备图标
        </div>
        <ul id="resTree" class="ztree"></ul>
        <!-- <div class="zr-row-wrap p-10">
          <div class="zr-column-center shapeNode h-72-px" v-for="(ele,key) in shapeNodeLstData" :key="key" @mousedown.stop.prevent="dragShapeNode(shapeNodeLstData,key,$event)" :title="ele.type">                          
            <img class="shapeIconImg" :src="ele.image" />
            <div class="shapeName">{{ele.type}}</div>                           
          </div>   
        </div> -->
    </div>
</template>

<script>
// import shapeNodeLstData from '../../../data/toolbarNodeData' //初始左侧toolbarNode数据（可从后台获取）
import { api } from '@/libs'
export default {
  name:'vShapebar',
  data(){
   return {
      //shapebar数据
       shapeNodeLstData:[
         {icon:'static/img/diy/2.png',type:'2.png',width:140,height:80,num:1,classType:'T2'},
         {icon:'static/img/diy/3.png',type:'3.png',width:140,height:80,num:1,classType:'T2'},
         {icon:'static/img/diy/4.png',type:'4.png',width:140,height:80,num:1,classType:'T2'},
         {icon:'static/img/diy/5.png',type:'5.png',width:140,height:80,num:1,classType:'T2'},
         {icon:'static/img/diy/6.png',type:'6.png',width:140,height:80,num:1,classType:'T2'},
         {icon:'static/img/diy/7.png',type:'7.png',width:140,height:80,num:1,classType:'T2'},
         {icon:'static/img/diy/8.png',type:'8.png',width:140,height:80,num:1,classType:'T2'},
         {icon:'static/img/diy/9.png',type:'9.png',width:140,height:80,num:1,classType:'T2'},
       ],
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
						},
					},
					callback: {
						onClick: this.treeClick,
						onRightClick: this.onRightClick,
            beforeExpand: this.beforeExpand,
            onDrag: this.onDrag,
            beforeDrag: this.beforeDrag,
            onMouseDown: this.onMouseDown
					},
					async: {
						enable: true,
						url:api.baseUrl + '/manage/device/findByPage',
						autoParam: ['realId=deviceTypeCode'],
						otherParam: {"page":"1","size":"999999"},
						type: "get",
						headers: {
							"token": window.localStorage.csmpToken
						},
						dataFilter: this.dataFilter
					}
        },
        queriedList: []
   }
  },
  components: {
  },
  methods:{
    dragShapeNode(shapeNodeLstData,key,$event){
      this.$emit('click', shapeNodeLstData,key,$event);
    },
    //初始shapeLstData
    initToolbarNodes(){
      let initShapeLstData = this.shapeNodeLstData //toolbarNodeData从后台获取
      if(!initShapeLstData instanceof Array){ //类型检测，必须为Array
          console.error('shapeNodeLstData must be Array')
          initShapeLstData = []
      }
      this.shapeNodeLstData = initShapeLstData
    },
    //加载树
    loadTree(id,flag) {
      this.$http('get', '/manage/device/tree/1', {}).then(res => {
        this.resTreeNodes = res.data.body;
        this.resTreeNodes.forEach(item => {
          if(item.rank === '3') {
            item.children = item.children?item.children:[]
            item.icon = 'static/img/diy/3.png'
          }else {
            item.icon = 'static/img/diy/4.png'
          }
        })
        $.fn.zTree.init($("#resTree"), this.resSetting, this.resTreeNodes);
        this.resTree = $.fn.zTree.getZTreeObj("resTree");
        if(id){
          let firstNode;
          if(flag===1){
            firstNode = this.resTree.getNodeByParam("id", id, null);
          }else{
            firstNode = this.resTree.getNodeByParam("realId", id, null);
          }
          this.resTree.selectNode(firstNode)
          this.deviceTypeCode = this.resTree.getNodes()[0].realId;
          this.resTree.expandNode(firstNode);
        }else{
          var firstNode = this.resTree.getNodes()[0]
          this.resTree.selectNode(firstNode)
          this.deviceTypeCode = this.resTree.getNodes()[0].realId;
        }
      })
    },
    //异步加载数据的接口回调
    dataFilter(treeId, parentNode, res) {
      const childNodes = res.body.content
      if(childNodes.length > 0) {
        childNodes.forEach(item => {
          Object.assign(item,{
            name: item.deviceName,
            image: parentNode.icon,
            width: 140,
            height: 80,
            classType:'T2',
            type:'2.png'
          })
        })
        return childNodes
      }else return null
    },
    //树节点展开前
    beforeExpand(treeId, treeNode) {
      if(treeNode.rank === '3') {
        if(!this.queriedList.includes(treeNode.realId)) {
          this.resTree.reAsyncChildNodes(treeNode, "refresh")
          this.queriedList.push(treeNode.realId)
        }
      }
    },
    //树节点按下鼠标
    onMouseDown(e, treeId, treeNode) {
      if(treeNode&&treeNode.level==3){
        this.$emit('click', treeNode);
      }
    },
  },
  mounted(){
      this.initToolbarNodes() //初始化toolbarNodes数据
  },
  created(){
    this.loadTree()
  }
}
</script>
<style lang="less">
@border-color:#aaaaaa;
@theme-color: white;
@theme-font-color: white;
/*svgMain左侧工具栏*/
.shapebarWrap{height:100%;box-sizing: border-box;display: flex;flex-direction: column;width:250px;border:1px solid @border-color;border-right:0;background:@theme-color;
  .shapebarHead{height:40px;line-height:40px;text-align: center;font-size:14px;-webkit-user-select:none;user-select:none;font-weight: 700;color:@theme-font-color;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;}
  .shapeNodeLstWrap{overflow-y: auto;box-sizing:border-box;padding:10px 15px;flex:1;
    .shapeNodeLst{width:100%;display:flex;flex-wrap:wrap;box-sizing:border-box;}
  }
}
.shapeNode{margin-top:5px;cursor: pointer;border:1px solid #c7d1dd;border-radius:2px;-webkit-user-select:none;user-select:none;background-color: #fff;-webkit-user-select:none;user-select:none;box-sizing: border-box;
width:calc( ~"( 100% - 10px ) / 3" );box-sizing:border-box;padding:6px 0;margin-right: 5px;
    &:nth-child(3n){margin-right: 0}
}
/*移动的node*/
.shapeIcon{text-align: center;-webkit-user-select:none;user-select:none;
  .shapeIconImg{width: 28px;height: 28px;-webkit-user-select:none;user-select:none;}
}
.shapeName{font-size:12px;text-align: center;padding:0 5px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;-webkit-user-select:none;user-select:none;color:#000}
</style>