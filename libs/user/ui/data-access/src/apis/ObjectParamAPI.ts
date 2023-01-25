import {
  RequiredError,
  COLLECTION_FORMATS,
  RequestContext,
  HttpMethod,
  ResponseContext,
  HttpFile,
  canConsumeForm,
  isCodeInRange,
  ApiException,
  AbstractHttpConfiguration
} from '@open-system/core-typescript-utilities';
import { injectable, inject, optional } from "inversify";
import { ProblemDetailsDto } from '../models';
import { RecordBaseDto } from '../models';
import { UpdateSuccessResponseDto } from '../models';
import { UpdateUserRequestDto } from '../models';
import { UserAllOfDto } from '../models';
import { UserDto } from '../models';

import { PromiseUsersApi } from "./PromiseAPI";
import { UsersApiRequestFactory, UsersApiResponseProcessor} from "../parsers/UsersApiParser";
import { AbstractUsersApiRequestFactory, AbstractUsersApiResponseProcessor } from "../services/UsersApiParser.service";

export interface UsersApiAddUserRequest {
    /**
     * The unique Id used to identify the user
     * @type string
     * @memberof UsersApiaddUser
     */
    userId: string
    /**
     * 
     * @type UpdateUserRequestDto
     * @memberof UsersApiaddUser
     */
    updateUserRequestDto?: UpdateUserRequestDto
}

export interface UsersApiDeleteUserRequest {
    /**
     * The unique Id used to identify the user
     * @type string
     * @memberof UsersApideleteUser
     */
    userId: string
}

export interface UsersApiGetUserRequest {
    /**
     * The unique Id used to identify the user
     * @type string
     * @memberof UsersApigetUser
     */
    userId: string
}

export interface UsersApiGetUsersRequest {
    /**
     * The unique Id used to identify the user
     * @type string
     * @memberof UsersApigetUsers
     */
    userId: string
    /**
     * The type of the user
     * @type &#39;guest&#39; | &#39;internal&#39; | &#39;external&#39;
     * @memberof UsersApigetUsers
     */
    type?: 'guest' | 'internal' | 'external'
}

export interface UsersApiUpdateUserRequest {
    /**
     * The unique Id used to identify the user
     * @type string
     * @memberof UsersApiupdateUser
     */
    userId: string
    /**
     * 
     * @type UpdateUserRequestDto
     * @memberof UsersApiupdateUser
     */
    updateUserRequestDto?: UpdateUserRequestDto
}

@injectable()
export class ObjectUsersApi {
    private api: PromiseUsersApi

    public constructor(
      @inject(AbstractHttpConfiguration) configuration: AbstractHttpConfiguration,
      @inject(AbstractUsersApiRequestFactory) requestFactory: AbstractUsersApiRequestFactory,
      @inject(AbstractUsersApiResponseProcessor) responseProcessor: AbstractUsersApiResponseProcessor
  ) {
    this.api = new PromiseUsersApi(configuration,
      requestFactory,
      responseProcessor);
  }

    /**
     * Add a new user
     * Add User
     * @param param the request object
     */
    public addUser(param: UsersApiAddUserRequest, options?: AbstractHttpConfiguration): Promise<UpdateSuccessResponseDto> {
        return this.api.addUser(param.userId, param.updateUserRequestDto,  options);
    }

    /**
     * Remove an existing user from the system
     * Remove User
     * @param param the request object
     */
    public deleteUser(param: UsersApiDeleteUserRequest, options?: AbstractHttpConfiguration): Promise<UpdateSuccessResponseDto> {
        return this.api.deleteUser(param.userId,  options);
    }

    /**
     * An end point that returns data for a specific user
     * Get User
     * @param param the request object
     */
    public getUser(param: UsersApiGetUserRequest, options?: AbstractHttpConfiguration): Promise<UserDto> {
        return this.api.getUser(param.userId,  options);
    }

    /**
     * An end point that returns the list of users in the system
     * Get Users
     * @param param the request object
     */
    public getUsers(param: UsersApiGetUsersRequest, options?: AbstractHttpConfiguration): Promise<Array<UserDto>> {
        return this.api.getUsers(param.userId, param.type,  options);
    }

    /**
     * Update an existing user
     * Update User
     * @param param the request object
     */
    public updateUser(param: UsersApiUpdateUserRequest, options?: AbstractHttpConfiguration): Promise<UpdateSuccessResponseDto> {
        return this.api.updateUser(param.userId, param.updateUserRequestDto,  options);
    }

}
