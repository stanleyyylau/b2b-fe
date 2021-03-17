<template>
  <div>
    <!-- 列表页面 -->
    <div class="container">
      <div class="header"><div class="title">我的合同</div></div>

      <!-- 表格 -->
      <lin-table
        :tableColumn="tableColumn"
        :tableData="tableData"
        :operate="operate"
        @handleEdit="handleEdit"
        @handleDelete="handleDelete"
        @row-click="rowClick"
        v-loading="loading"
      ></lin-table>
    </div>
  </div>
</template>

<script>
import LinTable from '@/component/base/table/lin-table'
import contract from '@/model/contract'

export default {
  components: {
    LinTable,
  },
  async created() {
    this.loading = true
    await this.getContract()
    this.operate = [
      { name: '编辑', func: 'handleEdit', type: 'primary' },
      {
        name: '删除',
        func: 'handleDelete',
        type: 'danger',
        permission: '删除图书',
      },
    ]
    this.loading = false
  },
  methods: {
    handleEdit(val) {
      console.log('val', val)
      const editBookID = val.row.id
      this.$router.push({
        path: '/contract/edit',
        query: {
          id: editBookID,
        },
      })
    },
    async getContract() {
      const res = await contract.list()
      this.tableData = res
    },
    handleDelete(val) {
      this.$confirm('此操作将永久删除该合同, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await contract.delete(val.row.id)
        if (res.code < window.MAX_SUCCESS_CODE) {
          await this.getContract()
          this.$message({
            type: 'success',
            message: `${res.message}`,
          })
        }
      })
    },
  },
  data() {
    return {
      tableColumn: [
        { prop: 'contract_time', label: '合同日期' },
        { prop: 'delivery_time', label: '交期' },
        { prop: 'total_amount', label: '总金额' },
        { prop: 'actual_delivery_fee', label: '实际运费' },
        { prop: 'payment_method', label: '付款方式' },
        { prop: 'payment_status', label: '付款状态' },
        { prop: 'raw_cost', label: '成本' },
        { prop: 'review_status', label: '审核状态' },
        { prop: 'client_id', label: '客户ID' },
      ],
      tableData: [],
      operate: [],
      showEdit: false,
      editBookID: 1,
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 30px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      height: 59px;
      line-height: 59px;
      color: $parent-title-color;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }
}
</style>
