<template>
  <div>
    <!-- 列表页面 -->
    <div class="container">
      <div class="header"><div class="title">我的合同</div></div>
      <div class="search">
        <el-form :inline="true" class="form-inline" ref="searchForm" :model="searchForm">
          <el-form-item
            v-for="(field, index) in searchFields"
            :key="field.name"
            :label="field.displayName + ' :'"
            :prop="field.name"
          >
            <div class="flex-middle">
              <div>
                <el-select
                  :loading="field.loading"
                  v-model="searchForm[field.name]"
                  clearable
                  multiple
                  v-if="field.type === 'Connect'"
                >
                  <el-option v-for="item in field.options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <el-input v-model="searchForm[field.name]" v-if="field.type === 'String'"></el-input>
                <el-select v-model="searchForm[field.name]" clearable multiple v-if="field.type === 'Enum'">
                  <el-option v-for="item in field.options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div>
                <span class="delete-icon-wrap" @click="handleDeleteField(index)"><i class="el-icon-delete"></i></span>
              </div>
            </div>
          </el-form-item>
          <!--          <el-form-item label="owned_by :" prop="owned_by">-->
          <!--            <div class="flex-middle">-->
          <!--              <div>-->
          <!--                <el-select-->
          <!--                  placeholder="owned_by"-->
          <!--                  :loading="searchFormMeta.ownByLoading"-->
          <!--                  v-model="searchForm.owned_by"-->
          <!--                  clearable-->
          <!--                  multiple-->
          <!--                >-->
          <!--                  <el-option-->
          <!--                    v-for="item in searchFormMeta.ownByOptions"-->
          <!--                    :key="item.value"-->
          <!--                    :label="item.label"-->
          <!--                    :value="item.value"-->
          <!--                  >-->
          <!--                  </el-option>-->
          <!--                </el-select>-->
          <!--              </div>-->
          <!--              <div>-->
          <!--                <span class="delete-icon-wrap"><i class="el-icon-delete"></i></span>-->
          <!--              </div>-->
          <!--            </div>-->
          <!--          </el-form-item>-->
          <!--          <el-form-item label="PI_NO :" prop="PI_NO">-->
          <!--            <div class="flex-middle">-->
          <!--              <div>-->
          <!--                <el-input placeholder="PI_NO" v-model="searchForm.PI_NO"></el-input>-->
          <!--              </div>-->
          <!--              <div>-->
          <!--                <span class="delete-icon-wrap"><i class="el-icon-delete"></i></span>-->
          <!--              </div>-->
          <!--            </div>-->
          <!--          </el-form-item>-->
          <!--          <el-form-item label="payment_status :" prop="payment_status">-->
          <!--            <el-select placeholder="payment_status" v-model="searchForm.payment_status" clearable multiple>-->
          <!--              <el-option-->
          <!--                v-for="item in searchFormMeta.payment_statusOptions"-->
          <!--                :key="item.value"-->
          <!--                :label="item.label"-->
          <!--                :value="item.value"-->
          <!--              >-->
          <!--              </el-option>-->
          <!--            </el-select>-->
          <!--          </el-form-item>-->
          <!--          <el-form-item label="review_status :" prop="review_status">-->
          <!--            <el-select placeholder="review_status" v-model="searchForm.review_status" clearable multiple>-->
          <!--              <el-option-->
          <!--                v-for="item in searchFormMeta.review_statusOptions"-->
          <!--                :key="item.value"-->
          <!--                :label="item.label"-->
          <!--                :value="item.value"-->
          <!--              >-->
          <!--              </el-option>-->
          <!--            </el-select>-->
          <!--          </el-form-item>-->
          <!--          <el-form-item label="payment_method :" prop="payment_method">-->
          <!--            <el-select placeholder="payment_method" v-model="searchForm.payment_method" clearable multiple>-->
          <!--              <el-option-->
          <!--                v-for="item in searchFormMeta.payment_methodOptions"-->
          <!--                :key="item.value"-->
          <!--                :label="item.label"-->
          <!--                :value="item.value"-->
          <!--              >-->
          <!--              </el-option>-->
          <!--            </el-select>-->
          <!--          </el-form-item>-->
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
      <div class="main-operation-row">
        <el-button>导入数据</el-button>
        <el-button>导出数据</el-button>
        <el-button>刷新</el-button>
        <el-button>列设置</el-button>
      </div>
      <div class="export-row" v-if="selectionList.length > 0">
        <el-row type="flex" justify="space-between" align="middle">
          <el-col :span="6"> 已选中 {{ selectionList.length }} 项 </el-col>
          <el-col :span="6">
            <div class="selection-button-wrap">
              <el-button>删除文档</el-button>
              <el-button>导出数据</el-button>
              <el-button @click="toggleSelection">取消选择</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <!-- 表格 -->
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="loading"
        @sort-change="onSortchange"
        @selection-change="handleSelectionChange"
        ref="dataTable"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <!--        <el-table-column prop="id" label="id" width="150" sortable="custom"> </el-table-column>-->
        <!--        <el-table-column prop="pino" label="PI No" width="150" sortable="custom">-->
        <!--          <template slot-scope="scope">-->
        <!--            {{ scope.row.pino ? scope.row.pino : '无 PI NO' }}-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <template v-for="field in fields">
          <template v-if="!field.isHidden">
            <el-table-column
              :key="field.name"
              :prop="field.name"
              :label="field.displayName"
              width="150"
              :sortable="field.sortable ? 'custom' : false"
            >
            </el-table-column>
          </template>
        </template>
        <!--        <el-table-column v-for="field in fields" :key="field.name" :prop="field.name" :label="field.displayName" width="150" :sortable="field.sortable ? 'custom' : false"> </el-table-column>-->
        <!--        <el-table-column prop="ownedBy" label="ownedBy" width="150"> </el-table-column>-->
        <!--        <el-table-column prop="contract_time" label="contract_time" width="150" sortable="custom"> </el-table-column>-->
        <!--        <el-table-column prop="delivery_time" label="delivery_time" width="150" sortable="custom"> </el-table-column>-->
        <!--        <el-table-column prop="total_amount" label="total_amount" width="150" sortable="custom"> </el-table-column>-->
        <!--        <el-table-column prop="actual_delivery_fee" label="actual_delivery_fee" width="150" sortable="custom">-->
        <!--        </el-table-column>-->
        <!--        <el-table-column prop="payment_method" label="payment_method" width="150" sortable="custom"> </el-table-column>-->
        <!--        <el-table-column prop="payment_status" label="payment_status" width="150" sortable="custom"> </el-table-column>-->
        <!--        <el-table-column prop="raw_cost" label="raw_cost" width="150" sortable="custom"> </el-table-column>-->
        <!--        <el-table-column prop="review_status" label="review_status" width="150" sortable="custom"> </el-table-column>-->
        <!--        <el-table-column prop="client_id" label="client_id" width="150" sortable="custom"> </el-table-column>-->
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button plain type="primary" size="mini" @click.native.prevent.stop="handleEdit(scope)">
              编辑
            </el-button>
            <el-button plain type="danger" size="mini" @click.native.prevent.stop="handleDelete(scope)">删除</el-button>
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
    if (!this.pageSizes.includes(Number(this.pageCount))) {
      this.pageSizes = [this.pageCount].concat(this.pageSizes)
    }
    this.$router.push({
      name: 'template',
      query: {
        currentPage: this.currentPage,
        pageCount: this.pageCount,
      },
    })
    this.onSearch()
    this.initSearchForm()
  },
  methods: {
    onSortchange(val1) {
      this.searchForm.sort = val1.prop
      if (this.searchForm.sort === 'pino') {
        this.searchForm.sort = 'PI_NO'
      }
      let order
      if (val1.order === 'ascending') {
        order = 'ASC'
      } else if (val1.order === 'descending') {
        order = 'DESC'
      }
      this.searchForm.order = order
      this.onSearch()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.onSearch()
    },
    handleSizeChange(val) {
      this.pageCount = val
      this.onSearch()
    },
    onReset() {
      this.$refs.searchForm.resetFields()
      // this.searchFields.forEach((item, index) => {
      //   this.searchFields[index].vmodel = null
      // })
      this.onSearch()
    },
    async initSearchForm() {
      let targetIndex
      for (let i = 0; i < this.searchFields.length - 1; i++) {
        const currentField = this.searchFields[i]
        if (currentField.name === 'owned_by') {
          targetIndex = i
        }
      }
      this.searchFields[targetIndex].loading = true
      const userOptions = await client.listUserOptions()
      console.log('list user', userOptions)
      this.searchFields[targetIndex].loading = false
      this.searchFields[targetIndex].options = userOptions
    },
    async onSearch() {
      this.$router.push({
        name: 'template',
        query: {
          currentPage: this.currentPage,
          pageCount: this.pageCount,
        },
      })
      this.loading = true
      const page = this.currentPage - 1
      // const newSearchform = {}
      // this.searchFields.forEach(item => {
      //   newSearchform[item.name] = item.vmodel
      // })
      const res = await contract.search(this.pageCount, page, this.searchForm)
      this.loading = false
      this.tableData = res.items
      this.total_nums = res.total
    },
    handleEdit(val) {
      const editId = val.row.id
      this.$router.push({
        path: '/contract/edit',
        query: {
          id: editId,
        },
      })
    },
    handleDelete(val) {
      this.$confirm('此操作将永久删除该合同, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await contract.delete(val.row.id)
        if (res.code < window.MAX_SUCCESS_CODE) {
          await this.onSearch()
          this.$message({
            type: 'success',
            message: `${res.message}`,
          })
        }
      })
    },
    handleSelectionChange(val) {
      console.log('selection change', val)
      this.selectionList = val
    },
    toggleSelection() {
      this.$refs.dataTable.clearSelection()
    },
  },
  data() {
    return {
      pageSizes: [10, 20, 30, 50],
      total_nums: 0, // 分组内的用户总数
      currentPage: 1, // 默认获取第一页的数据
      pageCount: 10, // 每页10条数据
      searchForm: {}, // this form is computed by search fields
      searchFields: [
        {
          displayName: '业务员',
          name: 'owned_by',
          type: 'Connect',
          loading: true,
          options: [],
        },
        {
          displayName: 'PI编号',
          name: 'PI_NO',
          type: 'String',
        },
        {
          displayName: '付款状态',
          name: 'payment_status',
          type: 'Enum',
          options: [
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
        },
        {
          displayName: '审核状态',
          name: 'review_status',
          type: 'Enum',
          options: [
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
        },
        {
          displayName: '付款方式',
          name: 'payment_method',
          type: 'Enum',
          options: [
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
      ],
      fields: [
        {
          name: 'id',
          displayName: 'id',
          isHidden: true,
          sortable: true,
        },
        {
          name: 'pino',
          displayName: 'PI编号',
          isHidden: false,
          sortable: true,
        },
        {
          name: 'ownedBy',
          displayName: '业务员',
          isHidden: false,
          sortable: false,
        },
        {
          name: 'contract_time',
          displayName: '合同时间',
          isHidden: false,
          sortable: true,
        },
        {
          name: 'delivery_time',
          displayName: '收货时间',
          isHidden: false,
          sortable: true,
        },
        {
          name: 'total_amount',
          displayName: '总金额',
          isHidden: false,
          sortable: true,
        },
        {
          name: 'actual_delivery_fee',
          displayName: '实际运费',
          isHidden: false,
          sortable: true,
        },
        {
          name: 'payment_method',
          displayName: '付款方式',
          isHidden: false,
          sortable: true,
        },
        {
          name: 'payment_status',
          displayName: '支付状态',
          isHidden: false,
          sortable: true,
        },
        {
          name: 'raw_cost',
          displayName: '成本价',
          isHidden: false,
          sortable: true,
        },
        {
          name: 'review_status',
          displayName: '审核状态',
          isHidden: false,
          sortable: true,
        },
        {
          name: 'client_id',
          displayName: '客户ID',
          isHidden: true,
          sortable: true,
        },
      ],
      loading: true, // main table loading status
      tableData: [],
      selectionList: [],
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

.selection-button-wrap {
  text-align: right;
}

.export-row {
  padding: 12px 24px;
  background-color: rgb(230, 244, 255);
  border: 1px solid rgb(122, 186, 255);
  margin-bottom: 15px;
}

.delete-icon-wrap {
  display: inline-block;
  cursor: pointer;
  margin: 0 7px;
}

.flex-middle {
  display: flex;
  align-items: center;
}
</style>
