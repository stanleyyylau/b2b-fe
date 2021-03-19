<template>
  <div class="print">
    <div class="control-buttons">
      <el-input v-model="templateName" placeholder="请输入模版名字">模版名字</el-input>
      <el-button
        type="primary"
        @click="handleTemplateSave"
        :disabled="templateName === '' || content === ''"
        :loading="loading"
        >保存模版</el-button
      >
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
import contract from '@/model/contract'

const wukongPluginStr = 'print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons lineheight rowspacing'
// const pluginsFromOfficial = 'export print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons lineheight rowspacing'

export default {
  name: 'login',
  data() {
    return {
      loading: false,
      content: '',
      templateName: '',
    }
  },
  methods: {
    async handleTemplateSave() {
      this.loading = true
      await contract.createTpl({ template_name: this.templateName, template_content: this.content })
      this.loading = false
      this.$router.back()
    },
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
.control-buttons {
  display: flex;
}
.control-buttons {
  width: 1000px;
  margin: 0 auto;
  padding: 20px 0;
  .el-input {
    margin-right: 1%;
  }
}
.print {
  padding-bottom: 100px;
}
</style>
