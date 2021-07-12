export class TodoModel {
  constructor() {
    this.path = '/api/todos/';
    this.defaultHeaderObj = { headers: {'Content-Type': 'application/json'} };
  }

  async getAll() {
    return await this.read();
  }

  async read(id) {
    const requestObj = { method: 'GET', ...this.defaultHeaderObj};
    return await fetch(`${this.path}${id ? id : ''}`, requestObj)
      .catch(error => this.alertError(error, 'GET'));
  }

  async reset() {
    return await fetch('/api/reset').catch(error => this.alertError(error, 'RESET'));
  }

  async updateTodo(todo) {
    let requestObj = {
      method: 'PUT',
      ...this.defaultHeaderObj,
      body: JSON.stringify(todo),
    }
    return await fetch(`${this.path}${todo.id}`, requestObj)
      .catch(error => this.alertError(error, method));
  }

  async submit(method, formData) {
    let id = formData.get('id');
    let requestObj = {
      method: method,
      ...this.defaultHeaderObj,
      body: JSON.stringify(Object.fromEntries(formData)),
    }
    return await fetch(`${this.path}${id ? id : ''}`, requestObj)
      .catch(error => this.alertError(error, method));
  }

  async delete(id) {
    return await fetch(this.path + String(id), { method: 'DELETE' })
      .catch(error => this.alertError(error, 'DELETE'));
  }

  alertError(error, method) {
    alert(`${error}\n${method} request failed.`)
    location.reload(true);
  }
}