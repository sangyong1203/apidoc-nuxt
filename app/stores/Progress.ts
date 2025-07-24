import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProgress = defineStore('progress', () => {
    {
        const isProgressing = ref(false) // 파일 업로드 진행중 여부
        const percentCompleted = ref(0) // 파일 업로드 완성 율

        const setPercentCompleted = (progressEventLoaded: number, prgressEventTotal:number) => {
            const percent = Math.round((progressEventLoaded * 100) / prgressEventTotal);
              percentCompleted.value = percent
          }
          const startProgress = () => {
            isProgressing.value = true
          }
          const endProgress = () => {
            isProgressing.value = false
        }
        return {
            isProgressing,
            percentCompleted,
            setPercentCompleted,
            startProgress,
            endProgress
        }
    }
})
