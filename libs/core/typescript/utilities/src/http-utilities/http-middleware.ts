import { injectable } from "inversify";
import { CustomUtilityClass } from "../common";
import { ConsoleLogger } from "../logging";
import { Tokens } from "../types";
import { RequestContext } from "./request-context";
import { ResponseContext } from "./response-context";

/**
 * Defines the contract for a middleware intercepting requests before
 * they are sent (but after the RequestContext was created)
 * and before the ResponseContext is unwrapped.
 *
 */
export interface IHttpMiddleware {
  /**
   * Modifies the request before the request is sent.
   *
   * @param context RequestContext of a request which is about to be sent to the server
   * @returns an observable of the updated request context
   *
   */
  pre(context: RequestContext): Promise<RequestContext>;
  /**
   * Modifies the returned response before it is deserialized.
   *
   * @param context ResponseContext of a sent request
   * @returns an observable of the modified response context
   */
  post(context: ResponseContext): Promise<ResponseContext>;
}

export abstract class AbstractHttpMiddleware
  extends CustomUtilityClass
  implements IHttpMiddleware
{
  public constructor() {
    super(Tokens.HTTP_MIDDLEWARE);
  }

  /**
   * Modifies the request before the request is sent.
   *
   * @param context RequestContext of a request which is about to be sent to the server
   * @returns an observable of the updated request context
   *
   */
  public abstract pre(context: RequestContext): Promise<RequestContext>;

  /**
   * Modifies the returned response before it is deserialized.
   *
   * @param context ResponseContext of a sent request
   * @returns an observable of the modified response context
   */
  public abstract post(context: ResponseContext): Promise<ResponseContext>;
}

/**
 * Defines the contract for a middleware intercepting requests before
 * they are sent (but after the RequestContext was created)
 * and before the ResponseContext is unwrapped.
 */
@injectable()
export class LoggingHttpMiddleware extends AbstractHttpMiddleware {
  /**
   * Modifies the request before the request is sent.
   *
   * @param context RequestContext of a request which is about to be sent to the server
   * @returns an observable of the updated request context
   *
   */
  public async pre(context: RequestContext): Promise<RequestContext> {
    await ConsoleLogger.debug(`Sending request to: ${context.getUrl()}`);

    return context;
  }

  /**
   * Modifies the returned response before it is deserialized.
   *
   * @param context ResponseContext of a sent request
   * @returns an observable of the modified response context
   */
  public async post(context: ResponseContext): Promise<ResponseContext> {
    await ConsoleLogger.debug(
      `Received response with status code: ${context.httpStatusCode}`
    );

    return context;
  }
}
