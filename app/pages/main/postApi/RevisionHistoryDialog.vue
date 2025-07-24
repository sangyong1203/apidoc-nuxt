<template>
    <BasicDialog
        :model-value="isShowDialog"
        title="개정이력"
        description=""
        width="1300"
        style="height: 90%"
        :buttonTypes="['저장', '취소']"
        @on-save="submitForm"
        @on-cancel="onCancel"
        @on-close="onClose"
    >
        <ol class="page-description">
            <li>
                버전: 초안은 0.1으로 표시 하고, 검토 된 이후 승인을 득한 이후에는 1.0부터 시작하여 정수 단위로 변경 관리
                함.<br> 변경 발생 시, 소수점 아래 번호로 관리하고, 목차 내용이 바뀔 정도의 큰 변경이 발생하면 상위 정수를
                변경 함. (예, V1.2 : 2번 수정됨, 목차 내용이 변경되면 V2.0 이 됨)
            </li>
            <li>구분 : 변경 내용이 이전 문서에 대해 신규/추가/수정/삭제 인지 선택 기입</li>
            <li>내용 : 변경 내용을 자세히 기록(변경된 회의록, 면담 위치, 즉 페이지 번호와 변경 내용을 기술한다.)</li>
        </ol>
        <el-table ref="tableRef" :data="obj.historyList" @scroll="getScrollPosition">
            <el-table-column prop="version" width="80">
                <template #header>
                    버전 <span style="color: red;">*</span>
                </template>
                <template #default="{ row }">
                    <div v-if="row.id">{{ row.version }}</div>
                    <el-input v-else v-model="row.version"></el-input>
                </template>
            </el-table-column>
            <el-table-column prop="updateDate" label="변경일" width="150">
                <template #default="{ row }">
                    <div v-if="row.id">{{ row.updateDate }}</div>
                    <SingleDatePicker
                    v-else
                    width="130px"
                    v-model="row.updateDate"
                    type="date"
                    placeholder="변경일 선택"
                />
                </template>
            </el-table-column>
            <el-table-column prop="updateType" width="180">
                <template #header>
                    구분 <span style="color: red;">*</span>
                </template>
                <template #default="{ row }">
                    <div v-if="row.id">{{ row.updateType }}</div>
                    <!-- <el-input v-else v-model="row.updateType"></el-input> -->
                    <DropdownList
                        v-else
                        width="160px"
                        v-model="row.clientType"
                        placeholder="Client Type 선택"
                        :list="obj.clientTypeList"
                        option-label="label"
                        option-value="value"
                        @on-change="(v:any) => onUpdateTypeSelect(row, v)"
                    />
                </template>
            </el-table-column>
            <el-table-column prop="content" >
                <template #header>
                    내용 <span style="color: red;">*</span>
                </template>
                <template #default="{ row }">
                    <div v-if="row.id">{{ row.content }}</div>
                    <el-input v-else v-model="row.content"></el-input>
                </template>
            </el-table-column>
            <el-table-column prop="creater" width="120">
                <template #header>
                    작성자 <span style="color: red">*</span>
                </template>
                <template #default="{ row }">
                    <div v-if="row.id">{{ row.creater }}</div>
                    <el-input v-else v-model="row.creater"></el-input>
                </template>
            </el-table-column>
            <el-table-column prop="reviewer" label="검토자" width="120">
                <template #default="{ row }">
                    <div v-if="row.id">{{ row.reviewer }}</div>
                    <el-input v-else v-model="row.reviewer"></el-input>
                </template>
            </el-table-column>
            <el-table-column prop="approver" label="승인자" width="120">
                <template #default="{ row }">
                    <div v-if="row.id">{{ row.approver }}</div>
                    <el-input v-else v-model="row.approver"></el-input>
                </template>
            </el-table-column>
            <el-table-column width="120">
                <template #default="scope">
                    <el-button type="danger" plain @click.prevent="deleteHistory(scope)" > 삭제 </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-button type="success" plain style="width: 100%" @click="onAddItem"> 추가 </el-button>
    </BasicDialog>
</template>
<script lang="ts" setup>
import { ref, reactive, nextTick } from 'vue'
import { Service } from '~/services/postApi/model_service/Service'
import { useGlobalDialog } from '~/services/common/dialog/ComDialog'
import { Notification } from '~/services/common/dialog/ComDialog'
import { Message } from '~/services/common/dialog/ComDialog'
import type { RevisionHistory } from '~/services/postApi/model_service/Type'
const obj = reactive(new Service())
const isShowDialog: any = ref(false)

const createItem = (): RevisionHistory => {
    return {
        version: '',
        updateDate: '',
        updateType: '',
        content: '',
        creater: '',
        reviewer: '',
        approver: '',
    }
}
const scrollPosition = ref(0)
const getScrollPosition = (value:any) => {
    scrollPosition.value = value.scrollTop
}
const tableRef:any = ref(null)
const onAddItem = () => {
    obj.historyList.push(createItem())
    nextTick(()=>{
        tableRef.value.setScrollTop(scrollPosition.value + 100)
    })
}
const deleteHistory = (scope: any) => {
    if (Object.keys(scope.row).includes('id')) {
        useGlobalDialog('삭제하시겠습니까', '확인', 'YN')
            .onConfirm(() => {
                obj.deleteHistory(scope.row.id)
                    .then(res => {
                        Notification.success('삭제 성공')
                        obj.getHistoryList()
                    })
                    .catch((err: any) => {
                        Notification.error(err)
                    })
            })
            .onCancel(() => {})
    } else {
        obj.historyList.splice(scope.$index, 1)
    }
}
// 등록 저장
const submitForm = () => {

    const arr = obj.historyList.filter(item => !('id' in item))

    // TODO: NULL 검사
    let flag = true;
    arr.forEach(item => {
        console.log(item)
        if(!item.version || !item.updateType || !item.content || !item.creater) {
            Notification.error('필수값이 누락되어 있습니다.');
            flag = false;
            return;
        }
    });

    if(!flag) return;

    useGlobalDialog('저장하시겠습니까', '확인', 'YN')
        .onConfirm(() => {

            arr.forEach(item => {
                obj.createHistory(item)
                    .then((res: any) => {
                        Message.success('저장 성공')
                        obj.getHistoryList()
                    })
                    .catch((err: any) => {
                        Notification.error(err)
                    })
            })
        })
        .onCancel(() => {})
}

// 구분 드롭다운 클릭 이벤트
const onUpdateTypeSelect = (row: any, v: any) => {
    
    row.updateType = v;
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
    obj.getHistoryList()
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
