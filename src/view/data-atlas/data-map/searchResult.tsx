import { KmAvatar, KmEmpty, KmList } from "@components";
import { Typography } from "antd";
import { OpenAssetBrowse, OpenAssetResBrowse } from "@service";
import { getTextWithHighlights } from "./helper";
import { useFindResult, useSearchResult, useSearchText, useSetOpen } from "./contex";
import { Fragment } from "react/jsx-runtime";
import { useSetMatchedDirId, useSetRelBySearchResult } from "../context";
import type { ResourceType } from "../helper";

export default function SearchResult({ activeKey }: { activeKey: string }) {
  const searchText = useSearchText();
  const searchResult = useSearchResult();
  const findResult = useFindResult();
  const setOpen = useSetOpen();
  const setGraph = useSetRelBySearchResult();
  const setMatchedDirId = useSetMatchedDirId();
  return (
    <Fragment>
      {/* {JSON.stringify({ searchText })} */}
      <KmList itemLayout="horizontal">
        {/* 数据地图结果 */}
        {searchResult?.map((item, i) => (
          <KmList.Item
            className={"matchedItem"}
            style={{ cursor: "pointer" }}
            key={i}
            onClick={() => {
              setMatchedDirId(item.dirId);
              setOpen(false);
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
        {findResult?.map((item, i) => {
          const isDataAsset = item.additional?.type === "DataAsset";
          const isDir = item.additional?.type === "Dir";
          const avatar = isDataAsset ? "资" : "目";
          let path = (
            <div
              style={{ cursor: "pointer" }}
              dangerouslySetInnerHTML={{ __html: item.path }}
              onClick={() => {
                if (isDir) {
                  setGraph({ dirId: item.id, resourceType: item.additional?.sourceType as ResourceType });
                }
                setOpen(false);
              }}
            ></div>
          );
          if (isDataAsset) {
            try {
              path = (
                <Fragment>
                  {(JSON.parse(item.path) as Misc.Any[]).map((dir, i) => (
                    <div
                      key={i}
                      style={{ cursor: "pointer" }}
                      dangerouslySetInnerHTML={{ __html: dir.dirPath }}
                      onClick={() => {
                        if (isDataAsset) {
                          activeKey === "3"
                            ? OpenAssetBrowse(item.id, dir.dirId)
                            : OpenAssetResBrowse(item.id, dir.dirId);
                        }
                        setOpen(false);
                      }}
                    ></div>
                  ))}
                </Fragment>
              );
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

        {(findResult === undefined || findResult.length === 0) &&
          (searchResult === undefined || searchResult.length === 0) && (
            <KmEmpty image={KmEmpty.PRESENTED_IMAGE_SIMPLE} />
          )}
      </KmList>
    </Fragment>
  );
}
