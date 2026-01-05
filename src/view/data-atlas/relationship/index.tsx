import { KmBreadcrumb, KmCol, KmRadio, KmRow } from "@components";
import { useStyles } from "./styles";
import { GraphType, useBreadItems } from "./helper";
import { useGraphType, useSetGraphType } from "./context";
import Block from "./block/VList";
import Tree from "./tree-org";
import { useEffect } from "react";

function FC() {
  const { styles } = useStyles();
  const [breadItems] = useBreadItems();
  const graphType = useGraphType();
  const setGraphType = useSetGraphType();
  useEffect(() => {
    setGraphType(GraphType.Block);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
        {graphType === GraphType.Tree && <Tree key="tree" graphType={graphType} />}
        {graphType === GraphType.Org && <Tree key="org" graphType={graphType} />}
        {/* 
        {graphType === GraphType.Relation && <Relation subDir={subDir?.subDir} />} */}
      </div>

      {/* {JSON.stringify({rootDir,subDir},)} */}
      {/* {JSON.stringify(resourceType)} */}
    </div>
  );
}

export default FC;
