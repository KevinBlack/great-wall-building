<template>
        <div class="video-center">
          <div id="divPlugin" class="plugin"></div>
        </div>
</template>
<script>
// import { WebVideoCtrl } from '@/plugins/hkvVideo/webVideoCtrl.js'
export default {
  data() {
    return {
      g_iWndIndex: 0,//当前选中的窗口
      g_bPTZAuto: false,
      iWidth: 800,
      iHeight: 600,
      iProtocol: 1,
      szIP: "192.168.89.14",
      szPort: "80",
      szUsername: "admin",
      szPassword: "12345",
      iStreamType: 1,
      bZeroChannel: false,
    }
  },
  methods: {
    videoInitPlugin: function () {
        var iRet = WebVideoCtrl.I_CheckPluginInstall();
        if (iRet === -1) {
        alert("您还未安装过插件，双击开发包目录里的WebComponentsKit.exe安装！");
        this.downLoadPlugin();
        return;
        }
        this.initPlugin()
    },
    initPlugin: function(){
        WebVideoCtrl.I_InitPlugin(this.iWidth, this.iHeight, {
            bWndFull: true,//是否支持单窗口双击全屏，默I_CheckPluginInstall
            iWndowType: 2,
            cbSelWnd: function (xmlDoc) {
                var giWndIndex = parseInt($(xmlDoc).find("SelectWnd").eq(0).text(), 10);
                var szInfo = "当前选择的窗口编号：" + giWndIndex;

                console.log(szInfo);
            },
        })
    },
    cbInitPluginComplete: function () {
        WebVideoCtrl.I_InsertOBJECTPlugin("divPlugin");
        // 检查插件是否最新
        if (WebVideoCtrl.I_CheckPluginVersion() === -1) {
        alert("检测到新的插件版本，双击开发包目录里的WebComponentsKit.exe升级！");
        return;
        }
        // 登录设备
        WebVideoCtrl.I_Login(that.szIP, that.iProtocol, that.szPort, that.szUsername, that.szPassword, {
        async: false,
        success: function (xmlDoc) {
            console.log(xmlDoc);//不能删除
            // 开始预览
            var szDeviceIdentify = that.szIP + "_" + that.szPort;
            setTimeout(that.startRealPlay(szDeviceIdentify,i, 1), 1000);
        },
        error: function () {
            console.log("login error");
        }
        });
    },
    startRealPlay: function (szDeviceIdentify,iWndIndex, iChannelID) {
        // console.log("startRealPlay: ", szDeviceIdentify, iWndIndex, iChannelID);
        WebVideoCtrl.I_StartRealPlay(szDeviceIdentify, {
        iWndIndex: iWndIndex,
        iStreamType: 1,
        iChannelID: iChannelID,
        bZeroChannel: false,
        success: function () {
            console.log("开始预览成功 " );
        },
        error: function (status, xmlDoc2) {
            console.log(xmlDoc2)//不能删除
            if (status ===403) {
            console.log("szInfo 设备不支持Websocket取流！");
            } else {
            console.log("开始预览失败 ");
            }
        }
        });
    }
  },
  mounted: function () {
    this.videoInitPlugin();
  },
}
</script>