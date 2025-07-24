<template>
    <!-- <PageHeader title="API 관리" description="Api를 관리할 수 있습니다."></PageHeader> -->
    <PageBody>
        <SearchBox :on-search="getList">
            <!-- <DropdownTreeList
                label="메뉴"
                width="200px"
                v-model="searchParam.requestURL"
                placeholder="메뉴 선택"
                :list="obj.menuList"
                option-label="title"
                option-value="path"
            /> -->
            <SearchText width="280px" label="Request URL" placeholder="Request URL 입력" v-model="searchParam.requestURL"></SearchText>
            <SearchText width="300px" label="Interface Name" placeholder="Interface Name 입력" v-model="searchParam.interfaceName"></SearchText>
            <DropdownList
                label="HTTP Method"
                width="280px"
                v-model="searchParam.httpMethod"
                placeholder="HTTP Method 선택"
                :list="obj.httpMethodList"
                option-label="label"
                option-value="value"
            />
            <DropdownList
                label="Client Type"
                width="250px"
                v-model="searchParam.clientType"
                placeholder="Client Type 선택"
                :list="obj.clientTypeList"
                option-label="label"
                option-value="value"
            />
        </SearchBox>
        <div class="content-body">
            <section style="width: 17%; padding: 12px 8px">
                <FolderTree @on-clik-node="onClikNode"></FolderTree>
            </section>
            <section style="width: 50%">
                <OperationBox title="API 목록" bottom-line>
                    <template #left>
                        <div class="info-btn">
                            <el-button icon="Files" text @click="openCoverPageDialog">표지</el-button>
                            <el-button icon="Files" text @click="openHistoryDialog">개정이력</el-button>
                            <el-button text @click="openEnvironmentSettingDialog"><el-icon><Setting></Setting></el-icon>환경설정</el-button>
                        </div>
                    </template>
                    <el-button type="success" plain @click="testApi">TEST</el-button>
                    <el-button type="info" plain @click="toRegisterPage">등록</el-button>
                    <el-button type="info" plain @click="deleteApi">삭제</el-button>
                    <el-button type="info" plain @click="excelDownloadAll">API Download</el-button>
                </OperationBox>
                <ClientOnly>

                    <el-table
                        ref="tableRef"
                        multiple
                        :data="obj.apiList"
                        @row-click="showDetail"
                        @row-dblclick="toEditPage"
                        @selection-change="getSelected"
                        :cell-style="{ cursor: 'pointer' }"
                        :header-cell-style="{ height: '40px' }"
                        height="100%"
                    >
                        <el-table-column type="selection" width="40" />
                        <el-table-column label="NO" type="index" width="60" />
                        <el-table-column
                            label="Interface Name"
                            prop="interfaceName"
                            width="160"
                            show-overflow-tooltip
                        ></el-table-column>
                        <el-table-column label="Request URL" prop="requestURL" show-overflow-tooltip></el-table-column>
                        <el-table-column label="Method" prop="httpMethod" width="80">
                            <template #default="{ row }">
                                <el-tag v-if="row.httpMethod === 'GET'" type="success" disable-transitions round
                                    >GET</el-tag
                                >
                                <el-tag v-if="row.httpMethod === 'POST'" type="primary" disable-transitions round
                                    >POS</el-tag
                                >
                                <el-tag v-if="row.httpMethod === 'PUT'" type="warning" disable-transitions round
                                    >PUT</el-tag
                                >
                                <el-tag v-if="row.httpMethod === 'DELETE'" type="danger" disable-transitions round
                                    >DEL</el-tag
                                >
                            </template>
                        </el-table-column>
                        <el-table-column label="Client Type" prop="clientType" width="120"></el-table-column>
                        <el-table-column label="Test" prop="testResult" sortable width="90">
                            <template #default="{ row }">
                                <el-tag v-if="row.testResult === '성공'" type="success" round disable-transitions>{{ row.testResult }}</el-tag>
                                <span v-else-if="row.testResult === ''">-</span>
                                <el-tag v-else type="danger" round disable-transitions>{{ row.testResult }}</el-tag>
                            </template>
                        </el-table-column>
                    </el-table>
                </ClientOnly>
            </section>
            <section style="flex: 1; padding: 0 16px 16px 16px">
                <OperationBox title="API 상세" bottom-line>
                    <el-button type="success" plain @click="runApi" :disabled="!detailInfo.requestURL"
                        ><el-icon><CaretRight /></el-icon
                    ></el-button>
                    <el-button @click="toEditPage(detailInfo)" type="info" plain :disabled="!detailInfo.requestURL">수정</el-button>
                </OperationBox>
                <el-descriptions size="large" :column="1" border v-loading="isLoading">
                    <el-descriptions-item label="Interface Name" label-align="center">
                        {{ detailInfo.interfaceName }}
                    </el-descriptions-item>
                    <el-descriptions-item label="Description" label-align="center">{{
                        detailInfo.description
                    }}</el-descriptions-item>
                    <el-descriptions-item label="Request URL" label-align="center">{{
                        detailInfo.requestURL
                    }}</el-descriptions-item>
                    <el-descriptions-item label="Http Method" label-align="center">{{
                        detailInfo.httpMethod
                    }}</el-descriptions-item>
                    <el-descriptions-item label="Request Example" label-align="center">
                        <pre
                            style="width: 100%"
                        ><code contenteditable="true"><div class="code-block" ref="requestCodeRef">{{ detailInfo.requestExample }}</div></code></pre>
                    </el-descriptions-item>
                    <el-descriptions-item label="Response Example" label-align="center">
                        <pre
                            style="
                                width: 100%;
                                white-space: pre-wrap;
                                min-height: 160px;
                                max-height: 590px;
                                overflow: scroll;
                            "
                        ><code contenteditable="false">{{ detailInfo.responseExample }}</code></pre>
                    </el-descriptions-item>
                </el-descriptions>
            </section>
        </div>
    </PageBody>
    <RevisionHistoryDialog ref="revisionHistoryDialogRef"></RevisionHistoryDialog>
    <CoverPageDialog ref="coverPageDialogRef"></CoverPageDialog>
    <EnvironmentSettingDialog ref="environmentSettingDialogRef" ></EnvironmentSettingDialog>
    <EditDialog ref="editDialogRef" @refresh-data="getList"></EditDialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { Service } from '~/services/postApi/model_service/Service'
