import { Context } from 'telegraf'
import { getReport } from '../api'
import { errorHandler } from '../utils/common'
import localeService, { t } from '../services/locale'

const replyErrorHandler = errorHandler('Report reply exception.')

export async function sendReportWeek(this: Context) {
  const id = this.from?.id

  try {
    getReport(id, 'xlsx', localeService.locale, {
      start: new Date().setDate(new Date().getDate() - 7),
    })
  } catch (error) {
    replyErrorHandler(error, 'monthlyreport', { id })

    await this.reply(t('SORRY'))
  }
}

export async function sendReportMonth(this: Context) {
  const id = this.from?.id

  try {
    getReport(id, 'xlsx', localeService.locale, {
      start: new Date().setDate(new Date().getMonth() - 1),
    })
  } catch (error) {
    replyErrorHandler(error, 'monthlyreport', { id })

    await this.reply(t('SORRY'))
  }
}
