/* eslint-disable class-methods-use-this */
import BaseModel from '@/model/BaseModel'

// 我们通过 class 这样的语法糖使模型这个概念更加具象化，其优点：耦合性低、可维护性。
class TodoModel extends BaseModel {
  resourceBaseUrl = 'v1/todo'

  // constructor() {}
}

export default new TodoModel()
