import { Telegram } from 'telegraf'
import { errorHandler, getTypedEnv } from '../utils/common'
import { t } from '../services/locale'
import { UserState } from '../types'
import inlineKeyboard from '../messages/inline-keyboard'
import { addState } from '../database'

const token = getTypedEnv('BOT_TOKEN')

const telegram = new Telegram(token)

const webDataErrorHandler = errorHandler('WebData handler')

export const answerWebApp = async (userId: number, data: UserState) => {
  try {
    await addState(userId, data)

    const { emotion, energy } = data

    await telegram.sendMessage(
      userId,
      `🧠 ${t('FEEL')} <b>${emotion}</b>.
⚡️ ${t('ENERGY')}: <b>${energy}</b>`,
      {
        disable_notification: true,
        parse_mode: 'HTML',
        reply_markup: {
          ...inlineKeyboard.newState(userId),
        },
      },
    )
  } catch (error) {
    webDataErrorHandler(error, answerWebApp.name, { userId })
    await telegram.sendMessage(userId, t('SORRY'))
  }
}
