<template>
  <div>
    <!--    <el-row v-if="disalbedEdit"><el-button @click="back()">返回</el-button></el-row>-->
    <el-row v-loading="loadingForEdit">
      <el-col :lg="20" :md="20" :sm="24" :xs="24">
        <el-form
          :model="form"
          status-icon
          ref="form"
          :rules="dataRule"
          label-width="150px"
          @submit.native.prevent
          :disabled="disalbedEdit"
        >
          <el-form-item label="合同日期" prop="contract_time">
            <el-date-picker type="date" v-model="form.contract_time" placeholder="Select date and time">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="交货日期" prop="delivery_time">
            <el-date-picker type="date" v-model="form.delivery_time" placeholder="Select date and time">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="客户" prop="client_id">
            <el-select filterable v-model="form.client_id" placeholder="Select" :loading="clientLoading">
              <el-option v-for="item in clientOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收货地址" prop="delivery_address">
            <el-input v-model="form.delivery_address" placeholder="如不填，则直接显示客户登记地址"></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="8">
              <el-form-item label="总金额(USD)" prop="total_amount">
                <el-input v-model="form.total_amount"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="客付运费(USD)" prop="shipping_cost">
                <el-input v-model="form.shipping_cost"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="additional_cost" label="额外费用(USD)">
                <el-input v-model="form.additional_cost"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item prop="transaction_fee" label="手续费(USD)">
                <el-input v-model="form.transaction_fee"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="insurance_cost" label="保险费(USD)">
                <el-input v-model="form.insurance_cost"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="actual_delivery_fee" label="支出运费(RMB)">
                <el-input v-model="form.actual_delivery_fee"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="other_fee" label="其他费用(RMB)">
                <el-input v-model="form.other_fee" placeholder="除运费外的支出"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="Terms" prop="terms_of_sale">
            <el-select multiple v-model="form.terms_of_sale" placeholder="Select">
              <el-option v-for="item in termOfSale" :key="item.value" :label="item.value" :value="item.value">
              </el-option>
            </el-select>
            <!--            <el-input v-model="form.terms_of_sale"></el-input>-->
          </el-form-item>
          <el-form-item label="付款方式" prop="payment_method">
            <el-select v-model="form.payment_method" placeholder="Select">
              <el-option v-for="item in paymentMethodOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="付款状态" prop="payment_status">
            <el-select v-model="form.payment_status" allow-create placeholder="Select">
              <el-option v-for="item in paymentStatusOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <el-form-item
              :required="form.payment_status === '支付预付款'"
              prop="prepay_amount"
              v-if="form.payment_status === '支付预付款'"
            >
              <el-input v-model="form.prepay_amount" placeholder="输入预付款金额"
                ><template slot="append"
                  >USD</template
                ></el-input
              >
            </el-form-item>
            <!-- <el-input
              v-if="form.payment_status === '其他'"
              v-model="form.notes"
              placeholder="填写备注"
            ></el-input> -->
            <div v-if="form.review_status === '审核中'">
              <span>Holly 审核中</span>
            </div>
            <div v-else>
              <el-checkbox v-if="showSubmitForReview" v-model="submitForReview">提交给 Holly 审核 </el-checkbox>
            </div>
          </el-form-item>
          <el-form-item label="备注" prop="notes">
            <el-input type="text" v-model="form.notes" placeholder="请输入备注"></el-input>
          </el-form-item>
          <el-form-item label="成本价" prop="raw_cost">
            <el-input v-model="form.raw_cost" :disabled="!isAdmin"></el-input>
          </el-form-item>
          <el-form-item label="审核状态" v-if="isAdmin">
            <el-select v-model="form.review_status" placeholder="Select">
              <el-option v-for="item in review_statusOption" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关联产品" prop="skus">
            <el-card class="box-card">
              <el-table :data="form.skus" style="width: 100%">
                <el-table-column label="sku" width="180">
                  <template slot-scope="scope">
                    <el-form-item required :prop="`skus[${scope.$index}].spu_sku`">
                      <el-cascader
                        filterable
                        v-model="scope.row.spu_sku"
                        :options="spuOptions"
                        @change="handleSkuSelect(scope.$index)"
                      >
                      </el-cascader>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="价格区间" width="180" prop="priceRangeStr"> </el-table-column>
                <el-table-column label="quantity" width="180">
                  <template slot-scope="scope">
                    <el-form-item :prop="`skus[${scope.$index}].quantity`" :rules="getIntegerValidRules()">
                      <el-input
                        v-model="scope.row.quantity"
                        placeholder="quantity"
                        @change="onQuantityChange(scope.$index)"
                      >
                        <template slot="append"
                          >PCS</template
                        >
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="建议零售价" width="180" prop="calculatedUnitPrice">
                  <template slot-scope="scope">
                    <el-form-item>
                      <div>
                        {{ scope.row.calculatedUnitPrice }}
                      </div>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="discount" width="180">
                  <template slot-scope="scope">
                    <el-form-item :prop="`skus[${scope.$index}].discount`" :rules="getDiscountValidRules()">
                      <el-input
                        v-model="scope.row.discount"
                        placeholder="0.85"
                        @change="handleDiscount(scope.$index)"
                      ></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="最终价格" width="180">
                  <template slot-scope="scope">
                    <el-form-item :prop="`skus[${scope.$index}].unit_price`" :rules="getPriceValidRules()">
                      <el-input v-model="scope.row.unit_price">
                        <template slot="append"
                          >USD</template
                        >
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="特殊需求" width="180">
                  <template slot-scope="scope">
                    <el-form-item>
                      <el-input v-model="scope.row.special_request" placeholder="special_request"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="180">
                  <template slot-scope="scope">
                    <el-form-item>
                      <el-button @click="deleteSku(scope.$index)">删除</el-button>
                    </el-form-item>
                  </template>
                </el-table-column>
              </el-table>
              <div>
                <el-button @click="handleProductRowAdd">新增产品</el-button>
              </div>
            </el-card>
          </el-form-item>
          <el-form-item style="padding-bottom: 50px">
            <el-button type="primary" v-on:click="handleContractAdd" :loading="loading">{{
              editId === '0' ? '新增合同' : '修改合同'
            }}</el-button>
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
import { integerValidatorRules, priceNumValidatorRules } from '@/util/common'

