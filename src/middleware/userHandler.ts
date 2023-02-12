import { Context } from 'telegraf'
import { setStatus } from '../database/'
import localeService from '../services/localeService'
import { PromiseNoop } from './types'

export default async ({ myChatMember, from }: Context, next: PromiseNoop) => {
  localeService.locale = from?.language_code || 'en'

  await next()

  if (myChatMember) {
    const {
      from: { id },
      new_chat_member: { status },
    } = myChatMember

    if (status === 'kicked') {
      setStatus(id, status)
    }
  }
}
