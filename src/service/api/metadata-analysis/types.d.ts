declare namespace MetadataAnalysis {
  interface TagColors {
    list: string[];
    map: { [k: string]: Ods };
  }

  interface Ods {
    cnName: string;
    color: string;
  }
}
