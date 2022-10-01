class Helper {
  static getOverallProgress = (tasks) => {
    var allTodos = 0;
    var completedTodos = 0;

    tasks.forEach((task) => {
      allTodos += task.todos.length;
      task.todos.forEach((todo) => {
        if (todo.done) {
          completedTodos++;
        }
      });
    });
    return (completedTodos / allTodos) * 100;
  };

  static getTaskProgress = (todos) => {
    const allTodos = todos.length;
    var completedTodos = 0;

    todos.forEach((todo) => {
      if (todo.done) {
        completedTodos++;
      }
    });

    console.log("allTodos: " + allTodos);
    console.log("completedTodos: " + completedTodos);

    return (completedTodos / allTodos) * 100;
  };
}

export default Helper;
