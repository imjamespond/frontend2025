import { useDomainId } from "@config/app";
import { service } from "@service/api/data-atlas";
import useSWR from "swr";
import { useTemplateType } from "./context";

export function useDataMap() {
  const env = useDomainId();
  const tpl = useTemplateType();
  return useSWR(
    typeof env === "number" && tpl
      ? { url: "dataassetmanager.queryHomePageMap", args: { params: { env, templateType: tpl } } }
      : null,
    service.dataassetmanager.queryHomePageMap,
  );
}
