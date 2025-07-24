<template>
    <!-- Form 다이얼로그 -->
    <el-dialog
        :model-value="modelValue"
        :title="title"
        style="height:210mm; overflow: hidden; margin-top: 5vh;"
        width="312mm"
    >
        <div class="print-dialog__body" id="printArea">
            <slot></slot>
        </div>

        <template #footer>
            <el-button type="primary" @click="makePdf">PDF다운로드</el-button>
            <el-button type="primary" v-print="print">프린트</el-button>
            <el-button  @click="closeDialog" >취소</el-button>
        </template>
    </el-dialog>
        
</template>

<script setup lang="ts">

import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

import { toRefs } from 'vue'
export interface Props {
    title: string
    modelValue: boolean
}
const props = defineProps<Props>()
const { title, modelValue } = toRefs(props)


// 다이얼로그 닫기 외 버튼 기능 함수
const emit = defineEmits(['close'])
const closeDialog = (): void => {
    emit('close', false)
}

const print: any = {
    id: 'printArea',
    popTitle: '.',
    previewTitle: '',
    extraHead: '', // 재일 위에 있는 extra head title
    zIndex: 20002, // preview 창 z-index，default값 20002，
    standard: '',
    extarCss: '',
    preview: false,
    previewPrintBtnLabel: '프린트',
}

const makePdf = ()=>{
      const pdfArea:any = document.querySelector('#printArea')
      html2canvas(pdfArea).then((canvas:any) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'mm', 'a4'); // l: 가로방향, p:세로방향
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('download.pdf')
      })
}

</script>

<style scoped>
.print-dialog__body{
    padding: 16px;
    width: 289mm;
}

</style>
