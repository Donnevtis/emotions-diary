import bot from './bot'
import { logger } from './middleware/logger'
import './controllers'
import { errorHandler, isDev } from './utils/common'
import { RequestPayload } from './types'

if (isDev) {
  bot.launch()
}

bot.catch(error => logger.error(error))

const typedErrorHandler = errorHandler('Bot handle update exception')

export const handler = (payload: RequestPayload) => {
  console.log(payload)
  const { body } = payload

  if (!body) return

  const data = JSON.parse(body)

  return bot
    .handleUpdate(data)
    .catch(error => typedErrorHandler(error, bot.handleUpdate.name, { body }))
}
