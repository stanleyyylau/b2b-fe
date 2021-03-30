<template>
  <el-row>
    <el-col :lg="16" :md="20" :sm="24" :xs="24">
      <el-form :model="form" status-icon ref="form" label-width="100px" @submit.native.prevent>
        <el-form-item label="属性名" prop="attr_name">
          <el-input size="medium" placeholder="输入属性名字" v-model="form.attr_name"></el-input>
        </el-form-item>
        <el-form-item label="属性分组" prop="attr_group_id">
          <el-select v-model="form.attr_group_id" placeholder="选择所属分组">
            <el-option v-for="item in attrGroupOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="属性类型" prop="attr_type">
          <el-select v-model="form.attr_type" placeholder="选择属性类型">
            <el-option key="0" label="销售属性" value="0"></el-option>
            <el-option key="1" label="基本属性" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="属性值" prop="value_select">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 99 }"
            placeholder="输入属性值，一行一个"
            v-model="form.value_select"
          >
          </el-input>
        </el-form-item>
        <el-form-item class="submit">
          <el-button type="primary" @click.native.prevent.stop="handleSubmit('form')" :loading="loading"
            >{{ editId !== 0 ? '更新属性' : '新增属性' }}
          </el-button>
          <!--              <el-button @click="resetForm('form')">重 置</el-button>-->
          <el-button @click="goBack">返回</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
import attribute from '@/model/attribute'

export default {
  props: {
    editId: {
      type: Number,
      default: 0,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  components: {},
  async created() {
    await this.getAttrGroupsOptions()
    this.form.attr_group_id = Number(this.$router.history.current.query.groupId)
    if (this.editId && this.editId !== 0) {
      await this.getAttributeDetail(this.editId)
    }
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    async getAttributeDetail(id) {
      const res = await attribute.getAttrsById(id)
      console.log('attr res', res)
      this.form.attr_name = res.attr_name
      this.form.attr_type = String(res.attr_type)
      this.form.value_select = res.value_select.replaceAll(/,\s/g, '\n')
      this.form.value_select = this.form.value_select.replaceAll(/,/g, '\n')
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
    async handleSubmit(formName) {
      try {
        // this.loading = true
        const data = { ...this.form }
        data.value_select = data.value_select.replaceAll(/\n/g, ',')
        this.$emit('addOrUpdate', data)
        console.log('form name', formName)
        // const res = await attribute.createAttr(data)
        // this.loading = false
        // console.log(this.form, formName)
        // if (res.code < window.MAX_SUCCESS_CODE) {
        //   this.$message.success(`${res.message}`)
        //   this.resetForm(formName)
        // }
      } catch (error) {
        // this.loading = false
        this.$message.error('属性添加失败，请检测填写信息')
        console.log(error)
      }
    },
  },
  data() {
    return {
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
