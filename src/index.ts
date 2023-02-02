import bot from './bot'
import { logger } from './middleware/logger'
import './controllers'
import { errorHandler, isDev } from './utils/common'
import { Handler } from './types'
import { answerWebApp } from './controllers/webData'

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

export let IAM_TOKEN: string | undefined

export const handler: Handler = async (event, context) => {
  IAM_TOKEN = context.token?.access_token

  const {
    body,
    requestContext: { apiGateway },
  } = event

  if (!body) return answer(400)

  if (apiGateway?.operationContext?.web_data) {
    const data = JSON.parse(Buffer.from(body, 'base64').toString())

    try {
      await answerWebApp(data)
    } catch (error) {
      webDataHandlerError(error, answerWebApp.name, { data })

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
