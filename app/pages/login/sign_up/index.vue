<template>
    <div class="sign-up">
        <el-card>
            <template #header>
                <div class="card-header">
                    <h2>
                        {{ L.운영자가입신청 }}
                        <span>{{ L.운영자가입을신청하기위한정보입력후신청버튼을눌러주십시오 }}</span>
                    </h2>
                </div>
            </template>
            <el-form
                :model="ruleForm"
                :rules="rules"
                ref="ruleFormRef"
                label-position="right"
                label-width="auto"
                require-asterisk-position="right"
            >
                <el-form-item prop="loginId" :label="L.아이디">
                    <el-input
                        v-model="ruleForm.loginId"
                        :placeholder="L.아이디를입력해주세요"
                        autocomplete="off"
                        style="flex: 1; margin-right: 8px"
                        @change="onChangeId"
                    />
                    <el-button type="primary" @click="checkDuplicateId">{{ L.중복검사 }}</el-button>
                </el-form-item>
                <el-form-item prop="name" :label="L.이름">
                    <el-input v-model="ruleForm.name" :placeholder="L.이름을입력해주세요" autocomplete="off" />
                </el-form-item>
                <el-form-item prop="phone" :label="L.전화번호">
                    <el-input v-model="ruleForm.phone" :maxlength="13" :formatter="ComUtil.phoneFormatter" :parser="ComUtil.phoneParse" :placeholder="L.전화번호를입력해주세요" autocomplete="off" />
                </el-form-item>
                <el-form-item prop="email" :label="L.이메일">
                    <el-input
                        v-model="ruleForm.email"
                        :placeholder="L.이메일을입력해주세요"
                        type="email"
                        autocomplete="off"
                    />
                </el-form-item>
                <el-form-item prop="password" :label="L.비밀번호">
                    <template #label>
                        {{ L.비밀번호 }}
                        <el-popover
                            title="Tip"
                            :width="280"
                            trigger="hover"
                            :content="L.비밀번호입력조건"
                        >
                            <template #reference>
                                <el-icon style="margin-left: 5px">
                                    <QuestionFilled />
                                </el-icon>
                            </template>
                        </el-popover>
                    </template>

                    <el-input
                        v-model="ruleForm.password"
                        prefix-icon="lock"
                        :placeholder="L.비밀번호를입력해주세요"
                        type="password"
                        autocomplete="off"
                    />
                </el-form-item>
                <el-form-item prop="checkPass" :label="L.비밀번호확인">
                    <el-input
                        v-model="ruleForm.checkPass"
                        prefix-icon="lock"
                        :placeholder="L.비밀번호를다시입력해주세요"
                        type="password"
                        autocomplete="off"
                    />
                </el-form-item>
                <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
                    {{ L.모두동의하기 }}
                </el-checkbox>
                <el-checkbox-group v-model="checkedList" @change="handleChecked" >
                    <el-checkbox value="서비스약관">
                        <el-link @click="ServiceServiceDialog" type="primary">{{ L.서비스약관 }}</el-link>
                        <span>{{ L.을확인하였으며이에동의합니다 }}</span>
                    </el-checkbox>
                    <el-checkbox value="개인정보">
                        <el-link @click="ServiceInfoInfoDialog" type="primary">{{L.개인정보활용}}</el-link>
                        <span> {{ L.동의안내를확인하였으며이에 }}</span>
                    </el-checkbox>
                </el-checkbox-group>
            </el-form>
            <template #footer>
                <el-button size="large" class="login-btn" @click="onCancel">{{ L.취소 }}</el-button>
                <el-button type="primary" size="large" class="login-btn" @click="submitForm(ruleFormRef)"
                    >{{ L.신청 }}</el-button
                >
            </template>
        </el-card>
    </div>
    <ServiceDialog v-model="isShowDialog" />
    <ServiceInfoDialog v-model="isShowDialogInfo" />
</template>

<script lang="ts" setup>
import { LoginService } from '~/services/login/model_service/LoginService'
import { ref, reactive, onMounted } from 'vue'
import type { FormInstance, FormRules, CheckboxValueType } from 'element-plus'
import { useGlobalDialog } from '~/services/common/dialog/ComDialog'
import { Notification } from '~/services/common/dialog/ComDialog'
import ComUtil from '~/services/common/utils/ComUtil'
import ServiceDialog from './ServiceServiceDialog.vue'
import ServiceInfoDialog from './ServiceInfoInfoDialog.vue'
import { useLangStore } from '~/stores/LangStore'

// 다국어 설정 
const L = useLangStore().lang.login

const loginService = reactive(new LoginService())
const checkAll = ref(false)
const isIndeterminate = ref(true)
const checkedList: any = ref([])

let agreements: string[] = ['서비스약관', '개인정보']

