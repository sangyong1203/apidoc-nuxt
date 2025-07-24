<template>
    <div class="menu-bar" :class="collapse ? 'collapse' : 'not-collapse'">
        <!-- <div class="menu-header">
            <el-switch class="switcher" size="small" v-model="collapse" /> 
            <UserInfo :collapse="collapse" />

        </div> -->
        <MenuHeader v-model="collapse" name="Menu"/>
        
        <el-menu
            :default-active="navStore.getRoute()"
            mode="vertical"
            class="left-menu"
            :collapse="collapse"
            :collapse-transition="false"
            :unique-opened="true"
            :router="true"
            @select="handleSelect"
        >
            <template v-for="(item, idx) in state.menu" :key="idx">
                <template v-if="item.useYn === 'Y'">
                    <el-menu-item v-if="item.children.length === 0" :index="item.path || item.id.toString()">
                        <el-icon> <component :is="item.icon"></component> </el-icon>
                        <template #title>{{ item.title }}</template>
                    </el-menu-item>

                    <el-sub-menu v-else :index="item.path || item.id.toString()">
                        <template #title>
                            <el-icon> <component :is="item.icon"></component> </el-icon>
                            <span>{{ item.title }}</span>
                        </template>
                        <!-- 2단 -->
                        <template v-for="(child, idx2) in item.children" :key="idx2">
                            <template v-if="child.useYn === 'Y'">
                                <el-menu-item
                                    v-if="child.children.length === 0"
                                    :index="child.path || child.id.toString()"
                                >
                                    <template #title
                                        ><span>{{ child.title }}</span></template
                                    >
                                </el-menu-item>
                                <el-sub-menu v-else :index="child.path || child.id.toString()">
                                    <template #title> {{ child.title }} </template>
                                    <!-- 3단 -->
                                    <template v-for="(grandChild, idx3) in child.children" :key="idx3">
                                        <el-menu-item
                                            :index="grandChild.path || grandChild.id.toString()"
                                            v-if="grandChild.useYn === 'Y'"
                                        >
                                            {{ grandChild.title }}
                                        </el-menu-item>
                                    </template>
                                    <!-- 3단 -->
                                </el-sub-menu>
                            </template>
                        </template>
                        <!-- 2단 // -->
                    </el-sub-menu>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useMenuStore } from '~/stores/MenuStore'
import { useNavStore } from '~/stores/NavStore'

const collapse = ref(true)
const menuStore = useMenuStore()
const navStore = useNavStore()
// Url 진입시 메뉴 활성화
const state: any = reactive({
    menu: computed(() => menuStore.getMenu()),
})

const handleSelect = (path: string) => {
    navStore.handleClickMenu(path, state.menu)
}

onMounted(()=>{
    menuStore.setTempMenu()
})
</script>

<style scoped lang="scss">
/* 메뉴 */
.menu-bar {
    height: 100%;
    overflow: scroll;
    margin-right: -5px;
}
.collapse {
    animation-duration: 0.5s;
    animation-name: collapse;
    width: 60px;
}
.not-collapse {
    animation-duration: 0.5s;
    animation-name: notCollapse;
    width: 320px;
}
@keyframes collapse {
    from {
        width: 320px;
    }
    to {
        width: 60px;
    }
}
@keyframes notCollapse {
    from {
        width: 60px;
    }
    to {
        width: 320px;
    }
}

.left-menu {
    height: 100%;
    overflow: scroll;
    padding-top: 12px;
    width: 100%;
}

.left-menu:not(.el-menu--collapse) {
    border: 1px solid var(--color-black);
}

.left-menu .el-menu-item.is-active {
    font-weight: 700;
    color: var(--memu-activate-color) !important;
}
.left-menu .el-button.is-text {
    padding: 0;
    height: 40px;
    border: none;
}
.left-menu .menu-depth1,
.menu-depth1 .el-sub-menu__title {
    padding-left: 5px;
}
.left-menu .menu-depth1,
.menu-depth1 .el-sub-menu__title:hover {
    --el-menu-hover-bg-color: var(--menu-hover-sub-bg-color);
}

:deep(.el-sub-menu__title) {
    font-size: 16px !important;
    color: #ffffff;
    padding-left: 12px !important;
}
.second-menu {
    background-color: var(--menu-sub-bg-color);
}
.el-menu.el-menu--collapse {
    width: 102%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.el-menu::-webkit-scrollbar {
    width: 0px;
    height: 0px;
    background-color: transparent;
}
.el-menu::-webkit-scrollbar-thumb {
    border-radius: 6px;
    background-color: transparent;
}
.el-menu:hover::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.262);
}

/* 
.switcher {
    --el-switch-on-color: var(--color-gray);
    --el-switch-off-color: var(--color-gray) !important;
    display: flex;
    justify-content: flex-end;
    width: 100%;
} */

.fade-in {
    animation-duration: 0.3s;
    animation-name: fadeIn;
    opacity: 1;
}
@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
.fade-out {
    animation-duration: 0.3s;
    animation-name: fadeOut;
    opacity: 0;
}
@keyframes fadeOut {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
}
</style>
