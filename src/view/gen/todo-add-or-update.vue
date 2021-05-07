<template>
  <div>
    <!--    <el-row v-if="disalbedEdit"><el-button @click="back()">返回</el-button></el-row>-->
    <el-row v-loading="loadingForEdit">
      <el-col :lg="20" :md="20" :sm="24" :xs="24">
        <el-form
          :model="dataForm"
          :rules="dataRule"
          ref="dataForm"
          status-icon
          label-width="150px"
          @submit.native.prevent
        >
          <el-form-item label="归属人" prop="owned_by">
            <el-input v-model="dataForm.owned_by" placeholder="归属人"></el-input>
          </el-form-item>

          <el-form-item label="Todo 标题" prop="title">
            <el-input v-model="dataForm.title" placeholder="Todo 标题"></el-input>
          </el-form-item>

          <el-form-item label="预计完成日期" prop="expect_time">
            <el-date-picker type="date" v-model="dataForm.expect_time" placeholder="预计完成日期"></el-date-picker>
          </el-form-item>

          <el-form-item label="Todo 详情" prop="detail">
            <el-input type="textarea" v-model="dataForm.detail" placeholder="Todo 详情"></el-input>
          </el-form-item>

          <el-form-item label="Todo 标签" prop="todo_tag">
            <el-select
              filterable
              v-model="dataForm.todo_tag"
              placeholder="Todo 标签"
              :loading="fields[5].loading"
              :multiple="fields[5].multiple"
            >
              <el-option
                v-for="item in fields[5].options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="Todo 分类" prop="todo_cate">
            <el-select
              filterable
              v-model="dataForm.todo_cate"
              placeholder="Todo 分类"
              :loading="fields[6].loading"
              :multiple="fields[6].multiple"
            >
              <el-option
                v-for="item in fields[6].options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item style="padding-bottom: 50px">
            <el-button type="primary" v-on:click="dataFormSubmit" :loading="loading">{{
              editId === '0' ? '创建' : '更新'
            }}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import todoModel from '@/model/todoModel'

export default {
  props: {
    editId: {
      type: String,
    },
  },
  components: {},
  created() {
    this.initForm()
  },
  methods: {
    async initForm() {
      if (this.editId && this.editId !== '0') {
        this.loadingForEdit = true
        const formDetailRes = await todoModel.getDetail(this.editId)

        this.dataForm.id = formDetailRes.id
        this.dataForm.owned_by = formDetailRes.owned_by
        this.dataForm.title = formDetailRes.title
        this.dataForm.expect_time = formDetailRes.expect_time
        this.dataForm.detail = formDetailRes.detail
        this.dataForm.todo_tag = formDetailRes.todo_tag
        this.dataForm.todo_cate = formDetailRes.todo_cate

        this.loadingForEdit = false
      }
    },
    back() {
      this.$router.back()
    },
    async dataFormSubmit() {
      const isValid = await this.$refs.dataForm.validate()
      if (!isValid) return false
      const data = {
        ...this.dataForm,
      }
      this.loading = true
      try {
        if (this.editId === '0') {
          await todoModel.create(data)
        } else {
          await todoModel.update(this.editId, data)
        }
        this.$message('操作成功')
        this.back()
      } catch (e) {
        console.log(e)
      }
      this.loading = false
    },
  },
  data() {
    const dataFormRaw = {
      owned_by: {
        default: null,
      },
      title: {
        default: null,
      },
      expect_time: {
        default: null,
        type: 'Date',
      },
      detail: {
        default: '',
        rules: [
          {
            required: true,
            trigger: 'blur',
          },
        ],
      },
      todo_tag: {
        default: null,
      },
      todo_cate: {
        default: null,
      },
    }
    const computedForm = {}
    const computedRules = {}
    for (const dataFormKey in dataFormRaw) {
      computedForm[dataFormKey] = dataFormRaw[dataFormKey].default
      if (dataFormRaw[dataFormKey].type === 'Date') {
        computedForm[dataFormKey] = new Date()
      }
      if (dataFormRaw[dataFormKey].rules) {
        computedRules[dataFormKey] = [...dataFormRaw[dataFormKey].rules]
      }
    }
    return {
      dataForm: computedForm,
      dataRule: computedRules,
      loadingForEdit: false,
      loading: false, // add/update button loading
      fields: [
        {
          name: 'id',
          displayName: 'id',
          isShow: false,
          sortable: true,
        },
        {
          name: 'owned_by',
          isSearchField: true,
          displayName: '归属人',
          isShow: true,
          sortable: false,
          type: 'Connect',
          isLoading: true,
          options: [
            {
              value: 'Stanley',
              label: '1',
            },
            {
              value: 'Steve Jobs',
              label: '2',
            },
            {
              value: 'Gordon',
              label: '3',
            },
          ],
        },
        {
          name: 'title',
          isSearchField: true,
          displayName: 'Todo 标题',
          isShow: true,
          sortable: true,
          type: 'String',
        },
        {
          name: 'expect_time',
          displayName: '预计完成日期',
          isShow: true,
          sortable: true,
          type: 'Date',
        },
        {
          name: 'detail',
          displayName: 'Todo 详情',
          isShow: true,
          sortable: true,
          default: '',
          type: 'Text',
          rules: [
            {
              required: true,
              trigger: 'blur',
            },
          ],
        },
        {
          name: 'todo_tag',
          isSearchField: true,
          displayName: 'Todo 标签',
          isShow: true,
          type: 'Enum',
          multiple: false,
          options: [
            {
              value: '未开始',
              label: '未开始',
            },
            {
              value: '已完成',
              label: '已完成',
            },
            {
              value: '进行中',
              label: '进行中',
            },
          ],
        },
        {
          name: 'todo_cate',
          isSearchField: true,
          displayName: 'Todo 分类',
          isShow: true,
          multiple: true,
          type: 'Enum',
          options: [
            {
              value: '1',
              label: '口罩',
            },
            {
              value: '2',
              label: '幕布',
            },
            {
              value: '3',
              label: '投影仪',
            },
          ],
        },
      ],
    }
  },
  computed: {
    isAdd() {
      return this.editId === '0'
    },
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

  .productRow {
    display: flex;
  }

  .el-input-group__append,
  .el-input-group__prepend {
    background: #a5acbb !important;
    border: 1px solid #a5acbb !important;
    color: #fff;
  }
  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }
}
</style>
