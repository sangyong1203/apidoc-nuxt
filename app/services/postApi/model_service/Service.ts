import api from './SelfApi'
import type { PostApiModel, MenuList, MenuItem, RevisionHistory, CoverPage, EnvironmentSetting, Folder } from './Type'
export class Service {
    apiList: any[] = []
    apiItem: PostApiModel = {
        interfaceName: '',
        description: '',
        header: '{ "Authorization" : {{accessKey}} }',
        requestURL: '',
        httpMethod: '',
        donwloadFileName: '',
        clientType: '',
        headersContentType: 'json',
        testResult: '',
        request: [
            {
                paramId: this.createId(),
                parentParamId: '',
                parameter: '',
                testValue: null as any,
                files: [],
                level: 1,
                requiredYn: '',
                type: '',
                description: '',
                childrenCount: 0,
                valid: true,
            },
        ],
        response: [
            {
                variableId: this.createId(),
                parentVariableId: '',
                variable: '',
                testValue: null as any,
                level: 1,
                requiredYn: '',
                type: '',
                description: '',
                childrenCount: 0,
                valid: true,
            },
        ],
        requestExample: {},
        responseExample: '',
    }
    resultData: any = {}
    httpMethodList = [
        { label: 'GET', value: 'GET' },
        { label: 'POST', value: 'POST' },
        { label: 'PUT', value: 'PUT' },
        { label: 'DELETE', value: 'DELETE' },
        { label: 'GETFILE', value: 'GETFILE' },
    ]
    clientTypeList = [
        { label: '관제', value: '관제' },
        { label: 'APP', value: 'APP' },
        { label: 'IoT', value: 'IoT' },
        { label: '공통', value: '공통' },
        { label: '기타', value: '기타' },
    ]
    headersContentTypeList = [
        { label: 'application/json', value: 'json' },
        { label: 'multipart/form-data', value: 'form-data' },
    ]

    async sendData(params: {
        httpMethod: string
        headersContentType: string
        donwloadFileName?: string
        requestURL: string
        requestParams: any
    }): Promise<any> {
        const { httpMethod, headersContentType, donwloadFileName, requestURL, requestParams } = params
        const param = {
            httpMethod,
            headersContentType,
            donwloadFileName,
            requestURL,
            requestParams,
        }
        console.log('sendData')
        const res = await api.sendApi(param)
        this.resultData = res
        return res
    }
    async getApiList(params: {
        requestURL?: string
        httpMethod?: string
        interfaceName?: string
        clientType?: string
    }): Promise<void> {
        const res = await api.getApiList(params)
        
        this.apiList = res
        console.log('getApiList', this.apiList)
    }
    async getApiInfo(id: number) {
        const res = await api.getApiInfo(id)
        return res
    }
    async createApi(params: PostApiModel) {
        const res = await api.createApi(params)
        return res
    }
    async updateApi(params: PostApiModel) {
        const res = await api.updateApi(params)
        return res
    }
    async deleteApi(id: number) {
        const res = await api.deleteApi(id)
        return res
    }

    // paramId, variableId 생성
    createId(): string {
        return new Date().getTime().toString()
    }

    // menu list------------------------
    menuList: MenuList[] = []
    menuItem: MenuItem = {
        id: 0, // 메뉴 아이디
        title: '', // 메뉴 명
        titleEn: '', // 메뉴 영어
        path: '', // 경로
        icon: '', // 아이콘
        stp: 0, // 순서
        useYn: 'Y', // 사용여부
    }
    async getMenuList(): Promise<void> {
        // const res = await api.getMenuList()
        // this.menuList = res.data[0].children ?? []
    }

    // 개정이력 -------------------
    historyList: RevisionHistory[] = []
    async getHistoryList(): Promise<void> {
        const res = await api.getHistoryList()
        this.historyList = res
    }
    async createHistory(params: RevisionHistory) {
        const res = await api.createHistory(params)
        return res
    }
    async updateHistory(params: RevisionHistory) {
        const res = await api.updateHistory(params)
        return res
    }
    async deleteHistory(id: number) {
        const res = await api.deleteHistory(id)
        return res
    }

    // 표지 -------------------
    coverPageInfo: CoverPage = {
        title1: '',
        title2: '',
        version: '',
        publishDate: '',
        creater: '',
        reviewer: '',
        approver: '',
        copyright: '',
        copyrightDescription: '',
    }
    async getCoverPage(): Promise<void> {
        const res = await api.getCoverPage()
        this.coverPageInfo = Object.assign({},this.coverPageInfo,res) 
    }
    async createCoverPage(params: CoverPage) {
        const res = await api.createCoverPage(params)
        return res
    }
    async updateCoverPage(params: CoverPage) {
        const res = await api.updateCoverPage(params)
        return res
    }

    // 환경 설정 -------------------
    environmentSetting: EnvironmentSetting = {
        name:'',
        host: '',
        authToken: '',
        isSelected: false
    }
    environmentSettingList: EnvironmentSetting[] = []
    async getEnvironmentSettingList(): Promise<void> {
        const res = await api.getEnvironmentSettingList()
        this.environmentSettingList = res
        console.log('environmentSettingList', this.environmentSettingList)
        
    }
    async getEnvironmentSetting(): Promise<void> {
        await this.getEnvironmentSettingList()
        const seletedEnSetting = this.environmentSettingList.find( (item:EnvironmentSetting) => item.isSelected === true)
        this.environmentSetting = Object.assign({}, this.environmentSetting, seletedEnSetting) 
    }
    async createEnvironmentSetting(params: EnvironmentSetting) {
        const res = await api.createEnvironmentSetting(params)
        return res
    }
    async updateEnvironmentSetting(params: EnvironmentSetting) {
        const res = await api.updateEnvironmentSetting(params)
        return res
    }
    async deleteEnvironmentSetting(id:number) {
        const res = await api.deleteEnvironmentSetting(id)
        return res
    }

    // 폴더  ------------------------------------------
    folders: Folder[] = []
    treeFolders : Folder[] = []
    async getFolders(): Promise<void> {
        const res = await api.getFolders()
        if (res) {
            console.log('folders', res)

            this.treeFolders = []
            this.folders = res

            const idMap = new Map()
            this.folders.forEach((item:Folder) => {
                idMap.set(item.folderId, item)
            })
            this.folders.forEach( (item:any) => {
                if(!item.parentFolderId){
                    this.treeFolders.push(item)
                } else {
                    const parent = idMap.get(item.parentFolderId)
                    if(parent){
                        parent.children.push(item)
                    }
                }
            })
            console.log('getFolders', this.treeFolders)
        }
    }
    async createFolder(params: Folder) {
        const res = await api.createFolder(params)
        return res
    }
    async updateFolder(params: Folder) {
        const res = await api.updateFolder(params)
        return res
    }
    async deleteFolder(folderId:number) {
        const res = await api.deleteFolder(folderId)
        return res
    }
}
