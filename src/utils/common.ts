import { logger } from '../middleware/logger'

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

export const getTypedEnv = <T extends string | number | boolean>(
  envName: string,
): T => {
  const env = process.env[envName]

  if (env === void 0)
    throw new Error(`Environment variable '${envName}' not found`)

  const lowCaseEnv = env.toLowerCase()
  if (lowCaseEnv === 'true' || lowCaseEnv === 'false') {
    return (lowCaseEnv === 'true') as T
  }

  const numberEnv = Number(env)

  if (env.length && !isNaN(numberEnv)) {
    return numberEnv as T
  }

  return env as T
}

export const isDev = <boolean>getTypedEnv('DEV')
