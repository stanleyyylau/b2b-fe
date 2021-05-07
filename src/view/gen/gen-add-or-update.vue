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
          <el-form-item label="业务员" prop="owned_by">
            <el-input v-model="dataForm.owned_by" placeholder="业务员"></el-input>
          </el-form-item>

          <el-form-item label="合同时间" prop="contract_time">
            <el-date-picker type="date" v-model="dataForm.contract_time" placeholder="合同时间"></el-date-picker>
          </el-form-item>

          <el-form-item label="收货时间" prop="delivery_time">
            <el-date-picker type="date" v-model="dataForm.delivery_time" placeholder="收货时间"></el-date-picker>
          </el-form-item>

          <el-form-item label="总金额" prop="total_amount">
            <el-input v-model="dataForm.total_amount" placeholder="总金额"></el-input>
          </el-form-item>

          <el-form-item label="支付状态" prop="payment_status">
            <el-select
              filterable
              v-model="dataForm.payment_status"
              placeholder="支付状态"
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

          <el-form-item label="审核状态" prop="review_status">
            <el-select
              filterable
              v-model="dataForm.review_status"
              placeholder="审核状态"
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

          <el-form-item label="合同标签" prop="contract_tag">
            <el-select
              filterable
              v-model="dataForm.contract_tag"
              placeholder="合同标签"
              :loading="fields[7].loading"
              :multiple="fields[7].multiple"
            >
              <el-option
                v-for="item in fields[7].options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="合同分类" prop="contract_cate">
            <el-select
              filterable
              v-model="dataForm.contract_cate"
              placeholder="合同分类"
              :loading="fields[8].loading"
              :multiple="fields[8].multiple"
            >
              <el-option
                v-for="item in fields[8].options"
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
import contractModel from '@/model/contractModel'

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
        const formDetailRes = await contractModel.getDetail(this.editId)

        this.dataForm.id = formDetailRes.id
        this.dataForm.owned_by = formDetailRes.owned_by
        this.dataForm.contract_time = formDetailRes.contract_time
        this.dataForm.delivery_time = formDetailRes.delivery_time
        this.dataForm.total_amount = formDetailRes.total_amount
        this.dataForm.payment_status = formDetailRes.payment_status
        this.dataForm.review_status = formDetailRes.review_status
        this.dataForm.contract_tag = formDetailRes.contract_tag
        this.dataForm.contract_cate = formDetailRes.contract_cate
        this.dataForm.client_id = formDetailRes.client_id

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
          await contractModel.create(data)
        } else {
          await contractModel.update(this.editId, data)
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
      contract_time: {
        default: null,
        type: 'Date',
      },
      delivery_time: {
        default: null,
        type: 'Date',
      },
      total_amount: {
        default: '',
        rules: [
          {
            required: true,
            message: '请输入总金额',
            trigger: 'blur',
            type: 'string',
            pattern: {},
          },
        ],
      },
      payment_status: {
        default: null,
      },
      review_status: {
        default: null,
      },
      contract_tag: {
        default: null,
      },
      contract_cate: {
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
          displayName: '业务员',
          isShow: true,
          sortable: false,
        },
        {
          name: 'contract_time',
          displayName: '合同时间',
          isShow: true,
          sortable: true,
          type: 'Date',
        },
        {
          name: 'delivery_time',
          displayName: '收货时间',
          isShow: true,
          sortable: true,
          type: 'Date',
        },
        {
          name: 'total_amount',
          displayName: '总金额',
          isShow: true,
          sortable: true,
          default: '',
          rules: [
            {
              required: true,
              message: '请输入总金额',
              trigger: 'blur',
              type: 'string',
              pattern: {},
            },
          ],
        },
        {
          name: 'payment_status',
          displayName: '支付状态',
          isShow: true,
          sortable: true,
          type: 'Enum',
          options: [
            {
              value: '支付预付款',
              label: '支付预付款',
            },
            {
              value: '款项收齐',
              label: '款项收齐',
            },
            {
              value: '其他',
              label: '其他',
            },
          ],
        },
        {
          name: 'review_status',
          displayName: '审核状态',
          isShow: true,
          sortable: true,
          type: 'Enum',
          options: [
            {
              value: '已审核',
              label: '已审核',
            },
            {
              value: '拒绝',
              label: '拒绝',
            },
            {
              value: '审核中',
              label: '审核中',
            },
          ],
        },
        {
          name: 'contract_tag',
          displayName: '合同标签',
          isShow: true,
          type: 'Enum',
          multiple: true,
          options: [
            {
              value: '好合同',
              label: '好合同',
            },
            {
              value: '坏合同',
              label: '坏合同',
            },
            {
              value: '一般合同',
              label: '一般合同',
            },
          ],
        },
        {
          name: 'contract_cate',
          displayName: '合同分类',
          isShow: true,
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
        {
          name: 'client_id',
          displayName: '客户ID',
          isShow: false,
          sortable: true,
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
