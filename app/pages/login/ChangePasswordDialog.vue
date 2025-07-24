<template>
    <BasicDialog
        :model-value="isShowDialog"
        :title="L?.비밀번호재설정??''"
        width="650"
        :buttonTypes="['저장', '취소']"
        @on-save="onSave"
        @on-cancel="onCancel"
        @on-close="onClose"
    >
        <div style="font-size: 16px; color: var(--primary-text-color); margin-bottom: 16px">
            {{ L.비밀번호를재설정한후다시로그인이필요합니다??'' }}
        </div>
        <el-form
            ref="ruleFormRef"
            :model="ruleForm"
            :rules="rules"
            label-width="auto"
            label-position="left"
            size="large"
            require-asterisk-position="right"
        >
            <el-form-item prop="password" :label="L.현재비밀번호??''" style="width: 100%">
                <el-input
                    v-model="ruleForm.password"
                    prefix-icon="lock"
                    :placeholder="L.현재비밀번호를입력해주세요??''"
                    type="password"
                    autocomplete="off"
                />
            </el-form-item>
            <el-form-item prop="resetPassword" :label="L.새비밀번호??''" style="width: 100%">
                <el-input
                    v-model="ruleForm.resetPassword"
                    prefix-icon="lock"
                    :placeholder="L.새비밀번호를입력해주세요??''"
                    type="password"
                    autocomplete="off"
                />
            </el-form-item>
            <el-form-item prop="passwordCheck" :label="L.비밀번호확인??''" style="width: 100%">
                <el-input
                    v-model="ruleForm.passwordCheck"
                    prefix-icon="lock"
                    :placeholder="L.비밀번호를다시입력해주세요??''"
                    type="password"
                    autocomplete="off"
                />
            </el-form-item>
        </el-form>
    </BasicDialog>
</template>
<script lang="ts" setup>
import { LoginService } from '~/services/login/model_service/LoginService'
import { ref, reactive } from 'vue'
import { useGlobalDialog } from '~/services/common/dialog/ComDialog'
import { Notification } from '~/services/common/dialog/ComDialog'
import ComUtil from '~/services/common/utils/ComUtil'
import type { FormInstance, FormRules } from 'element-plus'
import { useLangStore } from '~/stores/LangStore'

// 다국어 설정
const langStore = useLangStore()
const L: any = ref(langStore.lang.login)

const obj = new LoginService()

interface RuleForm {
    password: string
    resetPassword: string
    passwordCheck: string
}
const ruleForm = ref<RuleForm>({
    password: '',
    resetPassword: '',
    passwordCheck: '',
})
const ruleFormRef = ref<FormInstance>()

const validatePass = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error(L.value?.새비밀번호를입력해주세요))
    } else if (!ComUtil.validatePassword(value)) {
        callback(new Error(L.value?.비밀번호입력조건설명))
    } else {
        if (ruleForm.value.passwordCheck !== '') {
            if (!ruleFormRef.value) return
            ruleFormRef.value.validateField('passwordCheck')
        }
        callback()
    }
}
const validatePass2 = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error(L.value?.비밀번호확인을입력해주세요))
    } else if (value !== ruleForm.value.resetPassword) {
        callback(new Error(L.value?.입력한비밀번호가일치하지않습니다비밀번호를다시입력해주세요))
    } else {
        callback()
    }
}

// 입력 값 인증 룰
const rules = reactive<FormRules<typeof ruleForm>>({
    password: { required: true, message: L.value?.현재비밀번호를입력해주세요, trigger: ['change', 'blur'] },
    resetPassword: { required: true, validator: validatePass, trigger: ['change', 'blur'] },
    passwordCheck: { required: true, validator: validatePass2, trigger: ['change', 'blur'] },
})

// 저장
const onSave = () => {
    ruleFormRef.value?.validate((valid: any) => {
        if (valid) {
            useGlobalDialog(L.value?.저장하시겠습니까, L.value?.확인, 'CONFIRM_YN').onConfirm(() => {
                const loginId = localStorage.getItem('loginId') ?? ''
                obj.changePassword(loginId, ruleForm.value.password, ruleForm.value.resetPassword)
                    .then((res: any) => {
                        if (res.data.isUse) {
                            Notification.warning(L.value?.현재비밀번호와일치하지않습니다)
                        } else {
                            useGlobalDialog(L.value?.비밀번호변경완료, 'Success', 'OK')
                            onClose()
                        }
                    })
                    .catch(error => {
                        Notification.error(error)
                    })
            })
        }
    })
}
const onCancel = () => {
    onClose()
}
const onClose = () => {
    isShowDialog.value = false
}
const isShowDialog = ref(false)
const openDialog = () => {
    isShowDialog.value = true
}
defineExpose({ openDialog })
</script>
<style lang="scss" scoped></style>
