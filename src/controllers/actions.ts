import bot from '../bot'
import inlineKeyboard from '../messages/inline-keyboard'
import { CALLBACK_DATA } from '../types'
import localeService, { t } from '../services/locale'
import { updateLanguageSettings } from '../database'
import { deunionize } from 'telegraf'

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

bot.action(CALLBACK_DATA.backMenu, async ctx => {
  await ctx.editMessageText(t('MENU'))
  await ctx.editMessageReplyMarkup(inlineKeyboard.openMenu(ctx.from?.id))
})

bot.action(CALLBACK_DATA.settings, async ctx => {
  await ctx.editMessageText(t('LANG_SETTINGS_HINT'))
  await ctx.editMessageReplyMarkup(inlineKeyboard.settings())
})

bot.action(RegExp(`${CALLBACK_DATA.en}|${CALLBACK_DATA.ru}`), async ctx => {
  const { data } = deunionize(ctx.callbackQuery)
  if (data && ctx.from?.id) {
    localeService.locale = data

    await updateLanguageSettings(ctx.from?.id, localeService.locale)
    await ctx.editMessageText(t('SETTINGS_SAVED'))
    await ctx.editMessageReplyMarkup(inlineKeyboard.done())
    await ctx.updateChatMenuButton()
  } else {
    await ctx.replyTrouble()
  }
})
