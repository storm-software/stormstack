import {
  HttpFile,
  AbstractHttpConfiguration,
} from "@open-system/core-typescript-utilities";
import { GetArticleReaction200Response } from "../models";
import { GetArticleReaction200ResponseAllOf } from "../models";
import { GetArticleReaction200ResponseAllOfAllOf } from "../models";
import { GetArticleReactions200Response } from "../models";
import { GetArticleReactions200ResponseAllOf } from "../models";
import { ProblemDetails } from "../models";
import { ReactionDetail } from "../models";
import { RecordBase } from "../models";
import { UpdateSuccessResponse } from "../models";

export abstract class AbstractPromiseReactionsApi {
  public abstract addArticleReaction(
    id: string,
    type: "like" | "dislike" | "happy" | "sad" | "laugh" | "cry",
    userId: string,
    options?: AbstractHttpConfiguration
  ): Promise<UpdateSuccessResponse>;

  public abstract deleteArticleReaction(
    id: string,
    type: "like" | "dislike" | "happy" | "sad" | "laugh" | "cry",
    userId: string,
    options?: AbstractHttpConfiguration
  ): Promise<UpdateSuccessResponse>;

  public abstract getArticleReaction(
    id: string,
    type: "like" | "dislike" | "happy" | "sad" | "laugh" | "cry",
    userId: string,
    options?: AbstractHttpConfiguration
  ): Promise<GetArticleReaction200Response>;

  public abstract getArticleReactions(
    id: string,
    userId: string,
    options?: AbstractHttpConfiguration
  ): Promise<GetArticleReactions200Response>;
}