// 비밀번호 편경 폼
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
    loginId: '',
    name: '',
    // companyId: null,
    phone: '',
    email: '',
    // roleCode: '',
    password: '',
    checkPass: '',
})
const validatePass = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error(L.새비밀번호를입력해주세요))
    } else if (!ComUtil.validatePassword(value)) {
        callback(new Error(L.비밀번호입력조건))
    } else if (value == ruleForm.loginId) {
        callback(new Error(L.ID와비밀번호를동일하게입력하지마십시오))
    } else {
        if (ruleForm.checkPass !== '') {
            if (!ruleFormRef.value) return
            ruleFormRef.value.validateField('checkPass')
        }
        callback()
    }
}
const validateCheckPass = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error(L.비밀번호를다시입력해주세요))
    } else if (value !== ruleForm.password) {
        callback(new Error(L.입력한비밀번호가일치하지않습니다비밀번호를다시입력해주세요))
    } else {
        callback()
    }
}
const validatePhoneNumber = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error(L.전화번호를입력해주세요))
    } else if (!ComUtil.validatePhoneNumer(value)) {
        callback(new Error(L.정확한전화번호를입력해주세요))
    } else {
        callback()
    }
}
const validateEmail = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error(L.이메일을입력해주세요))
    } else if (!ComUtil.validateEmail(value)) {
        callback(new Error(L.정확한이메일을입력해주세요))
    } else {
        callback()
    }
}
const validateId = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error(L.아이디를입력해주세요))
    } else if (isDuplicateId.value === true) {
        isDuplicateId.value = false
        isCheckedId.value = false
        callback(new Error(L.입력하신아이디가존재합니다확인후다시입력해주세요))
    } else {
        callback()
    }
}

// 입력 값 인증 룰
const rules = reactive<FormRules<typeof ruleForm>>({
    loginId: { required: true, validator: validateId, trigger: ['change', 'blur'] },
    name: { required: true, message: L.이름을입력해주세요, trigger: ['change', 'blur'] },
    phone: { required: true, validator: validatePhoneNumber, trigger: ['change', 'blur'] },
    email: { required: true, validator: validateEmail, trigger: ['change', 'blur'] },
    // roleCode: { required: true, message: L.권한을선택해주세요, trigger: ['change', 'blur'] },
    // companyId: { required: true, message: L.운영자사이트를선택해주세요, trigger: ['change', 'blur'] },
    password: [{ required: true, validator: validatePass, trigger: ['change', 'blur'] }],
    checkPass: [{ required: true, validator: validateCheckPass, trigger: ['change', 'blur'] }],
})
const handleCheckAllChange = (val: CheckboxValueType) => {
    checkedList.value = val === true ? agreements : []
    isIndeterminate.value = false
}
const handleChecked = (value: CheckboxValueType[]) => {
    const checkedCount = value.length
    checkAll.value = checkedCount === agreements.length
    isIndeterminate.value = checkedCount > 0 && checkedCount < agreements.length
}
// 취소
const onCancel = () => {
    loginService.toLoginPage()
}
const isDuplicateId = ref(false)
const isCheckedId = ref(false)
const checkDuplicateId = async () => {
    if(!ruleForm.loginId){
        ruleFormRef.value?.validateField('loginId')
        return
    }
    const res = await loginService.checkDuplicateId({ loginId: ruleForm.loginId })
    if (res.success == true) {
        Notification.success(L.사용가능한아이디입니다)
        isDuplicateId.value = false
        isCheckedId.value = true
    } else {
        Notification.error(L.입력하신아이디가존재합니다확인후다시입력해주세요)
        isDuplicateId.value = true
        ruleFormRef.value?.validateField('loginId')
    }
}
const onChangeId = () => {
    isCheckedId.value = false
}
// 저장
const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    // 서비스 약관 동의 유무 
    if (!checkAll.value) {
        Notification.warning(L.서비스약관및개인정보활용을체크동의해주세요)
        return
    }
    formEl.validate(valid => {
        if (valid) {
            // 아이디 중복 확이 유무
            if(!isCheckedId.value) {
                Notification.warning(L.아이디중복검사해주세요)
                return
            }
            useGlobalDialog(L.신청하시겠습니까, L.확인, 'YN')
                .onConfirm(() => {
                    loginService
                        .signup(ruleForm)
                        .then(res => {
                            loginService.toLoginPage()
                            Notification.success(L.신청완료되었습니다, L.신청완료)
                        })
                        .catch(err => {
                            Notification.error(err)
                        })
                })
                .onCancel(() => {})
        }
    })
}

const isShowDialog: any = ref(false)
const ServiceServiceDialog = () => {
    isShowDialog.value = true
}
const isShowDialogInfo: any = ref(false)
const ServiceInfoInfoDialog = () => {
    isShowDialogInfo.value = true
}
onMounted(async () => {

})
</script>

<style lang="scss" scoped>
.sign-up {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.sign-up .el-card {
    height: 95%;
    display: flex;
    flex-direction: column;
}
:deep(.el-card__body) {
    padding: 20px;
}
.card-header span {
    padding: 15px 0;
    margin-left: 10px;
    font-size: 12px;
}

.el-form {
    height: 100%;
    overflow-y: scroll;
    padding: 10px;
}

:deep(.el-card__body) {
    flex: 1;
    overflow: hidden;
}

:deep(.el-card__footer) {
    display: flex;
    justify-content: flex-end;
}

:deep(.el-form-item__label) {
    justify-content: center;
    align-items: center;
}
:deep(.el-checkbox-group) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}
:deep(.el-checkbox__label) {
    display: flex;
    align-items: center;
}
</style>
