const ejs = require('ejs')
const fs = require('fs')

const getTplByFilePath = filePath => {
  const tplStr = fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' })
  const template = ejs.compile(tplStr)
  return template
}

// eslint-disable-next-line import/prefer-default-export
const genList = data => {
  const template = getTplByFilePath('./templates/data-list.vue.ejs')
  const renderedStr = template(data)
  const generatedFileName = `${data.collectionName}-list.vue`
  const generatedFilePath = '/Users/stanleylau/code/b2b-fe/src/view/gen/'
  fs.writeFileSync(`${generatedFilePath}${generatedFileName}`, renderedStr)
}

const genModel = data => {
  const template = getTplByFilePath('./templates/data-model.js.ejs')
  const renderedStr = template(data)
  const generatedFileName = `${data.modelName}.js`
  const generatedFilePath = '/Users/stanleylau/code/b2b-fe/src/model/'
  fs.writeFileSync(`${generatedFilePath}${generatedFileName}`, renderedStr)
}

const genAddOrUpdate = data => {
  const template = getTplByFilePath('./templates/data-add-or-update.vue.ejs')
  const renderedStr = template(data)
  const generatedFileName = `${data.collectionName}-add-or-update.vue`
  const generatedFilePath = '/Users/stanleylau/code/b2b-fe/src/view/gen//'
  fs.writeFileSync(`${generatedFilePath}${generatedFileName}`, renderedStr)
}

function main() {
  const data = {
    collectionName: 'gen',
    collectionDisplayName: '合同',
    modelName: 'contractModel',
    modelFileName: 'contract-model.js',
    endpointBasePath: 'v1/ims-contract',
    searchFields: [
      {
        displayName: '业务员',
        name: 'owned_by',
        type: 'Connect',
        loading: true,
        options: [],
      },
      {
        displayName: 'PI编号',
        name: 'PI_NO',
        type: 'String',
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
      {
        displayName: '付款方式',
        name: 'payment_method',
        type: 'Enum',
        options: [
          {
            value: '阿里信保',
            label: '阿里信保',
          },
          {
            value: '美金账户',
            label: '美金账户',
          },
          {
            value: 'PayPal',
            label: 'PayPal',
          },
          {
            value: '人民币私账',
            label: '人民币私账',
          },
          {
            value: '1688',
            label: '1688',
          },
        ],
      },
    ],
    fields: [
      {
        name: 'id',
        displayName: 'id',
        isShow: false,
        sortable: true,
      },
      {
        name: 'pino',
        displayName: 'PI编号',
        isShow: true,
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
            pattern: /^[0-9]+(\.[0-9]{1,2})?$/,
          },
        ],
      },
      {
        name: 'actual_delivery_fee',
        displayName: '实际运费',
        isShow: true,
        sortable: true,
      },
      {
        name: 'payment_method',
        displayName: '付款方式',
        isShow: true,
        sortable: true,
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
        name: 'raw_cost',
        displayName: '成本价',
        isShow: true,
        sortable: true,
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
        name: 'client_id',
        displayName: '客户ID',
        isShow: false,
        sortable: true,
      },
    ],
  }
  const dataFormRaw = {}
  data.fields.forEach(field => {
    if (field.isShow) {
      dataFormRaw[field.name] = {}
      dataFormRaw[field.name].default = typeof field.default === 'undefined' ? null : field.default
      if (field.rules) {
        dataFormRaw[field.name].rules = field.rules
      }
      if (field.type === 'Date') {
        dataFormRaw[field.name].type = 'Date'
      }
    }
  })
  data.dataFormRaw = dataFormRaw
  genList(data)
  genModel(data)
  genAddOrUpdate(data)
}
main()
