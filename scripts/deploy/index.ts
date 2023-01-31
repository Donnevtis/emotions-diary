import { Session, cloudApi, serviceClients } from '@yandex-cloud/nodejs-sdk'
import getZipBuffer from './contentBuffer.js'
import dotenv from 'dotenv'
import dotenvParseVariables from 'dotenv-parse-variables'
import { spinner, MiBtoByte } from '../utils.js'
import { Env } from '../../.env-types.js'

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { DEV, FUNCTION_ID, OAUTH_TOKEN, WEBHOOK_URL, ...envs } = environment

spinner.start()

try {
  const { content, pointer } = await getZipBuffer('./dist')
  spinner.succeed(`Zip buffer size ${pointer}Byte`)

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
      environment: { DEV: 'false', ...envs },
    }),
  )

  spinner.succeed(`${description} id: '${id}' at ${createdAt}`)
} catch (error) {
  spinner.fail(error)
  console.log('Create version error', error)
}
