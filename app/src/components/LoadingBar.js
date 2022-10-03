import { Container, Row, ProgressBar, Col } from "react-bootstrap";
import "./LoadingBar.scss";

export default function LoadingBar({ PerCent }) {
  const variants = [
    { value: "danger", startValue: 0, endValue: 25 },
    { value: "warning", startValue: 26, endValue: 75 },
    { value: "success", startValue: 76, endValue: 100 },
  ];

  return (
    <Container className="Margin-none Padding-none">
      <Row>
        <Col>{PerCent} %</Col>
      </Row>
      <ProgressBar
        variant={getVariantValue(PerCent, variants)}
        now={PerCent}
      ></ProgressBar>
    </Container>
  );
}

function getVariantValue(value, variants) {
  for (let variant of variants) {
    if (value >= variant.startValue && value <= variant.endValue) {
      return variant.value;
    }
  }
}
