interface Scores {
  readonly [key: string]: number
}

const SCORES: Scores = {
  SAME_PERSON: 10000,
  LOCATION: 100,
  DIVISION: 100,
  ROLE: 20,
  IS_MANAGER: 10000,
  ALWAYS: 10000,
  HISTORIES: 100000,
}

export default SCORES
