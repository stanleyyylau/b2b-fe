/* eslint-disable class-methods-use-this */
import _axios from '@/lin/plugin/axios'

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

  async page(count, page) {
    return _axios({
      method: 'get',
      url: `v1/cms-client-info/page?count=${count}&page=${page}`,
    })
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

  async listFollowLog(id) {
    return _axios({
      method: 'get',
      url: `v1/cms-client-follow-log/listByClientId/${id}`,
    })
  }
}

export default new Client()
