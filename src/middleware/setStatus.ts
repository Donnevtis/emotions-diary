import { Context } from 'telegraf'
import { setStatus } from '../database'
import { PromiseNoop } from './types'

export default async ({ myChatMember }: Context, next: PromiseNoop) => {
  if (myChatMember) {
    const {
      from: { id },
      new_chat_member: { status },
    } = myChatMember

    setStatus(id, status)
  }

  await next()
}
