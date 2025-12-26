import { labels } from "./data-map/diagram/graph/types";

export const enum View {
  None,
  Map,
  Graph,
}

export { labels };

export type ResourceType = keyof typeof labels;
export type Dir = { resourceType?: ResourceType; dirId: string };
