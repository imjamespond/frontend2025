import { createUseStore } from "@common/hooks/zustand";
import { Subject } from "rxjs";
import { View, type Dir, type ResourceType } from "./helper";
import { getData, setData } from "@common/data";

type ViewState = { view: View; dir?: Dir; tpl?: string };

const useViewStore = createUseStore<ViewState>({ view: View.Map, dir: getData<Dir>("dir") });

export const useTemplateType = () => {
  return useViewStore((state) => state._v.tpl);
};
export const useSetTemplateType = () => {
  return (tpl: string | undefined) => useViewStore.getState().mergeValue({ tpl });
};

export const useDir = () => {
  return useViewStore((state) => state._v.dir);
};

export const useSetDir = () => {
  return (dir: Dir | undefined) => useViewStore.getState().mergeValue({ dir });
};

export const useView = () => {
  return useViewStore((state) => state._v.view);
};

export const useSetView = () => {
  return (view: View) => useViewStore.getState().mergeValue({ view });
};

export const useSetGraphView = () => {
  return (payload: { label?: string; resourceType?: ResourceType; dir: DataAtlas.Dir }) => {
    const dir = { dirId: payload.dir.dirId, resourceType: payload.resourceType };
    setData("dir", dir);
    useViewStore.getState().mergeValue({ view: View.Graph, dir });
  };
};

export const useSetGraphBySearchResult = () => {
  return (dir: Dir) => {
    setData("dir", dir);
    useViewStore.getState().mergeValue({ dir, view: View.Graph });
  };
};

export const useSetSubNode = () => {
  return (payload: Omit<Dir, "resourceType">) => {
    // resourceType不修改
    const dir = { ...useViewStore.getState()._v.dir, ...payload };
    setData("dir", dir);
    useViewStore.getState().mergeValue({ dir });
  };
};

/**
 * x6 react shape
 */
export const MatchedDirIdSubject = new Subject<string>();
export const SearchSubject = new Subject<string>();
