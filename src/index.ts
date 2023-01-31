import bot from './bot'
import { logger } from './middleware/logger'
import './controllers'

const isDevMode = process.env.MODE === 'development'

if (isDevMode) {
  bot.launch()
}

bot.catch(error => logger.error(error))
