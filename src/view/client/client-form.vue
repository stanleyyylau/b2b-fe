<template>
  <el-row v-loading="loadingForEdit">
    <el-col :lg="20" :md="20" :sm="24" :xs="24">
      <el-form :model="form" status-icon ref="form" label-width="150px" @submit.native.prevent :rules="formRules">
        <el-form-item label="主要邮箱" prop="email">
          <div class="email-row">
            <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="国家" prop="country" required>
          <el-select filterable v-model="form.country" placeholder="Select" @change="generateClientCode">
            <el-option v-for="item in countryList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品分类" prop="category" required>
          <el-select filterable v-model="form.category" placeholder="Select">
            <el-option v-for="(item, index) in categoryOptions" :key="index" :label="item.value" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地址">
          <el-input size="medium" placeholder="地址" v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item label="客户名" prop="client_name" required>
          <el-input
            size="medium"
            placeholder="client_name"
            v-model="form.client_name"
            @change="generateClientCode"
          ></el-input>
        </el-form-item>
        <el-form-item label="公司名" prop="company_name" required>
          <el-input
            @change="generateClientCode"
            size="medium"
            placeholder="company_name"
            v-model="form.company_name"
          ></el-input>
        </el-form-item>
        <el-form-item label="意向产品">
          <el-card class="box-card">
            <div class="interestProductRows">
              <el-table :data="form.interestProducts" border style="width: 100%">
                <el-table-column label="SKU" width="200px">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.spuId" placeholder="Select" filterable="true">
                      <el-option
                        v-for="(item, index) in clientInterestProductOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="数量" width="200px">
                  <template slot-scope="scope">
                    <el-input size="medium" placeholder="输入数量" v-model="scope.row.num"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="备注" width="200px">
                  <template slot-scope="scope">
                    <el-input size="medium" placeholder="填写备注" v-model="scope.row.notes"></el-input>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div>
              <el-button @click="handleInterestProductAdd">新增意向产品</el-button>
            </div>
          </el-card>
        </el-form-item>
        <el-form-item label="联系方式" prop="contact_methods">
          <el-card class="box-card">
            <div v-for="(item, key) in form.contact_methods" :key="key" class="text item">
              <el-form-item :label="item.method" :prop="item.detail">
                <el-input size="medium" :placeholder="item.method" v-model="item.detail"></el-input>
              </el-form-item>
            </div>
          </el-card>
        </el-form-item>
        <el-form-item label="客户代码" prop="code">
          <el-input size="medium" placeholder="code" v-model="form.code"></el-input>
        </el-form-item>
        <el-form-item label="等级" prop="client_level">
          <el-select v-model="form.client_level" placeholder="Select">
            <el-option v-for="item in clientLevelOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="行业" prop="industry">
          <el-select v-model="form.industry" placeholder="Select">
            <el-option v-for="item in clientIndustryOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="来源" prop="source">
          <el-select v-model="form.source" allow-create filterable="true" placeholder="Select">
            <el-option v-for="item in clientSourceOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="放进公海" prop="isInPublicSea">
          <el-switch v-model="form.isInPublicSea"></el-switch>
        </el-form-item>
        <el-form-item style="padding-bottom: 50px">
          <el-button type="primary" v-on:click="handleClientAdd" :loading="loading">{{
            editId !== 0 ? '更新' : '新建'
          }}</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
