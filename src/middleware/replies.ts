import { Context } from 'telegraf'
import { PromiseNoop } from './types'
import * as replies from '../replies'

type Replies = typeof replies

export type MyContext = {
  [K in keyof typeof replies]: Replies[K]
} & Context

export default async (ctx: MyContext, next: PromiseNoop) => {
  Object.assign(ctx, replies)
  await next()
}
