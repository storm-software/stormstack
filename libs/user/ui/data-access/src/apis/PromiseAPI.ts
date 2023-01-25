import {
  ResponseContext,
  RequestContext,
  HttpFile,
  AbstractHttpConfiguration
} from '@open-system/core-typescript-utilities';

import { ProblemDetailsDto } from '../models';
import { RecordBaseDto } from '../models';
import { UpdateSuccessResponseDto } from '../models';
import { UpdateUserRequestDto } from '../models';
import { UserAllOfDto } from '../models';
import { UserDto } from '../models';

import { UsersApiRequestFactory, UsersApiResponseProcessor} from "../parsers/UsersApiParser";
import { AbstractUsersApiRequestFactory, AbstractUsersApiResponseProcessor } from "../services/UsersApiParser.service";

export class PromiseUsersApi {
    public constructor(
        public configuration: AbstractHttpConfiguration,
        public requestFactory: AbstractUsersApiRequestFactory,
        public responseProcessor: AbstractUsersApiResponseProcessor
    ) {}

    /**
     * Add a new user
     * Add User
     * @param userId The unique Id used to identify the user
     * @param updateUserRequestDto 
     */
    public async addUser(userId: string, updateUserRequestDto?: UpdateUserRequestDto, _options?: AbstractHttpConfiguration): Promise<UpdateSuccessResponseDto> {

        let request: RequestContext = await this.requestFactory.addUser(userId, updateUserRequestDto, _options);
        for (const middleware of this.configuration.middleware) {
            request = await middleware.pre(request)
        }

        let response: ResponseContext = await this.configuration.httpApi.send(request);
        for (const middleware of this.configuration.middleware) {
          response = await middleware.post(response);
        }

        return await this.responseProcessor.addUser(response);
    }

    /**
     * Remove an existing user from the system
     * Remove User
     * @param userId The unique Id used to identify the user
     */
    public async deleteUser(userId: string, _options?: AbstractHttpConfiguration): Promise<UpdateSuccessResponseDto> {

        let request: RequestContext = await this.requestFactory.deleteUser(userId, _options);
        for (const middleware of this.configuration.middleware) {
            request = await middleware.pre(request)
        }

        let response: ResponseContext = await this.configuration.httpApi.send(request);
        for (const middleware of this.configuration.middleware) {
          response = await middleware.post(response);
        }

        return await this.responseProcessor.deleteUser(response);
    }

    /**
     * An end point that returns data for a specific user
     * Get User
     * @param userId The unique Id used to identify the user
     */
    public async getUser(userId: string, _options?: AbstractHttpConfiguration): Promise<UserDto> {

        let request: RequestContext = await this.requestFactory.getUser(userId, _options);
        for (const middleware of this.configuration.middleware) {
            request = await middleware.pre(request)
        }

        let response: ResponseContext = await this.configuration.httpApi.send(request);
        for (const middleware of this.configuration.middleware) {
          response = await middleware.post(response);
        }

        return await this.responseProcessor.getUser(response);
    }

    /**
     * An end point that returns the list of users in the system
     * Get Users
     * @param userId The unique Id used to identify the user
     * @param type The type of the user
     */
    public async getUsers(userId: string, type?: 'guest' | 'internal' | 'external', _options?: AbstractHttpConfiguration): Promise<Array<UserDto>> {

        let request: RequestContext = await this.requestFactory.getUsers(userId, type, _options);
        for (const middleware of this.configuration.middleware) {
            request = await middleware.pre(request)
        }

        let response: ResponseContext = await this.configuration.httpApi.send(request);
        for (const middleware of this.configuration.middleware) {
          response = await middleware.post(response);
        }

        return await this.responseProcessor.getUsers(response);
    }

    /**
     * Update an existing user
     * Update User
     * @param userId The unique Id used to identify the user
     * @param updateUserRequestDto 
     */
    public async updateUser(userId: string, updateUserRequestDto?: UpdateUserRequestDto, _options?: AbstractHttpConfiguration): Promise<UpdateSuccessResponseDto> {

        let request: RequestContext = await this.requestFactory.updateUser(userId, updateUserRequestDto, _options);
        for (const middleware of this.configuration.middleware) {
            request = await middleware.pre(request)
        }

        let response: ResponseContext = await this.configuration.httpApi.send(request);
        for (const middleware of this.configuration.middleware) {
          response = await middleware.post(response);
        }

        return await this.responseProcessor.updateUser(response);
    }


}



