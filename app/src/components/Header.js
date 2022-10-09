import { Col, Container, Row } from "react-bootstrap";
import "./Header.scss";
import LoadingBar from "./LoadingBar";
import { TbChevronLeft, TbChevronRight } from "react-icons/tb";
import Icon from "./Icons/Icon";

export default function Header({ progressPercent }) {
  const date = new Date().toLocaleDateString();

  // dicretion = either samller or bigger 0
  function pickNextDate(direction) {
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
          <p className="Text-center Space-bottom Heading-small">Clean Flat</p>
          <Col>
            <div className="Height-full Text-center">
              <Icon
                Icon={TbChevronLeft}
                size={"30px"}
                eventFunction={() => pickNextDate(-1)}
              ></Icon>
            </div>
          </Col>
          <Col>
            <Row className="Content-center Heading-medium">Today</Row>
            <Row className="Content-center Heading-small">{date}</Row>
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
