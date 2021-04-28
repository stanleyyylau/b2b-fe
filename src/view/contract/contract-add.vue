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
      try {
        const res = await contract.create(data)
        console.log('res', res)
        this.loading = false
        this.$router.back()
      } catch (e) {
        console.log('e', e)
        this.loading = false
      }
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
