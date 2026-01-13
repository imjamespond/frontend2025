import { FastColor } from "@ant-design/fast-color";

export const colorSecodary = "#a1a1a1";
export const colorPrimary = "#fdcc09";

// export const colors = ['#3D6FCB', '#0099FF', '#CC00FF', '#9966FF']
export const colors = ["#c7000b", "#c7000b", "#c7000b", "#c7000b"];

export function getColors(i: number): string {
  return colors[i % colors.length];
}

// export type getColorType = typeof getColor;
// export function getColor(isEntry: boolean, subNodes: number) {
//   return isEntry
//     ? { fill: "#f1a8aa" /* '#57C7E3' */, stroke: colorSecodary /* '#23b3d7' */ }
//     : { fill: `${subNodes > 0 ? "#d7dbdb" : "#e3e7e8"}`, stroke: "#d4d8d8" };
// }

export const getStyle = (isEntry: boolean | undefined, subNodes: number) => {
  if (isEntry === undefined) {
    return {
      fill: colorPrimary,
      stroke: new FastColor({ ...new FastColor(colorPrimary).toHsl(), l: 0.48 }).toHexString(),
      color: "#fff",
    };
  }
  if (isEntry) {
    const fill = "rgb(247, 151, 103)";
    return {
      fill,
      stroke: new FastColor({ ...new FastColor(fill).toHsl(), l: 0.5 }).toHexString(),
      color: "#fff",
    };
  }
  const fill = "rgb(165, 171, 182)";
  const color = new FastColor(fill).toHsl();
  return {
    fill,
    stroke: subNodes > 0 ? new FastColor({ ...color, l: 0.6 }).toHexString() : fill,
    color: "#fff",
  };
};
