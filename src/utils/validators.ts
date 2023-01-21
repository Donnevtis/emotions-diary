import Ajv from 'ajv'

const ajv = new Ajv()

const userSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    is_bot: { type: 'boolean' },
    first_name: { type: 'string' },
    last_name: { type: 'string' },
    username: { type: 'string' },
    language_code: { type: 'string' },
  },
  required: ['id'],
  additionalProperties: true,
}

export const validateUser = ajv.compile(userSchema)
