<template>
  <div>
    <!-- 第一行 -->
    <el-row :span="24">
      <el-col
        class="child_sys_block"
        :offset="1"
        :span="5"
        v-for="item in subSystemList"
        :key="item.id"
      >
        <!-- 第一行 -->
        <a v-if="item.type==0" @click="csClick(item)"><img class="child_img" :src="item.icon" :alt="item.systemName" /></a>
        <a v-if="item.type==1" @click="bsClick(item)"><img class="child_img" :src="item.icon" :alt="item.systemName" /></a>
        <a v-if="item.type==0" @click="csClick(item)">{{item.systemName}}</a>
        <a v-if="item.type==1" @click="bsClick(item)">{{item.systemName}}</a>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { api, dict } from "@/libs";
export default {
  data() {
    return {
      subSystemList: [
        {
          id:1,
          ip: "192.168.1.107",
          username:"HT167",
          icon:require('../../assets/img/monitor/icon_01.png'),
          systemName: "门禁系统",
          background: require('../../assets/img/monitor/bg_01.jpg'),
          url:"",
          type: 0,
        },
        {
          id:2,
          ip: "192.168.1.107",
          username:"HT167",
          icon:require('../../assets/img/monitor/icon_02.png'),
          systemName: "信息发布系统",
          background: require('../../assets/img/monitor/bg_02.jpg'),
          url:"",
          type: 0,
        },
        {
          id:3,
          ip: "192.168.1.107",
          username:"HT167",
          icon:require('../../assets/img/monitor/icon_03.png'),
          systemName: "UPS",
          background: require('../../assets/img/monitor/bg_03.jpg'),
          url:"",
          type: 0,
        },
        {
          id:4,
          ip: "192.168.1.107",
          username:"HT167",
          icon:require('../../assets/img/monitor/icon_04.png'),
          systemName: "视频监控系统",
          background: require('../../assets/img/monitor/bg_04.jpg'),
          url:"",
          type: 0,
        },
        {
          id:5,
          ip: "192.168.1.107",
          username:"HT167",
          icon:require('../../assets/img/monitor/icon_05.png'),
          systemName: "楼宇自控系统",
          background: require('../../assets/img/monitor/bg_05.jpg'),
          url:"",
          type: 0,
        },
        {
          id:6,
          ip: "192.168.1.107",
          username:"HT167",
          icon:require('../../assets/img/monitor/icon_06.png'),
          systemName: "智能照明系统",
          background: require('../../assets/img/monitor/bg_06.jpg'),
          url:"",
          type: 0,
        },
        {
          id:7,
          ip: "192.168.1.107",
          username:"HT167",
          icon:require('../../assets/img/monitor/icon_07.png'),
          systemName: "能源监控系统",
          background:require('../../assets/img/monitor/bg_07.jpg'),
          url:"",
          type: 0,
        },
        {
          id:8,
          ip: "192.168.1.107",
          username:"HT167",
          icon:require('../../assets/img/monitor/icon_08.png'),
          systemName: "电力系统",
          background: require('../../assets/img/monitor/bg_08.jpg'),
          url:"",
          type: 0,
        },
        {
          id:9,
          ip: "192.168.1.107",
          username:"HT167",
          icon:require('../../assets/img/monitor/icon_09.png'),
          systemName: "残卫报警系统",
          background: require('../../assets/img/monitor/bg_09.jpg'),
          url:"",
          type: 0,
        },
        {
          id:10,
          ip: "192.168.1.107",
          username:"HT167",
          icon:require('../../assets/img/monitor/icon_10.png'),
          systemName: "网络管理系统",
          background: require('../../assets/img/monitor/bg_10.jpg'),
          url:"",
          type: 0,
        },
        {
          id:11,
          ip: "192.168.1.107",
          username:"HT167",
          icon:require('../../assets/img/monitor/icon_11.png'),
          systemName: "电子巡更系统",
          background: require('../../assets/img/monitor/bg_11.jpg'),
          url:"",
          type: 0,
        },
        {
          id:12,
          ip: "192.168.1.107",
          username:"HT167",
          icon:require('../../assets/img/monitor/icon_12.png'),
          systemName: "停车场系统",
          background: require('../../assets/img/monitor/bg_12.jpg'),
          url:"",
          type: 0,
        },
        {
          id:13,
          ip: "192.168.1.107",
          username:"HT167",
          icon:require('../../assets/img/monitor/icon_13.png'),
          systemName: "电梯管理系统",
          background:require('../../assets/img/monitor/bg_13.jpg'),
          url:"",
          type: 0,
        },
        {
          id:14,
          ip: "192.168.1.107",
          username:"HT167",
          icon:require('../../assets/img/monitor/icon_14.png'),
          systemName: "消防控制系统",
          background: require('../../assets/img/monitor/bg_14.jpg'),
          url:"",
          type: 0,
        },
        {
          id:15,
          ip: "192.168.1.107",
          username:"HT167",
          icon:require('../../assets/img/monitor/icon_15.png'),
          systemName: "灾备系统",
          background: require('../../assets/img/monitor/bg_15.jpg'),
          url:"",
          type: 0,
        },
        {
          id:16,
          ip: "192.168.1.107",
          username:"HT167",
          icon:require('../../assets/img/monitor/icon_16.png'),
          systemName: "充电桩系统",
          background: require('../../assets/img/monitor/bg_16.jpg'),
          url:"",
          type: 0,
        }
        
        

      ]
    };
  },
  created() {
    // this.getList();
  },
  methods: {
    // getList() {
    //   this.$httpPost("/system/subSystem/getList", {}).then(res => {
    //     console.log(res);
    //     if (res.data.code == 0) {
    //       this.subSystemList = res.data.body.list;
    //     }
    //     console.log(this.subSystemList);
    //   });
    // },
    //CS系统点击事件
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
    }
  }
};
</script>
<style scoped lang="less">
.el-row {
  height: 25%;
  .child_img{
    width: 100px;
    height: 100px;
  }
  .child_sys_block {
    // background-color: #666;
    box-sizing: border-box;
    padding-top: 30px;
    text-align: center;
    a {
      display: block;
      line-height: 35px;
      cursor: pointer;
    }
  }
}
</style>