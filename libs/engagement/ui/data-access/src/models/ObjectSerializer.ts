import { GetReaction200ResponseAllOfAllOfDto } from './GetReaction200ResponseAllOfAllOfDto';
import { GetReaction200ResponseAllOfDto , GetReaction200ResponseAllOfDtoTypeDtoEnum    } from './GetReaction200ResponseAllOfDto';
import { GetReaction200ResponseDto      , GetReaction200ResponseDtoTypeDtoEnum    } from './GetReaction200ResponseDto';
import { GetReactions200ResponseAllOfDto } from './GetReactions200ResponseAllOfDto';
import { GetReactions200ResponseDto } from './GetReactions200ResponseDto';
import { ProblemDetailsDto } from './ProblemDetailsDto';
import { ReactionDetailDto, ReactionDetailDtoTypeDtoEnum    } from './ReactionDetailDto';
import { RecordBaseDto } from './RecordBaseDto';
import { UpdateSuccessResponseDto } from './UpdateSuccessResponseDto';

export const enumsMap: Set<string> = new Set<string>([
    "GetReaction200ResponseAllOfDtoTypeDtoEnum",
    "GetReaction200ResponseDtoTypeDtoEnum",
    "ReactionDetailDtoTypeDtoEnum",
]);

export const typeMap: {[index: string]: any} = {
    "GetReaction200ResponseAllOfAllOfDto": GetReaction200ResponseAllOfAllOfDto,
    "GetReaction200ResponseAllOfDto": GetReaction200ResponseAllOfDto,
    "GetReaction200ResponseDto": GetReaction200ResponseDto,
    "GetReactions200ResponseAllOfDto": GetReactions200ResponseAllOfDto,
    "GetReactions200ResponseDto": GetReactions200ResponseDto,
    "ProblemDetailsDto": ProblemDetailsDto,
    "ReactionDetailDto": ReactionDetailDto,
    "RecordBaseDto": RecordBaseDto,
    "UpdateSuccessResponseDto": UpdateSuccessResponseDto,
}
