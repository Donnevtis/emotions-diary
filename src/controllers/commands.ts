import bot from '../bot'
import { putUser } from '../database'

bot.start(({ from }) => {
  putUser(from)
})
