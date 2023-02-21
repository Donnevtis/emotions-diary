import { Session, cloudApi, serviceClients } from '@yandex-cloud/nodejs-sdk'
import { isDev } from '../utils/common'

const {
  lockbox: {
    payload_service: { GetPayloadRequest },
  },
} = cloudApi

const config = isDev ? { oauthToken: String(process.env.OAUTH_TOKEN) } : void 0

const session = new Session(config)

const cloudService = session.client(serviceClients.PayloadServiceClient)

export default async () => {
  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    return
  }

  const {
    entries: [{ textValue: ACCESS_KEY_ID }, { textValue: SECRET_ACCESS_KEY }],
  } = await cloudService.get(
    GetPayloadRequest.fromPartial({ secretId: process.env.SECRET_ID }),
  )

  if (!ACCESS_KEY_ID || !SECRET_ACCESS_KEY) {
    throw new Error('secrets required')
  }

  process.env.AWS_ACCESS_KEY_ID = ACCESS_KEY_ID
  process.env.AWS_SECRET_ACCESS_KEY = SECRET_ACCESS_KEY
}
