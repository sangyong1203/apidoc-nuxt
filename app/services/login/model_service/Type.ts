export interface LoginInfoModel {
    loginId: string
    password: string
    lang: string
}

export interface SignupModel {
    loginId: string // 사용자 아이디
    // companyId: number | null // 회사아이디
    name: string // 사용자명
    phone: string // 전화번호
    email: string // 이메일주소
    // roleCode: string // 권한코드
    password: string // 비밀번호
}
