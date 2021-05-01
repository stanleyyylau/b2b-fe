<template>
  <el-drawer
    title="跟进历史"
    :visible.sync="showFollowHistory"
    direction="rtl"
    :before-close="handleFollowHistoryClose"
    size="35%"
  >
    <div class="follow-wrap">
      <el-form :model="followForm" ref="followForm" label-width="120px" class="followForm" :rules="followFormRule">
        <el-form-item label="跟进时间" prop="follow_time">
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
        <div class="followCards" :loading="loading">
          <div v-if="loading">loading...</div>
          <div v-if="loading === false && followHistory.length === 0">无跟进历史</div>
          <el-card v-bind:key="index" class="box-card" v-for="(item, index) in followHistory">
            <div>
              <div>{{ item.create_time }} - {{ item.followBy }}</div>
              <div><el-rate :disabled="true" :value="item.star"></el-rate></div>
            </div>
            <div>
              {{ item.content }}
            </div>
          </el-card>
        </div>
      </el-form>
    </div>
  </el-drawer>
</template>

<script>
import client from '@/model/client'

export default {
  props: {
    followHistoryId: {
      type: Number,
      default: () => 0,
    },
  },
  data() {
    const validateFollowTime = (rule, value, callback) => {
      const isFuture = new Date(value) > new Date()
      if (isFuture) {
        callback(new Error('error'))
      } else {
        callback()
      }
    }
    return {
      loading: true,
      followHistory: [
        // {
        //   create_time: 2019,
        //   content: 'jifjweifjirew',
        //   star: 5,
        //   followBy: 'stanley',
        // },
      ],
      addingLog: false,
      followForm: {
        content: '',
        star: 0,
        follow_time: new Date(),
      },
      followFormRule: {
        content: [
          {
            required: true,
          },
        ],
        follow_time: [
          {
            required: true,
            message: '你预知未来吗？',
            validator: validateFollowTime,
          },
        ],
      },
    }
  },
  computed: {
    showFollowHistory() {
      return this.followHistoryId !== 0
    },
  },
  methods: {
    async handleFollowSubmit() {
      const isValid = await this.$refs.followForm.validate()
      if (!isValid) return
      this.addingLog = true
      const data = { ...this.followForm, client_id: this.followHistoryId }
      console.log('form daata,', data)
      await client.addFollowLog(data)
      this.addingLog = false
      this.followForm.content = ''
      this.followForm.star = 0
      this.followForm.follow_time = new Date()
      await this.loadFollowLog()
    },
    handleFollowHistoryClose() {
      this.followHistory = []
      this.$emit('onClose')
    },
    async loadFollowLog() {
      this.loading = true
      const clientId = this.followHistoryId
      this.followForm.follow_time = new Date()
      const res = await client.listFollowLog(clientId)
      this.loading = false
      this.followHistory = res.map(item => ({
        create_time: item.follow_time,
        content: item.content,
        star: item.star,
        followBy: item.user_id,
      }))
    },
  },
  watch: {
    followHistoryId() {
      if (this.followHistoryId !== 0) {
        this.loadFollowLog()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.followCards {
  overflow: scroll;
  height: 50vh;
  padding: 10px;

  .el-card {
    margin-bottom: 15px;
  }
}
.follow-wrap {
  padding-right: 20px;
}

.followCards {
  margin-left: 25px;
}
</style>
