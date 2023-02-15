interface ProcessEnv {
  [key: keyof NodeJS.ProcessEnv]: any
}

export interface Env extends ProcessEnv {
  DEV: boolean
  OAUTH_TOKEN: string
  FUNCTION_ID: string
  BOT_TOKEN: string
  BOT_URL: string
  SA_ID: string
  LOCKBOX_ID: string
  LOCKBOX_VERSION: string
  WEB_APP_URL: string
}
