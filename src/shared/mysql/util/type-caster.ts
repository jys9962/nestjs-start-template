import * as json_bigint from 'json-bigint'

const JSONbigString = json_bigint({ storeAsString: true })

const isBoolean = (field) => {
  return field.length === 1
    && ['is_', 'has_', 'use_', 'can_'].some(t => field.name.startsWith(t))
}

const isNumber = (field) => {
  return ['LONGLONG', 'LONG', 'TINY'].includes(field.type)
}

export const customTypeCast = function castField(
  field,
  useDefaultTypeCasting,
) {
  if (field.type === 'JSON') {
    const buffer = field.buffer()
    if (!buffer) {
      return null
    }
    const string = buffer.toString()
    return JSONbigString.parse(string)
  }

  if (isBoolean(field)) {
    return field.string() === '1'
  }

  if (isNumber(field)) {
    const result = field.string()
    if (result == null) {
      return null
    }

    return result.length <= 10
      ? Number(result)
      : result
  }

  return useDefaultTypeCasting()
}