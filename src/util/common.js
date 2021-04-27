import * as accounting from 'accounting-js'
import Client from '@/model/client'

const formatMoneyUSD = amount => `${accounting.formatMoney(amount, 'US$')}`
const formatMoneyCNY = amount => `${accounting.formatMoney(amount, { symbol: '¥', format: '%s%v' })}`

function checkAddZone(num) {
  return num < 10 ? `0${num.toString()}` : num
}

// eslint-disable-next-line import/prefer-default-export
export const replaceOwnedByWithName = async list => {
  const res = await Client.listUsers()
  const users = res
  return list.map(item => ({
    ...item,
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
