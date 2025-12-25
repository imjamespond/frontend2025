export const labels = {
  functionUnits: "Function Units",
  digitalConsumer: "Digital Consumer",
  common: "Common",
  digitalOperation: "Digital Operation",
};

export const enum View {
  None,
  Map,
  Graph,
}

export type ResourceType = keyof typeof labels;
export type Dir = { resourceType?: ResourceType; dirId: string };
