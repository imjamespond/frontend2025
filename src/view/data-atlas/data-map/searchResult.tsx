import { KmAvatar, KmEmpty, KmList } from "@components";
import { Typography } from "antd";
import type { SearchReturnType } from "./searchHelper";
import { OpenAssetBrowse, OpenAssetResBrowse } from "@service";
import { getTextWithHighlights } from "./helper";

export function SearchResult({
  searchText,
  searchResult,
  mapResult,
  extra,
  activeKey,
}: {
  searchText?: string;
  searchResult?: DataAtlas.FindByMultiTypesItem[];
  mapResult: SearchReturnType;
  activeKey: string;
  extra: {
    setFocus: Function;
  };
}) {
  return (
    <KmList itemLayout="horizontal">
      {/* 数据地图结果 */}
      {mapResult?.map((item: any, i: number) => (
        <KmList.Item
          className={"matchedItem"}
          style={{ cursor: "pointer" }}
          key={i}
          onClick={() => {
            // MatchedDirId.next(item.dirId);
            extra.setFocus(false);
          }}
        >
          <KmList.Item.Meta
            avatar={
              <KmAvatar size="small" shape="square">
                地图
              </KmAvatar>
            }
            title={
              <Typography.Text>
                {searchText ? getTextWithHighlights(item.dirName, searchText) : item.dirName}
              </Typography.Text>
            }
            description={
              <Typography.Text type="secondary">
                {item.rootDirName}/{item.catalog}/{item.dirName}
              </Typography.Text>
            }
          />
        </KmList.Item>
      ))}

      {/* 目录返回结果 */}
      {searchResult?.map((item, i) => {
        const isDataAsset = item.additional?.type === "DataAsset";
        const isDir = item.additional?.type === "Dir";
        const avatar = isDataAsset ? "资" : "目";
        let path: any = (
          <div
            style={{ cursor: "pointer" }}
            dangerouslySetInnerHTML={{ __html: item.path }}
            onClick={() => {
              if (isDir) {
                // ActionSubject.next({
                //   type: ActionType.SearchResult,
                //   payload: { dirId: item.id, resourceType: item.additional?.sourceType as ResourceType },
                // });
              }
              extra.setFocus(false);
            }}
          ></div>
        );
        if (isDataAsset) {
          try {
            path = (JSON.parse(item.path) as any[]).map((dir, i) => (
              <div
                key={i}
                style={{ cursor: "pointer" }}
                dangerouslySetInnerHTML={{ __html: dir.dirPath }}
                onClick={() => {
                  if (isDataAsset) {
                    activeKey === "3" ? OpenAssetBrowse(item.id, dir.dirId) : OpenAssetResBrowse(item.id, dir.dirId);
                  }
                  extra.setFocus(false);
                }}
              ></div>
            ));
          } catch (error) {
            console.error(error);
          }
        }

        return (
          <KmList.Item className={"matchedItem"} key={i}>
            <KmList.Item.Meta
              avatar={
                <KmAvatar size="small" shape="square">
                  {avatar}
                </KmAvatar>
              }
              title={
                <Typography.Text>
                  <div dangerouslySetInnerHTML={{ __html: item.cnName || item.name }}></div>
                </Typography.Text>
              }
              description={<Typography.Text type="secondary">{path}</Typography.Text>}
            />
          </KmList.Item>
        );
      })}

      {(searchResult === undefined || searchResult.length === 0) &&
        (mapResult === undefined || mapResult.length === 0) && <KmEmpty image={KmEmpty.PRESENTED_IMAGE_SIMPLE} />}
    </KmList>
  );
}
