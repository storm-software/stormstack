import {
  RequiredError,
  COLLECTION_FORMATS,
  RequestContext,
  HttpMethod,
  ResponseContext,
  HttpFile,
  canConsumeForm,
  isCodeInRange,
  ApiException,
  AbstractHttpConfiguration,
} from "@open-system/core-typescript-utilities";
import { injectable, inject, optional } from "inversify";
import { GetArticleReaction200Response } from "../models";
import { GetArticleReaction200ResponseAllOf } from "../models";
import { GetArticleReaction200ResponseAllOfAllOf } from "../models";
import { GetArticleReactions200Response } from "../models";
import { GetArticleReactions200ResponseAllOf } from "../models";
import { ProblemDetails } from "../models";
import { ReactionDetail } from "../models";
import { RecordBase } from "../models";
import { UpdateSuccessResponse } from "../models";

import { PromiseReactionsApi } from "./PromiseAPI";
import {
  ReactionsApiRequestFactory,
  ReactionsApiResponseProcessor,
} from "../parsers/ReactionsApiParser";
import {
  AbstractReactionsApiRequestFactory,
  AbstractReactionsApiResponseProcessor,
} from "../services/ReactionsApiParser.service";

export interface ReactionsApiAddArticleReactionRequest {
  /**
   * The id of the article/page
   * @type string
   * @memberof ReactionsApiaddArticleReaction
   */
  id: string;
  /**
   * The type of reaction the user had
   * @type &#39;like&#39; | &#39;dislike&#39; | &#39;happy&#39; | &#39;sad&#39; | &#39;laugh&#39; | &#39;cry&#39;
   * @memberof ReactionsApiaddArticleReaction
   */
  type: "like" | "dislike" | "happy" | "sad" | "laugh" | "cry";
  /**
   * The id of the current user sending the request
   * @type string
   * @memberof ReactionsApiaddArticleReaction
   */
  userId: string;
}

export interface ReactionsApiDeleteArticleReactionRequest {
  /**
   * The id of the article/page
   * @type string
   * @memberof ReactionsApideleteArticleReaction
   */
  id: string;
  /**
   * The type of reaction the user had
   * @type &#39;like&#39; | &#39;dislike&#39; | &#39;happy&#39; | &#39;sad&#39; | &#39;laugh&#39; | &#39;cry&#39;
   * @memberof ReactionsApideleteArticleReaction
   */
  type: "like" | "dislike" | "happy" | "sad" | "laugh" | "cry";
  /**
   * The id of the current user sending the request
   * @type string
   * @memberof ReactionsApideleteArticleReaction
   */
  userId: string;
}

export interface ReactionsApiGetArticleReactionRequest {
  /**
   * The id of the article/page
   * @type string
   * @memberof ReactionsApigetArticleReaction
   */
  id: string;
  /**
   * The type of reaction the user had
   * @type &#39;like&#39; | &#39;dislike&#39; | &#39;happy&#39; | &#39;sad&#39; | &#39;laugh&#39; | &#39;cry&#39;
   * @memberof ReactionsApigetArticleReaction
   */
  type: "like" | "dislike" | "happy" | "sad" | "laugh" | "cry";
  /**
   * The id of the current user sending the request
   * @type string
   * @memberof ReactionsApigetArticleReaction
   */
  userId: string;
}

export interface ReactionsApiGetArticleReactionsRequest {
  /**
   * The id of the article/page
   * @type string
   * @memberof ReactionsApigetArticleReactions
   */
  id: string;
  /**
   * The id of the current user sending the request
   * @type string
   * @memberof ReactionsApigetArticleReactions
   */
  userId: string;
}

@injectable()
export class ObjectReactionsApi {
  private api: PromiseReactionsApi;

  public constructor(
    @inject(AbstractHttpConfiguration) configuration: AbstractHttpConfiguration,
    @inject(AbstractReactionsApiRequestFactory)
    requestFactory: AbstractReactionsApiRequestFactory,
    @inject(AbstractReactionsApiResponseProcessor)
    responseProcessor: AbstractReactionsApiResponseProcessor
  ) {
    this.api = new PromiseReactionsApi(
      configuration,
      requestFactory,
      responseProcessor
    );
  }

  /**
   * Add a new reaction to an article
   * Add Reaction
   * @param param the request object
   */
  public addArticleReaction(
    param: ReactionsApiAddArticleReactionRequest,
    options?: AbstractHttpConfiguration
  ): Promise<UpdateSuccessResponse> {
    return this.api.addArticleReaction(
      param.id,
      param.type,
      param.userId,
      options
    );
  }

  /**
   * Remove an existing reaction to an article
   * Remove Reaction
   * @param param the request object
   */
  public deleteArticleReaction(
    param: ReactionsApiDeleteArticleReactionRequest,
    options?: AbstractHttpConfiguration
  ): Promise<UpdateSuccessResponse> {
    return this.api.deleteArticleReaction(
      param.id,
      param.type,
      param.userId,
      options
    );
  }

  /**
   * An end point that returns the reactions for an article/page to a client
   * Get Reaction
   * @param param the request object
   */
  public getArticleReaction(
    param: ReactionsApiGetArticleReactionRequest,
    options?: AbstractHttpConfiguration
  ): Promise<GetArticleReaction200Response> {
    return this.api.getArticleReaction(
      param.id,
      param.type,
      param.userId,
      options
    );
  }

  /**
   * An end point that returns the reactions for an article/page to a client
   * Get Article Reactions
   * @param param the request object
   */
  public getArticleReactions(
    param: ReactionsApiGetArticleReactionsRequest,
    options?: AbstractHttpConfiguration
  ): Promise<GetArticleReactions200Response> {
    return this.api.getArticleReactions(param.id, param.userId, options);
  }
}
