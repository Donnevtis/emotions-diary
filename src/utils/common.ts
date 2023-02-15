import { URLWithToken } from '../auth'
import { logger } from '../middleware/logger'
import { Env } from '../.env-types'

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
    return env === 'true'
  }

  const numberEnv = Number(env)

  if (env.length && !isNaN(numberEnv)) {
    return numberEnv
  }

  return env
}

export const isDev = getTypedEnv('DEV')

export const createURL = (id: number | undefined, path = '/') => {
  if (!id) {
    throw new Error('ID undefined')
  }

  return new URLWithToken({ id }, path, getTypedEnv('WEB_APP_URL')).toString()
}
