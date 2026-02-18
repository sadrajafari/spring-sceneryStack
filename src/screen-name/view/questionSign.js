import {
  Rectangle,
  Color,
  HBox,
  RichText,
  VBox,
  Text,
  Circle,
  Node, // Import Node
} from "scenerystack/scenery";

const questionIcon = new Text("?", {
  fontSize: 13,
  fill: "white",
  fontWeight: "bold",
});

const questionCircle = new Circle(10, {
  fill: new Color(66, 133, 244), // Blue color
  stroke: new Color(255, 255, 255),
  lineWidth: 2,
  cursor: "pointer",
});

function questionButton() {
  const node = new Node({
    children: [questionCircle, questionIcon],
    cursor: "pointer",
  });
  questionIcon.center = questionCircle.center;
  return node;
}

export { questionButton };