import { Telegraf } from 'telegraf'
import logger from './middleware/logger'
import userHandler from './middleware/userHandler'
import collector from './middleware/statCollector'

const token = String(process.env.BOT_TOKEN)
const bot = new Telegraf(token, { handlerTimeout: 10 })

bot.use(collector, logger, userHandler)

export default bot
