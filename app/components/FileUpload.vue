<template>
    <!-- 파일업로드 -->
    <div class="upload" draggable="true" >
        <el-upload
            ref="uploadRef"
            v-model:file-list="fileList"
            :accept="accept"
            :limit="limit"
            :auto-upload="false"
            :on-change="onChange"
            :on-exceed="onExceed"
            :multiple="multiple"
            :disabled="disabled">
            <div class="upload__button-box">
                <el-button size="default" :diabled="disabled" type="primary">{{ label }}</el-button>
            </div>
            <template #tip>
                <div class="el-upload__tip">
                    {{ message }}
                </div>
            </template>
        </el-upload>
        <div class="upload__file-box" >
            <div v-for="(item, index) in uploadedFiles" :key="index" class="upload__file-box__list">
                <a :href="item.url" class="name" >{{ item.file_name }}</a>
                <el-button class="button" @click="deleteUploadedFiles(item, index)"><el-icon><Delete /></el-icon></el-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { toRefs, ref } from 'vue'
import { Notification } from '~/services/common/dialog/ComDialog';
export interface Props {
    label: string
    uploadedFiles?: any // 이미 DB에 저장한 파일 
    disabled?: boolean 
    message?: string // tip 메시지 
    accept?: string // 접수 할수 있는 파일 타입 .png, .jepg, .xlsx 등
    limit?: number // 최대 첨부 파일 수량
    size?: number  // 최대 파일 크기, 단위: KB
    multiple?: boolean // 파일 다종 선택 가능 여부 
}
const props = defineProps<Props>()
const { label, uploadedFiles, disabled, message ,accept, limit, size, multiple} = toRefs(props)

const uploadRef:any = ref(null)
const fileList:any = ref([])
const emit = defineEmits(['on-select', 'delete-file'])

const onChange = (file:any, files:any) => {
	
    fileList.value = files;

    //파일용량 체크
    if( size.value && (file.size/1024) > size.value ) {
        onSizeOver(file)
    }

    //파일을 emit 한다 
    let arr:any = []
    files.forEach((item: any) => {
        arr.push(item.raw)
    })
    emit('on-select', arr)
}

// 파일개수 초과시 삭제 및 note
const onExceed = (file:any) => {
    Notification.warning(`최대 ${limit.value}개 파일을 첨부 할수 있습니다.` )
    uploadRef.value.handleRemove(file)
}
// 파일size 초과시 삭제 및 note
const onSizeOver = (file:any) => {
    Notification.warning(`최대 ${size.value}KB 크기 파일을 첨부 할수 있습니다.` )
    uploadRef.value.handleRemove(file)
}
const deleteUploadedFiles = (file: any, index: number) => {
    if(disabled.value) return
    emit('delete-file', file, index)

}

</script>

<style lang="scss" scoped>
.upload {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    gap: 12px;
}

.upload__file-box {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
}
.upload__file-box__list {
    display: flex;
    align-items: center;
    justify-content: center;

    padding: 12px;
    gap: 12px;
}
.upload__file-box__list .name:hover  {
        text-decoration: underline;
        cursor: pointer;
}
:deep(.el-button){
    margin-left: 0 !important;
}
</style>
