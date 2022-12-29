import type * as req from "../apis/ObjectParamAPI";
import {
  HttpFile,
  AbstractHttpConfiguration
} from '@open-system/core-typescript-utilities';
import type { GetReaction200ResponseAllOfAllOfDto } from '../models';
import type { GetReaction200ResponseAllOfDto } from '../models';
import type { GetReaction200ResponseDto } from '../models';
import type { GetReactions200ResponseAllOfDto } from '../models';
import type { GetReactions200ResponseDto } from '../models';
import type { ProblemDetailsDto } from '../models';
import type { ReactionDetailDto } from '../models';
import type { RecordBaseDto } from '../models';
import type { UpdateSuccessResponseDto } from '../models';


export abstract class AbstractObjectReactionApi {
    /**
     * Add a new reaction to an article
     * Add Reaction
     * @param param the request object
     */
    public abstract addReaction(param: req.ReactionApiAddReactionRequest, options?: AbstractHttpConfiguration): Promise<UpdateSuccessResponseDto>;

    /**
     * Remove an existing reaction to an article
     * Remove Reaction
     * @param param the request object
     */
    public abstract deleteReaction(param: req.ReactionApiDeleteReactionRequest, options?: AbstractHttpConfiguration): Promise<UpdateSuccessResponseDto>;

    /**
     * An end point that returns the reactions for an article/page to a client
     * Get Reaction
     * @param param the request object
     */
    public abstract getReaction(param: req.ReactionApiGetReactionRequest, options?: AbstractHttpConfiguration): Promise<GetReaction200ResponseDto>;

    /**
     * An end point that returns the reactions for an article/page to a client
     * Get Reactions
     * @param param the request object
     */
    public abstract getReactions(param: req.ReactionApiGetReactionsRequest, options?: AbstractHttpConfiguration): Promise<GetReactions200ResponseDto>;

}
