/* eslint-disable class-methods-use-this */
// import _axios, { get, put, _delete } from '@/lin/plugin/axios'

// 我们通过 class 这样的语法糖使模型这个概念更加具象化，其优点：耦合性低、可维护性。
class LocalStore {
  // constructor() {}
  put(key, obj) {
    localStorage.setItem(key, JSON.stringify(obj))
  }

  get(key) {
    const str = localStorage.getItem(key)
    return str ? JSON.parse(str) : null
  }

  delete(key) {
    localStorage.removeItem(key)
  }
}

export default new LocalStore()
