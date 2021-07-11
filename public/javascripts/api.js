export class TodoModel {
  constructor() {
    this.path = '/api/todos/';
    this.defaultHeaderObj = { headers: {'Content-Type': 'application/json'} };
  }

  async getAll() {
    return await this.read();
  }

  async read(id) {
    const requestObj = Object.assign({ method: 'GET' }, this.defaultHeaderObj);
    return await fetch(`${this.path}${id ? id : ''}`, requestObj).then(response => response.json())
  }

  reset() {
    this.read('/api/reset');
  }

  async updateTodo(todo) {
    let requestObj = {
      method: 'PUT',
      ...this.defaultHeaderObj,
      body: JSON.stringify(todo),
    }
    return await fetch(`${this.path}${todo.id}`, requestObj);
  }

  async submit(method, formData) {
    let id = formData.get('id');
    let requestObj = {
      method: method,
      ...this.defaultHeaderObj,
      body: JSON.stringify(Object.fromEntries(formData)),
    }
    return await fetch(`${this.path}${id ? id : ''}`, requestObj);
  }

  async delete(id) {
    const requestObj = Object.assign({ method: 'DELETE' }, this.defaultHeaderObj); // does delete need this header?
    return await fetch(this.path + String(id), requestObj)
      .then(response => {
        if (response.status === 404) console.log(response.status, ': Could not delete todo item');
      });
  }
}