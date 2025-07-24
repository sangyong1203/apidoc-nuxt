<template>
    <div class="page-body">
        <div class="page-body-content">
            <slot></slot>
        </div>
        <slot name="footer"></slot>
    </div>
</template>
<script lang="ts" setup>
export interface Props {
    flexDirection?: 'row' | 'column'
    gap?:string
}

</script>
<style scoped>
.page-body{
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 32px 32px 16px 32px;
    overflow: hidden;
    width: 100%;
    box-shadow: 0 0 4px 0px #dddddd;
    border-radius: 8px;
    position: relative;

    background-color: #ffffff;
}
.page-body-content{
    flex: 1;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    margin-right: -5px;
}
.flex-column{
    flex-direction: column;
}
.flex-row{
    flex-direction: row;
}
</style>