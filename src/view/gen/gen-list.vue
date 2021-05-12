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
    <template v-slot:operationsMiddle="data">
      <el-button size="mini" plain>审核</el-button>
    </template>
  </dataListContainer>
</template>

<script>
// todo: change model when needed
// import contractModel from '@/model/contractModel'
import client from '@/model/client'
import dataListContainer from './data-list-container'
import addOrUpdate from './gen-add-or-update'

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
      model: null,
      // model: contractModel,
      pageTitle: '合同',
      currentRouteName: 'gen',
      activeSearchFieldsKey: 'gen-searchFieldsActive',
      displayFieldsKey: 'gen-displayFields',
      pageSizes: [10, 20, 30, 50],
      total_nums: 0, // 分组内的用户总数
      currentPage: 1, // 默认获取第一页的数据
      pageCount: 10, // 每页10条数据
      searchForm: {}, // this form is computed by search fields
      activeSearchFields: [], // computed
      searchFields: [
        {
          displayName: '业务员',
          name: 'owned_by',
          type: 'Connect',
          loading: true,
          options: [],
        },
        {
          displayName: '付款状态',
          name: 'payment_status',
          type: 'Enum',
          options: [
            {
              value: '支付预付款',
              label: '支付预付款',
            },
            {
              value: '款项收齐',
              label: '款项收齐',
            },
            {
              value: '其他',
              label: '其他',
            },
          ],
        },
        {
          displayName: '审核状态',
          name: 'review_status',
          type: 'Enum',
          options: [
            {
              value: '已审核',
              label: '已审核',
            },
            {
              value: '拒绝',
              label: '拒绝',
            },
            {
              value: '审核中',
              label: '审核中',
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
          displayName: '业务员',
          isShow: true,
          sortable: false,
        },
        {
          name: 'contract_time',
          displayName: '合同时间',
          isShow: true,
          sortable: true,
          type: 'Date',
        },
        {
          name: 'delivery_time',
          displayName: '收货时间',
          isShow: true,
          sortable: true,
          type: 'Date',
        },
        {
          name: 'total_amount',
          displayName: '总金额',
          isShow: true,
          sortable: true,
          default: '',
          rules: [
            {
              required: true,
              message: '请输入总金额',
              trigger: 'blur',
              type: 'string',
              pattern: {},
            },
          ],
        },
        {
          name: 'payment_status',
          displayName: '支付状态',
          isShow: true,
          sortable: true,
          type: 'Enum',
          options: [
            {
              value: '支付预付款',
              label: '支付预付款',
            },
            {
              value: '款项收齐',
              label: '款项收齐',
            },
            {
              value: '其他',
              label: '其他',
            },
          ],
        },
        {
          name: 'review_status',
          displayName: '审核状态',
          isShow: true,
          sortable: true,
          type: 'Enum',
          options: [
            {
              value: '已审核',
              label: '已审核',
            },
            {
              value: '拒绝',
              label: '拒绝',
            },
            {
              value: '审核中',
              label: '审核中',
            },
          ],
        },
        {
          name: 'contract_tag',
          displayName: '合同标签',
          isShow: true,
          type: 'Enum',
          multiple: true,
          options: [
            {
              value: '好合同',
              label: '好合同',
            },
            {
              value: '坏合同',
              label: '坏合同',
            },
            {
              value: '一般合同',
              label: '一般合同',
            },
          ],
        },
        {
          name: 'contract_cate',
          displayName: '合同分类',
          isShow: true,
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
        {
          name: 'client_id',
          displayName: '客户ID',
          isShow: false,
          sortable: true,
        },
      ], // todo: change when needed
      loading: true, // main table loading status
      tableData: [], // needless to say
      selectionList: [], // selected rows
      exportAllVisible: false,
      // import csv module
      successList: [],
      failList: [],
      isImporting: false,
      importDialog: false,
      csvTable: [],
      // edit and add module
      showAddOrUpdate: false,
      editId: null,
    }
  },
}
</script>

<style lang="scss" scoped></style>
