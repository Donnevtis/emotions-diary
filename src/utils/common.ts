export const stringify = (value: Parameters<JSON['stringify']>[0]) =>
  JSON.stringify(value, null, 2)
