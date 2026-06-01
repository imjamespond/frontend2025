import { KmBreadcrumb, KmCol, KmRadio, KmRow } from "@components";
import { useEffect } from "react";
import Block from "./block/VList";
import { useGraphType, useSetGraphType } from "./context";
import { GraphType, useBreadItems } from "./helper";
import Relation from "./relation";
import { useCrumbData } from "./service";
import { useStyles } from "./styles";
import Tree from "./tree-org";

function FC() {
  const { styles } = useStyles();
  const [breadItems] = useBreadItems();
  const { data: subDir } = useCrumbData();
  const graphType = useGraphType();
  const setGraphType = useSetGraphType();
  useEffect(() => {
    setGraphType(GraphType.Block);
  }, [setGraphType]);
  return (
    <div className={styles.root}>
      <KmRow className="__item">
        <KmCol span={24}>
          <KmBreadcrumb separator=">" items={breadItems} />
        </KmCol>
      </KmRow>

      <div className="__item">
        <KmRadio.Group value={graphType} buttonStyle="solid" onChange={(e) => setGraphType(e.target.value)}>
          <KmRadio.Button value={GraphType.Block}>方块图</KmRadio.Button>
          <KmRadio.Button value={GraphType.Tree}>树形图</KmRadio.Button>
          <KmRadio.Button value={GraphType.Org}>组织图</KmRadio.Button>
          <KmRadio.Button value={GraphType.Relation}>关系图</KmRadio.Button>
        </KmRadio.Group>
      </div>

      <div className="__item __content">
        {graphType === GraphType.Block && <Block />}
        {graphType === GraphType.Tree && <Tree key="tree" graphType={graphType} subDir={subDir?.subDir} />}
        {graphType === GraphType.Org && <Tree key="org" graphType={graphType} subDir={subDir?.subDir} />}
        {graphType === GraphType.Relation && <Relation subDir={subDir?.subDir} />}
      </div>

      {/* {JSON.stringify({rootDir,subDir},)} */}
      {/* {JSON.stringify(resourceType)} */}
    </div>
  );
}

export default FC;
