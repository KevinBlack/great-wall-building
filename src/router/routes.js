const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: resolve => require(['../pages/Login.vue'], resolve)
    },
    {
        path: '/404',
        component: resolve => require(['../pages/404.vue'], resolve)
    },
    {
        path: '/403',
        component: resolve => require(['../pages/403.vue'], resolve)
    },
    {
        path: '/echartTest',
        component: resolve => require(['../pages/echartTest.vue'], resolve)
    },
    {
        path: '/topoTest',
        component: resolve => require(['../pages/topoTest.vue'], resolve)
    },
]

const pages = [
    {
        url: '/personalData',
        name: '个人资料'
    },
    {
        url: '/message',
        name: '消息' ,
        subMenu: [
            {
                url: '/messageOnline',
                name: '我的消息'
            },
            {
                url: '/messageOnlineCompany',
                name: '我的消息'
            }
        ]
    },{
        url: '/meetRoom/meetRoomDetail',
        name: '会议室预约详情'
    }
]

export { routes, pages }
