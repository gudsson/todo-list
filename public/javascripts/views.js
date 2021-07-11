export class TodoView {
  constructor() {
    this.$main = $('main');
    this.$sidebar = $('#sidebar');
    this.$dateListContainer = $('#all_lists');
    this.$completedDateListContainer = $('#completed_lists');
    this.$todoListContainer = $('#items');

    this.resetActiveList();

    this.registerHandlebars();
  }

  registerHandlebars() {
    this.registerHandlebarsHelpers();
    this.registerHandlebarsPartials();
    this.registerHandlebarsTemplates();
  }

  registerHandlebarsHelpers() {
    Handlebars.registerHelper('dayOptions', day => {
      let options = [];

      for (let idx = 1; idx <= 31; idx++) {
        let value = String(idx).padStart(2, '0');
        let selected = day === value;
        options.push({ value, label: idx, selected });
      }

      return options;
    });

    Handlebars.registerHelper('monthOptions', month => {
      let options = [];
      let months = ['January','February', 'March', 'April', 'May',
                    'June', 'July', 'August', 'September', 'October',
                    'November', 'December'];

      for (let idx = 1; idx <= 12; idx++) {
        let value = String(idx).padStart(2, '0');
        let selected = month === value;
        options.push({ value, label: months[idx - 1], selected });
      }

      return options;
    });

    Handlebars.registerHelper('yearOptions', year => {
      let options = [];
      let startingYear = 2021;

      for (let idx = startingYear; idx <= startingYear + 11; idx++) {
        let value = String(idx).padStart(2, '0');
        let selected = year === value;
        options.push({ value, label: idx, selected });
      }

      return options;
    });
  }

  registerHandlebarsPartials() {
    Handlebars.registerPartial('todoListHeader', $('#todoListHeader').html());
    Handlebars.registerPartial('todoTemplate', $('#todoTemplate').html());
    Handlebars.registerPartial('dayOptions', $('#dayOptions').html());
    Handlebars.registerPartial('monthOptions', $('#monthOptions').html());
    Handlebars.registerPartial('yearOptions', $('#yearOptions').html());
  }

  registerHandlebarsTemplates() {
    this.form = Handlebars.compile($('#modalForm').html());
    this.sidebarList = Handlebars.compile($('#sidebarList').html());
    this.todoListTemplate = Handlebars.compile($('#todoListTemplate').html());
    this.todoTemplate = Handlebars.compile($('#todoListHeader').html());
    this.dayOptions = Handlebars.compile($('#dayOptions').html());
    this.monthOptions = Handlebars.compile($('#monthOptions').html());
    this.yearOptions = Handlebars.compile($('#yearOptions').html());
  }

  
  loadPage(todos) {
    this.saveSidebarButton();
    this.refreshPage(todos)
  }

  refreshPage(todos) {
    // this.updateTodos(todos);
    this.todos = todos;
    this.loadSidebar();
    // this.reregisterSidebarButton();
    // this.selectSidebarButton();
    // this.loadStage();
  }

  saveSidebarButton($btn = $('#all_header')) {
    let dataTitle = $btn.data('title');
    let parentId = $btn.parent().attr('id');
    this.$activeSidebarBtn = $btn;
    this.$activeSidebarData = [parentId, dataTitle];
  }

  reregisterSidebarButton() {
    let [parentId, dataTitle] = this.$activeSidebarData;
    this.$activeSidebarBtn = $(`#${parentId} [data-title='${dataTitle}']`)
    if (this.$activeSidebarBtn.length === 0) this.saveSidebarButton();
  }

  resetActiveList() {
    this.$activeSidebarBtn = $('#all_header');
  }

  // updateTodos(todos) {
  //   // this.todos = todos;
  //   this.todosCompleted = todos.getCompleted();
  //   this.todoGroups = Object.assign(this.groupTodosByDate(this.todos), { 'All Todos': this.todos });
  //   this.todoCompletedGroups = Object.assign(this.groupTodosByDate(this.todosCompleted), { 'Completed': this.todosCompleted });
  // }

  loadSidebar() {
    this.loadAllTodosDates();
    this.loadAllCompletedTodosDates();
    this.updateItemCounts();
  }

  loadStage() {
    let todoListObj = this.getListObj(this.getListInfoFromBtn());
    this.loadTodoList(todoListObj);
  }

  getListObj(listIdObj) {
    let [title, type] = [listIdObj.listTitle, listIdObj.listType];
    let todos = type === 'all' ? this.sortTodosByStatus(this.todoGroups[title]) : this.todoCompletedGroups[title];
    return { [title]: todos };
  }

  loadTodoList(listObj) {
    let listName = Object.keys(listObj)[0];
    this.$todoListContainer.html(this.todoListTemplate({listTitle: listName, todos: listObj[listName]}));
  }

  updateItemCounts() {
    this.updateAllItemCount();
    this.updateCompletedItemCount();
    this.updateAllListCounts();
    this.updateCompletedListCounts();
  }

  loadAllTodosDates() {
    this.$dateListContainer.html(this.sidebarList({ dateGroups: this.todos.getAllGroups() })); //this.getSortedDateKeys(this.todoGroups)
  }

  loadAllCompletedTodosDates() {
    this.$completedDateListContainer.html(this.sidebarList({ dateGroups: this.todos.getCompletedGroups()}));
  }

  getSortedDateKeys(dates) {
    let keys = Object.keys(dates).filter(key => !['All Todos', 'Completed'].includes(key));
    return keys.sort((a, b) => +a.replace(/\D/g, '') - +b.replace(/\D/g, ''));
  }

  updateAllItemCount() {
    this.updateItemCount($('#all_header'), this.todos.getList('all'));
  }

  updateCompletedItemCount() {
    this.updateItemCount($('#completed_items'), this.todos.getList('all', true));
  }

  updateItemCount($containingElement, todoList) {
    $containingElement.attr('data-total', String(todoList.length));
    $containingElement.find('dd').text(todoList.length);
  }

  updateListCount($container, todoGroups) {
    let $dlTags = $container.find('dl');

    $dlTags.each((_, element) => {
      let dateGroup = $(element).attr('data-title'); 
      this.updateItemCount($(element), todoGroups[dateGroup]);
    });
  }

  displayList($pressedBtn) {
    this.saveSidebarButton($pressedBtn)
    this.$activeSidebarBtn = $pressedBtn;
    this.selectSidebarButton();
    this.loadStage();
  }

  getListInfoFromBtn() {
    let $btn = this.$activeSidebarBtn;
    return { listTitle: $btn.data('title'), listType: this.getListType($btn) };
  }

  changeList(newListIdObj) {
    this.activeList = newListIdObj
  }
  
  getListType($pressedBtn) {
    return $pressedBtn.closest('section').attr('id');
  }

  selectSidebarButton() {
    this.clearSidebarButtons();
    this.$activeSidebarBtn.addClass('active');
  }

  sortTodosByStatus(todoArr) {
    return todoArr.sort((a, b) => a.completed - b.completed);
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

  loadEditTodoForm(data) {
    this.loadTodoForm(data);
  }

  loadTodoForm(data = {}) {
    $('#form_modal').html(this.form(data));
    this.$modal = $('.modal');
    this.showModal();
  }

  updateAllListCounts() {
    this.updateListCount(this.$dateListContainer, this.todos.allTodoGroups);
  }

  updateCompletedListCounts() {
    this.updateListCount(this.$completedDateListContainer, this.todos.completedTodoGroups);
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
}