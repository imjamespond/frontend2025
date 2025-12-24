export function getOpenAssetsDetail(id: string, dirId: string) {
  const url = /* process.env.Demo ? '/center-home/session/asset-detail' :  */ "/center-home/asset-detail";
  return `${url}?id=${id}&dirId=${dirId}`;
}

export function OpenAssetsDetail(id: string, dirId: string) {
  const url = getOpenAssetsDetail(id, dirId);
  window.open(
    url,
    id
    // "left=100,top=100,width=1400,height=800,resizable,scrollbars"
  );
}

export function OpenAssetBrowse(id: string, did: string) {
  // 资产浏览
  window.open(`/center-home/menu/asset-browse?id=${id}&did=${did}&timestamp=${Date.now()}`);
}

export function OpenAssetResBrowse(id: string, did: string) {
  // 资源浏览
  window.open(`/center-home/menu/asset-resource-browse?id=${id}&did=${did}&timestamp=${Date.now()}`);
}
