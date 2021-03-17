/* eslint-disable class-methods-use-this */
import _axios, { get, put, _delete } from '@/lin/plugin/axios'

// 我们通过 class 这样的语法糖使模型这个概念更加具象化，其优点：耦合性低、可维护性。
class Product {
  // constructor() {}
  async createProduct(data) {
    return _axios({
      method: 'post',
      url: 'v1/pms-spu-info/product',
      data,
    })
  }

  async updateProduct(spuId, data) {
    return _axios({
      method: 'put',
      url: `v1/pms-spu-info/updateDetail/${spuId}`,
      data,
    })
  }

  async getProductDetail(id) {
    return _axios({
      method: 'get',
      url: `v1/pms-spu-info/detail/${id}`,
    })
  }

  async createFileForSpu(data) {
    return _axios({
      method: 'post',
      url: 'v1/pms-product-files',
      data,
    })
  }

  async getFileBySpuId(spuId) {
    return _axios({
      method: 'get',
      url: `v1/pms-product-files/bySpuId/${spuId}`,
    })
  }

  async deleteProduct(id) {
    return _axios({
      method: 'delete',
      url: `v1/pms-spu-info/${id}`,
    })
  }

  // 类中的方法可以代表一个用户行为
  async createBook(data) {
    return _axios({
      method: 'post',
      url: 'v1/book',
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

  async getProducts() {
    return _axios({
      method: 'get',
      url: 'v1/pms-spu-info/list',
      handleError: true,
    })
  }

  async createFileForClient(data) {
    return _axios({
      method: 'post',
      url: 'v1/cms-client-files',
      data,
    })
  }
}

export default new Product()
