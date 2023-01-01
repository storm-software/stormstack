import type * as req from "../apis/ObjectParamAPI";
import {
  HttpFile,
  AbstractHttpConfiguration
} from '@open-system/core-typescript-utilities';
import type { GetArticleReaction200Response } from '../models';
import type { GetArticleReaction200ResponseAllOf } from '../models';
import type { GetArticleReaction200ResponseAllOfAllOf } from '../models';
import type { GetArticleReactions200Response } from '../models';
import type { GetArticleReactions200ResponseAllOf } from '../models';
import type { ProblemDetails } from '../models';
import type { ReactionDetail } from '../models';
import type { RecordBase } from '../models';
import type { UpdateSuccessResponse } from '../models';


export abstract class AbstractObjectReactionsApi {
    /**
     * Add a new reaction to an article
     * Add Reaction
     * @param param the request object
     */
    public abstract addArticleReaction(param: req.ReactionsApiAddArticleReactionRequest, options?: AbstractHttpConfiguration): Promise<UpdateSuccessResponse>;

    /**
     * Remove an existing reaction to an article
     * Remove Reaction
     * @param param the request object
     */
    public abstract deleteArticleReaction(param: req.ReactionsApiDeleteArticleReactionRequest, options?: AbstractHttpConfiguration): Promise<UpdateSuccessResponse>;

    /**
     * An end point that returns the reactions for an article/page to a client
     * Get Reaction
     * @param param the request object
     */
    public abstract getArticleReaction(param: req.ReactionsApiGetArticleReactionRequest, options?: AbstractHttpConfiguration): Promise<GetArticleReaction200Response>;

    /**
     * An end point that returns the reactions for an article/page to a client
     * Get Article Reactions
     * @param param the request object
     */
    public abstract getArticleReactions(param: req.ReactionsApiGetArticleReactionsRequest, options?: AbstractHttpConfiguration): Promise<GetArticleReactions200Response>;

}
