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
import { GetReaction200ResponseDto } from '../models';
import { GetReactions200ResponseDto } from '../models';
import { ProblemDetailsDto } from '../models';
import { UpdateSuccessResponseDto } from '../models';

/**
 * no description
 */
@injectable()
export class ReactionApiRequestFactory extends APIRequestFactory {

    /**
     * Add a new reaction to an article
     * Add Reaction
     * @param id The id of the article/page
     * @param type The type of reaction the user had
     * @param userId User Id sending request
     */
    public async addReaction(id: string, type: 'LIKE' | 'DISLIKE', userId?: string, _options?: HttpConfiguration): Promise<RequestContext> {
        const _config = _options || this.configuration;

        // verify required parameter 'id' is not null or undefined
        if (id === null || id === undefined) {
            throw new RequiredError("ReactionApi", "addReaction", "id");
        }


        // verify required parameter 'type' is not null or undefined
        if (type === null || type === undefined) {
            throw new RequiredError("ReactionApi", "addReaction", "type");
        }



        // Path Params
        const localVarPath = '/articles/{id}/reactions/{type}'
            .replace('{' + 'id' + '}', encodeURIComponent(String(id)))
            .replace('{' + 'type' + '}', encodeURIComponent(String(type)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        /*
        let authMethod: SecurityAuthentication | undefined;
        // Apply auth methods
        authMethod = _config.authMethods["bearer-token"]
        if (authMethod?.applySecurityAuthentication) {
            await authMethod?.applySecurityAuthentication(requestContext);
        }

*/

        return requestContext;
    }

    /**
     * Remove an existing reaction to an article
     * Remove Reaction
     * @param id The id of the article/page
     * @param type The type of reaction the user had
     * @param userId User Id sending request
     */
    public async deleteReaction(id: string, type: 'LIKE' | 'DISLIKE', userId?: string, _options?: HttpConfiguration): Promise<RequestContext> {
        const _config = _options || this.configuration;

        // verify required parameter 'id' is not null or undefined
        if (id === null || id === undefined) {
            throw new RequiredError("ReactionApi", "deleteReaction", "id");
        }


        // verify required parameter 'type' is not null or undefined
        if (type === null || type === undefined) {
            throw new RequiredError("ReactionApi", "deleteReaction", "type");
        }



        // Path Params
        const localVarPath = '/articles/{id}/reactions/{type}'
            .replace('{' + 'id' + '}', encodeURIComponent(String(id)))
            .replace('{' + 'type' + '}', encodeURIComponent(String(type)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.DELETE);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        /*
        let authMethod: SecurityAuthentication | undefined;
        // Apply auth methods
        authMethod = _config.authMethods["bearer-token"]
        if (authMethod?.applySecurityAuthentication) {
            await authMethod?.applySecurityAuthentication(requestContext);
        }

*/

        return requestContext;
    }

    /**
     * An end point that returns the reactions for an article/page to a client
     * Get Reaction
     * @param id The id of the article/page
     * @param type The type of reaction the user had
     * @param userId User Id sending request
     */
    public async getReaction(id: string, type: 'LIKE' | 'DISLIKE', userId?: string, _options?: HttpConfiguration): Promise<RequestContext> {
        const _config = _options || this.configuration;

        // verify required parameter 'id' is not null or undefined
        if (id === null || id === undefined) {
            throw new RequiredError("ReactionApi", "getReaction", "id");
        }


        // verify required parameter 'type' is not null or undefined
        if (type === null || type === undefined) {
            throw new RequiredError("ReactionApi", "getReaction", "type");
        }



        // Path Params
        const localVarPath = '/articles/{id}/reactions/{type}'
            .replace('{' + 'id' + '}', encodeURIComponent(String(id)))
            .replace('{' + 'type' + '}', encodeURIComponent(String(type)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        /*
        let authMethod: SecurityAuthentication | undefined;
        // Apply auth methods
        authMethod = _config.authMethods["bearer-token"]
        if (authMethod?.applySecurityAuthentication) {
            await authMethod?.applySecurityAuthentication(requestContext);
        }

*/

        return requestContext;
    }

    /**
     * An end point that returns the reactions for an article/page to a client
     * Get Reactions
     * @param id The id of the article/page
     * @param userId User Id sending request
     */
    public async getReactions(id: string, userId?: string, _options?: HttpConfiguration): Promise<RequestContext> {
        const _config = _options || this.configuration;

        // verify required parameter 'id' is not null or undefined
        if (id === null || id === undefined) {
            throw new RequiredError("ReactionApi", "getReactions", "id");
        }



        // Path Params
        const localVarPath = '/articles/{id}/reactions'
            .replace('{' + 'id' + '}', encodeURIComponent(String(id)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        /*
        let authMethod: SecurityAuthentication | undefined;
        // Apply auth methods
        authMethod = _config.authMethods["bearer-token"]
        if (authMethod?.applySecurityAuthentication) {
            await authMethod?.applySecurityAuthentication(requestContext);
        }

*/

        return requestContext;
    }

}

@injectable()
export class ReactionApiResponseProcessor {

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to addReaction
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async addReaction(response: ResponseContext): Promise<UpdateSuccessResponseDto > {
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
     * @params response Response returned by the server for a request to deleteReaction
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async deleteReaction(response: ResponseContext): Promise<UpdateSuccessResponseDto > {
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
     * @params response Response returned by the server for a request to getReaction
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getReaction(response: ResponseContext): Promise<GetReaction200ResponseDto > {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: GetReaction200ResponseDto = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GetReaction200ResponseDto", "", enumsMap, typeMap
            ) as GetReaction200ResponseDto;
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
            const body: GetReaction200ResponseDto = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GetReaction200ResponseDto", "", enumsMap, typeMap
            ) as GetReaction200ResponseDto;
            return body;
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getReactions
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getReactions(response: ResponseContext): Promise<GetReactions200ResponseDto > {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: GetReactions200ResponseDto = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GetReactions200ResponseDto", "", enumsMap, typeMap
            ) as GetReactions200ResponseDto;
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
            const body: GetReactions200ResponseDto = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GetReactions200ResponseDto", "", enumsMap, typeMap
            ) as GetReactions200ResponseDto;
            return body;
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

}
