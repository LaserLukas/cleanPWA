import { Col, Container, Image, Row } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import Helper from "../util/Helper.js";
import LoadingBar from "./LoadingBar";
import "./TaskPreview.scss";
import { storage } from "../firebase";
import { ref, getDownloadURL } from "firebase/storage";

export default function TaskPreview({ task, todos = [], updateTodo, user }) {
  const [showDetails, setShowDetails] = useState(false);
  const [iconURL, setIconURL] = useState("./images/placeholder.png");

  function setNewTodoStateDone(event, isDone, todo) {
    event.stopPropagation();
    todo.done = isDone;
    // use callback funtion to change state and safe changes in database
    updateTodo(todo, todo.id);
  }

  // download the
  useEffect(() => {
    console.log("fetch image, user: ");
    console.dir(user);
    if (user) {
      getDownloadURL(ref(storage, `character_images/${user.avatarIcon}`))
        .then((url) => {
          setIconURL(url);
        })
        .catch((error) => {
          // Handle any errors
        });
    }
  }, [user]);

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
            src={iconURL}
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
