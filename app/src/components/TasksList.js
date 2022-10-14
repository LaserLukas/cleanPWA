import { Container } from "react-bootstrap";
import TaskPreview from "./TaskPreview";
import "./TaskList.scss";
import { useState } from "react";

export default function TasksList({ tasks, todos }) {
  return (
    <Container>
      {tasks.map((task, i) => {
        var taskTodos = [];
        task.todos.forEach((todoId) => {
          taskTodos.push(todos.find((todo) => todo.id === todoId));
        });
        console.log("for task: " + task.title + " set todos: ");
        console.log(taskTodos);
        return (
          <div className="Margin-bottom Margin-top" key={i}>
            <TaskPreview task={task} todos={taskTodos} />
          </div>
        );
      })}
    </Container>
  );
}
