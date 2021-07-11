export class Todos {
  constructor() {
    this.todos = [];
    this.completedTodos = [];
    this.allTodoGroups = {};
    this.completedTodoGroups = {};
  }

  set(todos) {
    this.todos = todos;
    this.completedTodos = this._setCompleted();
    this.allTodoGroups = this._groupTodosByDate(this.todos);
    this.completedTodoGroups = this._groupTodosByDate(this.completedTodos);
    // console.log(this.allTodoGroups);
    // console.log(this.getCompletedGroups());
  }

  getList(listName, completed = false) {
    let list;
    if (completed) {
      list = this.completedTodoGroups[listName];
      return (list) ? list : this.completedTodos;
    } else {
      list = this.allTodoGroups[listName];
      return (list) ? list : this.todos;
    }
  }

  // getCompletedList(listName) {

  // }

  // getCount(listName, completed = false) {
  //   if (listName) 
  // }

  // getCompletedCount(listName) {

  // }

  getAll() {
    return this.todos.sort((a, b) => a.completed - b.completed);
  }

  getCompleted() {
    return this.completedTodos;
  }

  _setCompleted() {
    return this.todos.filter(todo => todo.completed);
  }

  getAllGroups() {
    return this._sortDateKeys(this.allTodoGroups);
  }

  getCompletedGroups() {
    return this._sortDateKeys(this.completedTodoGroups);
  }

  _sortDateKeys(todos) {
    return Object.keys(todos).sort((a, b) => +a.replace(/\D/g, '') - +b.replace(/\D/g, ''));
  }

  _groupTodosByDate(todos) {
    let todoGroups = {};

    todos.forEach(todo => {
      let date = (todo.month && todo.year) ? `${todo.month}/${todo.year.slice(2)}` : 'No Due Date';

      if (!todoGroups[date]) {
        todoGroups[date] = [todo];
      } else todoGroups[date].push(todo);
    });

    return todoGroups;
  }

  // sortTodosByStatus(todoArr) {
  //   return todoArr.sort((a, b) => a.completed - b.completed);
  // }
}