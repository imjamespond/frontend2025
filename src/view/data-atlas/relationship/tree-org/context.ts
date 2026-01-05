import type { IAct } from "@common/hooks/act";
import { Subject } from "rxjs";
import type { Node } from "@antv/x6";

export const enum ActType {
  ClickDir,
}
type Act = IAct<
  ActType.ClickDir,
  {
    /* 当前点击目录 */
    data: DataAtlas.JsonNode;
    /* 当前点击结点 */
    node: Node;
    /* 当前层级所有目录 */
    pdata: DataAtlas.JsonNode;
  }
>;

export const GraphSubject = new Subject<Act>();
