<template>
    <el-dialog v-model="isShowDialog" title="폴더 등록" width="500px" @close="onClose">
        <el-form ref="regForm" :rules="folderRules" :model="folderForm" label-position="left" label-width="80px">
            <el-form-item label="폴더 명" prop="title">
                <el-input v-model="folderForm.folderName" show-word-limit maxlength="20" />
            </el-form-item>

            <el-form-item label="경로">
                <el-input v-model="folderForm.requestURL" show-word-limit maxlength="50" />
            </el-form-item>
        </el-form>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="onClose" class="POST">취소</el-button>
                <el-button type="primary" @click="onConfirm" class="POST">확인</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Folder } from '~/services/postApi/model_service/Type'
import { Service } from '~/services/postApi/model_service/Service'

const obj = new Service()
const dialogTitle = ref('')
const isShowDialog = ref(false)
const folderForm = ref<Folder>({
    folderId: '',
    parentFolderId: '',
    folderName: '',
    requestURL: '',
    isOpen: true,
    children: [],
})
const folderRules = {
    folderName: [{ required: true, trigger: 'blur' }],
    requestURL: [{ required: true, trigger: 'blur' }],
}
const openDialog = (title: string, data?: Folder) => {
    isShowDialog.value = true
    dialogTitle.value = '폴더' + title
    if (data && title === '수정') {
        folderForm.value = {... data}
    } else if ( data && title === '추가'){
        folderForm.value.parentFolderId = data.folderId
        folderForm.value.folderId = obj.createId()
    } else {
        folderForm.value.folderId = obj.createId()
    }
}
const emits = defineEmits(['onConfirm'])
const onConfirm = () => {
    console.log('folderForm.value',folderForm.value)
    emits('onConfirm', folderForm.value)
    onClose()
}
const onClose = () => {
    isShowDialog.value = false
    folderForm.value = {
        folderId: '',
        parentFolderId: '',
        folderName: '',
        requestURL: '',
        isOpen: true,
        children: [],
    }
}
defineExpose({ openDialog })
</script>
<style lang="scss" scoped>
.folders {
    padding: 8px 0;
    width: 100%;
}
.colletions-title {
    border-bottom: 1px solid #dcdfe6;
    padding: 8px 8px 8px 4px;
    margin-bottom: 8px;
    font-size: 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
:deep(.el-tree-node__content) {
    margin: 4px 4px 4px 0;
}

.folder-btn {
    flex: 1;
    display: none;
    align-items: center;
    justify-content: flex-end;
    gap: 4px;
    svg {
        height: 19px;
        width: 18px;
    }
}
.folder-item {
    width: 100%;
    display: flex;
    justify-content: space-between;
}
.folder-item:hover {
    .folder-btn {
        display: flex;
    }
}
</style>
