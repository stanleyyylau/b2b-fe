<template>
  <div>
    <!-- 列表页面 -->
    <div class="container">
      <div class="header">
        <div class="title">新增产品属性</div>
      </div>
      <attrFrom :loading="loading" @addOrUpdate="handleSubmit" />
    </div>
  </div>
</template>

<script>
import attribute from '@/model/attribute'
import attrFrom from './attr-form'

export default {
  components: {
    attrFrom,
  },
  async created() {
    await this.getAttrGroupsOptions()
    this.form.attr_group_id = Number(this.$router.history.current.query.groupId)
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    async getAttrGroupsOptions() {
      const res = await attribute.getAttrGroups()
      this.attrGroupOptions = res.map(attr => ({
        value: attr.id,
        label: attr.attr_group_name,
      }))
      this.form.attr_group_id = this.attrGroupOptions[0].value
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    async handleSubmit(data) {
      try {
        this.loading = true
        // const data = { ...this.form }
        // data.value_select = data.value_select.replaceAll(/\n/g, ',')
        const res = await attribute.createAttr(data)
        this.loading = false
        // console.log(this.form, formName)
        if (res.code < window.MAX_SUCCESS_CODE) {
          this.$message.success(`${res.message}`)
          // this.resetForm(formName)
        }
      } catch (error) {
        this.loading = false
        this.$message.error('属性添加失败，请检测填写信息')
        console.log(error)
      }
    },
  },
  data() {
    return {
      loading: false,
      tableColumn: [
        {
          prop: 'name',
          label: '分类名称',
        },
      ],
      attrGroupOptions: [],
      form: {
        attr_name: '',
        attr_group_id: '0',
        attr_type: '0',
        value_select: '',
      },
      tableData: [],
      operate: [
        {
          name: '新增子分类',
          func: 'handleAddChild',
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
