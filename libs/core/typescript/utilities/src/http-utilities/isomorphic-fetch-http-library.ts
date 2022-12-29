/* eslint-disable @typescript-eslint/no-explicit-any */
import { injectable } from "inversify";
import { AbstractHttpLibrary } from "./http-library";
import { RequestContext } from "./request-context";
import { ResponseContext } from "./response-context";

@injectable()
export class IsomorphicFetchHttpLibrary extends AbstractHttpLibrary {
  public send(request: RequestContext): Promise<ResponseContext> {
    const method = request.getHttpMethod().toString();
    const body = request.getBody();

    return fetch(request.getUrl(), {
      method: method,
      body: body as any,
      headers: request.getHeaders(),
      credentials: "same-origin",
    }).then((resp: any) => {
      const headers: { [name: string]: string } = {};
      resp.headers.forEach((value: string, name: string) => {
        headers[name] = value;
      });

      const body = {
        text: () => resp.text(),
        binary: () => resp.blob(),
      };
      return new ResponseContext(resp.status, headers, body);
    });
  }
}
