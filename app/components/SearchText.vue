<template>
    <div class="search-text" :style="{ width: props.width ?? '' }" @keyup.enter="onEnter">
        <div v-if="label" class="search-text_label" :style="{ width: props.labelWidth ?? '' }">
            {{ props.label }}
        </div>
        <div style="display: flex; align-items: center; gap: 4px; flex:1;">

            <slot></slot>
            <el-input
                style="flex: 1"
                :model-value="props.modelValue"
                :placeholder="props.placeholder ?? L.검색어입력"
                @input="onInput"
                :suffix-icon="Search"
                :size="props.size"
            >
            </el-input>
            <!-- 입력창 뒤에 버튼 혹은 원소 추가 시 사용 함. 에: <template #append> -->
            <slot name="append"></slot>
        </div>
    </div>
</template>

<script lang="ts" setup>    
import { Search } from '@element-plus/icons-vue'
import { useLangStore } from '~/stores/LangStore'
export interface Props {
    label?: string | null
    labelWidth?: string | null // label 너비 조절
    width?: string | null // 총 너비 조절, 100% 로 설정시 총 너비가 부모노드 너비 맞춤
    placeholder?: string | null
    modelValue: string | number | null
    size?: '' | 'default' | 'small' | 'large'
}
const props = defineProps<Props>()
const emits = defineEmits(['update:modelValue', 'onEnter'])
const L = useLangStore().lang.common
const onInput = (value: any) => {
    emits('update:modelValue', value)
}
const onEnter = () => {
    emits('onEnter')
}
</script>
<style scoped>
.search-text {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--label-text-color);
}
.search-text_label {
    color: var(--label-text-color);
    white-space: nowrap;
}
.input-with-select .el-input-group__prepend {
    background-color: var(--el-fill-color-blank);
}
</style>
