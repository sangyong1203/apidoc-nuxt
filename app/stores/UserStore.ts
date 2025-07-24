import { defineStore } from 'pinia'
import { isEmpty } from 'lodash'

export type UserState  = {
  loggedInUser: UserModel
  onceAuth: boolean
  isLoggedIn: boolean
  isSaveId: boolean
  loginTime: string
  darkMode: boolean
}

export type UserModel = {
  isLogin: boolean
  accessToken: string
  validateKey: string
  expire: string
  user: {
      email: string | null
      loginId: string
      name: string
      role: string
      roleUrl: string
      lang: string
  }
}
export const useUserStore = defineStore('User', () => {
  
    const loggedInUser = ref({
      accessToken: '',
      expire: '',
      isLogin: false,
      validateKey: '',
      user: {
          email: '',
          loginId: '',
          name: '',
          role: '',
          roleUrl: '',
          lang: ''
      }
    })
    const onceAuth = ref(false)
    const isLoggedIn = ref(false)
    const isSaveId = ref(false)
    const loginTime = ref('')
    const darkMode = ref(true)
    const loginUser = computed(() => loggedInUser.value as UserModel)
    const getDarkMode = computed(() => darkMode.value)
    const isOnceAuth = computed(() => {
      const result = onceAuth.value
      onceAuth.value = false
      return result
    })
    const hasLogin = computed(() => isLoggedIn.value)
    const getAuthToken = computed(() => {
      const {  accessToken } = loggedInUser.value
      if ( isEmpty(accessToken)) return ''
      return accessToken
    })
  
    const init = () => {
      loggedInUser.value = {
          accessToken: '',
          expire: '',
          isLogin: false,
          validateKey: '',
          user: {
              email: '',
              loginId: '',
              name: '',
              role: '',
              roleUrl: '',
              lang: ''
          }
      } 
      isSaveId.value = false
    }
    const set = (info: UserModel) => {
      loggedInUser.value = info as any
    }
    const successOnceAuth = () => {
      onceAuth.value = true
    }
    const setSaveId = ( value:boolean ) => {
      isSaveId.value = value
    }
    const setLoginTime = (value:string) => {
      loginTime.value = value
    }
    const setDarkMode = () => {
      const htmlEl = document.querySelector('html')
      // if (darkMode.value) {
      //     if (htmlEl) {
      //         htmlEl.className = 'dark'
      //     }
      // } else {
      //     if (htmlEl) {
      //         htmlEl.className = ''
      //     }
      // }
    }
    return {
      loggedInUser,
      onceAuth,
      isLoggedIn,
      isSaveId,
      loginTime,
      darkMode,
      loginUser,
      getDarkMode,
      isOnceAuth,
      hasLogin,
      getAuthToken,
      init,
      set,
      successOnceAuth,
      setSaveId,
      setLoginTime,
      setDarkMode
  }
})
