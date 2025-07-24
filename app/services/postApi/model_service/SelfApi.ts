// import { fetch } from '~/services/common/modules/axios'
// import type { Params, PayloadModel } from '~/services/common/modules/axios/request'
// import { APIResponse } from '~/services/common/modules/axios/response'
import type { CoverPage, PostApiModel, RevisionHistory, EnvironmentSetting, Folder } from './Type'
import fileDownload from 'js-file-download'
import { useUserStore } from '~/stores/UserStore'
import { useEnvironmentStore } from './EnvirenmentStore'
// import FormData from 'form-data'

export interface PayloadModel {
    path?: any
    query?: { [key: string]: string | number | boolean | undefined | null }
    body?: any
}

export default {
    async sendApi(params: {
        headersContentType: string
        httpMethod: string
        donwloadFileName?: string
        requestURL: string
        requestParams: any
    }): Promise<any> {
        const envirenmentStore = useEnvironmentStore()
        let res: any = null
        // host 설정 
        const host = envirenmentStore.environmentSetting.host
        // accessToken 설정 
        const userStore = useUserStore()
        userStore.loggedInUser.accessToken = envirenmentStore.environmentSetting.authToken ?? ''

        if (params.httpMethod === 'GET') {
            const payload: PayloadModel = { query: params.requestParams }

            // res = await fetch().get(host + params.requestURL, {
            //     payload,
            //     // headers: { Authorization: params.environmentSetting.authToken },
            // })
            res = await useFetch(host +params.requestURL, {
                method: 'GET',
                query: payload,
                headers: { Authorization: userStore.loggedInUser.accessToken },
                server: true, // SSR에서만 실행
                lazy: true,   // 최초 접근 시에만 실행
            })
        }
        if (params.httpMethod === 'POST') {
            if (params.headersContentType === 'form-data') {
                // 파일이 있는 경우 Content-Type은 form-data형식으로 변환해서 데이터 전송한다.
                const requestObj = params.requestParams
                const formData = new FormData()
                for(const key in requestObj){
                    if(Array.isArray(requestObj[key]) && requestObj[key].length > 0 && requestObj[key][0] instanceof File){
                        console.log('file', requestObj[key])
                        requestObj[key].forEach( file => {
                            formData.append(key, file)
                        })

                    } else {
                        console.log(key, requestObj[key])
                        formData.append(key, requestObj[key])
                    }
                }
                const payload: PayloadModel = { body: formData }
                // res = await fetch().post(host + params.requestURL, { payload, headers: {Authorization: userStore.loggedInUser.accessToken} })

            } else {
                // 파일이 없는 경우 데이터 전송 
                const payload: PayloadModel = { body: params.requestParams }
                // res = await fetch().post(host + params.requestURL, { payload, headers: {Authorization: userStore.loggedInUser.accessToken} })
                res = await useFetch(host +params.requestURL, {
                method: 'POST',
                body: payload,
                headers: { Authorization: userStore.loggedInUser.accessToken },
                server: true, // SSR에서만 실행
                lazy: true,   // 최초 접근 시에만 실행
            })
            }
        }
        if (params.httpMethod === 'PUT') {
            const payload: PayloadModel = { body: params.requestParams }
            // res = await fetch().put(host + params.requestURL, {
            //     payload,
            //     headers: { Authorization: userStore.loggedInUser.accessToken },
            // })
            res = await useFetch(host +params.requestURL, {
                method: 'PUT',
                body: payload,
                headers: { Authorization: userStore.loggedInUser.accessToken },
                server: true, // SSR에서만 실행
                lazy: true,   // 최초 접근 시에만 실행
            })

        }
        if (params.httpMethod === 'DELETE') {
            const payload: PayloadModel = { body: params.requestParams }
            // res = await fetch().delete(host + params.requestURL, {
            //     payload,
            //     headers: { Authorization: userStore.loggedInUser.accessToken },
            // })
            res = await useFetch(host +params.requestURL, {
                method: 'DELETE',
                body: payload,
                headers: { Authorization: userStore.loggedInUser.accessToken },
                server: true, // SSR에서만 실행
                lazy: true,   // 최초 접근 시에만 실행
            })
        }
        if (params.httpMethod === 'GETFILE') {
            const payload: PayloadModel = { query: params.requestParams }
            // res = await fetch().getFile(host + params.requestURL, {
            //     payload,
            //     headers: { Authorization: userStore.loggedInUser.accessToken },
            // })
            fileDownload(res.data, params.donwloadFileName ?? 'fileDownLoad')
        }
        console.log('res', res)
        return res
    },

    // Api 목록 조회 ----------------------------------------------------------------------------
    async getApiList(params: {
        requestURL?: string
        httpMethod?: string
        interfaceName?: string
        clientType?: string
    }): Promise<any> {
        return new Promise((resolve, reject) => {
            openDataBase()
                .then(db => {
                    const transaction = db.transaction('apiTable', 'readonly')
                    const store = transaction.objectStore('apiTable')
                    if (params.requestURL || params.httpMethod || params.interfaceName || params.clientType) {
                        const result: PostApiModel[] = []
                        const index = store.index('requestURL')
                        const request = index.openCursor()
                        request.onsuccess = (event: any) => {
                            const cursor = event?.target.result
                            console.log('request.onsuccess----', cursor, params)
                            if (cursor) {
                                const record = cursor.value
                                let matchesAllConditions = true
                                for (const [key, value] of Object.entries(params)) {
                                    console.log('const [key, value]---------', key, value)
                                    console.log('record[key]', record[key])

                                    if (record[key] && value && !record[key].includes(value)) {
                                        matchesAllConditions = false
                                    }
                                }
                                if (matchesAllConditions) {
                                    
                                    result.push(record)
                                }
                                cursor.continue()
                            } else {
                                console.log('matchesAllConditions', result)

                                resolve(result)
                            }
                        }
                        request.onerror = event => reject((event.target as IDBRequest).error)
                    } else {
                        const request = store.getAll()
                        request.onsuccess = () => resolve(request.result)
                        request.onerror = event => reject((event.target as IDBRequest).error)
                    }
                })
                .catch(error => {
                    reject(error)
                })
        })
    },
    async getApiInfo(id: number) {
        return new Promise((resolve, reject) => {
            openDataBase()
                .then(db => {
                    const transaction = db.transaction('apiTable', 'readonly')
                    const store = transaction.objectStore('apiTable')
                    const request = store.get(id)
                    request.onsuccess = () => {
                        const res = request.result
                        const result = {
                            ...res,
                            request: res.request.map((req: any) => ({
                                ...req,
                            })),
                            response: res.response.map((res: any) => ({
                                ...res,
                            })),
                            requestExample: JSON.parse(res.requestExample),
                            responseExample: JSON.parse(res.responseExample),
                        }

                        resolve(result)
                    }
                    request.onerror = event => reject((event.target as IDBRequest).error)
                })
                .catch(error => {
                    reject(error)
                })
        })
    },
    async createApi(apiInfo: PostApiModel) {
        return new Promise((resolve, reject) => {
            openDataBase()
                .then(db => {
                    try {
                        const transaction = db.transaction('apiTable', 'readwrite')
                        const store = transaction.objectStore('apiTable')
                        // 저장 가능한 형태로 변환 (특히 testValue 필드를 확인)
                        const processedRequestInfo = {
                            ...apiInfo,
                            request: apiInfo.request.map(req => ({
                                ...req,
                                files:[],
                            })),
                            response: apiInfo.response.map(res => ({
                                ...res,
                            })),
                            requestExample: JSON.stringify(apiInfo.requestExample),
                            responseExample: JSON.stringify(apiInfo.responseExample),
                        }

                        console.log('processedRequestInfo', processedRequestInfo)

                        const request = store.add(processedRequestInfo)
                        request.onsuccess = (event: any) => {
                            console.log('create api sucess')
                            resolve(request.result)
                        }
                        request.onerror = event => {
                            console.log('create api faild')
                            reject((event.target as IDBRequest).error)
                        }
                    } catch (error) {
                        console.log('create api error', error)

                        reject(error)
                    }
                })
                .catch(error => {
                    reject(error)
                })
        })
    },
    async updateApi(apiInfo: PostApiModel) {
        return new Promise((resolve, reject) => {
            openDataBase().then(db => {
                try {
                    const transaction = db.transaction('apiTable', 'readwrite')
                    const store = transaction.objectStore('apiTable')
                    // 저장 가능한 형태로 변환 (특히 testValue 필드를 확인)
                    const processedRequestInfo = {
                        ...apiInfo,
                        request: apiInfo.request.map(req => ({
                            ...req,
                            files:[],
                        })),
                        response: apiInfo.response.map(res => ({
                            ...res,
                        })),
                        requestExample: JSON.stringify(apiInfo.requestExample),
                        responseExample: JSON.stringify(apiInfo.responseExample),
                    }

                    console.log('processedRequestInfo', processedRequestInfo)
                    const request = store.put(processedRequestInfo)

                    request.onsuccess = (event: any) => {
                        console.log('update api sucess')
                        resolve(request.result)
                    }
                    request.onerror = event => {
                        console.log('update api faild')
                        reject((event.target as IDBRequest).error)
                    }
                } catch (error) {
                    console.log('create api error', error)

                    reject(error)
                }
            }).catch(error => {
                reject(error)
            })
        })
    },
    async deleteApi(id: number) {
        const db = await openDataBase()
        const transaction = db.transaction('apiTable', 'readwrite')
        const store = transaction.objectStore('apiTable')

        const request = store.delete(id)
        request.onsuccess = (event: any) => {
            console.log('create api sucess')
        }
        request.onerror = event => {
            console.log('create api fald', (event.target as IDBRequest).error)
        }
    },
    async checkDuplicateApi(requestURL: string) {
        const db = await openDataBase()
        const transaction = db.transaction('apiTable', 'readonly')
        transaction.objectStore('apiTable')
    },
    // ------------------------------------------------------------------------------------

    // menu ------------------------------------------------------------------------------------
    // async getMenuList(): Promise<APIResponse> {
    //     return await fetch().get('/api/setting/menu')
    // },
    // async createMenu(params: Params): Promise<APIResponse> {
    //     const payload: PayloadModel = { body: params }
    //     return await fetch().post('/api/setting/menu', { payload })
    // },
    // async updateMenu(params: Params): Promise<APIResponse> {
    //     const payload: PayloadModel = { body: params }
    //     return await fetch().put('/api/setting/menu', { payload })
    // },
    // async deleteMenu(params: Params): Promise<APIResponse> {
    //     const payload: PayloadModel = { query: params }
    //     return await fetch().delete('/api/setting/menu', { payload })
    // },

    // 개정이력 -------------------------------------------------------------------------
    async getHistoryList(): Promise<any> {
        return new Promise((resolve, reject) => {
            openDataBase()
                .then(db => {
                    const transaction = db.transaction('revisionHistory', 'readonly')
                    const store = transaction.objectStore('revisionHistory')

                    const request = store.getAll()
                    request.onsuccess = () => resolve(request.result)
                    request.onerror = event => reject((event.target as IDBRequest).error)
                })
                .catch(error => {
                    reject(error)
                })
        })
    },
    async createHistory(params: RevisionHistory) {
        const db = await openDataBase()
        const transaction = db.transaction('revisionHistory', 'readwrite')
        const store = transaction.objectStore('revisionHistory')

        // 저장 가능한 형태로 변환
        const processedRequestInfo = { ...params }

        const request = store.add(processedRequestInfo)
        request.onsuccess = (event: any) => {
            console.log('createHistory sucess')
        }
        request.onerror = event => {
            console.log('createHistory faild')
        }
    },
    async updateHistory(params: RevisionHistory) {
        const db = await openDataBase()
        const transaction = db.transaction('revisionHistory', 'readwrite')
        const store = transaction.objectStore('revisionHistory')

        // 저장 가능한 형태로 변환
        const processedRequestInfo = { ...params }

        const request = store.put(processedRequestInfo)
        request.onsuccess = (event: any) => {
            console.log('updateHistory sucess')
        }
        request.onerror = event => {
            console.log('updateHistory faild')
        }
    },
    async deleteHistory(id: number) {
        const db = await openDataBase()
        const transaction = db.transaction('revisionHistory', 'readwrite')
        const store = transaction.objectStore('revisionHistory')

        const request = store.delete(id)
        request.onsuccess = (event: any) => {
            console.log('delete histroy sucess')
        }
        request.onerror = event => {
            console.log('delete histroy faild', (event.target as IDBRequest).error)
        }
    },

    // 표지  ----------------------------------------------------------------------------
    async getCoverPage(): Promise<any> {
        return new Promise((resolve, reject) => {
            openDataBase()
                .then(db => {
                    const transaction = db.transaction('coverPage', 'readonly')
                    const store = transaction.objectStore('coverPage')

                    const request = store.getAll()
                    request.onsuccess = () => resolve(request.result[0])
                    request.onerror = event => reject((event.target as IDBRequest).error)
                })
                .catch(error => {
                    reject(error)
                })
        })
    },
    async createCoverPage(params: CoverPage) {
        const db = await openDataBase()
        const transaction = db.transaction('coverPage', 'readwrite')
        const store = transaction.objectStore('coverPage')

        // 저장 가능한 형태로 변환
        const processedRequestInfo = { ...params }

        const request = store.add(processedRequestInfo)
        request.onsuccess = (event: any) => {
            console.log('createCoverPage sucess')
        }
        request.onerror = event => {
            console.log('createCoverPage faild')
        }
    },
    async updateCoverPage(params: CoverPage) {
        const db = await openDataBase()
        const transaction = db.transaction('coverPage', 'readwrite')
        const store = transaction.objectStore('coverPage')

        // 저장 가능한 형태로 변환
        const processedRequestInfo = { ...params }

        const request = store.put(processedRequestInfo)
        request.onsuccess = (event: any) => {
            console.log('updateCoverPage sucess')
        }
        request.onerror = event => {
            console.log('updateCoverPage faild')
        }
    },

    // 환경 설정   -------------------------------------------------------------------------
    async getEnvironmentSettingList(): Promise<any> {
        return new Promise((resolve, reject) => {
            openDataBase()
                .then(db => {
                    const transaction = db.transaction('environmentSetting', 'readonly')
                    const store = transaction.objectStore('environmentSetting')

                    const request = store.getAll()
                    request.onsuccess = () => resolve(request.result)
                    request.onerror = event => reject((event.target as IDBRequest).error)
                })
                .catch(error => {
                    reject(error)
                })
        })
    },
    async getEnvironmentSetting(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            openDataBase()
                .then(db => {
                    const transaction = db.transaction('environmentSetting', 'readonly')
                    const store = transaction.objectStore('environmentSetting')

                    const request = store.get(id)
                    request.onsuccess = () => resolve(request.result)
                    request.onerror = event => reject((event.target as IDBRequest).error)
                })
                .catch(error => {
                    reject(error)
                })
        })
    },
    async createEnvironmentSetting(params: EnvironmentSetting) {
        const db = await openDataBase()
        const transaction = db.transaction('environmentSetting', 'readwrite')
        const store = transaction.objectStore('environmentSetting')

        // 저장 가능한 형태로 변환
        const processedRequestInfo = { ...params }

        const request = store.add(processedRequestInfo)
        request.onsuccess = (event: any) => {
            console.log('createEnvironmentSetting sucess')
        }
        request.onerror = event => {
            console.log('createEnvironmentSetting faild')
        }
    },
    async updateEnvironmentSetting(params: EnvironmentSetting) {
        const db = await openDataBase()
        const transaction = db.transaction('environmentSetting', 'readwrite')
        const store = transaction.objectStore('environmentSetting')

        // 저장 가능한 형태로 변환
        const processedRequestInfo = { ...params }

        const request = store.put(processedRequestInfo)
        request.onsuccess = (event: any) => {
            console.log('updateEnvironmentSetting sucess')
        }
        request.onerror = event => {
            console.log('updateEnvironmentSetting faild')
        }
    },
    async deleteEnvironmentSetting(id: number) {
        const db = await openDataBase()
        const transaction = db.transaction('environmentSetting', 'readwrite')
        const store = transaction.objectStore('environmentSetting')

        const request = store.delete(id)
        request.onsuccess = (event: any) => {
            console.log('delete environmentSetting sucess')
        }
        request.onerror = event => {
            console.log('delete environmentSetting faild', (event.target as IDBRequest).error)
        }
    },

    
    // Folders  -------------------------------------------------------------------------
    async getFolders(): Promise<any> {
        return new Promise((resolve, reject) => {
            openDataBase()
                .then(db => {
                    const transaction = db.transaction('folders', 'readonly')
                    const store = transaction.objectStore('folders')

                    const request = store.getAll()
                    request.onsuccess = () => {
                        resolve(request.result)
                    console.log('getFolders',request.result)

                    }
                    request.onerror = event => reject((event.target as IDBRequest).error)
                })
                .catch(error => {
                    reject(error)
                })
        })
    },
    async createFolder(params: Folder) {
        const db = await openDataBase()
        const transaction = db.transaction('folders', 'readwrite')
        const store = transaction.objectStore('folders')

        // 저장 가능한 형태로 변환
        const processedRequestInfo = { 
            ...params,
            children: [],
         }
        console.log('processedRequestInfo', processedRequestInfo)
        const request = store.add(processedRequestInfo)
        request.onsuccess = (event: any) => {
            console.log('createFolder sucess')
        }
        request.onerror = event => {
            console.log('createFolder faild')
        }
    },
    async updateFolder(params: Folder) {
        const db = await openDataBase()
        const transaction = db.transaction('folders', 'readwrite')
        const store = transaction.objectStore('folders')

        // 저장 가능한 형태로 변환
        const processedRequestInfo = { 
            ...params,
            children: [],
         }
        const request = store.put(processedRequestInfo)
        request.onsuccess = (event: any) => {
            console.log('update Folder sucess')
        }
        request.onerror = event => {
            console.log('update Folder faild')
        }
    },
    async deleteFolder(id: number) {
        const db = await openDataBase()
        const transaction = db.transaction('folders', 'readwrite')
        const store = transaction.objectStore('folders')

        const request = store.delete(id)
        request.onsuccess = (event: any) => {
            console.log('delete Folder sucess')
        }
        request.onerror = event => {
            console.log('delete Folder faild', (event.target as IDBRequest).error)
        }
    },
}

