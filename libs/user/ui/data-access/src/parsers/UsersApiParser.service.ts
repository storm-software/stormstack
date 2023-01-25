import {
  HttpFile,
  RequestContext,
  ResponseContext,
  AbstractHttpConfiguration
} from '@open-system/core-typescript-utilities';

import { ProblemDetailsDto } from "../models";
import { UpdateSuccessResponseDto } from "../models";
import { UpdateUserRequestDto } from "../models";
import { UserDto } from "../models";

export abstract class AbstractUsersApiRequestFactory {
    public abstract addUser(userId: string, updateUserRequestDto?: UpdateUserRequestDto, options?: AbstractHttpConfiguration): Promise<RequestContext>;

    public abstract deleteUser(userId: string, options?: AbstractHttpConfiguration): Promise<RequestContext>;

    public abstract getUser(userId: string, options?: AbstractHttpConfiguration): Promise<RequestContext>;

    public abstract getUsers(userId: string, type?: 'guest' | 'internal' | 'external', options?: AbstractHttpConfiguration): Promise<RequestContext>;

    public abstract updateUser(userId: string, updateUserRequestDto?: UpdateUserRequestDto, options?: AbstractHttpConfiguration): Promise<RequestContext>;

}

export abstract class AbstractUsersApiResponseProcessor {
     public abstract addUser(response: ResponseContext): Promise<UpdateSuccessResponseDto >;

     public abstract deleteUser(response: ResponseContext): Promise<UpdateSuccessResponseDto >;

     public abstract getUser(response: ResponseContext): Promise<UserDto >;

     public abstract getUsers(response: ResponseContext): Promise<Array<UserDto> >;

     public abstract updateUser(response: ResponseContext): Promise<UpdateSuccessResponseDto >;

}
