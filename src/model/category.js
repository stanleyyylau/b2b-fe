/* eslint-disable class-methods-use-this */
import _axios, { get, put, _delete } from '@/lin/plugin/axios'

// 我们通过 class 这样的语法糖使模型这个概念更加具象化，其优点：耦合性低、可维护性。
class Category {
  // constructor() {}

  // 类中的方法可以代表一个用户行为
  async createCategory(catName, pid) {
    const data = {
      name: catName,
      parent_cid: pid,
      show_status: 1,
      cat_level: Number(pid) === 0 ? 0 : 1
    }
    return _axios({
      method: 'post',
      url: 'v1/pms-category',
      data,
    })
  }

  // 在这里通过 async await 语法糖让代码同步执行
  // 1. await 一定要搭配 async 来使用
  // 2. await 后面跟的是一个 Promise 对象
  async getBook(id) {
    const res = await get(`v1/book/${id}`)
    return res
  }

  async editBook(id, info) {
    const res = await put(`v1/book/${id}`, info)
    return res
  }

  async deleteBook(id) {
    const res = await _delete(`v1/book/${id}`)
    return res
  }

  async getTopLevelCategories() {
    const cates = await _axios({
      method: 'get',
      url: 'v1/pms-category/list',
      handleError: true,
    })
    return cates.filter(cat => cat.cat_level === 0)
  }

  async getSecondLevelCategories() {
    const cates = await _axios({
      method: 'get',
      url: 'v1/pms-category/list',
      handleError: true,
    })
    return cates.filter(cat => cat.cat_level === 1)
  }
}

export default new Category()
