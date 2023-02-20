import { Context } from 'telegraf'
import { getUser, setStatus } from '../database'
import localeService from '../services/locale'
import { PromiseNoop } from './types'

export default async ({ myChatMember, from }: Context, next: PromiseNoop) => {
  if (from?.id) {
    const user = await getUser(from?.id)
    localeService.locale = user?.language_code || from?.language_code || 'en'
  }

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
