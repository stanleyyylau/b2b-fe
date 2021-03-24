<template>
  <div>
    <!-- 列表页面 -->
    <div class="container">
      <div class="header">
        <div class="title">属性分组</div>
        <div class="operation">
          <el-button type="primary" @click.native.prevent.stop="addAttrGroup">新增属性分组</el-button>
        </div>
      </div>
      <lin-table
        :tableColumn="tableColumn"
        :tableData="tableData"
        :operate="operate"
        @goToGroupEditPage="handleAddChild"
        @handleEdit="handleEdit"
        @handleDelete="handleDelete"
        @selection-change="rowClick"
        v-loading="loading"
      ></lin-table>
    </div>

    <!--new group dialog-->
    <el-dialog title="新增属性分组" :visible.sync="showAttrGroup">
      <el-form :model="form">
        <el-form-item label="属性分组名">
          <el-input v-model="form.newGroupName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAttrGroup = false">Cancel</el-button>
        <el-button :disabled="form.newGroupName === ''" :loading="loading" type="primary" @click="handleGroupAdd"
          >Confirm</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import attribute from '@/model/attribute'
import LinTable from '@/component/base/table/lin-table'

export default {
  components: {
    LinTable,
  },
  async created() {
    await this.getAttrGroups()
    this.loading = false
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    addAttrGroup() {
      this.showAttrGroup = true
    },
    rowClick(val) {
      console.log('row click', val)
    },
    handleEdit(scope) {
      this.$router.push({
        path: '/attr/listByParent',
        query: {
          id: scope.row.id,
        },
      })
    },
    async handleDelete(scope) {
      const { id: groupId } = scope.row
      this.$confirm('此操作将永久删除该属性组, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await attribute.deleteAttrGroup(groupId)
        if (res.code < window.MAX_SUCCESS_CODE) {
          this.getAttrGroups()
          this.$message({
            type: 'success',
            message: `${res.message}`,
          })
        }
      })
    },
    async getAttrGroups() {
      try {
        const cates = await attribute.getAttrGroups()
        this.tableData = cates
      } catch (error) {
        if (error.code === 10020) {
          this.catOptions = []
        }
      }
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleAddChild(val) {
      this.$router.push({
        path: '/attr/add',
        query: {
          groupId: val.row.id,
        },
      })
    },
    async handleGroupAdd() {
      this.loading = true
      const res = await attribute.createGroup(this.form.newGroupName)
      this.$message({
        type: 'success',
        message: `${res.message}`,
      })
      this.form.newGroupName = ''
      this.loading = false
      this.showAttrGroup = false
      this.getAttrGroups()
    },
  },
  data() {
    return {
      loading: false,
      showAttrGroup: false,
      tableColumn: [
        {
          prop: 'attr_group_name',
          label: '属性组名称',
        },
      ],
      form: {
        newGroupName: '',
      },
      tableData: [],
      operate: [
        {
          name: '新增属性',
          func: 'goToGroupEditPage',
          type: 'primary',
        },
        {
          name: '浏览',
          func: 'handleEdit',
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
