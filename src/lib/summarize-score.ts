import { AllPairs } from './build-all-pairs'

const summarizeScore = (allPairs: AllPairs) =>
  allPairs.reduce((sum, pairs) => {
    const periodScore = pairs.reduce((periodSum, pair) => periodSum + pair.score, 0)
    return sum + periodScore
  }, 0)

export default summarizeScore
