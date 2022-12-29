/* eslint-disable @typescript-eslint/no-explicit-any */

import { CustomUtilityClass } from "../common";
import { Tokens } from "../types";
import { RequestContext } from "./request-context";
import { ResponseContext } from "./response-context";

export interface IHttpLibrary {
  send(request: RequestContext): Promise<ResponseContext>;
}

export abstract class AbstractHttpLibrary
  extends CustomUtilityClass
  implements IHttpLibrary
{
  public constructor() {
    super(Tokens.HTTP_LIBRARY);
  }

  public abstract send(request: RequestContext): Promise<ResponseContext>;
}
