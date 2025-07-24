export type PostApiModel = {
    interfaceName: string // 인터페이스명 
    description: string // 설명 
    header: string // Header  { "Authorization" : {{accessKey}} }
    requestURL: string // Request URL  예: /api/setting/dashboard/list
    httpMethod: string // HTTP Method 
    donwloadFileName: string // 파일 명 
    clientType: string // 클라이언트 타입 관제, App, 공통 
    headersContentType: string // Headers Content-Type 지정 
    testResult: string
    request: RequestType[], // 요청 
    response: ResponseType[], // 반환 
    requestExample:Object // 요청 약식  
    responseExample:string // 반환 데이터 약식 
}

export type RequestType = {
    paramId: string
    parentParamId: string
    parameter: string // 파람 
    type:string // 데이터 타입  
    testValue: any
    files: any[]
    level: number
    requiredYn: string
    description:string // 변수 label 혹은 설명   
    childrenCount: number
    valid:boolean
}
export type ResponseType = {
    variableId: string
    parentVariableId: string
    variable: string, // 반환값 
    type:string // 데이터 타입  
    testValue: any
    level: number
    requiredYn: string
    description: string // 변수 label 혹은 설명   
    childrenCount: number
    valid:boolean
}

export type SearchParams = {
    page: number
    searchKey: string
    searchValue: string
    dateKey: string
    startDate: string
    endDate: string
    sortColumn: string
    sortAscending: boolean
    rowSize: number
}

export type ApiList = {
    interfaceName: string
    httpMethod: string
    requestURL: string
    description: string
    step: number
}

export type MenuModel = {
    id: number // 메뉴 아이디
    title: string // 메뉴 명
    titleEn: string // 메뉴 영어
    path: string // 경로
    icon: string // 아이콘
    stp: number // 순서
    useYn: 'Y' | 'N' // 사용여부
    children: MenuModel[]
}
export type MenuList = Pick<MenuModel, 'id' | 'title' | 'titleEn' | 'path' | 'icon' | 'stp' | 'useYn' | 'children'>
export type MenuItem = Pick<MenuModel, 'id' | 'title' | 'titleEn' | 'path' | 'icon' | 'stp' | 'useYn'>
export type MenuCreateParams = Pick<MenuModel, 'title' | 'titleEn' | 'path' | 'icon' | 'stp' | 'useYn'>
export type MenuUpdateParams = Pick<MenuModel, 'id' | 'title' | 'titleEn' | 'path' | 'icon' | 'stp' | 'useYn'>
export type MenuDeletePrams = Pick<MenuModel, 'id'>


// 개정 이력 
export type RevisionHistory = {
    id?: number
    version: string
    updateDate: string
    updateType: string
    content: string
    creater: string
    reviewer: string
    approver: string
}

// 표지  
export type CoverPage = {
    id?:number
    title1: string
    title2: string
    version: string
    publishDate: string
    creater: string
    reviewer: string
    approver: string
    copyright: string
    copyrightDescription: string
}

// 환경 설정 
export type EnvironmentSetting = {
    id?:number
    name: string
    host: string
    authToken: string
    isSelected: boolean
}

export type Folder = {
    id?: null
    folderId: string
    parentFolderId: string
    folderName: string
    requestURL: string
    isOpen: boolean
    children: Folder[]
}