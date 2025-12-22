
export const colorSecodary = '#a1a1a1'
export const colorPrimary = '#fdcc09'

// export const colors = ['#3D6FCB', '#0099FF', '#CC00FF', '#9966FF']
export const colors = ['#c7000b', '#c7000b', '#c7000b', '#c7000b']

export function getColors(i: number): string {
  return colors[i % colors.length]
}

export type getColorType = typeof getColor
export function getColor(isEntry: boolean, subNodes: number) {
  return isEntry ? { fill: '#f1a8aa'/* '#57C7E3' */, stroke: colorSecodary /* '#23b3d7' */, } : { fill: `${subNodes > 0 ? '#d7dbdb' : '#e3e7e8'}`, stroke: '#d4d8d8' }
} 

export const labels = {
  functionUnits: 'Function Units',
  digitalConsumer: 'Digital Consumer',
  common: 'Common',
  digitalOperation: 'Digital Operation',
}

export type ResourceType = keyof typeof labels