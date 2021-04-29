<template>
  <div>
    <!-- 列表页面 -->
    <div class="container">
      <div class="header"><div class="title">我的客户</div></div>

      <div class="search">
        <el-form :inline="true" class="form-inline" ref="searchForm" :model="searchForm">
          <el-form-item label="owned_by :" prop="owned_by">
            <el-select
              placeholder="owned_by"
              :loading="searchFormMeta.ownByLoading"
              v-model="searchForm.owned_by"
              clearable
              multiple
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
          <el-form-item label="client_name :" prop="client_name">
            <el-input placeholder="client_name" v-model="searchForm.client_name"></el-input>
          </el-form-item>
          <el-form-item label="company_name :" prop="company_name">
            <el-input placeholder="company_name" v-model="searchForm.company_name"></el-input>
          </el-form-item>
          <el-form-item label="code :" prop="code">
            <el-input placeholder="code" v-model="searchForm.code"></el-input>
          </el-form-item>
          <el-form-item label="client_level :" prop="client_level">
            <el-select placeholder="client_level" v-model="searchForm.client_level" clearable multiple>
              <el-option
                v-for="item in searchFormMeta.client_levelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="industry :" prop="industry">
            <el-select placeholder="industry" v-model="searchForm.industry" clearable multiple>
              <el-option
                v-for="item in searchFormMeta.industryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="source :" prop="source">
            <el-select placeholder="source" v-model="searchForm.source" clearable multiple>
              <el-option
                v-for="item in searchFormMeta.sourceOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="country :" prop="country">
            <el-select placeholder="country" v-model="searchForm.country" clearable multiple>
              <el-option
                v-for="item in searchFormMeta.countryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="category :" prop="category">
            <el-select placeholder="category" v-model="searchForm.category" clearable multiple>
              <el-option
                v-for="item in searchFormMeta.categoryOptions"
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

      <el-table :data="clients" style="width: 100%" v-loading="loading">
        <el-table-column prop="code" label="客户代码" width="150"> </el-table-column>
        <el-table-column prop="country" label="国家" width="150"> </el-table-column>
        <el-table-column prop="client_name" label="客户名" width="150"> </el-table-column>
        <el-table-column prop="company_name" label="公司名" width="150"> </el-table-column>
        <el-table-column label="联系方式" width="250">
          <template slot-scope="scope">
            <ul>
              <li v-for="(item, index) in scope.row.contact_methods" :key="index">
                {{ item.method }} : {{ item.detail }}
              </li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column prop="client_level" label="客户等级" width="120"> </el-table-column>
        <el-table-column prop="industry" label="客户行业" width="120"> </el-table-column>
        <el-table-column prop="source" label="来源" width="120"> </el-table-column>
        <el-table-column prop="owned_by" label="所属业务员" width="120"> </el-table-column>
        <el-table-column fixed="right" label="Operations" width="200">
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
      <div class="pageWrap">
        <el-footer>
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
        </el-footer>
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
    this.onSearch()
    this.initSearchForm()
  },
  computed: {
    showFollowHistory() {
      return this.followHistoryId !== 0
    },
  },
  methods: {
    async initSearchForm() {
      this.searchFormMeta.ownByLoading = true
      const userOptions = await client.listUserOptions()
      this.searchFormMeta.ownByLoading = false
      this.searchFormMeta.ownByOptions = userOptions
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
      this.onSearch()
    },
    async onSearch() {
      this.$router.push({
        name: 'MyClientsMy',
        query: {
          currentPage: this.currentPage,
          pageCount: this.pageCount,
        },
      })
      this.loading = true
      const page = this.currentPage - 1
      const res = await client.page(this.pageCount, page, this.searchForm)
      this.loading = false
      this.clients = res.items
      this.total_nums = res.total
    },
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
    handlePageChange(curPage) {
      this.getClients(curPage)
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
      pageSizes: [10, 20, 30, 50],
      total_nums: 0, // 分组内的用户总数
      currentPage: 1, // 默认获取第一页的数据
      pageCount: 10, // 每页10条数据
      searchFormMeta: {
        ownByLoading: true,
        ownByOptions: [],
        client_levelOptions: clientLevelOptions,
        industryOptions: clientIndustryOptions,
        sourceOptions: clientSourceOptions,
        countryOptions: clientCountryOptions,
        categoryOptions: clientCategoryOptions,
      },
      searchForm: {
        owned_by: null,
        client_name: null,
        company_name: null,
        code: null,
        client_level: null,
        industry: null,
        source: null,
        country: null,
        category: null,
      },
      users: [],
      loading: false,
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

  .operation-row {
    padding: 3px 0;
  }

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
