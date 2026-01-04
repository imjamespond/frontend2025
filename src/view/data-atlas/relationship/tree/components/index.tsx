import { Node } from "@antv/x6";
import Tooltip from "@components/Tooltip";

import classnames from "classnames";
import { useCategoryStyles, useDirStyles } from "./styles";
import classNames from "classnames";
import type { ResourceType } from "@/view/data-atlas/helper";
import type { NodeData } from "../graph/types";
import { useSetSubNode } from "@/view/data-atlas/context";

export function Category({ node }: { node: Node }) {
  const { label, color } = node.getData<NodeData>();
  const { styles } = useCategoryStyles({ theme: { colorPrimary: color } });
  return (
    <div className={classNames(styles.root, "__title__")}>
      <Tooltip defaultStyle tip={label} />
    </div>
  );
}

export type DirNodeData = {
  direction: string;
  resourceType: ResourceType;
  highlight: boolean;
  color: string;
} & NodeData;
export const DirNode = ({ node }: { node: Node }) => {
  const { item, direction, highlight, color } = node.getData<DirNodeData>();
  const { styles } = useDirStyles({ theme: { colorPrimary: color } });
  const placement = direction === "H" ? "right" : undefined;
  const msg = `${item?.text}(${item?.dataAssetAndSubDirCount})`;
  const setSubNode = useSetSubNode();
  return (
    <div className={classnames(styles.root, { highlight })}>
      <Tooltip
        tip={msg}
        placement={placement}
        defaultStyle
        onClick={() => {
          setSubNode({ dirId: item.nodeId });
        }}
      />
    </div>
  );
};
