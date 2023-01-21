import pino from 'pino'
import { Context, deunionize } from 'telegraf'
import { stringify } from '../utils/common'

export const logger = pino({
  transport: {
    target: 'pino-pretty',
  },
})

export default async (
  { from, message, callbackQuery, updateType, myChatMember }: Context,
  next: () => Promise<void>,
) => {
  logger.info(
    stringify({
      id: from?.id,
      username: from?.username,
      text: message && deunionize(message).text,
      data: callbackQuery && deunionize(callbackQuery).data,
      type: updateType,
      status: myChatMember?.new_chat_member.status,
      date: message?.date && new Date(message?.date * 1000),
    }),
  )
  try {
    await next()
  } catch (error) {
    logger.error(error)
  }
}
