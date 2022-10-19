<template>
    <div :ref="ref">

    </div>
</template>
<script>
import echarts from "echarts/lib/echarts";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/theme/vintage";
import { util } from "@/libs";
export default {
  props: { option: { required: true }, type: { default: "bar" } },
  data() {
    return {
      ref: util.uuid()
    };
  },
  methods: {
    initEcharts(data,type){
        var colors = ['#5793f3', '#1E90FF', '#675bba']
        if(!type){
            return {
                backgroundColor: data.backgroundColor,
                title:{
                    text: data.title,
                    x:'center',
                    textStyle:{
                        fontWeight:'normal',
                        color: '#fff'
                    }
                },
                color: colors,
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',   //shadow,cross
                        crossStyle: {
                            color: '#999'
                        }
                    }
                },
                toolbox: {
                    show : true,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data : data.x,
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
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series: [
                    {
                        name:data.text,
                        type:'bar',
                        barWidth: '40%',
                        data:data.y
                    }
                ]
            }
        }else if(type === 'line'){
            return {
                backgroundColor: '#fff',
                tooltip:{
                    formatter: data.tooltipFormatter,
                    // textStyle: {
                    //     width: 50
                    // },
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999'
                        }
                    }
                },
                toolbox: {
                    show : true,
                    feature: {
                        // dataView: {show: true, readOnly: false},
                        magicType: {show: true, type: ['line', 'bar']},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                color: colors,
                legend:  {
                    x: 'center',
                    top: '30px',
                    textStyle: {
                        // color: '#fff'
                    },
                    data:data.legend
                },
                title:{
                    text:data.title,
                    x:'center',
                    textStyle: {
                        // color: '#fff'
                    }
                },
                yAxis: [
                    {
                        type : 'value',
                        name : data.y.name,
                        position: 'left',
                        splitNumber:5,
                        axisLabel: {
                            formatter: '{value}',
                            show: true,
                            textStyle: {
                                color: '#000'
                            }
                        },
                        tooltip: {
                            trigger: 'axis',
                        }
                    }
                ],
                xAxis: [
                    {
                        type : 'category',
                        name : data.x.name,
                        axisTick: {
                            alignWithLabel: true
                        },
                        data: data.x.list,
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#000'
                            }
                        }
                    }
                ],
                series: data.y.series
            };
        }else if(type==='pie'){
            return  {
                backgroundColor: '#fff',
                title : {
                    text: data.title,
                    x:'center'
                },
                toolbox: {
                    feature: {
                        // dataView: {show: true, readOnly: false},
                        magicType: {show: true, type: ['line', 'bar']},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: data.legend
                },
                series : [
                    {
                        name: data.series.name,
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data: data.series.list,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
        }
    }
  },
  mounted() {
      const myChart = echarts.init(this.$refs[this.ref], "vintage")
      myChart.setOption(this.initEcharts(this.$props.option,this.$props.type))
  },
  created() {
  }
};
</script>