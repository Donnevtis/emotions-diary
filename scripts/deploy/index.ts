import { Session, cloudApi, serviceClients } from '@yandex-cloud/nodejs-sdk'
import getZipBuffer from './contentBuffer.js'
import dotenv from 'dotenv'
import dotenvParseVariables from 'dotenv-parse-variables'
import { spinner, MiBtoByte } from '../utils.js'
import { Env } from '../../.env-types.js'

spinner.start()

const { error: envError, parsed } = dotenv.config({})

if (envError || !parsed) throw envError

const environment = dotenvParseVariables(parsed) as Env

const {
  serverless: {
    functions_function_service: { CreateFunctionVersionRequest },
  },
} = cloudApi

const session = new Session({ oauthToken: String(process.env.OAUTH_TOKEN) })

const cloudService = session.client(serviceClients.FunctionServiceClient)

const {
  WEB_APP_URL,
  FUNCTION_ID,
  SA_ID,
  DB_ENDPOINT,
  BOT_TOKEN,
  REGION,
  LOCKBOX_ID,
  LOCKBOX_VERSION,
} = environment

try {
  const { content, pointer } = await getZipBuffer('./dist')

  spinner.succeed(`Zip buffer size ${pointer}Byte`)
  spinner.start()

  const { id, description, createdAt } = await cloudService.createVersion(
    CreateFunctionVersionRequest.fromPartial({
      functionId: FUNCTION_ID,
      content,
      runtime: 'nodejs16',
      entrypoint: 'index.handler',
      resources: {
        memory: MiBtoByte(128),
      },
      executionTimeout: { seconds: 60 },
      environment: {
        DEV: 'false',
        WEB_APP_URL,
        DB_ENDPOINT,
        BOT_TOKEN,
        REGION,
      },
      serviceAccountId: SA_ID,
      secrets: [
        {
          id: LOCKBOX_ID,
          versionId: LOCKBOX_VERSION,
          environmentVariable: 'AWS_ACCESS_KEY_ID',
          key: 'SA_KEY_ID',
        },
        {
          id: LOCKBOX_ID,
          versionId: LOCKBOX_VERSION,
          environmentVariable: 'AWS_SECRET_ACCESS_KEY',
          key: 'SA_KEY_SECRET',
        },
      ],
    }),
  )

  spinner.succeed(`${description} id: '${id}' at ${createdAt}`)
} catch (error) {
  spinner.fail(error)
  console.log('Create version error', error)
}
