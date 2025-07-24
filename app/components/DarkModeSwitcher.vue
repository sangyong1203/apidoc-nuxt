<template>
    <el-switch
        class="darkmode-switcher"
        v-model="userStore.darkMode"
        @change="userStore.setDarkMode"
    >
        <template #active-action>
            <el-icon color="#d3d3d3" ><Moon /></el-icon>
        </template>
        <template #inactive-action>
            <el-icon color="white" ><Sunny /></el-icon>
        </template>
    </el-switch>
</template>
<script lang="ts" setup>
import { useUserStore } from '~/stores/UserStore'
import { Sunny, Moon } from '@element-plus/icons-vue'
const userStore = useUserStore()

</script>
<style lang="scss" scope>
.darkmode-switcher {
    --el-switch-on-color: #2c2c2c;
    --el-switch-off-color: gray;
    margin-right: 16px;
}
.el-switch__core{
    height: 20px;
}
.el-switch__core .el-switch__action{
    background-color: gray;
    margin:2px 0;
}
.is-checked .el-switch__action{
    background-color: #2c2c2c;
}
</style>
