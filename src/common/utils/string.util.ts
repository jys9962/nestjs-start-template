export class StringUtil {

  static camalize(str: string) {
    return str.split('_')
      .map(
        (
          t,
          i,
        ) => {
          if (i === 0) {
            return t
          }

          return (t[0] || '').toUpperCase() + t.slice(1)
        },
      )
      .join('')
  }
}
