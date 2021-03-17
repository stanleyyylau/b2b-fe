const contractRouter = {
  route: null,
  name: null,
  title: '合同管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconfont icon-tushuguanli',
  filePath: 'view/contract/', // 文件路径
  order: null,
  inNav: true,
  children: [
    {
      title: '添加合同',
      type: 'view',
      name: 'ContractCreate',
      route: '/contract/add',
      filePath: 'view/contract/contract-add.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
    {
      title: '我的合同',
      type: 'view',
      name: 'ContractList',
      route: '/contract/list',
      filePath: 'view/contract/contract-list.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
    {
      title: '编辑合同',
      type: 'view',
      name: 'ContractList',
      route: '/contract/edit',
      filePath: 'view/contract/contract-edit.vue',
      inNav: false,
      icon: 'iconfont icon-tushuguanli',
    },
    {
      title: '待审核合同',
      type: 'view',
      name: 'ContractPending',
      route: '/contract/pending',
      filePath: 'view/contract/contract-pending.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
  ],
}

export default contractRouter
