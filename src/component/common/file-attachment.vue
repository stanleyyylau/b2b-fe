<template>
  <!--file drawer-->
  <el-drawer :title="title" :visible.sync="visible" direction="rtl" :before-close="handleClose" size="35%">
    <div class="file-uploader-wrap">
      <input ref="fileInput" type="file" :disabled="isFileUploading" />
      <el-button type="primary" size="mini" @click="handleUpload" :loading="isFileUploading">
        {{ isFileUploading ? '上传中...(勿关闭窗口)' : '上传' }}
      </el-button>
    </div>
    <div class="file-table-wrap">
      <el-table
        :data="
          fileListWithDownload.filter(data => !search || data.fileName.toLowerCase().includes(search.toLowerCase()))
        "
        style="width: 100%"
      >
        <!--        <el-table-column-->
        <!--          label="ID"-->
        <!--          width="80px"-->
        <!--          prop="id">-->
        <!--        </el-table-column>-->
        <el-table-column label="文件名" prop="fileName">
          <template slot-scope="scope">
            <span v-if="scope.row.id !== fileEditId">{{ scope.row.fileName }}</span>
            <el-input v-if="scope.row.id === fileEditId" v-model="newFileName"></el-input>
          </template>
        </el-table-column>
        <el-table-column align="right">
          <template slot="header">
            <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
          </template>
          <template slot-scope="scope">
            <el-button
              @click="handleDownload(scope.row.id, scope.row.fileUrl, scope.row.fileName)"
              :loading="scope.isDownloading"
              :disabled="scope.isDownloading"
              v-if="fileEditId !== scope.row.id"
              size="mini"
              >{{ scope.row.isDownloading ? '下载中...' : '下载' }}
            </el-button>
            <el-button v-if="fileEditId !== scope.row.id" size="mini" @click="handleEdit(scope.row)">编辑 </el-button>
            <el-button v-if="fileEditId === scope.row.id" size="mini" @click="handleUpdate(scope.row.id)"
              >更新
            </el-button>
            <el-button v-if="fileEditId === scope.row.id" size="mini" @click="handleEditCancel">取消 </el-button>
            <el-button v-if="fileEditId !== scope.row.id" size="mini" type="danger" @click="handleDelete(scope.row.id)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-drawer>
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
      search: '',
      fileEditId: null,
      newFileName: '',
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
    handleDelete(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$emit('onFileDelete', id)
        })
        .catch(() => {})
        .finally(() => {
          this.handleEditCancel()
        })
    },
    handleEditCancel() {
      this.fileEditId = null
      this.newFileName = ''
    },
    handleUpdate(id) {
      this.$emit('onFileNameUpdate', id, this.newFileName)
      this.handleEditCancel()
    },
    handleEdit(row) {
      this.fileEditId = row.id
      this.newFileName = row.fileName
    },
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
      try {
        const uploadResult = await this.sendRequest(files[0])
        this.$emit('uploaded', uploadResult)
      } catch (e) {
        console.log(e)
      }
      console.log('just emited uploaded')
      this.isFileUploading = false
      this.$refs.fileInput.value = ''
    },
  },
}
</script>

<style lang="scss" scoped>
.file-uploader-wrap,
.file-table-wrap {
  padding: 10px 15px;
}
</style>
