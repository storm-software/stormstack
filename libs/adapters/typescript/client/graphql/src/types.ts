import {
  MutationRequestOptions,
  QueryRequestOptions,
  RequestOptions,
  SubscriptionRequestOptions,
  SubscriptionToRequestOptions
} from "@stormstack/core-client-api";
import { GraphQLResponse, OperationType, VariablesOf } from "relay-runtime";
import { ConcreteRequest } from "relay-runtime/lib/util/RelayConcreteNode";

export interface SerializablePreloadedQuery<
  TRequest extends ConcreteRequest,
  TQuery extends OperationType
> {
  params: TRequest["params"];
  variables: VariablesOf<TQuery>;
  response: GraphQLResponse;
}

export type GraphQLRequestOptions<
  TInput extends Record<string, any> = Record<string, any>
> = Omit<RequestOptions<TInput>, "method"> & {
  operationName: string;

  operationKind: string;
};

export type GraphQLQueryRequestOptions<
  TInput extends Record<string, any> = Record<string, any>
> = Omit<QueryRequestOptions<TInput>, "method"> & GraphQLRequestOptions<TInput>;

export type GraphQLMutationRequestOptions<
  TInput extends Record<string, any> = Record<string, any>
> = Omit<MutationRequestOptions<TInput>, "method"> &
  GraphQLRequestOptions<TInput>;

export type GraphQLSubscriptionRequestOptions<
  TInput extends Record<string, any> = Record<string, any>
> = Omit<SubscriptionRequestOptions<TInput>, "method"> &
  GraphQLRequestOptions<TInput>;

export type GraphQLSubscriptionToRequestOptions<
  TInput extends Record<string, any> = Record<string, any>
> = Omit<SubscriptionToRequestOptions<TInput>, "method"> &
  GraphQLRequestOptions<TInput>;

export interface IVariables {
  readonly [key: string]: { get(): unknown };
}

/**
 * A Sink is an object of methods provided by Observable during construction.
 * The methods are to be called to trigger each event. It also contains a closed
 * field to see if the resulting subscription has closed.
 */
export interface Sink<T = any> {
  next(value: T): void;
  error(error: Error, isUncaughtThrownError?: boolean): void;
  complete(): void;
  readonly closed: boolean;
}

/**
 * Contains the parameters required for executing a GraphQL request.
 * The operation can either be provided as a persisted `id` or `text`. If given
 * in `text` format, a `cacheID` as a hash of the text should be set to be used
 * for local caching.
 */
export type RequestParameters<TVariables extends IVariables = IVariables> =
  | {
      readonly id: string;
      readonly text: null;
      // common fields
      readonly name: string;
      readonly operationKind: string; // "mutation" | "query" | "subscription";
      readonly providedVariables?: TVariables;
      readonly metadata: { [key: string]: unknown };
    }
  | {
      readonly cacheID: string;
      readonly id: null;
      readonly text: string | null;
      // common fields
      readonly name: string;
      readonly operationKind: string; //"mutation" | "query" | "subscription";
      readonly providedVariables?: TVariables;
      readonly metadata: { [key: string]: unknown };
    };
