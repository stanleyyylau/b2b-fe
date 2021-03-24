<template>
  <product-form :loading="loading" @addOrUpdate="handleAdd" />
</template>

<script>
import productForm from './product-form'
import product from '@/model/product'

export default {
  components: {
    productForm,
  },
  methods: {
    async handleAdd(productDetail) {
      try {
        this.loading = true
        const res = await product.createProduct(productDetail)

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
      loading: false,
    }
  },
}
</script>
