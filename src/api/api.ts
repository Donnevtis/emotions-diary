import { errorHandler, getTypedEnv } from '../utils/common'
import fetch from 'node-fetch'

import { PATHS, Ranges } from '../types'

const apiErrorHandler = errorHandler('Api exception')

const createUrlWithId = (id: number, baseurl: string, path = '/') => {
  const url = new URL(path, baseurl)
  url.searchParams.append('user_id', String(id))

  return url
}

export const getReport = (
  user_id: number | undefined,
  type: 'xlsx' | 'pdf',
  lang = 'en',
  { start, end }: Ranges,
) => {
  if (!user_id) {
    throw new Error('User id not found')
  }

  const url = createUrlWithId(user_id, getTypedEnv('BOT_URL'), PATHS.report)
  url.searchParams.append('type', type)
  url.searchParams.append('lang', lang)
  start !== void 0 && url.searchParams.append('start', String(start))
  end !== void 0 && url.searchParams.append('end', String(end))

  return fetch(url, {
    method: 'GET',
  })
    .then(async res => {
      if (res.status !== 200) {
        throw new Error(`Status: ${res.status}, Body:${await res.text()}`)
      }
      return res.body
    })
    .catch(error =>
      apiErrorHandler(error, getReport.name, {
        type,
        lang,
        start,
        end,
        user_id,
      }),
    )
}
