<template>
    <div class="wrap">
        <div class="subContent" ref="subContent">
            <vue-topo :editable="editable"
                :topo-data="topoData">
            </vue-topo>
        </div>
    </div>
</template>

<script>
import { axiosHttp } from '@/libs'
export default {
    data () {
        return {
            topoData: {},
            editable: true
        }
    },
    mounted () {
        const initNoedsWidth = this.$refs.subContent.offsetWidth - (this.editable?250:0)
        const initNoedsHeight = initNoedsWidth/4 * 3
        axiosHttp.post('/manage/topoNode/queryNodes',{floorId:1}).then(res => {
            this.topoData = res
            this.topoData.nodes.forEach(item => {
                item.x = item.x/res.width * initNoedsWidth
                item.y = item.y/res.height * initNoedsHeight
            })
        })
    },
    created () {
    }
}
</script>

<style>

</style>
