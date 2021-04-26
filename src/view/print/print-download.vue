<template>
  <el-container class="print" v-loading="loading">
    <el-header>
      <template v-if="isPreview">
        <el-button type="primary" @click="handleClick('download')">下载PDF</el-button>
        <!--        <el-button type="primary" @click="handleClick('print')">打印</el-button>-->
        <el-button @click="handleClick('goback')">取消</el-button>
      </template>
      <template v-else>
        <span class="select-label">选择模版</span>
        <el-select v-model="templateId" style="width: 170px;" class="handle-item-content" @change="renderTemplate">
          <el-option v-for="item in templateOptions" :key="item.id" :label="item.template_name" :value="item.id" />
        </el-select>

        <el-button class="preview-button" type="primary" @click="previewPdf">打印预览</el-button>
      </template>
    </el-header>

    <el-main>
      <div class="tiny-wrapper preview">
        <div class="iframe-wrapper">
          <iframe
            v-if="isPreview"
            id="wkPrint"
            :height="iframeHeight"
            :src="iframeUrl"
            style="width: 100%;margin-top: 54px;"
            scrolling="no"
            frameborder="0"
          />
        </div>
        <editor
          v-if="!isPreview"
          api-key="5vc2o0hszxchs4ctj9cbuxgjqtuwzqg78a50tiud9jgjmxd7"
          ref="createTinymce"
          :toolbar="[]"
          v-model="content"
          :init="getEditConfig()"
        />
      </div>
    </el-main>
  </el-container>
</template>

<script>
import Editor from '@tinymce/tinymce-vue'
import contract from '@/model/contract'
// import client from '@/model/client'
import product from '@/model/product'
import { tpl1, tpl2, tpl3, tpl4 } from '@/util/templateRender'

const wukongPluginStr = 'autoresize export print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons lineheight rowspacing'
// const pluginsFromOfficial = 'export print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons lineheight rowspacing'

const dataReplaceMap = {
  client_name: '客户名称',
  client_id: 'Customer ID',
  date: 'Date', // this is added on client side
  country: '地址',
  company_name: '客户名称',
  'contact_methods.method=电话': '手机',
  'contact_methods.method=邮箱': '邮箱',
  'products.spu_title': 'products.spu_title',
  'products.spu_name': 'products.spu_no',
  'products.img_url': 'products.img',
  createdBy: '创建人', // added on client side
}

export default {
  name: 'login',
  data() {
    return {
      loading: false,
      content: '',
      templateId: '',
      templateOptions: [],
      dataForRender: {},

      // 预览
      pdfBlob: null,
      isPreview: false,
      iframeUrl: '',
      iframeHeight: document.documentElement.clientHeight - 170,
    }
  },
  async created() {
    const contractId = Number(this.$router.history.current.query.contractId)
    await this.getContractDetail(contractId)
    await this.getTmpls()
    // this.renderTemplate(1)
  },
  methods: {
    async getContractDetail(contractId) {
      this.loading = true
      const dataForPrint = await product.getDataForPrint(contractId)
      this.dataForRender = dataForPrint
      this.loading = false
    },
    async getTmpls() {
      const res = await contract.listTpl()
      this.tplList = res
      this.templateOptions = res.map(item => ({
        template_name: item.template_name,
        id: item.id,
      }))
      this.templateId = res[0].id
      await this.renderTemplate()
    },
    handleClick(type) {
      switch (type) {
        case 'download':
          console.log('about to download')
          this.downloadBlob(this.pdfBlob, '12344.pdf')
          break
        case 'goback':
          console.log('about to cancel')
          this.isPreview = false
          break
        default:
          break
      }
    },
    downloadBlob(blob, name = 'file.txt') {
      // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
      const blobUrl = URL.createObjectURL(blob)

      // Create a link element
      const link = document.createElement('a')

      // Set link's href to point to the Blob URL
      link.href = blobUrl
      link.download = name

      // Append link to the body
      document.body.appendChild(link)

      // Dispatch click event on the link
      // This is necessary as link.click() does not work on the latest firefox
      link.dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window,
        }),
      )

      // Remove link from body
      document.body.removeChild(link)
    },
    async previewPdf() {
      this.loading = true
      const res = await this.$refs.createTinymce.editor.plugins.export.convert('clientpdf', {})
      this.pdfBlob = res
      this.iframeUrl = window.URL.createObjectURL(res)
      this.isPreview = true
      this.loading = false
    },
    async renderTemplate() {
      const id = this.templateId
      this.loading = true
      const res = await contract.getTemplateById(id)
      console.log('templte is', res)
      // let fullTpl = res.template_content

      let renderResult = ''
      switch (id) {
        case 1:
        case 5:
          renderResult = tpl1(this.dataForRender, res.template_content)
          break
        case 2:
        case 6:
          renderResult = tpl2(this.dataForRender, res.template_content)
          break
        case 3:
        case 7:
          renderResult = tpl3(this.dataForRender, res.template_content)
          break
        case 4:
        case 8:
          renderResult = tpl4(this.dataForRender, res.template_content)
          break
        default:
          break
      }

      this.content = renderResult
      this.loading = false
    },
    renderProducts(productTpl, data) {
      const productKeys = Object.keys(dataReplaceMap).filter(key => key.startsWith('products'))
      return data
        .map(item => {
          let renderedProduct = productTpl
          productKeys.forEach(key => {
            const property = key.split('.')[1]
            if (key.indexOf('img') > 0) {
              const imgTpl = `<img style="display: block; margin-left: auto; margin-right: auto;" src="${
                item[property]
              }" alt="" width="206" height="206" />`
              renderedProduct = renderedProduct.replace(`{${dataReplaceMap[key]}}`, imgTpl)
            } else {
              renderedProduct = renderedProduct.replace(`{${dataReplaceMap[key]}}`, item[property])
            }
          })
          return renderedProduct
        })
        .join('')
    },
    getProductTpl(fullTpl) {
      const match = fullTpl.match(/<table.*data-product-table(.|\n)*<\/table>/)[0]
      const firstIndex = match.indexOf('</table>')
      const result = match.substr(0, firstIndex + 8)
      return result
    },
    /** 富文本配置 */
    getEditConfig() {
      return {
        menubar: true,
        toolbar_sticky: false,
        statusbar: false,
        // height: 700,
        extended_valid_elements: 'span[class|title|wktag|style|contenteditable]',
        content_style: 'p { margin: 5px 0; line-height: 1.5;}',
        // table_advtab: false,
        // table_cell_advtab: false,
        // table_row_advtab: false,
        plugins: wukongPluginStr,
        // toolbar: false,
        // menubar: false,
        // inline: true
      }
    },
  },
  components: {
    editor: Editor,
  },
}
</script>

<style lang="scss">
.tiny-wrapper {
  width: 680px;
  height: 100%;
  margin: 0 auto;
}
.preview {
  padding: 50px;
  background-color: white;
}
.print {
  padding-bottom: 100px;
}
.tox.tox-tinymce {
  border-color: transparent;
}
</style>
