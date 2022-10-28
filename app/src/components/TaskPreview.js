import { Col, Container, Image, Row } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import Helper from "../util/Helper.js";
import LoadingBar from "./LoadingBar";
import "./TaskPreview.scss";
import { storage } from "../firebase";
import { ref, getDownloadURL } from "firebase/storage";

export default function TaskPreview({
  task,
  todos = [],
  updateTodo,
  user,
  completedTodos,
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [iconURL, setIconURL] = useState("./images/placeholder.png");

  // download the profile icons
  useEffect(() => {
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
    <Container
      className={task.enabled ? "Card" : "Card Card-disabled"}
      onClick={() => setShowDetails(!showDetails)}
    >
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
      <LoadingBar PerCent={Helper.getTaskProgress(todos, completedTodos)} />
      {showDetails &&
        todos.map((todo, i) => {
          if (!todo) {
            return;
          }
          let buttoStyle = "Todo";
          if (todo && completedTodos.includes(todo.id)) {
            const buttonStyleCompleted = "Todo Color-done Text-light";
            buttoStyle = buttonStyleCompleted;
          }
          return (
            <div
              onClick={(event) => {
                event.stopPropagation();

                // diable task todo
                if (!task.enabled) {
                  return;
                }

                // use callback funtion to change state and safe changes in database
                updateTodo(task.id, todo.id);
              }}
              className={buttoStyle}
              key={i}
            >
              {todo.title}
            </div>
          );
        })}
    </Container>
  );
}
