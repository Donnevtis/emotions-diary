import { Telegram } from 'telegraf'
import { getTypedEnv } from '../utils/common'
import { translate as t } from '../services/localeService'

const token = getTypedEnv<string>('BOT_TOKEN')

const telegram = new Telegram(token)

type Data = {
  query_id: string
  emotion: string
  energy: number
  timestamp: number
  timezone: string
}

export const answerWebApp = ({ query_id, emotion, energy }: Data) =>
  telegram.answerWebAppQuery(query_id, {
    type: 'article',
    id: query_id,
    title: t('SAVED'),
    input_message_content: {
      message_text: `${t('FELT')} ${emotion}. ${t('ENERGY')}: ${energy}`,
    },
  })
