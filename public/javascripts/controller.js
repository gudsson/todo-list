import { TodoModel } from './api.js'
import { TodoView } from './views.js'


export class App {
  constructor() {
    
    this.api = new TodoModel();
    this.view = new TodoView();

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
    $('#items').on('click', e => {
      e.preventDefault();

      let $btn = $(e.target);

      if (this.isNewTodoBtn($btn)) return this.view.loadTodoForm();
      if (this.isDeleteItemBtn($btn)) return this.deleteSelectedTodo($btn);
      if (this.isEditItemBtn($btn)) return this.editSelectedItem($btn);
      if (this.isToggleItemBtn($btn)) return this.toggleSelectedItem($btn);
    });
  }

  isEditItemBtn($btn) {
    let forAttr = $btn.attr('for');
    return forAttr && forAttr.startsWith('item_');
  }

  isToggleItemBtn($btn) {
    return $btn.closest('.list_item').length !== 0;
  }

  toggleSelectedItem($btn) {
    let todo = this.getTodoById(this.getIdFromBtn($btn));

    this.toggleCompletionStatus(todo);
    this.api.updateTodo(todo).then(() => this.refreshPage());
  }

  toggleCompletionStatus(todo) {
    todo.completed = !todo.completed;
  }

  editSelectedItem($btn) {
    let todo = this.getTodoById(this.getIdFromBtn($btn));
    this.view.loadTodoForm(todo);
  }

  getTodoById(id) {
    return this.todos.find(todo => todo.id === id);
  }

  getIdFromBtn($btn) {
    return $btn.closest('tr').data('id');
  }
  
  isNewTodoBtn($btn) {
    return $btn.closest('label').attr('for') === 'new_item';
  }

  isDeleteItemBtn($btn) {
    return $btn.closest('td').hasClass('delete');
  }

  deleteSelectedTodo($btn) {
    let id = $btn.closest('tr').data('id');
    this.api.delete(id).then(() => this.refreshPage());
  }

  addModalListeners() {
    $('#form_modal').on('click', e => {
      e.preventDefault();
      e.stopPropagation();
      let $btn = $(e.target);

      this.checkForSaveClick($btn);
      this.checkForCompletedClick($btn);
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

  checkForSaveClick($btn) {
    if ($btn.attr('type') === 'submit') {     
      this.submitTodo();
    }
  }

  checkForCompletedClick($btn) {
    if ($btn.prop('tagName') === 'BUTTON') {
      if ($('#id').attr('value')) {
        $btn.attr('disabled',true);
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