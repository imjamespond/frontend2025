import { type IAct } from "./act";
import { useMemo } from "react";
import { createUseStore } from "./zustand";

type Ext = 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;
export const enum FormActType {
  Add,
  Edit,
  View,
}

/**
 *
 * @returns createUseStore 创建新的实例, Context Provider 提供新的实例
 */
export function initUseFormActStore<Payload, TAct extends IAct<Ext> = never>() {
  type Act = { type: FormActType.Add } | { type: FormActType.Edit | FormActType.View; payload: Payload } | TAct;
  const useStore = createUseStore<Act | undefined>(undefined); // default store
  const setAct = useStore.getState().setValue;

  const useFormAct = () => {
    const act = useStore((state) => state._v);
    return useMemo(() => {
      return {
        act,
        set: (act: Act) => {
          setAct(act);
        },
        reset: () => setAct(undefined),
        add: () => {
          setAct({ type: FormActType.Add });
        },
        edit: (payload: Payload) => {
          setAct({ type: FormActType.Edit, payload });
        },
        view: (payload: Payload) => {
          setAct({ type: FormActType.View, payload });
        },
        isAdd() {
          return act?.type === FormActType.Add;
        },
        isEdit() {
          return act?.type === FormActType.Edit;
        },
        isView() {
          return act?.type === FormActType.View;
        },
        payload() {
          if (act?.type === FormActType.Edit || act?.type === FormActType.View) {
            return act.payload;
          }
        },
      };
    }, [act]);
  };

  return [useFormAct] as const;
}
