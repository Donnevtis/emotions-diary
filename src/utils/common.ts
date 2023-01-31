export const stringify = (value: Parameters<JSON['stringify']>[0]) =>
  JSON.stringify(value, null, 2)

export const errorHandler =
  (typeException: string) => (error: unknown, method: string, data: object) => {
    if (error instanceof Error) {
      console.error(
        `${typeException}. ${method} error: `,
        stringify(error),
        'Data: ',
        stringify(data),
      )

      return null
    }

    throw error
  }
