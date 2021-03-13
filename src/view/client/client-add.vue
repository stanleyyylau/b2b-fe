<template>
  <div>
    <!-- 列表页面 -->
    <div class="container">
      <div class="header"><div class="title">新增客户</div></div>

      <el-row>
        <el-col :lg="20" :md="20" :sm="24" :xs="24">
          <el-form :model="form" status-icon ref="form" label-width="100px" @submit.native.prevent>
            <el-form-item label="country" prop="country">
              <el-input size="medium" placeholder="country" v-model="form.country"></el-input>
            </el-form-item>
            <el-form-item label="client_name" prop="client_name">
              <el-input size="medium" placeholder="client_name" v-model="form.client_name"></el-input>
            </el-form-item>
            <el-form-item label="company_name" prop="company_name">
              <el-input size="medium" placeholder="company_name" v-model="form.company_name"></el-input>
            </el-form-item>
            <el-form-item label="contact_methods" prop="contact_methods">
              <el-input size="medium" placeholder="contact_methods"></el-input>
            </el-form-item>
            <el-form-item label="code" prop="code">
              <el-input size="medium" placeholder="code"></el-input>
            </el-form-item>
            <el-form-item label="client_level" prop="client_level">
              <el-input size="medium" placeholder="client_level"></el-input>
            </el-form-item>
            <el-form-item label="industry" prop="industry">
              <el-input size="medium" placeholder="industry"></el-input>
            </el-form-item>
            <el-form-item label="source" prop="source">
              <el-input size="medium" placeholder="source"></el-input>
            </el-form-item>
            <el-form-item label="是否放进公海" prop="isInPublicSea">
              <el-switch v-model="form.isInPublicSea"></el-switch>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <el-row class="confirm-button-row">
        <el-col :lg="16" :md="20" :sm="24" :xs="24">
          <el-button type="primary" v-on:click="handleProductAdd" :loading="loading">确定新增客户</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>

export default {
  components: {
  },
  created() {

  },
  methods: {
  },
  data() {
    return {
      form: {
        country: '',
        client_name: '',
        company_name: '',
        contact_methods: [{ method: 'wechat', detail: 'stanleyyylau' }],
        code: 'automatically generated',
        client_level: '',
        industry: '',
        source: '',
        isInPublicSea: false
      }
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
