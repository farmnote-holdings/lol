import loadHistories from './load-histories'
import { MemberAttributes, Division } from './load-members-attrs'
import buildMatrix, { Matrix } from './build-matrix'
import SCORES from './scores-definitions'

const calculateScores = (membersAttrs: MemberAttributes, histroiesPath: string) => {
  const matrix = buildMatrix(membersAttrs)

  calculateFromAttrs(matrix, membersAttrs)
  calculateFromHistories(matrix, histroiesPath)

  return matrix
}

const calculateFromAttrs = (matrix: Matrix, membersAttrs: MemberAttributes) => {
  const names = Object.keys(membersAttrs)

  names.reduce((matrix, aName) => {
    names.forEach(bName => {
      calculateSamePerson(matrix, aName, bName)
      calculateLocation(matrix, membersAttrs, aName, bName)
      calculateDivision(matrix, membersAttrs, aName, bName)
      calculateIsManager(matrix, membersAttrs, aName, bName)
    })
    return matrix
  }, matrix)
}

const calculateSamePerson = (matrix: Matrix, aName: string, bName: string) => {
  if (aName === bName) {
    matrix[aName][aName] += SCORES.SAME_PERSON
  }
}

const calculateLocation = (matrix: Matrix, membersAttrs: MemberAttributes, aName: string, bName: string) => {
  const aLocation = membersAttrs[aName].location
  const bLocation = membersAttrs[bName].location

  if (aLocation === bLocation) {
    matrix[aName][bName] += SCORES.LOCATION
  }
}

const isSameDivision = (aDivision: Division, bDivision: Division) => {
  if (Array.isArray(aDivision) && Array.isArray(bDivision)) {
    return aDivision.reduce((result, division) => result || bDivision.includes(division), false)
  }
  if (Array.isArray(aDivision) && typeof bDivision === 'string') {
    return aDivision.includes(bDivision)
  }
  if (typeof aDivision === 'string' && Array.isArray(bDivision)) {
    return bDivision.includes(aDivision)
  }
  return aDivision === bDivision
}

const calculateDivision = (matrix: Matrix, membersAttrs: MemberAttributes, aName: string, bName: string) => {
  const aDivision = membersAttrs[aName].division
  const bDivision = membersAttrs[bName].division

  if (isSameDivision(aDivision, bDivision)) {
    matrix[aName][bName] += SCORES.DIVISION

    const aIsManager = membersAttrs[aName].isManager
    const bIsManager = membersAttrs[bName].isManager
    if (aIsManager || bIsManager) {
      matrix[aName][bName] += SCORES.ALWAYS
    }
  }
}

const calculateIsManager = (matrix: Matrix, membersAttrs: MemberAttributes, aName: string, bName: string) => {
  const aIsManager = membersAttrs[aName].isManager
  const bIsManager = membersAttrs[bName].isManager

  if (aIsManager && bIsManager) {
    matrix[aName][bName] += SCORES.IS_MANAGER
  }
}

const calculateFromHistories = (matrix: Matrix, histroiesPath: string) => {
  if (histroiesPath == null) {
    return
  }

  const histories = loadHistories(histroiesPath)
  if (histories == null) {
    return
  }

  const members = Object.keys(matrix)
  Object.values(histories).forEach(pairs => {
    pairs.forEach(([aName, bName]) => {
      if (members.includes(aName) && members.includes(bName)) {
        matrix[aName][bName] += SCORES.HISTORIES
        matrix[bName][aName] += SCORES.HISTORIES
      }
    })
  })
}

export default calculateScores
