import { ProcessingError } from "../errors";
import { MIDDLEWARE_STACK_SYMBOL, MaybePromise } from "../types";
import { BaseUtilityClass } from "./base-utility-class";
import { isFunction, isMiddleware } from "./type-checks";

/**
 * A middleware function invoked by the dispatcher
 */
export type MiddlewareFunction<TRequest = any, TResponse = any> = (
  request: TRequest,
  next: (request: TRequest) => MaybePromise<TResponse>
) => MaybePromise<TResponse>;

/**
 * A middleware function invoked by the dispatcher
 */
export interface IMiddleware<TRequest = any, TResponse = any> {
  handle: (
    request: TRequest,
    next: (request: TRequest) => MaybePromise<TResponse>
  ) => MaybePromise<TResponse>;
}

export type Middleware<TRequest = any, TResponse = any> =
  | MiddlewareFunction<TRequest, TResponse>
  | IMiddleware<TRequest, TResponse>;

/**
 * A middleware container and invoker
 */
export abstract class MiddlewareStack<
  TRequest = any,
  TResponse = any
> extends BaseUtilityClass {
  private middlewares: MiddlewareFunction[] = [];
  private _isActionAdded = false;

  constructor() {
    super(MIDDLEWARE_STACK_SYMBOL);
  }

  public use(middleware: Middleware<TRequest, TResponse>) {
    if (!isFunction(middleware) && !isMiddleware(middleware)) {
      throw new ProcessingError(
        "Could not add middleware to stack. It will not be invoked"
      );
    }

    this.middlewares.push(
      isFunction(middleware) ? middleware : middleware.handle
    );
  }

  public async run<TResult = TResponse>(request: TRequest): Promise<TResult> {
    let index = 0;

    if (!this._isActionAdded) {
      this._isActionAdded = true;
      this.use(this.terminate);
    }

    const next = async (req: TRequest) => {
      if (index < this.middlewares.length) {
        return await Promise.resolve(this.middlewares[index++](req, next));
      }
    };

    return await Promise.resolve(next(request));
  }

  protected abstract terminate(req: TRequest): MaybePromise<any>;
}
