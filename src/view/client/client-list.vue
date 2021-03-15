<template>
  <div>
    <!-- 列表页面 -->
    <div class="container">
      <div class="header"><div class="title">我的客户</div></div>
      <el-table
        :data="clients"
        style="width: 100%">
        <el-table-column
          prop="country"
          label="国家"
          width="150">
        </el-table-column>
        <el-table-column
          prop="client_name"
          label="客户名"
          width="150">
        </el-table-column>
        <el-table-column
          prop="company_name"
          label="公司名"
          width="150">
        </el-table-column>
        <el-table-column
          label="联系方式"
          width="250">
          <template slot-scope="scope">
            <ul>
              <li v-for="(item, index) in scope.row.contact_methods" :key="index">
                {{ item.method }} : {{item.detail}}
              </li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column
          prop="client_level"
          label="客户等级"
          width="120">
        </el-table-column>
        <el-table-column
          prop="industry"
          label="客户行业"
          width="120">
        </el-table-column>
        <el-table-column
          prop="source"
          label="来源"
          width="120">
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
            <el-button plain type="primary" size="mini"
                       @click.native.prevent.stop="handleDrawer(scope.row.id)"
            >
              Files
            </el-button>
            <el-button plain type="danger" size="mini"
                       @click.native.prevent.stop="handleDelete(scope.row.id)"
            >Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>

import client from '@/model/client'

export default {
  components: {
  },
  created() {
    this.getClients()
  },
  methods: {
    async getClients() {
      const res = await client.list()
      this.clients = res.map(item => ({
        ...item,
        contact_methods: JSON.parse(item.contact_methods)
      }))
      console.log('res is', res)
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
    handleEdit(id) {
      this.$router.push({ path: '/client/edit', query: { id } })
    }
  },
  data() {
    return {
      clients: []
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
