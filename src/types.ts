import { Handler } from '@yandex-cloud/function-types'

export enum PATHS {
  user = '/user',
  status = '/user/status',
  settings = '/settings',
  state = '/state',
  report = '/report',
  history = '/history',
}

export enum Command {
  getState = 'getState',
  getSettings = 'getSettings',
  putState = 'putState',
  updateSettigns = 'updateSettings',
}

type HandlerParameters = Parameters<Handler.Http>

type RequestContext = {
  requestContext: {
    apiGateway?: {
      operationContext?: { webData?: boolean; command?: Command }
    }
    authorizer?: {
      userId?: number
    }
  }
}

type Return = {
  statusCode: number
  body: string
}

export type Handler = (
  event: HandlerParameters[0] & RequestContext,
  context: HandlerParameters[1],
) => Promise<Return>

export type UserState = {
  emotion: string
  energy: number
  timestamp: number
  timezone: string
}

export type WebData = {
  language_code: string
} & UserState

export type StoredState = {
  state_id: string
} & UserState

export type ChatMemberStatus =
  | 'creator'
  | 'administrator'
  | 'member'
  | 'restricted'
  | 'left'
  | 'kicked'

export type RecievedUser = {
  id: number
  username?: string
  first_name?: string
  last_name?: string
  is_bot?: boolean
  language_code?: string
  status?: ChatMemberStatus
}

export type StoreUserInfo = {
  PK: string
  SK: string
  registration_date: number
}

export type StoredUser = RecievedUser & StoreUserInfo

export type UserTimersSettings = {
  user_id: number
  reminder_timers: Array<string>
  time_offset: number
  notify: boolean
  language_code: string
}

export type Ranges = { start?: number; end?: number }

export enum CALLBACK_DATA {
  openMenu = 'openMenu',
  closeMenu = 'closeMenu',
  backMenu = 'backMenu',
  report = 'report',
  weekReport = 'weekReport',
  monthReport = 'monthReport',
  settings = 'settings',
  ru = 'ru',
  en = 'en',
}
