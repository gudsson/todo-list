import { TodoModel } from './api.js'
import { TodoView } from './views.js'
import { Todos } from './todos.js'

export class App {
  constructor() {
    this.api = new TodoModel();
    this.view = new TodoView();
    this.todos = new Todos();

    this.loadPage();
    this.addListeners();
  }

  async renderPage(viewFunc) {
    let todos = await this.api.getAll();
    this.todos.set(todos);
    this.itemsListenersActive = true;
    viewFunc(this.todos);
  }

  loadPage() {
    this.renderPage(this.view.loadPage.bind(this.view));
  }

  refreshPage() {
    this.renderPage(this.view.refreshPage.bind(this.view));
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
      
      
      if (this.itemsListenersActive) {
        this.itemsListenersActive = false;

        switch (true) {
          case (this.isToggleItemBtn($btn)): 
            this.toggleSelectedItem($btn);
            break;
          case (this.isDeleteItemBtn($btn)):
            this.deleteSelectedTodo($btn);
            break;
          case (this.isEditItemBtn($btn)):
            this.editSelectedItem($btn);
        }
      }
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
    let todo = this.todos.get(this.getIdFromBtn($btn));
    let $checkbox = $btn.closest('.list_item').find('input');
    $checkbox.prop("checked", !$checkbox.prop("checked"))
    this.toggleCompletionStatus(todo);
    this.api.updateTodo(todo).then(() => this.refreshPage());
  }

  toggleCompletionStatus(todo) {
    todo.completed = !todo.completed;
  }

  editSelectedItem($btn) {
    let todo = this.todos.get(this.getIdFromBtn($btn));
    this.view.loadTodoForm(todo);
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

    this.deleteTodo(id).then(() => this.refreshPage());
  }
  
  async deleteTodo(id) {
    if (this.todos.count() === 1) return await this.api.reset();
    return await this.api.delete(id);
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
    if ($btn.attr('type') === 'submit') this.submitTodo();
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

    if (Todos.isValidTodo(data)) {
      this.api.submit(form.getAttribute('method'), data)
      .then(() => {
        this.view.hideModal();
        this.loadPage();
      });
    } else alert('You must enter a title at least 3 characters long.');
  }
}