export type Player = 'A' | 'B'
export type SmallBoard = (undefined | Player)[]
export type CellCoordinates = [number, number]
export type BigBoard = SmallBoard[]

//prettier-ignore
export const WINS = [ [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6], ]

export function getRandomCellCoordinates(): CellCoordinates {
  return [Math.floor(Math.random() * 9), Math.floor(Math.random() * 9)]
}
