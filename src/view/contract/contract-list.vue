<template>
  <div>
    <!-- 列表页面 -->
    <div class="container">
      <div class="header"><div class="title">我的合同</div></div>
      <div class="search">
        <el-form :inline="true" class="form-inline" ref="searchForm" :model="searchForm">
          <el-form-item label="owned_by :" prop="owned_by">
            <el-select
              placeholder="owned_by"
              :loading="searchFormMeta.ownByLoading"
              v-model="searchForm.owned_by"
              clearable
            >
              <el-option
                v-for="item in searchFormMeta.ownByOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="PI_NO :" prop="PI_NO">
            <el-input placeholder="PI_NO" v-model="searchForm.PI_NO"></el-input>
          </el-form-item>
          <el-form-item label="payment_status :" prop="payment_status">
            <el-select placeholder="payment_status" v-model="searchForm.payment_status" clearable multiple>
              <el-option
                v-for="item in searchFormMeta.payment_statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="review_status :" prop="review_status">
            <el-select placeholder="review_status" v-model="searchForm.review_status" clearable multiple>
              <el-option
                v-for="item in searchFormMeta.review_statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="payment_method :" prop="payment_method">
            <el-select placeholder="payment_method" v-model="searchForm.payment_method" clearable multiple>
              <el-option
                v-for="item in searchFormMeta.payment_methodOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-tooltip class="item" effect="dark" content="按条件进行 AND 查询" placement="top">
              <el-button type="primary" @click="onSearch" :disabled="loading">查询</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="清空搜索输入值并重新查询" placement="top">
              <el-button type="primary" @click="onReset" :disabled="loading">重置</el-button>
            </el-tooltip>
          </el-form-item>
        </el-form>
      </div>
      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="id" width="150"> </el-table-column>
        <el-table-column prop="pino" label="PI No" width="150">
          <template slot-scope="scope">
            {{ scope.row.pino ? scope.row.pino : '无 PI NO' }}
          </template>
        </el-table-column>
        <el-table-column prop="ownedBy" label="ownedBy" width="150"> </el-table-column>
        <el-table-column prop="contract_time" label="contract_time" width="150"> </el-table-column>
        <el-table-column prop="delivery_time" label="delivery_time" width="150"> </el-table-column>
        <el-table-column prop="total_amount" label="total_amount" width="150"> </el-table-column>
        <el-table-column prop="actual_delivery_fee" label="actual_delivery_fee" width="150"> </el-table-column>
        <el-table-column prop="payment_method" label="payment_method" width="150"> </el-table-column>
        <el-table-column prop="payment_status" label="payment_status" width="150"> </el-table-column>
        <el-table-column prop="raw_cost" label="raw_cost" width="150"> </el-table-column>
        <el-table-column prop="review_status" label="review_status" width="150"> </el-table-column>
        <el-table-column prop="client_id" label="client_id" width="150"> </el-table-column>
        <el-table-column fixed="right" label="Operations" width="200">
          <template slot-scope="scope">
            <el-button plain type="primary" size="mini" @click.native.prevent.stop="handleEdit(scope)">
              Edit
            </el-button>
            <el-button plain type="primary" size="mini" @click.native.prevent.stop="handlePrint(scope.row.id)">
              打印
            </el-button>
            <el-button plain type="danger" size="mini" @click.native.prevent.stop="handleDelete(scope)"
              >Delete</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          :background="true"
          :page-size="pageCount"
          :current-page="currentPage"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total_nums"
          :page-sizes="pageSizes"
          @size-change="handleSizeChange"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import contract from '@/model/contract'
import client from '@/model/client'

export default {
  components: {},
  async created() {
    // todo: need user input sanitazation
    this.pageCount = Number(this.$route.query.pageCount) || this.pageCount
    this.currentPage = Number(this.$route.query.currentPage) || this.currentPage
    console.log('this.pageCount', this.pageCount)
    if (!this.pageSizes.includes(Number(this.pageCount))) {
      this.pageSizes = [this.pageCount].concat(this.pageSizes)
    }
    this.$router.push({
      name: 'ContractListMy',
      query: {
        currentPage: this.currentPage,
        pageCount: this.pageCount,
      },
    })
    this.onSearch()
    this.initSearchForm()
    this.operate = [
      { name: '编辑', func: 'handleEdit', type: 'primary' },
      {
        name: '删除',
        func: 'handleDelete',
        type: 'danger',
        permission: '删除图书',
      },
    ]
  },
  methods: {
    handleCurrentChange(val) {
      console.log('page change', val)
      this.currentPage = val
      this.$router.push({
        name: 'ContractListMy',
        query: {
          currentPage: this.currentPage,
          pageCount: this.pageCount,
        },
      })
      this.onSearch()
    },
    handleSizeChange(val) {
      this.pageCount = val
      this.$router.push({
        name: 'ContractListMy',
        query: {
          currentPage: this.currentPage,
          pageCount: this.pageCount,
        },
      })
      this.onSearch()
    },
    onReset() {
      this.$refs.searchForm.resetFields()
      this.onSearch()
    },
    async initSearchForm() {
      this.searchFormMeta.ownByLoading = true
      const userOptions = await client.listUserOptions()
      this.searchFormMeta.ownByLoading = false
      console.log(userOptions)
      this.searchFormMeta.ownByOptions = userOptions
    },
    handlePrint(id) {
      this.$router.push({
        path: '/download',
        query: {
          contractId: id,
        },
      })
    },
    async onSearch() {
      this.loading = true
      const page = this.currentPage - 1
      const res = await contract.search(this.pageCount, page, this.searchForm)
      this.loading = false
      this.tableData = res.items
      this.total_nums = res.total
    },
    handleEdit(val) {
      console.log('val', val)
      const editBookID = val.row.id
      this.$router.push({
        path: '/contract/edit',
        query: {
          id: editBookID,
        },
      })
    },
    async getContract() {
      this.loading = true
      const res = await contract.list()
      this.loading = false
      this.tableData = res
    },
    handleDelete(val) {
      this.$confirm('此操作将永久删除该合同, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await contract.delete(val.row.id)
        if (res.code < window.MAX_SUCCESS_CODE) {
          await this.getContract()
          this.$message({
            type: 'success',
            message: `${res.message}`,
          })
        }
      })
    },
  },
  data() {
    return {
      pageSizes: [10, 20, 30, 50],
      total_nums: 0, // 分组内的用户总数
      currentPage: 1, // 默认获取第一页的数据
      pageCount: 10, // 每页10条数据
      tableColumn: [
        { prop: 'contract_time', label: '合同日期' },
        { prop: 'delivery_time', label: '交期' },
        { prop: 'total_amount', label: '总金额' },
        { prop: 'actual_delivery_fee', label: '实际运费' },
        { prop: 'payment_method', label: '付款方式' },
        { prop: 'payment_status', label: '付款状态' },
        { prop: 'raw_cost', label: '成本' },
        { prop: 'review_status', label: '审核状态' },
        { prop: 'client_id', label: '客户ID' },
      ],
      searchFormMeta: {
        ownByLoading: true,
        ownByOptions: [],
        payment_statusOptions: [
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
        review_statusOptions: [
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
        payment_methodOptions: [
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
      },
      searchForm: {
        owned_by: null,
        PI_NO: null,
        payment_status: null,
        review_status: null,
        payment_method: null,
      },
      loading: true,
      tableData: [],
      operate: [],
      showEdit: false,
      editBookID: 1,
    }
  },
  mounted() {
    console.log('mountd')
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
