<template>
  <div class="fileAttachmentWrap">
    <!--file drawer-->
    <el-drawer :title="title" :visible.sync="visible" direction="rtl" :before-close="handleClose">
      <div>
        <input ref="fileInput" type="file" :disabled="isFileUploading" />
        <button @click="handleUpload" :disabled="isFileUploading">
          {{ isFileUploading ? 'uploading' : 'upload' }}
        </button>
      </div>
      <el-table :data="fileListWithDownload" style="width: 100%">
        <el-table-column prop="fileName" label="文件名" width="180"> </el-table-column>
        <el-table-column label="下载" width="180">
          <template slot-scope="scope">
            <el-button
              @click="handleDownload(scope.row.id, scope.row.fileUrl, scope.row.fileName)"
              :loading="scope.isDownloading"
              :disabled="scope.isDownloading"
              >{{ scope.row.isDownloading ? '下载中...' : '下载' }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: () => '关联的文件',
    },
    visible: {
      type: Boolean,
      default: () => false,
    },
    close: {
      type: Function,
      default: null,
    },
    fileList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      isFileUploading: false,
      downloadingList: [], // file ids that is downloading
    }
  },
  computed: {
    fileListWithDownload() {
      const self = this
      return self.fileList.map(item => ({
        ...item,
        isDownloading: self.downloadingList.includes(item.id),
      }))
    },
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    handleFile(fileId) {
      this.downloadingList.push(fileId)
    },
    async sendRequest(file) {
      return this.$axios({
        method: 'post',
        url: '/cms/file',
        data: {
          [file.name]: file,
        },
      })
    },
    async handleDownload(id, url, fileName) {
      const self = this
      this.downloadingList = [...this.downloadingList, id]
      this.$axios
        .get(url, {
          headers: {
            'Content-Type': 'application/octet-stream',
          },
          responseType: 'blob',
        })
        .then(response => {
          const a = document.createElement('a')
          const newUrl = window.URL.createObjectURL(response)
          a.href = newUrl
          a.download = fileName
          a.click()
          self.downloadingList = self.downloadingList.filter(item => item !== id)
        })
        .catch(err => {
          console.log('error', err)
        })
    },
    async handleUpload() {
      this.isFileUploading = true
      const { files } = this.$refs.fileInput
      const uploadResult = await this.sendRequest(files[0])
      this.$emit('uploaded', uploadResult)
      console.log('just emited uploaded')
      this.isFileUploading = false
      this.$refs.fileInput.value = ''
    },
  },
}
</script>

<style lang="scss" scoped></style>
