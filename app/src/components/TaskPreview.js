import { Col, Container, Image, Row } from "react-bootstrap";
import React, { useState } from "react";
import Helper from "../util/Helper.js";
import LoadingBar from "./LoadingBar";
import "./TaskPreview.scss";

export default function TaskPreview({ task, todos = [], updateTodo }) {
  console.log("render task: " + task.title);
  console.log(" with todos: ");
  console.dir(todos);
  const [todosState, setTodosState] = useState();
  const [showDetails, setShowDetails] = useState(false);

  function setNewTodoStateDone(event, isDone, todo) {
    event.stopPropagation();
    // TODO: Safe the new state also permanent
    todo.done = isDone;
    updateTodo(todo, todo.id);
  }

  return (
    <Container className="Card" onClick={() => setShowDetails(!showDetails)}>
      <Row>
        <Col>
          <Row>
            <p className="Heading-small Margin-none Text-bold">{task.title}</p>
          </Row>
          <Row>
            <p>status information</p>
          </Row>
        </Col>
        <Col>
          <Image
            src="./images/ProfilePicture.png"
            className="Profile-image"
            width={48}
            height={48}
            roundedCircle
            alt="Profile Picture"
          ></Image>
        </Col>
      </Row>
      <LoadingBar PerCent={Helper.getTaskProgress(todos)} />
      {showDetails &&
        todos.map((todo, i) => {
          console.log("create todo: ");
          console.dir(todo);
          if (todo.done) {
            return (
              <div
                onClick={(e) => setNewTodoStateDone(e, false, todo)}
                className="Todo Color-done Text-light"
                key={i}
              >
                {todo.title}
              </div>
            );
          } else {
            return (
              <div
                onClick={(e) => setNewTodoStateDone(e, true, todo)}
                className="Todo"
                key={i}
              >
                {todo.title}
              </div>
            );
          }
        })}
    </Container>
  );
}
