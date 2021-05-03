<template>
  <div>
    <!-- 列表页面 -->
    <div class="container">
      <div class="header">
        <div class="title">编辑合同</div>
        <div class="back"><el-button @click="back()" type="primary">返回</el-button></div>
      </div>
    </div>

    <contractForm :edit-id="editId" :loading="loading" @addOrUpdate="handleUpdate" />
  </div>
</template>

<script>
import contractForm from './contract-form'
import contract from '@/model/contract'

export default {
  components: {
    contractForm,
  },
  async created() {
    this.editId = Number(this.$router.history.current.query.id) || 0
  },
  methods: {
    back() {
      this.$router.back()
    },
    async handleUpdate(data) {
      this.loading = true
      try {
        await contract.update(this.editId, data)
        this.loading = false
        this.$router.back()
      } catch (e) {
        console.log(e)
        this.loading = false
      }
    },
  },
  data() {
    return {
      editId: 0,
      loading: false,
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
</style>
