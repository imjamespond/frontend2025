export const enum GraphType {
  Summary /* 摘要 */,
  Visual /* 图形 */,
}

export function getTextWithHighlights(text: string, searchText: string) {
  const regex = new RegExp(searchText, "gi");
  const newText = text.replace(regex, `<em>$&</em>`);
  return <span dangerouslySetInnerHTML={{ __html: newText }} />;
}

export function getSearchType(activeKey: string) {
  if (activeKey === "1") {
  } else if (activeKey === "2") {
    return "dir";
  } else if (activeKey === "3") {
    return "dataAssetAndDir";
  } else if (activeKey === "4") {
    return "resourceAndDir";
  }
  return "dataAssetResourceAndDir";
}
