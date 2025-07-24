import { Notification } from '~/services/common/dialog/ComDialog'
import type { RequestOption,  } from '~/services/common/modules/axios/request'
// import { makeRequiredRequestConfig } from '~/services/common/modules/axios/request'
import { APIResponse } from '~/services/common/modules/axios/response'
// import router from '~/router'
import { useNavStore } from '~/stores/NavStore'
import { useUserStore } from '~/stores/UserStore'
import { useLangStore } from '~/stores/LangStore'
// import type {  AxiosResponse, Method } from 'axios'
// import axios from 'axios'
import { isNil, isEmpty } from 'lodash'
import { useProgress } from '~/stores/Progress'
// import { useRequestDefence } from '~/stores/RequestDefence'

let userInfo: any = {}
let config:any = {}
export const request = (method: any) => {
    return (url: string) => {
        return async (opt: RequestOption) => {
            const progressStore = useProgress()
            const navStore = useNavStore()

            // (폭력 요청 해킹 방지.)---- 5초 내에 25번이상 요청시 5초동안 요청 못함.  ----- 
            // if(!url.includes('dashboard') && useRequestDefence().isOverRequest() == true ) {    
            //     Notification.warning('Please try again later.')
            //     return new Promise<APIResponse>((resolve, reject)=>{})
            // }

            navStore.setLoading(true)
            // config = makeRequiredRequestConfig(method)({ url, opt })
            userInfo = useUserStore().loggedInUser

            return new Promise<APIResponse>((resolve, reject) => {

                // progress true일때 uploading progress bar 활성화 
                if(opt.progress){
                    progressStore.startProgress() // progress bar start
                    config.onUploadProgress = (progressEvent:any) =>{
                        progressStore.setPercentCompleted(progressEvent.loaded, progressEvent.total)
                    }
                }

                // axios request
                // axios
                //     .request(config)
                //     .then((response: AxiosResponse) => {
                //         const res = new APIResponse(response)
                //         console.log('AxiosResponse', res)
                //         resolve(res)
                //         navStore.setLoading(false)
                //         progressStore.endProgress() // progress bar close

                //     })
                //     .catch(err => {
                //         console.log('axios err', err)
                //         navStore.setLoading(false)
                //         Notification.error(err)
                //         // handleError(err.response ?? err, resolve, reject)
                //         progressStore.endProgress() // progress bar close
                //     })
            })
        }
    }
}

// // 에러 처리
// const handleError = (res: any,resolve:any, reject:any) => {
//     if (isNil(res)) return
//     if (res.data?.result == 404) {
//         // router.push({ name: '404' })
//         Notification.error('해당 페이지가 없습니다.')
//     } else if (res.data?.result == 401) {
//         console.log('handleError 401', res)
//         // 장기간 사용하지 않아 사용 시간이 만료되여 refresh token 호출해 accessToken갱신.
//         // accessToken갱신api 호출후 반환값이 빈값이면 logout 처리
//         refreshAccseeToken(resolve)
//         reject(res.data)
        
//     } else if (res.data?.result == 403) {
//         Notification.error('액세스 권한이 없읍니다.')
//         reject(res.data)

//     } else if (res.data?.result == 500) {
//         Notification.error(`시스템 에러. 관리자에게 문의해주세요. (ERR:${res.data?.result})`)
//     }  else if(res.config?.params?.mapPath){
//         Notification.error('지도 이미지가 없습니다.')
//     } 
//     else if (res.status === 400){
//         Notification.error('요청한 데이터가 없습니다. 관리자에게 문의해주세요.')
//         reject(res.data)

//     } else {
//         reject(res.data)
//     }
// }
// token 갱신
// export const refreshAccseeToken = (resolve:any) => {

//     if (userInfo.isLogin && userInfo.user?.loginId !== '' ) {
//        axios
//             .post('/api/createAccessToken', 
//                 { loginId: userInfo.user.loginId, lang: useLangStore().langType},
//                 { headers: {Authorization:userInfo.accessToken}}
//             )
//             .then(res => {
//                 const resData = res.data.data
//                 if (resData.accessToken) {

//                     // 토큰 정보 갱신
//                     userInfo.accessToken = resData.accessToken
//                     userInfo.validateKey = resData.validateKey
//                     userInfo.expire = resData.expire
//                     // 토큰 정보 store에 저장
//                     useUserStore().set(userInfo)

//                     // config accseeToken 갱신
//                     if (config.headers) {
//                         config.headers.Authorization = userInfo.accessToken
//                     }
//                     axios.request(config).then(res => {
//                         console.log('createAccessToken resolve----', res)
//                         resolve(res.data)
//                     })
//                 } else if(isEmpty(resData)) {
//                     // router.push({ name: 'login' })
//                     Notification.error('장기간 사용하지 않아 사용 시간이 만료되었습니다. 다시 로그인하세요.')
//                 }
//             })
//             .catch(err => {
//                 console.log('tokern err', err)
//             })
//     }
// }

const requestGet = async (url: string, opt: RequestOption = {}) => request('GET')(url)(opt)
const requestPost = async (url: string, opt: RequestOption = {}) => request('POST')(url)(opt)
const requestDelete = async (url: string, opt: RequestOption = {}) => request('DELETE')(url)(opt)
const requestPut = async (url: string, opt: RequestOption = {}) => request('PUT')(url)(opt)
const requestGetFile = async (url: string, opt?: any) => {
    return request('GET')(url)({
        responseType: 'blob',
        ...opt,
    })
}

export const fetch = () => {
    return {
        get: requestGet,
        post: requestPost,
        put: requestPut,
        delete: requestDelete,
        getFile: requestGetFile,
    }
}
