<template>
    <div id="app">
        <router-view v-if="isActiveRouter"></router-view>
    </div>
</template>
<style>
    @import "../static/css/main.css";
    @import "../static/css/color-dark.css";     /*深色主题*/
    /*@import "../static/css/theme-green/color-green.css";   浅绿色主题*/
</style>
<script>
    export  default {
        provide(){
          return{
                reloadView:this.reloadView,
          }
        },
        data(){
            return {
                isActiveRouter : true
            }
        },
        methods:{
            reloadView(){
                this.isActiveRouter = false;
                this.$nextTick(function () {
                    this.isActiveRouter = true;
                })
            }
        }
    }
</script>
