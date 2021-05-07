<template>
  <dataListContainer
    :page-title="pageTitle"
    :active-search-fields-key="activeSearchFieldsKey"
    :current-route-name="currentRouteName"
    :display-fields-key="displayFieldsKey"
    :fields="fields"
    :search-fields="searchFields"
    :selection-list="selectionList"
    :model="model"
    :init-search-form="initSearchForm"
  >
    <template v-slot:addOrUpdate="data">
      <add-or-update :editId="data.editId"></add-or-update>
    </template>
    <template v-slot:operationsBore="data">
      <el-button size="mini" plain>another button</el-button>
    </template>
  </dataListContainer>
</template>

<script>
// todo: change model when needed
import addOrUpdate from './todo-add-or-update'
import dataListContainer from './data-list-container'
import todoModel from '@/model/todoModel'
import client from '@/model/client'

export default {
  components: {
    addOrUpdate,
    dataListContainer,
  },
  async created() {
    console.log('hi')
  },
  methods: {
    async initSearchForm() {
      // todo: change if needed
      let targetIndex
      for (let i = 0; i < this.searchFields.length - 1; i++) {
        const currentField = this.searchFields[i]
        if (currentField.name === 'owned_by') {
          targetIndex = i
        }
      }
      this.searchFields[targetIndex].loading = true
      // todo: change if needed
      const userOptions = await client.listUserOptions()
      console.log('list user', userOptions)
      this.searchFields[targetIndex].loading = false
      this.searchFields[targetIndex].options = userOptions
    },
  },
  data() {
    return {
      model: todoModel,
      pageTitle: '待办事项',
      currentRouteName: 'todo',
      activeSearchFieldsKey: 'todo-searchFieldsActive',
      displayFieldsKey: 'todo-displayFields',
      searchFields: [
        {
          name: 'owned_by',
          isSearchField: true,
          displayName: '归属人',
          isShow: true,
          sortable: false,
          type: 'Connect',
          isLoading: true,
          options: [
            {
              value: 'Stanley',
              label: '1',
            },
            {
              value: 'Steve Jobs',
              label: '2',
            },
            {
              value: 'Gordon',
              label: '3',
            },
          ],
        },
        {
          name: 'title',
          isSearchField: true,
          displayName: 'Todo 标题',
          isShow: true,
          sortable: true,
          type: 'String',
        },
        {
          name: 'todo_tag',
          isSearchField: true,
          displayName: 'Todo 标签',
          isShow: true,
          type: 'Enum',
          multiple: false,
          options: [
            {
              value: '未开始',
              label: '未开始',
            },
            {
              value: '已完成',
              label: '已完成',
            },
            {
              value: '进行中',
              label: '进行中',
            },
          ],
        },
        {
          name: 'todo_cate',
          isSearchField: true,
          displayName: 'Todo 分类',
          isShow: true,
          multiple: true,
          type: 'Enum',
          options: [
            {
              value: '1',
              label: '口罩',
            },
            {
              value: '2',
              label: '幕布',
            },
            {
              value: '3',
              label: '投影仪',
            },
          ],
        },
      ], // todo: change when needed
      fields: [
        {
          name: 'id',
          displayName: 'id',
          isShow: false,
          sortable: true,
        },
        {
          name: 'owned_by',
          isSearchField: true,
          displayName: '归属人',
          isShow: true,
          sortable: false,
          type: 'Connect',
          isLoading: true,
          options: [
            {
              value: 'Stanley',
              label: '1',
            },
            {
              value: 'Steve Jobs',
              label: '2',
            },
            {
              value: 'Gordon',
              label: '3',
            },
          ],
        },
        {
          name: 'title',
          isSearchField: true,
          displayName: 'Todo 标题',
          isShow: true,
          sortable: true,
          type: 'String',
        },
        {
          name: 'expect_time',
          displayName: '预计完成日期',
          isShow: true,
          sortable: true,
          type: 'Date',
        },
        {
          name: 'detail',
          displayName: 'Todo 详情',
          isShow: true,
          sortable: true,
          default: '',
          type: 'Text',
          rules: [
            {
              required: true,
              trigger: 'blur',
            },
          ],
        },
        {
          name: 'todo_tag',
          isSearchField: true,
          displayName: 'Todo 标签',
          isShow: true,
          type: 'Enum',
          multiple: false,
          options: [
            {
              value: '未开始',
              label: '未开始',
            },
            {
              value: '已完成',
              label: '已完成',
            },
            {
              value: '进行中',
              label: '进行中',
            },
          ],
        },
        {
          name: 'todo_cate',
          isSearchField: true,
          displayName: 'Todo 分类',
          isShow: true,
          multiple: true,
          type: 'Enum',
          options: [
            {
              value: '1',
              label: '口罩',
            },
            {
              value: '2',
              label: '幕布',
            },
            {
              value: '3',
              label: '投影仪',
            },
          ],
        },
      ], // todo: change when needed
      selectionList: [], // selected rows
    }
  },
}
</script>

<style lang="scss" scoped></style>
