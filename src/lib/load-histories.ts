import * as fs from 'fs'
import * as yaml from 'js-yaml'

export interface Histories {
  readonly [date: string]: Array<readonly [string, string]>
}
const loadHistories = (path: string): Histories => yaml.safeLoad(fs.readFileSync(path, 'utf8'))

export default loadHistories
