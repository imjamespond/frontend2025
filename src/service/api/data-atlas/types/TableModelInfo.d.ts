declare namespace DataAtlas {
  interface TableModelInfo {
    dirName: string;
    dirId: string;
    dirDesc: string;
    tableModelCount: number;
    subDirCount: number;
    id?: unknown;
    dbType: string;
    cnName?: unknown;
    enName?: unknown;
    safetyLevel: number;
    performance: string;
    dataType: string;
    sharingLevel: number;
    children?: unknown;
  }
}