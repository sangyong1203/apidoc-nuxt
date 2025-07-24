<template>
    <div class="layout-login">
        <div class="outer">
            <div class="middle">
                <div class="middle-right fade-in">
                    <div class="login-header">
                        <img class="login-header-logo" :src="logo" />
                        <p class="login-header-title">{{ L.통합관제시스템 }}</p>
                        <p class="login-header-content">
                            {{ L.모회사의통합관제시스템이용을위하여로그인을진행하여주시기바랍니다 }}
                        </p>
                    </div>
                    <div class="login">
                        <el-form :model="formModel" status-icon :rules="rules" ref="formModel" >
                            <el-form-item prop="loginId" style="margin-bottom: 18px">
                                <el-input
                                    v-model="obj.loginForm.loginId"
                                    prefix-icon="user-filled"
                                    :placeholder="L.아이디"
                                    autocomplete="off"
                                    autofocus
                                />
                            </el-form-item>
                            <el-form-item prop="password">
                                <el-input
                                    v-model="obj.loginForm.password"
                                    prefix-icon="lock"
                                    :placeholder="L.패스워드"
                                    type="password"
                                    autocomplete="off"
                                    @keyup.enter="login(formModel)"
                                />
                            </el-form-item>

                            <div>
                                <el-checkbox v-model="obj.loginForm.isSaveId">{{ L.아이디저장 }}</el-checkbox>
                                <el-button size="large" class="login-btn" text bg @click="login(formModel)">{{
                                    L.로그인
                                }}</el-button>
                            </div>
                            <div>
                                <!-- <p style="color:#dddddd; font-size:12px; margin-top: 20px">{{ L.아이디가없으신분은회원가입신청을해주시기바랍니다 }}</p> -->
                                <el-button size="large" class="sign-up" text bg @click="obj.toSignupPage">{{
                                    L.회원가입신청
                                }}</el-button>
                            </div>
                            <div style="margin-top: 20px; display: flex; justify-content: flex-end">
                                <div style="color: white; display: flex; align-items: center; margin-right: 8px">
                                    {{ L.언어 }}:
                                </div>
                                <DropdownList
                                    style="width: 120px"
                                    v-model="obj.loginForm.langType"
                                    :placeholder="L.언어선택"
                                    :list="languageCodes"
                                    option-label="name"
                                    option-value="code"
                                    @on-change="changeLanguage"
                                />
                            </div>
                        </el-form>
                    </div>

                    <div class="login-footer">{{ L.copyright }}</div>
                </div>
            </div>
        </div>
    </div>
    <ChangePasswordDialog ref="changePasswordDialogRef"></ChangePasswordDialog>
</template>

<script lang="ts" setup>
import { LoginService } from '~/services/login/model_service/LoginService'
import { ref, onMounted, reactive } from 'vue'
import logo from '~/assets/images/LOGO.png'
import type { FormRules, FormInstance } from 'element-plus'
import ChangePasswordDialog from './ChangePasswordDialog.vue'
import { useLangStore } from '~/stores/LangStore'
import { useUserStore } from '~/stores/UserStore'
import { useMenuStore } from '~/stores/MenuStore'
import { useNavStore } from '~/stores/NavStore'
import { Notification } from '~/services/common/dialog/ComDialog'
import dayjs from 'dayjs'

const menuStore = useMenuStore()
const userStore = useUserStore()
const navStore = useNavStore()

// 다국어 설정
const langStore = useLangStore()
const L = ref({
    통합관제시스템: '통합관제시스템',
    모회사의통합관제시스템이용을위하여로그인을진행하여주시기바랍니다:
        '모회사의통합관제시스템이용을위하여로그인을진행하여주시기바랍니다',
    아이디: '아이디',
    패스워드: '패스워드',
    아이디저장: '아이디저장',
    로그인: '로그인',
    회원가입신청: '회원가입신청',
    언어: '언어',
    언어선택: '언어선택',
    copyright: 'copyright',
    아이디를입력해주세요: '아이디를 입력해 주세요.',
    패스워드를입력해주세요: '패스워드를 입력해주세요.',
})

