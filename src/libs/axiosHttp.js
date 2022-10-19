import axios from 'axios'
import api from './api'
import router from '@/router'
import { Message } from 'element-ui'
import store from '@/store/index'

const axiosHttp = axios.create({
    baseURL: api.baseUrl,
    // timeout: 3000,
    // headers: {
    //     'token':
    //     window.localStorage.csmpToken
    // }
});

//添加请求拦截器
axiosHttp.interceptors.request.use(config => {
    if(window.localStorage.csmpToken) config.headers.token = window.localStorage.csmpToken
    //在发送请求之前做某事
    return config;
},error => {
    //请求错误时做些事
    return Promise.reject(error);
});

//添加响应拦截器
axiosHttp.interceptors.response.use(response => {
    if(response.headers.token) window.localStorage.csmpToken = response.headers.token
    if(response.data.code === 0) {
		// return new Promise((resolve,reject) => {
		// 	resolve(response.data.body)
        // })
        if(response.config.url.indexOf('save') > -1 || response.config.url.indexOf('update') > -1) {
            Message({
                showClose: true,
                message: '保存成功',
                type: 'success',
                duration: 2000
            })
        }
        return response.data.body
    }else {
        if (response.data.code === 1) {
            if(response.data.msg){
                Message({
                    showClose: true,
                    message: response.data.msg,
                    type: 'error',
                    duration: 2000
                })
            }
        }else if (response.data.code === 500) {
            if(response.config.url.indexOf('system/menu/getallmenu') > -1 || response.config.url.indexOf('/auth/oauth/token') > -1) window.localStorage.removeItem('csmpToken')
            // router.replace({
            //     path: '/login'
            // });
        }
        return new Promise((resolve,reject) => {
            reject({code:response.data.code,msg:response.data.msg})
        })
    }
},error => {
    if(error.response) {
        if(error.response.data.code === 401) {
            Message({
                showClose: true,
                message: '登录超时',
                type: 'error',
                duration: 2000
            })
            window.localStorage.removeItem('csmpToken')
            store.state.menuList = []
            router.replace({
                path: '/login',
                query: {
                    redirect: window.location.href.split('/#/')[1].split('?')[0]
                } //登录成功后跳入浏览的当前页面
            });
        }
        return Promise.reject(error.response.data) // 返回接口返回的错误信息
    }else {
        return Promise.reject(error) // 返回接口返回的错误信息
    }
});

export default axiosHttp
