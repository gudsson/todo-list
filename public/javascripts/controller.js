import { TodoModel } from './api.js'
import { TodoView } from './views.js'

export class App {
  constructor() {
    
    this.api = new TodoModel();
    this.view = new TodoView();
    this.getTodos();
    this.addListeners();
    this.api.falsePut(1);
    // this.test();
  }

  async getTodos() {
    this.api.getAll().then(todos => {
      this.todos = todos;
      this.loadPage();
    });
  }

  loadPage() {
    this.view.loadPage(this.todos);
  }

  addListeners() {
    // this.clickDocToTest();
    this.addModalListeners();
  }

  addModalListeners() {
    this.addNewTodoBtnListener();
  }

  addNewTodoBtnListener() {
    $('label[for="new_item"]').on('click', e => {
      this.view.loadTodoForm();
    });
  }

  test() {
      let data = {
        title: "todo3",
      };

      // let data = {
      //   title: "jay's todo3",
      //   day: 44,
      // };
      
      this.api.falsePost('POST', data);
  }

  clickDocToTest() {
    $(document).on('click', e => {
      console.log(this.todos);
    });
  }
}