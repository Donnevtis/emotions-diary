import { Telegram } from 'telegraf'
import { getTypedEnv } from '../utils/common'

const token = getTypedEnv<string>('BOT_TOKEN')

const telegram = new Telegram(token)

type Data = {
  query_id: string
  emotion: string
  energy: number
  timestamp: number
  time_zone_offset: number
}

export const answerWebApp = async ({ query_id, emotion }: Data) => {
  await telegram.answerWebAppQuery(query_id, {
    type: 'article',
    id: query_id,
    title: 'message',
    input_message_content: { message_text: emotion },
  })
}
