import { colorSecodary } from "@config/style";

export const zoomFit = { padding: 10, minScale: 0.5, maxScale: 1.2 };

// export const colors = ['#3D6FCB', '#0099FF', '#CC00FF', '#9966FF']
export const colors = [colorSecodary];

export function getColors(i: number): string {
  return colors[i % colors.length];
}

export const groupDepth = 3; // szse is 3, mairui is 2, 控制矩形目录组显示
