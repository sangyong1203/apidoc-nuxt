<template>
        <BasicDialog
        :model-value="isShowDialog"
        :title="dialogTitle"
        description=""
        width="90%"
        style="height: 95%;"
        @on-close="onClose"
    >
    <template #footer>
            <span class="dialog-footer">
                <el-button @click="onClose" class="POST">닫기</el-button>
                <el-button type="primary" @click="saveData" class="POST">저장</el-button>
            </span>
        </template>
    <el-form
        class="editForm"
        ref="ruleFormRef"
        :rules="rules"
        :model="ruleForm"
        require-asterisk-position="right"
        label-position="left"
        label-width="140"
    >
        <OperationBox>
            <el-affix :offset="45">

                <el-button @click="sendData" type="success" plain>Send</el-button>
                <!-- <el-button @click="saveData">Save</el-button> -->
                <el-button @click="excelDownload">API Download</el-button>

            </el-affix>
        </OperationBox>
        <el-form-item label="Interface Name" prop="interfaceName">
            <el-input type="text" v-model="ruleForm.interfaceName" placeholder="Interface Name 입력"></el-input>
        </el-form-item>
        <el-form-item label="Description" prop="description">
            <el-input type="text" v-model="ruleForm.description" placeholder="Description 입력"></el-input>
        </el-form-item>
        <!-- <el-form-item label="Header">
            <el-input type="text" v-model="ruleForm.header"></el-input>
        </el-form-item> -->
        <el-form-item label="Request URL" prop="requestURL">
            <el-input type="text" v-model="ruleForm.requestURL" placeholder="Request URL 입력"></el-input>
        </el-form-item>

        <div style="display: flex; gap: 20px; justify-content: flex-start">
            <el-form-item label="HTTP Method" prop="httpMethod" >
                <div style="display: flex; width: 100%; gap: 8px;">
                    <DropdownList
                        width="180px"
                        v-model="ruleForm.httpMethod"
                        placeholder="HTTP Method 선택"
                        :list="obj.httpMethodList"
                        option-label="label"
                        option-value="value"
                    />
                    <div v-if="ruleForm.httpMethod === 'GETFILE'" style="display: flex; width: 250px;">
                        <!-- <span style="width: 130px;">File Name</span> -->
                        <el-input  v-model="ruleForm.donwloadFileName" placeholder="Download File Name 입력"></el-input>
                    </div>
                </div>

            </el-form-item>
            <el-form-item label="Client Type" prop="clientType"  label-width="100" style="margin-left: 28px; width: 300px;" >
                <DropdownList
                    v-model="ruleForm.clientType"
                    placeholder="Client Type 선택"
                    :list="obj.clientTypeList"
                    option-label="label"
                    option-value="value"
                />
            </el-form-item>
            <el-form-item label="Headers Content-Type" prop="headersContentType"  label-width="180" style="margin-left: 28px;width: 400px;">
                <DropdownList
                    v-model="ruleForm.headersContentType"
                    placeholder="Headers Content-Type 선택"
                    :list="obj.headersContentTypeList"
                    option-label="label"
                    option-value="value"
                />
            </el-form-item>
        </div>
        <el-form-item label="Request" >
            <div style="display: flex; flex-direction: column; width: 100%; gap: 8px">
                <el-table :data="ruleForm.request"  style="min-height: 160px;" height="100%">
                    <el-table-column prop="parameter" width="160px">
                        <template #default="{ row }">
                            <div :class="!row.valid && row.level == 1 ?'valid-false':''">
                                <el-input v-if="row.level == 1" v-model="row.parameter" placeholder="Parameter 입력" @input="paramDuplicateValidater(row)"></el-input>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="parameter" width="160px" label="Parameter">
                        <template #default="{ row }" >
                            <div :class="!row.valid && row.level == 2 ?'valid-false':''" >
                                <el-input v-if="row.level == 2" v-model="row.parameter" placeholder="Parameter 입력" @input="paramDuplicateValidater(row)"></el-input>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="parameter" width="160px">
                        <template #default="{ row }">
                            <div :class="!row.valid && row.level == 3 ?'valid-false':''">
                                <el-input v-if="row.level == 3" v-model="row.parameter" placeholder="Parameter 입력" @input="paramDuplicateValidater(row)"></el-input>
                            </div>
                        </template>
                    </el-table-column>
                    
                    <el-table-column prop="requiredYn" label="Required" width="90">
                        <template #default="{ row }">
                            <DropdownList
                                width="100%"
                                v-model="row.requiredYn"
                                placeholder="Y/N"
                                :list="requiredYnList"
                                option-label="label"
                                option-value="value"
                            />
                        </template>
                    </el-table-column>
                    <el-table-column prop="type" label="Type" width="150">
                        <template #default="{ row }">
                            <DropdownList
                                width="100%"
                                v-model="row.type"
                                placeholder="Data Type"
                                :list="requestDataTypes"
                                option-label="label"
                                option-value="value"
                                @on-change="onChangeRequestDataType(row)"
                                />
                        </template>
                    </el-table-column>
                    <el-table-column prop="testValue" label="Test Value" >
                        <template #default="{ row }">
                            <div  v-if="row.type !== 'object' && row.type !== 'object array' && row.type !== 'file'" >
                                <el-input 
                                    v-model="row.testValue" 
                                    placeholder="Test Value 입력"
                                    :input-style="{textAlign:'center'}"
                                    @input="checkTestVelue(row)"
                                />
                            </div>
                            <template v-else-if="row.type == 'file'">
                                <div style="display: flex; width: 100%;" >
                                    <el-upload
                                        ref="uploadRef"
                                        v-model:file-list="row.files"
                                        :auto-upload="false"
                                        :show-file-list="false"
                                        @change="onUpload"
                                        >
                                        <div class="upload__button-box">
                                            <el-button size="small" type="warning" plain>File</el-button>
                                        </div>
                                    </el-upload>
                                    <el-tooltip :disabled="!row.files[0]?.name" :content="row.files[0]?.name" placement="bottom" effect="light" >
                                        <div class="upload-filename">
                                            {{ row.files[0]?.name }}
                                        </div>
                                    </el-tooltip>
                                    <div style="display: flex; align-items: center; cursor: pointer;">
                                        <el-icon @click="clearFiles(row)"><delete /></el-icon>
                                    </div>

                                </div>
                            </template>
                            
                            <div style=" cursor: not-allowed" v-else>-</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="description" label="Description" >
                        <template #default="{ row }">
                            <el-input
                                type="textarea"
                                autosize
                                v-model="row.description"
                                placeholder="Description 입력"
                            ></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column width="100" >
                        <template #default="scope">
                            <el-button-group >
                                <el-button text type="danger" @click="deleteRequestParam(scope)"><el-icon><Delete/></el-icon></el-button>
                                <el-button text type="info" @click="addSubRequestParam(scope)" v-show="(scope.row.type === 'object array' || scope.row.type === 'object') && scope.row.level < 3">
                                    <el-icon><Plus/></el-icon>
                                </el-button>
                            </el-button-group>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button class="add-btn" @click="addRequestParam" type="success" plain >Add</el-button>
            </div>
        </el-form-item>
        <el-form-item label="Response">
            <div style="display: flex; flex-direction: column; width: 100%; gap: 8px">
                <el-table :data="ruleForm.response" style="min-height: 160px;" height="100%" >
                    <el-table-column prop="variable" width="160px">
                        <template #default="{ row }">
                            <div :class="!row.valid && row.level == 1 ?'valid-false':''">
                                <el-input v-if="row.level == 1" v-model="row.variable" placeholder="Variable 입력" @input="variableDuplicateValidater(row)"></el-input>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="variable" width="160px" label="Variable" >
                        <template #default="{ row }" >
                            <div :class="!row.valid && row.level == 2 ?'valid-false':''" >
                                <el-input v-if="row.level == 2" v-model="row.variable" placeholder="Variable 입력" @input="variableDuplicateValidater(row)"></el-input>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="variable" width="160px">
                        <template #default="{ row }">
                            <div :class="!row.valid && row.level == 3 ?'valid-false':''">
                                <el-input v-if="row.level == 3" v-model="row.variable" placeholder="Variable 입력" @input="variableDuplicateValidater(row)"></el-input>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="variable">
                        <template #default="{ row }">
                            <div :class="!row.valid && row.level == 4 ?'valid-false':''">
                                <el-input v-if="row.level == 4" v-model="row.variable" placeholder="Variable 입력" @input="variableDuplicateValidater(row)"></el-input>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="requiredYn" label="Required" width="90">
                        <template #default="{ row }">
                            <DropdownList
                                width="100%"
                                v-model="row.requiredYn"
                                placeholder="Y/N"
                                :list="requiredYnList"
                                option-label="label"
                                option-value="value"
                            />
                        </template>
                    </el-table-column>
                    <el-table-column prop="type" label="Type" width="150">
                        <template #default="{ row }">
                            <DropdownList
                                width="100%"
                                v-model="row.type"
                                placeholder="Data Type"
                                :list="responseDataTypes"
                                option-label="label"
                                option-value="value"
                            />
                        </template>
                    </el-table-column>
                    <el-table-column prop="description" label="Description">
                        <template #default="{ row }">
                            <el-input
                                type="textarea"
                                autosize
                                v-model="row.description"
                                placeholder="Description 입력"
                            ></el-input>
                        </template>
                    </el-table-column>
                    
                    <el-table-column width="100">
                        <template #default="scope">
                            <el-button-group>
                                <el-button text type="danger" @click="deleteResponseVar(scope)"><el-icon><Delete/></el-icon></el-button>
                                <el-button text type="info" @click="addSubResponseVar(scope)" v-show="(scope.row.type === 'object array' || scope.row.type === 'object') && scope.row.level < 4">
                                   <el-icon><Plus/></el-icon> </el-button>
                            </el-button-group>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button class="add-btn" @click="addResponseVar" type="success" plain>Add</el-button>
            </div>
        </el-form-item>
        <el-form-item label="Request Example" prop="requestExample">
            <pre style="width: 100%; "><code contenteditable="true"><div class="code-block" ref="requestCode">{{ ruleForm.requestExample }}</div></code></pre>
        </el-form-item>
        <el-form-item label="Response Example" prop="responseExample" >
            
            <!-- <el-button className="create-response-btn" @click="createResponseData(ruleForm.responseExample)">Response 생성</el-button> -->
            <pre style="width: 100%;">
                <code ><div class="code-block" >{{ ruleForm.responseExample }}</div></code>
            </pre>
        </el-form-item>
    </el-form>
    </BasicDialog>
