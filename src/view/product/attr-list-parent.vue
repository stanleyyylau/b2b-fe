<template>
  <div>
    <!-- 列表页面 -->
    <div class="container">
      <div class="header">
        <div class="title">分组属性</div>
        <div class="operation">
          <el-button type="primary" @click.native.prevent.stop="createAttr">新增</el-button>
          <el-button @click.native.prevent.stop="goBack">返回</el-button>
        </div>
      </div>
      <lin-table
        :tableColumn="tableColumn"
        :tableData="tableData"
        :operate="operate"
        @goToGroupEditPage="handleAddChild"
        @handleEdit="handleEdit"
        @handleDelete="handleDelete"
        @row-click="rowClick"
        v-loading="loading"
      ></lin-table>
    </div>
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
    this.attrGroupId = Number(this.$router.history.current.query.id)
    await this.fetchData()
    this.loading = false
  },
  methods: {
    createAttr() {
      this.$router.push({
        path: '/attr/add',
        query: {
          groupId: this.attrGroupId,
        },
      })
    },
    async handleEdit(scope) {
      // this.editAttrId = scope.row.id
      // const res = await attribute.getAttrsById(this.editAttrId)
      // console.log(res, 'res')
      // console.log(scope)
      this.$router.push({
        path: '/attr/edit',
        query: {
          groupId: this.attrGroupId,
          id: scope.row.id,
        },
      })
    },
    async handleDelete(scope) {
      this.$confirm('此操作将永久删除该属性, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await attribute.delete(scope.row.id)
        if (res.code < window.MAX_SUCCESS_CODE) {
          this.fetchData()
          this.$message({
            type: 'success',
            message: `${res.message}`,
          })
        }
      })
    },
    goBack() {
      this.$router.back()
    },
    async fetchData() {
      const res = await attribute.getAttrsByGroupId(this.attrGroupId)
      this.tableData = res
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleAddChild() {
      this.$router.push('/attr/add')
    },
  },
  computed: {
    showDialog() {
      return this.editAttrId !== 0
    },
  },
  data() {
    return {
      attrGroupOptions: [],
      attrGroupId: 0,
      editAttrId: 0,
      tableColumn: [
        {
          prop: 'attr_name',
          label: '属性名称',
        },
        {
          prop: 'value_list',
          label: '属性值',
        },
      ],
      tableData: [],
      operate: [
        {
          name: '编辑',
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
      form: {
        attr_name: '',
        attr_type: '',
        value_select: '',
      },
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
