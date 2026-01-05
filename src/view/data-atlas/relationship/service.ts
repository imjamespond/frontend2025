import useSWR from "swr";
import { useRootDir, useTemplateType } from "../context";
import { useDomainId } from "@config/app";
import type { KeyOfFetcher } from "@service/api";
import { service } from "@service/api/data-atlas";

type queryCrumbDataKey = KeyOfFetcher<typeof service.dataassetmanager.queryCrumbData> | null;

export function useCrumbData() {
  const rootDir = useRootDir();
  const templateType = useTemplateType();
  const env = useDomainId();
  return useSWR<DataAtlas.SubDir, Api.Error, queryCrumbDataKey>(
    rootDir && env && templateType
      ? {
          url: "dataAtlas.dataassetmanager.queryCrumbData",
          args: { params: { env, templateType, dirId: rootDir.dirId } },
        }
      : null,
    service.dataassetmanager.queryCrumbData
  );
}



type QueryRelationChartDataKey = KeyOfFetcher<typeof service.dataassetmanager.queryRelationChartData> | null;

export function useRelationChartDData() {
  const rootDir = useRootDir();
  const templateType = useTemplateType();
  const env = useDomainId();
  const queryRelationChartDataKey: QueryRelationChartDataKey =
    env && rootDir?.resourceType
      ? { args: { params: { resourceType: rootDir.resourceType, env, templateType } } }
      : null;

  return useSWR(queryRelationChartDataKey, service.dataassetmanager.queryRelationChartData);
}