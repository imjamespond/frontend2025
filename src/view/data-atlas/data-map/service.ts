import { useMut } from "@common/hooks/swr";
import { service } from "@service/api/data-atlas";
import useSWR from "swr";

export function useSearch() {
  return useMut("finder.quickFindByMultiTypes", service.finder.quickFindByMultiTypes);
}

export function useTemplates() {
  return useSWR("dataassetmanager.listSupportTemplates", service.dataassetmanager.listSupportTemplates);
}
