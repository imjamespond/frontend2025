import { KmBreadcrumb, KmCol, KmRadio, KmRow } from "@components";
import { useStyles } from "./styles";
import { useBreadItems } from "./helper";

function FC() {
  const { styles } = useStyles();
  const [breadItems] = useBreadItems();
  return (
    <div className={styles.root}>
      <KmRow className="item">
        <KmCol span={24}>
          <KmBreadcrumb separator=">" items={breadItems} />
        </KmCol>
      </KmRow>

      {/* <div className="item">
        <KmRadio.Group
          value={graphType}
          size="middle"
          buttonStyle="solid"
          onChange={(e) => setGraphType(e.target.value)}
        >
          <KmRadio.Button value={GraphType.Block}>方块图</KmRadio.Button>
          <KmRadio.Button value={GraphType.Tree}>树形图</KmRadio.Button>
          <KmRadio.Button value={GraphType.Org}>组织图</KmRadio.Button>
          <KmRadio.Button value={GraphType.Relation}>关系图</KmRadio.Button>
        </KmRadio.Group>
      </div> */}

      <div className="item content">
        {/* {graphType === GraphType.Block && <Block />}
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
