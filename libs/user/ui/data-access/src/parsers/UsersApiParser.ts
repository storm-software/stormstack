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
  ObjectSerializer,
  SecurityAuthentication,
  APIRequestFactory,
  HttpConfiguration
} from '@open-system/core-typescript-utilities';
import { enumsMap, typeMap } from '../models/ObjectSerializer';
import { injectable } from "inversify";
import { ProblemDetailsDto } from '../models';
import { UpdateSuccessResponseDto } from '../models';
import { UpdateUserRequestDto } from '../models';
import { UserDto } from '../models';

/**
 * no description
 */
@injectable()
export class UsersApiRequestFactory extends APIRequestFactory {

    /**
     * Add a new user
     * Add User
     * @param userId The unique Id used to identify the user
     * @param updateUserRequestDto 
     */
    public async addUser(userId: string, updateUserRequestDto?: UpdateUserRequestDto, _options?: HttpConfiguration): Promise<RequestContext> {
        const _config = _options || this.configuration;

        // verify required parameter 'userId' is not null or undefined
        if (userId === null || userId === undefined) {
            throw new RequiredError("UsersApi", "addUser", "userId");
        }



        // Path Params
        const localVarPath = '/users/{userId}'
            .replace('{' + 'userId' + '}', encodeURIComponent(String(userId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(updateUserRequestDto, "UpdateUserRequestDto", "", enumsMap, typeMap),
            contentType
        );
        requestContext.setBody(serializedBody);

        /*
*/

        return requestContext;
    }

    /**
     * Remove an existing user from the system
     * Remove User
     * @param userId The unique Id used to identify the user
     */
    public async deleteUser(userId: string, _options?: HttpConfiguration): Promise<RequestContext> {
        const _config = _options || this.configuration;

        // verify required parameter 'userId' is not null or undefined
        if (userId === null || userId === undefined) {
            throw new RequiredError("UsersApi", "deleteUser", "userId");
        }


        // Path Params
        const localVarPath = '/users/{userId}'
            .replace('{' + 'userId' + '}', encodeURIComponent(String(userId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.DELETE);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        /*
*/

        return requestContext;
    }

    /**
     * An end point that returns data for a specific user
     * Get User
     * @param userId The unique Id used to identify the user
     */
    public async getUser(userId: string, _options?: HttpConfiguration): Promise<RequestContext> {
        const _config = _options || this.configuration;

        // verify required parameter 'userId' is not null or undefined
        if (userId === null || userId === undefined) {
            throw new RequiredError("UsersApi", "getUser", "userId");
        }


        // Path Params
        const localVarPath = '/users/{userId}'
            .replace('{' + 'userId' + '}', encodeURIComponent(String(userId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        /*
*/

        return requestContext;
    }

    /**
     * An end point that returns the list of users in the system
     * Get Users
     * @param userId The unique Id used to identify the user
     * @param type The type of the user
     */
    public async getUsers(userId: string, type?: 'guest' | 'internal' | 'external', _options?: HttpConfiguration): Promise<RequestContext> {
        const _config = _options || this.configuration;

        // verify required parameter 'userId' is not null or undefined
        if (userId === null || userId === undefined) {
            throw new RequiredError("UsersApi", "getUsers", "userId");
        }



        // Path Params
        const localVarPath = '/users'
            .replace('{' + 'userId' + '}', encodeURIComponent(String(userId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (type !== undefined) {
            requestContext.setQueryParam("type", ObjectSerializer.serialize(type, "'guest' | 'internal' | 'external'", "", enumsMap, typeMap));
        }


        /*
*/

        return requestContext;
    }

    /**
     * Update an existing user
     * Update User
     * @param userId The unique Id used to identify the user
     * @param updateUserRequestDto 
     */
    public async updateUser(userId: string, updateUserRequestDto?: UpdateUserRequestDto, _options?: HttpConfiguration): Promise<RequestContext> {
        const _config = _options || this.configuration;

        // verify required parameter 'userId' is not null or undefined
        if (userId === null || userId === undefined) {
            throw new RequiredError("UsersApi", "updateUser", "userId");
        }



        // Path Params
        const localVarPath = '/users/{userId}'
            .replace('{' + 'userId' + '}', encodeURIComponent(String(userId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.PUT);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(updateUserRequestDto, "UpdateUserRequestDto", "", enumsMap, typeMap),
            contentType
        );
        requestContext.setBody(serializedBody);

        /*
*/

        return requestContext;
    }

}

@injectable()
export class UsersApiResponseProcessor {

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to addUser
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async addUser(response: ResponseContext): Promise<UpdateSuccessResponseDto > {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: UpdateSuccessResponseDto = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "UpdateSuccessResponseDto", "", enumsMap, typeMap
            ) as UpdateSuccessResponseDto;
            return body;
        }
        if (isCodeInRange("401", response.httpStatusCode)) {
            const body: ProblemDetailsDto = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ProblemDetailsDto", "", enumsMap, typeMap
            ) as ProblemDetailsDto;
            throw new ApiException<ProblemDetailsDto>(response.httpStatusCode, "Unauthorized", body, response.headers);
        }
        if (isCodeInRange("404", response.httpStatusCode)) {
            const body: ProblemDetailsDto = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ProblemDetailsDto", "", enumsMap, typeMap
            ) as ProblemDetailsDto;
            throw new ApiException<ProblemDetailsDto>(response.httpStatusCode, "Not Found", body, response.headers);
        }
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ProblemDetailsDto = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ProblemDetailsDto", "", enumsMap, typeMap
            ) as ProblemDetailsDto;
            throw new ApiException<ProblemDetailsDto>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("503", response.httpStatusCode)) {
            const body: ProblemDetailsDto = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ProblemDetailsDto", "", enumsMap, typeMap
            ) as ProblemDetailsDto;
            throw new ApiException<ProblemDetailsDto>(response.httpStatusCode, "Service Unavailable", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: UpdateSuccessResponseDto = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "UpdateSuccessResponseDto", "", enumsMap, typeMap
            ) as UpdateSuccessResponseDto;
            return body;
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to deleteUser
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async deleteUser(response: ResponseContext): Promise<UpdateSuccessResponseDto > {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: UpdateSuccessResponseDto = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "UpdateSuccessResponseDto", "", enumsMap, typeMap
            ) as UpdateSuccessResponseDto;
            return body;
        }
        if (isCodeInRange("401", response.httpStatusCode)) {
            const body: ProblemDetailsDto = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ProblemDetailsDto", "", enumsMap, typeMap
            ) as ProblemDetailsDto;
            throw new ApiException<ProblemDetailsDto>(response.httpStatusCode, "Unauthorized", body, response.headers);
        }
        if (isCodeInRange("404", response.httpStatusCode)) {
            const body: ProblemDetailsDto = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ProblemDetailsDto", "", enumsMap, typeMap
            ) as ProblemDetailsDto;
            throw new ApiException<ProblemDetailsDto>(response.httpStatusCode, "Not Found", body, response.headers);
        }
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ProblemDetailsDto = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ProblemDetailsDto", "", enumsMap, typeMap
            ) as ProblemDetailsDto;
            throw new ApiException<ProblemDetailsDto>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("503", response.httpStatusCode)) {
            const body: ProblemDetailsDto = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ProblemDetailsDto", "", enumsMap, typeMap
            ) as ProblemDetailsDto;
            throw new ApiException<ProblemDetailsDto>(response.httpStatusCode, "Service Unavailable", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: UpdateSuccessResponseDto = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "UpdateSuccessResponseDto", "", enumsMap, typeMap
            ) as UpdateSuccessResponseDto;
            return body;
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getUser
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getUser(response: ResponseContext): Promise<UserDto > {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: UserDto = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "UserDto", "", enumsMap, typeMap
            ) as UserDto;
            return body;
        }
        if (isCodeInRange("401", response.httpStatusCode)) {
            const body: ProblemDetailsDto = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ProblemDetailsDto", "", enumsMap, typeMap
            ) as ProblemDetailsDto;
            throw new ApiException<ProblemDetailsDto>(response.httpStatusCode, "Unauthorized", body, response.headers);
        }
        if (isCodeInRange("404", response.httpStatusCode)) {
            const body: ProblemDetailsDto = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ProblemDetailsDto", "", enumsMap, typeMap
            ) as ProblemDetailsDto;
            throw new ApiException<ProblemDetailsDto>(response.httpStatusCode, "Not Found", body, response.headers);
        }
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ProblemDetailsDto = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ProblemDetailsDto", "", enumsMap, typeMap
            ) as ProblemDetailsDto;
            throw new ApiException<ProblemDetailsDto>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("503", response.httpStatusCode)) {
            const body: ProblemDetailsDto = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ProblemDetailsDto", "", enumsMap, typeMap
            ) as ProblemDetailsDto;
            throw new ApiException<ProblemDetailsDto>(response.httpStatusCode, "Service Unavailable", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: UserDto = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "UserDto", "", enumsMap, typeMap
            ) as UserDto;
            return body;
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getUsers
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getUsers(response: ResponseContext): Promise<Array<UserDto> > {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: Array<UserDto> = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Array<UserDto>", "", enumsMap, typeMap
            ) as Array<UserDto>;
            return body;
        }
        if (isCodeInRange("401", response.httpStatusCode)) {
            const body: ProblemDetailsDto = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ProblemDetailsDto", "", enumsMap, typeMap
            ) as ProblemDetailsDto;
            throw new ApiException<ProblemDetailsDto>(response.httpStatusCode, "Unauthorized", body, response.headers);
        }
        if (isCodeInRange("404", response.httpStatusCode)) {
            const body: ProblemDetailsDto = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ProblemDetailsDto", "", enumsMap, typeMap
            ) as ProblemDetailsDto;
            throw new ApiException<ProblemDetailsDto>(response.httpStatusCode, "Not Found", body, response.headers);
        }
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ProblemDetailsDto = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ProblemDetailsDto", "", enumsMap, typeMap
            ) as ProblemDetailsDto;
            throw new ApiException<ProblemDetailsDto>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("503", response.httpStatusCode)) {
            const body: ProblemDetailsDto = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ProblemDetailsDto", "", enumsMap, typeMap
            ) as ProblemDetailsDto;
            throw new ApiException<ProblemDetailsDto>(response.httpStatusCode, "Service Unavailable", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: Array<UserDto> = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Array<UserDto>", "", enumsMap, typeMap
            ) as Array<UserDto>;
            return body;
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to updateUser
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async updateUser(response: ResponseContext): Promise<UpdateSuccessResponseDto > {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: UpdateSuccessResponseDto = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "UpdateSuccessResponseDto", "", enumsMap, typeMap
            ) as UpdateSuccessResponseDto;
            return body;
        }
        if (isCodeInRange("401", response.httpStatusCode)) {
            const body: ProblemDetailsDto = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ProblemDetailsDto", "", enumsMap, typeMap
            ) as ProblemDetailsDto;
            throw new ApiException<ProblemDetailsDto>(response.httpStatusCode, "Unauthorized", body, response.headers);
        }
        if (isCodeInRange("404", response.httpStatusCode)) {
            const body: ProblemDetailsDto = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ProblemDetailsDto", "", enumsMap, typeMap
            ) as ProblemDetailsDto;
            throw new ApiException<ProblemDetailsDto>(response.httpStatusCode, "Not Found", body, response.headers);
        }
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ProblemDetailsDto = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ProblemDetailsDto", "", enumsMap, typeMap
            ) as ProblemDetailsDto;
            throw new ApiException<ProblemDetailsDto>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("503", response.httpStatusCode)) {
            const body: ProblemDetailsDto = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ProblemDetailsDto", "", enumsMap, typeMap
            ) as ProblemDetailsDto;
            throw new ApiException<ProblemDetailsDto>(response.httpStatusCode, "Service Unavailable", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: UpdateSuccessResponseDto = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "UpdateSuccessResponseDto", "", enumsMap, typeMap
            ) as UpdateSuccessResponseDto;
            return body;
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

}
