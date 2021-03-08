const productRouter = {
  route: null,
  name: null,
  title: '产品管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconfont icon-tushuguanli',
  filePath: 'view/book/', // 文件路径
  order: null,
  inNav: true,
  children: [
    {
      title: '添加产品',
      type: 'view',
      name: 'ProductCreate',
      route: '/product/add',
      filePath: 'view/product/product-create.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
    {
      title: '产品列表',
      type: 'view',
      name: 'ProductList',
      route: '/product/list',
      filePath: 'view/product/product-list.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
    {
      title: '产品分类',
      type: 'view',
      name: 'ProductCats',
      route: '/productCat/list',
      filePath: 'view/product/product-category.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
    {
      title: '新增产品分类',
      type: 'view',
      name: 'AddProductCats',
      route: '/productCat/add',
      filePath: 'view/product/product-category-create.vue',
      inNav: false,
      icon: 'iconfont icon-tushuguanli',
    },
    {
      title: '产品属性',
      type: 'view',
      name: 'ProductAttr',
      route: '/attrGroup/list',
      filePath: 'view/product/attr-group-list.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
    {
      title: '新增产品属性',
      type: 'view',
      name: 'ProductAttr',
      route: '/attr/add',
      filePath: 'view/product/attr-create.vue',
      inNav: false,
      icon: 'iconfont icon-tushuguanli',
    }
  ],
}

export default productRouter
