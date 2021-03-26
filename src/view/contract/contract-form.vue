<template>
  <div>
    <el-row>
      <el-col :lg="20" :md="20" :sm="24" :xs="24">
        <el-form :model="form" status-icon ref="form" label-width="150px" @submit.native.prevent>
          <el-form-item label="合同日期">
            <el-date-picker v-model="form.contract_time" type="datetime" placeholder="Select date and time">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="交货日期">
            <el-date-picker v-model="form.delivery_time" type="datetime" placeholder="Select date and time">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="客户">
            <el-select filterable v-model="form.client_id" placeholder="Select">
              <el-option v-for="item in clientOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="总金额">
            <el-input v-model="form.total_amount"></el-input>
          </el-form-item>
          <el-form-item label="实际运费">
            <el-input v-model="form.actual_delivery_fee"></el-input>
          </el-form-item>
          <el-form-item label="其他费用">
            <el-input v-model="form.other_fee"></el-input>
          </el-form-item>
          <el-form-item label="收获地址">
            <el-input v-model="form.delivery_address"></el-input>
          </el-form-item>
          <el-form-item label="运费">
            <el-input v-model="form.shipping_cost"></el-input>
          </el-form-item>
          <el-form-item label="手续费">
            <el-input v-model="form.transaction_fee"></el-input>
          </el-form-item>
          <el-form-item label="Terms">
            <el-select v-model="form.terms_of_sale" placeholder="Select">
              <el-option v-for="item in termOfSale" :key="item.value" :label="item.value" :value="item.value">
              </el-option>
            </el-select>
            <!--            <el-input v-model="form.terms_of_sale"></el-input>-->
          </el-form-item>
          <el-form-item label="保险费">
            <el-input v-model="form.insurance_cost"></el-input>
          </el-form-item>
          <el-form-item label="额外费用">
            <el-input v-model="form.additional_cost"></el-input>
          </el-form-item>
          <el-form-item label="付款方式">
            <el-select v-model="form.payment_method" placeholder="Select">
              <el-option v-for="item in paymentMethodOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="text" v-model="form.notes"></el-input>
          </el-form-item>
          <el-form-item label="付款状态">
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
          <el-form-item label="成本价">
            <el-input v-model="form.raw_cost"></el-input>
          </el-form-item>
          <el-form-item label="关联产品">
            <el-card class="box-card">
              <el-table :data="form.skus" style="width: 100%">
                <el-table-column label="sku" width="180">
                  <template slot-scope="scope">
                    <el-cascader
                      v-model="scope.row.spu_sku"
                      :options="spuOptions"
                      @change="handleSkuSelect(scope.$index)"
                    >
                    </el-cascader>
                  </template>
                </el-table-column>
                <el-table-column label="价格区间" width="180" prop="priceRangeStr"> </el-table-column>
                <el-table-column label="quantity" width="180">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.quantity"
                      placeholder="quantity"
                      @change="onQuantityChange(scope.$index)"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="成本价" width="180" prop="calculatedUnitPrice"> </el-table-column>
                <el-table-column label="discount" width="180">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.discount"
                      placeholder="0.85"
                      @change="handleDiscount(scope.$index)"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="最终价格" width="180">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.unit_price"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="特殊需求" width="180">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.special_request" placeholder="special_request"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="180">
                  <template slot-scope="scope">
                    <el-button @click="deleteSku(scope.$index)">删除</el-button>
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
              contractId === '0' ? '新增合同' : '修改合同'
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
    await this.getClients()
    await this.getSpus()
    if (this.editId && this.editId !== 0) {
      await this.getContractDetail(this.editId)
    }
    console.log('finish getting client')
  },
  methods: {
    async getContractDetail(id) {
      const res = await contract.getDetail(id)
      this.form = {
        ...res,
        skus: res.skus.map(sku => ({
          spu_sku: [sku.spu_id, sku.sku_id],
          quantity: sku.quantity,
          unit_price: sku.price,
          calculatedUnitPrice: '',
          priceRangeStr: '',
          priceList: [],
          special_request: sku.special_request,
          discount: null,
        })),
      }
    },
    async handleContractAdd() {
      this.loading = true
      const data = {
        ...this.form,
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
      const res = await client.list()
      this.clientOptions = res.map(item => ({
        value: item.id,
        label: item.client_name,
      }))
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
    return {
      termOfSale: [
        {
          value: 'term of sale1',
        },
        {
          value: 'term of sale2',
        },
        {
          value: 'term of sale3',
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
      form: {
        delivery_address: '',
        shipping_cost: '',
        transaction_fee: '',
        terms_of_sale: '',
        insurance_cost: '',
        additional_cost: '',
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
        skus: [],
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

  .productRow {
    display: flex;
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }
}
</style>
