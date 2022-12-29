/* eslint-disable @typescript-eslint/no-explicit-any */
import { injectable } from "inversify";
import { AbstractHttpLibrary } from "./http-library";
import { RequestContext } from "./request-context";
import { ResponseContext } from "./response-context";

@injectable()
export class IsomorphicFetchHttpLibrary extends AbstractHttpLibrary {
  public async send(request: RequestContext): Promise<ResponseContext> {
    const resp = await fetch(request.getUrl(), {
      method: request.getHttpMethod().toString(),
      body: request.getBody() as any,
      headers: request.getHeaders(),
      credentials: "same-origin",
    });

    const headers: { [name: string]: string } = {};
    resp.headers.forEach((value: string, name: string) => {
      headers[name] = value;
    });

    const body = {
      text: () => resp.text(),
      binary: () => resp.blob(),
    };

    return new ResponseContext(resp.status, headers, body);
  }
}
