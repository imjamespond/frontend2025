import type { Dispatch, SetStateAction, useState } from "react";

export const kmDebug = process.env.devMode ? console.debug.bind(window.console) : () => {};

export function isType<T>(_val: unknown, isT: boolean): _val is T {
  return isT;
}

export type SimpleDispatch<State> = Dispatch<SetStateAction<State>>;
export type UseState<State> = ReturnType<typeof useState<State>>;
