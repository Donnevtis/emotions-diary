declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvDict {}
  }
}

type EnvDict = {
  [key in keyof Env]: string
}

export type Env = {
  DEV: boolean
  OAUTH_TOKEN: string
  FUNCTION_ID: string
  BOT_TOKEN: string
  BOT_TOKEN_DEV: string
  BOT_URL: string
  SA_ID: string
  LOCKBOX_ID: string
  LOCKBOX_VERSION: string
  WEB_APP_URL: string
  JWT_KEY: string
}
