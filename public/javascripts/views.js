export class TodoView {
  constructor() {
    this.$main = $('main');
    // this.$modal = $('.modal');
    // this.$formModal = $('#form_modal');
    this.$sidebar = $('#sidebar');
    this.$dateListContainer = $('#all_lists');
    this.$completedDateListContainer = $('#completed_lists');
    this.$todoListContainer = $('#items');
    // this.modal = Handlebars.compile($('#modal').html());
    this.form = Handlebars.compile($('#modalForm').html());
    this.sidebarList = Handlebars.compile($('#sidebarList').html());
    this.todoListTemplate = Handlebars.compile($('#todoListTemplate').html());

    // this.sidebarTemplate = Handlebars.compile($('#sidebarTemplate').html());
    // // this.optionTemplate = Handlebars.compile($('#optionTemplate').html());

    // Handlebars.registerHelper('ifSelected', () => {

    // });
    Handlebars.registerHelper('isSelected', (optionValue, dataValue) => {
      return optionValue === dataValue;
    });

    // this.allListsPartial = Handlebars.compile($('#allListsPartial').html());
    // Handlebars.registerPartial('allListsPartial', $('#allListsPartial').html());
    this.todoListHeader = Handlebars.compile($('#todoListHeader').html()); // don't need if not passing anything to template
    Handlebars.registerPartial('todoListHeader', $('#todoListHeader').html());

    this.todoTemplate = Handlebars.compile($('#todoListHeader').html());
    Handlebars.registerPartial('todoTemplate', $('#todoTemplate').html());

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
    this.loadTodoList({ listTitle: 'All Todos', todos: this.sortTodosByStatus(todos) });
  }

  loadSidebar() {
    this.loadAllTodosDates();
    this.loadAllCompletedTodosDates();
    this.updateItemCounts();
  }

  loadTodoList(listObj) {
    this.$todoListContainer.html(this.todoListTemplate(listObj));
  }

  updateItemCounts() {
    this.updateAllItemCount();
    this.updateCompletedItemCount();
    this.updateAllListCounts();
    this.updateCompletedListCounts();
  }

  loadAllTodosDates() {
    this.$dateListContainer.html(this.sidebarList({ dateGroups: this.getSortedDateKeys(this.todoGroups)}));
  }

  loadAllCompletedTodosDates() {
    this.$completedDateListContainer.html(this.sidebarList({ dateGroups: this.getSortedDateKeys(this.todoCompletedGroups)}));
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
    this.updateListCount(this.$dateListContainer, this.todoGroups);
  }

  updateCompletedListCounts() {
    this.updateListCount(this.$completedDateListContainer, this.todoCompletedGroups);
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
    $('#form_modal').html(this.form(data));
    this.$modal = $('.modal');
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

  clearSidebarButtons() {
    this.$sidebar.find('header, dl').removeClass('active');
  }
  
  displayList($listButton) {
    let todos = this.sortTodosByStatus(this.getTodosByList($listButton));

    this.selectSidebarButton($listButton);
    this.loadTodoList({ listTitle: $listButton.data('title'), todos: todos });

  }

  getListType($pressedBtn) {
    return $pressedBtn.closest('section').attr('id');
  }

  selectSidebarButton($pressedButton) {
    this.clearSidebarButtons();
    $pressedButton.addClass('active');
  }

  getTodosByList($pressedBtn) {
    let listName = $pressedBtn.data('title')
    let listType = this.getListType($pressedBtn);

    if ($pressedBtn.prop('tagName') === 'HEADER') {
      return listType === 'all' ? this.todos : this.todosCompleted;
    }

    return listType === 'all' ? this.todoGroups[listName] : this.todoCompletedGroups[listName];
  }

  sortTodosByStatus(todoArr) {
    return todoArr.sort((a, b) => a.completed - b.completed);
  }
}