/* eslint-disable class-methods-use-this */
import _axios from '@/lin/plugin/axios'

// 我们通过 class 这样的语法糖使模型这个概念更加具象化，其优点：耦合性低、可维护性。
class Contract {
  // constructor() {}
  async create(data) {
    return _axios({
      method: 'post',
      url: 'v1/ims-contract',
      data,
    })
  }

  async list() {
    return _axios({
      method: 'get',
      url: 'v1/ims-contract/list',
    })
  }

  async delete(id) {
    return _axios({
      method: 'delete',
      url: `v1/ims-contract/${id}`,
    })
  }

  async getDetail(editId) {
    return _axios({
      method: 'get',
      url: `v1/ims-contract/${editId}`,
    })
  }

  async update(editId, data) {
    return _axios({
      method: 'put',
      url: `v1/ims-contract/${editId}`,
      data,
    })
  }

  async getTemplateById(id) {
    return _axios({
      method: 'get',
      url: `v1/ims-print-template/${id}`,
    })
  }

  async listTpl() {
    return _axios({
      method: 'get',
      url: 'v1/ims-print-template/list',
    })
  }

  async editTpl(id, data) {
    return _axios({
      method: 'put',
      url: `v1/ims-print-template/${id}`,
      data,
    })
  }

  async createTpl(data) {
    return _axios({
      method: 'post',
      url: 'v1/ims-print-template',
      data,
    })
  }
}

export default new Contract()
