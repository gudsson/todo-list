export class TodoView {
  constructor() {
    this.$main = $('main');
    this.$modal = $('.modal');
    this.$formModal = $('#form_modal');
    this.$sidebar = $('#sidebar');
    this.$dateListContainer = $('#all_lists'); //maybe just use in method
    this.$completedDateListContainer = $('#completed_lists'); //maybe just use in method
    // this.modal = Handlebars.compile($('#modal').html());
    this.form = Handlebars.compile($('#modalForm').html());
    this.sidebarList = Handlebars.compile($('#sidebarList').html());

    // this.sidebarTemplate = Handlebars.compile($('#sidebarTemplate').html());
    // // this.optionTemplate = Handlebars.compile($('#optionTemplate').html());

    // Handlebars.registerHelper('ifSelected', () => {

    // });
    Handlebars.registerHelper('isSelected', (optionValue, dataValue) => {
      return optionValue === dataValue;
    });

    // this.allListsPartial = Handlebars.compile($('#allListsPartial').html());
    // Handlebars.registerPartial('allListsPartial', $('#allListsPartial').html());

    this.dayOptions = Handlebars.compile($('#dayOptions').html());
    Handlebars.registerPartial('dayOptions', $('#dayOptions').html());

    this.monthOptions = Handlebars.compile($('#monthOptions').html());
    Handlebars.registerPartial('monthOptions', $('#monthOptions').html());

    this.yearOptions = Handlebars.compile($('#yearOptions').html());
    Handlebars.registerPartial('yearOptions', $('#yearOptions').html());

    // this.initializePage();

  }
  
  loadPage(todos) {
    this.todos = todos;
    this.todosCompleted = todos.filter(todo => todo.completed);
    this.todoGroups = this.groupTodosByDate(this.todos);
    this.todoCompletedGroups = this.groupTodosByDate(this.todosCompleted);

    this.loadSidebar();

    this.updateItemCounts();
  }

  updateItemCounts() {
    this.updateAllItemCount();
    this.updateAllGroupCounts();
    this.updateCompletedItemCount();
  }

  loadSidebar() {
    this.loadAllTodosDates();
    this.loadAllCompletedTodosDates
    this.updateItemCounts();

    
  }

  loadAllTodosDates() {
    this.$completedDateListContainer.html(this.sidebarList({ dateGroups: this.getSortedDateGroups()}));
  }

  loadAllCompletedTodosDates() {
    // this.$dateListContainer.html(this.sidebarList({ dateGroups: this.getSortedDateGroups()}));
  }

  getSortedDateGroups() {
    return Object.keys(this.todoGroups).sort((a, b) => +a.replace(/\D/g, '') - +b.replace(/\D/g, ''));
  }

  updateAllGroupCounts() {
    let $dlTags = this.$dateListContainer.find('dl');

    $dlTags.each((_, element) => {
      let dateGroup = $(element).attr('data-title'); 
      this.updateCount($(element), this.todoGroups[dateGroup]);
    });
  }

  updateAllItemCount() {
    this.updateCount($('#all_header'), this.todos);
  }

  updateCompletedItemCount() {
    this.updateCount($('#completed_items'), this.todosCompleted);
  }

  updateCount($containingElement, group) {
    $containingElement.attr('data-total', String(group.length));
    $containingElement.find('dd').text(group.length);
  }




  // initializePage(todos) {
  //   // this.addForm();
  //   this.loadSidebar(todos);
  // }

  // loadSidebar(todos) {
  //   this.groupTodosByDate(todos);
  //   this.$sidebar.html(this.sidebarTemplate);
  //   // this.$sidebar.html(this.sidebarTemplate({ todos: todos, groups: this.todoGroups }));
  // }

  groupTodosByDate(todos) {
    let todoGroups = {};

    todos.forEach(todo => {
      let date = (todo.month && todo.year) ? `${todo.month}/${todo.year.slice(2)}` : 'No Due Date';

      if (!todoGroups[date]) {
        todoGroups[date] = [todo];
      } else todoGroups[date].push(todo);
    });

    return todoGroups;
  }

  loadEditTodoForm(data) {
    this.loadTodoForm(data);
  }

  loadTodoForm(data = {}) {
    this.$formModal.html(this.form(data));
    this.showModal();
  }

  // addForm() {
  //   $('#form_modal').html(this.form);
  // }

  toggleModalVisibility() {
    this.$modal.fadeToggle();
  }

  showModal() {
    this.$modal.fadeIn('slow');
  }

  hideModal() {
    this.$modal.fadeOut('slow');
  }
}