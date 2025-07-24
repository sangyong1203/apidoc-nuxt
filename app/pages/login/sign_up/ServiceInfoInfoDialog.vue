<template>
    <BasicDialog :model-value="modelValue" :title="L.개인정보이용동의" width="800" :buttonTypes="['닫기', '취소']"
        @on-confirm="onConfirm" @on-cancel="onCancel" @on-close="onClose">
        <div class="terms-of-service">
            <div class="terms-content">
                <p class="font-info">모회사(주)에서 귀하의 정보를 활용하고자 합니다.</p>
                <p class="font-info">모회사(주)은 귀하의 정보를 연구장비지원 및 인증 서비스 등의 목적으로 활용하고자 합니다.</p>
                <p class="font-info">
                    귀하의 정보는 모회사(주)의 사업목적 및 신규 장비관련 서비스 안내, 주요소식, 이벤트 정보등을 담은
                    온라인 전용 소식지 제공 목적 이외에는 필요한 개인정보 항목을 수집. 이용하지 않으며, 실질적인
                    연구장비지원 및 인증 서비스를 수행하는 모회사 통합 관제 시스템에서만 사용하게 됩니다.
                </p>
                <p class="font-info">
                    귀하께서 동의하신 개인정보는 '개인정보처리방침'에 따라 엄격히 보호되고 모회사(주) 사업목적
                    이외의 용도로는 일체 사용되지 않음을 알려드립니다.
                </p>
            </div>
        </div>
    </BasicDialog>
</template>
<script lang="ts" setup>
import { useLangStore } from '~/stores/LangStore'

// 다국어 설정 
const L = useLangStore().lang.login

export interface Props {
    modelValue: boolean
}
const { modelValue } = defineProps<Props>()
const emits = defineEmits(['update:modelValue', 'onSelect'])

const onConfirm = () => {
    emits('onSelect', true)
}
const onCancel = () => {
    emits('update:modelValue', false)
}
const onClose = () => {
    emits('update:modelValue', false)
}
</script>

<style scoped>
.terms-of-service {
    max-width: 800px;
    margin: 0 auto;
    padding: 40px;
    border-radius: 8px;
    background-color: #f9f9f9;
}

.terms-content {
    font-size: 16px;
    line-height: 1.6;
    margin-bottom: 30px;

}

.font-info {
    color: #555;
    font-size: 16px;
    line-height: 1.6;
    margin-bottom: 15px;
}
</style>