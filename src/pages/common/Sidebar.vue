<template>
	<div class="sidebar">
		<!--<img src="static/img/left-title.png" style="display: block;"/>-->
		<div class="collapseWrap" style="">
			<i @click="changeCollapse" class="icon collapse iconfont icon-xiangzuozhedie-"></i>
		</div>
		<el-menu ref="menuList" :collapse="collapse" class="sidebar-el-menu" @select="handleSelect" @open="onMenuChange" background-color="#003277" :default-active="$route.path" :default-openeds="openedList" text-color="#bfcbd9" active-text-color="#fff" unique-opened>
			<template v-for="item in menuList">
				<template v-if="item.subMenu.length!=0">
					<el-submenu :index="item.url" :key="item.index">
						<template slot="title">
							<i :class="item.icon" style="opacity: 0.8;color: #fff"></i><span slot="title"> {{ item.name }}</span>
						</template>
						<el-menu-item  v-for="(subItem,i) in item.subMenu" :key="i" :index="subItem.url" :class="{'is-active':('/' + pathArr[pathArr.length - 1] === subItem.url)}">
							<i :class="subItem.icon"></i> <span slot="title"> {{ subItem.name }}</span>
						</el-menu-item>
					</el-submenu>
				</template>
				<template v-else>
					<el-menu-item :index="item.url" :key="item.index">
						<i :class="item.icon" style="opacity: 0.8;color: #fff"></i><span slot="title"> {{ item.name }}</span>
					</el-menu-item>
				</template>
			</template>
		</el-menu>
</div>
</template>


<script>
	import bus from '../common/bus';
	import store from '@/store/index'
	import { mapState } from 'vuex'
	export default {
		data() {
			return {
				collapse: false,
				pathArr:  this.$route.path.split('/'),
				openedList: []
			}
		},
		computed: {
			...mapState({
				menuList: state => state.menuList
			})
		},
		watch: {
			collapse(val){
				this.$emit('handleCollapse',val)
			},
			$route(val,oldVal) {
				this.pathArr = val.path.split('/')
				if(this.pathArr[1] !== 'index') {
					this.$refs.menuList.open('/' + this.pathArr[1])
					//首页有onresize,其他页面解绑
					window.onresize = ''
				}
				else this.$refs.menuList.close('/' + oldVal.path.split('/')[1])
			}
		},
		methods: {
			onMenuChange(index,path){
			},
			handleSelect(index,path) {
				// this.$router.push(path[1]?path[1]:path[0])
				this.$router.push(path[0] + (path[1]?path[1]:''))
			},
			changeCollapse(){
				if(this.collapse ){
					document.getElementsByClassName('collapseWrap')[0].className=' collapseWrap '
					document.getElementsByClassName('collapse')[0].className=' icon collapse iconfont icon-xiangzuozhedie- '
				}else{
					document.getElementsByClassName('collapse')[0].className=' icon collapse iconfont icon-xiangyouzhankai- '
					document.getElementsByClassName('collapseWrap')[0].className=' collapseWrap collapse-on'
				}
				this.collapse  = !(this.collapse)
			}

		},
		created() {
			this.$emit('handleCollapse',this.collapse)
			this.menuList.forEach(item => {
				if(item.url === ('/' + this.pathArr[1])) this.openedList.push(item.url)
			})
		},
	}
</script>

<style scoped>
	.sidebar {
		display: block;
		position: absolute;
		left: 0;
		top: 50px;
		bottom: 0;
		overflow-y: scroll;
	}

	.sidebar::-webkit-scrollbar {
		width: 0;
	}

	.sidebar-el-menu:not(.el-menu--collapse) {
		width: 200px;
	}

	.sidebar>ul {
		height: 100%;
	}

	.el-menu-item.is-active {
		background-color: #004ab3 !important;
	}
</style>
