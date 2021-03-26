<template>
  <div>
    <!-- 列表页面 -->
    <div class="container">
      <div class="header">
        <div class="title">新增客户</div>
      </div>

      <!--      <el-row>-->
      <!--        <el-col :lg="20" :md="20" :sm="24" :xs="24">-->
      <!--          <el-form :model="form" status-icon ref="form" label-width="150px" @submit.native.prevent>-->
      <!--            <el-form-item label="国家" prop="country">-->
      <!--              <el-select filterable v-model="form.country" placeholder="Select">-->
      <!--                <el-option-->
      <!--                  @change="generateClientCode"-->
      <!--                  v-for="item in countryList"-->
      <!--                  :key="item.value"-->
      <!--                  :label="item.label"-->
      <!--                  :value="item.value"-->
      <!--                >-->
      <!--                </el-option>-->
      <!--              </el-select>-->
      <!--            </el-form-item>-->
      <!--            <el-form-item label="地址">-->
      <!--              <el-input size="medium" placeholder="地址" v-model="form.address"></el-input>-->
      <!--            </el-form-item>-->
      <!--            <el-form-item label="客户名" prop="client_name">-->
      <!--              <el-input size="medium" placeholder="client_name" v-model="form.client_name"></el-input>-->
      <!--            </el-form-item>-->
      <!--            <el-form-item label="公司名" prop="company_name">-->
      <!--              <el-input-->
      <!--                @change="generateClientCode"-->
      <!--                size="medium"-->
      <!--                placeholder="company_name"-->
      <!--                v-model="form.company_name"-->
      <!--              ></el-input>-->
      <!--            </el-form-item>-->
      <!--            <el-form-item label="意向产品">-->
      <!--              <el-card class="box-card">-->
      <!--                <div class="interestProductRows">-->
      <!--                  <el-table :data="form.interestProducts" border style="width: 100%">-->
      <!--                    <el-table-column label="SKU" width="200px">-->
      <!--                      <template slot-scope="scope">-->
      <!--                        <el-select v-model="scope.row.spuId" placeholder="Select" filterable="true">-->
      <!--                          <el-option-->
      <!--                            v-for="(item, index) in clientInterestProductOptions"-->
      <!--                            :key="index"-->
      <!--                            :label="item.label"-->
      <!--                            :value="item.value"-->
      <!--                          >-->
      <!--                          </el-option>-->
      <!--                        </el-select>-->
      <!--                      </template>-->
      <!--                    </el-table-column>-->
      <!--                    <el-table-column label="数量" width="200px">-->
      <!--                      <template slot-scope="scope">-->
      <!--                        <el-input size="medium" placeholder="输入数量" v-model="scope.row.num"></el-input>-->
      <!--                      </template>-->
      <!--                    </el-table-column>-->
      <!--                    <el-table-column label="备注" width="200px">-->
      <!--                      <template slot-scope="scope">-->
      <!--                        <el-input size="medium" placeholder="填写备注" v-model="scope.row.notes"></el-input>-->
      <!--                      </template>-->
      <!--                    </el-table-column>-->
      <!--                  </el-table>-->
      <!--                </div>-->
      <!--                <div>-->
      <!--                  <el-button @click="handleInterestProductAdd">新增意向产品</el-button>-->
      <!--                </div>-->
      <!--              </el-card>-->
      <!--            </el-form-item>-->
      <!--            <el-form-item label="联系方式" prop="contact_methods">-->
      <!--              <el-card class="box-card">-->
      <!--                <div v-for="(item, key) in form.contact_methods" :key="key" class="text item">-->
      <!--                  <el-form-item :label="item.method" :prop="item.detail">-->
      <!--                    <el-input size="medium" :placeholder="item.method" v-model="item.detail"></el-input>-->
      <!--                  </el-form-item>-->
      <!--                </div>-->
      <!--              </el-card>-->
      <!--            </el-form-item>-->
      <!--            <el-form-item label="客户代码" prop="code">-->
      <!--              <el-input size="medium" placeholder="code" v-model="form.code"></el-input>-->
      <!--            </el-form-item>-->
      <!--            <el-form-item label="等级" prop="client_level">-->
      <!--              <el-select v-model="form.client_level" placeholder="Select">-->
      <!--                <el-option v-for="item in clientLevelOptions" :key="item.value" :label="item.label" :value="item.value">-->
      <!--                </el-option>-->
      <!--              </el-select>-->
      <!--            </el-form-item>-->
      <!--            <el-form-item label="行业" prop="industry">-->
      <!--              <el-select v-model="form.industry" placeholder="Select">-->
      <!--                <el-option-->
      <!--                  v-for="item in clientIndustryOptions"-->
      <!--                  :key="item.value"-->
      <!--                  :label="item.label"-->
      <!--                  :value="item.value"-->
      <!--                >-->
      <!--                </el-option>-->
      <!--              </el-select>-->
      <!--            </el-form-item>-->
      <!--            <el-form-item label="来源" prop="source">-->
      <!--              <el-select v-model="form.source" allow-create filterable="true" placeholder="Select">-->
      <!--                <el-option-->
      <!--                  v-for="item in clientSourceOptions"-->
      <!--                  :key="item.value"-->
      <!--                  :label="item.label"-->
      <!--                  :value="item.value"-->
      <!--                >-->
      <!--                </el-option>-->
      <!--              </el-select>-->
      <!--            </el-form-item>-->
      <!--            <el-form-item label="放进公海" prop="isInPublicSea">-->
      <!--              <el-switch v-model="form.isInPublicSea"></el-switch>-->
      <!--            </el-form-item>-->
      <!--            <el-form-item style="padding-bottom: 50px">-->
      <!--              <el-button type="primary" v-on:click="handleClientAdd" :loading="loading">确定新增客户</el-button>-->
      <!--            </el-form-item>-->
      <!--          </el-form>-->
      <!--        </el-col>-->
      <!--      </el-row>-->

      <client-form :loading="loading" @addOrUpdate="handleClientAdd" />
    </div>
  </div>
