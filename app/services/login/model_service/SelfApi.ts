import { fetch } from '~/services/common/modules/axios'
import { APIResponse } from '~/services/common/modules/axios/response'
import type { Params, PayloadModel } from '~/services/common/modules/axios/request'

export default {
    // 로그인
  async login(params: Params): Promise<APIResponse> {
    const payload:PayloadModel = { body: params }
    const res = await fetch().post('/api/login', { payload })
    return res
  },

  // 메뉴 조회
  async userMenu(): Promise<APIResponse> {
    const payload:PayloadModel = { query : {typ : 'IM'}}
    const res = await fetch().get('/api/authenticated/userMenu', { payload })
    return res
  },

  // 비밀번호 초기화후 비밀번호 변경 
  async changePassword(params:Params): Promise<APIResponse> {
    const payload:PayloadModel = { body: params }
    const res = await fetch().put('/api/system/manager/changePassword', { payload })
    return res
  },
  // 운영자 계정 신청
  async signup(params:Params): Promise<any> {
    const payload:PayloadModel = { body: params}
    return await fetch().post('/api/system/managerSignup', { payload })
  },
  // 권한리스트
  async getRoleList(): Promise<APIResponse>{
    return await fetch().get('/api/system/authority/list')
  },
  // 중복아이디 체크
  async checkId(params:Params): Promise<APIResponse>{
    const payload:PayloadModel = { body: params}
    return await fetch().post('/api/system/manager/checkId', { payload })
  },
  // 다국어 데이터 불러오기
  async getLang(params:Params): Promise<APIResponse>{
    const payload:PayloadModel = { query: params}
    return await fetch().get('/api/system/language', { payload })
  },
  
 //---------api 확인 필요 ----------
  // 비밀번호만료회원조회
  async getExpiredPswd(params:string): Promise<APIResponse> {
    const payload:PayloadModel = { query: {token:params} }
    const res = await fetch().get('/api/expired/password/expiredPswd', { payload })
    return res
  },
  // 만료된 비밀번호변경
  async changeExpiredPassword(params:Params): Promise<APIResponse> {
    const payload:PayloadModel = { body: params }
    const res = await fetch().put('/api/expired/password/updateExpiredPswd', { payload })
    return res
  },
}