export const LOGGER_SYMBOL = Symbol.for("OS_LOGGER_SYMBOL");

/**
 * LogObject specifies the interface that optional structured objects
 * passed to logging functions must conform to. Additionally, if LogObject
 * is an instance of Error, its field will be expanded into the log message.
 */
export interface LogObject extends Object {
  /**
   * Optional Error instance to unwrap when formatting the log message.
   * See also LogObject for some particularities on how Error instances
   * are handled.
   */
  error?: Error;
}
