import _axios from '@/lin/plugin/axios'
import { isObjNotEmpty } from '@/util/common'

class BaseModel {
  resourceBaseUrl = 'v1/baseResource'

  async create(data) {
    return _axios({
      method: 'post',
      url: this.resourceBaseUrl,
      data,
    })
  }

  async delete(id) {
    return _axios({
      method: 'delete',
      url: `${this.resourceBaseUrl}/${id}`,
    })
  }

  async getDetail(editId) {
    return _axios({
      method: 'get',
      url: `${this.resourceBaseUrl}/${editId}`,
    })
  }

  async update(editId, data) {
    return _axios({
      method: 'put',
      url: `${this.resourceBaseUrl}/${editId}`,
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
      url: `${this.resourceBaseUrl}/page?count=${count}&page=${curPage}`,
      data,
    })
    return {
      ...res,
      items: res.items,
    }
  }

  async exportAll() {
    return _axios({
      method: 'get',
      url: `${this.resourceBaseUrl}/export`,
      responseType: 'blob',
    })
  }
}

export default BaseModel
