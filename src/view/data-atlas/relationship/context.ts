import { initUseStore } from "@common/hooks/zustand";
import { GraphType } from "./helper";

export const [useGraphType, useSetGraphType] = initUseStore(GraphType.Block);
