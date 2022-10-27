import { Container } from "react-bootstrap";
import TaskPreview from "./TaskPreview";
import "./TaskList.scss";

export default function TasksList({
  tasks,
  todos,
  updateTodo,
  users,
  completedTodos,
}) {
  return (
    // TODO: css to make the scrolling correct - use placeholder of exact size of the header container
    <Container className="List-container">
      <div className="Item-placeholder"></div>
      {tasks.map((task, i) => {
        const user = users.find((user) => user.id === task.responsible);
        var taskTodos = [];
        task.todos.forEach((todoId) => {
          taskTodos.push(todos.find((todo) => todo.id === todoId));
        });
        return (
          <div className="Margin-bottom Margin-top" key={i}>
            <TaskPreview
              task={task}
              todos={taskTodos}
              updateTodo={updateTodo}
              completedTodos={completedTodos}
              user={user}
            />
          </div>
        );
      })}
    </Container>
  );
}
