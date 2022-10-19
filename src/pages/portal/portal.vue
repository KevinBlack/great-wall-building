<template>
    <iframe  :src="portalUrl"></iframe>
</template>

<script>
    export default {
        data() {
            return {
                portalUrl:''
            }
        },
        // 页面加载时执行
        created: function() {
            this.getPortalUrl();
        },
        methods: {
            getPortalUrl(){
                this.$httpPost('/system/portal/getPortalURL', {
                }).then(res => {
                    this.portalUrl = res.data.body;
                })
            }
        }
    }
</script>

<style scoped>

</style>
