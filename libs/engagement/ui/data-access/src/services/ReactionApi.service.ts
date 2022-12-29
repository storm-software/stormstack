import {
  HttpFile,
  RequestContext,
  ResponseContext,
  AbstractHttpConfiguration
} from '@open-system/core-typescript-utilities';

import { GetReaction200ResponseDto } from "../models";
import { GetReactions200ResponseDto } from "../models";
import { ProblemDetailsDto } from "../models";
import { UpdateSuccessResponseDto } from "../models";

export abstract class AbstractReactionApiRequestFactory {
    public abstract addReaction(id: string, type: 'LIKE' | 'DISLIKE', userId?: string, options?: AbstractHttpConfiguration): Promise<RequestContext>;

    public abstract deleteReaction(id: string, type: 'LIKE' | 'DISLIKE', userId?: string, options?: AbstractHttpConfiguration): Promise<RequestContext>;

    public abstract getReaction(id: string, type: 'LIKE' | 'DISLIKE', userId?: string, options?: AbstractHttpConfiguration): Promise<RequestContext>;

    public abstract getReactions(id: string, userId?: string, options?: AbstractHttpConfiguration): Promise<RequestContext>;

}

export abstract class AbstractReactionApiResponseProcessor {
     public abstract addReaction(response: ResponseContext): Promise<UpdateSuccessResponseDto >;

     public abstract deleteReaction(response: ResponseContext): Promise<UpdateSuccessResponseDto >;

     public abstract getReaction(response: ResponseContext): Promise<GetReaction200ResponseDto >;

     public abstract getReactions(response: ResponseContext): Promise<GetReactions200ResponseDto >;

}
