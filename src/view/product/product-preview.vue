<template>
  <div class="container">
    <div class="top-row">
      <el-button @click="back" type="primary">返回</el-button>
    </div>
    <div class="product-preview" v-loading="loading">
      <div class="basic-info-wrap">
        <div class="img-wrap">
          <el-image style="width: 350px; height: 350px" :src="productDetailFromServer.img_url" fit="scale-down">
          </el-image>
        </div>
        <div class="text-wrap">
          <div class="basic">
            <div class="row">型号: {{ productDetailFromServer.spu_name }}</div>
            <div class="row">分类: {{ productDetailFromServer.catalog_id }}</div>
            <div class="row">标题: {{ productDetailFromServer.spu_title }}</div>
            <div class="row">证书: {{ productDetailFromServer.certificates }}</div>
            <!--              <div class="row">供应商: {{ productDetailFromServer.supplier }}</div>-->
            <div class="row">
              {{ productDetailFromServer.spu_description }}
            </div>
          </div>
          <div class="attr">
            <el-table
              :data="productDetailFromServer.basic_attr_list"
              header-row-class-name="attr-header"
              row-class-name="attr-row"
              border
              style="width: 100%"
            >
              <el-table-column prop="attr_name" label="属性名"> </el-table-column>
              <el-table-column prop="attr_value" label="属性值"> </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="sku-list-wrap">
        <h3 class="h3">SKU 列表</h3>
        <el-card class="box-card">
          <div class="skuTableWrap">
            <el-table :data="skuList" border style="width: 100%">
              <el-table-column prop="salesAttrs" width="200px" label="销售属性">
                <template slot-scope="scope">
                  <div v-for="attr in scope.row.sale_attr_list" :key="attr.id">
                    {{ attr.attr_name }} : {{ attr.attr_value }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="sku" label="编号"></el-table-column>
              <el-table-column prop="skuName" label="名字"></el-table-column>
              <el-table-column prop="product_size" label="Product Size"></el-table-column>
              <el-table-column prop="salesAttrs" width="130px" label="价格">
                <template slot-scope="scope">
                  <div v-for="price in scope.row.price_list" :key="price.id">
                    {{ price.start_count }} - {{ price.end_count }} : {{ price.price }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="size" label="Package Size"></el-table-column>
              <el-table-column prop="weight" label="Package Weight"></el-table-column>
              <el-table-column prop="quantity_per_carton" label="quantity_per_carton"></el-table-column>
              <el-table-column prop="net_weight_per_carton" label="net_weight_per_carton"></el-table-column>
              <el-table-column prop="gross_weight_per_carton" label="gross_weight_per_carton"></el-table-column>
              <el-table-column prop="carton_measurement" label="carton_measurement"></el-table-column>
              <el-table-column prop="carton_size" label="carton_size"></el-table-column>
            </el-table>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import product from '@/model/product'
import category from '@/model/category'

export default {
  data() {
    return {
      loading: true,
      productDetailFromServer: {},
    }
  },
  async created() {
    this.init().then(r => r)
  },
  methods: {
    back() {
      this.$router.back()
    },
    getCategoryNameById(id) {
      const match = this.categoryFromServer.filter(cate => String(cate.id) === String(id))
      return match[0].name
    },
    findCateNameById(cateId) {
      console.log('hihihi')
      const result = this.cates.filter(item => String(item.id) === String(cateId))
      if (result.length > 0) {
        return result[0].name
      }
      return `catID: ${cateId} not found`
    },
    async init() {
      this.loading = true
      const id = Number(this.$router.history.current.query.id) || 0
      const catRes = await category.getSecondLevelCategories()
      this.cates = catRes
      this.categoryFromServer = catRes
      const res = await product.getProductDetail(id)
      this.productDetailFromServer = res
      this.loading = false
      console.log('re', res)
      console.log('compute res', res)
    },
  },
  computed: {
    skuList() {
      if (this.productDetailFromServer.sku_list == null) return []
      return this.productDetailFromServer.sku_list.map(sku => ({
        ...sku,
        catalog_id: this.getCategoryNameById(this.productDetailFromServer.catalog_id),
        price: sku.price_list.map(price => `${price.start_count} - ${price.end_count}: ${price.price}`).join(','),
        sale_attr: sku.sale_attr_list.map(attr => `${attr.attr_name}:${attr.attr_value}`).join(','),
      }))
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 30px;
  padding-bottom: 100px;
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

  .operation-row {
    padding: 3px 0;
  }
}

.top-row {
  padding: 10px 0;
}

.row {
  padding: 5px 0;
}

.h3 {
  padding: 20px 0;
  font-size: 20px;
  text-align: center;
}

.attr {
  max-width: 800px;
  margin: 20px auto 0px auto;
}

.basic-info-wrap {
  text-align: center;
}
</style>
