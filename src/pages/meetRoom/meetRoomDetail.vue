<template>
    <div class="wrap">
        <div class="subContent zr-row">
            <el-tabs type="card" v-model="tabSelected" @tab-click="handleClick">
                <el-tab-pane label="会议室描述" name="firstService">
                    <div class="tableWrap" v-if="tabSelected === 'firstService'">
                        <el-form  :model="editform" :rules="rules" ref="editform"  label-width="100px">
                            <el-col :span="24">
                                <el-form-item label="会议室名称" prop="meetRoomName">
                                    <!-- 会议室名称 -->
                                    <el-input v-model="editform.meetRoomName" :disabled="isDetail"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <!--<el-form-item label="会议室位置" prop="meetRoomArea">
                                    <el-input v-model="editform.meetRoomArea" :disabled="isDetail"></el-input>
                                </el-form-item>-->
                                <el-form-item label="会议室位置" prop="meetRoomArea">

                                    <el-input v-model="editform.meetRoomArea" v-on:click.native="selectHouse" disabled  placeholder="会议室位置"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="面积" prop="meetRoomAcreage">
                                    <!-- 面积 -->
                                    <el-input :value="editform.meetRoomAcreage + ' (平方米)'" :disabled="isDetail"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="容纳人数" prop="meetRoomCapacity">
                                    <!-- 容纳人数 -->
                                    <el-input :value="editform.meetRoomCapacity + ' (人)'" :disabled="isDetail"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="所含设备" prop="deviceName">
                                    <!-- 所含设备 -->
                                    <el-input v-model="editform.deviceName" :disabled="isDetail"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="是否收费" prop="chargeSituation">
                                    <el-radio-group v-model="editform.chargeSituation" @change="chargeSituationChange" :disabled="isDetail">
                                        <el-radio label="0">是</el-radio>
                                        <el-radio label="1">否</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="单价" prop="unitPrice">
                                    <!-- 单价 -->
                                    <el-input :value="editform.unitPrice + ' (元/小时)'" :disabled="isDetail" ></el-input>
                                </el-form-item>
                            </el-col>
                            <!--<el-col :span="12">
                                <el-form-item label="负责人id" prop="principalId">
                                    <el-input v-model="editform.principalId" :disabled="isDetail"></el-input>
                                </el-form-item>
                            </el-col>-->
                            <el-col :span="12">
                                <el-form-item label="负责人" prop="principalName">
                                    <!-- 负责人名字 -->
                                    <el-input v-model="editform.principalName" :disabled="isDetail"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="负责人电话" prop="principalTel">
                                    <!-- 负责人电话 -->
                                    <el-input v-model="editform.principalTel" :disabled="isDetail"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="会议室简介" prop="meetRoomIntroduction">
                                    <!-- 会议室简介 -->
                                    <el-input maxlength="100" type="textarea" :rows="5"  v-model="editform.meetRoomIntroduction" :disabled="isDetail"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="会议室照片" prop="photoId">
                                    <!-- 会议室照片 -->
                                    <!--<el-input v-model="editform.photoId" :disabled="isDetail"></el-input>-->
                                    <div class="zr-row">
	                               		<!-- <div v-for="(item,index) in files" :key="index" > -->
								          <img  v-if="imgSrc" :src="imgSrc" width="148px" height="148px">
								        <!-- </div> -->
                                    </div>

                             </el-form-item>
                            </el-col>

                        </el-form>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="预约情况" name="secondService">
                    <div id="calendar"></div>
                </el-tab-pane>

            </el-tabs>
        </div>
    </div>
