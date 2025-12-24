import { initUseStore } from "@common/hooks/zustand";

export const [useTemplateType, useSetTemplateType] = initUseStore<string | undefined>(undefined);
