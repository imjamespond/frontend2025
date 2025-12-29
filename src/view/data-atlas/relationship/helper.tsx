import { KmTypography } from "@components";
import type { BreadcrumbProps } from "antd";
import { useMemo } from "react";
import { useRootDir, useSetView } from "../context";
import { useCrumb } from "./service";
import { View } from "../helper";

export function useBreadItems() {
  const rootDir = useRootDir();
  const resourceType = rootDir?.resourceType;
  const { data: subDir, isLoading: isLoadingSubDir } = useCrumb();
  const setView = useSetView();
  return useMemo(() => {
    const items: BreadcrumbProps["items"] = [];
    let curDir = subDir,
      endDir = "";
    while (!!curDir) {
      if (curDir === subDir) {
        items.push({
          title: (
            <KmTypography.Link
              className={"link"}
              onClick={() => {
                setView(View.DataMap);
              }}
            >
              数据地图 &nbsp;{">"}&nbsp; {curDir.dirName}
            </KmTypography.Link>
          ),
        });
      } else if (!curDir.subDir) {
        items.push({ title: curDir.dirName });
      } else {
        const dirId = curDir.dirId;
        items.push({
          title: (
            <KmTypography.Link
              className={"link"}
              onClick={() => {
                // ActionSubject.next({ type: ActionType.SubNode, payload: { dirId } });
              }}
            >
              {curDir.dirName}
            </KmTypography.Link>
          ),
        });
      }

      if (!curDir.subDir) {
        endDir = curDir.dirName;
      }
      curDir = curDir.subDir;
    }
    return [items, endDir] as const;
  }, [subDir, resourceType]);
}
