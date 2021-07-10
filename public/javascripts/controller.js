import { TodoModel } from './api.js'
import { TodoView } from './views.js'

export class App {
  constructor() {
    
    this.api = new TodoModel();
    this.view = new TodoView();

    this.$itemsContainer = $('#items');

    this.getTodos();
    this.addListeners();
    // this.addListeners();
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
    this.addSidebarListeners();
    this.addTodoItemListeners();
  }

  addTodoItemListeners() {
    this.$itemsContainer.on('click', e => {
      e.preventDefault();

      if (this.isNewTodoBtn(e)) return this.view.loadTodoForm();
      if (this.isDeleteItemBtn(e)) return this.deleteSelectedTodo(e);
      console.log('test')
      // switch(true) {
      //   case this.isNewTodoBtn(e):
      // }
      // if ($(e.target).closest('label').attr('for') === 'new_item') {
      //   this.view.loadTodoForm();
      // }
    });
    // this.addDeleteBtnListeners();
    // this.addCompletionStatusListeners();
    // this.addEditBtnListeners();
  }
  
  isNewTodoBtn(event) {
    return $(event.target).closest('label').attr('for') === 'new_item';
  }

  isDeleteItemBtn(event) {
    return $(event.target).closest('td').hasClass('delete');
  }

  deleteSelectedTodo(event) {
    let id = $(event.target).closest('tr').data('id');
    this.api.delete(id); //.then( () => console.log(String(id) + ' | deleted'))
    // refresh stage
  }

  addDeleteBtnListeners() {
    // this.$itemsContainer.
  }

  addCompletionStatusListeners() {}
  addEditBtnListeners() {}

  addHomepageListeners() {
    this.addNewTodoBtnListener();
  }

  addNewTodoBtnListener() {
    // this.$itemsContainer.on('click', e => {
    //   e.preventDefault();
    //   if ($(e.target).closest('label').attr('for') === 'new_item') {
    //     this.view.loadTodoForm();
    //   }
    // });
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
    });
  }

  addSidebarListeners() {
    $('#sidebar').on('click', e => {
      let $target = $(e.target);

      let $targetBtn = $(e.target).closest('[data-title]');

      if ($targetBtn.length !== 0) {
        // this.view.clearSidebarButtons();
        // $targetBtn.addClass('active');

        // // console.log($targetBtn.data('title')) //


        this.view.displayList($targetBtn);
        // refresh page
      }
    });
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
    console.log('submit');
    let form = $('form')[0];
    let data = new FormData(form);

    if (!this.isValidTodo(data)) {
      alert('You must enter a title at least 3 characters long.');
      return;
    }
    
    this.api.submit(form.getAttribute('method'), data)
      .then(() => {
        // todo: update homepage
        // this.view.loadPage();
        this.view.hideModal();
        this.getTodos();
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