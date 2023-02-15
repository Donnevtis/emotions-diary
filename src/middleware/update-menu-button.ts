import { MyContext } from './replies'
import { PromiseNoop } from './types'

export default async (ctx: MyContext, next: PromiseNoop) => {
  await ctx.updateChatMenuButton()
  await next()
}
