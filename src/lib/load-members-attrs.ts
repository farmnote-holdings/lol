import * as fs from 'fs'
import * as yaml from 'js-yaml'

type Location = string
export type Division = string | Array<string>
type Role = string

export interface MemberAttributes {
  readonly [name: string]: {
    readonly location: Location
    readonly division: Division
    readonly role: Role
    readonly isManager?: boolean
  }
}

const loadMembersAttrs = (path: string): MemberAttributes => yaml.safeLoad(fs.readFileSync(path, 'utf8'))

export default loadMembersAttrs
