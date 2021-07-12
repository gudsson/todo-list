export class Todos {
  constructor() {}
  
  static isValidTodo(formData) {
    return formData.get('title').length >= 3;
  }

  static sort(todos) {
    return todos.sort((a, b) => a.completed - b.completed);
  }

  count() {
    return this.todos.length;
  }
  
  set(todos) {
    this.todos = Todos.sort(todos);
    this.completedTodos = this._setCompleted();
    this.allTodoGroups = this._groupTodosByDate(this.todos);
    this.completedTodoGroups = this._groupTodosByDate(this.completedTodos);
  }

  getList(listName, completed = false) {
    if (listName === 'Completed') return this.completedTodos;
    if (listName === 'All Todos') return this.todos;

    let list = (completed)
      ? this.completedTodoGroups[listName] : this.allTodoGroups[listName];

    return list ? list : [];
  }

  get(id) {
    return this.todos.find(todo => todo.id === id);
  }

  getListAsObject(listName, completed = false) {
    return {[listName]: this.getList(listName, completed)};
  }

  getCompleted() {
    return this.completedTodos;
  }

  getAllGroups() {
    return this._sortDateKeys(this.allTodoGroups);
  }

  getCompletedGroups() {
    return this._sortDateKeys(this.completedTodoGroups);
  }

  _setCompleted() {
    return this.todos.filter(todo => todo.completed);
  }

  _sortDateKeys(todos) {
    return Object.keys(todos).sort((a, b) => getNumericVal(a) - getNumericVal(b));

    function getNumericVal(key) {
      return +key.split('/').reverse().join('') || 0;
    }
  }

  _groupTodosByDate(todos) {
    let todoGroups = {};

    todos.forEach(todo => {
      let date = (todo.month && todo.year)
        ? `${todo.month}/${todo.year.slice(2)}` : 'No Due Date';

      if (todoGroups[date] === undefined) {
        todoGroups[date] = [todo];
      } else todoGroups[date].push(todo);
    });

    return todoGroups;
  }
}