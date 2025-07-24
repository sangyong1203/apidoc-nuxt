import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { EnvironmentSetting } from './Type.ts'

export const useEnvironmentStore = defineStore(
    'EnvironmentStore',
    () => {
        const environmentSetting = ref<EnvironmentSetting>({
            name: '',
            host: '',
            authToken: '',
            isSelected: false,
        })
        const setEnvironmentSetting = (value: EnvironmentSetting) => {
            environmentSetting.value = value
        }
        return {
            environmentSetting,
            setEnvironmentSetting,
        }
        
    }
)
