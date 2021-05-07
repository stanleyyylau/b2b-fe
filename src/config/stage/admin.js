const adminRouter = {
  route: null,
  name: null,
  title: '权限管理',
  type: 'folder',
  icon: 'iconfont icon-huiyuanguanli',
  filePath: 'view/admin/',
  order: null,
  inNav: true,
  permission: ['超级管理员独有权限'],
  children: [
    {
      title: 'template example',
      type: 'view',
      name: 'template',
      route: '/template',
      filePath: 'view/contract/data-template.vue',
      inNav: true,
      permission: ['超级管理员独有权限'],
      icon: 'iconfont icon-tushuguanli',
    },
    {
      title: 'gen test',
      type: 'view',
      name: 'gen',
      route: '/gen',
      filePath: 'view/gen/gen-list.vue',
      inNav: true,
      permission: ['超级管理员独有权限'],
      icon: 'iconfont icon-tushuguanli',
    },
    {
      title: '待办事项',
      type: 'view',
      name: 'todo',
      route: '/todo',
      filePath: 'view/gen/todo-list.vue',
      inNav: true,
      permission: ['超级管理员独有权限'],
      icon: 'iconfont icon-tushuguanli',
    },
    {
      route: '/admin/user/list',
      name: null,
      title: '用户管理',
      type: 'folder', // 取 route 为默认加载页
      icon: 'iconfont icon-huiyuanguanli',
      filePath: 'view/admin/user/',
      inNav: true,
      children: [
        {
          title: '用户列表',
          type: 'view',
          name: 'userList',
          route: '/admin/user/list',
          filePath: 'view/admin/user/user-list.vue',
          inNav: true,
          icon: 'iconfont icon-huiyuanguanli',
          permission: ['超级管理员独有权限'],
        },
        {
          title: '添加用户',
          type: 'view',
          inNav: true,
          route: '/admin/user/add',
          icon: 'iconfont icon-add',
          name: 'UserCreate',
          filePath: 'view/admin/user/user-create.vue',
          permission: ['超级管理员独有权限'],
        },
      ],
    },
    {
      route: '/admin/group/list',
      name: null,
      title: '分组管理',
      type: 'tab', // 取 route 为默认加载页
      icon: null,
      filePath: 'view/admin/group',
      inNav: true,
      children: [
        {
          route: '/admin/group/list',
          type: 'view',
          name: 'groupList',
          inNav: true,
          filePath: 'view/admin/group/group-list.vue',
          title: '分组列表',
          icon: 'iconfont icon-huiyuanguanli',
          permission: ['超级管理员独有权限'],
        },
        {
          route: '/admin/group/add',
          type: 'view',
          name: 'GroupCreate',
          filePath: 'view/admin/group/group-create.vue',
          inNav: true,
          title: '添加分组',
          icon: 'iconfont icon-add',
          permission: ['超级管理员独有权限'],
        },
        {
          route: '/admin/group/edit',
          type: 'view',
          name: 'GroupEdit',
          filePath: 'view/admin/group/group-edit.vue',
          inNav: false,
          title: '修改分组',
          icon: 'iconfont icon-add',
          permission: ['超级管理员独有权限'],
        },
      ],
    },
  ],
}

export default adminRouter
