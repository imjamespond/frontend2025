import { labels, type ResourceType } from "../helper";

type MatchedItem = DataAtlas.Dir & { matched: boolean; catalog: string; rootDirName?: string };

export function searchCatalog(
  val: string,
  list: DataAtlas.HomePageMapItem["list"] | undefined,
  catalog: string,
  rootDirName?: string
): MatchedItem[] | undefined {
  if (!!val) {
    const matched = list?.map((item) => {
      const matched = (item.dirName as string)?.includes(val);
      return { ...item, matched, catalog, rootDirName };
    });
    return matched;
  }
  return undefined;
}

export type SearchReturnType = ReturnType<typeof searchCatalog>;

export function searchData(val: string, data: DataAtlas.HomePageMap) {
  const matched: MatchedItem[] = [];
  Object.entries(data).forEach(([k, v]) => {
    const dirs: DataAtlas.HomePageMapItem[] = v;
    for (const dir of dirs) {
      const result = searchCatalog(val, dir.list, dir.dirName, labels[k as ResourceType]);
      if (!!result && result.length > 0) {
        matched.push(...result.filter((item) => item.matched));
        // console.debug(dirs, _)
      }
    }
  });
  // console.debug(matched, matched.flat())
  return matched;
}
