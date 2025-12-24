declare namespace DataAtlas {
  interface HomePageMap {
    common?: HomePageMapItem[];
    digitalConsumer?: HomePageMapItem[];
    digitalOperation?: HomePageMapItem[];
    functionUnits?: HomePageMapItem[];

    dataAsset?: HomePageMapItem[];
    innerSource?: HomePageMapItem[];
    outerSource?: HomePageMapItem[];
  }

  interface HomePageMapItem {
    count: number;
    subDirCount: number;
    unFold: boolean;
    list: Dir[];
    dirName: string;
  }

  interface Dir {
    dirId: string;
    dirName: string;
    count: number;
    subDirCount: number;
    unFold: boolean;
  }
  
}
