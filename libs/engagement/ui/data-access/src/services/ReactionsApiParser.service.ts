import {
  HttpFile,
  RequestContext,
  ResponseContext,
  AbstractHttpConfiguration
} from '@open-system/core-typescript-utilities';

import { GetArticleReaction200Response } from "../models";
import { GetArticleReactions200Response } from "../models";
import { ProblemDetails } from "../models";
import { UpdateSuccessResponse } from "../models";

export abstract class AbstractReactionsApiRequestFactory {
    public abstract addArticleReaction(id: string, type: 'like' | 'dislike' | 'happy' | 'sad' | 'laugh' | 'cry', userId: string, options?: AbstractHttpConfiguration): Promise<RequestContext>;

    public abstract deleteArticleReaction(id: string, type: 'like' | 'dislike' | 'happy' | 'sad' | 'laugh' | 'cry', userId: string, options?: AbstractHttpConfiguration): Promise<RequestContext>;

    public abstract getArticleReaction(id: string, type: 'like' | 'dislike' | 'happy' | 'sad' | 'laugh' | 'cry', userId: string, options?: AbstractHttpConfiguration): Promise<RequestContext>;

    public abstract getArticleReactions(id: string, userId: string, options?: AbstractHttpConfiguration): Promise<RequestContext>;

}

export abstract class AbstractReactionsApiResponseProcessor {
     public abstract addArticleReaction(response: ResponseContext): Promise<UpdateSuccessResponse >;

     public abstract deleteArticleReaction(response: ResponseContext): Promise<UpdateSuccessResponse >;

     public abstract getArticleReaction(response: ResponseContext): Promise<GetArticleReaction200Response >;

     public abstract getArticleReactions(response: ResponseContext): Promise<GetArticleReactions200Response >;

}
