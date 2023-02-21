import { Context } from 'telegraf'
import { PromiseNoop } from './types'

export default async (_: Context, next: PromiseNoop) => {
  //send data to statistics table
  next()
}
