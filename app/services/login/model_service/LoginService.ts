import api from './SelfApi'
// import router from '~/router'
import type { SignupModel } from './Type'
import { useUserStore } from '~/stores/UserStore'
import { useMenuStore } from '~/stores/MenuStore'
import { useNavStore } from '~/stores/NavStore'
import { ElLoading } from 'element-plus'

export class LoginService {
    loginForm = {
        loginId: '',
        password: '',
        isSaveId: false,
        langType: 'ko',
    }
    lang = []
    siteList: { id: number; companyName: string }[] = []

    menuStore = useMenuStore()
    userStore = useUserStore()
    navStore = useNavStore()

    // 메뉴 조회
    async setMenuList() {
        const res = await api.userMenu()
        this.menuStore.setMenu(res.data)
    }
    // 로그인
    async login(params: { loginId: string; password: string; lang: string }) {
        return await api.login(params)
    }
    // 로그아웃
    async logout() {
        // 로그인 페이지 이동
        // router.push({ name: 'login' })

        // Store 초기화
        this.userStore.init()
        this.navStore.init()
        this.menuStore.init()
    }
    // 만료 비밀번호 변경
    async changeExpiredPassword(password: string) {
        const params = {
            id: this.userStore.loggedInUser.user.loginId,
            pswd: password,
            token: this.userStore.loggedInUser.accessToken,
        }
        return await api.changeExpiredPassword(params)
    }
    // 비밀번호 초기화후 비밀번호 변경
    async changePassword(loginId:string, password: string, resetPassword: string) {
        const params = {
            loginId,
            password,
            resetPassword,
        }
        return await api.changePassword(params)
    }
    // 운영자 계정 신청
    async signup(params: SignupModel) {
        await api.signup(params)
    }

    // 중복아이디 체크
    async checkDuplicateId(params: { loginId: string }) {
        const res = await api.checkId(params)
        return res.data
    }
    // 다국어 데이터 불러오기
    async getLang(params: { langType: string }) {
        const res = await api.getLang(params)
        this.lang = res.data
        return res
    }
    // 로그인 페이지 이동
    toLoginPage = () => {
        // router.push({ name: 'login' })
    }
    // 비밀번호 만료시 변경페이지 이동
    toSignupPage = () => {
        // router.push({ name: 'sign_up' })
    }

    // loading ---로그인시 Loding효과 --
    loadingStart = () => {
        const loading = ElLoading.service({
            lock: true,
            text: 'Loading',
            background: 'rgba(0, 0, 0, 0.7)',
        })
        setTimeout(() => {
            loading.close()
        }, 2500)
    }
}
