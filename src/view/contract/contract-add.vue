<template>
  <div>
    <!-- 列表页面 -->
    <div class="container">
      <div class="header"><div class="title">新增合同</div></div>
    </div>

    <contractForm :loading="loading" @addOrUpdate="handleAdd" />
  </div>
</template>

<script>
import contractForm from '@/view/contract/contract-form'
import contract from '@/model/contract'

export default {
  components: {
    contractForm,
  },
  methods: {
    async handleAdd(data) {
      this.loading = true
      await contract.create(data)
      this.loading = false
      this.$router.back()
    },
  },
  data() {
    return {
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

  .productRow {
    display: flex;
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }
}
</style>
