import bot from './bot'
import { logger } from './middleware/logger'
import './controllers'
import { errorHandler, isDev } from './utils/common'
import { Handler, WebData } from './types'
import { answerWebApp } from './controllers/web-data'
import localeService from './services/locale'

if (isDev) {
  bot.launch()
}

bot.catch(error => logger.error(error))

const updateHandlerError = errorHandler('Bot handle update exception')
const webDataHandlerError = errorHandler('Web data handle exception')
const answer = (statusCode: number, body = '') => ({
  statusCode,
  body,
})

export const handler: Handler = async ({
  body,
  requestContext: { apiGateway, authorizer },
}) => {
  if (!body) return answer(400)

  if (apiGateway?.operationContext?.webData) {
    const userId = authorizer?.userId
    const data = JSON.parse(body) as WebData
    const { language_code, ...webData } = data
    localeService.locale = language_code || 'en'

    try {
      if (!userId) {
        throw new Error('ID not found')
      }

      await answerWebApp(userId, webData)
    } catch (error) {
      webDataHandlerError(error, answerWebApp.name, { body })

      return answer(400)
    }

    return answer(200)
  }

  const data = JSON.parse(body)

  try {
    await bot.handleUpdate(data)
  } catch (error) {
    updateHandlerError(error, bot.handleUpdate.name, { body })

    return answer(400)
  }

  return answer(200)
}
