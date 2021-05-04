<template>
  <el-dialog title="从 CSV 导入数据" :visible.sync="importDialog" @close="onClose">
    <template v-if="successList.length > 0 || failList.length > 0">
      <div class="import-result">
        <div>导入完成，成功导入 {{ successList.length }} 条数据</div>
        <div>下面的导入失败的列表</div>
      </div>
      <el-table :data="failList" style="width: 100%">
        <template v-for="field in fields">
          <el-table-column
            v-bind:key="field.name"
            v-if="field.isShow && field.name !== 'create_time'"
            :prop="field.name"
            :label="field.displayName"
            width="180"
          >
          </el-table-column>
        </template>
      </el-table>
      <div class="download-buttons">
        <el-button @click="downloadFailCSV" :disabled="failList.length === 0">下载列表</el-button>
        <el-button @click="onReimport">重新导入</el-button>
      </div>
    </template>
    <template v-else>
      <el-upload action="" class="upload-csv" ref="upload" :limit="1" :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">加载数据</el-button>
        <el-button @click="downloadExampleCSV" size="small">下载 example.csv</el-button>
      </el-upload>
      <el-table :data="goodCSVTable" style="width: 100%">
        <template v-for="field in fields">
          <el-table-column v-bind:key="field.name" :prop="field.name" :label="field.displayName" width="180">
          </el-table-column>
        </template>
      </el-table>
      <el-button v-if="goodCSVTable.length > 0" @click="importConfirm" :loading="isImporting">确认导出</el-button>
    </template>
  </el-dialog>
</template>
<script>
import { JSONtoCSV, parseCSV } from '@/util/common'

export default {
  props: {
    failList: {},
    fields: {},
    goodCSVTable: {},
    importConfirm: {},
    importDialog: {},
    isImporting: {},
    onReimport: {},
    successList: {},
  },
  methods: {
    onClose() {
      this.$emit('onClose')
    },
    submitUpload() {
      const self = this
      const uploadRef = this.$refs.upload
      const file = uploadRef.uploadFiles[0]

      const reader = new FileReader()
      reader.onload = function () {
        try {
          const rows = parseCSV(reader.result)
          const headerRow = rows.shift()
          const indexFieldNameMap = {}
          headerRow.forEach((displayName, index) => {
            const { name } = self.fields.filter(field => field.displayName === displayName)[0]
            indexFieldNameMap[index] = name
          })
          const tableRow = rows.map(row => {
            const obj = {}
            row.forEach((value, index) => {
              obj[indexFieldNameMap[index]] = value
            })
            return obj
          })
          console.log('rest rows', rows)
          console.log('table row', tableRow)
          self.$emit('onCSV', tableRow)
        } catch (e) {
          self.$message('CSV格式错误')
        }
      }
      reader.readAsText(file.raw)
    },
    downloadExampleCSV() {
      const headerRow = {}
      this.fields.forEach(field => {
        headerRow[field.displayName] = ''
      })
      const data = [headerRow]
      JSONtoCSV(data)
    },
    downloadFailCSV() {
      const self = this
      const exportList = this.failList.map(item => {
        const obj = {}
        self.fields.forEach(field => {
          obj[field.displayName] = item[field.name]
        })
        return obj
      })
      JSONtoCSV(exportList, 'failList.csv')
    },
  },
}
</script>
