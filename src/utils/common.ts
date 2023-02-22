import { URLWithToken } from '../auth'
import { logger } from '../middleware/logger'
import { Env } from '../.env-types'
import localeService from '../services/locale'

export const errorHandler =
  (typeException: string) => (error: unknown, method: string, data: object) => {
    if (error instanceof Error) {
      logger.error(
        `${typeException}. ${method}: ${error.message}. Cause: ${
          error.cause
        }. Data: ${JSON.stringify(data)} `,
      )

      return null
    }

    throw error
  }

export const getTypedEnv = <T extends keyof Env>(envName: T): Env[T] => {
  const env = process.env[envName]

  if (env === void 0)
    throw new Error(`Environment variable '${envName}' not found`)

  if (env === 'true' || env === 'false') {
    return (env === 'true') as Env[T]
  }

  const numberEnv = Number(env)

  if (!isNaN(numberEnv)) {
    return numberEnv as unknown as Env[T]
  }

  return env as Env[T]
}

export const isDev = getTypedEnv('DEV')

export const createURL = (
  id: number | undefined,
  path = '/',
  searchParams?: Record<string, string | boolean | number>,
) => {
  if (!id) {
    throw new Error('ID undefined')
  }
  const url = new URLWithToken({ id }, path, getTypedEnv('WEB_APP_URL'))

  url.searchParams.set('lang', localeService.locale)

  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) =>
      url.searchParams.set(key, String(value)),
    )
  }

  return url.toString()
}
