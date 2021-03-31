<template>
  <div>
    <!-- 列表页面 -->
    <div class="container">
      <div class="header"><div class="title">我的客户</div></div>
      <el-table :data="clients" style="width: 100%" v-loading="loading">
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
          <el-pagination background layout="prev, pager, next" @current-change="handlePageChange" :total="totalItems">
          </el-pagination>
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

export default {
  components: {
    fileAttachment,
  },
  created() {
    this.getClients()
  },
  computed: {
    showFollowHistory() {
      return this.followHistoryId !== 0
    },
  },
  methods: {
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
      this.totalItems = pageRes.total
      const res = pageRes.items
      this.clients = res.map(item => ({
        ...item,
        contact_methods: JSON.parse(item.contact_methods),
      }))
      console.log('res is', res)
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
      loading: false,
      totalItems: 0,
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
