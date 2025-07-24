<template>
    <div class="dropdown-list" :style="{ width: width ?? '270px' }">
        <div v-if="label" class="dropdown-list_label" :style="{ width: labelWidth ?? '' }">
            {{ label }}
        </div>
        <el-select
            :model-value="!modelValue ? '' : modelValue "
            :placeholder="placeholder ??''"
            :style="{ flex: 1 }"
            :size="size"
            :multiple="multiple"
            :clearable="clearable"
            collapse-tags
            @change="onChange"
            :disabled="disabled"
            :popperClass="popperClass"

        >
            <el-option
                v-for="item in list"
                :key="item[optionValue]"
                :label="item[optionLabel]"
                :value="item[optionValue]"
            >
                <span>{{ item[optionLabel] }}</span>
                <img style="height: 18px; float: right" :src="item.icon" />
            </el-option>
        </el-select>
    </div>
</template>

<script lang="ts" setup>
import { toRefs } from 'vue'

export interface Props {
    label?: string | null
    labelWidth?: string | null // label 너비 조절
    width?: string | null // 총 너비 조절, 100% 로 설정시 총 너비가 부모노드 너비 맞춤
    size?: '' | 'default' | 'small' | 'large'
    placeholder?: string | null
    multiple?: boolean // 다종선택 가능 true,  다종선택 시 modelValue값은 Array<string | number> 타입 입니다.
    modelValue: string | number | Array<string | number> | null | undefined
    disabled?: boolean
    optionLabel: string
    optionValue: string
    optionIcon?: string
    list: any[]
    popperClass?: string // 선택 클리시 팝업 리스트 창에 class 추가 필요시 이 속성에 class명을 입력
    clearable?: boolean
}
const props = withDefaults(defineProps<Props>(), {
    clearable: true,
})
const { label, labelWidth, width, size, placeholder, multiple, modelValue, disabled, optionLabel, optionValue, list, clearable } =  toRefs(props)


const emits = defineEmits(['update:modelValue', 'onChange'])

const onChange = (value: any) => {
    emits('update:modelValue', value)
    emits('onChange', value)
}
</script>
<style scoped>
.dropdown-list {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--label-text-color);
}
.dropdown-list_label {
    color: var(--label-text-color);
}
</style>
