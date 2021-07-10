export class TodoModel {
  constructor() {
    this.path = '/api/todos/';
    this.defaultHeaderObj = { headers: {'Content-Type': 'application/json'} };
  }

  async getAll() {
    return await this.read(this.path);
  }

  async read(path) {
    const requestObj = Object.assign({ method: 'GET' }, this.defaultHeaderObj);
    return await fetch(path, requestObj).then(response => response.json())
  }

  reset() {
    //reset might not need the header
    this.read('/api/reset');
  }

  async submit(method, formData) {
    let id = formData.get('id');
    let requestObj = {
      method: method,
      ...this.defaultHeaderObj,
      body: JSON.stringify(Object.fromEntries(formData)),
    }
    // console.log(`${this.path}${id ? id : ''}`);
    // console.log(requestObj);
    return await fetch(`${this.path}${id ? id : ''}`, requestObj);
  }

  async delete(id) {
    const requestObj = Object.assign({ method: 'DELETE' }, this.defaultHeaderObj); // does delete need this header?
    return await fetch(this.path + String(id), requestObj)
      .then(response => {
        if (response.status === 404) this.errorAlert(response, 'Could not delete todo item');
      });
  }

  async falsePut(id) {
    let requestObj = {
      method: 'PUT',
      ...this.defaultHeaderObj,
      body: JSON.stringify({ completed: true }),
    }
    return await fetch(`${this.path}${id}`, requestObj);
    // console.log(requestObj);
  }

  async falsePost(method, formData) {
    let requestObj = {
      method: method,
      ...this.defaultHeaderObj,
      body: JSON.stringify(formData),
    }
    return await fetch(this.path, requestObj);
    // console.log(requestObj);
  }
}