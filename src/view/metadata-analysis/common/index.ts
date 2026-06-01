export function getPortId(fieldId: string) {
  return `port-${fieldId}`;
}
export function getPortRId(fieldId: string) {
  return `port-r-${fieldId}`;
}
export function fromPortId(portId: string) {
  return portId.replace(/port-(r-)?/i, "");
}
export function getHiddenPort(id: string) {
  return `${id}-hidden-port`;
}
