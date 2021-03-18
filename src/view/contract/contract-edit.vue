<template>
  <div>
    <!-- 列表页面 -->
    <div class="container">
      <div class="header"><div class="title">编辑合同</div></div>
    </div>

    <el-row>
      <el-col :lg="20" :md="20" :sm="24" :xs="24">
        <el-form :model="form" status-icon ref="form" label-width="150px" @submit.native.prevent>
          <el-form-item label="合同日期">
            <el-date-picker v-model="form.contract_time" type="datetime" placeholder="Select date and time">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="delivery_time">
            <el-date-picker v-model="form.delivery_time" type="datetime" placeholder="Select date and time">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="client_id">
            <el-select v-model="form.client_id" placeholder="Select">
              <el-option v-for="item in clientOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="total_amount">
            <el-input v-model="form.total_amount"></el-input>
          </el-form-item>
          <el-form-item label="actual_delivery_fee">
            <el-input v-model="form.actual_delivery_fee"></el-input>
          </el-form-item>
          <el-form-item label="other_fee">
            <el-input v-model="form.other_fee"></el-input>
          </el-form-item>
          <el-form-item label="payment_method">
            <el-select v-model="form.payment_method" placeholder="Select">
              <el-option v-for="item in paymentMethodOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="notes">
            <el-input type="text" v-model="form.notes"></el-input>
          </el-form-item>
          <el-form-item label="payment_status">
            <el-select v-model="form.payment_status" allow-create placeholder="Select">
              <el-option v-for="item in paymentStatusOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <el-input
              v-if="form.payment_status === '支付预付款'"
              v-model="form.prepay_amount"
              placeholder="输入预付款金额"
            ></el-input>
            <el-input
              v-if="form.payment_status === '其他'"
              v-model="form.prepay_amount"
              placeholder="填写备注"
            ></el-input>
          </el-form-item>
          <el-form-item label="raw_cost">
            <el-input v-model="form.raw_cost"></el-input>
          </el-form-item>
          <el-form-item label="关联产品">
            <el-card class="box-card">
              <div class="productRow" v-for="(spuItem, index) in form.spuIds" :key="index">
                <el-select v-model="spuItem.spuId" placeholder="Select">
                  <el-option v-for="item in spuOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div>
                <el-button @click="handleProductRowAdd">新增产品</el-button>
              </div>
            </el-card>
          </el-form-item>
          <el-form-item style="padding-bottom: 50px">
            <el-button type="primary" v-on:click="handleContractAdd" :loading="loading">确定修改合同</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import client from '@/model/client'
import product from '@/model/product'
import contract from '@/model/contract'

export default {
  components: {},
  async created() {
    await this.getClients()
    await this.getSpus()
    const contractId = this.$router.history.current.query.id
    this.editId = contractId
    await this.initForEdit()
    console.log('finish getting client')
  },
  methods: {
    async initForEdit() {
      const res = await contract.getDetail(this.editId)
      this.form = {
        ...res,
        spuIds: res.spu_ids.map(id => ({
          spuId: id,
        })),
      }
    },
    async handleContractAdd() {
      this.loading = true
      const data = {
        ...this.form,
        spu_ids: this.form.spuIds.map(item => item.spuId),
      }

      console.log('dorm is ', data)
      await contract.update(this.editId, data)
      this.loading = false
      this.$router.back()
      console.log('data to send to backend is', data)
    },
    async getSpus() {
      const res = await product.getProducts()
      this.spuOptions = res.map(item => ({
        label: item.spu_name,
        value: item.id,
      }))
    },
    async getClients() {
      const res = await client.list()
      this.clientOptions = res.map(item => ({
        value: item.id,
        label: item.client_name,
      }))
      console.log('this.clientOptions', this.clientOptions)
    },
    handleProductRowAdd() {
      this.form.spuIds = [...this.form.spuIds, { spuId: null }]
    },
  },
  data() {
    return {
      editId: 0,
      loading: false,
      spuOptions: [],
      clientOptions: [],
      paymentStatusOptions: [
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
      paymentMethodOptions: [
        {
          value: '阿里信保',
          label: '阿里信保',
        },
        {
          value: '美金账户',
          label: '美金账户',
        },
        {
          value: 'PayPal',
          label: 'PayPal',
        },
        {
          value: '人民币私账',
          label: '人民币私账',
        },
        {
          value: '1688',
          label: '1688',
        },
      ],
      form: {
        contract_time: new Date(),
        delivery_time: new Date(),
        client_id: null,
        total_amount: 888,
        actual_delivery_fee: 999,
        prepay_amount: null,
        other_fee: 999,
        payment_method: '',
        notes: '',
        payment_status: '',
        raw_cost: 777,
        review_status: '',
        spuIds: [],
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
