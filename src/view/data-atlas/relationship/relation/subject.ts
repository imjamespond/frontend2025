import type { IAct } from "@common/hooks/act";
import { Subject } from "rxjs";
import type { X6Node } from "./types";
import type { Graph } from "./graph";

export type GraphSubjectType = IAct<"expandNode"|"nodeUnlock"|"nodeClose", X6Node>;

export const GraphSubject = new Subject<GraphSubjectType>();

export function subscribe(this: Graph) {
  return GraphSubject.subscribe((act) => {
    this.deSelectNode();
  });
}