import ComUtil from '~/services/common/utils/ComUtil'
import { makeApiExcelAndDownloadAll } from '~/services/postApi/model_service/ApiExcelDownload.js'
import RevisionHistoryDialog from './RevisionHistoryDialog.vue'
import CoverPageDialog from './CoverPageDialog.vue'
import EnvironmentSettingDialog from './EnvironmentSettingDialog.vue'
import FolderTree from './FolderTree.vue'
import { Message } from '~/services/common/dialog/ComDialog'
import { Notification } from '~/services/common/dialog/ComDialog'
import EditDialog from './EditDialog.vue'
import { useEnvironmentStore } from '~/services/postApi/model_service/EnvirenmentStore'
import { Setting, CaretRight } from '@element-plus/icons-vue' 

const obj = reactive(new Service())
const searchParam = reactive({
    requestURL: '',
    httpMethod: '',
    interfaceName: '',
    clientType: '',
})
const tableRef: any = ref(null)
const detailInfo: any = ref({
    interfaceName: '',
    requestURL: '',
    httpMethod: '',
    description: '',
    requestExample: '',
    responseExample: '',
})
onMounted(async () => {
    
    // ---
    // api 목록 호출
    getList()

    // 환경설정 호출
    await obj.getEnvironmentSetting()
    useEnvironmentStore().setEnvironmentSetting(obj.environmentSetting)
    // 메뉴 호출
    // await obj.getMenuList()
})

const getList = () => {
    obj.getApiList(searchParam)
}

// 폴더 목록 클릭시 requestURL조건 만족한 API 데이터 호출
const onClikNode = (value: string) => {
    obj.getApiList({ requestURL: value })
}

