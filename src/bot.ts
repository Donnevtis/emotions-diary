import { Telegraf } from 'telegraf'
import logger from './middleware/logger'
import userHandler from './middleware/user-handler'
import collector from './middleware/stat-collector'
import { getTypedEnv } from './utils/common'
import replies, { MyContext } from './middleware/replies'
import updateMenuButton from './middleware/update-menu-button'

const bot = new Telegraf<MyContext>(getTypedEnv('BOT_TOKEN'), {
  handlerTimeout: 10,
})

bot.use(collector, logger, userHandler, replies, updateMenuButton)

export default bot
