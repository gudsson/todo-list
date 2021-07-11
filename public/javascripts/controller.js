import { TodoModel } from './api.js'
import { TodoView } from './views.js'

export class App {
  constructor() {
    
    this.api = new TodoModel();
    this.view = new TodoView();

    this.$itemsContainer = $('#items');

    this.loadPage();
    this.addListeners();

  }

  async loadPage() {
    this.api.getAll().then(todos => {
      this.todos = todos;
      this.view.loadPage(todos);
    });
  }

  async refreshPage() {
    this.api.getAll().then(todos => {
      this.todos = todos;
      this.view.refreshPage(todos);
    });
  }

  addListeners() {
    this.addModalListeners();
    this.addSidebarListeners();
    this.addTodoItemListeners();
  }

  addTodoItemListeners() {
    this.$itemsContainer.on('click', e => {
      e.preventDefault();

      if (this.isNewTodoBtn(e)) return this.view.loadTodoForm();
      if (this.isDeleteItemBtn(e)) return this.deleteSelectedTodo(e);

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
    this.api.delete(id).then(() => this.refreshPage());

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
      let $targetBtn = $(e.target).closest('[data-title]');
      if ($targetBtn.length !== 0) this.view.displayList($targetBtn);
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

    if (this.isValidTodo(data)) {
      this.api.submit(form.getAttribute('method'), data)
      .then(() => {
        this.view.hideModal();
        this.loadPage();
      });
    } else alert('You must enter a title at least 3 characters long.');
  }

  isValidTodo(formData) {
    return formData.get('title').length >= 3;
  }
}