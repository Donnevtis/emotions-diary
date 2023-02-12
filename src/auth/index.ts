import { getTypedEnv } from '../utils/common'
import jwt from 'jsonwebtoken'

export const getToken = (data: object) =>
  jwt.sign(data, getTypedEnv<string>('JWT_KEY'))

export const createBearer = (id: number) => `Bearer ${getToken({ id })}`

export class URLWithToken extends URL {
  constructor(data: object, url: string | URL, base?: string | URL) {
    super(url, base)
    this.searchParams.append('token', getToken(data))
  }
}
