<template>
  <div>
    <!-- 列表页面 -->
    <div class="container">
      <div class="header">
        <div class="title">属性分组</div>
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
    LinTable
  },
  async created() {
    await this.getAttrGroups()
    this.loading = false
  },
  methods: {
    goBack() {
      this.$router.back()
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
    handleAddChild() {
      this.$router.push('/attr/add')
    }
  },
  data() {
    return {
      tableColumn: [
        {
          prop: 'attr_group_name',
          label: '属性组名称',
        },
      ],
      tableData: [],
      operate: [
        {
          name: '新增属性',
          func: 'goToGroupEditPage',
          type: 'primary',
        },
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