</template>
<script lang="ts" setup>
import { Message, Notification } from '~/services/common/dialog/ComDialog'
import { reactive, ref, computed } from 'vue'
import { Service } from '~/services/postApi/model_service/Service'
import { ElMessageBox, type UploadFile, type UploadFiles } from 'element-plus'
import { makeApiExcelAndDownload } from '~/services/postApi/model_service/ApiExcelDownload.js'
import type { PostApiModel, RequestType } from '~/services/postApi/model_service/Type'
import { Edit, Delete, Plus } from '@element-plus/icons-vue'
const obj = reactive(new Service())
const createId = (): string =>{
   return new Date().getTime().toString()
}
const isEdit = ref(false)
const requestCode = ref<HTMLElement>()

const ruleForm = ref<PostApiModel>(obj.apiItem)
const ruleFormRef:any = ref(null)

const requiredYnList = [
    { label: 'Y', value: 'Y' },
    { label: 'N', value: 'N' },
]
const requestDataTypes = computed(() => {
    let types =[]
    if(ruleForm.value.httpMethod==='GET' || ruleForm.value.httpMethod==='DELETE'){
        types = [
            { label: 'Number', value: 'number' },
            { label: 'String', value: 'string' },
            { label: 'Boolean', value: 'boolean' },
        ]
    }else {
        if(ruleForm.value.headersContentType === 'form-data'){
            types = [
                { label: 'Number', value: 'number' },
                { label: 'String', value: 'string' },
                { label: 'Boolean', value: 'boolean' },
                { label: 'Object', value: 'object' },
                { label: 'Object Array', value: 'object array' },
                { label: 'Number Array', value: 'number array' },
                { label: 'String Array', value: 'string array' },
                { label: 'File', value: 'file' },
            ]
        }else{
            types = [
                { label: 'Number', value: 'number' },
                { label: 'String', value: 'string' },
                { label: 'Boolean', value: 'boolean' },
                { label: 'Object', value: 'object' },
                { label: 'Object Array', value: 'object array' },
                { label: 'Number Array', value: 'number array' },
                { label: 'String Array', value: 'string array' },
            ]
        }
    }
    return types
}) 
const responseDataTypes = [
    { label: 'Number', value: 'number' },
    { label: 'String', value: 'string' },
    { label: 'Boolean', value: 'boolean' },
    { label: 'Object', value: 'object' },
    { label: 'Object Array', value: 'object array' },
    { label: 'Number Array', value: 'number array' },
    { label: 'String Array', value: 'string array' },
    // { label: 'File', value: 'file' },
]

