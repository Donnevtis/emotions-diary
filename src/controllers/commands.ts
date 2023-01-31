import bot from '../bot'
import { getEmotionsById, putUser } from '../database'
import { translate as t } from '../services/localeService'
import { PATHS } from '../types'
import { getId, getTypedEnv, isDev, stringify } from '../utils/common'

const webAppUrl = isDev
  ? getTypedEnv<string>('WEB_APP_URL_DEV')
  : getTypedEnv<string>('WEB_APP_URL')
const settingsUrl = new URL(PATHS.settings, webAppUrl).toString()

bot.start(async ctx => {
  putUser(ctx.from)

  ctx.reply(t('GREETING'), {
    reply_markup: {
      inline_keyboard: [[{ text: t('START'), web_app: { url: settingsUrl } }]],
    },
  })

  ctx.setChatMenuButton({
    type: 'web_app',
    text: t('MENU_BUTTON_TEXT'),
    web_app: { url: webAppUrl },
  })
})

bot.command('weeklyreport', async ctx => {
  const id = getId(ctx)
  const report = await getEmotionsById(id)

  ctx.reply(stringify(report))
})

bot.command('monthlyreport', async ctx => {
  const id = getId(ctx)
  const report = await getEmotionsById(id)

  ctx.reply(stringify(report))
})

bot.command('reminder', async ctx =>
  ctx.reply(t('OPEN_SETTINGS'), {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: t('START'),
            web_app: { url: settingsUrl },
          },
        ],
      ],
    },
  }),
)
