import { Handler } from '@yandex-cloud/function-types'

export enum PATHS {
  settings = 'settings',
}

type HandlerParameters = Parameters<Handler.Http>

type RequestContext = {
  requestContext: {
    apiGateway?: {
      operationContext?: { web_data?: boolean }
    }
  }
}

type Return = {
  statusCode: number
  body: string
}

export type Handler = (
  event: HandlerParameters[0] & RequestContext,
  context: HandlerParameters[1],
) => Promise<Return>
