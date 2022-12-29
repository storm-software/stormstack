import {
  AbstractHttpConfiguration,
  RequestContext,
  ResponseContext,
} from "@open-system/core-typescript-utilities";

import {
  GetReaction200ResponseDto,
  GetReactions200ResponseDto,
  UpdateSuccessResponseDto,
} from "../models";

import {
  AbstractReactionApiRequestFactory,
  AbstractReactionApiResponseProcessor,
} from "../services/ReactionApi.service";

export class PromiseReactionApi {
  public constructor(
    public configuration: AbstractHttpConfiguration,
    public requestFactory: AbstractReactionApiRequestFactory,
    public responseProcessor: AbstractReactionApiResponseProcessor
  ) {}

  /**
   * Add a new reaction to an article
   * Add Reaction
   * @param id The id of the article/page
   * @param type The type of reaction the user had
   * @param userId User Id sending request
   */
  public async addReaction(
    id: string,
    type: "LIKE" | "DISLIKE",
    userId = "PSUL",
    _options?: AbstractHttpConfiguration
  ): Promise<UpdateSuccessResponseDto> {
    let request: RequestContext = await this.requestFactory.addReaction(
      id,
      type,
      userId,
      _options
    );
    for (const middleware of this.configuration.middleware) {
      request = await middleware.pre(request);
    }

    let response: ResponseContext = await this.configuration.httpApi.send(
      request
    );
    for (const middleware of this.configuration.middleware) {
      response = await middleware.post(response);
    }

    return await this.responseProcessor.addReaction(response);
  }

  /**
   * Remove an existing reaction to an article
   * Remove Reaction
   * @param id The id of the article/page
   * @param type The type of reaction the user had
   * @param userId User Id sending request
   */
  public async deleteReaction(
    id: string,
    type: "LIKE" | "DISLIKE",
    userId = "PSUL",
    _options?: AbstractHttpConfiguration
  ): Promise<UpdateSuccessResponseDto> {
    let request: RequestContext = await this.requestFactory.deleteReaction(
      id,
      type,
      userId,
      _options
    );
    for (const middleware of this.configuration.middleware) {
      request = await middleware.pre(request);
    }

    let response: ResponseContext = await this.configuration.httpApi.send(
      request
    );
    for (const middleware of this.configuration.middleware) {
      response = await middleware.post(response);
    }

    return await this.responseProcessor.deleteReaction(response);
  }

  /**
   * An end point that returns the reactions for an article/page to a client
   * Get Reaction
   * @param id The id of the article/page
   * @param type The type of reaction the user had
   * @param userId User Id sending request
   */
  public async getReaction(
    id: string,
    type: "LIKE" | "DISLIKE",
    userId = "PSUL",
    _options?: AbstractHttpConfiguration
  ): Promise<GetReaction200ResponseDto> {
    let request: RequestContext = await this.requestFactory.getReaction(
      id,
      type,
      userId,
      _options
    );
    for (const middleware of this.configuration.middleware) {
      request = await middleware.pre(request);
    }

    let response: ResponseContext = await this.configuration.httpApi.send(
      request
    );
    for (const middleware of this.configuration.middleware) {
      response = await middleware.post(response);
    }

    return await this.responseProcessor.getReaction(response);
  }

  /**
   * An end point that returns the reactions for an article/page to a client
   * Get Reactions
   * @param id The id of the article/page
   * @param userId User Id sending request
   */
  public async getReactions(
    id: string,
    userId = "PSUL",
    _options?: AbstractHttpConfiguration
  ): Promise<GetReactions200ResponseDto> {
    let request: RequestContext = await this.requestFactory.getReactions(
      id,
      userId,
      _options
    );
    for (const middleware of this.configuration.middleware) {
      request = await middleware.pre(request);
    }

    let response: ResponseContext = await this.configuration.httpApi.send(
      request
    );
    for (const middleware of this.configuration.middleware) {
      response = await middleware.post(response);
    }

    return await this.responseProcessor.getReactions(response);
  }
}
