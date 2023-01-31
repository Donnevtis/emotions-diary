import { Telegraf } from 'telegraf'
import dotenv from 'dotenv'
import { spinner } from './utils.js'
dotenv.config()

spinner.start()

const webHookUrl = String(process.env.WEBHOOK_URL)
const token = String(process.env.BOT_TOKEN)
const { telegram } = new Telegraf(token, { handlerTimeout: 10 })

const { url } = await telegram.getWebhookInfo()

if (url === webHookUrl) {
  spinner.info('Webhook already set')
  process.exit()
}

const answer = await telegram.setWebhook(webHookUrl)

if (!answer) throw Error('Webhook set error')

spinner.succeed('Webhook was set')
