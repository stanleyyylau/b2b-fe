<template>
  <div>
    <!-- 列表页面 -->
    <div class="container">
      <div class="header">
        <div class="title">产品分类</div>
        <div class="operation">
          <el-button type="primary" @click.native.prevent.stop="addCategory(0)">新增大类目</el-button>
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
    await this.getTopLevelCates()
    this.loading = false
  },
  methods: {
    async rowClick(val) {
      console.log('row clicked', val)
      this.$router.push({ path: '/productCat/sublist', query: { parentId: val.row.id } })
    },
    async getTopLevelCates() {
      try {
        const cates = await category.getTopLevelCategories()
        this.tableData = cates
      } catch (error) {
        if (error.code === 10020) {
          this.tableData = []
        }
      }
    },
    addCategory(parentId) {
      this.$router.push({ path: '/productCat/add', query: { parentId } })
    },
    handleAddChild(val) {
      this.$router.push({ path: '/productCat/add', query: { parentId: val.row.id } })
    },
  },
  data() {
    return {
      tableColumn: [{ prop: 'name', label: '分类名称' }],
      tableData: [],
      operate: [
        {
          name: '新增子分类',
          func: 'goToGroupEditPage',
          type: 'primary',
        },
        {
          name: '浏览',
          func: 'handleView',
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
