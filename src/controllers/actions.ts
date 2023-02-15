import bot from '../bot'
import inlineKeyboard from '../messages/inline-keyboard'
import { CALLBACK_DATA } from '../types'
import { t } from '../services/locale'

bot.action(CALLBACK_DATA.openMenu, ctx =>
  ctx.reply(t('MENU'), {
    reply_markup: {
      ...inlineKeyboard.openMenu(ctx.from?.id),
    },
  }),
)

bot.action(CALLBACK_DATA.closeMenu, ctx =>
  ctx.deleteMessage(ctx.callbackQuery.message?.message_id),
)

bot.action(CALLBACK_DATA.report, ctx =>
  ctx.editMessageReplyMarkup(inlineKeyboard.report()),
)

bot.action(CALLBACK_DATA.weekReport, ctx => ctx.sendReportWeek())

bot.action(CALLBACK_DATA.monthReport, ctx => ctx.sendReportMonth())

bot.action(CALLBACK_DATA.backMenu, ctx =>
  ctx.editMessageReplyMarkup(inlineKeyboard.openMenu(ctx.from?.id)),
)
