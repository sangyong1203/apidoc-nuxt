<template>
    <div class="error" style="height: 100%">
        <el-alert
            style="height: 100%"
            title="일시적인 에러"
            type="info"
            description="서버에 일시적인 에러가 발생했습니다. 잠시 후 다시 시도해 주세요."
            :closable="false"
            center
        />
    </div>
</template>