const formModel: any = ref(null)
const obj = reactive(new LoginService())
const changePasswordDialogRef: any = ref(null)

const rules: FormRules = {
    loginId: [
        {
            validator: (rule: any, value: any, callback: any) => {
                if (!obj.loginForm.loginId) {
                    callback(new Error(L.value.아이디를입력해주세요))
                } else {
                    callback()
                }
            },
            trigger: 'change',
        },
    ],
    password: [
        {
            validator: (rule: any, value: any, callback: any) => {
                if (!obj.loginForm.password) {
                    callback(new Error(L.value.패스워드를입력해주세요))
                } else {
                    callback()
                }
            },
            trigger: 'change',
        },
    ],
}
onMounted(async () => {

    // ****** setLangFromDB, setLangFromExcelFile ****** 
    // 다국어 데이터 설정은  setLangFromDB 혹은 setLangFromExcelFile 를 사용한다.
    // setLangFromDB은 Data base에서 불러와서 설정하는 함수이고 setLangFromExcelFile는 로컬에 /public/langFile 있는 액셀파일을 load해서 설정 함  
    // ----------------
    // // 다국어API 호출하여 DB에서 데이터를 받아와서 다국어 언어 설정
    // await setLangFromDB()

    // 로컬에 있는 다국어 파일 사용하여 언어 설정 (파일폴더는 root 경로에 /public/langFile)
    await langStore.setLangFromExcelFile(langStore.langType ?? obj.loginForm.langType)


    // 언어선택 lang type 설정
    obj.loginForm.langType = langStore.langType ?? 'ko'

    // 아이디 저장 유무
    let isSaveId = localStorage.getItem('isSaveId')
    obj.loginForm.isSaveId = isSaveId ? JSON.parse(isSaveId) : false
    if (obj.loginForm.isSaveId == true) {
        obj.loginForm.loginId = localStorage.getItem('loginId') ?? ''
    }
})

// 로그인
const login = (formModel: FormInstance) => {
    try {
        formModel.validate((valid: any) => {
            if (valid) {
                obj.loadingStart()
                const params = {
                    loginId: obj.loginForm.loginId,
                    password: obj.loginForm.password,
                    lang: obj.loginForm.langType,
                }
                obj.login(params)
                    .then(res => {
                        if(res.data.isReset){
                            localStorage.setItem('loginId', obj.loginForm.loginId)
                            changePasswordDialogRef.value.openDialog()
                            return
                        }
                        if (res.data.isLogin == true) {
                            userStore.setSaveId(obj.loginForm.isSaveId)
                            if (obj.loginForm.isSaveId) {
                                localStorage.setItem('loginId', obj.loginForm.loginId)
                                localStorage.setItem('isSaveId', JSON.stringify(obj.loginForm.isSaveId))
                            } else {
                                localStorage.removeItem('loginId')
                                localStorage.removeItem('isSaveId')
                            }
                            userStore.set(res.data)
                            navStore.init()
                            menuStore.init()
                            // router.replace({ name: 'dashboard' })
                            // router.replace({ name: 'postApi' })
                            // obj.setMenuList()
                            // menuStore.setTempMenu()
                            userStore.setLoginTime(dayjs().format('YYYY-MM-DD HH:MM:ss'))
                        } else {
                            if (langStore.langType === 'ko') {
                                Notification.error(res.data.message_ko.replace('\\n', ''))
                            }
                            if (langStore.langType === 'en') {
                                Notification.error(res.data.message_en.replace('\\n', ''))
                            }
                        }
                    })
                    .catch(err => {
                        console.log(err)
                        Notification.error('에러 메시지:' + err)
                    })
            }
        })
    } catch (error) {
        console.log('login', error)
    }
}
// 다국어 ---------------------------------------------------
// 다국어 설정
const setLang = (langData: any[]) => {
    langStore.setLang(langData)
    langStore.setLangType(obj.loginForm.langType)
}
// 선택 언어 변경
const changeLanguage = async (value: string) => {
    await obj.getLang({ langType: value })
    setLang(obj.lang)
    L.value = langStore.lang.login
    langStore.langType = value
}
// 다국어API 호출하여 다국어 언어 설정
const setLangFromDB = async () => {
    if (langStore.langType) {
        obj.loginForm.langType = langStore.langType
    }
    const res = await obj.getLang({ langType: obj.loginForm.langType })
    if (!res.data || res.data.length === 0) {
        // 디폴트 한국어 데이터
        langStore.setLangFromExcelFile(obj.loginForm.langType)
    }
    // 언어 데이터 설정
    setLang(obj.lang)
    L.value = langStore.lang.login

    // 로그인시 기본 컴포넌트 언어 데이터 설정
    localStorage.setItem('langCommon', JSON.stringify(langStore.lang.common))
    // console.log(localStorage.getItem('langCommon'))
}

