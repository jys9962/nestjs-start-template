import { ConsoleLogger, Injectable } from '@nestjs/common'
import { LoggerInterface } from '../logger.interface'
import { env } from "@/config/env";

@Injectable()
export class LoggerService extends ConsoleLogger implements LoggerInterface {

  debug(...messages: any[]) {
    if (!env.isDev) {
      return
    }
    const message = messages
      .map(this.convertString)
      .reduce(
        (
          acc,
          t,
        ) => `${acc} ${t}`,
        '',
      )
    super.debug(message)
  }

  verbose(...messages: any[]) {
    const message = messages
      .map(this.convertString)
      .reduce(
        (
          acc,
          t,
        ) => `${acc} ${t}`,
        '',
      )
    super.verbose(message)
  }

  log(...messages: any[]) {
    const message = messages
      .map(this.convertString)
      .reduce(
        (
          acc,
          t,
        ) => `${acc} ${t}`,
        '',
      )
    super.log(message)
  }

  warn(...messages: any[]) {
    const message = messages
      .map(this.convertString)
      .reduce(
        (
          acc,
          t,
        ) => `${acc} ${t}`,
        '',
      )
    super.warn(message)
  }

  error(...messages: any[]) {
    const message = messages
      .map(this.convertString)
      .reduce(
        (
          acc,
          t,
        ) => `${acc} ${t}`,
        '',
      )
    super.error(message)
  }

  private convertString(message: any): string {
    if (typeof message === 'string') {
      return message
    }
    if (typeof message === 'number') {
      return `${message}`
    }
    if (typeof message === 'object') {
      return JSON.stringify(message, null, 2)
    }
    return message.toString()
  }
}
