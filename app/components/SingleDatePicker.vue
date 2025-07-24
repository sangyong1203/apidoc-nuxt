<template>
    <div class="single-date-picker" :style="{ width: props.width ?? '270px' }">
        <div v-if="props.label" class="single-date-picker_label" :style="{ width: props.labelWidth ?? '' }">
            {{ props.label }}
        </div>
        <slot></slot>
        <el-date-picker
            v-model="modelValueRef"
            :type="type"
            :format="format"
            :value-format="valueFormat"
            :placeholder="placeholder ?? ''"
            :style="{ flex: 1 }"
            :disabled="disabled"
            :disabledDate="disabledDate"
        />
    </div>
</template>

<script lang="ts" setup>
import {  toRefs, computed } from 'vue'
export interface Props {
    label?: string | null
    labelWidth?: string | null // label 너비 조절
    width?: string | null // 총 너비 조절, 100% 로 설정시 총 너비가 부모노드 너비 맞춤
    placeholder?: string | null
    modelValue: string | number | string[] | Date | ''
    type?:  'year' | 'month' | 'week' | 'date' | 'years' | 'months' | 'dates' | 'datetime' | 'datetimerange' | 'daterange' | 'monthrange' | 'yearrange' // 날짜 격식 년/월/주/일 종류
    disabled?: boolean
    disabledDate?: (params:any) => boolean
}
const props = defineProps<Props>()
const { modelValue, disabledDate } = toRefs<Props>(props)

const emits = defineEmits(['update:modelValue'])

const modelValueRef = computed({
    get: () => modelValue.value,
    set: (value) => emits('update:modelValue', value)
})

const valueFormat = computed(() => {
    let value = ''
    switch (props.type) {
        case 'date':
            value = 'YYYY-MM-DD'
            break
        case 'week':
            value = 'YYYY[w]ww'
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
const format = computed(() => {
    let value = ''
    switch (props.type) {
        case 'date':
            value = 'YYYY-MM-DD'
            break
        case 'week':
            value = 'YYYY-[주]ww'
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

</script>
<style scoped>
.single-date-picker {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--label-text-color);
}
.single-date-picker_label {
    color: var(--label-text-color);
}
</style>
