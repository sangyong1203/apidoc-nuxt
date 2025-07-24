<template>
    <div
        class="collapse-box"
        :class="showInfo ? '' : 'collapse-box-collapsed'"
        :style="{ width: `${width}px`, left: !showInfo ? `${0 - width + (isHovered ? 10 : 6)}px` : 0 }"
    >
        <div class="collapse-content" :style="{backgroundColor: backgroundColor?? '#0009'}">
            <slot></slot>
        </div>
        <div class="collapse-btn" @click="collapseInfo">
            <el-icon 
                :style="{backgroundColor: backgroundColor?? '#0009'}"
                @mouseover="isHovered = true" 
                @mouseleave="isHovered = false" 
                :color="iconColor ?? 'white'"
                ><ArrowLeftBold
            /></el-icon>
        </div>
    </div>
</template>
<script setup lang="ts">
import { toRefs, ref } from 'vue'
export interface Props {
    width: number // width는  px단위 숫자
    iconColor?: string // icon의 색상
    backgroundColor?: string // 배경색 
}
const props = defineProps<Props>()
const { iconColor, width, backgroundColor } = toRefs(props)
const isHovered = ref(false)
const showInfo = ref(true)
const collapseInfo = () => {
    showInfo.value = !showInfo.value
}
</script>
<style lang="scss" scoped>
.collapse-box {
    height: 100%;
    display: flex;
    position: absolute;
    left: 0;
    transition: all 0.3s ease-in-out;
}
.collapse-content {
    width: 100%;
}
.collapse-btn {
    display: flex;
    height: 100%;
    cursor: pointer;
    align-items: center;
    .el-icon {
        width: 6px;
        border-left: none;
        border-top-right-radius: 12px;
        border-bottom-right-radius: 12px;
        height: 50px;
        transition: all 0.3s ease-in-out;
        svg {
            transition: all 0.3s ease-in-out;
            margin-left: -12px;
        }
    }
}
.collapse-box-collapsed {
    .el-icon {
        width: 12px;
    }
    .el-icon svg {
        width: 12px;
        transform: rotate(180deg);
        margin-left: 0px !important;
    }
}
</style>
