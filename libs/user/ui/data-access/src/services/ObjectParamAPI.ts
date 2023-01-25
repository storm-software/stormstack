import type * as req from "../apis/ObjectParamAPI";
import {
  HttpFile,
  AbstractHttpConfiguration
} from '@open-system/core-typescript-utilities';
import type { ProblemDetailsDto } from '../models';
import type { RecordBaseDto } from '../models';
import type { UpdateSuccessResponseDto } from '../models';
import type { UpdateUserRequestDto } from '../models';
import type { UserAllOfDto } from '../models';
import type { UserDto } from '../models';


export abstract class AbstractObjectUsersApi {
    /**
     * Add a new user
     * Add User
     * @param param the request object
     */
    public abstract addUser(param: req.UsersApiAddUserRequest, options?: AbstractHttpConfiguration): Promise<UpdateSuccessResponseDto>;

    /**
     * Remove an existing user from the system
     * Remove User
     * @param param the request object
     */
    public abstract deleteUser(param: req.UsersApiDeleteUserRequest, options?: AbstractHttpConfiguration): Promise<UpdateSuccessResponseDto>;

    /**
     * An end point that returns data for a specific user
     * Get User
     * @param param the request object
     */
    public abstract getUser(param: req.UsersApiGetUserRequest, options?: AbstractHttpConfiguration): Promise<UserDto>;

    /**
     * An end point that returns the list of users in the system
     * Get Users
     * @param param the request object
     */
    public abstract getUsers(param: req.UsersApiGetUsersRequest, options?: AbstractHttpConfiguration): Promise<Array<UserDto>>;

    /**
     * Update an existing user
     * Update User
     * @param param the request object
     */
    public abstract updateUser(param: req.UsersApiUpdateUserRequest, options?: AbstractHttpConfiguration): Promise<UpdateSuccessResponseDto>;

}
