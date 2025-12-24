import React, { useState } from "react";

type IAct0<T> = { type: T };
type IAct1<T, P> = { type: T; payload: P };

export type IAct<T, P = undefined> = [P] extends [undefined] ? IAct0<T> : IAct1<T, P>;


export function useAct<Act extends IAct<number | string>>() {
  return useState<Act>();
}

export function useReducer<P, A = unknown>(initialState: P, firstPage?: Partial<P>, reducer?: React.Reducer<P, A>) {
  type PP = Partial<P>;
  // IAct 的 Payload 不能传泛型
  type Act = IAct1<"query", PP> | IAct1<"set", P> | IAct1<"merge", PP> | IAct0<"reset">;
  const _reducer: React.Reducer<P, Act> = (state, act) => {
    if (act.type === "query") {
      return { ...state, ...act.payload, ...firstPage };
    }
    if (act.type === "merge") {
      return { ...state, ...act.payload };
    }
    if (act.type === "set") {
      return act.payload;
    }
    if (act.type === "reset") {
      return initialState;
    }
    if (reducer) {
      return reducer(state, act);
    }
    return state;
  };
  return React.useReducer(_reducer, initialState);
}
