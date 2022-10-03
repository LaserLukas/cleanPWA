import { Col, Container, Row } from "react-bootstrap";
import "./Header.scss";
import LoadingBar from "./LoadingBar";

export default function Header({ progressPercent }) {
  const date = new Date().toLocaleDateString();
  return (
    <Container className="Header-container" fluid>
      <Container fluid="sm">
        <Row>
          <p className="Text-center Space-bottom Heading-small">Clean Flat</p>
          <Col className="Text-start Heading-medium">Today</Col>
          <Col className="Text-end Heading-small">{date}</Col>
          <div className="Horizonal-space-null Space-top Space-bottom Heading-small">
            <LoadingBar PerCent={progressPercent}></LoadingBar>
          </div>
        </Row>
      </Container>
    </Container>
  );
}
