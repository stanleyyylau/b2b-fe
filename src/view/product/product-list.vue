<template>
  <div>
    <!-- 列表页面 -->
    <div class="container" v-if="!showEdit">
      <div class="header"><div class="title">产品列表</div></div>
      <!-- 表格 -->
        <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="spu_name"
          label="SPU"
          width="150">
        </el-table-column>
        <el-table-column
          prop="spu_title"
          label="商品名称"
          width="150">
        </el-table-column>
        <el-table-column
          label="产品图片"
          width="120">
          <template slot-scope="scope">
            <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.img_url"
            fit="cover"></el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="catalog_id"
          label="产品分类"
          width="120">
        </el-table-column>
        <el-table-column
          prop="price"
          label="价格区间"
          width="120">
        </el-table-column>
        <el-table-column
        width="120"
        label="是否上架"
        >
        <template slot-scope="props">
              <el-switch
                :value="props.row.publish_status == 1"
                active-color="#3963bc"
              ></el-switch>
            </template>
        </el-table-column>
        <el-table-column
          prop="spu_description"
          label="产品描述"
          width="200">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="Operations"
          width="170">
          <template slot-scope="scope">
            <el-button plain type="primary" size="mini"
                       @click.native.prevent.stop="handleEdit(scope.row.id)"
            >
              Edit
            </el-button>
            <el-button plain type="danger" size="mini">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>

<script>
import product from '@/model/product'

export default {
  components: {
  },
  async created() {
    await this.getProducts()
  },
  methods: {
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
    }
  },
  data() {
    return {
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
    }
  }
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
