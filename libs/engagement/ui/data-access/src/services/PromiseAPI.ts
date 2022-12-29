import {
  HttpFile,
  AbstractHttpConfiguration
} from "@open-system/core-typescript-utilities";
import { GetReaction200ResponseAllOfAllOfDto } from "../models";
import { GetReaction200ResponseAllOfDto } from "../models";
import { GetReaction200ResponseDto } from "../models";
import { GetReactions200ResponseAllOfDto } from "../models";
import { GetReactions200ResponseDto } from "../models";
import { ProblemDetailsDto } from "../models";
import { ReactionDetailDto } from "../models";
import { RecordBaseDto } from "../models";
import { UpdateSuccessResponseDto } from "../models";


export abstract class AbstractPromiseReactionApi {
    public abstract addReaction(id: string, type: 'LIKE' | 'DISLIKE', userId?: string, options?: AbstractHttpConfiguration): Promise<UpdateSuccessResponseDto>;

    public abstract deleteReaction(id: string, type: 'LIKE' | 'DISLIKE', userId?: string, options?: AbstractHttpConfiguration): Promise<UpdateSuccessResponseDto>;

    public abstract getReaction(id: string, type: 'LIKE' | 'DISLIKE', userId?: string, options?: AbstractHttpConfiguration): Promise<GetReaction200ResponseDto>;

    public abstract getReactions(id: string, userId?: string, options?: AbstractHttpConfiguration): Promise<GetReactions200ResponseDto>;

}
