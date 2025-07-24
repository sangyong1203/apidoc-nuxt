import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import type { Action } from 'element-plus'
import { ref, onMounted } from 'vue'

const L:any = ref({})
const defaultLangCommon = {
  성공:'성공',
  실패:'실패',
  경고:'경고',
  노트:'노트',
  예:'예',
  아니요:'아니요'
} 

if(process.client){

  // common 언어 데이터 설정
  const langCommon = localStorage.getItem('langCommon')
  try {
      L.value = JSON.parse(langCommon ?? JSON.stringify(defaultLangCommon));
  } catch (error) {
      console.error('Error parsing langCommon:', error);
      L.value = defaultLangCommon;
  }
}
/**
 * @descrption 힌트 메시지 
 * @param message 메시지 내용
 * @example 
 *  사용예시
 *   Message.success('등록 성공하였습니다.')
 *   Message.error('등록 실패하였습니다.')
 * ...
 */
export const Message = {
  success(message:string) { // 성공
    ElMessage({
      message: message,
      type: 'success'
    })
  },
  warning(message:string) { // 경고
    ElMessage({
      message: message,
      type: 'warning'
    })
  },
  error(message:string) { // 에러
    ElMessage({
      message: message,
      type: 'error'
    })
  },
  info(message:string) { // 노트
    ElMessage({
        message: message,
        type: 'info'
    })
  },
}

/**
 * @descrption 알람 메시지 창
 * @param message 알람 메시지 내용
 * @param title 알람창 헤더 타이틀
 * @example 
 *  사용예시
 *   Notification.success('등록 성공하였습니다.', '성공')
 *   Notification.error('등록 실패하였습니다.', '실패')
 * ...
 */
export const Notification = {
  success(message:string, title?:string,) { // 성공
    ElNotification({
      title: title ?? L.value['성공'],
      message: message,
      position: 'top-right',
      type: 'success',
      duration: 3000
    })
  },
  warning(message:string, title?:string) { // 경고
    ElNotification({
      title: title ?? L.value['경고'],
      message: message,
      position: 'top-right',
      type: 'warning',
      duration: 3000
    })
  },
  error(message:string, title?:string) { // 에러
    ElNotification({
      title: title ?? L.value['실패'],
      message: message,
      position: 'top-right',
      type: 'error',
      duration: 3000
    })
  },
  info(message:string, title?:string) { // 노트
    ElNotification({
        title: title ?? L.value['노트'],
        message: message,
        position: 'top-right',
        type: 'info',
        duration: 3000
    })
  },
}


/**
 * 
 * @description 공용 팝업 컨펌창. 메시지와 확인/취소, 예/아니오, 확인 등 버튼이 있는 다이얼로그.
 * onConfirm, onCancel, onClose 등 이벤트 callback함수 사용가능
 * @param message 다이얼로그 내용
 * @param title 다이얼로그 창 헤더 부분 타이틀 
 * @param type 'CONFIRM_YN' | 'YN' | 'OK' 선텍가능
 * @param options 버튼 텍스트 설정
 * @example
 *  사용예시
      useGlobalDialog('등록하시겠습니까?','노트','CONFIRM_YN')
      .onConfirm(()=>{
        // 확인/예 버튼 클릭시 do something
      })
      .onCancel(()=>{
        // 취소/아니오 버튼 클릭시 do something
      })
      .onClose(()=>{
        // 닫기 x 버튼 클릭시 do something
      })
 */
export const useGlobalDialog = (
  message:string, 
  title:string,
  type: 'CONFIRM_YN' | 'YN' | 'OK',
  options?: {
    confirmButtonText?: string,
    cancelButtonText?: string,
  },
) => {
  
  // 확인/예 버튼 클릭시 
  let doConfirm:any = ()=> {}
  const onConfirm = (callback:()=> void) => {
    doConfirm = callback
    return dialog
  }
  // 취소/아니오 버튼 클릭시 
  let docancel:any = ()=> {}
  const onCancel = (callback:()=> void) => {
    docancel = callback
    return dialog
  }
  // 닫기 x 버튼 클릭시 
  let doClose:any = ()=> {}
  const onClose = (callback:()=> void) => {
    doClose = callback
    return dialog
  }

  if(type === 'CONFIRM_YN'){
    ElMessageBox.confirm(
      message,
      title,
      {
        confirmButtonText: (options && options.confirmButtonText)??L.value.확인,
        cancelButtonText: (options && options.cancelButtonText)??L.value.취소,
        distinguishCancelAndClose: true, // 취소 버튼이랑 창 닫기 버튼 구분 필요시 true로 설정
        closeOnClickModal: false, 
        callback:(action:Action)=>{
          action == 'confirm' ? doConfirm() : action == 'cancel' ? docancel() : doClose()
  
        }
      }
    )
  }
  if(type === 'YN'){
    ElMessageBox.confirm(
      message,
      title,
      {
        confirmButtonText: (options && options.confirmButtonText)??L.value.예,
        cancelButtonText: (options && options.cancelButtonText)??L.value.아니오,
        distinguishCancelAndClose: true, // 취소 버튼이랑 창 닫기 버튼 구분 필요시 true로 설정
        closeOnClickModal: false,
        callback:(action:Action)=>{
          action == 'confirm' ? doConfirm() : action == 'cancel' ? docancel() : doClose()
        }
      }
    )
  }
  if(type === 'OK'){
    ElMessageBox.confirm(
      message,
      title,
      {
        confirmButtonText: (options && options.confirmButtonText)??L.value.확인,
        showCancelButton: false,
        showClose: false,
        callback:()=>{
          doConfirm()
        }
      }
    )
  }
  const dialog = {
    onConfirm,
    onCancel,
    onClose,
  }

  return dialog
}
