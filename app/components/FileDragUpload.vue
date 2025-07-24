<template>
    <div style="display: flex; margin-bottom: 12px">
        <el-input type="text" v-model="fileName" disabled />
        <el-upload :show-file-list="false" :limit="1" :on-change="findFile" :auto-upload="false" :disabled="disabled">
            <el-button type="primary">{{ L.찾아보기 }}</el-button>
        </el-upload>
    </div>
    <el-upload
        class="upload-demo"
        ref="uploadRef"
        v-loading="loading"
        :style="{ width: width, height: height }"
        :show-file-list="false"
        :limit="1"
        :on-change="handleFileChange"
        :auto-upload="false"
        :disabled="disabled"
        drag
    >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">{{ L.여기에업로드할파일을끌어서놓거나찾아보기를클릭하세요 }}</div>
        <template #tip>
            <div class="el-upload__tip"></div>
        </template>
    </el-upload>
</template>

<script setup lang="ts">
import { UploadFilled } from '@element-plus/icons-vue'
import { toRefs, ref } from 'vue'
import { Notification } from '~/services/common/dialog/ComDialog'
import type { UploadFile, UploadFiles } from 'element-plus'
import { useLangStore } from '~/stores/LangStore'

// 다국어 설정 
const L = useLangStore().lang.common

export interface Props {
    disabled?: boolean
    message?: string // tip 메시지
    size?: number // 최대 파일 크기, 단위: KB
    division?: string // 파일 업로드 구분
    // refId?: number // 파일 업로드시 참조번호
    width?: string
    height?: string
}
const props = defineProps<Props>()
const { disabled, size, width, height, division } = toRefs(props)
const uploadRef: any = ref(null)
const loading = ref<boolean>(false)
const fileName = ref('')
const emit = defineEmits(['onUpload'])

const uploadedFile: any = ref(null)
const handleFileChange = (file: UploadFile, files: UploadFiles) => {
    //파일용량 체크
    if (size.value && file.size && file.size / 1024 > size.value) {
        onSizeOver(file)
        return
    }
    // 파일이 1개 이상시 최신만 보료
    if (files.length > 1) {
        files.shift()
    }
    uploadedFile.value = file
    fileName.value = file.name
    emit('onUpload', files)
}
const findFile = (file: UploadFile, files: UploadFiles) => {
    // 파일용량 체크
    if (size.value && file.size && file.size / 1024 > size.value) {
        onSizeOver(file)
        return
    }
    // 파일이 1개 이상시 최신만 보료
    if (files.length > 1) {
        files.shift()
    }
    uploadedFile.value = file
    fileName.value = file.name
    uploadRef.value?.handleStart(file.raw)
    emit('onUpload', files)
}

// 파일size 초과시 삭제 및 note
const onSizeOver = (file: any) => {
    Notification.warning(`${L.첨부할수있는최대파일크기를초과하였습니다최대파일크기} ${size.value} KB`)
}
</script>
<style lang="scss" scoped>
.el-icon--upload svg {
    width: 100px;
    height: 100px;
}
</style>
