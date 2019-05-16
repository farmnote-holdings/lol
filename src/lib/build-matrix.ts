import { MemberAttributes } from './load-members-attrs'

export interface Matrix {
  readonly [name: string]: {
    [name: string]: number
  }
}

interface B {
  [name: string]: number
}

const buildMatrix = (membersAttrs: MemberAttributes): Matrix => {
  const members = Object.keys(membersAttrs)
  return members.reduce((matrix: { [name: string]: B }, aName: string) => {
    matrix[aName] = members.reduce((bs: B, bName) => {
      bs[bName] = 0
      return bs
    }, {})
    return matrix
  }, {})
}

export default buildMatrix
