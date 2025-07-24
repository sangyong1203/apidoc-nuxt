
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
    xAxisData: string[] // x 좌표 선 아래 표시하는 데이터 
    seriesData: any[] // 데이터 및 차트 line 혹은 bar 설정
    type: 'line' | 'bar' // 차트 형식, bar 혹 line 형
    unit?: string // y축 단위 등을 표시할때 
    legendData?: string[] // 예: ['A제품','B제품','C제품',]
    color?: string[] 
    boundaryGap?: boolean
    gridTop?: number // 차트 위치 조절
    gridRight?: number // 차트 위치 조절
    gridLeft?: number // 차트 위치 조절
    girdBottom?: number // 차트 위치 조절
    legendOrient?: string // legend 방향
    legendLeft?: number //  legend 좌측 위치조절
    yMax?: number // y축 최대 수치

}

const props = defineProps<Props>()
const { title, legendData, xAxisData, seriesData, unit, color, type, gridTop, gridRight, gridLeft, girdBottom, legendOrient, legendLeft, yMax } = toRefs(props)


// chart
const chartRef = ref(null)
let myChart: any = null
let option = reactive({
    color: color.value ?? ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4' ],

    legend: {
        data: legendData.value,
        orient: legendOrient.value ?? 'horizontal',
        right: 32,
        left: legendLeft.value ,
    },
    tooltip: {},
    xAxis: {
        type: 'category',
        boundaryGap: type.value === 'bar' ? true : false,
        data: xAxisData.value
    },
    yAxis: {
        type: 'value',
        name: '단위: ' + unit.value,
        max: yMax.value
    },
    grid: {
        top: gridTop.value?? 40,
        left: gridLeft.value?? 32,
        right: gridRight.value ?? 32,
        bottom: girdBottom.value?? 10,
        containLabel: true,
    },
    series: [
        {
            data: seriesData.value,
            type: 'line'
        }
    ]
})
function drawChart() {
    option.legend.data = legendData.value
    option.xAxis.data = xAxisData.value
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
    /* border: 1px solid #dddddd; */
    /* border-radius: 6px; */
    overflow: hidden;
}

.chart-name {
    width: 100%;
    padding: 24px 24px 12px 24px ;
    border-bottom: none;
    text-align: left;
    font-weight: 700;

}

.chart {
    height: calc(100% - 68px);
    width: 100%;
}
</style>
