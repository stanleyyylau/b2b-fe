<template>
  <div>
    <!-- 列表页面 -->
    <div class="container">
      <div class="header">
        <div class="title">新增产品</div>
      </div>
      <el-row>
        <el-col :lg="20" :md="20" :sm="24" :xs="24">
          <el-form :model="form" status-icon ref="form" label-width="100px" @submit.native.prevent>
            <el-form-item label="SPU" prop="spu_name" required>
              <el-input size="medium" placeholder="SPU" v-model="form.spu_name"></el-input>
            </el-form-item>
            <el-form-item label="SPU Title" prop="spu_title">
              <el-input size="medium" placeholder="SPU" v-model="form.spu_title"></el-input>
            </el-form-item>
            <el-form-item label="SPU Des" prop="spu_description">
              <el-input size="medium" placeholder="SPU" v-model="form.spu_description"></el-input>
            </el-form-item>
            <el-form-item label="SPU Price" prop="price">
              <el-input size="medium" placeholder="SPU" v-model="form.price"></el-input>
            </el-form-item>
            <el-form-item label="SPU Img" prop="img_url" required>
              <upload-imgs ref="uploadEle" :value="initData" maxNum="1"/>
            </el-form-item>
            <el-form-item label="分类" prop="catalog_id" required>
              <el-select v-model="form.catalog_id" placeholder="选择产品分类">
                <el-option
                  v-for="item in catOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="属性组" prop="attr_group_id" required>
              <el-select v-model="form.attr_group_id" placeholder="选择产品分类"
                         @change="handleAttrGroupChange"
              >
                <el-option
                  v-for="item in attrGroupOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- basic attribute-->
            <el-form-item v-if="form.attr_group_id !== '' && form.catalog_id !== '' " label="基本属性" prop="basic_attr">
              <div class="wrap">
                <el-form-item v-for="(attr, index) in basicAttr"
                              :label="attr.attrName + ':'"
                              :key="attr.attrId"
                              label-width="200px"
                              required
                >
                  <el-select
                    v-model="basicAttrForm[index].selected"
                    multiple
                    filterable
                    default-first-option
                    placeholder="Choose tags for your article">
                    <el-option
                      v-for="item in attr.attrValue"
                      :key="item"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-form-item>
            <!-- sale attribute-->
            <el-form-item v-if="form.attr_group_id !== '' && form.catalog_id !== '' " label="销售属性" prop="sale_attr">
                <div class="wrap">
                  <el-form-item v-for="(attr, index) in saleAttr"
                                :label="attr.attrName + ':'"
                                :key="attr.attrId"
                                label-width="200px"
                                required
                  >
                    <el-select
                      v-model="saleAttrForm[index].selected"
                      filterable
                      allow-create
                      default-first-option
                      placeholder="Choose tags for your article">
                      <el-option
                        v-for="item in attr.attrValue"
                        :key="item"
                        :label="item"
                        :value="item">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-button v-on:click="handleGenerateSKU">生成 SKU</el-button>
                </div>
            </el-form-item>
            <div class="skuTableWrap" v-if="form.attr_group_id !== '' && form.catalog_id !== ''">
              <el-table
                :data="skuList"
                border
                style="width: 100%">
                <el-table-column
                  prop="salesAttrs"
                  label="销售属性"
                  width="200px">
                  <template slot-scope="scope">
                    <div
                      v-for="attr in scope.row.salesAttrs"
                      :key="attr.saleAttrId">
                      {{attr.saleAttrName}} : {{attr.saleAttrValue}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="sku"
                  min-width="200px"
                  label="SKU编号">
                  <template slot-scope="scope">
                    <el-input placeholder="SKU Model" v-model="scope.row.sku"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="skuName"
                  width="250px"
                  label="SKU name">
                  <template slot-scope="scope">
                    <el-input placeholder="SKU Model" v-model="scope.row.skuName"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="price"
                  min-width="250px"
                  label="price">
                  <template slot-scope="scope">
                    <div
                      v-for="item in scope.row.price"
                      :key="item.minCount">
                      {{item.minCount}}~{{item.maxCount}} : {{item.price}}
                    </div>
                    <div class="setPrice">
                      <el-input
                        size="small"
                        placeholder="Min Count"
                        v-model="scope.row.minCount">
                      </el-input>
                      <el-input
                        size="small"
                        placeholder="Max Count"
                        v-model="scope.row.maxCount">
                      </el-input>
                      <el-input
                        size="small"
                        placeholder="Price"
                        v-model="scope.row.prePrice">
                      </el-input>
                      <el-button v-on:click="handleAddPrice(scope.row.sku, scope.row.minCount, scope.row.maxCount, scope.row.prePrice)">添加价格区间</el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form>
        </el-col>
      </el-row>
      <el-row class="confirm-button-row">
        <el-col :lg="16" :md="20" :sm="24" :xs="24">
          <el-button type="primary" v-on:click="handleProductAdd" :loading="loading">确定新增产品</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>

import category from '@/model/category'
import attribute from '@/model/attribute'
import product from '@/model/product'
import UploadImgs from '@/component/base/upload-image'

export default {
  components: {
    UploadImgs
  },
  async created() {
    await this.getSecondLevelCates()
    await this.getAttrGroups()
    this.loading = false
  },
  methods: {
    async getValue() {
      return this.$refs.uploadEle.getValue()
    },
    goBack() {
      this.$router.back()
    },
    async getAttrGroups() {
      try {
        const cates = await attribute.getAttrGroups()

        // transform to cat options
        const optionsFromServer = cates.map(cat => ({
          value: cat.id,
          label: cat.attr_group_name,
        }))
        this.attrGroupOptions = optionsFromServer
      } catch (error) {
        if (error.code === 10020) {
          this.catOptions = []
        }
      }
    },
    async getSecondLevelCates() {
      try {
        const cates = await category.getSecondLevelCategories()

        // transform to cat options
        const optionsFromServer = cates.map(cat => ({
          value: cat.id,
          label: cat.name,
        }))
        this.catOptions = optionsFromServer
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
    findAttrNameById(id) {
      const match = this.attrs.filter(attr => attr.id === id)
      return match[0].attr_name
    },
    async handleAttrGroupChange(val) {
      const res = await attribute.getAttrsByGroupId(val)
      this.attrs = res
      this.basicAttrForm = res.filter(attr => attr.attr_type === 1)
        .map(attr => ({
          attrId: attr.id,
          selected: '',
        }))
      this.saleAttrForm = res.filter(attr => attr.attr_type === 0)
        .map(attr => ({
          attrId: attr.id,
          selected: '',
        }))
      console.log(this.basicAttr)
    },
    handleGenerateSKU() {
      console.log('sale attr')
      console.log(this.saleAttrForm)
      const salesAttrs = this.saleAttrForm.map(attr => ({
        saleAttrId: attr.attrId,
        saleAttrName: this.findAttrNameById(attr.attrId),
        saleAttrValue: attr.selected
      }))
      const skuEntity = {
        sku: '',
        skuName: '',
        price: [],
        minCount: '',
        maxCount: '',
        prePrice: '',
        salesAttrs
      }
      this.skuList = [...this.skuList, skuEntity]
      console.log('new sku list is')
      console.log(this.skuList)
    },
    handleAddPrice(skuId, minCount, maxCount, prePrice) {
      const targetIndex = this.skuList.findIndex(sku => sku.sku === skuId)
      const target = { ...this.skuList[targetIndex] }
      target.price.push({
        minCount,
        maxCount,
        price: prePrice
      })
      const nenSkuList = [...this.skuList]
      nenSkuList[targetIndex] = target
      this.skuList = nenSkuList
    },
    async handleProductAdd() {
      const valid = this.$refs.form.validate()
      if (!valid) console.log('validation error...')
      console.log('product data is')
      const imgInfo = await this.getValue()
      const featureImgUrl = imgInfo[0].display

      const transformSkuList = skuList => skuList.map(sku => {
        const skuObj = {
          sku_name: sku.sku,
          sku_title: sku.skuName,
          price_list: sku.price.map(priceItem => ({
            start_count: priceItem.minCount,
            end_count: priceItem.maxCount,
            price: priceItem.price
          })),
          sale_attr_list: sku.salesAttrs.map(saleAttr => ({
            attr_id: saleAttr.saleAttrId,
            attr_name: saleAttr.saleAttrName,
            attr_value: saleAttr.saleAttrValue,
          }))
        }
        return skuObj
      })

      const productObject = {
        ...this.form,
        img_url: featureImgUrl,
        basic_attr_list: this.basicAttrForm.map(attr => ({
          attr_id: attr.attrId,
          attr_name: this.findAttrNameById(attr.attrId),
          attr_value: attr.selected.join(',')
        })),
        sku_list: transformSkuList(this.skuList)
      }

      console.log(productObject)

      try {
        this.loading = true
        const res = await product.createProduct(productObject)
        this.loading = false
        if (res.code < window.MAX_SUCCESS_CODE) {
          this.$message.success(`${res.message}`)
          this.$router.back()
        }
      } catch (error) {
        this.loading = false
        this.$message.error('增加产品失败，请检测填写信息')
        console.log(error)
      }
    }
  },
  data() {
    return {
      loading: false,
      rules: {
        minWidth: 100,
        minHeight: 100,
        maxSize: 1
      },
      initData: [],
      skuList: [],
      tableColumn: [
        {
          prop: 'name',
          label: '分类名称',
        },
      ],
      options: [
        {
          value: 'HTML',
          label: 'HTML',
        }, {
          value: 'CSS',
          label: 'CSS',
        }, {
          value: 'JavaScript',
          label: 'JavaScript',
        }],
      value: [],
      attrs: [],
      catOptions: [],
      attrGroupOptions: [],
      form: {
        spu_name: '',
        spu_title: '',
        spu_description: '',
        catalog_id: '',
        attr_group_id: '',
        img_url: '',
        price: '',
        publish_status: 1,
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
      basicAttrForm: [],
      saleAttrForm: [],
      skuListDataTest: [
        { saleAttrs: [{
          saleAttrId: '23',
          saleAttrName: 'color',
          saleAttrValue: 'white'
        }, {
          saleAttrId: '24',
          saleAttrName: 'memory',
          saleAttrValue: 'black'
        }],
        sku: '2323',
        skuName: 'skunname',
        price: [{
          minCount: '20',
          maxCount: '50',
          price: '32USD'
        }, {
          minCount: '51',
          maxCount: '100',
          price: '30USD'
        }
        ] }
      ],
      tableDataTest: [{
        date: '2016-05-03',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
      }, {
        date: '2016-05-02',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
      }, {
        date: '2016-05-04',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
      }, {
        date: '2016-05-01',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
      }]
    }
  },
  computed: {
    basicAttr() {
      return this.attrs.filter(attr => attr.attr_type === 1)
        .map(attr => ({
          attrId: attr.id,
          attrName: attr.attr_name,
          attrValue: attr.value_select.split(','),
          selected: '',
        }))
    },
    saleAttr() {
      return this.attrs.filter(attr => attr.attr_type === 0)
        .map(attr => ({
          attrId: attr.id,
          attrName: attr.attr_name,
          attrValue: attr.value_select.split(','),
          selected: '',
        }))
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

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }
}

.confirm-button-row {
  padding: 20px 0;
}

.wrap {
  background-color: white;
  padding: 20px 0 5px 0;
  border: 1px solid #dcdfe5;
  border-radius: 3px;
  .el-form-item__content {
    margin-bottom: 0!important;
  }
  .el-form-item {
    margin-bottom: 0px !important;
  }
}
</style>
