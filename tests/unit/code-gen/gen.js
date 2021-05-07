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
    collectionName: 'todo',
    collectionDisplayName: '待办事项',
    modelName: 'todoModel',
    modelFileName: 'todo-model.js',
    endpointBasePath: 'v1/todo',
    searchFields: [],
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
  data.searchFields = data.fields.filter(item => item.isSearchField === true)
  data.dataFormRaw = dataFormRaw
  genList(data)
  genModel(data)
  genAddOrUpdate(data)
}
main()
