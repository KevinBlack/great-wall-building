import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
import { Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import store from './store'
import { api } from '@/libs'
import "babel-polyfill";
import clipboard from 'clipboard';

import $ from 'jquery'
import '../static/js/jquery.ztree.all-3.5.40.min.js'
//import '../static/js/date.js'

//引入不支持的一些方法
import '../src/config/polyfill'

//引入css样式
import '../static/css/index.less'

//注册过滤器和指令
import { directive, filter } from '@/libs';
Object.entries(filter).forEach(item => Vue.filter(item[0],item[1]))
Object.entries(directive).forEach(item => Vue.directive(item[0],item[1]))

// 引入注册全局组件
import * as GlobalComponents from './components/libs'
Object.entries(GlobalComponents).forEach(item => Vue.component(item[0],item[1]))

// 全局引入echarts
import echarts from 'echarts'

Vue.prototype.$echarts = echarts


import Print from 'vue-print-nb'

Vue.use(Print);  //打印
// import fullCalendar from 'vue-fullcalendar'

// Vue.component('full-calendar', fullCalendar)
ElementUI.Dialog.props.closeOnClickModal.default=false;

Vue.prototype.clipboard = clipboard;
Vue.prototype.axios = axios
Vue.use(ElementUI, {
	size: 'small'
});
Vue.prototype.axios = axios
Vue.prototype.$httpPost = function(url, params) {
	return this.axios({
		method: 'post',
		url: api.baseUrl + url,
		data: params,
		headers: {
			'token': window.localStorage.csmpToken
		},
	})
}

Vue.prototype.$http = function(method, url, params) {
	return this.axios({
		method: method,
		url: api.baseUrl + url,
		headers: {
			'token': window.localStorage.csmpToken
		},
		data: params
	})
}
Vue.prototype.$httpGet = function(method, url, params) {
	return this.axios({
		method: method,
		url: api.baseUrl + url,
		headers: {
			'token': window.localStorage.csmpToken
		},
		params: params
	})
}
Vue.prototype.$httpNoToken = async  function(method, url, params) {
	    return await this.axios({
	        method: method,
	        url: api.baseUrl + url,
	        data: params
	    })
	}
// http response 服务器响应拦截器，这里拦截401错误，并重新跳入登页重新获取token
axios.interceptors.response.use(
	response => {
		if(response.headers.token) window.localStorage.csmpToken = response.headers.token
		if(response.data.code === 0) {
			// return new Promise((resolve,reject) => {
			// 	resolve(response.data.body)
			// })
			if(response.config.url.indexOf('save') > -1 || response.config.url.indexOf('update') > -1) {
				Message({
					showClose: true,
                    message: '操作成功',
                    type: 'success',
                    duration: 2000
				})
			}
        	// return response.data.body
			return response
		}else if (response.data.code === 1) {
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
			// 	path: '/login'
			// });
		}

    	return new Promise((resolve,reject) => {
			reject({code:response.data.code,msg:response.data.msg})
		})
	},
	error => {
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
//使用钩子函数对路由进行权限跳转
//router.beforeEach((to, from, next) => {
//  const role = localStorage.getItem('csmpToken');
//  if(!role && to.path !== '/login'){
//      next('/login');
//  }
////  else if(to.meta.permission){
////      // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
////      role === 'admin' ? next() : next('/403');
////  }
//  else{
//      // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
//      if(navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor'){
//          Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
//              confirmButtonText: '确定'
//          });
//      }else{
//          next();
//      }
//  }
//})


//使用钩子函数对路由进行权限跳转
//router.beforeEach((to, from, next) => {
//  const role = localStorage.getItem('csmpToken');
//  if(!role && to.path !== '/login'){
//      next('/login');
//  }
////  else if(to.meta.permission){
////      // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
////      role === 'admin' ? next() : next('/403');
////  }
//  else{
//      // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
//      if(navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor'){
//          Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
//              confirmButtonText: '确定'
//          });
//      }else{
//          next();
//      }
//  }
//})

new Vue({
	router,
	store,
    render: h => h(App)
}).$mount('#app');


