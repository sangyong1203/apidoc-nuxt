<template>
    <div class="folders">
        <draggable v-model="colletions" tag="ul" group="folders" itemKey="interfaceName">
            <template #item="{ element: item }">
                <li class="folder-item" @click.stop="collapse(item)">
                    <div v-if="item.type==='folder'" class="folder-label" >
                        <el-icon v-if="item.isOpen"><FolderOpened /></el-icon> 
                        <el-icon v-else><Folder /></el-icon> 
                        <span>{{ item.folderName }}</span>
                        <div class="folder-btn">
                            <el-tooltip content="Add Request" >
                                <el-icon><DocumentAdd /></el-icon>
                            </el-tooltip>
                            <el-tooltip content="Add Folder" >
                                <el-icon ><FolderAdd /></el-icon>
                            </el-tooltip>
                            <el-tooltip content="Remove Folder" >
                                <el-icon><FolderRemove /></el-icon>
                            </el-tooltip>

                        </div>
                    </div>
                    <div v-if="item.type==='api'" class="folder-label" >
                        <el-tag v-if="item.httpMethod === 'GET'" type="success" disable-transitions round size="small" >GET</el-tag>
                        <el-tag v-if="item.httpMethod === 'POST'" type="primary" disable-transitions round size="small" >POS</el-tag>
                        <el-tag v-if="item.httpMethod === 'PUT'" type="warning" disable-transitions round size="small" >PUT</el-tag>
                        <el-tag v-if="item.httpMethod === 'DELETE'" type="danger" disable-transitions round size="small" >DEL</el-tag>
                        {{ item.interfaceName }}
                    </div>
                    <RecursiveDraggable v-if="item.children && item.children.length && item.isOpen" v-model="item.children" />
                </li>
            </template>
        </draggable>
    </div>

</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
import { toRefs, ref } from 'vue'
type Folder = {
    folderName: string
    type: string
    interfaceName: string
    httpMethod: string
    requestURL: string
    isOpen: boolean
    children:Folder[]
}
export interface Props {
    modelValue: Folder[]
}
const props = defineProps<Props>()
const { modelValue } = toRefs(props)

const colletions = ref(modelValue.value)

const collapse = (value:Folder)=> {
    value.isOpen = !value.isOpen
}
</script>
<style lang="scss" scoped>
.folders{
    padding: 8px 0;
    width: 100%;
    ul {
        list-style: none;   
        margin: 0;           
        padding: 0px 4px 0 4px;     
    }
    li {
        margin: 0;
        padding: 8px;
    }
}
.folder-label{
    display: flex;
    align-items: center;
    gap: 8px;
}
.folder-btn{
    display: flex;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    svg{
        height: 19px;
        width:18px;
    }
}
.folder-label:hover{
    .folder-btn{
        display: flex;
    }
}
:deep(.el-tag__content){
    padding-top: 3px;
    font-size: 12px !important;
    vertical-align: middle;
}
</style>