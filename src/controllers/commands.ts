import bot from '../bot'
import { t } from '../services/locale'
import { createURL } from '../utils/common'
import { putUser } from '../database/'
import { PATHS } from '../types'
import inlineKeyboard from '../messages/inline-keyboard'

bot.start(async ctx => {
  const id = ctx.from.id

  await putUser(ctx.from)

  await ctx.reply(t('GREETING'), {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: t('START'),
            web_app: {
              url: createURL(id, undefined, { start: true }),
            },
          },
        ],
      ],
    },
    parse_mode: 'HTML',
  })
})

bot.command('weeklyreport', ctx => ctx.sendReportWeek())

bot.command('monthlyreport', ctx => ctx.sendReportMonth())

bot.command('reminder', async ctx =>
  ctx.reply(t('REMINDERS_SETTINGS'), {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: t('OPEN'),
            web_app: {
              url: createURL(ctx.from.id, PATHS.settings),
            },
          },
        ],
      ],
    },
  }),
)

bot.command('menu', ctx =>
  ctx.reply(t('MENU'), {
    reply_markup: {
      ...inlineKeyboard.openMenu(ctx.from?.id),
    },
  }),
)
