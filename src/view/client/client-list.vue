<template>
  <div>
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
        <el-button type="primary">导入数据</el-button>
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
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <div class="operation-row">
              <el-button plain type="primary" size="mini" @click.native.prevent.stop="handleEdit(scope.row.id)">
                编辑客户
              </el-button>
              <el-button
                v-permission="['新增产品']"
                plain
                type="primary"
                size="mini"
                @click.native.prevent.stop="handleDrawer(scope.row.id)"
              >
                查看文件
              </el-button>
            </div>
            <div class="operation-row">
              <el-button
                v-permission="['新增产品']"
                plain
                type="primary"
                size="mini"
                @click.native.prevent.stop="handleFollowHistory(scope.row.id)"
              >
                跟进记录
              </el-button>
              <el-button
                v-permission="['新增产品']"
                plain
                type="danger"
                size="mini"
                @click.native.prevent.stop="handleDelete(scope.row.id)"
                >删除客户</el-button
              >
            </div>
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

    <el-drawer
      title="跟进历史"
      :visible.sync="showFollowHistory"
      direction="rtl"
      :before-close="handleFollowHistoryClose"
    >
      <div>
        <el-form :model="followForm" ref="followForm" label-width="120px" class="followForm">
          <el-form-item label="跟进时间" prop="followTime">
            <el-date-picker v-model="followForm.follow_time" type="datetime" placeholder="Select date and time">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="跟进内容" prop="content">
            <el-input type="textarea" v-model="followForm.content"></el-input>
          </el-form-item>
          <el-form-item label="星标" prop="star">
            <el-rate v-model="followForm.star"></el-rate>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="addingLog" @click="handleFollowSubmit">新增跟进记录</el-button>
          </el-form-item>
          <div class="followCards">
            <el-card v-bind:key="index" class="box-card" v-for="(item, index) in followHistory">
              <div>
                <div>{{ item.create_time }} - {{ item.followBy }}</div>
                <div><el-rate disabled="true" :value="item.star"></el-rate></div>
              </div>
              <div>
                {{ item.content }}
              </div>
            </el-card>
          </div>
        </el-form>
      </div>
    </el-drawer>

    <file-attachment
      title="客户关联的文件"
      :visible="showDrawerForClientId !== 0"
      @close="handleClose"
      :fileList="fileList"
      @uploaded="handleUploaded"
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
</template>

<script>
import client from '@/model/client'
import product from '@/model/product'
import fileAttachment from '@/component/common/file-attachment'
import { clientCategoryOptions,
  clientCountryOptions,
  clientIndustryOptions,
  clientLevelOptions,
  clientSourceOptions } from '@/util/common'
import localStore from '@/model/local'

