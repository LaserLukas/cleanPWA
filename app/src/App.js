import React, { useState } from "react";

import { Button, Container, Row } from "react-bootstrap";
import "./App.scss";
import cleaningSchedule from "./data";
import Header from "./components/Header";
import TasksList from "./components/TasksList";
import Helper from "./util/Helper";

export default function App() {
  const [isClicked, setIsClicked] = useState(false);

  const progressOverall = Helper.getOverallProgress(cleaningSchedule.tasks);

  return (
    <div>
      <Header progressPercent={progressOverall}></Header>
      <Container className="App-container">
        <TasksList tasks={cleaningSchedule.tasks}></TasksList>
      </Container>
    </div>
  );
}
