import type { IAct } from "@common/hooks/act";
import { createUseStore } from "@common/hooks/zustand";
import { Subject } from "rxjs";
import type { Graph } from "./graph";
import type { X6Node } from "./types";

export type GraphSubjectType = IAct<"expandNode" | "block" | "root", X6Node>;

export const GraphSubject = new Subject<GraphSubjectType>();

export function subscribe(this: Graph) {
  return GraphSubject.subscribe((act) => {
    this.deSelectNode();
    if (act.type === "expandNode") {
      this.expandNode(act.payload);
    }
    if (act.type === "block") {
    }
    if (act.type === "root") {
      this.setRoot(act.payload);
    }
  });
}

interface TipsType {
  name?: string;
  count: number;
  amount: number;
}
export const useTipsStore = createUseStore<TipsType | void>(undefined);
export const useTips = () => useTipsStore((s) => s._v);
