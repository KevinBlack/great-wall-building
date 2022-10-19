const state = {
    menuList: [],
    routerList: [],
    queryUnReadCount:0,
    isNoMenu: false,
    //访客预约列表
    visitorReservationTable: {
        content: []
    },
    visitorReservation: {},
    visitorCauseList: [],
    visitorStatusList: [],
    visitorList: [],
    beVisitorList: [],
    //验证码倒计时
    countDown: {
        second: 60,
        text: '获取验证码',
        disable: false
    },
    interVals: [],
    // 台账信息树
    deviceTree: [],
    //预警定义列表
    alarmDefineTable: { content: [] }
}

export default state
