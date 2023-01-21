import { Context } from 'telegraf'

export default async (_: Context, next: () => Promise<void>) => {
  //send data to statistics table
  next()
}
