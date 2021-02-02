import {Subject, SubjectInput} from '../authorization/RoleGrantsService'
import {TABLE_NAME} from './Series.entity'

export const subject = (id: string): Subject => ({
  table: TABLE_NAME,
  id,
})

export const subjectInput = (id: string): SubjectInput => ({
  subjectTable: TABLE_NAME,
  subjectId: id,
})
