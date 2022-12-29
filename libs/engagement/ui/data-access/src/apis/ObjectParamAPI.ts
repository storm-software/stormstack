import { AbstractHttpConfiguration } from "@open-system/core-typescript-utilities";
import { inject } from "inversify";
import {
  GetReaction200ResponseDto,
  GetReactions200ResponseDto,
  UpdateSuccessResponseDto,
} from "../models";

import {
  AbstractReactionApiRequestFactory,
  AbstractReactionApiResponseProcessor,
} from "../services/ReactionApi.service";
import { PromiseReactionApi } from "./PromiseAPI";

export interface ReactionApiAddReactionRequest {
  /**
   * The id of the article/page
   * @type string
   * @memberof ReactionApiaddReaction
   */
  id: string;
  /**
   * The type of reaction the user had
   * @type &#39;LIKE&#39; | &#39;DISLIKE&#39;
   * @memberof ReactionApiaddReaction
   */
  type: "LIKE" | "DISLIKE";
  /**
   * User Id sending request
   * @type string
   * @memberof ReactionApiaddReaction
   */
  userId?: string;
}

export interface ReactionApiDeleteReactionRequest {
  /**
   * The id of the article/page
   * @type string
   * @memberof ReactionApideleteReaction
   */
  id: string;
  /**
   * The type of reaction the user had
   * @type &#39;LIKE&#39; | &#39;DISLIKE&#39;
   * @memberof ReactionApideleteReaction
   */
  type: "LIKE" | "DISLIKE";
  /**
   * User Id sending request
   * @type string
   * @memberof ReactionApideleteReaction
   */
  userId?: string;
}

export interface ReactionApiGetReactionRequest {
  /**
   * The id of the article/page
   * @type string
   * @memberof ReactionApigetReaction
   */
  id: string;
  /**
   * The type of reaction the user had
   * @type &#39;LIKE&#39; | &#39;DISLIKE&#39;
   * @memberof ReactionApigetReaction
   */
  type: "LIKE" | "DISLIKE";
  /**
   * User Id sending request
   * @type string
   * @memberof ReactionApigetReaction
   */
  userId?: string;
}

export interface ReactionApiGetReactionsRequest {
  /**
   * The id of the article/page
   * @type string
   * @memberof ReactionApigetReactions
   */
  id: string;
  /**
   * User Id sending request
   * @type string
   * @memberof ReactionApigetReactions
   */
  userId?: string;
}

export class ObjectReactionApi {
  private api: PromiseReactionApi;

  public constructor(
    @inject(AbstractHttpConfiguration) configuration: AbstractHttpConfiguration,
    @inject(AbstractReactionApiRequestFactory)
    requestFactory: AbstractReactionApiRequestFactory,
    @inject(AbstractReactionApiResponseProcessor)
    responseProcessor: AbstractReactionApiResponseProcessor
  ) {
    this.api = new PromiseReactionApi(
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
  public addReaction(
    param: ReactionApiAddReactionRequest,
    options?: AbstractHttpConfiguration
  ): Promise<UpdateSuccessResponseDto> {
    return this.api.addReaction(param.id, param.type, param.userId, options);
  }

  /**
   * Remove an existing reaction to an article
   * Remove Reaction
   * @param param the request object
   */
  public deleteReaction(
    param: ReactionApiDeleteReactionRequest,
    options?: AbstractHttpConfiguration
  ): Promise<UpdateSuccessResponseDto> {
    return this.api.deleteReaction(param.id, param.type, param.userId, options);
  }

  /**
   * An end point that returns the reactions for an article/page to a client
   * Get Reaction
   * @param param the request object
   */
  public getReaction(
    param: ReactionApiGetReactionRequest,
    options?: AbstractHttpConfiguration
  ): Promise<GetReaction200ResponseDto> {
    return this.api.getReaction(param.id, param.type, param.userId, options);
  }

  /**
   * An end point that returns the reactions for an article/page to a client
   * Get Reactions
   * @param param the request object
   */
  public getReactions(
    param: ReactionApiGetReactionsRequest,
    options?: AbstractHttpConfiguration
  ): Promise<GetReactions200ResponseDto> {
    return this.api.getReactions(param.id, param.userId, options);
  }
}
