<template>
    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar v-on:handleCollapse = "handlecallback"></v-sidebar>
        <div ref="contentBox" class="content-box" style="overflow-y: scroll" :class="{'content-collapse':collapse}">
            <v-Breadcrumb style="padding:10px 0 10px 20px;"></v-Breadcrumb>
            <transition name="fade" mode="out-in">
                <keep-alive :include="tagsList">
                    <router-view v-if="isRouterActive" class="zr-row" style="width:100%;min-height:calc(100% - 34px);position: absolute;"></router-view>
                </keep-alive>
            </transition>
        </div>
    </div>
</template>

<script>
    import vHead from './Header.vue';
    import vSidebar from './Sidebar.vue';
    import vTags from './Tags.vue';
    import vBreadcrumb from './Breadcrumb.vue';
    import bus from './bus';
    export default {
        data(){
            return {
                tagsList: [],
                collapse: false,
                isRouterActive:true,
                contentBox: {}
            }
        },
        components:{
            vHead, vSidebar, vTags,vBreadcrumb
        },
        methods:{
        	reload(){
        		this.isRouterActive = false;
        		this.$nextTick(function(){
        			this.isRouterActive = true
        		})
        	},
        	handlecallback(msg){
        		this.$nextTick(function(){
	        		if(msg){
	        			document.getElementsByClassName('content-box')[0].className="content-box collapse-active"
	        		}else{
	        			document.getElementsByClassName('content-box')[0].className="content-box "
	        		}
        		})
        	}
        }
    }
</script>
<style scoped lang="less">


</style>
