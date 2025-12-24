declare namespace DataAtlas {
  interface JsonNode {
    adminCreate: boolean;
    childSize: number;
    children: JsonNode[] | null;
    code: string;
    dataAssetAndSubDirCount: number;
    level: number;
    nodeId: string;
    path: string;
    resourceType: string;
    text: string;
    type: string;
  }
  
} 