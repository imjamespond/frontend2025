import { KmBreadcrumb, KmCol, KmRadio, KmRow } from "@components";
import { useStyles } from "./styles";
import { GraphType, useBreadItems } from "./helper";
import { useGraphType, useSetGraphType } from "./context";
import Block from "./block";

function FC() {
  const { styles } = useStyles();
  const [breadItems] = useBreadItems();
  const graphType = useGraphType();
  const setGraphType = useSetGraphType();
  return (
    <div className={styles.root}>
      <KmRow className="__item">
        <KmCol span={24}>
          <KmBreadcrumb separator=">" items={breadItems} />
        </KmCol>
      </KmRow>

      <div className="__item">
        <KmRadio.Group
          value={graphType} 
          buttonStyle="solid"
          onChange={(e) => setGraphType(e.target.value)}
        >
          <KmRadio.Button value={GraphType.Block}>方块图</KmRadio.Button>
          <KmRadio.Button value={GraphType.Tree}>树形图</KmRadio.Button>
          <KmRadio.Button value={GraphType.Org}>组织图</KmRadio.Button>
          <KmRadio.Button value={GraphType.Relation}>关系图</KmRadio.Button>
        </KmRadio.Group>
      </div>

      <div className="__item __content">
        {graphType === GraphType.Block && <Block />}
        {/* 
        {graphType === GraphType.Tree && <Graph key="1" graphType={graphType} subDir={subDir?.subDir} />}
        {graphType === GraphType.Org && <Graph key="2" graphType={graphType} subDir={subDir?.subDir} />}
        {graphType === GraphType.Relation && <Relation subDir={subDir?.subDir} />} */}
      </div>

      {/* {JSON.stringify({rootDir,subDir},)} */}
      {/* {JSON.stringify(resourceType)} */}
    </div>
  );
}

export default FC;
