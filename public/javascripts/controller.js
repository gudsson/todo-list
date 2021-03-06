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
      if (this.isHamburgerBtn($btn)) return $('#sidebar').toggle();
      if (this.isEditItemBtn($btn)) return this.editSelectedItem($btn);
      
      if (this.itemsListenersActive) {

        if (this.isToggleItemBtn($btn) || this.isDeleteItemBtn($btn)) {
          this.itemsListenersActive = false;
        }

        switch (true) {
          case (this.isToggleItemBtn($btn)): 
            this.toggleSelectedItem($btn);
            break;
          case (this.isDeleteItemBtn($btn)):
            this.deleteSelectedTodo($btn);
        }
      }
    });
  }

  isHamburgerBtn($btn) {
    return $btn.closest('[alt="Toggle Sidebar"]').length !== 0;
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

      if (this.checkForSaveClick($btn)) return this.submitTodo();
      if (this.checkForCompletedClick($btn)) return this.submitAsCompleted($btn);
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
    return $btn.attr('type') === 'submit';
  }

  checkForCompletedClick($btn) {
    return $btn.prop('tagName') === 'BUTTON';
  }

  submitAsCompleted($btn) {
    if ($('#id').attr('value')) {
      $btn.attr('disabled', true);
      $('#completed').attr('value', 'true');
      this.submitTodo();
    } else {
      alert('Cannot mark as complete as item has not been created yet!');
    }
  }

  submitTodo() {
    let form = $('form')[0];
    let data = new FormData(form);

    if (Todos.isValidTodo(data)) {
      let method = form.getAttribute('method').toUpperCase();
      this.api.submit(method, data)
      .then(() => {
        this.view.hideModal();
        (method === 'POST') ? this.loadPage() : this.refreshPage();
      });
    } else alert('You must enter a title at least 3 characters long.');
  }
}