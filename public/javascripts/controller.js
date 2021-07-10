import { TodoModel } from './api.js'
import { TodoView } from './views.js'

export class App {
  constructor() {
    
    this.api = new TodoModel();
    this.view = new TodoView();
    this.getTodos();
    this.addListeners();
    // this.api.falsePut(3);
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
    this.addHomepageListeners();
    this.addModalListeners();
  }

  addHomepageListeners() {
    this.addNewTodoBtnListener();
  }

  addNewTodoBtnListener() {
    $('label[for="new_item"]').on('click', e => {
      this.view.loadTodoForm();
    });
  }

  addModalListeners() {
    $('#form_modal').on('click', e => {
      e.preventDefault();
      e.stopPropagation();
      this.checkForSaveClick(e);
      this.checkForCompletedClick(e);
    });

    $('#modal_layer').on('click', e => {
      this.view.hideModal();
    })
  }

  checkForSaveClick(event) {
    if ($(event.target).attr('type') === 'submit') this.submitTodo();
  }

  checkForCompletedClick(event) {
    if ($(event.target).prop('tagName') === 'BUTTON') {
      if ($('#id').attr('value')) {
        $('#completed').attr('value', 'true');
        this.submitTodo();
      } else {
        alert('Cannot mark as complete as item has not been created yet!');
      }
    }
  }

  submitTodo() {
    let form = $('form')[0];
    let data = new FormData(form);

    if (!this.isValidTodo(data)) {
      alert('You must enter a title at least 3 characters long.');
      return;
    }
    
    this.api.submit(form.getAttribute('method'), data)
      .then(() => {
        // todo: update homepage
        this.view.hideModal();
      });
  }



  isValidTodo(formData) {
    return formData.get('title').length >= 3;
  }


  // test() {
  //     let data = {
  //       title: "todo3",
  //     };

  //     // let data = {
  //     //   title: "jay's todo3",
  //     //   day: 44,
  //     // };
      
  //     this.api.falsePost('POST', data);
  // }

  // clickDocToTest() {
  //   $(document).on('click', e => {
  //     console.log(this.todos);
  //   });
  // }
}