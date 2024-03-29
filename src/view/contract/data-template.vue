<template>
  <div v-if="!showAddOrUpdate">
    <!-- 列表页面 -->
    <div class="container">
      <div class="header">
        <div class="title">{{ pageTitle }}</div>
      </div>
      <div class="search" v-if="activeSearchFields.length > 0">
        <el-form :inline="true" class="form-inline" ref="searchForm" :model="searchForm" inline-message>
          <template v-for="field in activeSearchFieldsFullData">
            <el-form-item :key="field.name" :label="field.displayName + ' :'" :prop="field.name">
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
                  <span class="delete-icon-wrap" @click="onSearchFieldRemove(field.name)"
                    ><i class="el-icon-delete"></i
                  ></span>
                </div>
              </div>
            </el-form-item>
          </template>
          <el-form-item>
            <el-tooltip class="item" effect="dark" content="删除所有检索条件" placement="top">
              <el-button type="plain" @click="onEmptySearchFields">删除</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="按条件进行 AND 查询" placement="top">
              <el-button type="primary" @click="onSearch" :disabled="loading">查询</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="清空搜索输入值并重新查询" placement="top">
              <el-button type="primary" @click="onReset" :disabled="loading">重置</el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="保存检索条件到浏览器，下次无需再一个个添加检索"
              placement="top"
            >
              <el-button type="primary" @click="onSearchFieldSave" v-if="showSaveSearchButton">保存</el-button>
            </el-tooltip>
          </el-form-item>
        </el-form>
      </div>
      <div class="main-operation-row">
        <el-dropdown :hide-on-click="false" trigger="click" class="addSearchButton">
          <el-button type="primary" icon="el-icon-aim">
            添加检索
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="field in searchFields" :key="field.name">
              <el-button type="text" @click="onAddSearchField(field.name)">{{ field.displayName }}</el-button>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button type="primary" @click="importDialog = true">导入数据</el-button>
        <el-button type="primary" @click="exportAllVisible = true">导出数据</el-button>
        <el-button
          @click="onSearch"
          :disabled="loading"
          icon="el-icon-refresh"
          round
          class="refresh-button"
        ></el-button>
        <el-dropdown :hide-on-click="false" trigger="click">
          <el-button icon="el-icon-s-tools" round class="refresh-button"></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <el-button type="text" @click="onDisplayFieldsSave">保存</el-button>
            </el-dropdown-item>
            <el-dropdown-item v-for="field in fields" :key="field.name">
              <el-checkbox v-model="field.isShow">{{ field.displayName }}</el-checkbox>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
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
        <!-- main columns-->
        <el-table-column type="selection" width="55"> </el-table-column>
        <template v-for="field in fields">
          <template v-if="field.isShow">
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

        <!-- 操作 custom these-->
        <!-- Todo: customize when needed-->
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button plain type="primary" size="mini" @click.native.prevent.stop="handleEdit(scope)">
              编辑
            </el-button>
            <el-button plain type="danger" size="mini" @click.native.prevent.stop="handleDelete(scope)">删除</el-button>
          </template>
        </el-table-column>

        <!-- end table-->
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

    <!-- import -->
    <import-csv
      :fail-list="failList"
      :success-list="successList"
      :fields="csvFields"
      :goodCSVTable="goodCSVTable"
      :import-confirm="importConfirm"
      :import-dialog="importDialog"
      :is-importing="isImporting"
      :on-reimport="onReimport"
      @onCSV="onCSV"
      @onClose="importDialog = false"
    />

    <!-- export all-->
    <el-dialog title="导出数据" :visible.sync="exportAllVisible" width="30%">
      <span>将全量导出数据，会花费一段时间，是否继续</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="exportAllVisible = false">取 消</el-button>
        <el-button type="primary" @click="onExportAllConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
  <div v-else>
    <add-or-update :editId="editId"></add-or-update>
  </div>
</template>

<script>
import localStore from '@/model/local'
import importCsv from '@/component/common/import-csv'
// todo: change model when needed
import contract from '@/model/contract'
import client from '@/model/client'
import AddOrUpdate from './data-add-or-update'

