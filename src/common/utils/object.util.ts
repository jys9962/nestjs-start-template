import { StringUtil } from '@/common/utils/string.util'

export class ObjectUtil {
  static toCamel(o): any {
    let newO, origKey, newKey, value
    if (o instanceof Array) {
      return o.map(value => {
        if (typeof value === 'object') {
          value = ObjectUtil.toCamel(value)
        }
        return value
      })
    } else {
      newO = {}
      for (origKey in o) {
        if (o.hasOwnProperty(origKey)) {
          // newKey = (origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey).toString()
          newKey = StringUtil.camelize(origKey)
          value = o[origKey]
          if (value instanceof Array || (value !== null && value.constructor === Object)) {
            value = ObjectUtil.toCamel(value)
          }
          newO[newKey] = value
        }
      }
    }
    return newO
  }

  static parseDotNotation(
    obj: object,
  ): object {
    const result = {}

    // For each object path (property key) in the object
    for (const objectPath in obj) {
      // Split path into component parts
      const parts = objectPath.split('.')

      // Create sub-objects along path as needed
      let target = result
      while (parts.length > 1) {
        const part = parts.shift()
        target = target[part] = target[part] || {}
      }

      // Set value at end of path
      target[parts[0]] = obj[objectPath]
    }

    return result
  }
}
