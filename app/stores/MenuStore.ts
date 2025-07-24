import { defineStore } from 'pinia'
import { ref } from 'vue'

export type Menu = {
    id: number
    title: string
    path: string
    icon: string
    children: Menu[] // 일력력
}

export const useMenuStore = defineStore(
    'menu',
    () => {
        const data = ref<Menu[]>([])
        const init = () => {
            data.value = []
        }
        const getMenu = (): Menu[] => {
            return data.value
        }
        const setMenu = (arr: Menu[]) => {
            data.value = arr
        }
        const setTempMenu = () => {
            data.value = tempMenu
        }
        return { data, init, getMenu, setMenu, setTempMenu }
    }
)

const tempMenu = [
    
    {
        id: 8,
        title: 'API 관리',
        path: '',
        icon: 'Memo',
        useYn: 'Y',
        authAction: 'GET,PUT,POST,DELETE',
        children: [
            {
                id: 81,
                title: 'API',
                path: '/main/postApi',
                icon: '',
                authAction: 'GET,PUT,POST,DELETE',
                useYn: 'Y',
                children: [],
            },
        ]
    }
]
