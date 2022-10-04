import { Col, Container, Image, Row } from "react-bootstrap";
import Helper from "../util/Helper.js";
import LoadingBar from "./LoadingBar";
import "./TaskPreview.scss";

export default function TaskPreview({ task }) {
  return (
    <Container className="Card">
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
    </Container>
  );
}
