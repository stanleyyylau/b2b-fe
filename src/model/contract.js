/* eslint-disable class-methods-use-this */
import _axios from '@/lin/plugin/axios'
import { dateFormatter, filterCNY, filterUSD, isObjNotEmpty, replaceOwnedByWithName } from '@/util/common'

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

  async listPending() {
    const res = await _axios({
      method: 'get',
      url: 'v1/ims-contract/listPending',
    })
    const withOwnBy = await replaceOwnedByWithName(res)
    return this.contractFilter(withOwnBy)
  }

  async list() {
    const res = await _axios({
      method: 'get',
      url: 'v1/ims-contract/list',
    })
    const withOwnBy = await replaceOwnedByWithName(res)
    return this.contractFilter(withOwnBy)
  }

  contractFilter(list) {
    return list.map(item => ({
      ...item,
      total_amount: filterUSD(item.total_amount),
      actual_delivery_fee: filterCNY(item.actual_delivery_fee),
      raw_cost: filterCNY(item.raw_cost),
      contract_time: dateFormatter(item.contract_time),
      delivery_time: dateFormatter(item.delivery_time),
    }))
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

  async search(count, curPage, params) {
    const data = {}
    for (const key in params) {
      if (isObjNotEmpty(params[key])) {
        data[key] = params[key]
      }
    }
    const res = await _axios({
      method: 'post',
      url: `v1/ims-contract/page?count=${count}&page=${curPage}`,
      data,
    })
    console.log('page res', res)
    const filterResult = await this.postFilterContractList(res.items)
    return {
      ...res,
      items: filterResult,
    }
  }

  async postFilterContractList(list) {
    const withOwnBy = await replaceOwnedByWithName(list)
    return this.contractFilter(withOwnBy)
  }

  async exportAll() {
    return _axios({
      method: 'get',
      url: 'v1/ims-contract/export',
      responseType: 'blob',
    })
  }
}

export default new Contract()
