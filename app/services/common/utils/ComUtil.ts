import fileDownload from 'js-file-download'
import dayjs from 'dayjs'
import { Notification } from '~/services/common/dialog/ComDialog'
import html2canvas from 'html2canvas'

export const REG_EXPS = {
    // 이메일 검증용
    EMAIL: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, // /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i
    // 비밀번호 검증용 - 소문자, 숫자, 특수문자-
    PASSWORD_CASE_1: /^(?=.*[a-z])(?=.*\d)(?=.*[!@^*_-])[a-z\d!@^*_-]{8,15}$/,
    // 비밀번호 검증용 - 대문자, 숫자, 특수문자
    PASSWORD_CASE_2: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@^*_-])[A-Z\d!@^*_-]{8,15}$/,
    // 비밀번호 검증용 - 소문자, 대문자, 특수문자
    PASSWORD_CASE_3: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@^*_-])[a-zA-Z!@^*_-]{8,15}$/,
    // 비밀번호 검증용 - 소문자, 대문자, 숫자-
    PASSWORD_CASE_4: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,15}$/,
    // 비밀번호 검증용 - 소문자, 대문자, 숫자, 특수문자
    PASSWORD_CASE_5: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@^*_-])[a-zA-Z\d!@^*_-]{8,15}$/,
    //휴대폰
    MOBILE_PHONE: /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/,
    // MacAddress
    MAC_ADDRESS: /^([0-9a-fA-F]{2}[:.-]?){5}[0-9a-fA-F]{2}$/g,
    // IPAddress
    IPV4: /^(([1-9]?\d|1\d{2}|2([0-4]\d)|25[0-5])\.){3}([1-9]?\d|1\d{2}|2([0-4]\d)|25[0-5])$/,
} as const

/**
 * 이미지 파일을 base64인 URL로 변환
 * @param vo
 * @returns
 */
export const base64ToUrl = (vo: any) => {
    return URL.createObjectURL(vo)
}

/**
 * 숫자 여부 판단
 * @param str
 * @returns
 */
export const isNumber = (str: string) => {
    const regx = /^[0-9]+$/
    return regx.test(str)
}

/**
 * Null 체크
 * @param {*} value
 */
export const isEmpty = (value: any) => {
    if (
        value == '' ||
        value == null ||
        value == undefined ||
        (value != null && typeof value == 'object' && !Object.keys(value).length)
    ) {
        return true
    } else {
        return false
    }
}
/**
 * Object 복사
 * @param obj
 * @returns
 */
export const cloneObject = (obj: any) => {
    const clone: any = {}
    for (const key in obj) {
        if (typeof obj[key] == 'object' && obj[key] != null) {
            clone[key] = cloneObject(obj[key])
        } else {
            clone[key] = obj[key]
        }
    }

    return clone
}

/** lpad
 * @params
 *  - str : 원 문자열
 *  - padLen : 최대 채우고자 하는 길이
 *  - padStr : 채우고자하는 문자(char)
 */
export const lpad = (str: string, padLen: number, padStr: string | any[]) => {
    if (padStr.length > padLen) return str

    str += ''
    padStr += ''
    while (str.length < padLen) str = padStr + str
    str = str.length >= padLen ? str.substring(0, padLen) : str
    return str
}

/**
 * 바이트 단위 표시
 * @param byte byte
 * @param d   digit
 * @returns  0 Bytes
 */
export const formatBytes = (byte: number, digit: number = 2) => {
    if (0 === byte) return '0 Bytes'
    const c = 1024
    const unit = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const f = Math.floor(Math.log(byte) / Math.log(c))
    return parseFloat((byte / Math.pow(c, f)).toFixed(digit)) + ' ' + unit[f]
}

/**
 * 숫자 콤마
 * @param {숫자} num
 * @returns
 */
