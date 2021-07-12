export class TodoView {
  constructor() {
    this.initializeContainers();
    this.registerHandlebars();
  }

  initializeContainers() {
    this.$main = $('main');
    this.$sidebar = $('#sidebar');
    this.$allHeader = $('#all_header');
    this.$allDoneHeader = $('#all_done_header');
    this.$dateListContainer = $('#all_lists');
    this.$doneListContainer = $('#completed_lists');
    this.$todoListContainer = $('#items');
    this.$formModal = $('#form_modal');
    this.$modal = $('.modal');
    this.$allTodosBtn = $('#all_header');
    this.$allCompletedBtn = $('#completed_items');
  }

  registerHandlebars() {
    this.registerHandlebarsHelpers();
    this.registerHandlebarsPartials();
    this.registerHandlebarsTemplates();
  }

  registerHandlebarsHelpers() {
    Handlebars.registerHelper('getDueDate', todo => {
      return (todo.month.trim() && todo.year.trim()) ? `${todo.month}/${todo.year.slice(2)}` : `No Due Date`;
    });

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
    this.sidebarHeader = Handlebars.compile($('#sidebarHeader').html());
  }

  loadPage(todos) {
    this.saveSidebarButton();
    this.refreshPage(todos)
  }

  refreshPage(todos) {
    this.todos = todos;
    this.loadSidebar();
    this.reregisterSidebarButton();
    this.selectSidebarButton();
    this.loadStage();
  }

  displayList($pressedBtn) {
    this.saveSidebarButton($pressedBtn)
    this.selectSidebarButton();
    this.loadStage();
  }

  saveSidebarButton($btn = this.$allTodosBtn) {
    let dataTitle = $btn.data('title');
    let parentId = $btn.parent().attr('id');
    this.$activeSidebarBtn = $btn;
    this.activeSidebarData = [parentId, dataTitle];
  }

  reregisterSidebarButton() {
    let [parentId, dataTitle] = this.activeSidebarData;
    let $btn = $(`#${parentId} [data-title='${dataTitle}']`);
    if ($btn.length !== 0) this.saveSidebarButton($btn);
  }

  loadSidebar() {
    this.loadAllTodosDates();
    this.loadAllCompletedTodosDates();
    this.updateItemCounts();
  }

  loadStage() {
    let {title, completed} = this.getListInfoFromBtn();
    this.loadTodoList(this.todos.getListAsObject(title, completed));
  }

  getListInfoFromBtn() {
    let [parentId, dataTitle] = this.activeSidebarData;
    return { title: dataTitle, completed: this.getListType(parentId) };
  }

  getListType(parentId) {
    return parentId.includes('completed');
  }
  
  loadTodoList(listObj) {
    let listName = Object.keys(listObj)[0];
    this.$todoListContainer.html(
      this.todoListTemplate({listTitle: listName, todos: listObj[listName]})
    );
  }

  updateItemCounts() {
    this.updateAllItemCount();
    this.updateCompletedItemCount();
    this.updateAllListCounts();
    this.updateCompletedListCounts();
  }

  loadAllTodosDates() {
    this.$allHeader.html(this.sidebarHeader({ listName: 'All Todos' }));
    this.$dateListContainer.html(this.sidebarList({ dateGroups: this.todos.getAllGroups() }));
  }

  loadAllCompletedTodosDates() {
    this.$allDoneHeader.html(this.sidebarHeader({ listName: 'Completed' }));
    this.$doneListContainer.html(
      this.sidebarList({ dateGroups: this.todos.getCompletedGroups()})
    );
  }

  updateAllItemCount() {
    this.updateItemCount(this.$allTodosBtn, this.todos.getList('All Todos'));
  }

  updateCompletedItemCount() {
    this.updateItemCount(this.$allCompletedBtn, this.todos.getList('Completed', true));
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

  selectSidebarButton() {
    this.clearSidebarButtons();
    this.$activeSidebarBtn.addClass('active');
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
    this.$formModal.html(this.form(data));
    this.showModal();
  }

  updateAllListCounts() {
    this.updateListCount(this.$dateListContainer, this.todos.allTodoGroups);
  }

  updateCompletedListCounts() {
    this.updateListCount(this.$doneListContainer, this.todos.completedTodoGroups);
  }
}