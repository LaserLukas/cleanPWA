import { Container } from "react-bootstrap";
import TaskPreview from "./TaskPreview";
import "./TaskList.scss";

export default function TasksList({ tasks, todos, updateTodo }) {
  return (
    // TODO: css to make the scrolling correct - use placeholder of exact size of the header container
    <Container classname="List-container">
      <div className="Item-placeholder"></div>
      {tasks.map((task, i) => {
        var taskTodos = [];
        task.todos.forEach((todoId) => {
          taskTodos.push(todos.find((todo) => todo.id === todoId));
        });
        console.log("for task: " + task.title + " set todos: ");
        console.log(taskTodos);
        return (
          <div className="Margin-bottom Margin-top" key={i}>
            <TaskPreview
              task={task}
              todos={taskTodos}
              updateTodo={updateTodo}
            />
          </div>
        );
      })}
    </Container>
  );
}
