import adminConfig from './admin'
import productRouter from './product'
import clientPoolRouter from './clientPool'
import clientRouter from './client'
import contractRouter from './contract'
import companyRouter from '@/config/stage/company'
// import pluginsConfig from './plugin'
import Utils from '@/lin/util/util'

// eslint-disable-next-line import/no-mutable-exports
let homeRouter = [
  {
    title: '仪表盘',
    type: 'view',
    name: Symbol('about'),
    route: '/about',
    filePath: 'view/about/about.vue',
    inNav: true,
    icon: 'iconfont icon-iconset0103',
    order: 1,
  },
  {
    title: '日志管理',
    type: 'view',
    name: Symbol('log'),
    route: '/log',
    filePath: 'view/log/log.vue',
    inNav: true,
    icon: 'iconfont icon-rizhiguanli',
    order: 2,
    permission: ['查询所有日志'],
  },
  {
    title: '个人中心',
    type: 'view',
    name: Symbol('center'),
    route: '/center',
    filePath: 'view/center/center.vue',
    inNav: false,
    icon: 'iconfont icon-rizhiguanli',
  },
  {
    title: '404',
    type: 'view',
    name: Symbol('404'),
    route: '/404',
    filePath: 'view/error-page/404.vue',
    inNav: false,
    icon: 'iconfont icon-rizhiguanli',
  },
  {
    title: '打印PDF',
    type: 'view',
    name: Symbol('download'),
    route: '/download',
    filePath: 'view/print/print-download.vue',
    inNav: false,
    icon: 'iconfont icon-rizhiguanli',
    order: 100,
  },
  clientPoolRouter,
  clientRouter,
  contractRouter,
  productRouter,
  companyRouter,
  adminConfig,
]

// const plugins = [...pluginsConfig]
const plugins = []

// 筛除已经被添加的插件
function filterPlugin(data) {
  if (plugins.length === 0) {
    return
  }
  if (Array.isArray(data)) {
    data.forEach(item => {
      filterPlugin(item)
    })
  } else {
    const findResult = plugins.findIndex(item => data === item)
    if (findResult >= 0) {
      plugins.splice(findResult, 1)
    }
    if (data.children) {
      filterPlugin(data.children)
    }
  }
}

filterPlugin(homeRouter)

homeRouter = homeRouter.concat(plugins)

// 处理顺序
homeRouter = Utils.sortByOrder(homeRouter)

// 使用 Symbol 处理 name 字段, 保证唯一性
const deepReduceName = target => {
  if (Array.isArray(target)) {
    target.forEach(item => {
      if (typeof item !== 'object') {
        return
      }
      deepReduceName(item)
    })
    return
  }
  if (typeof target === 'object') {
    if (typeof target.name !== 'symbol') {
      // eslint-disable-next-line no-param-reassign
      target.name = target.name || Utils.getRandomStr()
      // eslint-disable-next-line no-param-reassign
      // todo: bug: below code cause vue router can't navigate by route name
      // target.name = Symbol(target.name)
    }

    if (Array.isArray(target.children)) {
      target.children.forEach(item => {
        if (typeof item !== 'object') {
          return
        }
        deepReduceName(item)
      })
    }
  }
}

deepReduceName(homeRouter)

export default homeRouter
