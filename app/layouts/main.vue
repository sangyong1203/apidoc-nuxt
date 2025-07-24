<template>
    <MainLayout copyright="© Copyright *** All rights reserved.">
        <template #main-header>
            <MainHeader systemName="Postapi" :title-style="{fontWeight:'bold', fontSize:'24px', color: '#dbdbdb'}"> </MainHeader>
        </template>
        <template #side-menu>
            <LeftMenu />
        </template>
        <template #main-content>
                <NuxtPage></NuxtPage>
        </template>
    </MainLayout>
    

</template>

<script setup lang="ts">

</script>
<style scoped>
.search-box-container {
    padding: 16px;
}
</style>