const rules = ref({
    interfaceName:{required:true, message:'Interface Name을 입력하세요.', trigger: ['change', 'blur']},
    // description: {required:true, message:'Please input description.', trigger: ['change', 'blur']},
    requestURL:{required:true, message:'Request URL를 입력하세요.', trigger: ['change', 'blur']},
    httpMethod: {required:true, message:'HTTP Method를 선택하세요.', trigger: ['change', 'blur']},
    clientType: {required:true, message:'Client Type을 선택하세요', trigger: ['change', 'blur']},
    headersContentType: {required:true, message:'Headers Content-Type을 선택하세요.', trigger: ['change', 'blur']},

})

// Request에 Parameter명 중복 여부 체크 
const paramDuplicateValidater = (row:any) => {
    const filteredItems =  ruleForm.value.request.filter( item => item.parameter === row.parameter && row.level === item.level)
    if( filteredItems.length > 1  ){
        row.valid = false
        Message.error('중복된 parameter: '+ row.parameter)
    } else {
        row.valid = true
    }
}
// Response에 Variable명 중복 여부 체크 
const variableDuplicateValidater = (row:any) => {
    const filteredItems =  ruleForm.value.response.filter( item => item.variable === row.variable && row.level === item.level)
    if( filteredItems.length > 1  ){
        row.valid = false
        Message.error('중복된 variable: '+ row.variable)
    } else {
        row.valid = true
    }
}
const onChangeRequestDataType = (row:any) => {
    checkTestVelue(row)
}
// level1 parameter 추가 
const addRequestParam = () => {
    ruleForm.value.request.push({
        paramId: createId(),
        parentParamId: '',
        parameter: '',
        testValue: null,
        files: [],
        level: 1,
        requiredYn: '',
        type: '',
        description: '',
        childrenCount: 0,
        valid: true
    })
}
// level2, level3 parameter 추가 
const addSubRequestParam = (scope:any) => {
    if(scope.row.level >= 3){
        Notification.warning('최대 뎁스 레벨 초과 하였습니다.')
        return
    }
    let childernParam = ruleForm.value.request.filter((item:any) => item.parentParamId === scope.row.paramId)

    // 자식 params 개수 총합계산 
    let childrenCount = 0 
    if(childernParam.length > 0 ) {
        childernParam.forEach( (item:any) => {
            childrenCount += item.childrenCount
        })
    }
    ruleForm.value.request.forEach(item => {
        if(item.paramId === scope.row.paramId){
            item.childrenCount += 1
        }
    })

    // sub parameter를 추가할 index 위치  계산 
    let lastParamIndex =  scope.$index + childernParam.length+ childrenCount + 1

    // sub parameter을 request array에 추가
    ruleForm.value.request.splice(lastParamIndex, 0, {
        paramId: createId(),
        parentParamId: scope.row.paramId,
        parameter: '',
        testValue: null,
        files: [],
        level: scope.row.level + 1,
        requiredYn: '',
        type: '',
        description: '',
        childrenCount: 0,
        valid: true
    })
}
// Parameter 삭제 
const deleteRequestParam = (scope:any) => {
    if(scope.row.childrenCount > 0) {
        Notification.error('자식 변수가 있습니다. 자식 변수를 먼저 삭제한 후 다시 시도하세요.')
        return
    }
    ruleForm.value.request.forEach ((item:any) => {
        if(scope.row.parentParamId === item.paramId){
            item.childrenCount -= 1
        }
    })
    ruleForm.value.request = ruleForm.value.request.filter( (item:any, index:number) => index !== scope.$index )
}

