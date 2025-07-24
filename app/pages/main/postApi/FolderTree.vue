<template>
    <div class="folders">
        <div class="colletions-title">
            폴더 목록
            <div  style="display: flex; gap: 8px;">
                <el-tooltip content="Add Folder" :hide-after="0">
                    <el-icon :size="20" @click="addRootFolder">
                        <FolderAdd style="width:18px;height: 18px; cursor: pointer;"/>
                    </el-icon>
                </el-tooltip>
            </div>
        </div>
        <el-tree
            class="tree"
            ref="treeRef"
            node-key="folderId"
            :data="obj.treeFolders"
            :props="defaultProps"
            highlight-current
            default-expand-all
            @node-click="handleNodeClick"
        >
            <template #default="{ node, data }">
                <div class="folder-item">
                    <div class="folder-item-label">
                        <el-icon v-if="data.isOpen"><FolderOpened /></el-icon>
                        <el-icon v-else><Folder /></el-icon>
                        {{ node.label }}
                    </div>
                    <div class="folder-btn">
                        <el-tooltip content="Add Folder" :hide-after="0">
                            <el-icon @click.stop="addFolder(data)"><FolderAdd /></el-icon>
                        </el-tooltip>
                        <el-tooltip content="Remove Folder" :hide-after="0">
                            <el-icon @click.stop="deleteFolder(data)"><FolderRemove /></el-icon>
                        </el-tooltip>
                        <el-tooltip content="Edit Folder" :hide-after="0">
                            <el-icon @click.stop="editFolder(data)"> <Edit /></el-icon>
                        </el-tooltip>
                    </div>
                </div>
            </template>
        </el-tree>
    </div>
    <FolderDialog ref="folderDialogRef" @on-confirm="onSubmitFolder"></FolderDialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import FolderDialog from './FolderDialog.vue'
import { Service } from '~/services/postApi/model_service/Service'
import { Notification } from '~/services/common/dialog/ComDialog'
import { useGlobalDialog } from '~/services/common/dialog/ComDialog'
import type { Folder as FolderType } from '~/services/postApi/model_service/Type'
import { FolderAdd, Edit, FolderRemove, Folder, FolderOpened } from '@element-plus/icons-vue'

const obj = reactive(new Service())
const defaultProps = {
    children: 'children',
    label: 'folderName',
}
const folderDialogRef:any = ref(null)
onMounted(()=>{
    obj.getFolders()

})

const onSubmitFolder = (value:FolderType) => {
    if(!value.id){
        obj.createFolder(value).then( res => {
            Notification.success('성공', '폴더 추가 성공!')
            obj.getFolders()
        })
    }else{
        
        obj.updateFolder(value).then( res => {
            Notification.success('성공', '폴더 수정 성공!')
            obj.getFolders()
        })
    }
}
const addRootFolder = ( ) => {
    folderDialogRef.value.openDialog('추가')
}
const addFolder = ( value:any) => {
    console.log('addFolder',value)
    folderDialogRef.value.openDialog('추가', value)
}
const editFolder = ( value:any) => {
    folderDialogRef.value.openDialog('수정', value)
}

const deleteFolder = ( value:FolderType) => {
    console.log('deleteFolder', value)
    if(value.children.length > 0){
        Notification.warning('폴더 아래 자식 폴더가 있습니다. 자식 폴더를 먼저 삭제 하시고 다시 진행해 주세요.')
        return
    }
    useGlobalDialog(value.folderName+' 폴더를 삭제 하시겠습니까?', '확인','CONFIRM_YN').onConfirm(()=>{
            if(value.id){
                obj.deleteFolder(value.id).then( res => {
                    Notification.success('성공', '삭제 성공!')
                    obj.getFolders()
                })
            }
        }).onCancel(()=>{})

}

const emits = defineEmits(['onClikNode'])
const handleNodeClick = (node: any) => {
    if (node.children.length) {
        node.isOpen = !node.isOpen
    }
    emits('onClikNode', node.requestURL)
}
</script>
<style lang="scss" scoped>
.folders {
    padding: 8px 0;
    overflow: hidden;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
}
.colletions-title {
    border-bottom: 1px solid var(--border-color);
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
    position: absolute;
    right: 0px;
    padding: 2px 4px;
    background-color: inherit;
    svg {
        height: 19px;
        width: 18px;
    }
}
.folder-item {
    width: 100%;
    display: flex;
    justify-content: space-between;
    background-color: inherit;

}
.folder-item:hover {
    .folder-btn {
        display: flex;
    }
}
.tree{
    flex:1;
    overflow: scroll;
}
</style>
