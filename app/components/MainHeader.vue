<template>
  <el-header>
    <el-row>
      <el-col :span="14">
        <div class="header-left">
          <span class="title">
            <img class="title-logo" :src="logoUrl" v-if="logoUrl" />
            <span class="title-text" :style="titleStyle">{{ systemName }}</span>
            <slot></slot>
          </span>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="header-right">
          <ClientOnly>

            <CurrentTime label="현재시간" />
          </ClientOnly>
          <el-button type="primary" circle @click="logOut" class="logout">
            <el-icon><SwitchButton /></el-icon>
          </el-button>
          <el-button type="primary" circle @click="refresh" class="refresh">
            <el-icon><Refresh /></el-icon>
          </el-button>
        </div>
      </el-col>
    </el-row>
  </el-header>
</template>

<script lang="ts" setup>
import { Refresh, SwitchButton } from '@element-plus/icons-vue'
export interface MainHeaderProps {
  logoUrl?: string;
  systemName: string;
  titleStyle?: any;
}
const { systemName, logoUrl } = defineProps<MainHeaderProps>();

const emits = defineEmits(["logOut"]);

// 로그아웃
const logOut = () => {
  emits("logOut");
};
// 현재 화면 강제 리프레쉬
const refresh = () => {
  // location.reload();
};
</script>

<style scoped>
/* header  */
.el-header {
  height: 50px;
  background-color: var(--color-black);
  width: 100%;
  align-items: center;
  padding-left: 4px;
}
.el-row,
.el-col,
.header-left,
.header-right {
  height: 100%;
}

/* header left ------------ */
.header-left {
  display: flex;
  align-items: center;
  margin-left: 8px;
}
.header-left .colapse-btn {
  border: none;
  background-color: transparent;
  color: #dddddd;
  padding: 0 !important;
  margin-right: 20px;
}
:deep(.colapse-btn .el-icon),
:deep(.colapse-btn .el-icon svg) {
  height: 24px;
  width: 24px;
}
.header-left .title {
  color: #fff;
  font-size: 20px;
  text-decoration-line: none;
  text-decoration: none;
  display: flex;
  align-items: center;
}
.header-left .title-logo {
  height: 24px;
  margin-right: 12px;
}
.header-left .title-text {
  font-size: 20px;
  display: block;
  margin-top: 2px;
  margin-left: 4px;
}

/* header right ------------ */
.header-right {
  text-align: right;
  color: #fff;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.header-right .time {
  padding: 0 20px;
  font-weight: 500;
}
.header-right .time .time-lable {
  font-size: 17px;
}
.header-right .time .time-value {
  font-size: 18px;
}
.header-right .logout {
  margin-right: 4px;
  border: none;
  background-color: var(--color-main);
}
.header-right .logout:hover {
  text-decoration: underline;
  cursor: pointer;
}
.header-right .logout .el-icon {
  width: 18px;
  height: 18px;
  transform: rotate(90deg);
}
.header-right .logout .el-icon svg {
  width: 18px;
  height: 18px;
}
.header-right .refresh {
  background: var(--color-orange);
  border: none;
  margin-right: 8px;
}
.header-right .refresh .el-icon {
  width: 18px;
  height: 18px;
}
.header-right .refresh .el-icon svg {
  width: 18px;
  height: 18px;
}
</style>
