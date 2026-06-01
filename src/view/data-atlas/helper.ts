import { labels } from "./data-map/diagram/graph/types";

export enum View {
  None,
  DataMap,
  Relationship,
}

export { labels };

export type ResourceType = keyof typeof labels;
export type Dir = { resourceType?: ResourceType; dirId: string };

export type SubDir = DataAtlas.SubDir;
