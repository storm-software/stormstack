import {
  ResponseContext,
  RequestContext,
  HttpFile,
  AbstractHttpConfiguration
} from '@open-system/core-typescript-utilities';

import { GetArticleReaction200Response } from '../models';
import { GetArticleReaction200ResponseAllOf } from '../models';
import { GetArticleReaction200ResponseAllOfAllOf } from '../models';
import { GetArticleReactions200Response } from '../models';
import { GetArticleReactions200ResponseAllOf } from '../models';
import { ProblemDetails } from '../models';
import { ReactionDetail } from '../models';
import { RecordBase } from '../models';
import { UpdateSuccessResponse } from '../models';

import { ReactionsApiRequestFactory, ReactionsApiResponseProcessor} from "../parsers/ReactionsApiParser";
import { AbstractReactionsApiRequestFactory, AbstractReactionsApiResponseProcessor } from "../services/ReactionsApiParser.service";

export class PromiseReactionsApi {
    public constructor(
        public configuration: AbstractHttpConfiguration,
        public requestFactory: AbstractReactionsApiRequestFactory,
        public responseProcessor: AbstractReactionsApiResponseProcessor
    ) {}

    /**
     * Add a new reaction to an article
     * Add Reaction
     * @param id The id of the article/page
     * @param type The type of reaction the user had
     * @param userId The id of the current user sending the request
     */
    public async addArticleReaction(id: string, type: 'like' | 'dislike' | 'happy' | 'sad' | 'laugh' | 'cry', userId: string, _options?: AbstractHttpConfiguration): Promise<UpdateSuccessResponse> {

        let request: RequestContext = await this.requestFactory.addArticleReaction(id, type, userId, _options);
        for (const middleware of this.configuration.middleware) {
            request = await middleware.pre(request)
        }

        let response: ResponseContext = await this.configuration.httpApi.send(request);
        for (const middleware of this.configuration.middleware) {
          response = await middleware.post(response);
        }

        return await this.responseProcessor.addArticleReaction(response);
    }

    /**
     * Remove an existing reaction to an article
     * Remove Reaction
     * @param id The id of the article/page
     * @param type The type of reaction the user had
     * @param userId The id of the current user sending the request
     */
    public async deleteArticleReaction(id: string, type: 'like' | 'dislike' | 'happy' | 'sad' | 'laugh' | 'cry', userId: string, _options?: AbstractHttpConfiguration): Promise<UpdateSuccessResponse> {

        let request: RequestContext = await this.requestFactory.deleteArticleReaction(id, type, userId, _options);
        for (const middleware of this.configuration.middleware) {
            request = await middleware.pre(request)
        }

        let response: ResponseContext = await this.configuration.httpApi.send(request);
        for (const middleware of this.configuration.middleware) {
          response = await middleware.post(response);
        }

        return await this.responseProcessor.deleteArticleReaction(response);
    }

    /**
     * An end point that returns the reactions for an article/page to a client
     * Get Reaction
     * @param id The id of the article/page
     * @param type The type of reaction the user had
     * @param userId The id of the current user sending the request
     */
    public async getArticleReaction(id: string, type: 'like' | 'dislike' | 'happy' | 'sad' | 'laugh' | 'cry', userId: string, _options?: AbstractHttpConfiguration): Promise<GetArticleReaction200Response> {

        let request: RequestContext = await this.requestFactory.getArticleReaction(id, type, userId, _options);
        for (const middleware of this.configuration.middleware) {
            request = await middleware.pre(request)
        }

        let response: ResponseContext = await this.configuration.httpApi.send(request);
        for (const middleware of this.configuration.middleware) {
          response = await middleware.post(response);
        }

        return await this.responseProcessor.getArticleReaction(response);
    }

    /**
     * An end point that returns the reactions for an article/page to a client
     * Get Article Reactions
     * @param id The id of the article/page
     * @param userId The id of the current user sending the request
     */
    public async getArticleReactions(id: string, userId: string, _options?: AbstractHttpConfiguration): Promise<GetArticleReactions200Response> {

        let request: RequestContext = await this.requestFactory.getArticleReactions(id, userId, _options);
        for (const middleware of this.configuration.middleware) {
            request = await middleware.pre(request)
        }

        let response: ResponseContext = await this.configuration.httpApi.send(request);
        for (const middleware of this.configuration.middleware) {
          response = await middleware.post(response);
        }

        return await this.responseProcessor.getArticleReactions(response);
    }


}