//  Data Base 생성 및 연결
let dbInstance: IDBDatabase | null = null
function openDataBase(): Promise<IDBDatabase> {
    if (dbInstance) return Promise.resolve(dbInstance)
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('PostApiDB', 6)
        console.log(' openDataBase')
        request.onupgradeneeded = (event: any) => {
            const db = (event.target as IDBOpenDBRequest).result
            console.log('onupgradeneeded')

            if (!db.objectStoreNames.contains('apiTable')) {
                const store = db.createObjectStore('apiTable', { keyPath: 'id', autoIncrement: true })

                store.createIndex('requestURL', 'requestURL', { unique: false })
                store.createIndex('interfaceName', 'interfaceName', { unique: false })
                console.log('created apiTable store', store)
            }

            if (!db.objectStoreNames.contains('revisionHistory')) {
                const store = db.createObjectStore('revisionHistory', { keyPath: 'id', autoIncrement: true })
                console.log('created revisionHistory store', store)
            }

            if (!db.objectStoreNames.contains('coverPage')) {
                const store = db.createObjectStore('coverPage', { keyPath: 'id', autoIncrement: true })
                console.log('created coverPage store', store)
            }

            if (!db.objectStoreNames.contains('environmentSetting')) {
                const store = db.createObjectStore('environmentSetting', { keyPath: 'id', autoIncrement: true })
                console.log('created environmentSetting store', store)
            }

            if (!db.objectStoreNames.contains('folders')) {
                const store = db.createObjectStore('folders', { keyPath: 'id', autoIncrement: true })
                console.log('created folders store', store)
            }
        }
        request.onsuccess = event => {
            dbInstance = (event.target as IDBOpenDBRequest).result
            resolve((event.target as IDBOpenDBRequest).result)
            console.log('onsuccess store', dbInstance)
        }
        request.onerror = event => {
            reject((event.target as IDBOpenDBRequest).error)
            console.log('onerror store', (event.target as IDBOpenDBRequest).error)
        }
    })
}
