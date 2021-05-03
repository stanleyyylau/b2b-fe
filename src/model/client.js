/* eslint-disable class-methods-use-this */
import _axios from '@/lin/plugin/axios'
import { isObjNotEmpty, replaceOwnedByWithName } from '@/util/common'

// 我们通过 class 这样的语法糖使模型这个概念更加具象化，其优点：耦合性低、可维护性。
class Client {
  // constructor() {}
  async createClient(data) {
    return _axios({
      method: 'post',
      url: 'v1/cms-client-info',
      data,
    })
  }

  async list() {
    return _axios({
      method: 'get',
      url: 'v1/cms-client-info/list',
    })
  }

  async listUsers() {
    return _axios({
      method: 'get',
      url: 'cms/user/list',
    })
  }

  async listUserOptions() {
    const users = await this.listUsers()
    return users.map(user => ({
      label: user.nickname,
      value: user.id,
    }))
  }

  async page(count, curPage, params, listSeaClient = false) {
    const data = {}
    for (const key in params) {
      if (isObjNotEmpty(params[key])) {
        data[key] = params[key]
      }
    }
    if (listSeaClient) {
      data.owned_by = [0]
    }
    const res = await _axios({
      method: 'post',
      url: `v1/cms-client-info/page?count=${count}&page=${curPage}`,
      data,
    })
    const filterResult = await this.postFilterContractList(res.items)
    return {
      ...res,
      items: filterResult,
    }
  }

  async postFilterContractList(list) {
    const withOwnBy = await replaceOwnedByWithName(list)
    return withOwnBy.map(item => ({
      ...item,
      contact_methods: JSON.parse(item.contact_methods),
    }))
  }

  async deleteClient(id) {
    return _axios({
      method: 'delete',
      url: `v1/cms-client-info/${id}`,
    })
  }

  async getClientDetail(id) {
    return _axios({
      method: 'get',
      url: `v1/cms-client-info/detail/${id}`,
    })
  }

  async updateClient(transformedForm, clientId) {
    return _axios({
      method: 'put',
      url: `v1/cms-client-info/${clientId}`,
      data: transformedForm,
    })
  }

  async listSea() {
    return _axios({
      method: 'get',
      url: 'v1/cms-client-info/listSea',
    })
  }

  async acquireClient(clientId) {
    return _axios({
      method: 'get',
      url: `v1/cms-client-info/acquireClient/${clientId}`,
    })
  }

  async getFileByClientId(showDrawerForClientId) {
    return _axios({
      method: 'get',
      url: `v1/cms-client-files/byClientId/${showDrawerForClientId}`,
    })
  }

  async addFollowLog(data) {
    return _axios({
      method: 'post',
      url: 'v1/cms-client-follow-log',
      data,
    })
  }

  async updateFollowLog(id, data) {
    return _axios({
      method: 'put',
      url: `v1/cms-client-follow-log/${id}`,
      data,
    })
  }

  async deleteFollowLog(id) {
    return _axios({
      method: 'delete',
      url: `v1/cms-client-follow-log/${id}`,
    })
  }

  async listFollowLog(id) {
    const res = await _axios({
      method: 'get',
      url: `v1/cms-client-follow-log/listByClientId/${id}`,
    })
    const withName = await replaceOwnedByWithName(res)
    return withName.map(item => ({
      ...item,
      follow_time: new Date(item.follow_time).toLocaleString(),
    }))
  }

  async exportAll() {
    return _axios({
      method: 'get',
      url: 'v1/cms-client-info/export',
      responseType: 'blob',
    })
  }

  async isEmailValidForSignUp(email) {
    const res = await _axios({
      method: 'get',
      url: `v1/cms-client-info/checkValid/${email}`,
    })
    return res.isValid
  }
}

export default new Client()
