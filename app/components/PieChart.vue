
<template>
    
    <div class="chart-box">
        <div class="chart-name"> {{ title }}</div>
        <div class="chart" ref="chartRef"></div>
    </div>
</template>
<script lang="ts" setup>
/**
    데이터 분석에 통계 조회에 사용되는 공통 차트 컴포넌트. 주요 line, bar 형태인 차트로 적용된다.
*/
import { onMounted, reactive, ref, toRefs, watch } from 'vue'
import * as echarts from 'echarts'

export interface Props {
    title: string
    unit?: string // y축 단위 등을 표시할때 
    legendData?: string[] 
    seriesData: any[]
    color?: string[] 
    // gridTop?: number
    // gridRight?: number
    legendOrient?: string
    legendLeft?: number

}

const props = defineProps<Props>()
const { title, legendData, seriesData, unit, color, legendOrient, legendLeft } = toRefs(props)


// chart
const chartRef = ref(null)
let myChart: any = null
let option = reactive({
    // color: color.value ?? [CHART_COLOR.RED, CHART_COLOR.ORANGE, CHART_COLOR.GREEN, CHART_COLOR.TEAL, CHART_COLOR.BLUE, CHART_COLOR.GRAY ],
    color: color.value ?? ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4' ],

    legend: {
        data: legendData.value,
        orient: legendOrient.value ?? 'horizontal',
        right: 32,
        left: legendLeft.value ,
        show:false
    },
    
    tooltip: {
        trigger: 'item',
        // textStyle:{
        //     fontSize:16
        // }
    },
    // grid: {
    //     top: gridTop.value?? 40,
    //     left: 32,
    //     right: gridRight.value ?? 32,
    //     bottom: 10,
    //     containLabel: true,
    // },
    series: [
        {
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 0,
                borderColor: '#fff',
                borderWidth: 0
            },
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 22,
                }
            },
            labelLine: {
                show: false
            },
            data: seriesData.value  
        }
    ]
})
function drawChart() {
    option.legend.data = legendData.value
    option.series[0]!.data= seriesData.value
    option && myChart.setOption(option)
}
watch(seriesData, ()=>{
    drawChart()
})
onMounted(() => {
    myChart = echarts.init(chartRef.value)
    drawChart()
    // Resize chart
    new ResizeObserver(() => {
        myChart.resize()
    }).observe(chartRef.value!)
})
</script>
<style scoped>
.chart-box {
    flex: 1;
    height: 100%;
    /* border: 1px solid #dddddd;
    border-radius: 6px; */
    overflow: hidden;
}

.chart-name {
    width: 100%;
    padding: 8px ;
    border-bottom: none;
    text-align: center;
    font-weight: 700;

}

.chart {
    height: calc(100% - 68px);
    width: 100%;
}
</style>
