export class DateUtil {
  static SECOND = 1000
  static MINUTE = 60 * 1000
  static HOUR = 60 * 60 * 1000
  static DAY = 24 * 60 * 60 * 1000

  static format(date: Date) {
    if (date == null) {
      return ''
    }
    const year = date.getFullYear()
    const month = `${date.getMonth() + 1}`.padStart(2, '0')
    const day = `${date.getDate()}`.padStart(2, '0')

    const hour = `${date.getHours()}`.padStart(2, '0')
    const minutes = `${date.getMinutes()}`.padStart(2, '0')
    const second = `${date.getSeconds()}`.padStart(2, '0')

    return `${year}-${month}-${day} ${hour}:${minutes}:${second}`
  }

  static yymmdd(date: Date = null): string {
    date = date || new Date()

    const year = `${date.getFullYear()}`.slice(2)
    const month = `${date.getMonth() + 1}`.padStart(2, '0')
    const day = `${date.getDate()}`.padStart(2, '0')
    return `${year}${month}${day}`
  }

  static today(): Date {
    const date = new Date()
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)
    return date
  }

  static afterDay(day: number): Date {
    const date = this.today()
    date.setDate(date.getDate() + day)
    return date
  }

  static milli() {
    const [, nano] = process.hrtime()
    return Math.floor((nano / 1000000) % 1000)
  }

  static micro() {
    const [, nano] = process.hrtime()
    return Math.floor((nano / 1000) % 1000)
  }

  static nano() {
    const [, nano] = process.hrtime()
    return Math.floor(nano % 1000)
  }

  static isBetween(
    startDate: Date,
    endDate: Date,
  ) {
    const current = +new Date()
    return current >= +startDate
      && current <= +endDate
  }

  static isAfter(date: Date) {
    const current = +new Date()
    return current > +date
  }
}