<template>
    <BasicDialog
        :model-value="isShowDialog"
        title="환경 설정"
        description=""
        width="1000"
        style="height: 70%"
        :buttonTypes="['저장', '취소']"
        @on-save="updateSelectedSetting"
        @on-cancel="onCancel"
        @on-close="onClose"
       
    >
        <OperationBox :total="obj.environmentSettingList.length??0" bottom-line>
            <el-button type="primary" @click="openEditDialog">등록</el-button>
        </OperationBox>
        <el-table :data="obj.environmentSettingList" ref="tableRef" @selection-change="getSelectedEnvirenmentSetting"  @cell-dblclick="copyCellContent">
            <el-table-column type="selection" width="40" />
            <el-table-column label="NO" type="index" width="60" />
            <el-table-column label="Name" prop="name" width="150" />
            <el-table-column label="Host" prop="host" />
            <el-table-column label="AuthToken" prop="authToken">
                <template #default="{row}">
                    <div style="padding-right:40px; white-space:nowrap; overflow:hidden;">
                        {{row.authToken}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column width="120px">
                <template #default="{row}">
                    <el-button text icon="Edit" @click="openEditDialog(row)"></el-button>
                    <el-button text  type="danger" icon="Delete" @click="deleteSetting(row)"></el-button>
                </template>
            </el-table-column>
        </el-table>
    </BasicDialog>

    <!--  환경 설정 등록 창  -->
    <el-dialog v-model="isShowEditDialog" :title="editDialogTitle" width="600px" top="180px" @close="closeEditDialog">
        <el-form
            class="detail-form"
            :model="form"
            ref="ruleFormRef"
            label-position="left"
            size="large"
            label-width="auto"
            require-asterisk-position="right"
        >
            <el-form-item prop="name" label="Name">
                <el-input v-model="form.name" placeholder="Name을 입력해주세요" />
            </el-form-item>
            <el-form-item prop="host" label="Host">
                <el-input v-model="form.host" placeholder="Host를 입력해주세요" />
            </el-form-item>
            <el-form-item prop="token" label="AuthToken">
                <el-input type="text" v-model="form.authToken" placeholder="AuthToken을 입력해주세요"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="closeEditDialog" class="POST">취소</el-button>
                <el-button type="primary" @click="submitForm" class="POST">확인</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { Service } from '~/services/postApi/model_service/Service'
import { Notification, Message } from '~/services/common/dialog/ComDialog'
import { useGlobalDialog } from '~/services/common/dialog/ComDialog'
import ComUtil from '~/services/common/utils/ComUtil'
import type { EnvironmentSetting } from '~/services/postApi/model_service/Type'
import { useEnvironmentStore } from '~/services/postApi/model_service/EnvirenmentStore'

const obj = reactive(new Service())
const isShowDialog: any = ref(false)
const tableRef: any = ref(null)

// 환경설정 목록에 항목 선택
const selectedEnvirenmentSetting = ref<EnvironmentSetting>({
    name:'',
    host: '',
    authToken: '',
    isSelected: false
})
const getSelectedEnvirenmentSetting = (val: any) => {
    selectedEnvirenmentSetting.value = ComUtil.getTableSelection(tableRef, val)[0]
}
// 사용할 환경설정 선택수정
const updateSelectedSetting = () => {
    if(!selectedEnvirenmentSetting.value){
        Notification.warning('설정항목을 선택해주세요.')
        return
    }
    const selectedItemId = selectedEnvirenmentSetting.value?.id
    selectedEnvirenmentSetting.value.isSelected = true
    obj.environmentSettingList.forEach((item)=>{
        if(selectedItemId===item.id){
            item.isSelected = true
        }else {
            item.isSelected = false
        }
    })
    Promise.all(obj.environmentSettingList.map( item => {
        return obj.updateEnvironmentSetting(item)
    })).then((res: any) => {
            Message.success('저장 성공')
            useEnvironmentStore().setEnvironmentSetting(selectedEnvirenmentSetting.value)
            onClose()
        })
        .catch((err: any) => {
            Notification.error(err)
        })
}
const onCancel = () => {
    onClose()
}
const onClose = () => {
    isShowDialog.value = false
    tableRef.value.clearSelection()
}
const getList = async () => {
    await obj.getEnvironmentSettingList()
    obj.environmentSettingList.forEach((row:EnvironmentSetting)=>{
        if(row.isSelected){
            tableRef.value!.toggleRowSelection(row, true)
        }
    })
}
// 창 열기
const openDialog = async () => {
    isShowDialog.value = true
    getList()
}
defineExpose({ openDialog })

// 환결설정 등록 --------------------------
const form = ref<EnvironmentSetting>({
    name:'',
    host: '',
    authToken: '',
    isSelected: false,
})
const isShowEditDialog = ref(false)
const editDialogTitle = ref('')
const openEditDialog = (row?:any) => {
    if(row){
        form.value = Object.assign({}, form.value, row)
        editDialogTitle.value = '환경 설정 수정'
        console.log('form.value',form.value)
    } else {

        editDialogTitle.value = '환경 설정 등록'
    }
    isShowEditDialog.value = true
}
const closeEditDialog = () => {
    isShowEditDialog.value = false
    form.value = {
        name:'',
        host: '',
        authToken: '',
        isSelected: false,
    }
    editDialogTitle.value = ''
}
// 등록 저장
const submitForm = () => {
    if(editDialogTitle.value.includes('등록')){
        obj.createEnvironmentSetting(form.value)
            .then((res: any) => {
                Message.success('저장 성공')
                closeEditDialog()
                getList()

            })
            .catch((err: any) => {
                Notification.error(err)
            })
    } else {
        obj.updateEnvironmentSetting(form.value)
            .then((res: any) => {
                Message.success('수정 성공')
                closeEditDialog()
                getList()

            })
            .catch((err: any) => {
                Notification.error(err)
            })
    }
}
// 환경설정 삭제 
const deleteSetting = (row:any) => {
    useGlobalDialog('환경설정을 삭제 하시겠습니까?','확인','CONFIRM_YN').onConfirm(()=>{
        obj.deleteEnvironmentSetting(row.id)
            .then((res: any) => {
                Message.success('삭제 성공')
                getList()
            })
            .catch((err: any) => {
                Notification.error(err)
            })
    }).onCancel(()=>{})
}



const copyCellContent = (row:any, column:any) => {
    Message.success(`내용을 복사 하였습니다. \n  ${row[column.property]}`)
    navigator.clipboard.writeText(row[column.property])
}
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
