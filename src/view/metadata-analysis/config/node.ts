import { register } from "@antv/x6-react-shape";
import Entity from "../Entity";

export const subjectNode = { height: 60 };

register({
  shape: "entity",
  effect: ["data"],
  component: Entity,
});
