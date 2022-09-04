export interface Pos {
  x: number
  y: number
}

export interface IPeopleInfo {
  pos: Pos
  name: string
  socketId: string
}

export interface MoveData {
  socketId: string
  position: Pos
}
