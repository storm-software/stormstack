import {
  HttpFile,
  AbstractHttpConfiguration
} from "@open-system/core-typescript-utilities";
import { ProblemDetailsDto } from "../models";
import { RecordBaseDto } from "../models";
import { UpdateSuccessResponseDto } from "../models";
import { UpdateUserRequestDto } from "../models";
import { UserAllOfDto } from "../models";
import { UserDto } from "../models";


export abstract class AbstractPromiseUsersApi {
    public abstract addUser(userId: string, updateUserRequestDto?: UpdateUserRequestDto, options?: AbstractHttpConfiguration): Promise<UpdateSuccessResponseDto>;

    public abstract deleteUser(userId: string, options?: AbstractHttpConfiguration): Promise<UpdateSuccessResponseDto>;

    public abstract getUser(userId: string, options?: AbstractHttpConfiguration): Promise<UserDto>;

    public abstract getUsers(userId: string, type?: 'guest' | 'internal' | 'external', options?: AbstractHttpConfiguration): Promise<Array<UserDto>>;

    public abstract updateUser(userId: string, updateUserRequestDto?: UpdateUserRequestDto, options?: AbstractHttpConfiguration): Promise<UpdateSuccessResponseDto>;

}