</template>
<script>
    import {} from '../../../static/js/fullcalendar.min.js'
    window.$ = window.jQuery = require('jquery');
    import { axiosHttp, api, dict, util } from '@/libs'
    import Vue from 'vue'
    import { mapActions } from 'vuex'
    export default {
        data(){
            return {
                imgSrc: '',
                tabSelected: "firstService",
                meetRoomInfoId:'',
                meetphotoId:'',
                editform: {},
                download :api.fileserver + 'download?fileId=',
                files:[],
                isDetail: true,
                rules: {},
                startTimeIndex: 0
            }
        },

        methods:{
            handleClick(tab, event) {
                let name = tab._props.name
                if(name === "secondService") {
                    this.queryCalendarByMeetRoomInfoId()
                } else {

                }
            },
            queryCalendarByMeetRoomInfoId() {
                let params = {
                    meetRoomInfoId:this.$route.query.meetRoomInfoId,
                    preMeetStartTime: util.getTime(this.startTimeIndex),
                    preMeetEndTime: util.getTime(this.startTimeIndex - 6),
                }
                axiosHttp.post('/serveorder/meetRoomReserve/queryCalendarByMeetRoomInfoId', params).then(res => {
                    let events = []
                    res.forEach(item => {
                        events.push({title:item.reservationUnit,start:Vue.filter('dateFormat')(item.preMeetStartTime),end:Vue.filter('dateFormat')(item.preMeetEndTime)})
                    })
                    // 获取相关预约信息
                    $('#calendar').fullCalendar({
                        header: {
                            left: 'prev,next today',
                            center: 'title',
                            right: ''
                        },
                        defaultDate: params.preMeetStartTime,
                        allDaySlot: false, //在agenda视图模式下，是否在日历上方显示all-day(全天)
                        // formatDate:{ monthNames : ['一月','二月', '三月', '四月', '五月', '六月', '七月','八月', '九月', '十月', '十一月', '十二月'],dayNames: ['星期日', '星期一', '星期二', '星期三','星期四', '星期五', '星期六']},
                        locale: 'zh-cn',
                        defaultView:'agendaWeek',
                        navLinks: true, // can click day/week names to navigate views
                        editable: false, // 是否可编辑
                        eventLimit: true, // allow "more" link when too many events
                        events: events,
                        // events: (date, allDay, jsEvent, view) => {
                        // },
                        dayClick: (date, allDay, jsEvent, view) => {

                        },
                        eventClick: (event, jsEvent, view) => {

                        },
                        eventMouseover: (event, jsEvent, view) => {
                        },
                    });
                    $('.fc-prev-button').click(() => {
                        $('#calendar').fullCalendar('destroy')
                        this.startTimeIndex += 7
                        this.queryCalendarByMeetRoomInfoId()
                    })
                    $('.fc-next-button').click(() => {
                        $('#calendar').fullCalendar('destroy')
                        this.startTimeIndex -= 7
                        this.queryCalendarByMeetRoomInfoId()
                    })
                    $('.fc-today-button').click(() => {
                        $('#calendar').fullCalendar('destroy')
                        this.startTimeIndex = 0
                        this.queryCalendarByMeetRoomInfoId()
                    })
                })
            },
            queryMeetRoomInfo(){
                axiosHttp.post('/serveorder/meetRoomInfo/get', {
                    id: this.meetRoomInfoId,
                }).then(res => {
                    console.info(res);
                    this.meetphotoId = res.photoId;
                    if(this.meetphotoId){
                        this.imgSrc = api.baseUrl + "/serveorder/meetRoomInfo/getFileUrl?id=" + this.meetphotoId
                    }
                    this.editform = Object.assign({},res);
                    this.files = res.photoId.split(",");
                })
            },
            chargeSituationChange() {

            }
        },
        // 页面加载时执行
        created: function() {
            const _this = this
            this.meetRoomInfoId=this.$route.query.meetRoomInfoId;
            this.queryMeetRoomInfo()

        },
    }
</script>

<style lang="less">
    .fc-content{
        padding: 0 20px;
        height: 100% !important;
        display: -webkit-box;
        display: flex;
        display: -ms-flexbox;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -ms-flex-direction: column;
        flex-direction: column;
        -ms-flex-wrap: nowrap;
        flex-wrap: nowrap;
        -webkit-box-pack: start;
        -ms-flex-pack: start;
        justify-content: flex-start;
        -webkit-box-align: stretch;
        -ms-flex-align: stretch;
        align-items: stretch;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
    }
    img{
        border: none;
    }
</style>
