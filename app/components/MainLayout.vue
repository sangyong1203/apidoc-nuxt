<template>
    <el-container style="height: 100%;    flex-direction: column;">
        <slot name="main-header"></slot>
        <el-main>
            <div class="contents-wrapper">
                <div class="left-wrapper">
                    <!-- 메뉴 slot -->
                    <slot name="side-menu"></slot>
                </div>
                <div class="contents">
                    <!-- 바디 slot  -->
                    <slot name="main-content"></slot>
                    <div class="page-footer">
                        <div class="footer-logo" v-if="footerLogoUrl">
                            <img style="height: 75%" :src="footerLogoUrl" />
                        </div>
                        <div class="copy-right">{{ copyright }}</div>
                    </div>
                </div>
            </div>
        </el-main>
    </el-container>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
export interface MainLayoutProps {
    footerLogoUrl?: string
    copyright: string
}
const { copyright, footerLogoUrl} = defineProps<MainLayoutProps>()
onMounted(() => {
    setDarkMode()
})
    const setDarkMode = () => {
      const htmlEl = document.querySelector('html')
        if (htmlEl) {
            htmlEl.className = 'dark'
        }
    }

</script>

<style lang="scss" scoped>

/* 메인 */
.el-main {
    --el-main-padding: 0px;
    color: var(--primary-text-color);
    overflow: hidden;
}
.contents-wrapper {
    display: flex;
    flex-direction: row;
    height: 100%;
    background: var(--main-page-bg-color);
}
.contents-wrapper .contents {
    padding: 32px 32px 0px 32px;
    width: 100%;
}

/* 컨텐츠 본문 내용 */
.contents {
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.page-footer {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    align-items: center;
    padding: 12px 0px;
    height: 60px;
}
.footer-logo {
    height: 100%;
}
.copy-right {
    font-size: 0.75rem;
    color: var(--primary-text-color);
    text-align: right;
}
</style>
