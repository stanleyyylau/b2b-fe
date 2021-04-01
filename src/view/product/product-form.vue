<template>
  <div>
    <!-- 列表页面 -->
    <div class="container" :key="editId">
      <div class="header">
        <div class="title">{{ editId !== 0 ? '编辑产品' : '新增产品' }}</div>
      </div>
      <el-row v-loading="loadingForEdit">
        <el-col :lg="20" :md="20" :sm="24" :xs="24">
          <el-form :model="form" status-icon ref="form" label-width="100px" @submit.native.prevent>
            <el-form-item label="型号" prop="spu_name" required>
              <el-input size="medium" placeholder="产品型号不可重复" v-model="form.spu_name"></el-input>
            </el-form-item>
            <el-form-item label="标题" prop="spu_title">
              <el-input size="medium" placeholder="标题" v-model="form.spu_title"></el-input>
            </el-form-item>
            <el-form-item label="供应商" prop="supplier">
              <el-input size="medium" placeholder="供应商" v-model="form.supplier"></el-input>
            </el-form-item>
            <el-form-item label="证书">
              <el-select multiple v-model="form.certificates" placeholder="选择证书">
                <el-option v-for="item in certOptions" :key="item.label" :label="item.label" :value="item.label">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="描述" prop="spu_description">
              <el-input size="medium" placeholder="描述" v-model="form.spu_description"></el-input>
            </el-form-item>
            <el-form-item label="价格" prop="price">
              <el-input size="medium" placeholder="价格" v-model="form.price"></el-input>
            </el-form-item>
            <el-form-item label="主图" prop="img_url" required>
              <upload-imgs ref="uploadEle" :value="initData" :maxNum="1" />
            </el-form-item>
            <el-form-item label="分类" prop="catalog_id" required>
              <el-select v-model="form.catalog_id" placeholder="选择产品分类">
                <el-option v-for="item in catOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="属性组" prop="attr_group_id" required>
              <el-select v-model="form.attr_group_id" placeholder="选择产品分类" @change="handleAttrGroupChange">
                <el-option v-for="item in attrGroupOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- basic attribute-->
            <el-form-item v-if="form.attr_group_id !== '' && form.catalog_id !== ''" label="基本属性" prop="basic_attr">
              <div class="wrap">
                <el-form-item
                  v-for="(attr, index) in basicAttr"
                  :label="attr.attrName + ':'"
                  :key="attr.attrId"
                  label-width="200px"
                  required
                >
                  <el-select
                    multiple="true"
                    v-model="basicAttrForm[index].selected"
                    default-first-option
                    placeholder="请选择"
                  >
                    <el-option v-for="item in attr.attrValue" :key="item" :label="item" :value="item"> </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-form-item>
            <!-- sale attribute-->
            <el-form-item v-if="form.attr_group_id !== '' && form.catalog_id !== ''" label="销售属性" prop="sale_attr">
              <div class="wrap">
                <el-form-item
                  v-for="(attr, index) in saleAttr"
                  :label="attr.attrName + ':'"
                  :key="attr.attrId"
                  label-width="200px"
                  required
                >
                  <el-select
                    v-model="saleAttrForm[index].selected"
                    filterable
                    default-first-option
                    placeholder="请选择"
                  >
                    <el-option v-for="item in attr.attrValue" :key="item" :label="item" :value="item"> </el-option>
                  </el-select>
                </el-form-item>
                <div class="generateSkuWrap">
                  <el-button v-on:click="handleGenerateSKU">生成 SKU</el-button>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="SKU 列表" v-if="form.attr_group_id !== '' && form.catalog_id !== ''">
              <el-card class="box-card">
                <div class="skuTableWrap">
                  <el-table :data="skuList" border style="width: 100%">
                    <el-table-column prop="salesAttrs" label="销售属性" width="200px">
                      <template slot-scope="scope">
                        <div v-for="attr in scope.row.salesAttrs" :key="attr.saleAttrId">
                          {{ attr.saleAttrName }} : {{ attr.saleAttrValue }}
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="sku" label="编号" width="200px">
                      <template slot-scope="scope">
                        <el-input placeholder="SKU Model" v-model="scope.row.sku"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column prop="skuName" width="200px" label="名字">
                      <template slot-scope="scope">
                        <el-input placeholder="如果你想起一个好记一点的外号" v-model="scope.row.skuName"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column prop="rawPrice" width="200px" label="成本价(¥)">
                      <template slot-scope="scope">
                        <div class="unit-row">
                          <el-input placeholder="sku成本价" v-model="scope.row.rawPrice"></el-input>
                          <span style="margin-left:10px; width: 30px;">¥</span>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="productSize" label="Product Size(cm)" width="200px">
                      <template slot-scope="scope">
                        <el-input placeholder="product size" v-model="scope.row.productSize"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column prop="size" label="Package Size(cm)" width="200px">
                      <template slot-scope="scope">
                        <el-input placeholder="size" v-model="scope.row.size"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column prop="weight" label="Package Weight(kg)" width="200px">
                      <template slot-scope="scope">
                        <div class="unit-row">
                          <el-input placeholder="weight" v-model="scope.row.weight"></el-input>
                          <span style="margin-left:10px; width: 30px;">kg</span>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="quantity_per_carton" label="quantity_per_carton(pcs)" width="200px">
                      <template slot-scope="scope">
                        <div class="unit-row">
                          <el-input
                            placeholder="quantity_per_carton"
                            v-model="scope.row.quantity_per_carton"
                          ></el-input>
                          <span style="margin-left:10px; width: 30px;">pcs</span>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="net_weight_per_carton" label="net_weight_per_carton(kg)" width="200px">
                      <template slot-scope="scope">
                        <div class="unit-row">
                          <el-input
                            placeholder="net_weight_per_carton"
                            v-model="scope.row.net_weight_per_carton"
                          ></el-input>
                          <span style="margin-left:10px; width: 30px;">kg</span>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="gross_weight_per_carton" label="gross_weight_per_carton(kg)" width="210px">
                      <template slot-scope="scope">
                        <div class="unit-row">
                          <el-input
                            placeholder="gross_weight_per_carton"
                            v-model="scope.row.gross_weight_per_carton"
                          ></el-input>
                          <span style="margin-left:10px; width: 30px;">kg</span>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="carton_measurement" label="carton_measurement(m³)" width="200px">
                      <template slot-scope="scope">
                        <div class="unit-row">
                          <el-input placeholder="carton_measurement" v-model="scope.row.carton_measurement"></el-input>
                          <span style="margin-left:10px; width: 30px;">m³</span>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="carton_size" label="carton_size(cm)" width="200px">
                      <template slot-scope="scope">
                        <el-input placeholder="carton_size" v-model="scope.row.carton_size"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="200px">
                      <template slot-scope="scope">
                        <el-button @click="handleSetPriceClick(scope.row)">设置价格</el-button>
                        <el-button @click="handleSkuDelete(scope.$index)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-card>
            </el-form-item>
            <el-form-item label="打印属性" prop="printable_attr_ids" required>
              <el-select multiple v-model="form.printable_attr_ids" placeholder="选择打印属性">
                <el-option v-for="item in attrs" :key="item.id" :label="item.attr_name" :value="item.id"> </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <!-- edit price-->
      <el-dialog title="编辑SKU价格" :visible.sync="showEditPrice" v-if="showEditPrice">
        <div class="setPrice">
          <div class="fromCount">
            <el-input-number v-model="editPriceRow.minCount" placeholder="Min Count" :min="1" :max="1000000">
            </el-input-number>
          </div>
          <div class="to">
            ~
          </div>
          <div class="toCount">
            <el-input-number v-model="editPriceRow.maxCount" placeholder="Max Count" :min="1" :max="1000000">
            </el-input-number>
          </div>
          <div class="to">
            =
          </div>
          <div class="priceRange">
            <el-input placeholder="Price" v-model="editPriceRow.prePrice"> </el-input>
          </div>
          <div class="addPriceWrap">
            <el-button
              v-on:click="
                handleAddPrice(
                  editPriceRow.clientSideId,
                  editPriceRow.minCount,
                  editPriceRow.maxCount,
                  editPriceRow.prePrice,
                  editPriceRow.skuId,
                )
              "
              >添加价格</el-button
            >
          </div>
        </div>
        <div class="price-table">
          <el-table :data="editPriceRow.price" style="width: 100%">
            <el-table-column label="起始数量" width="180">
              <template slot-scope="scope">
                {{ scope.row.minCount }}
              </template>
            </el-table-column>
            <el-table-column label="终止数量" width="180">
              <template slot-scope="scope">
                {{ scope.row.maxCount }}
              </template>
            </el-table-column>
            <el-table-column label="价格" width="180">
              <template slot-scope="scope">
                {{ scope.row.price }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDeletePrice(editPriceRow.clientSideId || editPriceRow.skuId, scope.$index)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-dialog>

      <el-row class="confirm-button-row">
        <el-col :lg="16" :md="20" :sm="24" :xs="24">
          <el-button type="primary" v-on:click="handleProductAdd" :loading="loading">{{
            editId !== 0 ? '更新产品' : '确定新建产品'
          }}</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { v4 } from 'uuid'
import category from '@/model/category'
import attribute from '@/model/attribute'
import product from '@/model/product'
import UploadImgs from '@/component/base/upload-image'

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
  components: {
    UploadImgs,
  },
  async created() {
    // this.editId = Number(this.$router.history.current.query.id) || 0
    this.loadingForEdit = true
    await this.getSecondLevelCates()
    await this.getAttrGroups()
    if (this.editId && this.editId !== 0) {
      await this.getProductDetail(this.editId)
    }
    this.loadingForEdit = false
    this.loading = false
  },
  methods: {
    findAttrValueById(id, productDetail) {
      const match = productDetail.basic_attr_list.filter(attr => attr.attr_id === id)
      console.log('match is ', match)
      if (match.length === 0) return ''
      return match[0].attr_value
    },
    async initAttrGroups(groupId, productDetail) {
      const res = await attribute.getAttrsByGroupId(groupId)
      this.attrs = res
      this.basicAttrForm = res
        .filter(attr => attr.attr_type === 1)
        .map(attr => ({
          attrId: attr.id,
          selected: this.findAttrValueById(attr.id, productDetail).split(','),
        }))
      // use default instead
      this.saleAttrForm = res
        .filter(attr => attr.attr_type === 0)
        .map(attr => ({
          attrId: attr.id,
          selected: '',
        }))
      console.log(this.basicAttrForm)
    },
    async getProductDetail(pid) {
      console.log('getting product detail')
      const detail = await product.getProductDetail(pid)
      console.log(detail)
      this.form = {
        certificates: detail.certificates ? detail.certificates.split(',') : [],
        spu_name: detail.spu_name,
        spu_title: detail.spu_title,
        supplier: detail.supplier,
        spu_description: detail.spu_description,
        catalog_id: detail.catalog_id,
        attr_group_id: detail.attr_group_id,
        img_url: detail.img_url,
        price: detail.price,
        printable_attr_ids: detail.printable_attr_ids ? detail.printable_attr_ids.split(',').map(s => Number(s)) : [],
        publish_status: 1,
      }
      // set default img
      this.initData = [{ display: detail.img_url }]
      await this.initAttrGroups(String(detail.attr_group_id), detail)
      const skuList = detail.sku_list.map(sku => ({
        weight: sku.weight,
        size: sku.size,
        quantity_per_carton: sku.quantity_per_carton,
        net_weight_per_carton: sku.net_weight_per_carton,
        gross_weight_per_carton: sku.gross_weight_per_carton,
        carton_measurement: sku.carton_measurement,
        carton_size: sku.carton_size,
        skuId: sku.id,
        sku: sku.sku_name,
        skuName: sku.sku_title,
        rawPrice: sku.raw_price,
        productSize: sku.product_size,
        price: sku.price_list.map(price => ({
          sku_id: price.sku_id,
          minCount: price.start_count,
          maxCount: price.end_count,
          price: price.price,
        })),
        minCount: '',
        maxCount: '',
        prePrice: '',
        salesAttrs: sku.sale_attr_list.map(attr => ({
          saleAttrId: attr.attr_id,
          saleAttrName: attr.attr_name,
          saleAttrValue: attr.attr_value,
          id: attr.id,
        })),
      }))
      console.log('#####')
      console.log('skulist', skuList)
      this.skuList = skuList
    },
    handleSetPriceClick(row) {
      console.log('hihihi')
      this.editPriceRow = row
      this.showEditPrice = true
    },
    async getValue() {
      return this.$refs.uploadEle.getValue()
    },
    handleDeletePrice(clientSideSkuId, priceIndex) {
      console.log(clientSideSkuId, priceIndex)
      const targetIndex = this.skuList.findIndex(sku => {
        if (sku.clientSideId === clientSideSkuId) {
          return true
        }
        if (sku.skuId === clientSideSkuId) {
          return true
        }
        return false
      })
      const target = { ...this.skuList[targetIndex] }
      const newPriceArray = [...target.price]
      newPriceArray.splice(priceIndex, 1)
      target.price = newPriceArray
      this.editPriceRow.price = newPriceArray
      const nenSkuList = [...this.skuList]
      nenSkuList[targetIndex] = target
      this.skuList = nenSkuList
    },
    goBack() {
      this.$router.back()
    },
    handleSkuDelete(index) {
      console.log('index', index)
      const newSkuList = [...this.skuList]
      newSkuList.splice(index, 1)
      this.skuList = newSkuList
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
          throw new Error('error')
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
      this.basicAttrForm = res
        .filter(attr => attr.attr_type === 1)
        .map(attr => ({
          attrId: attr.id,
          selected: '',
        }))
      this.saleAttrForm = res
        .filter(attr => attr.attr_type === 0)
        .map(attr => ({
          attrId: attr.id,
          selected: '',
        }))
      console.log(this.basicAttr)
    },
    normalized(name) {
      return name.toUpperCase().replaceAll(' ', '-')
    },
    handleGenerateSKU() {
      console.log('sale attr')
      console.log(this.saleAttrForm)

      const generateSkuName = (salesAttrs, spu) => {
        let skuName = spu
        salesAttrs.forEach(item => {
          skuName = `${skuName}-${item.saleAttrId}#${this.normalized(item.saleAttrValue)}`
        })
        return skuName
      }

      const salesAttrs = this.saleAttrForm.map(attr => ({
        saleAttrId: attr.attrId,
        saleAttrName: this.findAttrNameById(attr.attrId),
        saleAttrValue: attr.selected,
      }))
      const skuEntity = {
        clientSideId: v4(),
        sku: generateSkuName(salesAttrs, this.form.spu_name),
        skuName: '',
        rawPrice: '',
        price: [],
        productSize: '',
        minCount: 1,
        maxCount: 1,
        prePrice: '',
        size: '',
        weight: '',
        quantity_per_carton: '',
        net_weight_per_carton: '',
        gross_weight_per_carton: '',
        carton_measurement: '',
        carton_size: '',
        salesAttrs,
      }
      this.skuList = [...this.skuList, skuEntity]
      console.log('new sku list is')
      console.log(this.skuList)
    },
    handleAddPrice(clientSideId, minCount, maxCount, prePrice, editId) {
      console.log('hhihi')
      let target
      let targetIndex
      const nenSkuList = [...this.skuList]
      if (typeof clientSideId === 'undefined') {
        const match = nenSkuList.filter(item => item.skuId === editId)
        // eslint-disable-next-line prefer-destructuring
        target = match[0]
      } else {
        targetIndex = nenSkuList.findIndex(sku => sku.clientSideId === clientSideId)
        target = nenSkuList[targetIndex]
      }
      target.price.push({
        minCount,
        maxCount,
        price: prePrice,
      })
      // const nenSkuList = [...this.skuList]
      // nenSkuList[targetIndex] = target
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
          ...sku,
          sku_name: sku.sku,
          sku_title: sku.skuName,
          raw_price: sku.rawPrice,
          product_size: sku.productSize,
          price_list: sku.price.map(priceItem => ({
            start_count: priceItem.minCount,
            end_count: priceItem.maxCount,
            price: priceItem.price,
          })),
          sale_attr_list: sku.salesAttrs.map(saleAttr => ({
            attr_id: saleAttr.saleAttrId,
            attr_name: saleAttr.saleAttrName,
            attr_value: saleAttr.saleAttrValue,
          })),
        }
        return skuObj
      })

      const productObject = {
        ...this.form,
        certificates: this.form.certificates.join(','),
        printable_attr_ids: this.form.printable_attr_ids.join(','),
        img_url: featureImgUrl,
        basic_attr_list: this.basicAttrForm.map(attr => ({
          attr_id: attr.attrId,
          attr_name: this.findAttrNameById(attr.attrId),
          attr_value: attr.selected.join(','),
        })),
        sku_list: transformSkuList(this.skuList),
      }

      console.log(productObject)
      // this.loading = true

      this.$emit('addOrUpdate', productObject)

      // try {
      //   this.loading = true
      //   // const res = await product.createProduct(productObject)
      //
      //   this.loading = false
      //   if (res.code < window.MAX_SUCCESS_CODE) {
      //     this.$message.success(`${res.message}`)
      //     this.$router.back()
      //   }
      // } catch (error) {
      //   this.loading = false
      //   this.$message.error('增加产品失败，请检测填写信息')
      //   console.log(error)
      // }
    },
  },
  data() {
    return {
      loadingForEdit: false,
      certOptions: [
        {
          label: 'CE',
        },
        {
          label: 'RoHS',
        },
        {
          label: 'FCC',
        },
        {
          label: 'ISO',
        },
      ],
      editPriceRow: null,
      showEditPrice: false,
      // loading: false,
      initData: [], // for image uploaded
      skuList: [],
      // value: [],
      attrs: [], // all attrs from server
      catOptions: [], // category option transform from dto
      attrGroupOptions: [], // attribute groups transform from dto
      form: {
        spu_name: '',
        spu_title: '',
        supplier: '',
        spu_description: '',
        catalog_id: '',
        attr_group_id: '',
        img_url: '',
        price: '',
        publish_status: 1,
        printable_attr_ids: [],
      },
      basicAttrForm: [], // for store form value
      saleAttrForm: [], // for store form value
    }
  },
  watch: {
    $route: {
      handler(val, oldVal) {
        console.log('val,', val)
        console.log('oldvalue', oldVal)
        if (!val.query.id) {
          this.editId = 0
        }
      },
      deep: true,
    },
  },
  computed: {
    // only for display options
    basicAttr() {
      return this.attrs
        .filter(attr => attr.attr_type === 1)
        .map(attr => ({
          attrId: attr.id,
          attrName: attr.attr_name,
          attrValue: attr.value_select.split(','),
          selected: '',
        }))
    },
    // only for display options
    saleAttr() {
      return this.attrs
        .filter(attr => attr.attr_type === 0)
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

.generateSkuWrap {
  padding-left: 45px;
  padding-bottom: 10px;
}
.setPrice {
  display: flex;
  align-items: center;
}
.to {
  padding: 0 3px;
}
.wrap {
  background-color: white;
  padding: 20px 0 5px 0;
  border: 1px solid #dcdfe5;
  border-radius: 3px;
  .el-form-item__content {
    margin-bottom: 0 !important;
  }
  .el-form-item {
    margin-bottom: 0px !important;
  }
}
.setPrice {
  .addPriceWrap {
    padding-left: 10px;
  }
  .el-input-number {
    width: 140px !important;
  }
  .el-input-number__increase,
  .el-input-number__decrease {
    width: 20px !important;
  }
  .el-input-number .el-input__inner {
    padding-left: 30px !important;
    padding-right: 30px !important;
  }
}
.setPrice {
  margin-bottom: 15px;
}
.unit-row {
  display: flex;
  align-items: center;
}
</style>
