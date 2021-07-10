export class TodoView {
  constructor() {
    this.$main = $('main');
    this.$modal = $('.modal');
    this.$formModal = $('#form_modal');
    this.$sidebar = $('#sidebar');
    this.$ListContainer = $('#all_lists');
    this.$completedListContainer = $('#completed_lists');
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
  }
  
  loadPage(todos) {
    this.todos = todos;
    this.todosCompleted = todos.filter(todo => todo.completed);
    this.todoGroups = this.groupTodosByDate(this.todos);
    this.todoCompletedGroups = this.groupTodosByDate(this.todosCompleted);

    this.loadSidebar();
  }

  loadSidebar() {
    this.loadAllTodosDates();
    this.loadAllCompletedTodosDates();
    this.updateItemCounts();
  }

  updateItemCounts() {
    this.updateAllItemCount();
    this.updateCompletedItemCount();
    this.updateAllListCounts();
    this.updateCompletedListCounts();
  }

  loadAllTodosDates() {
    this.$ListContainer.html(this.sidebarList({ dateGroups: this.getSortedDateKeys(this.todoGroups)}));
  }

  loadAllCompletedTodosDates() {
    this.$completedListContainer.html(this.sidebarList({ dateGroups: this.getSortedDateKeys(this.todoCompletedGroups)}));
  }

  getSortedDateKeys(dates) {
    return Object.keys(dates).sort((a, b) => +a.replace(/\D/g, '') - +b.replace(/\D/g, ''));
  }

  updateAllItemCount() {
    this.updateItemCount($('#all_header'), this.todos);
  }

  updateCompletedItemCount() {
    this.updateItemCount($('#completed_items'), this.todosCompleted);
  }

  updateItemCount($containingElement, group) {
    $containingElement.attr('data-total', String(group.length));
    $containingElement.find('dd').text(group.length);
  }

  updateListCount($container, todoGroups) {
    let $dlTags = $container.find('dl');

    $dlTags.each((_, element) => {
      let dateGroup = $(element).attr('data-title'); 
      this.updateItemCount($(element), todoGroups[dateGroup]);
    });
  }

  updateAllListCounts() {
    this.updateListCount(this.$ListContainer, this.todoGroups);
  }

  updateCompletedListCounts() {
    this.updateListCount(this.$completedListContainer, this.todoCompletedGroups);
  }

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