import { MyContext } from './replies'
import { PromiseNoop } from './types'

export default async (ctx: MyContext, next: PromiseNoop) => {
  await next()
  await ctx.updateChatMenuButton()
}
