import { GraphQLClient } from "@stormstack/adapters-client-graphql";
import {
  GraphQLResponse,
  Observable,
  RequestParameters,
  Variables
} from "relay-runtime";

export class RelayGraphQLClient extends GraphQLClient {
  public relayFetch = (url: string | URL) => {
    return (
      request: RequestParameters,
      variables: Variables
    ): Observable<GraphQLResponse> => {
      if (!request.text) throw new Error("Missing document.");

      return Observable.create<GraphQLResponse>(sink =>
        this.observable(request, { url, headers: this.headersProxy }, sink)
      );
    };
  };
}