export default {
  components: {
    fileAttachment,
  },
  created() {
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
  computed: {
    showFollowHistory() {
      return this.followHistoryId !== 0
    },
    showSaveSearchButton() {
      const currentActiveSearch = [...this.activeSearchFields]
      const oldActiveSearch = localStore.get(this.activeSearchFieldsKey)
      return JSON.stringify(currentActiveSearch) !== JSON.stringify(oldActiveSearch)
    },
    activeSearchFieldsFullData() {
      return this.activeSearchFields.map(fieldName => this.searchFields.filter(field => field.name === fieldName)[0])
    },
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
      try {
        const res = await client.exportAll()
        this.download(res, `${new Date().getTime()}.csv`)
      } catch (e) {
        console.log(e)
      }
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
      const res = await client.page(this.pageCount, page, this.searchForm)
      this.loading = false
      this.tableData = res.items
      this.total_nums = res.total
    },
    // handleEdit(val) {
    //   const editId = val.row.id
    //   this.$router.push({
    //     path: '/contract/edit',
    //     query: {
    //       id: editId,
    //     },
    //   })
    // },
    // handleDelete(val) {
    //   this.$confirm('此操作将永久删除该合同, 是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning',
    //   }).then(async () => {
    //     const res = await contract.delete(val.row.id)
    //     if (res.code < window.MAX_SUCCESS_CODE) {
    //       await this.onSearch()
    //       this.$message({
    //         type: 'success',
    //         message: `${res.message}`,
    //       })
    //     }
    //   })
    // },
    handleSelectionChange(val) {
      console.log('selection change', val)
      this.selectionList = val
    },
    toggleSelection() {
      this.$refs.dataTable.clearSelection()
    }, // below are custom
    async loadFollowLog() {
      const clientId = this.followHistoryId
      const res = await client.listFollowLog(clientId)
      this.followHistory = res.map(item => ({
        create_time: item.follow_time,
        content: item.content,
        star: item.star,
        followBy: item.user_id,
      }))
    },
    async handleFollowSubmit() {
      this.addingLog = true
      const data = { ...this.followForm, client_id: this.followHistoryId }
      console.log('form daata,', data)
      await client.addFollowLog(data)
      this.addingLog = false
      this.followForm.content = ''
      this.followForm.star = 0
      await this.loadFollowLog()
    },
    async getClients(page = 0) {
      this.loading = true
      const pageRes = await client.page(10, page)
      this.loading = false
      this.total_nums = pageRes.total
      const res = pageRes.items
      this.clients = res
    },
    handleFollowHistoryClose() {
      this.followHistoryId = 0
    },
    async handleDelete(id) {
      console.log('id to delete is', id)
      this.$confirm('此操作将永久删除该客户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await client.deleteClient(id)
        if (res.code < window.MAX_SUCCESS_CODE) {
          await this.getClients()
          this.$message({
            type: 'success',
            message: `${res.message}`,
          })
        }
      })
    },
    handleFollowHistory(id) {
      this.followHistoryId = id
      this.loadFollowLog()
    },
    handleEdit(id) {
      this.$router.push({ path: '/client/edit', query: { id } })
    },
    handleDrawer(id) {
      this.showDrawerForClientId = id
      this.getFileList()
    },
    async handleUploaded(res) {
      console.log('uploaded result is', res)
      await product.createFileForClient({
        client_id: this.showDrawerForClientId,
        file_name: res[0].key,
        file_url: res[0].url,
      })
      await this.getFileList()
    },
    handleClose() {
      this.showDrawerForClientId = 0
    },
    async getFileList() {
      const res = await client.getFileByClientId(this.showDrawerForClientId)
      this.fileList = res.map(item => ({
        id: item.id,
        fileName: item.file_name,
        fileUrl: item.file_url,
      }))
    },
  },
  data() {
    return {
      pageTitle: '我的客户',
      currentRouteName: 'MyClientsMy',
      activeSearchFieldsKey: 'myclient-searchFieldsActive',
      displayFieldsKey: 'myclient-displayFields',
      pageSizes: [10, 20, 30, 50],
      total_nums: 0, // 分组内的用户总数
      currentPage: 1, // 默认获取第一页的数据
      pageCount: 10, // 每页10条数据
      searchForm: {}, // this form is computed by search fields
      activeSearchFields: [], // computed
      searchFields: [
        {
          displayName: '主邮箱',
          name: 'email',
          type: 'String',
        },
        {
          displayName: '业务员',
          name: 'owned_by',
          type: 'Connect',
          loading: true,
          options: [],
        },
        {
          displayName: '客户名称',
          name: 'client_name',
          type: 'String',
        },
        {
          displayName: '公司名',
          name: 'company_name',
          type: 'String',
        },
        {
          displayName: '客户代码',
          name: 'code',
          type: 'String',
        },
        {
          displayName: '客户级别',
          name: 'client_level',
          type: 'Enum',
          options: clientLevelOptions,
        },
        {
          displayName: '行业',
          name: 'industry',
          type: 'Enum',
          options: clientIndustryOptions,
        },
        {
          displayName: '客户来源',
          name: 'source',
          type: 'Enum',
          options: clientSourceOptions,
        },
        {
          displayName: '国家',
          name: 'country',
          type: 'Enum',
          options: clientCountryOptions,
        },
        {
          displayName: '客户分类',
          name: 'category',
          type: 'Enum',
          options: clientCategoryOptions,
        },
      ],
      fields: [
        {
          name: 'id',
          displayName: 'id',
          isHidden: true,
          isShow: false,
          sortable: true,
        },
        {
          name: 'email',
          displayName: '主邮箱',
          isHidden: false,
          isShow: true,
          sortable: true,
        },
        {
          name: 'country',
          displayName: '国家',
          isHidden: false,
          isShow: true,
          sortable: true,
        },
        {
          name: 'owned_by',
          displayName: '业务员',
          isHidden: false,
          isShow: true,
          sortable: false,
        },
        {
          name: 'client_name',
          displayName: '客户名字',
          isHidden: false,
          isShow: true,
          sortable: true,
        },
        {
          name: 'company_name',
          displayName: '公司名',
          isHidden: false,
          isShow: true,
          sortable: true,
        },
        // {
        //   name: 'contact_methods',
        //   displayName: '联系方式',
        //   isHidden: false,
        //   isShow: true,
        //   sortable: false,
        // },
        {
          name: 'code',
          displayName: '客户代码',
          isHidden: false,
          isShow: true,
          sortable: true,
        },
        {
          name: 'client_level',
          displayName: '客户级别',
          isHidden: false,
          isShow: true,
          sortable: true,
        },
        {
          name: 'industry',
          displayName: '客户行业',
          isHidden: false,
          isShow: true,
          sortable: true,
        },
        {
          name: 'source',
          displayName: '来源',
          isHidden: false,
          isShow: true,
          sortable: true,
        },
        {
          name: 'create_time',
          displayName: '创建时间',
          isHidden: false,
          isShow: true,
          sortable: true,
        },
        {
          name: 'address',
          displayName: '地址',
          isHidden: true,
          isShow: false,
          sortable: false,
        },
        {
          name: 'notes',
          displayName: '备注',
          isHidden: true,
          isShow: false,
          sortable: false,
        },
        {
          name: 'category',
          displayName: '分类',
          isHidden: true,
          isShow: false,
          sortable: true,
        },
      ],
      loading: true, // main table loading status
      tableData: [], // needless to say
      selectionList: [], // selected rows
      exportAllVisible: false, // below is custom data
      users: [],
      showDrawerForClientId: 0,
      addingLog: false,
      clients: [],
      followHistoryId: 0,
      followHistory: [
        {
          create_time: 2019,
          content: 'jifjweifjirew',
          star: 5,
          followBy: 'stanley',
        },
        {
          create_time: 2019,
          content: 'jifjweifjirew',
          star: 5,
          followBy: 'stanley',
        },
        {
          create_time: 2019,
          content: 'jifjweifjirew',
          star: 5,
          followBy: 'stanley',
        },
      ],
      followForm: {
        content: '',
        star: 0,
        follow_time: new Date(),
      },
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

.pageWrap {
  text-align: right;
  padding-top: 25px;
}

.followCards {
  overflow: scroll;
  height: 50vh;
  padding: 10px;

  .el-card {
    margin-bottom: 15px;
  }
}
</style>
