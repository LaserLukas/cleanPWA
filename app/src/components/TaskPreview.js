import { Container, Row } from "react-bootstrap";
import Helper from "../util/Helper.js";
import LoadingBar from "./LoadingBar";

export default function TaskPreview({ task }) {
  return (
    <Container>
      <Row>
        <p>{task.title}</p>
      </Row>
      <LoadingBar PerCent={Helper.getTaskProgress(task.todos)} />
    </Container>
  );
}
