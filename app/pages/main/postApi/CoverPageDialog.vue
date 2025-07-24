<template>
    <BasicDialog
        :model-value="isShowDialog"
        title="표지"
        description=""
        width="800"
        style="height: 70%"
        :buttonTypes="['저장', '취소']"
        @on-save="submitForm"
        @on-cancel="onCancel"
        @on-close="onClose"
    >
        
    <el-form
            class="detail-form"
            :model="obj.coverPageInfo"
            ref="ruleFormRef"
            label-position="left"
            size="large"
            label-width="auto"
            require-asterisk-position="right"
        >
            <el-form-item prop="title1" label="타이틀1">
                <el-input v-model="obj.coverPageInfo.title1" placeholder="타이틀을 입력해주세요" />
            </el-form-item>
            <el-form-item prop="title2" label="타이틀2">
                <el-input v-model="obj.coverPageInfo.title2" placeholder="타이틀을 입력해주세요" />
            </el-form-item>
            <el-form-item prop="version" label="버전">
                <el-input v-model="obj.coverPageInfo.version" placeholder="버전을 입력해주세요" />
            </el-form-item>
            <el-form-item prop="publishDate" label="배포일">
                <el-date-picker
                    v-model="obj.coverPageInfo.publishDate"
                    type="date"
                    placeholder="배포일 선택"
                />
            </el-form-item>
            <el-form-item prop="creater" label="작성자">
                <el-input v-model="obj.coverPageInfo.creater" placeholder="작성자를 입력해주세요" />
            </el-form-item>
            <el-form-item prop="reviewer" label="검토자">
                <el-input v-model="obj.coverPageInfo.reviewer" placeholder="검토자를 입력해주세요" />
            </el-form-item>
            <el-form-item prop="approver" label="승인자">
                <el-input v-model="obj.coverPageInfo.approver" placeholder="승인자를 입력해주세요" />
            </el-form-item>
            <el-form-item prop="copyright" label="Copyright">
                <el-input v-model="obj.coverPageInfo.copyright" placeholder="Copyright를 입력해주세요" />
            </el-form-item>
            <el-form-item prop="copyrightDescription" label="Copyright 설명">
                <el-input v-model="obj.coverPageInfo.copyrightDescription" placeholder="Copyright 설명을 입력해주세요" />
            </el-form-item>
            
        </el-form>
    </BasicDialog>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { Service } from '~/services/postApi/model_service/Service'
import { useGlobalDialog } from '~/services/common/dialog/ComDialog'
import { Notification } from '~/services/common/dialog/ComDialog'
import { Message } from '~/services/common/dialog/ComDialog'
const obj = reactive(new Service())
const isShowDialog: any = ref(false)

// 등록 저장
const submitForm = () => {
    useGlobalDialog('저장하시겠습니까', '확인', 'YN')
        .onConfirm(() => {
            if(obj.coverPageInfo.id){
                obj.updateCoverPage(obj.coverPageInfo)
                    .then((res: any) => {
                        Message.success('저장 성공')
                        onClose()
                    })
                    .catch((err: any) => {
                        Notification.error(err)
                    })
            } else {
                obj.createCoverPage(obj.coverPageInfo)
                    .then((res: any) => {
                        Message.success('저장 성공')
                        onClose()

                    })
                    .catch((err: any) => {
                        Notification.error(err)
                    })
            }
        })
        .onCancel(() => {})
}

const onCancel = () => {
    onClose()
}

const onClose = () => {
    isShowDialog.value = false
}
// 창 열기
const openDialog = async () => {
    isShowDialog.value = true
    obj.getCoverPage()
}

defineExpose({ openDialog })
</script>
<style lang="scss" scoped>
.detail-form {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
}
:deep(.el-form-item) {
    margin-bottom: 0;
}
:deep(.el-form-item__content) {
    .el-button {
        width: 90px;
        margin-left: 8px;
    }
    .el-input {
        flex: 1;
    }
}
.page-description {
    padding-bottom: 28px;
    margin-left: -14px;
    line-height: 30px;
    padding: 12px 32px;
    li {
        font-size: 14px;
    }
}
:deep(.el-table .cell) {
    padding: 0 !important;
    margin: 0 4px;
}
</style>
