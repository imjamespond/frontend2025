import type { Fetcher } from "swr";
import type { SWRKeyType } from "..";
import type { MutationFetcher } from "swr/mutation";
import request, { type OptionsType } from "@common/api";
import type { ResourceType } from "@/view/data-atlas/helper";

export interface Service {
  dataassetmanager: {
    queryHomePageMap: Fetcher<DataAtlas.HomePageMap, SWRKeyType<{ env: number; templateType?: string }>>;
    getTableModelInfoByDirIdAndBeginIndex: Fetcher<
      DataAtlas.TableModelInfo[],
      SWRKeyType<{ env: number; templateType?: string; dirId: string; beginIndex: number; topNum: number }>
    >;
    queryRelationChartData: Fetcher<
      DataAtlas.JsonNode[],
      SWRKeyType<{ env: number; templateType?: string; resourceType: ResourceType }>
    >;
    queryCrumbData: Fetcher<DataAtlas.SubDir, SWRKeyType<{ env: number; templateType?: string; dirId: string }>>;
    listSupportTemplates: Fetcher<DataAtlas.ElementTemplate[], string>;
  };
  finder: {
    quickFindByMultiTypes: MutationFetcher<
      DataAtlas.FindByMultiTypesItem[],
      string,
      OptionsType<{ env: number; sizeLimit: number; keyword?: string; indexibleTypeNames: string[] }>
    >;
    fullTextSearchQuickFind: Fetcher<string, SWRKeyType<{ env: number; keyword: string; limit?: number }>>;
  };
}

const showSample = false && process.env.devMode;

export const service: Service = {
  dataassetmanager: {
    queryHomePageMap({ args }) {
      if (showSample) return request("get", "/data-atlas/samples/queryHomePageMap3.json");
      return request("get", `/api/dataassetmanager/countApi/queryHomePageMap`, args);
    },
    getTableModelInfoByDirIdAndBeginIndex({ args }) {
      return request("get", `/api/dataassetmanager/countApi/getTableModelInfoByDirIdAndBeginIndex`, {
        params: { ...args.params, beginIndex: args.params!.beginIndex + 1, topNum: args.params!.topNum - 1 },
      });
    },
    queryRelationChartData({ args }) {
      // if (showSample) return Promise.resolve(sampleData.queryRelationChartData) as Any
      return request("get", `/api/dataassetmanager/countApi/queryRelationChartData`, args);
    },
    queryCrumbData({ args }) {
      // if (showSample) return Promise.resolve(sampleData.queryCrumbData) as Any
      return request("get", `/api/dataassetmanager/countApi/queryCrumbData`, args);
    },
    listSupportTemplates() {
      if (showSample) return request("get", "/data-atlas/samples/listSupportTemplates.json");
      return request("get", `/api/dataassetmanager/elementTemplateApi/listSupportTemplates`);
    },
  },

  finder: {
    fullTextSearchQuickFind({ args: { params } }) {
      return request("get", `/api/finder/fullTextSearch/fullTextSearch/quickFind`, {
        params: { keyword: params?.keyword, indexibleTypeName: "dataAsset", sizeLimit: params?.limit ?? 15 },
      });
    },
    quickFindByMultiTypes(_, { arg }) {
      return request("get", `/api/finder/fullTextSearch/fullTextSearch/quickFindByMultiTypes`, arg);
    },
  },
};