// 언어 코드 리스트
const languageCodes = [
    { code: 'en', name: 'English' },
    { code: 'ko', name: 'Korean' },
    // { code: 'es', name: 'Spanish' },
    // { code: 'fr', name: 'French' },
    // { code: 'de', name: 'German' },
    // { code: 'zh', name: 'Chinese' },
    // { code: 'ja', name: 'Japanese' },
    // { code: 'ru', name: 'Russian' },
    // { code: 'it', name: 'Italian' },
    // { code: 'pt', name: 'Portuguese' },
    // { code: 'ar', name: 'Arabic' },
    // { code: 'hi', name: 'Hindi' },
    // { code: 'bn', name: 'Bengali' },
    // { code: 'pa', name: 'Punjabi' },
    // { code: 'ms', name: 'Malay' },
    // { code: 'vi', name: 'Vietnamese' },
    // { code: 'id', name: 'Indonesian' },
    // { code: 'th', name: 'Thai' },
    // { code: 'tr', name: 'Turkish' },
    // { code: 'nl', name: 'Dutch' },
    // { code: 'sv', name: 'Swedish' },
    // { code: 'fi', name: 'Finnish' },
    // { code: 'da', name: 'Danish' },
    // { code: 'no', name: 'Norwegian' },
    // { code: 'pl', name: 'Polish' },
    // { code: 'he', name: 'Hebrew' },
    // { code: 'el', name: 'Greek' },
    // { code: 'cs', name: 'Czech' },
    // { code: 'hu', name: 'Hungarian' },
    // { code: 'ro', name: 'Romanian' },
    // { code: 'sk', name: 'Slovak' },
    // { code: 'bg', name: 'Bulgarian' },
    // { code: 'uk', name: 'Ukrainian' },
    // { code: 'sr', name: 'Serbian' },
    // { code: 'hr', name: 'Croatian' },
    // { code: 'sl', name: 'Slovenian' },
    // { code: 'lt', name: 'Lithuanian' },
    // { code: 'lv', name: 'Latvian' },
    // { code: 'et', name: 'Estonian' },
    // { code: 'fa', name: 'Persian' },
    // { code: 'ur', name: 'Urdu' },
    // { code: 'ta', name: 'Tamil' },
    // { code: 'te', name: 'Telugu' },
    // { code: 'kn', name: 'Kannada' },
    // { code: 'ml', name: 'Malayalam' },
    // { code: 'mr', name: 'Marathi' },
    // { code: 'gu', name: 'Gujarati' },
    // { code: 'am', name: 'Amharic' },
    // { code: 'sw', name: 'Swahili' },
    // { code: 'af', name: 'Afrikaans' }
]
</script>

<style scoped>
.layout-login .outer {
    display: table;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-color: var(--color-gray);
}

