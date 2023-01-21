import { Telegraf } from 'telegraf'
import logger from './middleware/logger'
import setStatus from './middleware/setStatus'
import collector from './middleware/statCollector'

const token = String(process.env.BOT_TOKEN)
const bot = new Telegraf(token, { handlerTimeout: 10 })

bot.use(collector, logger, setStatus)

export default bot
