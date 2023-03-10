import { ChatMember } from 'typegram'

export type User = {
  PK: string
  SK: string
  first_name: string
  last_name: string
  username: string
  is_bot: boolean
  registration_date: number
  language_code: string
  status: ChatMember['status']
}

export type UserTimersSettings = {
  id: number
  reminder_timers: Array<string>
  time_offset: number
  notify: boolean
}
