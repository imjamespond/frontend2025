import { Graph, Shape } from "@antv/x6";


Shape.Path.define({
  shape: 'flowchart_collate',
  // overwrite: true,
  width: 100,
  height: 100,
  markup: [
    {
      tagName: 'g', selector: 'g',
      children: [
        {
          tagName: 'circle', selector: 'body'
        },
        {
          tagName: 'circle', attrs: { class: 'ring' }
        },
        {
          tagName: 'text', selector: 'text',
        },

      ]
    },
    {
      tagName: 'g', className: 'menu', 
    }
  ], 
})


Graph.registerEdge('shadow-edge', {
  inherit: 'edge',
  markup: [
    {
      tagName: 'path',
      selector: 'shadow',
      attrs: {
        fill: 'none',
      },
    },
    {
      tagName: 'path',
      selector: 'line',
      attrs: {
        fill: 'none',
        cursor: 'pointer',
      },
    },
  ],
  attrs: {
    line: {
      connection: true,
      stroke: '#dddddd',
      strokeWidth: 20,
      strokeLinejoin: 'round',
      targetMarker: {
        name: 'path',
        stroke: 'none',
        d: 'M 0 -10 -10 0 0 10 z',
        offsetX: -5,
      },
      sourceMarker: {
        name: 'path',
        stroke: 'none',
        d: 'M -10 -10 0 0 -10 10 0 10 0 -10 z',
        offsetX: -5,
      },
    },
    shadow: {
      connection: true,
      refX: 3,
      refY: 6,
      stroke: '#000000',
      strokeOpacity: 0.2,
      strokeWidth: 20,
      strokeLinejoin: 'round',
      targetMarker: {
        name: 'path',
        d: 'M 0 -10 -10 0 0 10 z',
        stroke: 'none',
        offsetX: -5,
      },
      sourceMarker: {
        name: 'path',
        stroke: 'none',
        d: 'M -10 -10 0 0 -10 10 0 10 0 -10 z',
        offsetX: -5,
      },
    },
  },
})
