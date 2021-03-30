<template>
  <div>
    <!-- 列表页面 -->
    <div class="container" v-if="!showEdit">
      <div class="header"><div class="title">产品列表</div></div>
      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="spu_name" label="SPU" width="150"> </el-table-column>
        <el-table-column prop="spu_title" label="商品名称" width="150"> </el-table-column>
        <el-table-column label="产品图片" width="120">
          <template slot-scope="scope">
            <el-image style="width: 100px; height: 100px" :src="scope.row.img_url" fit="cover"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="catalog_id" label="产品分类" width="120"> </el-table-column>
        <el-table-column prop="price" label="价格区间" width="120"> </el-table-column>
        <el-table-column width="120" label="是否上架">
          <template slot-scope="props">
            <el-switch :value="props.row.publish_status == 1" active-color="#3963bc"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="spu_description" label="产品描述" width="200"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="170">
          <template slot-scope="scope">
            <div class="operation-row">
              <el-button plain type="primary" size="mini" @click.native.prevent.stop="handleView(scope.row.id)">
                查看
              </el-button>
              <el-button
                v-permission="['新增产品']"
                plain
                type="primary"
                size="mini"
                @click.native.prevent.stop="handleEdit(scope.row.id)"
              >
                编辑
              </el-button>
            </div>
            <div class="operation-row">
              <el-button
                v-permission="['新增产品']"
                plain
                type="primary"
                size="mini"
                @click.native.prevent.stop="handleDrawer(scope.row.id)"
              >
                文件
              </el-button>
              <el-button
                v-permission="['新增产品']"
                plain
                type="danger"
                size="mini"
                @click.native.prevent.stop="handleDelete(scope.row.id)"
                >删除</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--file drawer-->
    <el-drawer title="产品关联的文件" :visible.sync="showDrawer" direction="rtl" :before-close="handleClose">
      <div>
        <input ref="fileInput" type="file" :disabled="isFileUploading" />
        <button @click="handleUpload" :disabled="isFileUploading">
          {{ isFileUploading ? 'uploading' : 'upload' }}
        </button>
      </div>
      <el-table :data="fileList" style="width: 100%">
        <el-table-column prop="fileName" label="文件名" width="180"> </el-table-column>
        <el-table-column label="下载" width="180">
          <template slot-scope="scope">
            <a :href="scope.row.fileUrl" target="_blank">downlnoad</a>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>

    <el-dialog title="产品详情" :visible.sync="dialogTableVisible" @close="viewProductClose">
      <div class="product-preview">
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
          <h3>SKU 列表</h3>
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
    </el-dialog>
  </div>
</template>

<script>
import product from '@/model/product'
import category from '@/model/category'

export default {
  components: {},
  async created() {
    await this.getProducts()
    const res = await category.getSecondLevelCategories()
    this.categoryFromServer = res
  },
  methods: {
    getCategoryNameById(id) {
      const match = this.categoryFromServer.filter(cate => String(cate.id) === String(id))
      return match[0].name
    },
    async handleView(id) {
      this.dialogTableVisible = true
      const res = await product.getProductDetail(id)
      console.log('res', res)
      this.productDetailFromServer = res
    },
    viewProductClose() {
      this.dialogTableVisible = false
      this.productDetailFromServer = {}
    },
    handleDelete(id) {
      this.$confirm('此操作将永久删除该产品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await product.deleteProduct(id)
        if (res.code < window.MAX_SUCCESS_CODE) {
          this.getProducts()
          this.$message({
            type: 'success',
            message: `${res.message}`,
          })
        }
      })
    },
    async getProducts() {
      try {
        const products = await product.getProducts()
        this.tableData = products
      } catch (error) {
        if (error.code === 10020) {
          this.tableData = []
        }
      }
    },
    handleEdit(productId) {
      this.$router.push({ path: '/product/edit', query: { id: productId } })
    },
    handleDrawer(productId) {
      this.showDrawer = true
      this.showDrawerForSpuId = productId
      this.getFileList()
      console.log(productId)
    },
    async getFileList() {
      console.log(this.showDrawerForSpuId)
      const res = await product.getFileBySpuId(this.showDrawerForSpuId)
      this.fileList = res.map(item => ({
        fileName: item.file_name,
        fileUrl: item.file_url,
      }))
    },
    handleChange() {
      console.log('file list here')
      console.log(this.$refs.upload.fileList)
    },
    handleUpload() {
      const { files } = this.$refs.fileInput
      console.log(files)
      this.sendRequest(files[0])
    },
    sendRequest(file) {
      const self = this
      self.isFileUploading = true
      console.log('sending request')
      return this.$axios({
        method: 'post',
        url: '/cms/file',
        data: {
          [file.name]: file,
        },
      }).then(async res => {
        console.log('result:', res)
        await product.createFileForSpu({
          spu_id: self.showDrawerForSpuId,
          file_name: res[0].key,
          file_url: res[0].url,
        })
        self.isFileUploading = false
        self.getFileList()
      })
    },
  },
  data() {
    return {
      basicAttrList: [
        {
          attr_name: 'projecting size',
          attr_value: '100px',
        },
      ],
      categoryFromServer: [],
      dialogTableVisible: false,
      productDetailFromServer: {},
      showDrawer: false,
      showDrawerForSpuId: '',
      isFileUploading: false,
      tableColumn: [
        {
          prop: 'spu_name',
          label: 'SPU',
        },
        {
          prop: 'img_url',
          label: '产品图片',
        },
        {
          prop: 'price',
          label: '价格区间',
        },
        {
          prop: 'catalog_id',
          label: '分类ID',
        },
      ],
      tableData: [],
      operate: [
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
      fileList: [
        {
          fileName: 'a16 文件',
          fileUrl: 'http://www.baidu.com/a16.zip',
        },
        {
          fileName: 'a17 文件',
          fileUrl: 'http://www.baidu.com/a16.zip',
        },
        {
          fileName: 'a18 文件',
          fileUrl: 'http://www.baidu.com/a16.zip',
        },
      ],
    }
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

.basic-info-wrap {
  display: flex;
}

.text-wrap {
  padding: 0 30px;
  flex: 1;
}

.row {
  font-size: 16px;
  margin-bottom: 10px;
  width: 100%;
}

tr.el-table__row.attr-row {
  height: 35px !important;
}

tr.attr-header {
  height: 40px !important;
}

.text-wrap .attr {
  margin-top: 25px;
}

h3 {
  font-size: 25px;
  padding: 20px 0 8px 0;
  font-weight: 500;
  border-bottom: 1px solid #5a6c8e;
}
</style>
