<template>
    <div>
        <div class="zr-column w-100" :class="{'content-collapse':collapse}">
            <transition name="move" mode="out-in">
                <keep-alive :include="tagsList">
                    <router-view v-if="isRouterActive" class="zr-row" style="width:100%;min-height:100%;"></router-view>
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
                isRouterActive:true
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
