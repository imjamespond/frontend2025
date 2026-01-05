import { KmTypography } from "@components";
import type { BreadcrumbProps } from "antd";
import { useMemo, useRef } from "react";
import { useSetSubNode, useSetView } from "../context";
import { useCrumbData } from "./service";
import { View } from "../helper";

export const enum GraphType {
  Block,
  Tree,
  Relation,
  Org,
}

export const enum dbTypes {
  table = "Table",
  dir = "Dir",
}

export function useBreadItems() {
  // const rootDir = useRootDir();
  // const resourceType = rootDir?.resourceType;
  const { data: subDir } = useCrumbData();
  const setView = useSetView();
  const setSubNode = useSetSubNode();
  const ref = useRef({ setView, setSubNode });
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
                ref.current.setView(View.DataMap);
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
                ref.current.setSubNode({ dirId });
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
  }, [subDir]);
}
