declare namespace DataAtlas {
  interface SubDir {
    dirId: string;
    dirName: string;
    subDir?: SubDir;
  }
}