// level1 Variable 추가 
const addResponseVar = () => {
    ruleForm.value.response.push({
        variableId: createId(),
        parentVariableId: '',
        variable: '',
        testValue: null,
        level: 1,
        requiredYn: '',
        type: '',
        description: '',
        childrenCount: 0,
        valid: true
    })
}
// level2, level3 Variable 추가 
const addSubResponseVar = (scope:any) => {
    if(scope.row.level >= 4){
        Notification.warning('최대 뎁스 레벨 초과 하였습니다.')
        return
    }
    let childernParam = ruleForm.value.response.filter((item:any) => item.parentVariableId === scope.row.variableId)
    
    // 자식 params 개수 총합계산 
    let childrenCount = 0 
    if(childernParam.length > 0 ) {
        childernParam.forEach( (item:any) => {
            childrenCount += item.childrenCount
        })
    }
    ruleForm.value.response.forEach(item => {
        if(item.variableId === scope.row.variableId){
            item.childrenCount += 1
        }
    })

    // sub parameter를 추가할 index 위치  계산 
    let lastParamIndex =  scope.$index + childernParam.length+ childrenCount + 1

    // 자식 변수을 request array에 추가
    ruleForm.value.response.splice(lastParamIndex, 0, {
        variableId: createId(),
        parentVariableId: scope.row.variableId,
        variable: '',
        testValue: null,
        level: scope.row.level + 1,
        requiredYn: '',
        type: '',
        description: '',
        childrenCount: 0,
        valid: true
    })
}
// Variable 삭제 
const deleteResponseVar = (scope:any) => {
    if(scope.row.childrenCount > 0) {
        Notification.error('자식 변수가 있습니다. 자식 변수를 먼저 삭제한 후 다시 시도하세요.')
        return
    }
    ruleForm.value.response.forEach ((item:any) => {
        if(scope.row.parentVariableId === item.variableId){
            item.childrenCount -= 1
        }
    })
    ruleForm.value.response = ruleForm.value.response.filter( (item:any, index:number) => index !== scope.$index )
}
// 응답한 데이터를 Response form data 작성 
const createResponseData = ( value:any ) => {
    console.log('createResponseData', value)
}


