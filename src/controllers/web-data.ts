import { Telegram } from 'telegraf'
import { getTypedEnv } from '../utils/common'
import { t } from '../services/locale'
import { WebData } from '../types'
import inlineKeyboard from '../messages/inline-keyboard'

const token = getTypedEnv('BOT_TOKEN')

const telegram = new Telegram(token)

export const answerWebApp = (userId: number, { emotion, energy }: WebData) =>
  telegram.sendMessage(
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
