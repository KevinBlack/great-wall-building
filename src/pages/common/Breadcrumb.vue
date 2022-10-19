<template>
    <el-breadcrumb  v-if="showBreadcrumb"  separator-class="el-icon-arrow-right">

        <el-breadcrumb-item v-for="(item,index) in pageBreadcrumb" :key="index">{{item.name}}</el-breadcrumb-item>
        <!-- <el-breadcrumb-item>{{$route.meta.title}}</el-breadcrumb-item> -->


    </el-breadcrumb>
</template>

<script>
import store from '@/store/index'
export default {
  data() {
    return {
      pageBreadcrumb: [],
        showBreadcrumb:true,
    };
  },
  methods: {
    initData() {
      const pathArr =  this.$route.path.split('/')
      store.state.routerList.forEach((menu, i) => {
        if (this.$route.path === menu.url && (this.$route.path === "/index" || this.$route.path === "/personalData")) {
          this.pageBreadcrumb = [menu];
        }

        if(menu.subMenu) menu.subMenu.forEach((subMenu, j) => {
          if (('/' + pathArr[pathArr.length-1]) === subMenu.url) {
            this.pageBreadcrumb = [menu, subMenu];
          } else {
            return;
          }
        });
      });
    },

    updateBreadcrumb(val) {
      const pathArr =  this.$route.path.split('/')
      store.state.routerList.forEach((menu, i) => {
        if (val.path === menu.url && (val.path === "/index" || val.path === "/personalData")) {
          this.pageBreadcrumb = [menu];
        }

        if(menu.subMenu) menu.subMenu.forEach((subMenu, j) => {
          if (('/' + pathArr[pathArr.length-1]) === subMenu.url) {
            this.pageBreadcrumb = [menu, subMenu];
          } else {
            return;
          }
        });
      });
      this.$forceUpdate()
    }
  },
  watch: {
    $route(val) {
      this.updateBreadcrumb(val);
      if(val.path==='/index'){
          this.showBreadcrumb = false;
      }else{
          this.showBreadcrumb = true;
      }
    }
  },
  created() {
    this.initData();
      if(this.$route.path==='/index'){
          this.showBreadcrumb = false;
      }else{
          this.showBreadcrumb = true;
      }
  },
};
</script>

<style scoped>
</style>