//  Test Value를 검증 한다
const checkTestVelue = (row:RequestType) => {
    row.valid = true
    if(row.requiredYn==='Y' && !row.testValue){
        Message.error('Test Value를 입력하세요.')
        row.valid = false
    } else if(!row.parameter){
        row.valid = false
        Message.error('Parameter를 입력하세요')
    } else if(!row.type){
        row.valid = false
        Message.error(`"${row.parameter}"  Data Type을 선택하세요.`)
    } else if(row.type==='boolean' && (row.testValue !== 'true' && row.testValue !== 'false')  ){
        if(row.requiredYn==='N' && !row.testValue){
            row.valid = true
        } else {
            row.valid = false
            Message.error('Boolean(true/false)을 입력하세요.')
        }
    } else if(row.type === 'number'){
        if(Number.isNaN(Number(row.testValue))){
            Message.error('숫자를 입력하세요.')
            row.valid = false
        }
    } 

}
// Request 리스트 데이터를 key, value인 Object 형태로 변환 
const makeRequestParamsData = (formValue:any) => {
    let requestParams = {}
    formValue.request.forEach((item:any) => {
        if(!item.type){
            Message.error(`"${item.parameter}"  Data Type을 선택하세요.`)
            return
        }
        if(item.level === 1){
            const param = {
                [item.parameter]: convertTestValue(item.testValue, item.type, item.paramId, item.parameter, item.files)
            }
            requestParams = Object.assign({}, requestParams, param)
        console.log('requestParams',requestParams)

        }
    }) 
    return requestParams
}
// Test Value를 변수의 해당 타입인 값으로 변환 
function convertTestValue(tValue:any, type:string, paramId:string, parameter: string, files?:any[]){
    let value:any = null

    if(type==='string' ) value = tValue
    if(type==='number'){
        value =  Number(tValue)
    }
    if(type==='boolean'){
        value = Boolean(tValue)
    }
    if(type==='object'){
        const objParam:any = {}
        ruleForm.value.request.forEach((item:any)=>{
            if(item.parentParamId === paramId){
                objParam[item.parameter] = convertTestValue(item.testValue, item.type, item.paramId, item.parameter)
            }
        })
        value = objParam
    }
    if(type==='object array'){
        const objParam:any = {}
        ruleForm.value.request.forEach((item:any)=>{
            if(item.parentParamId === paramId){
                objParam[item.parameter] = convertTestValue(item.testValue, item.type, item.paramId, item.parameter)
            }
        })
        value = [objParam]
    }
    if(type==='number array' || type==='string array'){
        try{
            value = JSON.parse(tValue.replace(/'/g, '"'))
        } catch (err){
            value = 'The value is wrong~~~!'
            Message.error(`Parameter: ${parameter} 의 Test Value를 잘못 입력했습니다. 다시 입력해주세요.`)
        }
    }
    if(type==='file'){
        const fileList:any = []
        if(files && files.length>0){
            files.forEach( (file:any) => {
                fileList.push(file.raw)
            })
        }
        value = fileList
    }
    return value
}
//  Request 값을 검증 한다
const validateRequestValues = (formValue:any) => {
    let isValid = true
    
    console.log('validate', formValue)
    formValue.request.forEach((item:any) => {
        if(!item.type){
            Message.error(`"${item.parameter}"  Data Type을 선택하세요.`)
            isValid = false
            item.valid = false
        }
        if(!item.parameter){
            Message.error('Parameter를 입력하세요.')
            isValid = false
            item.valid = false

        }
        if(item.requiredYn==='Y' && (item.type !=='object' && item.type !=='object array') && !item.testValue) {
            Message.error(`Parameter: ${item.parameter}의 Test Value를 입력해주세요.`)
            isValid = false
            item.valid = false

        }
    }) 
    return isValid
}
// Api test
const sendData = async () => {

    if(!validateRequestValues(ruleForm.value)) return
    ruleForm.value.requestExample = makeRequestParamsData(ruleForm.value)

    const params = {
        httpMethod: ruleForm.value.httpMethod,
        headersContentType: ruleForm.value.headersContentType,
        donwloadFileName: ruleForm.value.donwloadFileName,
        requestURL: ruleForm.value.requestURL,
        requestParams: ruleForm.value.requestExample,
    }
    await obj.sendData(params).then(res => {
        Notification.success('Request successed!')
        ruleForm.value.responseExample = obj.resultData
        ruleForm.value.httpMethod !== 'GETFILE' && checkReponsedData(ruleForm.value.response, obj.resultData)
    }).catch(error => {
        Notification.error('sendData ERROR---: ',error)
    })
    
}
/**
 * 응답한 데이터가 api에 정의한 reponse와 일치하는지 체크한다 
 * @param responseTypes  Api form에 정의 한 response 데이터 타입
 * @param resultData Api 호출 후 받은 data
 */
const checkReponsedData = (responseTypes:any, resultData:any ) => {
    if(resultData){
        const resDataTypes = [] // type check 할수 있는 타입 데이터
        // type check 할수 있는 타입 데이터 생성 
        for( const key in resultData){
            console.log(`${key}: ${typeof resultData[key]}`)
            const typeItem = {
                parentVariableName: '',
                variable: key,
                level: 1,
                type: typeof resultData[key],
            }
            resDataTypes.push(typeItem)
            setResponesDataTypeForCheck (resDataTypes, resultData[key])
        }
        // 받은 데이터 타입 및 데이터 구조 체크 
        validateResponsedDataType(resDataTypes, responseTypes)
        console.log('resDataTypes', resDataTypes)
    }else{
        // 데이터가 없음 노티 
        Notification.error('Theres is no response data.')
    }
}
/**
 * resDataTypes 와 api에 정의한 response 타이입과 데이터 구조가 일치하는지 검증 
 * @param resDataTypes type check 할수 있는 타입 데이터
 * @param responseTypes api에 정의한 response 
 */
function validateResponsedDataType (resDataTypes:any, responseTypes:any){
    // check response data type
    const noteErr:string[] = []
    responseTypes.forEach( (item:any) => {
        const result:any = resDataTypes.find( (itemA:any) => itemA.variable === item.variable)
        if(result){
            if(result.type !== item.type){
                noteErr.push(`<div style="white-space: normal;">- 응답한 데이터에 Data type이 일치하지 않은 변수: <strong>${item.variable}</strong></div>`)
            }
        } else {
            item.variable && noteErr.push(`<div style="white-space: normal;">- 응답한 데이터에 누락된 변수: <strong>${item.variable}</strong> </div>`) 
        }
    })
    resDataTypes.forEach( (item:any) => {
        const result:any = responseTypes.find( (itemA:any) => itemA.variable === item.variable)
        if(!result){
            item.variable && noteErr.push(`<div style="white-space: normal;">- Response Variable에 요구하지 않은 변수: <strong>${item.variable}</strong></div>`) 
        }
    })
    if(noteErr.length > 0){
        ElMessageBox.alert(
            `${noteErr.join('')}`,
            '읍답 오류 데이터',
            {
            type: 'warning',
            center: true,
            dangerouslyUseHTMLString: true
            }
        )
    
}

}
/**
 * api 호출해서 받은 데이터를 type check 할수 있는 타입 데이터 구조로 생성 
 * @param resDataTypes type check 할수 있는 타입 데이터
 * @param resDataItem api 호출해서 받은 데이터
 */
function setResponesDataTypeForCheck (resDataTypes:any[], resDataItem:any) {
    const lastIndex = resDataTypes.length > 0 ? resDataTypes.length - 1 : null
    if(lastIndex === null) return
    const lastTypeItem = resDataTypes[lastIndex]
    if(lastTypeItem.type.includes('object')){
        if(Array.isArray(resDataItem)){
            if(typeof resDataItem[0] === 'object'){
                for( const keyA in resDataItem[0]){
                    // console.log(`is array ${keyA}: ${typeof resDataItem[0][keyA]}`)
                    const itemA = {
                        parentVariableName: lastTypeItem.variable,
                        variable: keyA,
                        level: lastTypeItem.level + 1,
                        type: typeof resDataItem[0][keyA],
                    }
                    resDataTypes.push(itemA)
                    setResponesDataTypeForCheck (resDataTypes, resDataItem[0][keyA])
                    resDataTypes[lastIndex].type = 'object array'
                }
            } else {
                resDataTypes[lastIndex].type = typeof resDataItem[0] + 'array'
            }
        }else {
            for( const keyA in resDataItem){
                // console.log(`is object ${keyA}: ${typeof resDataItem[keyA]}`)
                const itemA = {
                    parentVariableName: lastTypeItem.variable,
                    variable: keyA,
                    level: lastTypeItem.level + 1,
                    type: typeof resDataItem[keyA],
                }
                resDataTypes.push(itemA)
            }
        }
    }
}

const emits = defineEmits(['refreshData'])
// API 데이터 저장 
const saveData = () => { 
    ruleForm.value.testResult = ''
    ruleFormRef.value.validate( (valid:any) => {
        try{
            if(valid){
                if(requestCode.value?.innerText){
                    const newCode = new Function(`return ${requestCode.value?.innerText}`)
                    ruleForm.value.requestExample = newCode()
                }
                if(isEdit.value){
                    obj.updateApi(ruleForm.value).then(res => {
                        Notification.success('수정 성공!', '성공')
                    }).catch(error => {
                        Notification.error('수정 실패!', '실패')
                    })
        
                }else{
                    obj.createApi(ruleForm.value).then(res => {
                        Notification.success('등록 성공!', '성공')
                    }).catch(error => {
                        Notification.error('등록 실패!', '실패')
                    })
        
                }
            }
        }catch(error){
            Notification.error('저장한 데이터에 오타가 있는 것 같습니다. 확인 하시고 다시 저장해주세요. ' + error)
        }
    })
}
// 해당 Api의 문서를 excel 파일로 다운로드 한다.
const excelDownload = async () => {
    console.log('excelDownload data', ruleForm.value)
    await makeApiExcelAndDownload(ruleForm.value, ruleForm.value.interfaceName, 'api excel')
}

// 파일 업로드 
const onUpload = (uploadFile:UploadFile, uploadedFiles:UploadFiles) => {
    if(uploadedFiles.length > 1){
        uploadedFiles.shift()
    }
    console.log('onUpload', uploadedFiles)
}
const clearFiles = (row:any) => {
    row.files = []

}



const dialogTitle = ref('')
const isShowDialog = ref(false)
let apiId :any = null
const openDialog = (title: string, data?: any) => {
    // 환경설정 호출 
    obj.getEnvironmentSetting() 

    isShowDialog.value = true
    dialogTitle.value = 'API ' + title
    if (data && title === '수정') {
        isEdit.value = true
        apiId = data.id
        obj.getApiInfo(apiId).then( (res:any)=>{
            ruleForm.value = res
        })
    } else {
        isEdit.value = false
    }
}

const onClose = () => {
    isShowDialog.value = false
    ruleFormRef.value?.resetFields()
    ruleForm.value.request = []
    ruleForm.value.response = []
    emits('refreshData')


}
defineExpose({ openDialog })

</script>
<style lang="scss" scoped>
.add-btn{
    margin-bottom: 12px;
}
.editForm{
    position: relative;
}
:deep(.el-table__cell){
    padding: 4px 0;
}
:deep(.el-table .cell){
    padding: 0 4px;
}
.valid-false{
    *{
        // background-color: #ffd4d4;
        background-color: #884040;

    }
}
:deep(.el-table){
    .el-input__wrapper, .el-select__wrapper{
        box-shadow: unset;
    }
}
.create-response-btn{
    position: absolute;
}
.code-block{
    width: 100%; 
    min-height: 200px;
    border-radius: 4px; 
    padding: 12px; 
    border: 1px solid #dddddd;
    overflow: scroll;
    max-height: 705px;
}
:deep(.el-message-box){
    max-width: 500px !important;
}

:deep(.el-table) .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
.upload-filename{
    border: 1px solid #dddddd; flex: 1; margin:0 4px; padding: 0 8px; overflow: hidden; white-space: nowrap;
}

:deep(.el-button-group){
    display: flex;
    justify-content: flex-start;
    width: 100%;
}
</style>
