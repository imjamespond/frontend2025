import { Node } from "@antv/x6";
import { LBOrg, LTOrg, RBOrg, RTOrg, type OrgStyle } from "./fixedNodes";
import type { ResourceType } from "../helper";



export const createGraph = (container: HTMLElement, { layoutRef, data }: { layoutRef: React.RefObject<Function[]>, data: DataAtlas.HomePageMap }) => {


  const { setup, createEdge, createNode } = initGraph({ graph })



  const draw = ({ parent, style, dirs, resourceType, offset, lr, tb }: {
    parent: Node, // 外部内部资源,数据资产 结点
    style: OrgStyle,
    dirs: DataAtlas.HomePageMapItem[],
    resourceType: ResourceType,
    offset: number
    lr: 0 | 1
    tb: 0 | 1
  }) => {

    const zoom = graph.zoom()

    const direction = 'V'

    const nodes = dirs.map((dir) => {
      const newStyle = getSize(style, dir, zoom)
      const nodeMeta = createNode(newStyle, { dir, style: newStyle, resourceType })
      return graph.createNode(nodeMeta)
    })

    const edges = nodes.map((node: Node) => {
      return createEdge(parent, node, style, direction)
    })

    for (const node of nodes) {
      parent.addChild(node)
    }
    graph.addEdges(edges)

    const layoutFn = () => {
      const ppos = parent.getPosition()
      const psize = parent.getSize()
      const { marginX, marginY } = style

      if (nodes.length <= 3) {
        const offset = Math.floor(nodes.length / 2) // 
        const even = (nodes.length % 2 - 1) * .5 // when len is even
        const originX = lr === 0 ? - (config.x + config.block.width - config.node.width / 2) : (config.x - config.node.width / 2)
        nodes.forEach((n, i) => {
          const bbox = n.getBBox()
          n.setPosition({
            x: originX + (offset - i + even) * (bbox.width + marginX),
            y: tb === 0 ? (ppos.y - (bbox.height) - marginY) : (ppos.y + psize.height + marginY)
          })
        })
      } else {
        nodes.forEach((n, i) => {
          const bbox = n.getBBox()
          const idx = lr === 0 ? (-i - 1) : i
          const index = idx + offset
          n.setPosition({
            x: index * (bbox.width + marginX) + marginX * .5,
            y: tb === 0 ? (ppos.y - (bbox.height) - marginY) : (ppos.y + psize.height + marginY)
          })
        })
      }
    }
    layoutRef.current?.push(layoutFn)
  }

  /* 初始化图形 */
  const { root, lt, lb, rt, rb } = AddNodes(graph)

  const ltDirs = data.digitalConsumer ?? [] /* (data as any).innerSource ?? [] *//* .slice(0,1) */, rtDirs = data.functionUnits ?? []/* .slice(0,4) */, lbDirs = data.common ?? []/* .slice(0) */, rbDirs = data.digitalOperation ?? []

  let tOffset = clampOffset(ltDirs, rtDirs), bOffset = clampOffset(lbDirs, rbDirs)


  draw({ parent: lt.node, style: LTOrg, dirs: ltDirs, resourceType: 'digitalConsumer', offset: tOffset, lr: 0, tb: 0 })
  draw({ parent: rt.node, style: RTOrg, dirs: rtDirs, resourceType: 'functionUnits', offset: tOffset, lr: 1, tb: 0 })
  draw({ parent: lb.node, style: LBOrg, dirs: lbDirs, resourceType: 'common', offset: bOffset, lr: 0, tb: 1 })
  draw({ parent: rb.node, style: RBOrg, dirs: rbDirs, resourceType: 'digitalOperation', offset: bOffset, lr: 1, tb: 1 })
  /* 初始化图形 */
  setup()

  return graph
}

function clampOffset(lDirs: DataAtlas.HomePageMapItem[], rDirs: DataAtlas.HomePageMapItem[]) {
  let offset = 0
  if (lDirs.length > 3 && rDirs.length > 3) {
    offset = lDirs.length - rDirs.length
    offset = offset > 2 ? 2 : offset
    offset = offset < -2 ? -2 : offset
  }
  return offset
}

