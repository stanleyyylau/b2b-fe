<template>
  <div>
    <!-- 列表页面 -->
    <div class="container">
      <div class="header">
        <div class="title">产品二级分类</div>
        <div class="operation">
          <el-button type="primary" @click.native.prevent.stop="addCategory">新增二级类目</el-button>
        </div>
      </div>
      <lin-table
        :tableColumn="tableColumn"
        :tableData="tableData"
        :operate="operate"
        @goToGroupEditPage="handleAddChild"
        @handleDelete="handleDelete"
        @handleView="rowClick"
        v-loading="loading"
      ></lin-table>
    </div>

    <!--edit dialog-->
    <el-dialog title="编辑分类名" :visible.sync="showEdit">
      <el-form :model="form">
        <el-form-item label="二级分类名">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEdit = false">Cancel</el-button>
        <el-button :disabled="form.name === ''" :loading="loading" type="primary" @click="handleCateEdit"
          >Confirm</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import category from '@/model/category'
import LinTable from '@/component/base/table/lin-table'

export default {
  components: {
    LinTable,
  },
  async created() {
    this.parentCateId = Number(this.$router.history.current.query.parentId)
    this.loading = true
    await this.getTopLevelCates()
    this.loading = false
  },
  methods: {
    async rowClick(val) {
      console.log('row clicked', val)
    },
    async getTopLevelCates() {
      try {
        const cates = await category.getByParentId(this.parentCateId)
        this.tableData = cates
      } catch (error) {
        if (error.code === 10020) {
          this.tableData = []
        }
      }
    },
    async handleDelete(val) {
      const { id } = val.row
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await category.deleteById(id)
        if (res.code < window.MAX_SUCCESS_CODE) {
          this.getTopLevelCates()
          this.$message({
            type: 'success',
            message: `${res.message}`,
          })
        }
      })
    },
    addCategory() {
      this.$router.push({ path: '/productCat/add', query: { parentId: String(this.parentCateId) } })
    },
    async handleAddChild(val) {
      this.showEdit = true
      console.log('编辑')
      this.editID = val.row.id
      const res = await category.getById(this.editID)
      this.form.name = res.name
      // this.$router.push({ path: '/productCat/add', query: { parentId: val.row.id } })
    },
    async handleCateEdit() {
      this.loading = true
      await category.updateById(this.editID, this.form.name)
      this.showEdit = false
      this.loading = false
      this.getTopLevelCates()
    },
  },
  data() {
    return {
      tableColumn: [{ prop: 'name', label: '分类名称' }],
      loading: false,
      tableData: [],
      form: {
        name: '',
      },
      operate: [
        {
          name: '编辑',
          func: 'goToGroupEditPage',
          type: 'primary',
        },
        {
          name: '删除',
          func: 'handleDelete',
          type: 'danger',
          permission: '删除图书',
        },
      ],
      showEdit: false,
      editID: 0,
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
