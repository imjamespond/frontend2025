const config = {
  // 'elk.direction':'DOWN',
  // 'elk.edgeRouting':'SPLINES',

  "elk.spacing.componentComponent": "50f", // 无连线节点间距
  // 'elk.layered.nodePlacement.strategy': 'SIMPLE', //'INTERACTIVE','BRANDES_KOEPF' 'NETWORK_SIMPLEX' 'LINEAR_SEGMENTS'
  "elk.layered.layering.strategy": "INTERACTIVE", //'COFFMAN_GRAHAM',// 'MIN_WIDTH', // 'STRETCH_WIDTH',// 'LONGEST_PATH'
};

const config0 = {
  "spacing.nodeNodeBetweenLayers": "100", // 垂直间距 when DOWN
  "spacing.nodeNode": "150",
  "elk.spacing.edgeNode": "30",
  "elk.layered.nodePlacement.strategy": "SIMPLE",
};

const config01 = {
  "spacing.nodeNodeBetweenLayers": "100", // 垂直间距 when DOWN
  "spacing.nodeNode": "150",
  "elk.spacing.edgeNode": "30",
  // 'elk.layered.nodePlacement.strategy': 'SIMPLE',
  "considerModelOrder.strategy": "NODES_AND_EDGES", // 'NODES_AND_EDGES'
  // 'considerModelOrder.crossingCounterNodeInfluence': '100.0',
  // thoroughness: '100',
  // Order of nodes before crossing minimization does not change during crossing minimization.
  "crossingMinimization.forceNodeModelOrder": "true",
  // 'crossingMinimization.strategy': 'NONE',
  // 'crossingMinimization.greedySwitch.type': 'OFF',
};

const config1 = {
  "spacing.nodeNodeBetweenLayers": "100", // 垂直间距 when DOWN
  "spacing.nodeNode": "150",
  "elk.layered.nodePlacement.strategy": "LINEAR_SEGMENTS",
  "elk.layered.layering.strategy": "STRETCH_WIDTH", // 'MIN_WIDTH'// 'STRETCH_WIDTH'// 'INTERACTIVE'// 'COFFMAN_GRAHAM'// 'LONGEST_PATH_SOURCE'// 'LONGEST_PATH'
  "elk.layered.nodePlacement.bk.fixedAlignment": "BALANCED",
};

const config2 = {
  "elk.spacing.componentComponent": "50f",
  "spacing.nodeNodeBetweenLayers": "50", // 垂直间距 when DOWN
  "spacing.nodeNode": "50",
  "elk.layered.layering.strategy": "INTERACTIVE",
  "elk.layered.nodePlacement.bk.fixedAlignment": "BALANCED",
  // 交叉最小化时,保持节点顺序,可以分组
  "crossingMinimization.forceNodeModelOrder": "true",
};

const config3 = {
  "elk.port.side": "NORTH",
  "elk.portConstraints": "FIXED_SIDE", // 'FIXED_ORDER', //'FIXED_SIDE',
  "elk.layered.allowNonFlowPortsToSwitchSides": "true",
  // 'elk.layered.layering.strategy': 'INTERACTIVE',
};

const config4 = {
  "elk.algorithm": "layered",
  "elk.layered.feedbackEdges": "true",
  // "elk.hierarchyHandling": "SEPARATE_CHILDREN",
  // "elk.alignment": "RIGHT",
  // "elk.direction": "RIGHT",
  // "elk.aspectRatio": '10',
  "elk.edgeRouting": "ORTHOGONAL",
  "elk.layered.nodePlacement.bk.fixedAlignment": "BALANCED",
  // "elk.layered.allowNonFlowPortsToSwitchSides": 'true',
  "elk.spacing.edgeNode": "100",
  "elk.spacing.nodeNode": "100",
  "partitioning.activate": "true",
  // "nodeFlexibility": "NODE_SIZE"
};

const config5 = {
  "elk.algorithm": "layered",
  "elk.layered.nodePlacement.bk.fixedAlignment": "BALANCED",
  "elk.layered.nodePlacement.strategy": "BRANDES_KOEPF",
  "elk.spacing.edgeNode": "100",
  "elk.spacing.nodeNode": "100",

  // 'elk.layered.compaction.postCompaction.strategy': 'LEFT',
};

export default config5;

export const ElkConfigs = {
  config,
  config0,
  config01,
  config1,
  config2,
  config3,
  config4,
  config5,
};

export type ElkConfigKeys = keyof typeof ElkConfigs;
