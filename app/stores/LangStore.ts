import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as XLSX from 'xlsx'

export type Lang = {
    page: string
    labelList: {
        key: string
        value: string
    }[]
}
export const useLangStore = defineStore(
    'langStore',
    () => {
        const langType = ref<string>('ko')
        function setLangType(type: string) {
            langType.value = type
        }
        const lang = ref<any>({})
        function setLang(langData: Lang[]) {
            lang.value = langData.reduce((acc: any, { page, labelList }) => {
                acc[page] = labelList.reduce((labelAcc: any, { key, value }) => {
                    key = key.replace(' ', '')
                    labelAcc[key] = value
                    return labelAcc
                }, {})
                return acc
            }, {})
        }

        // 로컬에 있는 다국어 파일 사용하여 언어 설정 (파일폴더 경로: public/langFile)
        const setLangFromExcelFile = async (languageType: string) => {
            try {
                const response = await fetch(`/langFile/${languageType}_lang.xlsx`)
                const arrayBuffer = await response.arrayBuffer()
                const workbook = XLSX.read(arrayBuffer, { type: 'array' })
                const firstSheetName = workbook.SheetNames[0]
                const worksheet = workbook.Sheets[firstSheetName!]
                const jsonData = XLSX.utils.sheet_to_json(worksheet!, { range: 2 })
                // excel 데이터를 LangDataType 형식인 데이터로 구조로 변경
                const newArr: any = []
                jsonData.forEach((item: any) => {
                    const d = {
                        page: item.page,
                        langType: item.langType,
                        labelList: [],
                    }
                    if (newArr.some((itemA: any) => itemA.page === item.page)) return
                    newArr.push(d)
                })
                newArr.forEach((item: any) => {
                    jsonData.forEach((itemA: any) => {
                        if (item.page === itemA.page) {
                            item.labelList.push({
                                key: itemA.key,
                                value: itemA.value,
                            })
                        }
                    })
                })
                setLang(newArr)
                setLangType(languageType)
                // 로그인시 기본 컴포넌트 언어 데이터 설정
                localStorage.setItem('langCommon', JSON.stringify(lang.value.common))
            } catch (err) {
                console.log('Warning from lang file.', err)
            }
        }

        return { 
            lang, 
            langType, 
            setLang, 
            setLangType, 
            setLangFromExcelFile 
        }
    }
)
