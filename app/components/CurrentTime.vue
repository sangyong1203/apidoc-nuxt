<template>
    <div class="time">
        <span class="time-lable">{{ props.label??'' }} : </span>
        <span class="time-value">{{ currentTime }}</span>
        <span class="time-value time-second">{{ currentSecond }}</span>
    </div>
</template>
<script lang="ts" setup>
import dayjs from 'dayjs'
import { ref, onUnmounted } from 'vue'
export interface CurrentTimeProps {
    label: string
}
const props = defineProps<CurrentTimeProps>()
const currentTime = ref(dayjs().format('YYYY-MM-DD HH:mm:'))
const currentSecond = ref(dayjs().format('ss'))
const { isClient } = useNuxtApp()
let timer:any = null
onMounted(()=>{

    if (isClient) {
    
        timer = setInterval(() => {
            currentTime.value = dayjs(new Date()).format('YYYY-MM-DD HH:mm:')
            currentSecond.value = dayjs().format('ss')
        }, 1000)
    }
})
onUnmounted(() => {
    clearInterval(timer)
})
</script>
<style lang="scss" scope>
.time {
    margin: 0 20px;
    font-weight: 500;
}
.time-lable {
    font-size: 16px;
}
.time-value {
    font-size: 17px;
}
.time-second {
    width: 20px;
    display: inline-block;
    text-align: left;
}
</style>
