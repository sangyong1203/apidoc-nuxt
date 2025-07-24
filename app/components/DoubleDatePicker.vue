<template>
    <div class="double-date-picker" :style="{ width: props.width ?? '' }">
        <div v-if="props.label" class="double-date-picker_label" :style="{ width: props.labelWidth ?? '' }">
            {{ props.label }}
        </div>
        <div style="display: flex; align-items: center; gap: 4px;">
            <slot></slot>
            <el-date-picker
                v-model="startDate"
                :type="dateType"
                :value-format="valueFormat"
                :placeholder="startPlaceholder ?? '시작날짜'"
                :style="{ flex: 1 }"
                :disabled="disabled"
            />
            <span v-if="props.type !== 'week' && props.type !== 'hour'"> ~ </span>
            <el-date-picker
                v-if="props.type !== 'week' && props.type !== 'hour'"
                v-model="endDate"
                :type="dateType"
                :value-format="valueFormat"
                :placeholder="endPlaceholder ?? '종료날짜'"
                :style="{ flex: 1 }"
                :disabled="disabled"
            />
            <div class="week-range" v-if="props.type === 'week' && startDate">
                {{ weekDate }}
            </div>
        </div>
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
    type?: 'year' | 'month' | 'week' | 'day' | 'hour' | null // 날짜 격식 년/월/일 종류
    disabled?: boolean
}
const props = defineProps<Props>()
const startDate: any = ref(props.startDate)
const endDate: any = ref(props.endDate)
const weekDate: any = computed(()=>{
    return startDate.value + ' ~ ' + dayjs(startDate.value).add(6, 'day').format('YYYY-MM-DD')
})
const dateType: ComputedRef = computed(() => {
    let value = 'date'
    switch (props.type) {
        case 'day':
            value = 'date'
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
            value = 'YYYY-MM'
            break
        case 'year':
            value = 'YYYY'
            break
        default:
            value = 'YYYY-MM-DD'
    }
    return value
})
const emits = defineEmits(['update:startDate', 'update:endDate', 'getWeekDate'])

watch(startDate, () => {
    emits('update:startDate', startDate.value)
})
watch(weekDate, () => {
    emits('getWeekDate', weekDate.value)
})
watch(endDate, () => {
    emits('update:endDate', endDate.value)
})
watch(dateType, () => {
    startDate.value = startDate.value ? dayjs(startDate.value).format(valueFormat.value) : ''
    endDate.value = endDate.value ? dayjs(endDate.value).format(valueFormat.value) : ''
    emits('update:startDate', startDate.value)
    emits('update:endDate', endDate.value)
})
</script>
<style scoped>
.double-date-picker {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--label-text-color);
}
.double-date-picker_label {
    color: var(--label-text-color);
    white-space: nowrap;
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
