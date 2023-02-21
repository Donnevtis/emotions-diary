import bot from '../bot'
import inlineKeyboard from '../messages/inline-keyboard'
import { t } from '../services/locale'

bot.on('message', ctx =>
  ctx.reply(t('MISS'), {
    reply_markup: {
      ...inlineKeyboard.openMenu(ctx.from?.id),
    },
  }),
)