export default {
  priceNumValidatorRules,
  props: {
    editId: {
      type: String,
    },
  },
  components: {},
  async created() {
    if (this.isAdd) {
      console.log('hihi')
      return
    }
    this.loadingForEdit = true
    this.getClients()
    await this.getSpus()
    console.log('hihi')
    this.isAdmin = Boolean(this.$router.history.current.query.admin) || false
    if (this.editId && this.editId !== 0) {
      await this.getContractDetail(this.editId)
    }
    console.log('finish getting client')
    window.contract = this
    this.loadingForEdit = false
  },
  methods: {
    back() {
      this.$router.back()
    },
    getPriceValidRules() {
      return priceNumValidatorRules
    },
    getIntegerValidRules() {
      return integerValidatorRules
    },
    getDiscountValidRules() {
      return [
        {
          type: 'string',
          message: '选填,请输入数字',
          pattern: /^[0-9]+(\.[0-9]{1,9})?$/,
        },
      ]
    },
    async getContractDetail(id) {
      const res = await contract.getDetail(id)
      this.submitForReview = res.review_status === '审核中'
      for (const key in res) {
        if (typeof res[key] === 'number') {
          res[key] = String(res[key])
        }
      }
      this.form = {
        ...res,
        terms_of_sale: res.terms_of_sale.split(','),
        reviewStatus: res.review_status,
        skus: res.skus.map(sku => ({
          spu_sku: [sku.spu_id, sku.sku_id],
          quantity: String(sku.quantity),
          unit_price: String(sku.price),
          calculatedUnitPrice: '',
          priceRangeStr: '',
          priceList: [],
          special_request: sku.special_request,
          discount: null,
        })),
      }
    },
    async handleContractAdd() {
      const isValid = await this.$refs.form.validate()
      if (!isValid) return false
      this.loading = true
      const data = {
        ...this.form,
        terms_of_sale: this.form.terms_of_sale.join(','),
        // eslint-disable-next-line no-nested-ternary
        review_status: this.showSubmitForReview ? (this.submitForReview ? '审核中' : null) : this.form.review_status,
        skus: this.form.skus.map(item => ({
          spu_id: item.spu_sku[0],
          sku_id: item.spu_sku[1],
          price: Number(item.unit_price),
          quantity: Number(item.quantity),
          special_request: item.special_request,
        })),
      }

      console.log('data to send to backend is', data)
      this.$emit('addOrUpdate', data)
    },
    async getSpus() {
      const res = await product.getProducts()
      const skuList = await product.getSkus()
      this.spuOptions = res.map(item => ({
        label: item.spu_name,
        value: item.id,
        children: skuList
          .filter(sku => sku.spu_id === item.id)
          .map(match => ({
            label: match.sku_name,
            value: match.id,
          })),
      }))
    },
    async handleSkuSelect(skuIndex) {
      console.log('index is', skuIndex)
      const sku = this.form.skus[skuIndex].spu_sku[1]
      console.log('sku selected is', sku)
      const priceInfo = await product.getSkuPriceInfoBySkuId(sku)
      console.log(priceInfo)
      let priceRangeStr = ''
      priceInfo.map(price => {
        priceRangeStr = `${priceRangeStr === '' ? priceRangeStr : `${priceRangeStr}, `}${price.start_count} ~ ${
          price.end_count
        }: ${price.price}USD`
        return ''
      })
      this.form.skus[skuIndex].priceRangeStr = priceRangeStr
      this.form.skus[skuIndex].priceList = priceInfo
    },
    async getClients() {
      this.clientLoading = true
      const res = await client.list()
      this.clientOptions = res.map(item => ({
        value: String(item.id),
        label: item.client_name,
      }))
      this.clientLoading = false
      console.log('this.clientOptions', this.clientOptions)
    },
    deleteSku(index) {
      const skuLIst = [...this.form.skus]
      skuLIst.splice(index, 1)
      this.form.skus = [...skuLIst]
    },
    handleDiscount(index) {
      const realPrice = this.form.skus[index].calculatedUnitPrice
      const discountPrice = Number(realPrice) * Number(this.form.skus[index].discount)
      this.form.skus[index].unit_price = String(discountPrice)
    },
    onQuantityChange(index) {
      console.log('eee')
      const quantity = Number(this.form.skus[index].quantity)
      let realPrice = null
      this.form.skus[index].priceList.map(price => {
        console.log('hihihi')
        if (Number(price.start_count) < quantity && quantity < Number(price.end_count)) {
          realPrice = price.price
        }
        return ''
      })
      this.form.skus[index].calculatedUnitPrice = realPrice
    },
    handleProductRowAdd() {
      this.form.skus = [
        ...this.form.skus,
        {
          spu_sku: [],
          quantity: '',
          unit_price: '',
          calculatedUnitPrice: '',
          priceRangeStr: '',
          priceList: [],
          special_request: '',
          discount: null,
        },
      ]
    },
  },
  data() {
    const dataForm = {
      delivery_address: {
        default: '',
      },
      shipping_cost: {
        default: '',
        rules: [
          {
            required: true,
            message: '请输入金额, 最多两个小数点',
            trigger: 'blur',
            type: 'string',
            pattern: /^[0-9]+(\.[0-9]{1,2})?$/,
          },
        ],
      },
      transaction_fee: {
        default: '',
        rules: [{ pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: '请输入金额, 最多两个小数点', trigger: 'blur' }],
      },
      terms_of_sale: {
        default: '',
        rules: [{ required: true, trigger: 'blur' }],
      },
      insurance_cost: {
        default: '',
        rules: [
          {
            message: '请输入金额, 最多两个小数点',
            trigger: 'blur',
            type: 'string',
            pattern: /^[0-9]+(\.[0-9]{1,2})?$/,
          },
        ],
      },
      additional_cost: {
        default: '',
        rules: [
          {
            message: '请输入金额, 最多两个小数点',
            trigger: 'blur',
            type: 'string',
            pattern: /^[0-9]+(\.[0-9]{1,2})?$/,
          },
        ],
      },
      contract_time: {
        default: new Date(),
        rules: [{ required: true, trigger: 'blur' }],
      },
      delivery_time: {
        default: new Date(),
        rules: [{ required: true, trigger: 'blur' }],
      },
      client_id: {
        default: null,
        rules: [{ required: true, trigger: 'blur' }],
      },
      total_amount: {
        default: '',
        rules: [
          {
            required: true,
            message: '请输入总金额',
            trigger: 'blur',
            type: 'string',
            pattern: /^[0-9]+(\.[0-9]{1,2})?$/,
          },
        ],
      },
      actual_delivery_fee: {
        default: '',
        rules: [
          {
            message: '请输入金额, 最多两个小数点',
            trigger: 'blur',
            type: 'string',
            pattern: /^[0-9]+(\.[0-9]{1,2})?$/,
          },
        ],
      },
      prepay_amount: {
        default: null,
        rules: [
          {
            message: '请输入金额, 最多两个小数点',
            trigger: 'blur',
            type: 'string',
            pattern: /^[0-9]+(\.[0-9]{1,2})?$/,
          },
        ],
      },
      other_fee: {
        default: '',
        rules: [
          {
            message: '请输入金额, 最多两个小数点',
            trigger: 'blur',
            type: 'string',
            pattern: /^[0-9]+(\.[0-9]{1,2})?$/,
          },
        ],
      },
      payment_method: {
        default: '',
        rules: [{ required: true, trigger: 'blur' }],
      },
      notes: {
        default: '',
      },
      payment_status: {
        default: '',
        rules: [{ required: true, trigger: 'blur' }],
      },
      raw_cost: {
        default: '',
        rules: [
          {
            message: '请输入金额, 最多两个小数点',
            trigger: 'blur',
            type: 'string',
            pattern: /^[0-9]+(\.[0-9]{1,2})?$/,
          },
        ],
      },
      review_status: {
        default: '',
      },
      skus: {
        default: [],
        rules: [
          {
            type: 'array',
            required: true,
            message: '关联产品不能为空',
          },
        ],
      },
    }
    const computedForm = {}
    const computedRules = {}
    for (const dataFormKey in dataForm) {
      console.log('comput')
      computedForm[dataFormKey] = dataForm[dataFormKey].default
      if (dataForm[dataFormKey].rules) {
        computedRules[dataFormKey] = [...dataForm[dataFormKey].rules]
      }
    }
    return {
      clientLoading: true,
      loadingForEdit: false,
      isAdmin: false,
      submitForReview: false,
      dataRule: computedRules,
      termOfSale: [
        {
          value: 'EXW',
        },
        {
          value: 'FOB',
        },
        {
          value: 'CIF',
        },
        {
          value: 'CNF',
        },
        {
          value: 'DAP',
        },
        {
          value: 'DDP',
        },
      ],
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
      review_statusOption: [
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
      form: computedForm,
      loading: false,
    }
  },
  computed: {
    showSubmitForReview() {
      if (!this.form) return false
      if (this.form.review_status) return false
      if (this.form.payment_status === '款项收齐') return true
      return false
    },
    disalbedEdit() {
      return this.editId !== 0 && this.form.review_status === '已审核'
    },
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
