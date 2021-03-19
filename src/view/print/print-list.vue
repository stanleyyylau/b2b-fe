<template>
  <div>
    <!-- 列表页面 -->
    <div class="container">
      <div class="header">
        <div class="title">模版列表</div>
        <div class="right">
          <el-button @click="onNewTemplateClick">新建模版</el-button>
        </div>
      </div>
      <!-- 表格 -->
      <lin-table
        :tableColumn="tableColumn"
        :tableData="tableData"
        :operate="operate"
        @handleEdit="handleEdit"
        @handleDelete="handleDelete"
        v-loading="loading"
      ></lin-table>
    </div>
  </div>
</template>

<script>
import contract from '@/model/contract'
import book from '@/model/book'
import LinTable from '@/component/base/table/lin-table'

export default {
  created() {
    this.fetchData()
  },
  data() {
    return {
      tableColumn: [{ prop: 'id', label: '模版ID' }, { prop: 'template_name', label: '模版名' }],
      loading: false,
      tableData: [],
      operate: [
        { name: '编辑', func: 'handleEdit', type: 'primary' },
        {
          name: '删除',
          func: 'handleDelete',
          type: 'danger',
          permission: '删除图书',
        },
      ],
    }
  },
  methods: {
    onNewTemplateClick() {
      this.$router.push({ path: '/printCreate' })
    },
    async fetchData() {
      this.loading = true
      const res = await contract.listTpl()
      this.tableData = res
      this.loading = false
    },
    handleEdit(val) {
      console.log('val', val)
      this.showEdit = true
      this.editBookID = val.row.id
      this.$router.push({
        path: '/printEdit',
        query: {
          id: val.row.id,
        },
      })
    },
    handleDelete(val) {
      this.$confirm('此操作将永久删除该图书, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await book.deleteBook(val.row.id)
        if (res.code < window.MAX_SUCCESS_CODE) {
          this.getBooks()
          this.$message({
            type: 'success',
            message: `${res.message}`,
          })
        }
      })
    },
  },
  components: {
    LinTable,
  },
}
</script>

<style lang="scss">
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
