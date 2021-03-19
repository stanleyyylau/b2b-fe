<template>
  <div class="print">
    <div class="control-buttons">
      <el-button @click="exportPdf">保存模版</el-button>
    </div>
    <div class="tiny-wrapper">
      <editor
        api-key="5vc2o0hszxchs4ctj9cbuxgjqtuwzqg78a50tiud9jgjmxd7"
        ref="createTinymce"
        v-model="content"
        :init="getEditConfig()"
      />
    </div>
  </div>
</template>

<script>
import Editor from '@tinymce/tinymce-vue'

const wukongPluginStr = 'export print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons lineheight rowspacing'
// const pluginsFromOfficial = 'export print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons lineheight rowspacing'

export default {
  name: 'login',
  data() {
    return {
      content: '',
    }
  },
  methods: {
    /** 富文本配置 */
    getEditConfig() {
      return {
        menubar: true,
        toolbar_sticky: true,
        statusbar: false,
        height: 700,
        extended_valid_elements: 'span[class|title|wktag|style|contenteditable]',
        content_style: 'p { margin: 5px 0; line-height: 1.5;}',
        // table_advtab: false,
        // table_cell_advtab: false,
        // table_row_advtab: false,
        plugins: wukongPluginStr,
        toolbar: wukongPluginStr,
      }
    },
    async exportPdf() {
      console.log('exporting pdf')
      const res = await this.$refs.createTinymce.editor.plugins.export.convert('clientpdf', {})
      console.log(res)
      this.downloadBlob(res, 'aaa.pdf')
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
  },
  components: {
    editor: Editor,
  },
}
</script>

<style lang="scss">
.tiny-wrapper {
  width: 1000px;
  margin: 0 auto;
}
</style>
