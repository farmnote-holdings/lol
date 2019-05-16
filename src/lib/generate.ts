import loadMembersAttrs from './load-members-attrs'
import calculateScores from './calculate-scores'
import buildAllPairs from './build-all-pairs'
import summarizeScore from './summarize-score'

interface Options {
  membersAttrsPath: string
  historiesPath: string
  iterations: number
  maxTrials: number
  callback: (count: number, score: number) => void
}

const generate = ({ membersAttrsPath, historiesPath, iterations, maxTrials, callback }: Options) => {
  if (membersAttrsPath == null) {
    throw new Error('specify a file path to members attributes')
  }
  const membersAttrs = loadMembersAttrs(membersAttrsPath)
  if (membersAttrs == null) {
    throw new Error('specify a file path to members attributes')
  }

  let count = 0
  let minScore = 1000000000
  let allPairs
  while (count < maxTrials) {
    ++count

    const matrix = calculateScores(membersAttrs, historiesPath)
    const result = buildAllPairs(membersAttrs, matrix, iterations)
    const score = summarizeScore(result)

    if (score < minScore) {
      minScore = score
      allPairs = result
    }

    callback(count, minScore)
  }

  return allPairs
}

export default generate
