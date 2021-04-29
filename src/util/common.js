import * as accounting from 'accounting-js'
import _axios from 'lin/plugin/axios'
import country from '@/util/country'

const formatMoneyUSD = amount => `${accounting.formatMoney(amount, 'US$')}`
const formatMoneyCNY = amount => `${accounting.formatMoney(amount, { symbol: '¥', format: '%s%v' })}`

function checkAddZone(num) {
  return num < 10 ? `0${num.toString()}` : num
}

// eslint-disable-next-line import/prefer-default-export
export const replaceOwnedByWithName = async list => {
  const users = await _axios({
    method: 'get',
    url: 'cms/user/list',
  })
  return list.map(item => ({
    ...item,
    owned_by: users.filter(user => user.id === item.owned_by)[0]
      ? users.filter(user => user.id === item.owned_by)[0].nickname
      : '',
    ownedBy: users.filter(user => user.id === item.owned_by)[0]
      ? users.filter(user => user.id === item.owned_by)[0].nickname
      : '',
  }))
}
window.accounting = accounting

export const filterTimeYmdHms = value => {
  // 过滤时间戳，返回值yyyy-mm-dd ss
  if (!value) {
    return value
  }
  const date = new Date(value * 1000)
  const y = 1900 + date.getYear()
  const m = `0${date.getMonth() + 1}`
  const d = `0${date.getDate()}`
  const hh = date.getHours()
  const mm = `${date.getMinutes()}`
  const ss = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
  const val = `${y}-${m.substring(m.length - 2, m.length)}-${d.substring(d.length - 2, d.length)}  ${hh}:${mm}:${ss}`
  return val
}

export const dateTimeFormatter = t => {
  if (!t) return ''
  t = new Date(t).getTime() // eslint-disable-line
  t = new Date(t) // eslint-disable-line
  const year = t.getFullYear()
  let month = t.getMonth() + 1
  month = checkAddZone(month)

  let date = t.getDate()
  date = checkAddZone(date)

  let hour = t.getHours()
  hour = checkAddZone(hour)

  let min = t.getMinutes()
  min = checkAddZone(min)

  let se = t.getSeconds()
  se = checkAddZone(se)

  return `${year}-${month}-${date} ${hour}:${min}:${se}`
}

export const dateFormatter = nows => {
  if (!nows) return ''
  const now = new Date(nows)
  const year = now.getFullYear()

  let month = now.getMonth() + 1
  month = checkAddZone(month)

  let date = now.getDate()
  date = checkAddZone(date)
  return `${year}-${month}-${date}`
}

export const filterUSD = v => formatMoneyUSD(v)

export const filterCNY = v => formatMoneyCNY(v)

export const priceNumValidatorRules = [
  {
    message: '请输入金额, 最多两个小数点',
    trigger: 'blur',
    type: 'string',
    required: true,
    pattern: /^[0-9]+(\.[0-9]{1,2})?$/,
  },
]

export const integerValidatorRules = [
  {
    message: '必须为正整数',
    trigger: 'blur',
    type: 'string',
    required: true,
    pattern: /^\d+$/,
  },
]

export const isObjNotEmpty = obj => {
  if (typeof obj === 'object') {
    let result = false
    for (const key in obj) {
      if (key) {
        result = true
      }
    }
    return result
  }
  return Boolean(obj)
}

export const clientLevelOptions = [
  {
    value: 'AAA 大客户',
    label: 'AAA 大客户',
  },
  {
    value: 'AA 已下单客户',
    label: 'AA 已下单客户',
  },
  {
    value: 'A 重要客户',
    label: 'A 重要客户',
  },
  {
    value: 'B 意向客户',
    label: 'B 意向客户',
  },
  {
    value: 'C 普通客户',
    label: 'C 普通客户',
  },
  {
    value: 'D 非优先客户',
    label: 'D 非优先客户',
  },
]

export const clientIndustryOptions = [
  {
    value: '品牌商',
    label: '品牌商',
  },
  {
    value: '大C客户',
    label: '大C客户',
  },
  {
    value: '批发商',
    label: '批发商',
  },
  {
    value: '电商客户',
    label: '电商客户',
  },
  {
    value: '贸易商',
    label: '贸易商',
  },
  {
    value: '新入行',
    label: '新入行',
  },
  {
    value: '未知',
    label: '未知',
  },
]

export const clientSourceOptions = [
  {
    value: '阿里',
    label: '阿里',
  },
  {
    value: '开发信',
    label: '开发信',
  },
  {
    value: '官网',
    label: '官网',
  },
]

export const clientCountryOptions = country

export const clientCategoryOptions = [
  {
    value: '口罩（防疫物资）',
    label: '口罩（防疫物资）',
  },
  {
    value: '搜索引擎',
    label: '搜索引擎',
  },
  {
    value: '金属卡包',
    label: '金属卡包',
  },
  {
    value: '3C电子 （耳机，音箱，充电线）',
    label: '3C电子 （耳机，音箱，充电线）',
  },
]
