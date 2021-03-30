/* eslint-disable class-methods-use-this */
import _axios, { get, put, _delete } from '@/lin/plugin/axios'

// 我们通过 class 这样的语法糖使模型这个概念更加具象化，其优点：耦合性低、可维护性。
class Attribute {
  // constructor() {}

  // 类中的方法可以代表一个用户行为
  async createAttr(data) {
    return _axios({
      method: 'post',
      url: 'v1/pms-attr',
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

  async delete(id) {
    const res = await _delete(`v1/pms-attr/${id}`)
    return res
  }

  async getAttrGroups() {
    return _axios({
      method: 'get',
      url: 'v1/pms-attr-group/list',
      handleError: true,
    })
  }

  async getAttrsByGroupId(groupId) {
    return _axios({
      method: 'get',
      url: `v1/pms-attr/groupId/${groupId}`,
      handleError: true,
    })
  }

  async getAttrsById(id) {
    return _axios({
      method: 'get',
      url: `v1/pms-attr/${id}`,
      handleError: true,
    })
  }

  async deleteAttrGroup(id) {
    return _axios({
      method: 'delete',
      url: `v1/pms-attr-group/${id}`,
      handleError: true,
    })
  }

  async createGroup(name) {
    return _axios({
      method: 'post',
      url: 'v1/pms-attr-group',
      handleError: true,
      data: {
        attr_group_name: name,
      },
    })
  }

  async updateAttr(id, data) {
    return _axios({
      method: 'put',
      url: `v1/pms-attr/${id}`,
      handleError: true,
      data,
    })
  }
}

export default new Attribute()
