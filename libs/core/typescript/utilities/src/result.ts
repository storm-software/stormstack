/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomUtilityClass } from "./custom-utility-class";
import { DateTime } from "./date-time";
import { isError, isObject } from "./type-check";

/**
 * An object to contain generic data describing the result of a FXL or external process
 */
export class Result<TError extends IError | null = any, TData = unknown>
  extends CustomUtilityClass
  implements IResult<TError, TData>
{
  /**
   * A factory method to create a result object using the the supplied parameters
   * @param param0 - Fields describing the result's event
   * @returns A populated result object
   */
  public static create = <
    TError extends IError | null = null,
    TData = unknown
  >({
    source = ResultSourceTypes.UNKNOWN,
    data,
    error,
  }: Partial<IResult<TError, TData>>): Result<TError, TData> => {
    const result = new Result(error, data);

    result.source = source;
    result.data = data as TData;
    result.error = error as TError;

    return result as Result<TError, TData>;
  };

  /**
   * Create a successful result object
   * @returns A successful result object
   */
  public static success = <TData = unknown>(
    data?: TData
  ): Result<null, TData> => {
    return Result.create<null, TData>({ error: null, data });
  };

  /**
   * Create an error result object
   * @param params - Parameters used to generate the error result object
   * @returns An error result object created with the specified parameters
   */
  public static error = <TError extends IError = IError>(
    params?: string | Partial<IResult<TError>> | IError | Result<TError>
  ): Result<TError> => {
    if (Result.isErrorResult(params)) {
      // Params is already a Result, do nothing
      return params;
    }

    let error!: TError;
    if (typeof params === "string") {
      error = new Error(params) as unknown as TError;
    } else if (Result.isJSError(params)) {
      error = params as TError;
    } else if (Result.isJSError(params?.error)) {
      error = params?.error as TError;
    } else if ((params as IResult)?.source) {
      error = new Error(
        ResultSourceTypes[(params as IResult)?.source]
      ) as unknown as TError;
    }

    const source = (params as IResult)?.source ?? ResultSourceTypes.UNKNOWN;
    if (!error?.message) {
      error = new Error(ResultSourceTypes[source]) as unknown as TError;
    }

    return Result.create<TError>({
      ...(isObject(params) ? params : {}),
      source,
      error,
    });
  };

  /**
   * Create a successful result object
   * @returns A successful result object
   */
  public static abort = (): Result<AbortError> => {
    const error: AbortError = new Error("aborted") as AbortError;
    error.name = "abort";

    return Result.error<AbortError>({
      source: ResultSourceTypes.ABORTED,
      error,
    });
  };

  /**
   * Type check function to determine if the parameter is a Result object
   * @param obj - The object to check the type
   * @returns An indicator specifying if the object is a result
   */
  public static isResult = (obj: unknown): obj is Result => {
    try {
      return (obj as Result)?._symbol === Tokens.RESULT_SYMBOL;
    } catch (e) {
      return false;
    }
  };

  /**
   * Determine if the passed in object is an instance of the built-in JS `Error` type
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/Error
   *
   * **NOTE: This does not actually verify `obj` is an instance of the `Result` class.**
   * @param obj - The object to check for errors
   * @returns A boolean indicator specifying if the result object represents an error
   */
  public static isJSError = (obj?: unknown): obj is IError =>
    !!obj && isError(obj);

  /**
   * Determine if the passed in object is a error type `Result` and/or extends the `Error` interface
   *
   * Both `Result` objects marked as errors and `Error` objects (util.types.isNativeError type check) will return true
   *
   * @see https://nodejs.org/api/util.html#utiltypesisnativeerrorvalue
   *
   * **NOTE: This does not actually verify `obj` is an instance of the `Result` class.**
   * @param obj - The object to check for errors
   * @returns A boolean indicator specifying if the result object represents an error
   */
  public static isError = (obj?: unknown): boolean => {
    try {
      return (
        !!obj &&
        ((Result.isResult(obj) && obj.isError && obj.isError()) ||
          Result.isJSError(obj))
      );
    } catch (e) {
      return false;
    }
  };

  /**
   * Determine if the passed in object is the result of a successful process
   *
   * **NOTE: This does not actually verify `obj` is an instance of the `Result` class.**
   * @param obj - The object to check for errors
   * @returns A boolean indicator specifying if `obj` is **NOT** an error
   */
  public static isSuccess(obj?: Result): boolean {
    return !Result.isError(obj);
  }

  /**
   * Determine if the passed in object is both a `Result` object (Result.isResult) and marked as an error (Result.isError)
   *
   * **NOTE: Unlike `Result.isError`, this will return false if `obj` is an `Error` object but not an instance of `Result`**
   * @param obj - The object to check for type and errors
   * @returns A boolean indicator specifying if the `obj` represents an error and has the `Result` type
   */
  public static isErrorResult = <TError extends IError | undefined = IError>(
    obj?: unknown
  ): obj is Result<TError> => {
    return Result.isResult(obj) && Result.isError(obj);
  };

  /**
   * Determine if the passed in object is both a `Result` object (Result.isResult) and marked as successful (Result.isSuccess)
   *
   * **NOTE: Unlike `Result.isSuccess`, this will return false if `obj` is not an `Error` object but not an instance of `Result`**
   * @param obj - The object to check for type and errors
   * @returns A boolean indicator specifying if the `obj` represents an error and has the `Result` type
   */
  public static isSuccessResult = <TError extends IError | undefined = IError>(
    obj?: unknown
  ): obj is Result<TError> => {
    return Result.isResult(obj) && Result.isSuccess(obj);
  };

  /**
   * Determine if the passed in object is both a `Result` object (Result.isResult) and marked as an error (Result.isError)
   *
   * **NOTE: Unlike `Result.isError`, this will return false if `obj` is an `Error` object but not an instance of `Result`**
   * @param obj - The object to check for type and errors
   * @returns A boolean indicator specifying if the `obj` represents an error and has the `Result` type
   */
  public static isAbortResult = (obj?: unknown): obj is Result<IError> => {
    return (
      Result.isErrorResult(obj) && obj.source === ResultSourceTypes.ABORTED
    );
  };

  /**
   * Can the application reset the state automatically through the error boundary when the error occurs
   *
   * @defaultValue true
   */
  public isResettable = true;

  /**
   * The source of the result - this field allows us to identify where an error originated
   *
   * @example An error occurs during server processing, so ResultSourceTypes.SERVER is returned
   * @defaultValue ResultSourceTypes.UNKNOWN
   */
  public source: ResultSourceTypes = ResultSourceTypes.UNKNOWN;

  /**
   * Any data returned from the process/function
   */
  public data?: TData;

  /**
   * The error associated with this result
   */
  public error?: TError;

  /**
   * The date-time the result occurred
   */
  public timestamp: DateTime = DateTime.current;

  protected constructor(error?: TError | null, data?: TData | null) {
    super(Tokens.RESULT_SYMBOL);

    this.error = error;
    this.data = data;
  }

  /**
   * Returns a string representation of the result object
   * @returns A string representation of the result object
   */
  public override toString(): string {
    try {
      return this.error?.name
        ? `${this.error.name}: ${
            this.error.message ? this.error.message : "Error"
          }`
        : JSON.stringify(this.data);
    } catch (e) {
      return "";
    }
  }

  /**
   * Determine if the `Result` object is the result of a failed process
   * @returns A boolean indicator specifying if the `Result` object represents an error
   */
  public isError = (): boolean => {
    return !!this.error?.name;
  };

  /**
   * Determine if the `Result` object is the result of a successful process
   * @returns A boolean indicator specifying if the `Result` object represents an successful
   */
  public isSuccess = (): boolean => {
    return !this.isError();
  };

  /**
   * Determine if the `Result` object is the result of a successful process
   * @returns A boolean indicator specifying if the `Result` object represents an successful
   */
  public isEqual = (result?: unknown): boolean => {
    try {
      return (
        result &&
        Result.isResult(result) &&
        this.error?.name === result?.error?.name &&
        this.error?.message === result?.error?.message &&
        this.source === result.source
      );
    } catch (e) {
      return false;
    }
  };
}
