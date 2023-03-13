import { AddReactionRequest, AddReactionRequestTypeEnum   } from './AddReactionRequest';
import { CommandSuccessResponse } from './CommandSuccessResponse';
import { GetReactions200Response } from './GetReactions200Response';
import { GetReactions200ResponseAllOf } from './GetReactions200ResponseAllOf';
import { GetReactionsCount200Response } from './GetReactionsCount200Response';
import { PagedQueryResponse } from './PagedQueryResponse';
import { ProblemDetailsResponse } from './ProblemDetailsResponse';
import { ProblemDetailsResponseField } from './ProblemDetailsResponseField';
import { ReactionCountRecord } from './ReactionCountRecord';
import { ReactionDetailRecord } from './ReactionDetailRecord';
import { ReactionDetailRecordAllOf } from './ReactionDetailRecordAllOf';
import { RecordBase } from './RecordBase';

export const enumsMap: Set<string> = new Set<string>([
    "AddReactionRequestTypeEnum",
]);

export const typeMap: {[index: string]: any} = {
    "AddReactionRequest": AddReactionRequest,
    "CommandSuccessResponse": CommandSuccessResponse,
    "GetReactions200Response": GetReactions200Response,
    "GetReactions200ResponseAllOf": GetReactions200ResponseAllOf,
    "GetReactionsCount200Response": GetReactionsCount200Response,
    "PagedQueryResponse": PagedQueryResponse,
    "ProblemDetailsResponse": ProblemDetailsResponse,
    "ProblemDetailsResponseField": ProblemDetailsResponseField,
    "ReactionCountRecord": ReactionCountRecord,
    "ReactionDetailRecord": ReactionDetailRecord,
    "ReactionDetailRecordAllOf": ReactionDetailRecordAllOf,
    "RecordBase": RecordBase,
}
