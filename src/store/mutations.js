const mutations = {
    //设置菜单列表
    SET_MENU_LIST(state, res) {
        if (res && res.length === 0) state.isNoMenu = true
        state.menuList = res
    },
    //设置状态列表
    SET_CAUSE_OR_STATUS_LIST(state, {payload, type}) {
        if (type === 'visitorStatus') state.visitorStatusList = payload
        else state.visitorCauseList = payload
    },
    //设置访客预约列表
    SET_RESERVATION_LIST(state, payload) {
        if (payload.totalElements) payload.totalElements = Number(payload.totalElements)
        state.visitorReservationTable = payload
    },
    //设置访客预约详情
    SET_RESERVATION_INFO(state, payload) {
        if (payload.endTime && payload.startTime) {
            if (new Date(payload.endTime).getMonth() === new Date(payload.startTime).getMonth() &&
                new Date(payload.endTime).getDay() === new Date(payload.startTime).getDay())
                payload.endTime = Vue.filter('dateFormat')(payload.endTime, 'hh:mm')
        }
        state.visitorReservation = payload
    },
    //设置被访人列表
    SET_BE_VISITOR_LIST(state, payload) {
        state.beVisitorList = payload
    },
    //设置来访人列表
    SET_VISITOR_LIST(state, payload) {
        state.visitorList = payload
    },
    //初始化访客预约
    initVisitorReservation(state, payload) {
        state.visitorReservation = {}
    },
    //设置验证码倒计时
    SET_COUNT_DOWN(state, second) {
        state.countDown.second = second
        state.countDown.text = second === 0 ? '再次发送' : '请稍等 ' + second
        /* eslint no-unneeded-ternary: "error" */
        state.countDown.disable = second === 0
    },
    SET_CLEAR_INTERVAL(state) {
        state.interVals.forEach((item) => {
            clearInterval(item)
        })
        state.interVals = []
        state.countDown.second = 180
        state.countDown.text = '发送验证码'
    },
    SET_PUSH_INTERVAL(state, interVal) {
        state.interVals.push(interVal)
    },
    //设置台账信息树
    SET_DEVICE_TREE(state, payload) {
        const newArr = []
        payload.forEach(oneItem => {
            if (oneItem.ranks === '2') {
                newArr.push({value: oneItem.realId, label: oneItem.name, children: []})
            }
        })
        payload.forEach(oneItem => {
            if (oneItem.ranks === '3') {
                const obj1 = newArr.find(twoItem => twoItem.value === oneItem.pId)
                if (obj1) obj1.children.push({value: oneItem.realId, label: oneItem.name, children: []})
            }
        })
        payload.forEach(oneItem => {
            if (oneItem.ranks === '4') {
                newArr.forEach(threeItem => {
                    const obj2 = threeItem.children.find(item => item.value === oneItem.pId)
                    if (obj2) obj2.children.push({value: oneItem.realId, label: oneItem.name})
                })
            }
        })
        state.deviceTree = newArr
    },
    //设置预警定义列表
    SET_ALARM_DEFINE_LIST(state, payload) {
        state.alarmDefineTable = payload
    },
    //操作预警定义列表
    UPDATE_ALARM_DEFINE_LIST(state, payload) {
        const index = state.alarmDefineTable.content.findIndex(item => item.id === payload.id)
        if (index > -1) state.alarmDefineTable.content.splice(index, 1, payload)
        else state.alarmDefineTable.content.push(payload)
    },
    SET_QUERY_UNREAD_COUNT(state, payload) {
        state.queryUnReadCount = payload;
    },
}

export default mutations
