declare namespace DataAtlas {
  interface TableModelInfo {
    dirName: string;
    dirId: string;
    dirDesc: string;
    tableModelCount: number;
    subDirCount: number;
    id?: string;
    dbType: string;
    cnName?: string;
    enName?: string;
    safetyLevel: number;
    performance: string;
    dataType: string;
    sharingLevel: number;
    children?: unknown;
  }
}