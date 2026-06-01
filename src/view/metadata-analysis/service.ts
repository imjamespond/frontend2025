import service from "@service/api/metadata-analysis";
import { useState } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

export function useAnalysisTableAndColumn() {
  const mut = useSWRMutation("useAnalysisTableAndColumn", (_, extra: { arg: object }) =>
    service.impl.analysisTableAndColumn({ args: { params: extra.arg } }),
  );
  const [data, setData] = useState<MetadataAnalysis.AnalysisTableAndColumn>();
  return { ...mut, data, setData };
}

export function useTagColors() {
  return useSWR("metadata.impl.getTagColor", service.impl.getTagColor);
}
