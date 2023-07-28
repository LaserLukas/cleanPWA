import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import "./Header.scss";
import LoadingBar from "./LoadingBar";
import { TbChevronLeft, TbChevronRight } from "react-icons/tb";
import Icon from "./Icons/Icon";

export default function Header({
  progressPercent,
  title = "Clean Flat",
  date,
  setDate,
}) {
  // dicretion = either samller or bigger 0
  function pickNextDate(direction) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + direction);
    setDate(newDate.toUTCString());
    console.log(newDate.toUTCString());
    if (direction < 0) {
      console.log("Picked next smaller date: Fetch the new data...");
      // call callback function that changes data state
    } else if (direction > 0) {
      console.log("Picked next bigger date: Fetch the new data...");
      // call callback function that changes data state
    }
  }

  return (
    <Container className="Header-container" fluid>
      <Container fluid="sm">
        <Row>
          <p className="Text-center Space-bottom Heading-small">{title}</p>
          <Col>
            <div className="Height-full Text-center">
              <Icon
                Icon={TbChevronLeft}
                size={"30px"}
                eventFunction={() => pickNextDate(-1)}
              ></Icon>
            </div>
          </Col>
          <Col onClick={(e) => setDate(new Date().toUTCString())}>
            <Row className="Content-center Heading-medium">
              {checkIfDateIsToday(new Date(date))
                ? "Today"
                : new Date(date).toLocaleDateString("de-DE", {
                    weekday: "long",
                  })}
            </Row>
            <Row className="Content-center Heading-small">
              {new Date(date).toLocaleDateString()}
            </Row>
          </Col>
          <Col className="Text-end">
            <div className="Height-full Text-center">
              <Icon
                Icon={TbChevronRight}
                size={"30px"}
                eventFunction={() => pickNextDate(1)}
              ></Icon>
            </div>
          </Col>
          <div className="Horizonal-space-null Space-top Space-bottom Heading-small">
            <LoadingBar PerCent={progressPercent}></LoadingBar>
          </div>
        </Row>
      </Container>
    </Container>
  );
}

function checkIfDateIsToday(date) {
  return date.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0);
}
