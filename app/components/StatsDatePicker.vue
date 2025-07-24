<template>
    <!-- 통계에 사용되는 날짜선택 Date picker -->
    <div class="stats-date-picker" :style="{ width: props.width ?? '' }">
        <div v-if="props.label" class="stats-date-picker_label" :style="{ width: props.labelWidth ?? '' }">
            {{ props.label }}
        </div>
        <slot></slot>
        <!-- <template>
 <el-date-picker
            v-model="startDate"
            :type="dateType"
            :value-format="valueFormat"
            :placeholder="startPlaceholder ??  L.시작날짜"
            :style="{ flex: 1 }"
            :disabled="disabled"
        />
        <span > ~ </span>
        <el-date-picker
            v-model="endDate"
            :type="dateType"
            :value-format="valueFormat"
            :placeholder="endPlaceholder ?? L.종료날짜"
            :style="{ flex: 1 }"
            :disabled="disabled"
        />
        </template> -->
       
        <template v-if="dateType==='date' || dateType==='month'|| dateType==='year' ">
            <el-date-picker
                v-model="startDate"
                :type="dateType"
                :value-format="valueFormat"
                :placeholder="startPlaceholder ??  L.시작날짜"
                :style="{ flex: 1 }"
                :disabled="disabled"
            />
            <span > ~ </span>
            <el-date-picker
                v-model="endDate"
                :type="dateType"
                :value-format="valueFormat"
                :placeholder="endPlaceholder ?? L.종료날짜"
                :style="{ flex: 1 }"
                :disabled="disabled"
            />
        </template>
        <template v-if="dateType==='week' || dateType==='daily'">
            <el-date-picker
                v-model="startDate"
                type="date"
                :value-format="valueFormat"
                :placeholder="startPlaceholder ?? L.주간선택"
                :style="{ flex: 1 }"
                :disabled="disabled"
            />
            <span > ~ </span>
            <el-date-picker
                v-model="endDate"
                type="date"
                :value-format="valueFormat"
                :placeholder="endPlaceholder ?? L.종료날짜"
                :style="{ flex: 1 }"
                :disabled="disabled"
            />
            <!-- <div class="week-range" v-if="startDate">
                {{ startDate + ' ~ ' + dayjs(startDate).add(6, 'day').format('YYYY-MM-DD') }}
            </div> -->
        </template>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch, type ComputedRef } from 'vue'
import dayjs from 'dayjs'
import { useLangStore } from '~/stores/LangStore'

// 다국어 설정 
const L = useLangStore().lang.common

export interface Props {
    label?: string | null
    labelWidth?: string | null // label 너비 조절
    width?: string | null // 총 너비 조절, 100% 로 설정시 총 너비가 부모노드 너비 맞춤
    startDate: string | null //시작 날짜
    endDate: string | null //종료 날짜
    startPlaceholder?: string | null
    endPlaceholder?: string | null
    type?: 'year' | 'month' | 'week' | 'day' | 'daily' | 'hour' | null // 날짜 격식 년/월/일 종류
    disabled?: boolean
}
const props = defineProps<Props>()
const startDate: any = ref(props.startDate)
const endDate: any = ref(props.endDate)
const dateType: ComputedRef = computed(() => {
    let value = 'date'
    switch (props.type) {
        case 'day':
            value = 'date'
            break
        case 'daily':
            value = 'daily'
            break
        case 'week':
            value = 'week'
            break
        case 'month':
            value = 'month'
            break
        case 'year':
            value = 'year'
            break
        case 'hour':
            value = 'hour'
            break
        default:
            value = 'date'
    }
    console.log('value', value)
    return value
})
const valueFormat = computed(() => {
    let value = ''
    switch (props.type) {
        case 'day':
            value = 'YYYY-MM-DD'
            break
        case 'month':
            value = 'YYYY-MM-DD'
            break
        case 'year':
            value = 'YYYY-MM-DD'
            break
        default:
            value = 'YYYY-MM-DD'
    }
    return value
})
const weekDate: any = computed(()=>{
    return startDate.value + ' ~ ' + dayjs(startDate.value).add(6, 'day').format('YYYY-MM-DD')
})
const emits = defineEmits(['update:startDate', 'update:endDate', 'getWeekDate'])

watch(startDate, () => {
    emits('update:startDate', startDate.value)
})
watch(weekDate, () => {
    emits('getWeekDate', weekDate.value)
})
watch(startDate, () => {
    emits('update:startDate', startDate.value)
})
watch(endDate, () => {

    if(props.type === 'month'){
        endDate.value = dayjs(endDate.value).endOf('month').format('YYYY-MM-DD')
        emits('update:endDate', endDate.value)
    }else if(props.type === 'week'){
        endDate.value =  dayjs(endDate.value).endOf('week').format('YYYY-MM-DD')
        emits('update:endDate', endDate.value)
    }else{
        emits('update:endDate', endDate.value)
    }
})
watch(dateType, () => {
    startDate.value = startDate.value ? dayjs(startDate.value).format(valueFormat.value) : ''
    endDate.value = endDate.value ? dayjs(endDate.value).format(valueFormat.value) : ''
    emits('update:startDate', startDate.value)
    emits('update:endDate', endDate.value)
})
</script>
<style scoped>
.stats-date-picker {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--label-text-color);
}
.stats-date-picker_label {
    color: var(--label-text-color);
}
.week-range {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    background-color: white;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px 12px;
}
</style>
