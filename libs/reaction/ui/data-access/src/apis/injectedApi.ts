import { ResponseContext } from "@open-system/core-typescript-utilities";
import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";
import {
  AddReactionRequest,
  CommandSuccessResponse,
  GetReactions200Response,
  GetReactionsCount200Response,
} from "../models";
import {
  ReactionApiRequestFactory,
  ReactionApiResponseProcessor,
} from "../parsers/ReactionApiParser";
import { apiSlice as api } from "./apiSlice";

export interface ReactionApiAddReactionRequest {
  /**
   * The id of the article/comment
   * @type string
   * @memberof ReactionApiaddReaction
   */
  contentId?: string;
  /**
   *
   * @type AddReactionRequest
   * @memberof ReactionApiaddReaction
   */
  body?: AddReactionRequest;
}

export interface ReactionApiGetReactionsRequest {
  /**
   * The id of the article/comment
   * @type string
   * @memberof ReactionApigetReactions
   */
  contentId?: string;
  /**
   * The current page number of the selected data
   * @type number
   * @memberof ReactionApigetReactions
   */
  pageNumber?: number;
  /**
   * The maximum amount of data to return in one request
   * @type number
   * @memberof ReactionApigetReactions
   */
  pageSize?: number;
  /**
   * The field to order the request by
   * @type string
   * @memberof ReactionApigetReactions
   */
  orderBy?: string;
  /**
   * The type of reaction the user had
   * @type &#39;like&#39; | &#39;dislike&#39; | &#39;laugh&#39; | &#39;cry&#39;
   * @memberof ReactionApigetReactions
   */
  type?: "like" | "dislike" | "laugh" | "cry";
}

export interface ReactionApiGetReactionsCountRequest {
  /**
   * The id of the article/comment
   * @type string
   * @memberof ReactionApigetReactionsCount
   */
  contentId?: string;
  /**
   * The type of reaction the user had
   * @type &#39;like&#39; | &#39;dislike&#39; | &#39;laugh&#39; | &#39;cry&#39;
   * @memberof ReactionApigetReactionsCount
   */
  type?: "like" | "dislike" | "laugh" | "cry";
}

export interface ReactionApiRemoveReactionRequest {
  /**
   * The id of the article/comment
   * @type string
   * @memberof ReactionApiremoveReaction
   */
  contentId?: string;
}

export const addTagTypes = ["Reaction"] as const;
export const reactionApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build: EndpointBuilder<any, "Reaction", "reactionApi">) => ({
      addReaction: build.mutation<
        CommandSuccessResponse,
        ReactionApiAddReactionRequest
      >({
        query: queryArg => ReactionApiRequestFactory.addReaction(queryArg),
        invalidatesTags: ["Reaction"],
        transformResponse: async (
          responseContext: ResponseContext<CommandSuccessResponse>,
          meta: any,
          arg: any
        ): Promise<CommandSuccessResponse> =>
          await ReactionApiResponseProcessor.addReaction(responseContext),
      }),
      getReactions: build.query<
        GetReactions200Response,
        ReactionApiGetReactionsRequest
      >({
        query: queryArg => ReactionApiRequestFactory.getReactions(queryArg),
        providesTags: ["Reaction"],
        transformResponse: async (
          responseContext: ResponseContext<GetReactions200Response>,
          meta: any,
          arg: any
        ): Promise<GetReactions200Response> =>
          await ReactionApiResponseProcessor.getReactions(responseContext),
      }),
      getReactionsCount: build.query<
        GetReactionsCount200Response,
        ReactionApiGetReactionsCountRequest
      >({
        query: queryArg =>
          ReactionApiRequestFactory.getReactionsCount(queryArg),
        providesTags: ["Reaction"],
        transformResponse: async (
          responseContext: ResponseContext<GetReactionsCount200Response>,
          meta: any,
          arg: any
        ): Promise<GetReactionsCount200Response> =>
          await ReactionApiResponseProcessor.getReactionsCount(responseContext),
      }),
      removeReaction: build.mutation<
        CommandSuccessResponse,
        ReactionApiRemoveReactionRequest
      >({
        query: queryArg => ReactionApiRequestFactory.removeReaction(queryArg),
        invalidatesTags: ["Reaction"],
        transformResponse: async (
          responseContext: ResponseContext<CommandSuccessResponse>,
          meta: any,
          arg: any
        ): Promise<CommandSuccessResponse> =>
          await ReactionApiResponseProcessor.removeReaction(responseContext),
      }),
    }),
    overrideExisting: false,
  });

export const {
  useAddReactionMutation,
  useGetReactionsQuery,
  useLazyGetReactionsQuery,
  useGetReactionsCountQuery,
  useLazyGetReactionsCountQuery,
  useRemoveReactionMutation,
} = reactionApi;
