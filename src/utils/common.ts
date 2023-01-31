import { Context } from 'telegraf'

export const stringify = (value: Parameters<JSON['stringify']>[0]) =>
  JSON.stringify(value, null, 2)

export const errorHandler =
  (typeException: string) => (error: unknown, method: string, data: object) => {
    if (error instanceof Error) {
      console.error(
        `${typeException}. ${method} error: `,
        stringify(error),
        'Data: ',
        stringify(data),
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

export const getId = (ctx: Context) => {
  const id = ctx.from?.id

  if (id === void 0) {
    throw new Error(`User ID not found. Update id: ${ctx.update.update_id}`)
  }

  return id
}
