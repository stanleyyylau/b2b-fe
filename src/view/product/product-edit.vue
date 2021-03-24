<template>
  <product-form :edit-id="editId" :loading="loading" @addOrUpdate="handleUpdate" />
</template>

<script>
import productForm from './product-form'
import product from '@/model/product'

export default {
  created() {
    this.editId = Number(this.$router.history.current.query.id) || 0
    if (this.editId === 0) {
      this.$router.back()
    }
  },
  components: {
    productForm,
  },
  methods: {
    async handleUpdate(productDetail) {
      try {
        this.loading = true
        const res = await product.updateProduct(this.editId, productDetail)

        this.loading = false
        if (res.code < window.MAX_SUCCESS_CODE) {
          this.$message.success(`${res.message}`)
          this.$router.back()
        }
      } catch (error) {
        this.loading = false
        this.$message.error('增加产品失败，请检测填写信息')
        console.log(error)
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
