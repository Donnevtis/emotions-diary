import TelegramBot from 'node-telegram-bot-api'

const polling = process.env.MODE === 'development'
const token = String(process.env.BOT_TOKEN)
const bot = new TelegramBot(token, { polling })

bot.on('message', msg => {
  bot.sendMessage(msg.chat.id, msg.text || 'hi')
})
