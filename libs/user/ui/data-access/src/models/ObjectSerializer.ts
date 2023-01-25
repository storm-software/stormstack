import { ProblemDetailsDto } from './ProblemDetailsDto';
import { RecordBaseDto } from './RecordBaseDto';
import { UpdateSuccessResponseDto } from './UpdateSuccessResponseDto';
import { UpdateUserRequestDto , UpdateUserRequestDtoTypeDtoEnum   } from './UpdateUserRequestDto';
import { UserAllOfDto } from './UserAllOfDto';
import { UserDto } from './UserDto';

export const enumsMap: Set<string> = new Set<string>([
    "UpdateUserRequestDtoTypeDtoEnum",
]);

export const typeMap: {[index: string]: any} = {
    "ProblemDetailsDto": ProblemDetailsDto,
    "RecordBaseDto": RecordBaseDto,
    "UpdateSuccessResponseDto": UpdateSuccessResponseDto,
    "UpdateUserRequestDto": UpdateUserRequestDto,
    "UserAllOfDto": UserAllOfDto,
    "UserDto": UserDto,
}
