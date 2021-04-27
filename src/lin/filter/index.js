import Vue from 'vue'
import Utils from '../util/util'
import { dateFormatter, dateTimeFormatter, filterCNY, filterTimeYmdHms, filterUSD } from '@/util/common'
/*
 * 全局的过滤函数
 * */

const globalFilter = {
  filterAddress(value) {
    // 过滤地址
    if (!value) return value
    const obj = value
    return `${obj.provinceName}${obj.cityName}${obj.countyName} ${obj.detailInfo}`
  },

  filterTime(value) {
    // 过滤时间戳，返回值yyyy-mm-dd
    if (!value) {
      return value
    }
    const date = new Date(value * 1000)
    const y = 1900 + date.getYear()
    const m = `0${date.getMonth() + 1}`
    const d = `0${date.getDate()}`
    const val = `${y}-${m.substring(m.length - 2, m.length)}-${d.substring(d.length - 2, d.length)}`
    return val
  },

  filterTimeYmdHms(value) {
    return filterTimeYmdHms(value)
  },

  filterTimeYear(value) {
    // 过滤时间戳, 返回值 今年:mm-dd 往年:yyyy-mm-dd
    const jy = 1900 + new Date().getYear()
    const date = new Date(value * 1000)
    const y = 1900 + date.getYear()
    const m = `0${date.getMonth() + 1}`
    const d = `0${date.getDate()}`
    const val = `${y}-${m.substring(m.length - 2, m.length)}-${d.substring(d.length - 2, d.length)}`
    const thisYear = `${m.substring(m.length - 2, m.length)}-${d.substring(d.length - 2, d.length)}`
    if (jy === y) {
      return thisYear
    }
    return val
  },

  dateFormatter(nows) {
    return dateFormatter(nows)
  },

  dateTimeFormatter(t) {
    return dateTimeFormatter(t)
  },

  filterTitle(value, len = 9) {
    return Utils.cutString(value, len)
  },

  filterUSD(value) {
    return filterUSD(value)
  },

  filterCNY(value) {
    return filterCNY(value)
  },
}

// 全局过滤器
Object.keys(globalFilter).forEach(k => Vue.filter(k, globalFilter[k]))

export default globalFilter