// API 테스트 기능
const testApi = () => {
    selectedApi.value.forEach(async (item: any) => {
        const params = {
            httpMethod: item.httpMethod,
            headersContentType: item.headersContentType,
            requestURL: item.requestURL,
            requestParams: JSON.parse(item.requestExample),
        }
        await obj
            .sendData(params)
            .then(res => {
                item.testResult = res.result === 200 ? '성공' : '실패'
                console.log('testApi result:', res)
                item.responseExample = res.data
            })
            .catch(error => {
                item.testResult = '실패'
                console.log('testApi error:', error)
                Message.error(`ERROR:${error.result}, Message: ${error.message} `)
            })
    })
}
// 상세에 api test 버튼
const isLoading = ref(false)
const requestCodeRef: any = ref(null)
const runApi = () => {
    try {
        if (detailInfo.value.requestURL) {
            isLoading.value = true
            const newCode = new Function(`return ${requestCodeRef.value?.innerText}`)
            const params = {
                httpMethod: detailInfo.value.httpMethod,
                headersContentType: detailInfo.value.headersContentType,
                requestURL: detailInfo.value.requestURL,
                requestParams: newCode(),
            }
            detailInfo.value.responseExample = null
            obj.sendData(params)
                .then(res => {
                    console.log('runApi result:', res)
                    detailInfo.value.responseExample = res.data
                    detailInfo.value.testResult = res.result === 200 ? '성공' : '실패'
                    Notification.success('Request success!')

                })
                .catch(error => {
                    detailInfo.value.responseExample = error
                    Notification.error('runApi ERROR: ' + error)

                })
            setTimeout(() => {
                isLoading.value = false
            }, 200)
        }
    } catch (error: any) {
        Notification.error('Code ERROR', error)
        isLoading.value = false
    }
}

// 등록 페이지 이동
const editDialogRef: any = ref(null)
const toRegisterPage = () => {
    editDialogRef.value?.openDialog('등록')
}
// 수정 페이지 이동
const toEditPage = (row: any) => {
    if (row.id) {
        editDialogRef.value?.openDialog('수정', row)
    }
}

// 간단한 api 상세 내용
const showDetail = (row: any) => {
    detailInfo.value = { ...row }
    detailInfo.value.requestExample = JSON.parse(row.requestExample)
    detailInfo.value.responseExample = JSON.parse(row.responseExample)
}

// API 목록에 항목 선택
const selectedApi: any = ref([])
const getSelected = (val: any) => {
    selectedApi.value = ComUtil.getTableSelection(tableRef, val)
}

// api 삭제 기능
const deleteApi = () => {
    selectedApi.value.forEach((item: any) => {
        obj.deleteApi(item.id)
    })
    selectedApi.value = []
    obj.apiList = []
    getList()
}

// 표지 개정이력 등이 포함된 풀 API 문서 다운로드
const excelDownloadAll = async () => {
    await obj.getCoverPage()
    await obj.getHistoryList()
    await makeApiExcelAndDownloadAll(obj.coverPageInfo, obj.historyList, selectedApi.value, 'api excel')
}

// 개정이력 창
const revisionHistoryDialogRef: any = ref(null)
const openHistoryDialog = () => {
    revisionHistoryDialogRef.value.openDialog()
}

// 표지 창
const coverPageDialogRef: any = ref(null)
const openCoverPageDialog = () => {
    coverPageDialogRef.value.openDialog()
}

// 환경설정 창
const environmentSettingDialogRef: any = ref(null)
const openEnvironmentSettingDialog = () => {
    environmentSettingDialogRef.value.openDialog()
}
</script>
<style lang="scss" scoped>
.content-body {
    display: flex;
    flex-direction: row;
    gap: 12px;
    margin-top: 16px;
    flex: 1;
    overflow: hidden;
    margin-bottom: 16px;
}
section {
    padding: 0 16px 16px 16px;
    height: 100%;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

:deep(.el-descriptions) {
    overflow: scroll;
}
:deep(.el-descriptions .el-descriptions__label) {
    width: 150px;
}

.code-block {
    width: 100%;
    min-height: 160px;
    border-radius: 4px;
    padding: 12px;
}

.info-btn {
    .el-button {
        padding: 8px !important;
        height: 20px;
        border-radius: 4px;
        margin-left: 8px;
    }
}
</style>