</template>

<script>
import product from '@/model/product'
import client from '@/model/client'
import country from '@/util/country'
import clientForm from './client-form'

export default {
  components: {
    clientForm,
  },
  created() {},
  methods: {
    generateClientCode() {
      if (!this.form.country) return
      if (!this.form.company_name) return
      const countryCode = this.form.country
      const yearCode = String(new Date().getFullYear()).substr(2)
      const companyCode = this.form.company_name
        .toUpperCase()
        .replaceAll(' ')
        .substr(0, 3)
      this.form.code = `${countryCode}${yearCode}${companyCode}`
    },
    async handleClientAdd(transformedForm) {
      this.loading = true
      await client.createClient(transformedForm)
      this.loading = false
      this.$router.back()
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
    return {
      countryList: country,
      loading: false,
      clientLevelOptions: [
        {
          value: 'AAA 大客户',
          label: 'AAA 大客户',
        },
        {
          value: 'AA 已下单客户',
          label: 'AA 已下单客户',
        },
        {
          value: 'A 重要客户',
          label: 'A 重要客户',
        },
        {
          value: 'B 意向客户',
          label: 'B 意向客户',
        },
        {
          value: 'C 普通客户',
          label: 'C 普通客户',
        },
        {
          value: 'D 非优先客户',
          label: 'D 非优先客户',
        },
      ],
      clientIndustryOptions: [
        {
          value: '品牌商',
          label: '品牌商',
        },
        {
          value: '批发商',
          label: '批发商',
        },
        {
          value: '电商客户',
          label: '电商客户',
        },
        {
          value: '贸易商',
          label: '贸易商',
        },
        {
          value: '新入行',
          label: '新入行',
        },
        {
          value: '未知',
          label: '未知',
        },
      ],
      clientSourceOptions: [
        {
          value: '阿里',
          label: '阿里',
        },
        {
          value: '开发信',
          label: '开发信',
        },
        {
          value: '官网',
          label: '官网',
        },
      ],
      clientInterestProductOptions: [
        {
          value: '0',
          label: '需采购',
        },
      ],
      form: {
        country: '',
        address: '',
        client_name: '',
        company_name: '',
        contact_methods: [
          {
            method: '阿里巴巴',
            detail: 'stanleyyylau',
          },
          {
            method: '邮箱',
            detail: 'stanleyyylau',
          },
          {
            method: '电话',
            detail: 'stanleyyylau',
          },
          {
            method: '手机',
            detail: 'stanleyyylau',
          },
          {
            method: '社交媒体',
            detail: 'stanleyyylau',
          },
          {
            method: 'other',
            detail: 'stanleyyylau',
          },
        ],
        code: '',
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
}
</style>
