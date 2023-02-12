import bot from '../bot'
import { translate as t } from '../services/localeService'
import { PATHS } from '../types'
import { errorHandler, getTypedEnv } from '../utils/common'
import { URLWithToken } from '../auth'
import { putUser } from '../database/'
import { MenuButton } from 'telegraf/typings/core/types/typegram'
import { getReport } from '../api'

const webAppUrl = getTypedEnv<string>('WEB_APP_URL')
const commandErrorHanlder = errorHandler('Command handler exception.')

const createChatMenuButton = (id: number): MenuButton => ({
  type: 'web_app',
  text: t('MENU_BUTTON_TEXT'),
  web_app: {
    url: new URLWithToken({ id }, webAppUrl).toString(),
  },
})

const createSettingsURL = (id: number) =>
  new URLWithToken({ id }, PATHS.settings, webAppUrl).toString()

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
              url: createSettingsURL(id),
            },
          },
        ],
      ],
    },
  })

  await ctx.setChatMenuButton(createChatMenuButton(id))
})

bot.command('weeklyreport', async ctx => {
  const { id, language_code } = ctx.from
  try {
    await getReport(id, 'xlsx', language_code, {
      start: new Date().setMonth(new Date().getMonth() - 1),
    })
  } catch (error) {
    commandErrorHanlder(error, 'weeklyreport', { id })

    await ctx.reply(t('SORRY'))
  }
})

bot.command('monthlyreport', async ctx => {
  const { id, language_code } = ctx.from

  try {
    getReport(id, 'xlsx', language_code, {
      start: new Date().setDate(new Date().getDate() - 7),
    })
  } catch (error) {
    commandErrorHanlder(error, 'monthlyreport', { id })

    await ctx.reply(t('SORRY'))
  }
})

bot.command('reminder', ctx =>
  ctx.reply(t('OPEN_SETTINGS'), {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: t('OPEN_SETTINGS'),
            web_app: {
              url: createSettingsURL(ctx.from.id),
            },
          },
        ],
      ],
    },
  }),
)
