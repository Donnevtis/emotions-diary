import { Context } from 'telegraf'
import { t } from '../services/locale'

export async function replyTrouble(this: Context, message = t('SORRY')) {
  await this.reply(message)
}
