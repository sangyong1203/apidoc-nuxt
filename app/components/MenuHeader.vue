<template>
    <div class="menu-header">
        <el-switch class="switcher" size="small" v-model="collapse" /> 
        <div class="menu-header-content" :class="modelValue?'collapse':'not-collapse'">

            <el-collapse v-model="activeNames">
                <el-collapse-item name="1">
                    <template #title>
                        <div class="info-item">
                            <div class="info-item-name">{{ name }}</div> 
                            <!-- <div class="info-item-content">
                                <div class="info-label">ID: </div>
                                <div class="info-content"> {{ loginId }}</div>
                                </div> 
                            <div class="info-item-content">
                                <div class="info-label"><el-icon><Message /></el-icon> : </div>
                                <div class="info-content">{{ email }}</div>
                            </div>  -->
                        </div>
                    </template>
                    <div class="content-item">
                        <div class="content">{{ userStore.loginTime }}</div> 
                    </div>
                    <!-- <el-button type="primary" style="margin-top: 12px" @click="logOut">로그아웃</el-button> -->
                </el-collapse-item>
            </el-collapse>
        </div>
        </div>
</template>
<script lang="ts" setup>
import { useUserStore } from '~/stores/UserStore';
import { ref, toRefs, watch } from 'vue';
export interface Props{
    modelValue: boolean
    name?: string
}
const prop= defineProps<Props>()
const { modelValue } = toRefs(prop)

const userStore = useUserStore()
// const { name, loginId, email} = userStore.loginUser.user
const activeNames = ref('')
const emits = defineEmits(['update:modelValue'])
const collapse = ref(modelValue.value)
watch(collapse, ()=>{
    activeNames.value = modelValue.value ? '' : ''
    emits('update:modelValue', collapse.value)
})
// const loginService = new LoginService()
const logOut = () => {
   // 로그아웃 API 호출
//   loginService.logout()
}
</script>
<style scoped>

.menu-header {
    border-bottom: 1px solid #2e2e2e;
    color: #dddddd;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 16px 12px 8px 12px;
    background-color: var(--menu-bg-color);
    width: 100%;
    position: relative;
    min-height: 48px;
}
.menu-header-content{
    display: flex;
    align-items: center;
    padding-left: 4px;
    padding-right: 12px;
    overflow: hidden;
    width: 100%;
}

.switcher {
    --el-switch-on-color: var(--color-gray);
    --el-switch-off-color: var(--color-gray) !important;
    display: flex;
    justify-content: flex-end;
    width: 100%;
    position: absolute;
    right: 12px;
    top: 14px;
}
.info-item{
    width: 100%;
    text-align: left;
    word-wrap: break-word;
    line-height: 20px;
}
.info-item-name{
    font-size: 20px;
}
.info-item-content{
    color: #bbbbbb;
    display: flex;
    align-items: flex-start;
}
.info-label{
    width: 24px;
    font-size: 14px;
    display: flex;
    align-items: center;
}
.el-icon{
    height: 24px;
}
.info-content{
    width: calc(100% - 24px);
    word-wrap: break-word;
    font-size: 14px;

}
.content-item .label{
    width: 40px;
    font-size: 14px;
}
.content-item .content{
    word-wrap: break-word;
    font-size: 14px;
    flex: 1;
}
.content-item{
    display: flex;
    color: #bbbbbb;
}

.el-collapse{
    --el-collapse-header-bg-color: transparent;
    --el-collapse-header-text-color: #dddddd;
    --el-collapse-border-color: none;
    --el-collapse-content-bg-color: transparent;
    --el-collapse-content-text-color: #dddddd;
}
:deep(.el-collapse-item__header){
    display: flex;
    flex-direction: column;
    height: 100%;
    
}
:deep(.el-collapse-item__content){
    padding: 12px 0;
}
:deep(.el-collapse-item__arrow){
    display: none;
}

.collapse{
    animation-duration: 0.5s;
    animation-name: collapse;
    opacity: 0;
    height: 0;
}
.not-collapse{
    animation-duration: 0.5s;
    animation-name: notCollapse;
    opacity: 1;
    height: 100%;
}
@keyframes collapse {
    from {
        opacity: 1;
        height: 100%;

    }
    to {
        opacity: 0;
        height: 0;

    }
}
@keyframes notCollapse {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;

    }
}

</style>