import product from '@/model/product'
import client from '@/model/client'
import { clientCategoryOptions,
  clientCountryOptions,
  clientIndustryOptions,
  clientLevelOptions,
  clientSourceOptions } from '@/util/common'

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
    // this.setUPSpuData()
    if (this.editId && this.editId !== 0) {
      this.loadingForEdit = true
      await this.initDataForEdit(this.editId)
      await this.setUPSpuData()
      this.loadingForEdit = false
    }
  },
  methods: {
    async initDataForEdit(clientId) {
      const res = await client.getClientDetail(clientId)
      this.form = {
        ...res,
        isInPublicSea: res.is_in_public_sea,
        contact_methods: JSON.parse(res.contact_methods),
        interestProducts: res.interest_products.map(productItem => ({
          spuId: String(productItem.product_id),
          num: productItem.num,
          notes: productItem.notes,
        })),
      }
      this.form.oldEmail = this.form.email
      this.form.oldCode = this.form.code
      console.log('res is', res)
      console.log(this.form)
    },
    generateClientCode() {
      console.log('generate client code')
      if (!this.form.country) return
      if (!this.form.company_name) return
      const countryCode = this.form.country
      const yearCode = String(new Date().getFullYear()).substr(2)
      const companyCode = this.form.company_name
        .match(/[a-zA-Z0-9]/g)
        .join('')
        .toUpperCase()
      // .substr(0, 3)
      if (companyCode.length < 3) {
        this.form.code = ''
      } else {
        this.form.code = `${countryCode}${yearCode}${companyCode.substr(0, 3)}`
      }
    },
    async handleClientAdd() {
      const isValid = await this.$refs.form.validate()
      if (!isValid) return
      this.loading = true
      console.log('this form is', this.form)
      const transformedForm = {
        ...this.form,
        contact_methods: JSON.stringify(this.form.contact_methods),
        is_in_public_sea: this.form.isInPublicSea,
        interest_products: this.form.interestProducts.map(productItem => ({
          ...productItem,
          product_id: productItem.spuId,
        })),
      }
      console.log('trnsform form is', transformedForm)
      this.$emit('addOrUpdate', transformedForm)
      // await client.createClient(transformedForm)
      // this.loading = false
      // this.$router.back()
    },
    handleInterestProductAdd() {
      const originInterestProduct = this.form.interestProducts
      const newIp = [
        ...originInterestProduct,
        {
          spuId: null,
          num: null,
          notes: null,
        },
      ]
      this.form.interestProducts = newIp
    },
    async setUPSpuData() {
      const res = await product.getProducts()
      const cleanData = res.map(spu => ({
        value: String(spu.id),
        label: spu.spu_name,
      }))
      const originInterestOptions = this.clientInterestProductOptions
      this.clientInterestProductOptions = [...cleanData, ...originInterestOptions]
    },
  },
  data() {
    const validateEmail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('error'))
      } else if (this.form.oldEmail === this.form.email) {
        callback()
      } else {
        client.isEmailValidForSignUp(value).then(result => {
          if (result) {
            callback()
          } else {
            callback(new Error('已存在'))
          }
        })
      }
    }
    const validateCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('error'))
      } else if (this.form.oldCode === this.form.code) {
        callback()
      } else {
        client.isCodeValidForSignUp(value).then(result => {
          if (result) {
            callback()
          } else {
            callback(new Error('已存在'))
          }
        })
      }
    }
    return {
      formRules: {
        email: [
          {
            required: true,
            message: '请输入正确的邮箱',
            trigger: 'blur',
            type: 'string',
            // eslint-disable-next-line no-control-regex
            pattern: /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/,
          },
          {
            validator: validateEmail,
            message: '邮箱已存在，归属公海或其他业务，请更换邮箱或联系管理员',
            trigger: 'blur',
          },
        ],
        code: [
          {
            required: true,
            message: '客户代码格式错误',
            trigger: 'blur',
            type: 'string',
            // eslint-disable-next-line no-control-regex
            pattern: /^[A-Z]{2}[0-9]{2}[A-Z]{3}$/,
          },
          {
            validator: validateCode,
            message: '客户代码重复',
            trigger: 'blur',
          },
        ],
      },
      categoryOptions: clientCategoryOptions,
      loadingForEdit: false,
      countryList: clientCountryOptions,
      clientLevelOptions,
      clientIndustryOptions,
      clientSourceOptions,
      clientInterestProductOptions: [
        {
          value: '0',
          label: '需采购',
        },
      ],
      form: {
        oldEmail: '',
        email: '',
        category: '',
        country: '',
        address: '',
        client_name: '',
        company_name: '',
        contact_methods: [
          {
            method: '阿里巴巴',
            detail: '',
          },
          {
            method: '邮箱',
            detail: '',
          },
          {
            method: '电话',
            detail: '',
          },
          {
            method: '手机',
            detail: '',
          },
          {
            method: '社交媒体',
            detail: '',
          },
          {
            method: 'other',
            detail: '',
          },
        ],
        code: '',
        oldCode: '',
        client_level: 'C 普通客户',
        industry: '未知',
        source: '阿里',
        isInPublicSea: false,
        interestProducts: [
          // {
          //   spuId: null,
          //   num: null,
          //   notes: null
          // }
        ],
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

  .email-row {
    max-width: 280px;
  }
}
</style>