export const addComma = (num: { toString: () => string } | undefined) => {
    if (num == undefined) return ''
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const getActionClass = (classList: string[]) => {
    const action = ['GET', 'POST', 'PUT', 'DELETE']
    let result = ''
    action.forEach(act => {
        for (const idx in classList) {
            if (classList[idx] == act) {
                result = act
                break
            }
        }
    })
    return result
}

/**
 * 모바일 여부
 * @returns
 */
export const isMobile = () => {
    const UserAgent = navigator.userAgent

    if (
        UserAgent.match(
            /iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i,
        ) != null ||
        UserAgent.match(/LG|SAMSUNG|Samsung/) != null
    ) {
        return true
    } else {
        return false
    }
}
/**
 * 전화번호 입력 정확한지 체크
 * @param value string // 전화번호
 * @returns boolean
 */
export const validatePhoneNumer = (value: string) => {
    if (value == '') {
        return false
    }
    const regex = /^(01[016789])-?\d{3,4}-?\d{4}$/
    const rs = regex.test(value)
    return rs
}
/**
 * 이메일 입력 정확한지 체크
 * @param value string // 이메일
 * @returns boolean
 */
export const validateEmail = (value: string) => {
    if (value == '') {
        return false
    }
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i
    const rs = regex.test(value)
    console.log('email', rs)
    return rs
}
/**
 * 비밀번호 입력 정확한지 체크
 * 규칙: 영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 포함하여 9~16자리
 * @param value string // 비밀번호
 * @returns boolean
 */
export const validatePassword = (value: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{9,16}$/
    const rs = regex.test(value)
    return rs
}

/**
 * dayjs를 이용하여 날짜 format하는 메소드. null/undefined/빈값이 들어올떄  빈값을 반환
 * @param date 날짜 Object  혹은  날짜 string
 * @param format 날짜 격식. 예: YYYY-MM-DD,  dayjs 라이브러리 격식 참조
 * @returns 날짜 string
 */
export const dateFormat = (date: any, format: string) => {
    if (date == null || date == undefined || date == '') {
        return ''
    } else {
        // const d =  dayjs(date)
        // let locatTime = ''
        // locatTime = d.add(9, 'hour').format(format)  // 한국시간
        // return locatTime
        return dayjs(date).format(format)
    }
}

/**
 * ElTable checkbox 단일선택 혹은 다종선택에 따라 선택값을 반환.
 * ElTable @selection-change 이벤트 callback 함수안에 사용
 * <el-table multiple>: el-table 테그에 multiple 추가시 다종선택 가능, multiple 없으면 단일선택
 * @param tableRef ElTable의 ref,  예: ref="tableRef"
 * @param val @selection-change에서 받아온 checkbox 선택 값
 * @returns 선택값 Array 반환
 */
export const getTableSelection = (tableRef: any, val: any[]): any[] => {
    // <el-table multiple> tag에 'multiple' 속성 유무에 따라 아래 코드 실행
    const hasMultiple = Object.keys(tableRef.value?.$attrs).includes('multiple')
    let resData: any = []

    if (hasMultiple) {
        resData = tableRef.value?.getSelectionRows()
    } else {
        if (val.length == 2 && JSON.stringify(val[0]) === JSON.stringify(val[1])) {
            val.forEach((item: any) => {
                tableRef.value?.toggleRowSelection(item, false)
            })
            resData = tableRef.value?.getSelectionRows()
        } else {
            val.forEach((item: any, index) => {
                if (index < val.length - 1) {
                    tableRef.value?.toggleRowSelection(item, false)
                }
            })
        }
        resData = tableRef.value?.getSelectionRows()
    }
    return resData
}

/**
 * 엑셀 다운로드 함수
 * @param data excel api 호출하여 불러온 excel file data
 * @param fileName 엑셀 다운로드할때 정해주는 파일이름
 * @example
 * ComUtil.excelDownload(res.data, '장치정보')
 */
export const excelDownload = (data: any, fileName: string) => {
    fileDownload(data, `${fileName}_엑셀파일_${dayjs(new Date()).format('YYYY_MM_DD_HH_mm_ss')}.xlsx`)
}

/**
 * 선택 기간 제한, 초과 시 Warning note. DoubleDatePicker 사용시 기간 제한 validation 용도
 * @param startDate 시작날짜/월/년
 * @param endDate 종료날짜/월/년
 * @param dateKey string year | month | day
 * @param limit number 제한 기간
 * @returns boolean 초과 여부
 */
export const dateSelectionLimit = (
    startDate: string,
    endDate: string,
    dateKey: 'year' | 'month' | 'day',
    limit?: number,
) => {
    const stD = dayjs(startDate)
    const enD = dayjs(endDate)
    let limitDate = 0
    let isOverLimit = false
    if (dateKey === 'year') {
        limitDate = limit ? limit : 3
        const duration = enD.diff(stD, 'year')
        if (duration > limitDate) {
            Notification.warning(`최대 ${limitDate}년 이내로 선택해주세요.`)
            isOverLimit = true
        }
    }
    if (dateKey === 'month') {
        limitDate = limit ? limit : 12
        const duration = enD.diff(stD, 'month')
        if (duration > limitDate) {
            Notification.warning(`최대 ${limitDate}개월 이내로 선택해주세요.`)
            isOverLimit = true
        }
    }
    if (dateKey === 'day') {
        limitDate = limit ? limit : 14
        const duration = enD.diff(stD, 'day')
        if (duration > limitDate) {
            Notification.warning(`최대 ${limitDate}일 이내로 선택해주세요.`)
            isOverLimit = true
        }
    }
    return isOverLimit
}

/**
 * Ctrl 메뉴 클릭하여 세창에 페이지 이동 시 사용하는  함수
 */
export const setNewpageSession = () => {
    // Ctrl 메뉴 클릭하여 세창에 페이지 이동 시 User sessionStorage 잠간 localStorage에 저장후 삭제
    if (process.client) {
        const user = sessionStorage.getItem('User')
        localStorage.setItem('mommoss-user', user ?? '')
    }
    setTimeout(() => {
        if (process.client) {
            localStorage.removeItem('mommoss-user')
        }
    }, 1000)
}

/**
 * 전화번호 입력시 숫자만 입력가능하고 '010-1234-5678' 격식인 전화번호로 format한다.
 * phoneFormatter와 아래  parsePhone 메소드를 같이 사용해야 한다.
 * phoneFormatter 와 parsePhone 메소드를 el-input에 :formatter="phoneFormatter" :parser="parsePhone"  추가하면 된다.
 * 기타: 입력된 전화번호를 '010-1234-5678' 격식으로 변환만하려면  phoneFormatter만 사용하면 된다
 * @param value
 * @returns string 예: '010-1234-5678' 격식인 문자
 */
export const phoneFormatter = (value: string) => {
    if (!value) return ''
    const numbers = value.replace(/\D/g, '')
    console.log('phoneFormatter', numbers)

    if (numbers.length <= 3) {
        return numbers
    } else if (numbers.length > 3 && numbers.length <= 6) {
        return numbers.slice(0, 3) + '-' + numbers.slice(3, 6)
    } else if (numbers.length >= 6 && numbers.length <= 10) {
        return numbers.slice(0, 3) + '-' + numbers.slice(3, 6) + '-' + numbers.slice(6)
    } else if (numbers.length === 11) {
        return numbers.slice(0, 3) + '-' + numbers.slice(3, 7) + '-' + numbers.slice(7)
    }
    return numbers
}
/**
 * 전화번호에 '-'부호를 제거
 * @param value
 * @returns
 */
export const phoneParse = (value: string) => {
    return value.replace(/-/g, '')
}
// -----------------------------

/**
 * el-table에 :index 속성에 사용되며  Index 번호를 계산는 함수.
 * @param rowSize
 * @param page
 * @returns
 */
export const indexMethod = (rowSize: number, page: number) => {
    return rowSize * (page - 1) + 1
}

/**
 * element param의 원소에 내용을 이미지로 다운로드하는 함수.
 * @param element  type: HTMLElement
 */
import { useNuxtApp } from '#app'
export const pngDownload = (element: HTMLElement) => {
    const nuxtApp = useNuxtApp()
    if (nuxtApp.isClient && element) {
        element &&
            html2canvas(element).then(canvas => {
                const imgData = canvas.toDataURL('image/png')
                const link = document.createElement('a')
                link.href = imgData
                link.download = 'downloaded_png_file.png'
                link.click()
            })
    }
}
export default {
    REG_EXPS,
    base64ToUrl,
    isNumber,
    isEmpty,
    cloneObject,
    lpad,
    formatBytes,
    addComma,
    getActionClass,
    isMobile,
    validatePhoneNumer,
    validateEmail,
    validatePassword,
    dateFormat,
    getTableSelection,
    excelDownload,
    dateSelectionLimit,
    setNewpageSession,
    phoneFormatter,
    phoneParse,
    indexMethod,
    pngDownload,
}
