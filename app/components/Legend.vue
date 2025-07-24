<template>
     <div class="legend" :class="className">
        <div class="legend-item" :style="{backgroundColor: color}"></div>
        <div class="legend-label" :style="{color: fontColor ?? 'inherit', fontSize: fontSize ?? 'inherit'}">{{ label }}</div>
    </div>
</template>
<script setup lang="ts">
import { toRefs } from 'vue'
export interface Prop{
    color: string
    label: string
    fontColor?: string
    fontSize?: string
    className?: string
}
const props = defineProps<Prop>()
const { color, label, fontColor, fontSize, className } = toRefs(props)
</script>
<style scoped lang="scss">

.legend {
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;
}
.legend-label{
    font-size: 12px;
}
.legend-item {
    width: 11px;
    height: 11px;
    border-radius: 2px;
}
</style>