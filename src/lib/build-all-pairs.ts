import SCORES from './scores-definitions'
import { MemberAttributes } from './load-members-attrs'
import { Matrix } from './build-matrix'

type Name = string
export interface Pair {
  readonly aName: Name
  readonly bName: Name
  readonly score: number
}
type PeriodPairs = Array<Pair>
export type AllPairs = Array<PeriodPairs>

const buildAllPairs = (memberAttrs: MemberAttributes, matrix: Matrix, iterations: number): AllPairs => {
  const allPairs = []
  for (let i = 0; i < iterations; ++i) {
    allPairs.push(buildPeriodPairs(memberAttrs, matrix))
  }
  return allPairs
}

const buildPeriodPairs = (memberAttrs: MemberAttributes, matrix: Matrix): PeriodPairs => {
  const result = []

  let remains = Object.keys(memberAttrs)
  while (2 <= remains.length) {
    // a
    const membersHasLeastCandidates = getACandidates(matrix, remains)
    const aCandidates = Object.keys(membersHasLeastCandidates)
    const aName = aCandidates[choiceRandomIndex(aCandidates.length)]

    // b
    const { score, bCandidates } = membersHasLeastCandidates[aName]
    const bName = bCandidates[choiceRandomIndex(bCandidates.length)]

    remains = remains.filter(member => ![aName, bName].includes(member))
    matrix[aName][bName] += SCORES.HISTORIES
    matrix[bName][aName] += SCORES.HISTORIES

    result.push({
      aName,
      bName,
      score,
    })
  }

  return result
}

// minimum score is most far
interface MostFarCandidates {
  bCandidates: Array<Name>
  score: number
}

interface ACandidates {
  [name: string]: MostFarCandidates
}
type Remains = Array<Name>
type AllCandidates = ACandidates
// get members have a minimum number of candidates that have minimum score
const getACandidates = (matrix: Matrix, remains: Remains): ACandidates => {
  let minCount = remains.length
  const allCandidates: AllCandidates = remains.reduce((allCandidates: AllCandidates, name) => {
    const mostFarCandidates = getMostFarCandidates(matrix, remains, name)
    allCandidates[name] = mostFarCandidates
    if (mostFarCandidates.bCandidates.length < minCount) {
      minCount = mostFarCandidates.bCandidates.length
    }
    return allCandidates
  }, {})

  return Object.keys(allCandidates).reduce((candidates: AllCandidates, name) => {
    if (allCandidates[name].bCandidates.length === minCount) {
      candidates[name] = allCandidates[name]
    }
    return candidates
  }, {})
}

const getMostFarCandidates = (matrix: Matrix, remains: Remains, name: Name): MostFarCandidates => {
  const sortedCandidatesByScore = getSortedCandidatesByScore(matrix, remains, name)
  const minScore = Math.min.apply(null, Object.keys(sortedCandidatesByScore).map(score => parseInt(score, 10)))
  const mostFarCandidates = sortedCandidatesByScore[minScore]
  return {
    bCandidates: mostFarCandidates,
    score: minScore,
  }
}

interface SortedCandidatesByScore {
  [score: number]: Array<Name>
}
const getSortedCandidatesByScore = (matrix: Matrix, remains: Remains, name: Name): SortedCandidatesByScore =>
  Object.keys(matrix[name]).reduce((sortedCandidatesByScore: SortedCandidatesByScore, bName) => {
    if (name === bName) {
      return sortedCandidatesByScore
    }
    if (!remains.includes(bName)) {
      return sortedCandidatesByScore
    }

    const score = matrix[name][bName]
    if (sortedCandidatesByScore[score] == null) {
      sortedCandidatesByScore[score] = []
    }
    sortedCandidatesByScore[score].push(bName)
    return sortedCandidatesByScore
  }, {})

const choiceRandomIndex = (max: number) => Math.floor(Math.random() * max)

export default buildAllPairs
