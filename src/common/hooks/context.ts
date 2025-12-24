import React, { createContext, useContext, useImperativeHandle, useRef } from "react";

/**
 * @description  创建一个可跨组件调用的命令式函数
 * @example
 * export const [useSetVisColsOpen, Context] = createValueSetterHook<boolean>();
 * ...
 * const ref = React.useContext(Context);
 * useImperativeHandle(ref, () => setOpen, []);
 */
export function createImperativeFunction<T extends Misc.Func = () => void>() {
  const Context = createContext<React.RefObject<T | null>>(React.createRef());

  const useFn = () => {
    const ref = useContext(Context);
    return (...args: Parameters<T>): ReturnType<T> | void => {
      return ref.current?.(...args);
    };
  };

  const useDefaultHandle = (fn: T) => {
    const ref = useContext(Context);
    const fnRef = useRef(fn);
    useImperativeHandle(ref, () => fnRef.current, []);
  };

  // 同时返回 Context 和 Hook
  return [useFn, useDefaultHandle, Context] as const;
}

type RefValue<T> = T extends React.RefObject<infer V> ? V : never;
export function createImperativeRecord<T extends Record<keyof T, React.RefObject<unknown>>>(Context: React.Context<T>) {
  const useRecord = <K extends keyof T>(key: K): T[K] => {
    const rec = useContext(Context);
    return rec[key];
  };

  const useDefaultHandle = <K extends keyof T>(key: K, obj: RefValue<T[K]>) => {
    const rec = useContext(Context);
    const objRef = useRef(obj);
    useImperativeHandle(rec[key], () => objRef.current, []);
  };

  return [useRecord, useDefaultHandle] as const;
}

// const FoobarContext = React.createContext({
//   foo: React.createRef<number>(),
//   bar: React.createRef<string>(),
// });
// const [useFoobar, useFoobarHandle] = createImperativeRecord(FoobarContext);
// const foo = useFoobar("foo");
// const obj1 = useRef(123);
// const obj2 = useRef("abc");
// useFoobarHandle("foo", obj1); // obj1: RefObject<number> ✅
// useFoobarHandle("foo", obj2); // obj2: RefObject<string> ❌