export default {
  components: {
    importCsv,
    AddOrUpdate,
  },
  async created() {
    if (this.$route.query.editId) {
      console.log(this.$route.query.editId)
      this.editId = this.$route.query.editId
      this.showAddOrUpdate = true
      return
    }
    // todo: need user input sanitazation
    this.pageCount = Number(this.$route.query.pageCount) || this.pageCount
    this.currentPage = Number(this.$route.query.currentPage) || this.currentPage
    if (!this.pageSizes.includes(Number(this.pageCount))) {
      this.pageSizes = [this.pageCount].concat(this.pageSizes)
    }
    this.$router.push({
      name: this.currentRouteName,
      query: {
        currentPage: this.currentPage,
        pageCount: this.pageCount,
      },
    })
    this.onSearch()
    this.initSearchForm()
    this.asyncLocalDb()
  },
  methods: {
    onSearchFieldRemove(fieldName) {
      this.activeSearchFields = this.activeSearchFields.filter(item => item !== fieldName)
    },
    asyncLocalDb() {
      const activeSearchFields = localStore.get(this.activeSearchFieldsKey)
      if (activeSearchFields && activeSearchFields instanceof Array) {
        this.activeSearchFields = activeSearchFields
      }
      const displayFields = localStore.get(this.displayFieldsKey)
      if (displayFields && displayFields instanceof Array) {
        this.fields.forEach(field => {
          if (displayFields.includes(field.name)) {
            field.isShow = true
          } else {
            field.isShow = false
          }
        })
      }
    },
    onSortchange(val1) {
      this.searchForm.sort = val1.prop
      // todo: change if needed
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
    onDisplayFieldsSave() {
      const displayFieldsName = this.fields.filter(item => item.isShow).map(item => item.name)
      localStore.put(this.displayFieldsKey, displayFieldsName)
      this.$message('保存成功')
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.onSearch()
    },
    handleSizeChange(val) {
      this.pageCount = val
      this.onSearch()
    },
    onEmptySearchFields() {
      this.activeSearchFields = []
      this.$confirm('是否删除保存的检索条件?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        localStore.delete(this.activeSearchFieldsKey)
        this.$message('删除成功')
      })
    },
    onReset() {
      this.$refs.searchForm.resetFields()
      // this.searchFields.forEach((item, index) => {
      //   this.searchFields[index].vmodel = null
      // })
      this.onSearch()
    },
    onAddSearchField(fieldName) {
      // const isExist = this.searchFields.filter(item => item.name === field.name)
      // if (isExist.length > 0) {
      //   return this.$message.warning('请勿重复添加')
      // }
      // this.searchFields = [...this.searchFields, field]
      if (this.activeSearchFields.includes(fieldName)) {
        return this.$message.warning('请勿重复添加')
      }
      this.activeSearchFields.push(fieldName)
    },
    onSearchFieldSave() {
      const activeSearchFieldNames = [...this.activeSearchFields]
      localStore.put(this.activeSearchFieldsKey, activeSearchFieldNames)
      this.activeSearchFields = activeSearchFieldNames
      this.$message('保存成功')
    },
    async onExportAllConfirm() {
      this.exportAllVisible = false
      this.loading = true
      console.log('export all data confirm')
      const res = await contract.exportAll()
      this.download(res, `${new Date().getTime()}.csv`)
      this.loading = false
    },
    download(data, filename = 'data.csv') {
      if (!data) {
        return
      }
      const blob = data
      const reader = new FileReader()
      reader.readAsDataURL(blob) // base64
      reader.onload = function (e) {
        const a = document.createElement('a')
        a.download = filename
        a.href = e.target.result
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
    },
    async initSearchForm() {
      // todo: change if needed
      let targetIndex
      for (let i = 0; i < this.searchFields.length - 1; i++) {
        const currentField = this.searchFields[i]
        if (currentField.name === 'owned_by') {
          targetIndex = i
        }
      }
      this.searchFields[targetIndex].loading = true
      // todo: change if needed
      const userOptions = await client.listUserOptions()
      console.log('list user', userOptions)
      this.searchFields[targetIndex].loading = false
      this.searchFields[targetIndex].options = userOptions
    },
    async onSearch() {
      this.$router.push({
        name: this.currentRouteName,
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
      // todo: change this
      const res = await contract.search(this.pageCount, page, this.searchForm)
      this.loading = false
      this.tableData = res.items
      this.total_nums = res.total
    },
    handleEdit(val) {
      const editId = val.row.id
      // todo: change when needed
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
        // todo: change when needed
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
    // csv module
    onCSV(table) {
      this.csvTable = table
    },
    async importConfirm() {
      this.isImporting = true
      try {
        // todo: change when needed
        const res = await client.importClientToSea(this.goodCSVTable)
        this.successList = res.successList
        this.failList = [...this.badCSVTable, ...res.failList]
      } catch (e) {
        console.log(e)
      }
      this.isImporting = false
    },
    onReimport() {
      this.successList = []
      this.failList = []
      this.csvTable = []
    },
  },
  data() {
    return {
      pageTitle: '我的合同',
      currentRouteName: 'template',
      activeSearchFieldsKey: 'template-searchFieldsActive',
      displayFieldsKey: 'template-displayFields',
      pageSizes: [10, 20, 30, 50],
      total_nums: 0, // 分组内的用户总数
      currentPage: 1, // 默认获取第一页的数据
      pageCount: 10, // 每页10条数据
      searchForm: {}, // this form is computed by search fields
      activeSearchFields: [], // computed
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
      ], // todo: change when needed
      fields: [
        {
          name: 'id',
          displayName: 'id',
          isHidden: true,
          isShow: false,
          sortable: true,
        },
        {
          name: 'pino',
          displayName: 'PI编号',
          isHidden: false,
          isShow: true,
          sortable: true,
        },
        {
          name: 'ownedBy',
          displayName: '业务员',
          isHidden: false,
          isShow: true,
          sortable: false,
        },
        {
          name: 'contract_time',
          displayName: '合同时间',
          isHidden: false,
          isShow: true,
          sortable: true,
        },
        {
          name: 'delivery_time',
          displayName: '收货时间',
          isHidden: false,
          isShow: true,
          sortable: true,
        },
        {
          name: 'total_amount',
          displayName: '总金额',
          isHidden: false,
          isShow: true,
          sortable: true,
        },
        {
          name: 'actual_delivery_fee',
          displayName: '实际运费',
          isHidden: false,
          isShow: true,
          sortable: true,
        },
        {
          name: 'payment_method',
          displayName: '付款方式',
          isHidden: false,
          isShow: true,
          sortable: true,
        },
        {
          name: 'payment_status',
          displayName: '支付状态',
          isHidden: false,
          isShow: true,
          sortable: true,
        },
        {
          name: 'raw_cost',
          displayName: '成本价',
          isHidden: false,
          isShow: true,
          sortable: true,
        },
        {
          name: 'review_status',
          displayName: '审核状态',
          isHidden: false,
          isShow: true,
          sortable: true,
        },
        {
          name: 'client_id',
          displayName: '客户ID',
          isHidden: true,
          isShow: false,
          sortable: true,
        },
      ], // todo: change when needed
      loading: true, // main table loading status
      tableData: [], // needless to say
      selectionList: [], // selected rows
      exportAllVisible: false,
      // import csv module
      successList: [],
      failList: [],
      isImporting: false,
      importDialog: false,
      csvTable: [],
      // edit and add module
      showAddOrUpdate: false,
      editId: null,
    }
  },
  computed: {
    showSaveSearchButton() {
      const currentActiveSearch = [...this.activeSearchFields]
      const oldActiveSearch = localStore.get(this.activeSearchFieldsKey)
      return JSON.stringify(currentActiveSearch) !== JSON.stringify(oldActiveSearch)
    },
    activeSearchFieldsFullData() {
      return this.activeSearchFields.map(fieldName => this.searchFields.filter(field => field.name === fieldName)[0])
    },
    // import csv module
    csvFields() {
      // todo: define the fields to exclude for csv here
      const excludeFieldDisplayName = ['id', '创建时间', '地址', '备注', '分类', '来源']
      return this.fields.filter(field => !excludeFieldDisplayName.includes(field.displayName))
    },
    goodCSVTable() {
      // client side csv validation
      // eslint-disable-next-line no-unused-vars
      return this.csvTable.filter(row => {
        // todo: add client side validation here
        console.log(row)
        // valid country
        // if (row.country) {
        //   if (clientCountryOptions.filter(country => country.label === row.country).length === 0) return false
        // }
        //
        // // valid client level
        // if (row.client_level) {
        //   if (clientLevelOptions.filter(level => level.label === row.client_level).length === 0) return false
        // }
        //
        // // valid client industry
        // if (row.industry) {
        //   if (clientIndustryOptions.filter(industry => industry.label === row.industry).length === 0) return false
        // }
        //
        // // generate client code if needed
        // if (!row.code) {
        //   if (row.country && row.company_name) {
        //     row.code = generateClientCode(row.country, row.company_name)
        //   }
        // }
        return true
      })
    },
    badCSVTable() {
      // client side csv validation
      // eslint-disable-next-line no-unused-vars
      return this.csvTable.filter(row => {
        // todo: add client side validation here
        console.log(row)
        // valid country
        // if (row.country) {
        //   if (clientCountryOptions.filter(country => country.label === row.country).length === 0) return true
        // }
        //
        // // valid client level
        // if (row.client_level) {
        //   if (clientLevelOptions.filter(level => level.label === row.client_level).length === 0) return true
        // }
        //
        // // valid client industry
        // if (row.industry) {
        //   if (clientIndustryOptions.filter(industry => industry.label === row.industry).length === 0) return true
        // }
        return false
      })
    },
  },
  watch: {
    '$route.query.editId': function (val, oldVal) {
      console.log(val, oldVal)
      if (val !== oldVal) {
        this.showAddOrUpdate = true
        this.editId = val
        console.log('do stuff')
      }
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

  .main-operation-row {
    text-align: right;
    padding-bottom: 20px;
    padding-top: 20px;
  }

  .selection-button-wrap {
    text-align: right;
  }

  .addSearchButton {
    margin-right: 10px;
  }

  .refresh-button {
    border: 0;
    background-color: transparent;
    margin-left: 0 !important;
  }
}
</style>