.layout-login .middle {
    display: flex;
    /* justify-content: center; */
    justify-content: flex-end;
    height: 100%;
}
.layout-login .middle-left {
    display: flex;
    align-items: flex-start;
    color: rgb(237, 237, 237);
    flex-direction: column;
    justify-content: center;
    padding-right: 20px;
    padding-left: 10%;
    flex: 1;
}
.layout-login .system-name {
    font-size: 65px;
    font-weight: 100;
    /* color: #d3d3d3; */
    color: #f1f1f1;
    width: 100%;
}
.system-sub-name {
    color: #d3d3d3;
    font-size: 32px;
}
.layout-login .middle-right {
    width: 570px;
    padding: 48px;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    background-color: var(--color-gray-dark);
    box-shadow: -4px 0px 8px #0e1d1f7a;
}
/* Login Form */
.layout-login .middle-right .login {
    margin-left: auto;
    margin-right: auto;
    width: 100%;
}
.layout-login .middle-right .login-header {
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    margin-bottom: 20px;
}
.layout-login .middle-right .login-header .title {
    color: #c9d1d9;
    font-size: 48px;
    margin-right: 10px;
    font-weight: bold;
}
.layout-login .middle-right .login-header-logo {
    display: block;
    width: 255px;
}
.layout-login .middle-right .login-header-title {
    padding: 12px 0 0;
    font-size: 34px;
    font-weight: bold;
    width: 100%;
    color: #d4d4d4;
}
.layout-login .middle-right .login-header-content {
    padding: 16px 160px 0 0;
    font-size: 18px;
    line-height: 28px;
    width: 100%;
    color: #d4d4d4;
}
.layout-login .middle-right .login .el-input__wrapper {
    background-color: #262727;
    box-shadow: none;
    border: 1px solid #414243;
    padding: 0px 8px;
}
.layout-login .middle-right .login .el-form-item.is-error .el-input__wrapper.is-focus {
    box-shadow: none !important;
}
.layout-login .middle-right .login .el-input .el-input__inner {
    height: 45px;
    color: #c9d1d9;
}
.layout-login .middle-right .login .el-input .el-input__prefix-inner {
    height: 45px;
    color: #c9d1d9;
}
.layout-login .middle-right .login .el-input .el-input__suffix-inner {
    height: 45px;
    color: #c9d1d9;
}
.layout-login .middle-right .login .el-form-item {
    margin-bottom: 8px;
}
.layout-login .middle-right .login .el-form-item__error {
    color: #c9d1d9;
}
.layout-login .middle-right .login .el-form-item.is-error .el-input__validateIcon {
    color: #c9d1d9;
}
.layout-login .middle-right .login .login-btn {
    width: 100%;
    font-size: 14px;
    margin-top: 4px;
    color: white  !important;
    background: var(--color-main);
}
.layout-login .middle-right .login .el-checkbox {
    color: #dddddd;
    --el-checkbox-font-size: 12px;
    --el-color-primary: var(--color-main) !important;
}
:deep(.el-checkbox__label) {
    color: #dddddd !important;
}

.layout-login .middle-right .login .sign-up {
    background: var(--color-gray);
    color: #f1f1f1;
    width: 100%;
    font-size: 14px;
    margin-top: 10px;
}
.layout-login .middle-right .login-footer {
    font-size: 12px;
    text-align: center;
    color: #c9d1d9;
    margin-top: 20px;
    position: absolute;
    bottom: 32px;
}
.layout-login .middle-right .login input:-webkit-autofill,
.layout-login .middle-right .login input:-webkit-autofill:hover,
.layout-login .middle-right .login input:-webkit-autofill:focus,
.layout-login .middle-right .login input:-webkit-autofill:active {
    transition: background-color 5000s ease-in-out 0s;
    -webkit-transition: background-color 9999s ease-out;
    -webkit-box-shadow: 0 0 0px 1000px #161b22 inset !important;
    -webkit-text-fill-color: #c9d1d9 !important;
}

.fade-in {
    animation-duration: 3s;
    animation-name: fadein;
}

@keyframes fadein {
    from {
        opacity: 0;
    }

    to {
        opacity: 100%;
    }
}

.slide-in {
    animation-duration: 1.5s;
    animation-name: slidein;
}

@keyframes slidein {
    from {
        opacity: 0;
        height: 0;
    }

    to {
        opacity: 100%;
        height: 25%;
    }
}
</style>
