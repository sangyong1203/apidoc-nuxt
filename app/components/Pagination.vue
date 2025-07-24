<template>
    <div class="pagination">
        <el-pagination
            :current-page="page"
            :page-size="rowSize"
            :page-sizes="options"
            :background="true"
            :total="totalRow"
            layout=" sizes, prev, pager, next, jumper"
            @current-change="handleCurrentChange "
            @size-change="handleSizeChange"
            />
    </div>
</template>

<script setup lang="ts">
import { toRefs} from 'vue'
import { ElPagination} from 'element-plus'

export interface Props {
    totalRow: number // 현재 총 data 로우 수
    page: number //현재 페이지 번호
    rowSize: number //페이징 로우, 매페이지 로우 수
}
const props = defineProps<Props>()
const { totalRow, page,  rowSize } = toRefs(props)

const options = [10, 15, 20, 30, 50, 100, 200]
const emit = defineEmits(['current-change', 'size-change'])

// 페이징 로우  변할때 이밴트
const handleSizeChange = (val: number) => {
    emit('size-change', val)
}

// 현재 페이지 번호 변할때 이밴트
const handleCurrentChange  = (val: number) => {
    emit('current-change', val)
}
</script>

<style scoped>
.pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 16px;
    margin-bottom: 16px;
    width: 100%;
}
.pagination__select-box {
    padding: 8px 16px;
    margin-right: 20px;
    border-radius: 3px;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    -ms-appearance: none;
    background-position: calc(100% - 12px) center !important;
    background: url("data:image/svg+xml,<svg height='10px' width='10px' viewBox='0 0 16 16' fill='%23000000' xmlns='http://www.w3.org/2000/svg'><path d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/></svg>")
        no-repeat;
    padding: 8px 32px 8px 16px;
}
:deep(.el-pager li){
    --el-pagination-button-bg-color: none;
}
:deep(.el-pagination.is-background .btn-prev),
:deep(.el-pagination.is-background .btn-next){
    --el-pagination-button-bg-color: none;
}
:deep(.el-pagination.is-background .btn-prev:disabled),
:deep(.el-pagination.is-background .btn-next:disabled)
{
    --el-disabled-bg-color: none; 
}
:deep(.el-pagination .el-select){
    width: 145px;
}
</style>
