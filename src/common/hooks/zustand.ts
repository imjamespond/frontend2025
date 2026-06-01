import { isType } from "@common/misc";
import { create } from "zustand";

type Store<T> = {
  _v: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  mergeValue: (_: T extends object ? Partial<T> : never) => void;
};

export function createUseStore<T>(value: T) {
  return create<Store<T>>((set) => ({
    _v: value,
    setValue(value) {
      if (isType<(prev: T) => T>(value, typeof value === "function")) {
        set((state) => ({ _v: value(state._v) }));
      } else {
        set({ _v: value });
      }
    },
    mergeValue(value) {
      set((state) => ({ _v: Object.assign({}, state._v, value) }));
    },
  }));
}

/**
 * @param initVal 初始值
 * @returns
 */
export function initUseStore<T>(initVal: T) {
  const useStore = createUseStore(initVal);

  const useValue = () => {
    return useStore((state) => state._v);
  };
  const useSetValue = () => {
    return useStore.getState().setValue;
  };

  return [useValue, useSetValue, useStore] as const;
}

export type UseStore<T> = ReturnType<typeof createUseStore<T>>;

// const use1 = createUseStore(1);
// const st1 = use1();
// st1.mergeValue(2); // ❌ 参数类型 never
// const useFoo = createUseStore({ foo: 1, bar: 2 });
// const stFoo = useFoo();
// stFoo.mergeValue({ foo: 2 });

export function createUseListStore<T, Extra = void>(items?: T[], extra?: Extra) {
  type State = {
    items: T[] | undefined;
    extra?: Extra;
    // setState: Params[0];
    // getState: Params[1];
    add: (item: T) => void;
    set: (items: T[] | undefined) => void;
    replace: (item: T, index: number) => void;
    del: (index: number) => void;
    insert: (index: number, attr: T) => void;
    update: (updateFn: (prev: T[]) => T[]) => void;
  };
  // type Params = Parameters<StateCreator<State>>;

  const useStore = create<State>((set) => ({
    items,
    extra,
    // setState: set,
    // getState: get,
    add: (attr) => {
      set((state) => {
        const list = state.items ?? [];
        return { items: [...list, attr] };
      });
    },
    set: (items) => {
      set({ items });
    },
    replace: (item, index) => {
      if (index >= 0) {
        set((state) => {
          if (state.items) {
            const items = [...state.items];
            items.splice(index, 1, item);
            return { items };
          }
          return state;
        });
      }
    },
    del: (index) => {
      if (index >= 0) {
        set((state) => {
          if (state.items) {
            const list = [...state.items];
            list.splice(index, 1);
            return { items: list };
          }
          return state;
        });
      }
    },
    insert(index, item) {
      set((state) => {
        if (state.items) {
          const list = [...state.items];
          list.splice(index, 0, item);
          return { items: list };
        }
        return state;
      });
    },
    update(updateFn) {
      set((state) => {
        return { items: state.items ? updateFn(state.items) : undefined };
      });
    },
  }));

  return useStore;
}
