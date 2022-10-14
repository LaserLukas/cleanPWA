class Helper {
  static getOverallProgress = (todos) => {
    if (todos) {
      console.log("start");
      console.dir(todos);
      var allTodos = todos.length;
      var completedTodos = 0;
      console.log("before loop");
      if (todos.length) {
        console.dir(todos);
        todos.forEach((todo) => {
          if (todo.done) {
            completedTodos++;
          }
        });
      }
      return parseInt((completedTodos / allTodos) * 100);
    } else {
      console.log("no todos found");
      return 0;
    }
  };

  static getTaskProgress = (todos) => {
    console.log("get progress for todos:");
    console.dir(todos);
    const allTodos = todos.length;
    var completedTodos = 0;

    todos.forEach((todo) => {
      if (todo && todo.done) {
        completedTodos++;
      }
    });
    console.log("conpled todos: " + completedTodos);

    return parseInt((completedTodos / allTodos) * 100);
  };
}

export default Helper;
