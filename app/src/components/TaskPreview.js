import { Col, Container, Image, Row } from "react-bootstrap";
import React, { useState } from "react";
import Helper from "../util/Helper.js";
import LoadingBar from "./LoadingBar";
import "./TaskPreview.scss";

export default function TaskPreview({ task }) {
  const [todosState, setTodosState] = useState(task.todos);
  const [showDetails, setShowDetails] = useState(false);

  function setNewTodoStateDone(event, isDone, index) {
    event.stopPropagation();
    // TODO: Safe the new state also permanent
    const copyTodosSate = [...todosState];
    copyTodosSate[index].done = isDone;
    setTodosState(copyTodosSate);
  }

  return (
    <Container className="Card" onClick={() => setShowDetails(!showDetails)}>
      <Row>
        <Col>
          <Row>
            <p className="Heading-small Margin-none">{task.title}</p>
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
      <LoadingBar PerCent={Helper.getTaskProgress(task.todos)} />
      {showDetails &&
        todosState.map((todo, i) => {
          if (todo.done) {
            return (
              <div
                onClick={(e) => setNewTodoStateDone(e, false, i)}
                className="Todo Color-done Text-light"
                key={i}
              >
                {todo.title}
              </div>
            );
          } else {
            return (
              <div
                onClick={(e) => setNewTodoStateDone(e, true, i)}
                className="Todo Text-dark"
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
