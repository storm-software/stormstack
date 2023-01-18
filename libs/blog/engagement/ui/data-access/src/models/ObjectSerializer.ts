import {
  GetArticleReaction200Response,
  GetArticleReaction200ResponseTypeEnum,
} from "./GetArticleReaction200Response";
import {
  GetArticleReaction200ResponseAllOf,
  GetArticleReaction200ResponseAllOfTypeEnum,
} from "./GetArticleReaction200ResponseAllOf";
import { GetArticleReaction200ResponseAllOfAllOf } from "./GetArticleReaction200ResponseAllOfAllOf";
import { GetArticleReactions200Response } from "./GetArticleReactions200Response";
import { GetArticleReactions200ResponseAllOf } from "./GetArticleReactions200ResponseAllOf";
import { ProblemDetails } from "./ProblemDetails";
import { ReactionDetail, ReactionDetailTypeEnum } from "./ReactionDetail";
import { RecordBase } from "./RecordBase";
import { UpdateSuccessResponse } from "./UpdateSuccessResponse";

export const enumsMap: Set<string> = new Set<string>([
  "GetArticleReaction200ResponseTypeEnum",
  "GetArticleReaction200ResponseAllOfTypeEnum",
  "ReactionDetailTypeEnum",
]);

export const typeMap: { [index: string]: any } = {
  "GetArticleReaction200Response": GetArticleReaction200Response,
  "GetArticleReaction200ResponseAllOf": GetArticleReaction200ResponseAllOf,
  "GetArticleReaction200ResponseAllOfAllOf":
    GetArticleReaction200ResponseAllOfAllOf,
  "GetArticleReactions200Response": GetArticleReactions200Response,
  "GetArticleReactions200ResponseAllOf": GetArticleReactions200ResponseAllOf,
  "ProblemDetails": ProblemDetails,
  "ReactionDetail": ReactionDetail,
  "RecordBase": RecordBase,
  "UpdateSuccessResponse": UpdateSuccessResponse,
};
