export interface LoggerInterface {
  /**
   * Level.0 로컬 개발용
   * @param message
   */
  debug(message: any);

  /**
   * Level.1 시스템 로그
   * @param message
   */
  verbose(message: any);

  /**
   * Level.2 디버깅용 - normal
   * @param message
   */
  log(message: any);

  /**
   * Level.3 디버깅용 - warn
   * @param message
   */
  warn(message: any);

  /**
   * Level.4 즉시 처리할 오류
   * @param message
   */
  error(message: any);
}

export const LOGGER_INTERFACE = Symbol('LoggerInterface')
