import { axiosHttp } from '@/libs'
import axios from "axios/index";

const actions = {
    getMenuList(store,params) {
        return axiosHttp.post('system/menu/getallmenu',params).then(payload => store.commit('SET_MENU_LIST', payload))
        // let res = await getBreadcrumb()
        // commit('GET_BREADCRUMB', res.data.body)
    },

    //获取状态列表
    getCauseOrStatusList(store, params) {
        const type = params.typekey
        return axiosHttp.post('/system/user/dict/findListByType', params).then(payload => store.commit('SET_CAUSE_OR_STATUS_LIST',{payload,type}))
    },
    //获取来访人列表
    getVisitorList(store, params) {
        return axiosHttp.post('/serveorder/visitorInfo/getVisitName', params).then(payload => store.commit('SET_VISITOR_LIST',payload))
    },
    //保存访客预约
    saveVisitorReservation(store, params) {
        return axiosHttp.post('/serveorder/visitorInfo/save', params).then(payload => store.commit('SET_RESERVATION_INFO',payload))
    },
    //获取访客预约列表
    getVisitorReservationList(store, params) {
        return axiosHttp.post('/serveorder/visitorInfo/find', params).then(payload => store.commit('SET_RESERVATION_LIST',payload))
    },
    //获取访客预约详情
    getVisitorReservationInfo(store, params) {
        return axiosHttp.post('/serveorder/visitorInfo/get', params).then(payload => store.commit('SET_RESERVATION_INFO',payload))
    },
    //检验手机
    checkPhone(store, params) {
        return axiosHttp.post('/serveorder/serve/info/checkPhone', params).then(payload => payload)
    },
    //获取用户信息
    getUserInfo(store, params) {
        return axiosHttp.post('/serveorder/serve/order/queryCustomer', params).then(payload => payload)
    },
    //登录检验手机
    loginCheckPhone(store, params){
        return axiosHttp.post('/system/user/sendCode', params).then(payload => {
	        const _interVal = setInterval(() => {
	          store.commit('SET_COUNT_DOWN', store.state.countDown.second - 1)
	          if (store.state.countDown.second === 0) {
	            clearInterval(_interVal)
	            store.state.countDown.second = 180
	          }
	        }, 1000)
	        store.commit('SET_PUSH_INTERVAL', _interVal)
	      },error => error)
    },
    //获取验证码
    getCode(store, params) {
      return axiosHttp.post('/system/user/code/getCode',params).then(payload => {
        const _interVal = setInterval(() => {
          store.commit('SET_COUNT_DOWN', store.state.countDown.second - 1)
          if (store.state.countDown.second === 0) {
            clearInterval(_interVal)
            store.state.countDown.second = 180
          }
        }, 1000)
        store.commit('SET_PUSH_INTERVAL', _interVal)
      })
    },
    //获取台账信息树
    getDeviceTree(store, params) {
        return axiosHttp.get('/manage/device/tree', params).then(payload => store.commit('SET_DEVICE_TREE',payload))
    },
    //  获取角色列表
    getRoleList(store, params) {
        return axiosHttp.post('/system/user/role/getRoleName', params).then(payload => payload)
    },
    //获取预警定义列表
    getAlarmDefineList(store, params) {
        return axiosHttp.post('/manage/alarmDefine/find', params).then(payload => store.commit('SET_ALARM_DEFINE_LIST',payload))
    },
    //保存预警定义
    saveAlarmDefine(store, params) {
        return axiosHttp.post('/manage/alarmDefine/save', params).then(payload => {},error => error)
    },
    
    getUnReadCount(store,params){
        return axiosHttp.post('/message/msgOnline/queryUnReadCount', params).then(payload => store.commit('SET_QUERY_UNREAD_COUNT',payload))
    }
}



export default actions
