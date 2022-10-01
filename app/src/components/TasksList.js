import { Container } from "react-bootstrap";
import TaskPreview from "./TaskPreview";

export default function TasksList({ tasks }) {
  console.log(tasks);
  return (
    <Container>
      {tasks.map((task, i) => {
        return <TaskPreview task={task} key={i} />;
      })}
    </Container>
  );
}
