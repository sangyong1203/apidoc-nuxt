import { defineStore } from 'pinia'
import { ref } from 'vue'

// ---------폭력 요청 해킹 방지 ------
export const useRequestDefence = defineStore('RequestDefence', () => {
    {
        const requestCount = ref(0) // 일정기간내  요청수량
        const startRequestTime = ref(Date.now()) // 기간 요청 시작시간
        const limitDuration= ref(5000) // 요청 제한 시간 
        const isWaiting = ref(false)
        
        const addRequestCount = () => {
            requestCount.value += 1
        }
        const initRequestCount = () => {
            requestCount.value = 0
            startRequestTime.value = Date.now()
        }
        const getRequestDurationTime = () => {
            return Date.now() - startRequestTime.value
        }
         
        /**
         * 요청 제한 시간 설정. 디폴트 5초. 
         * @param miliseconds 
         */ 
        const setLimitDurationTime = (miliseconds:number) => {
          limitDuration.value = miliseconds
        }
        /**
         * 요청 제한 시간(디폴트:5초)내에 25번 요청 초과 여부 
         * @returns boolean  5초내에 요청수가 25번 초과 시 true 반환 
         */
        const isOverRequest = () => {
          addRequestCount()
          const requestDurationTime = getRequestDurationTime()
          
          if(requestCount.value >= 25 && requestDurationTime <= limitDuration.value){
              isWaiting.value = true
              setTimeout(()=>{
                  initRequestCount()
                  isWaiting.value = false
              }, limitDuration.value)
          } else if(requestDurationTime > limitDuration.value){
              initRequestCount()
          }
          return isWaiting.value
      }
        return {
            isOverRequest,
            setLimitDurationTime
        }
    }
})
