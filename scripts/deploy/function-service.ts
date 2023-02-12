import { Session, cloudApi, serviceClients } from '@yandex-cloud/nodejs-sdk'
import getZipBuffer from './contentBuffer.js'
import { spinner } from '../utils.js'
import { FunctionConfig } from './types.js'

export const deploy = async (config: FunctionConfig, sourcePath: string) => {
  spinner.start()

  const {
    serverless: {
      functions_function_service: { CreateFunctionVersionRequest },
    },
  } = cloudApi
  const session = new Session({ oauthToken: String(process.env.OAUTH_TOKEN) })
  const cloudService = session.client(serviceClients.FunctionServiceClient)

  try {
    const { content, pointer } = await getZipBuffer(sourcePath)

    spinner.succeed(`Zip buffer size ${pointer}Byte`)
    spinner.start()

    const { id, description, createdAt } = await cloudService.createVersion(
      CreateFunctionVersionRequest.fromPartial({ ...config, content }),
    )

    spinner.succeed(`${description} id: '${id}' at ${createdAt}`)
  } catch (error) {
    spinner.fail(error)
    console.log('Create version error', error)
  }
}
