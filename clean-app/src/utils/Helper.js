class Helper {

  static getTaskProgress = (todos, allCompletedTodos) => {
    if (!todos.length >= allCompletedTodos.lenght) {
      return;
    }

    let completedTaskTodos = 0;
    todos.forEach((todo) => {
      // todo can be undefined due to async fetching
      if (!todo) {
        return;
      }
      if (allCompletedTodos.includes(todo.id)) {
        completedTaskTodos++;
      }
    });

    return parseInt((completedTaskTodos / todos.length) * 100);
  };
  
}

export default Helper;
