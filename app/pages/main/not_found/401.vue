<template>
    <div class="error" style="height: 100%">
        <el-alert
            style="height: 100%"
            title="IP 제한"
            type="info"
            description="승인되지 않은 IP 주소 입니다. 관리자에게 문의하세요"
            :closable="false"
            center
        />
    </div>
</template>
