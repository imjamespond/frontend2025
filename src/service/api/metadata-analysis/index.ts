import request from "@common/api";
// import analysisTableAndColumn from './samples/analysisTableAndColumn2'
// import analysisTableAndColumn from './samples/analysisTableAndColumn8.json'
import type { Fetcher } from "swr";
import type { MutationFetcher } from "swr/mutation";
import type { SWRKeyType } from "..";

export interface Service {
  impl: {
    analysisTableAndColumn: Fetcher<MetadataAnalysis.AnalysisTableAndColumn, SWRKeyType<{ nodeId?: string }>>;
    getTagColor: Fetcher<MetadataAnalysis.TagColors, SWRKeyType>;
    traceAndStatistics: Fetcher<unknown, SWRKeyType>;
    getEdgeDetail: Fetcher<unknown, SWRKeyType>;
    exportToExcel: MutationFetcher<unknown, string, { type: string; tableId: string; columnIds?: string[] }>;
  };
}

const service: Service = {
  impl: {
    analysisTableAndColumn: async ({ args }) => {
      if (process.env.devMode) {
        if (args.params?.nodeId) {
          const resp = await fetch("/data-atlas/samples/metadata-analysis/analysisTableAndColumn9-1.json");
          return await resp.json();
        }
        const resp = await fetch("/data-atlas/samples/metadata-analysis/analysisTableAndColumn9-2.json");
        return await resp.json();
      }
      const body = args.params;
      args.params = undefined;
      args.body = body;
      return request("post", "/api/metadatarepo/rest/metadataAnalysis/analysisTableAndColumn", args);
    },
    getTagColor: async ({ args }) => {
      if (process.env.devMode) {
        const resp = await fetch("./samples/analysisTableAndColumn9-2.json");
        return await resp.json();
      }
      return request("get", "/api/metadatarepo/rest/metadataAnalysis/getTagColor", args);
    },
    traceAndStatistics: ({ args }) => {
      return request("get", "/api/metadatarepo/rest/metadataAnalysis/traceAndStatistics", args);
    },
    getEdgeDetail: ({ args }) => {
      return request("get", "/api/metadatarepo/rest/metadataAnalysis/getEdgeDetail", args);
    },
    exportToExcel: async (_, extra) => {
      return await request("post", "/api/metadatarepo/rest/metadataAnalysis/export", {
        body: extra.arg,
        download: true,
      });
    },
  },
};

export default service;
