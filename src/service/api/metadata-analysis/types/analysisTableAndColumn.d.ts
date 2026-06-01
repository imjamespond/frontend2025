declare namespace MetadataAnalysis {
  interface AnalysisTableAndColumn {
    nodes: NodeData[];
    links: Links;
    rootIds: string[];
    analysisType: string;
    catalog: string;
    versionTimestamp: string;
    fieldOnly?: boolean;
  }

  interface NodeData {
    id: string;
    name: string;
    cnName: string;
    schema: string;
    modelDisplayName: string;
    icon: string;
    tips: string;
    status?: any;
    fields: Field[];
    tagName: string;
  }

  interface Field {
    id: string;
    name: string;
    tips: string;
  }

  interface Links {
    [key: string]: EdgeData[];
  }

  type EdgeData = TableEdge | ColumnEdge;

  interface ColumnEdge {
    source: string;
    target: string;
    name: string;
    jobId: string;
    jobName: string;
    sModelId: string;
    tModelId: string;
  }

  interface TableEdge {
    source: string;
    target: string;
    name: string;
    jobId: string;
    jobName: string;
    sModelId: string;
    tModelId: string;
  }
}
