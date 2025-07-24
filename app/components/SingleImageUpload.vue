<template>
    <!-- 파일업로드 -->
    <el-upload
        v-loading="loading"
        class="imageUpload"
        :style="{width:width, height:height}"
        ref="uploadRef"
        :headers="{ Authorization: userInfo.accessToken, SystemId: 'IM' }"
        :action="'/api/file/singleUpload/' + division + '/' + refId + '/' + fileType"
        :show-file-list="false"
        :on-change="handleImageChange"
        :on-success="uploadSuccess"
        :accept="accept"
        :auto-upload="false"
        :disabled="disabled"
    >   

        <div class="imageBlock" v-if="imageUrl" :style="{width:width, height:height}" >
            <el-icon @click.stop="handlePictureCardPreview" style="position: absolute; right: 10px; bottom: 10px; cursor: pointer;"><Search /></el-icon>
            <el-icon @click.stop="deleteImage" style="position: absolute; right: 30px; bottom: 10px;"><Delete /></el-icon>
            <img :src="imageUrl" class="upload" :style="{width:width, height:height}" />
        </div>
        <div v-else class="upload" :style="{width:width, height:height}">
            <el-icon ><Plus /></el-icon>
        </div>

    </el-upload>
    <BasicDialog v-model="showImage" title="이미지 프리뷰" :button-types="['닫기']" :width="500">
        <el-image :src="previewUrl" alt="사진"></el-image>
    </BasicDialog>
</template>

<script setup lang="ts">
import { toRefs, ref, watch } from 'vue'
import { Notification } from '~/services/common/dialog/ComDialog'
import { useUserStore } from '~/stores/UserStore'
import { fetch } from '~/services/common/modules/axios'
import type { PayloadModel } from '~/services/common/modules/axios/request'
import type { UploadFile, UploadFiles } from 'element-plus'
// uploadFile: UploadFile, uploadFiles: UploadFiles

export interface Props {
    disabled?: boolean
    message?: string // tip 메시지
    accept?: string // 접수 할수 있는 파일 타입 .png, .jepg, .xlsx 등
    size?: number // 최대 파일 크기, 단위: KB
    division?: string // 파일 업로드 구분
    // refId?: number // 파일 업로드시 참조번호
    fileType: 'image' | 'data' // 파일 종류 이미지(image), 기타(data)
    url?: any // 이미지 파일
    width?: string
    height?: string
}
const props = defineProps<Props>()
const { url, disabled,  accept, size, width, height, fileType, message, division } = toRefs(props)
const uploadRef: any = ref(null)
const showImage = ref<boolean>(false)
const previewUrl = ref<string>('')
const loading = ref<boolean>(false)
const refId = ref<number>() // 해당페이지 데이터 id

const emit = defineEmits(['onUpload', 'uploadDone', 'onDelete', 'refresh'])

const userInfo: any = useUserStore().loggedInUser
const imageUrl = ref(url.value??'')
const uploadedFile: any = ref(null)
const handleImageChange = (file: UploadFile, files: UploadFiles) => {
    if(disabled.value) return
    
    //파일용량 체크
    if (size.value && file.size && file.size/ 1024 > size.value) {
        onSizeOver(file)
        return
    }
    // 파일이 1개 이상시 최신만 보료 
    if (files.length > 1) {
        files.shift()
    }
    // console.log('imageUrl.value',imageUrl.value)
    // console.log('files',files)

    imageUrl.value = URL.createObjectURL(file.raw as any)
    uploadedFile.value = file
    emit('onUpload', files)
    onUploadFile()
}
watch(url,()=>{
    imageUrl.value = url.value
})
// 이미지 삭제
const deleteImage = () => {
    if(disabled.value) return
    if(url.value){
        emit('onDelete')
        onDeleteFile()
    }
    if(uploadedFile.value){
        uploadRef.value!.handleRemove(uploadedFile.value)
    }
    imageUrl.value = ''
}
// 이미지 프리뷰 창 열기
const handlePictureCardPreview = () => {
    showImage.value = true
    previewUrl.value = imageUrl.value
}
// 파일size 초과시 삭제 및 note
const onSizeOver = (file: any) => {
    Notification.warning(`최대 ${size.value}KB 크기 파일을 첨부 할수 있습니다.`)
}
// 파일 서벙에 업로드 
const submitUpload = async () => {
    loading.value = true
    setTimeout(()=>{
        loading.value = false
    }, 2000)
    return await uploadRef.value!.submit()
}
// 서버에 업로드 성공시 호출
const uploadSuccess = (response: any) => {
    if (response) {
        emit('uploadDone', true)
    }
}
// 서버에서 이미지 삭제
const removeImageFile = async () =>{
    const payload: PayloadModel = { query: {division:division.value, refId:refId.value} }
    fetch().get('/api/file/list', {payload}).then( res => {
        const fileId = res.data[0]?.id
        fetch().delete(`/api/file/delete/${fileId}`)
    })
    loading.value = true
    setTimeout(()=>{
        loading.value = false
    }, 2000)
}

// 파일 업로드 및 삭제 처리 ------------start----------------------
const hasFileUpload = ref<boolean>(false) // 업로드할 파일 있는지
const hasFileDelete = ref<boolean>(false) // 삭제할 파일 있는지
// 업로드할 파일 있다 설정
const onUploadFile = () => {
    hasFileUpload.value = true 
}
// 삭제할 파일 있다 설정
const onDeleteFile = () => {
    
    hasFileDelete.value = true
}
// 파일 업로드, 삭제 처리
const handleFile = (id:number) => {
    refId.value = id
    if(hasFileUpload.value){
        submitUpload()
    }
    if(hasFileDelete.value){
        removeImageFile()
    }
    hasFileUpload.value = false
    hasFileDelete.value = false
    // 파일처리 완료 1초후 데이터 갱신 
    setTimeout(()=>{
        // refreshData()
        emit('refresh')
    }, 1000)
} 
// ---------------end-------------

defineExpose({ submitUpload, removeImageFile, handleFile })

</script>

<style scoped>
.imageUpload{
    width: 100%;
    height: 100%;
    border:1px solid #dddddd; 
    border-radius: 6px;
}
.upload{
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    object-fit: contain;
}
.imageBlock{
    position: relative;
    padding: 12px;
}
:deep(.el-upload){
    width: 100%;
    height: 100%;
}
</style>
