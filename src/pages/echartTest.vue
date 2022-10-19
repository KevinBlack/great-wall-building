<template>
    <div class="p-15" style="background:#1874CD">
        <el-row>
            <el-col :span="12">
                <VueEcharts :option="data1" :type="'line'" class="w-100 b-1 c-white" style="background:#1874CD" :style="heightStyle"></VueEcharts>
            </el-col>
            <el-col :span="12">
                <VueEcharts :option="data2" :type="'line'" class="w-100 b-1" style="background:#1874CD" :style="heightStyle"></VueEcharts>
            </el-col>
        </el-row>
        <el-row class="m-t-20">
            <el-col :span="12">
                <VueEcharts :option="data3" :type="'line'" class="w-100 b-1" style="background:#1874CD" :style="heightStyle"></VueEcharts>
            </el-col>
            <el-col :span="12">
                <VueEcharts :option="data4" :type="'line'" class="w-100 b-1" style="background:#1874CD" :style="heightStyle"></VueEcharts>
            </el-col>
        </el-row>
    </div>
</template>

<script src="http://cdn.bootcss.com/echarts/3.2.2/echarts.min.js"></script>
<script src="http://echarts.baidu.com/asset/map/js/china.js"></script>
<script>
window.$ = window.jQuery = require('jquery');
import { VueEcharts } from '@/components/libs'
import zhejiang from 'echarts/map/js/province/zhejiang' 
import shanxi from 'echarts/map/js/province/shanxi' 
import xianggang from 'echarts/map/js/province/xianggang' 
import henan from 'echarts/map/js/province/henan'
import liaoning from 'echarts/map/js/province/liaoning'
import shanxi1 from 'echarts/map/js/province/shanxi1'
// import yuncheng from 'echarts/map/js/city/yuncheng' 
import 'echarts/map/js/china.js';
export default {
    data() {
        let colors = ['#5793f3', '#1E90FF', '#675bba']
        return {
            heightStyle:'',
            data1:{
                backgroundColor: '#1874CD',
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999'
                        }
                    }
                },
                toolbox: {
                    feature: {
                        dataView: {show: true, readOnly: false},
                        magicType: {show: true, type: ['line', 'bar']},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                color: colors,
                legend:  {
                    x: 'center',
                    top: '30px',
                    data:['订单数','订单数2','订单数3'],
                    textStyle: {
                        color: '#fff'
                    }
                },
                title:{
                    text:'阿斯达四大',
                    x:'center',
                    textStyle: {
                        color: '#fff'
                    }
                },
                yAxis: [
                    {
                        type : 'value',
                        name : '订单数',
                        position: 'left',
                        splitNumber:5,
                        axisLabel: {
                            formatter: '{value}',
                            show: true,
                            textStyle: {
                                color: '#fff'
                            }
                        },
                        tooltip: {
                            trigger: 'axis',
                        }
                    },
                    {
                        type: 'value',
                        name: '订单数2',
                        min: 0,
                        max: 250,
                        position: 'right',
                        axisLine: {
                            lineStyle: {
                                color: colors[0]
                            }
                        },
                        axisLabel: {
                            formatter: '{value} ml',
                            show: true,
                            textStyle: {
                                color: '#fff'
                            }
                        }
                    },
                    // {
                    //     type: 'value',
                    //     name: '订单数3',
                    //     min: 0,
                    //     max: 250,
                    //     position: 'right',
                    //     offset: 50,
                    //     axisLine: {
                    //         lineStyle: {
                    //             color: colors[1]
                    //         }
                    //     },
                    //     axisLabel: {
                    //         formatter: '{value} ml'
                    //     }
                    // },
                ],
                xAxis: [
                    {
                        type : 'category',
                        data : ['1-01','1-02','1-03','1-04','1-05','1-06','1-07'],
                        color: '#000',
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#fff'
                            }
                        }
                    }
                ],
                series: [
                    {
                        type:'bar',
                        name : '订单数',
                        yAxis: 1,
                        barGap: 0,
                        itemStyle:{normal:{color:colors[0]}},
                        data: ['101','102','103','104','105','106','107']
                    },
                    {
                        type:'bar',
                        name : '订单数2',
                        yAxis: 2, 
                        itemStyle:{normal:{color:colors[1]}},
                        data: ['111','112','113','114','115','116','117']
                    },
                    {
                        type:'line',
                        name : '订单数3',
                        yAxis: 2, 
                        itemStyle:{normal:{color:colors[2]}},
                        data: ['311','312','313','314','315','316','317']
                    }
                ]
            },
            data2:{
                backgroundColor: '#1874CD',
                title : {
                    text: '某站点用户访问来源',
                    x:'center'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
                },
                series : [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data:[
                            {value:335, name:'直接访问'},
                            {value:310, name:'邮件营销'},
                            {value:234, name:'联盟广告'},
                            {value:135, name:'视频广告'},
                            {value:1548, name:'搜索引擎'}
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            },
            data3:{
                backgroundColor: '#1874CD',
                tooltip : {
                    formatter: "{a} <br/>{c} {b}"
                },
                toolbox: {
                    show : true,
                    feature : {
                        mark : {show: true},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                series : [
                    {
                        name:'速度',
                        type:'gauge',
                        min:0,
                        max:100,
                        // splitNumber:11,
                        radius: '50%',
                        axisLine: {            // 坐标轴线
                            lineStyle: {       // 属性lineStyle控制线条样式
                                color: [[0.09, 'lime'],[0.82, '#1e90ff'],[1, '#ff4500']],
                                width: 3,
                                shadowColor : '#fff', //默认透明
                                shadowBlur: 10
                            }
                        },
                        axisLabel: {            // 坐标轴小标记
                            textStyle: {       // 属性lineStyle控制线条样式
                                fontWeight: 'bolder',
                                color: '#fff',
                                shadowColor : '#fff', //默认透明
                                shadowBlur: 10
                            }
                        },
                        axisTick: {            // 坐标轴小标记
                            length :15,        // 属性length控制线长
                            lineStyle: {       // 属性lineStyle控制线条样式
                                color: 'auto',
                                shadowColor : '#fff', //默认透明
                                shadowBlur: 10
                            }
                        },
                        splitLine: {           // 分隔线
                            length :25,         // 属性length控制线长
                            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                width:3,
                                color: '#fff',
                                shadowColor : '#fff', //默认透明
                                shadowBlur: 10
                            }
                        },
                        pointer: {           // 分隔线
                            shadowColor : '#fff', //默认透明
                            shadowBlur: 5
                        },
                        title : {
                            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                fontWeight: 'bolder',
                                fontSize: 20,
                                fontStyle: 'italic',
                                color: '#fff',
                                shadowColor : '#fff', //默认透明
                                shadowBlur: 10
                            }
                        },
                        detail : {
                            backgroundColor: 'rgba(30,144,255,0.8)',
                            borderWidth: 1,
                            borderColor: '#fff',
                            shadowColor : '#fff', //默认透明
                            shadowBlur: 5,
                            offsetCenter: [0, '50%'],       // x, y，单位px
                            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                fontWeight: 'bolder',
                                color: '#fff'
                            }
                        },
                        data:[{value: 90, name: ''}]
                    },
                ]
            },
            data4: {
                backgroundColor: '#414e5c',
                title: {
                    text: '河南人口密度',
                    x:'center'
                },
                series: [
                    {
                        type: 'map',
                        mapType: 'china',
                        label: {
                            emphasis: {
                                textStyle: {
                                    color: '#fff'
                                }
                            }
                        },
                //         itemStyle:{
                //             normal:{label:{show:true}},
                //             emphasis:{label:{show:true}}
                //         },
                        itemStyle: {
                            normal: {
                                borderColor: '#fff',
                                areaColor: '#7cbfe1',
                                label:{show:false}
                            },
                            emphasis: {
                                areaColor: '#389BB7',
                                borderWidth: 0
                            }
                        },
                        data:[
                            {name: '朝阳市', value: 50000}
                        ]
                    }
                ],
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}<br/>{c} (p / km2)'
                },
                toolbox: {
                    show: true,
                    orient: 'vertical',
                    left: 'right',
                    top: 'center',
                    feature: {
                        dataView: {readOnly: false},
                        restore: {},
                        saveAsImage: {}
                    }
                },
                visualMap: {
                    min: 800,
                    max: 50000,
                    text:['High','Low'],
                    realtime: false,
                    calculable: true,
                    inRange: {
                        color: ['green', 'red']
                    }
                },
                // series: [
                //     {
                //         name: '香港18区人口密度',
                //         type: 'map',
                //         mapType: '辽宁',
                //         itemStyle:{
                //             normal:{label:{show:true}},
                //             emphasis:{label:{show:true}}
                //         },
                //         data:[
                //             {name: '郑州市', value: 20057.34},
                //             {name: '湾仔', value: 15477.48},
                //             {name: '东区', value: 31686.1},
                //             {name: '南区', value: 6992.6},
                //             {name: '油尖旺', value: 44045.49},
                //             {name: '深水埗', value: 40689.64},
                //             {name: '九龙城', value: 37659.78},
                //             {name: '黄大仙', value: 45180.97},
                //             {name: '观塘', value: 55204.26},
                //             {name: '葵青', value: 21900.9},
                //             {name: '荃湾', value: 4918.26},
                //             {name: '屯门', value: 5881.84},
                //             {name: '元朗', value: 4178.01},
                //             {name: '北区', value: 2227.92},
                //             {name: '大埔', value: 2180.98},
                //             {name: '沙田', value: 9172.94},
                //             {name: '西贡', value: 3368},
                //             {name: '离岛区', value: 80600.98}
                //         ]
                //     }
                // ]
            }
        }
    },
    components: {
        VueEcharts
    },
    methods:{
        randomData() {
            return Math.round(Math.random()*1000);
        }
    },
    created() {
        var h = document.documentElement.clientHeight || document.body.clientHeight
        this.heightStyle = 'height:' + (window.screen.availHeight - 50)/2 + 'px'
    }

}
</script>

<style>

</style>
