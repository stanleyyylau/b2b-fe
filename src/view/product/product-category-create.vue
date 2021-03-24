<template>
  <div>
    <!-- 列表页面 -->
    <div class="container">
      <div class="header">
        <div class="title">新增产品类目</div>
      </div>
      <el-row>
        <el-col :lg="16" :md="20" :sm="24" :xs="24">
          <el-form :model="form" status-icon ref="form" label-width="100px" @submit.native.prevent>
            <el-form-item label="分类名" prop="categoryName">
              <el-input size="medium" placeholder="输入分类名字" v-model="form.categoryName"></el-input>
            </el-form-item>
            <el-form-item label="上级分类" prop="parentCatId">
              <el-select v-model="form.parentCatId" placeholder="选择上级分类">
                <el-option v-for="item in catOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="submit">
              <el-button type="primary" @click.native.prevent.stop="handleAddCategory('form')" :loading="loading"
                >确认添加
              </el-button>
              <!--              <el-button @click="resetForm('form')">重 置</el-button>-->
              <el-button @click="goBack">返回</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import category from '@/model/category'

export default {
  components: {},
  async created() {
    await this.getTopLevelCates()
    this.loading = false
    console.log('runn created')
    this.form.parentCatId = 'bruce lee'
    console.log(this.$router)
    this.form.parentCatId = this.findLabelByCateId(this.$router.history.current.query.parentId)
    this.form.parentCatId = Number(this.$router.history.current.query.parentId)
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    findLabelByCateId(id) {
      console.log(id, this.catOptions)
      const match = this.catOptions.filter(cate => cate.value === Number(id))
      if (match.length > 0) {
        return match[0].label
      }
      throw new Error(`findLabelByCateId error with id ${id}`)
    },
    async getTopLevelCates() {
      try {
        const cates = await category.getTopLevelCategories()

        // transform to cat options
        const optionsFromServer = cates.map(cat => ({
          value: cat.id,
          label: cat.name,
        }))
        console.log('options from server')
        console.log(optionsFromServer)
        const fullOptions = [{ value: 0, label: '无' }].concat(optionsFromServer)
        this.catOptions = fullOptions
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
    async handleAddCategory(formName) {
      try {
        this.loading = true
        const res = await category.createCategory(this.form.categoryName, this.form.parentCatId)
        this.loading = false
        if (res.code < window.MAX_SUCCESS_CODE) {
          this.$message.success(`${res.message}`)
          this.resetForm(formName)
        }
      } catch (error) {
        this.loading = false
        this.$message.error('图书分类失败，请检测填写信息')
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
      catOptions: [],
      form: {
        categoryName: '',
        parentCatId: 0,
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
