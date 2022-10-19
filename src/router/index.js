import Vue from 'vue';
import Router from 'vue-router';
import { routes, pages } from './routes'
import store from '../store/index'

Vue.use(Router);

const router = new Router({ mode: 'hash', routes })

router.beforeEach((to, from, next) => {
    if(window.localStorage.csmpToken) {
        if(store.state.menuList && store.state.menuList.length === 0 && !store.state.isNoMenu) {
            store.dispatch('getMenuList').then(() => {
                let routerTemp = {
                    path: '/index',
                    component: resolve => require(['../pages/common/Home.vue'], resolve),
                    meta: { title: '首页' },
                    children:[]
                }
                routerTemp.children = pages.concat(store.state.menuList).map(item => {
                    return {
                        path: item.url,
                        component: resolve => require(['../pages' + (item.subMenu&&item.subMenu.length > 0?'/common/baseHome':item.url) + '.vue'], resolve),
                        meta: { title: item.name },
                        children: item.subMenu?item.subMenu.map(subMenu => {
                            return {
                                path: item.url + subMenu.url,
                                component: resolve => require(['../pages' + item.url + subMenu.url + '.vue'], resolve),
                                meta: { title: subMenu.name }
                            }
                        })
                        :[]
                    }
                })
                store.state.routerList = pages.concat(store.state.menuList)
                router.addRoutes([routerTemp])
                next({ path: to.path, query: to.query, params: to.params })
            })
        }else next()
    } else {
        if(to.path === '/login') next()
        else next({ path: '/login', query: to.query, params: to.params })
    }
})

router.afterEach(to => {
    if(to.matched.length === 0) router.push('/404')
    store.commit('SET_CLEAR_INTERVAL')
})

export default router
