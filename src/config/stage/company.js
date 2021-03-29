const companyRouter = {
  route: null,
  name: null,
  title: '企业管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconfont icon-tushuguanli',
  filePath: 'view/company/', // 文件路径
  order: null,
  inNav: true,
  permission: ['新增产品'],
  children: [
    {
      title: '打印模版',
      type: 'view',
      name: Symbol('printList'),
      route: '/printList',
      filePath: 'view/print/print-list.vue',
      inNav: true,
      icon: 'iconfont icon-rizhiguanli',
      order: 99,
    },
    {
      title: '新建打印模版',
      type: 'view',
      name: Symbol('printCreate'),
      route: '/printCreate',
      filePath: 'view/print/template-create.vue',
      inNav: false,
      icon: 'iconfont icon-rizhiguanli',
      order: 99,
    },
    {
      title: '编辑打印模版',
      type: 'view',
      name: Symbol('printEdit'),
      route: '/printEdit',
      filePath: 'view/print/template-edit.vue',
      inNav: false,
      icon: 'iconfont icon-rizhiguanli',
      order: 99,
    },
  ],
}

export default companyRouter
