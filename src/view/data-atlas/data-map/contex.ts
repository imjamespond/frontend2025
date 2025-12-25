import { initUseStore } from "@common/hooks/zustand";
import type { SearchReturnType } from "./searchHelper";
import { createImperativeFunction } from "@common/hooks/context";

export const [useSearchText, useSetSearchText] = initUseStore<string>("");

export const [useSearchResult, useSetSearchResult] = initUseStore<SearchReturnType | undefined>(undefined);
export const [useFindResult, useSetFindResult] = initUseStore<DataAtlas.FindByMultiTypesItem[] | undefined>(undefined);

export const [useSetOpen, useSetOpenHandle] = createImperativeFunction<(_: boolean) => void>();
