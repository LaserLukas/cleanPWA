import { Container } from "react-bootstrap";
import TaskPreview from "./TaskPreview";
import "./TaskList.scss";

export default function TasksList({ tasks }) {
  console.log(tasks);
  return (
    <Container>
      {tasks.map((task, i) => {
        return (
          <div className="Margin-bottom Margin-top">
            <TaskPreview task={task} key={i} />
          </div>
        );
      })}
    </Container>
  );
}
