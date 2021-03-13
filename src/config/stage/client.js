const clientRouter = {
  route: null,
  name: null,
  title: '客户管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconfont icon-tushuguanli',
  filePath: 'view/client/', // 文件路径
  order: null,
  inNav: true,
  children: [
    {
      title: '添加客户',
      type: 'view',
      name: 'ClientCreate',
      route: '/client/add',
      filePath: 'view/client/client-add.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
    {
      title: '我的客户',
      type: 'view',
      name: 'MyClients',
      route: '/client/my',
      filePath: 'view/client/client-list.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
  ],
}

export default clientRouter
