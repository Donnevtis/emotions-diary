import { Context } from 'telegraf'
import { getReport } from '../api'
import { errorHandler } from '../utils/common'
import { t } from '../services/locale'

const replyErrorHandler = errorHandler('Report reply exception.')

export async function sendReportWeek(this: Context) {
  const id = this.from?.id
  const language_code = this.from?.language_code

  try {
    getReport(id, 'xlsx', language_code, {
      start: new Date().setDate(new Date().getDate() - 7),
    })
  } catch (error) {
    replyErrorHandler(error, 'monthlyreport', { id })

    await this.reply(t('SORRY'))
  }
}

export async function sendReportMonth(this: Context) {
  const id = this.from?.id
  const language_code = this.from?.language_code

  try {
    getReport(id, 'xlsx', language_code, {
      start: new Date().setDate(new Date().getMonth() - 1),
    })
  } catch (error) {
    replyErrorHandler(error, 'monthlyreport', { id })

    await this.reply(t('SORRY'))
  }
}
