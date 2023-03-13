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
  isStringSet,
  isEmpty,
  isString,
  isEmptyObject
} from '@open-system/core-typescript-utilities';
import { enumsMap, typeMap } from '../models/ObjectSerializer';
import { AddReactionRequest } from '../models';
import { CommandSuccessResponse } from '../models';
import { GetReactions200Response } from '../models';
import { GetReactionsCount200Response } from '../models';
import { ProblemDetailsResponse } from '../models';

/**
 * ReactionApiRequestFactory
 * no description
 */
export class ReactionApiRequestFactory {
    /**
     * Add a new reaction to an article
     * Add Reaction
     * @param contentId The id of the article/comment
     * @param addReactionRequest 
     */
    public static addReaction({ contentId = undefined, body  }: { contentId?: string; body?: AddReactionRequest;  }): RequestContext {
        // verify required parameter 'contentId' is not null or undefined
        if ((isString(contentId) && !isStringSet(contentId)) || isEmpty(contentId)) {
            throw new RequiredError("ReactionApi",
              "addReaction",
              "contentId");
        }
        if (isEmptyObject(body)) {
            throw new RequiredError("ReactionApi",
              "addReaction",
              "body");
        }

        // Make Request Context
        const requestContext = RequestContext.create('/reactions/{contentId}'
            .replace('{' + 'contentId' + '}',
              encodeURIComponent(String(contentId))),
          HttpMethod.POST);
        requestContext.setHeaderParam("Accept",
          "application/json, */*;q=0.8");



        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type",
            contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(body,
              "AddReactionRequest",
              "",
              enumsMap,
              typeMap),
            contentType
        );
        requestContext.setBody(serializedBody);

        /*
*/

        return requestContext;
    }

    /**
     * Return the reactions for a specific article, comment, etc. 
     * Get Reactions
     * @param contentId The id of the article/comment
     * @param pageNumber The current page number of the selected data
     * @param pageSize The maximum amount of data to return in one request
     * @param orderBy The field to order the request by
     * @param type The type of reaction the user had
     */
    public static getReactions({ contentId = undefined, pageNumber = 1, pageSize = 200, orderBy = 'id', type = undefined }: { contentId?: string; pageNumber?: number; pageSize?: number; orderBy?: string; type?: 'like' | 'dislike' | 'laugh' | 'cry';  }): RequestContext {
        // verify required parameter 'contentId' is not null or undefined
        if ((isString(contentId) && !isStringSet(contentId)) || isEmpty(contentId)) {
            throw new RequiredError("ReactionApi",
              "getReactions",
              "contentId");
        }
        // verify required parameter 'pageNumber' is not null or undefined
        if ((isString(pageNumber) && !isStringSet(pageNumber)) || isEmpty(pageNumber)) {
            throw new RequiredError("ReactionApi",
              "getReactions",
              "pageNumber");
        }
        // verify required parameter 'pageSize' is not null or undefined
        if ((isString(pageSize) && !isStringSet(pageSize)) || isEmpty(pageSize)) {
            throw new RequiredError("ReactionApi",
              "getReactions",
              "pageSize");
        }
        // verify required parameter 'orderBy' is not null or undefined
        if ((isString(orderBy) && !isStringSet(orderBy)) || isEmpty(orderBy)) {
            throw new RequiredError("ReactionApi",
              "getReactions",
              "orderBy");
        }

        // Make Request Context
        const requestContext = RequestContext.create('/reactions/{contentId}'
            .replace('{' + 'contentId' + '}',
              encodeURIComponent(String(contentId))),
          HttpMethod.GET);
        requestContext.setHeaderParam("Accept",
          "application/json, */*;q=0.8");


        // Query Params
        if (pageNumber !== undefined) {
            requestContext.setQueryParam("pageNumber",
              ObjectSerializer.serialize(pageNumber,
                "number",
                "",
                enumsMap,
                typeMap));
        }

        // Query Params
        if (pageSize !== undefined) {
            requestContext.setQueryParam("pageSize",
              ObjectSerializer.serialize(pageSize,
                "number",
                "",
                enumsMap,
                typeMap));
        }

        // Query Params
        if (orderBy !== undefined) {
            requestContext.setQueryParam("orderBy",
              ObjectSerializer.serialize(orderBy,
                "string",
                "",
                enumsMap,
                typeMap));
        }

        // Query Params
        if (type !== undefined) {
            requestContext.setQueryParam("type",
              ObjectSerializer.serialize(type,
                "'like' | 'dislike' | 'laugh' | 'cry'",
                "",
                enumsMap,
                typeMap));
        }


        /*
*/

        return requestContext;
    }

    /**
     * Return the reaction counts for a specific article, comment, etc. 
     * Get Reaction Counts
     * @param contentId The id of the article/comment
     * @param type The type of reaction the user had
     */
    public static getReactionsCount({ contentId = undefined, type = undefined }: { contentId?: string; type?: 'like' | 'dislike' | 'laugh' | 'cry';  }): RequestContext {
        // verify required parameter 'contentId' is not null or undefined
        if ((isString(contentId) && !isStringSet(contentId)) || isEmpty(contentId)) {
            throw new RequiredError("ReactionApi",
              "getReactionsCount",
              "contentId");
        }

        // Make Request Context
        const requestContext = RequestContext.create('/reactions/{contentId}/count'
            .replace('{' + 'contentId' + '}',
              encodeURIComponent(String(contentId))),
          HttpMethod.GET);
        requestContext.setHeaderParam("Accept",
          "application/json, */*;q=0.8");


        // Query Params
        if (type !== undefined) {
            requestContext.setQueryParam("type",
              ObjectSerializer.serialize(type,
                "'like' | 'dislike' | 'laugh' | 'cry'",
                "",
                enumsMap,
                typeMap));
        }


        /*
*/

        return requestContext;
    }

    /**
     * Remove an existing reaction to an article
     * Remove Reaction
     * @param contentId The id of the article/comment
     */
    public static removeReaction({ contentId = undefined }: { contentId?: string;  }): RequestContext {
        // verify required parameter 'contentId' is not null or undefined
        if ((isString(contentId) && !isStringSet(contentId)) || isEmpty(contentId)) {
            throw new RequiredError("ReactionApi",
              "removeReaction",
              "contentId");
        }

        // Make Request Context
        const requestContext = RequestContext.create('/reactions/{contentId}'
            .replace('{' + 'contentId' + '}',
              encodeURIComponent(String(contentId))),
          HttpMethod.DELETE);
        requestContext.setHeaderParam("Accept",
          "application/json, */*;q=0.8");



        /*
*/

        return requestContext;
    }

}

/**
 * ReactionApiResponseProcessor
 * no description
 */
export class ReactionApiResponseProcessor {
    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to addReaction
     * @throws ApiException if the response code was not in [200, 299]
     */
     public static async addReaction(response: ResponseContext<CommandSuccessResponse >): Promise<CommandSuccessResponse > {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: CommandSuccessResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(),
                  contentType),
                "CommandSuccessResponse",
                "",
                enumsMap,
                typeMap) as CommandSuccessResponse;
            return body;
        }
        if (isCodeInRange("401", response.httpStatusCode)) {
            const body: ProblemDetailsResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(),
                  contentType),
                "ProblemDetailsResponse",
                "",
                enumsMap,
                typeMap) as ProblemDetailsResponse;
            throw new ApiException<ProblemDetailsResponse>(response.httpStatusCode,
              "Unauthorized",
              body,
              response.headers);
        }
        if (isCodeInRange("404", response.httpStatusCode)) {
            const body: ProblemDetailsResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(),
                  contentType),
                "ProblemDetailsResponse",
                "",
                enumsMap,
                typeMap) as ProblemDetailsResponse;
            throw new ApiException<ProblemDetailsResponse>(response.httpStatusCode,
              "Not Found",
              body,
              response.headers);
        }
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ProblemDetailsResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(),
                  contentType),
                "ProblemDetailsResponse",
                "",
                enumsMap,
                typeMap) as ProblemDetailsResponse;
            throw new ApiException<ProblemDetailsResponse>(response.httpStatusCode,
              "Internal Server Error",
              body,
              response.headers);
        }
        if (isCodeInRange("503", response.httpStatusCode)) {
            const body: ProblemDetailsResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(),
                  contentType),
                "ProblemDetailsResponse",
                "",
                enumsMap,
                typeMap) as ProblemDetailsResponse;
            throw new ApiException<ProblemDetailsResponse>(response.httpStatusCode,
              "Service Unavailable",
              body,
              response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: CommandSuccessResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(),
                  contentType),
                "CommandSuccessResponse",
                "",
                enumsMap,
                typeMap) as CommandSuccessResponse;
            return body;
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode,
          "Unknown API Status Code!",
          await response.getBodyAsAny(),
          response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getReactions
     * @throws ApiException if the response code was not in [200, 299]
     */
     public static async getReactions(response: ResponseContext<GetReactions200Response >): Promise<GetReactions200Response > {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: GetReactions200Response = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(),
                  contentType),
                "GetReactions200Response",
                "",
                enumsMap,
                typeMap) as GetReactions200Response;
            return body;
        }
        if (isCodeInRange("401", response.httpStatusCode)) {
            const body: ProblemDetailsResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(),
                  contentType),
                "ProblemDetailsResponse",
                "",
                enumsMap,
                typeMap) as ProblemDetailsResponse;
            throw new ApiException<ProblemDetailsResponse>(response.httpStatusCode,
              "Unauthorized",
              body,
              response.headers);
        }
        if (isCodeInRange("404", response.httpStatusCode)) {
            const body: ProblemDetailsResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(),
                  contentType),
                "ProblemDetailsResponse",
                "",
                enumsMap,
                typeMap) as ProblemDetailsResponse;
            throw new ApiException<ProblemDetailsResponse>(response.httpStatusCode,
              "Not Found",
              body,
              response.headers);
        }
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ProblemDetailsResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(),
                  contentType),
                "ProblemDetailsResponse",
                "",
                enumsMap,
                typeMap) as ProblemDetailsResponse;
            throw new ApiException<ProblemDetailsResponse>(response.httpStatusCode,
              "Internal Server Error",
              body,
              response.headers);
        }
        if (isCodeInRange("503", response.httpStatusCode)) {
            const body: ProblemDetailsResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(),
                  contentType),
                "ProblemDetailsResponse",
                "",
                enumsMap,
                typeMap) as ProblemDetailsResponse;
            throw new ApiException<ProblemDetailsResponse>(response.httpStatusCode,
              "Service Unavailable",
              body,
              response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: GetReactions200Response = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(),
                  contentType),
                "GetReactions200Response",
                "",
                enumsMap,
                typeMap) as GetReactions200Response;
            return body;
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode,
          "Unknown API Status Code!",
          await response.getBodyAsAny(),
          response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getReactionsCount
     * @throws ApiException if the response code was not in [200, 299]
     */
     public static async getReactionsCount(response: ResponseContext<GetReactionsCount200Response >): Promise<GetReactionsCount200Response > {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: GetReactionsCount200Response = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(),
                  contentType),
                "GetReactionsCount200Response",
                "",
                enumsMap,
                typeMap) as GetReactionsCount200Response;
            return body;
        }
        if (isCodeInRange("401", response.httpStatusCode)) {
            const body: ProblemDetailsResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(),
                  contentType),
                "ProblemDetailsResponse",
                "",
                enumsMap,
                typeMap) as ProblemDetailsResponse;
            throw new ApiException<ProblemDetailsResponse>(response.httpStatusCode,
              "Unauthorized",
              body,
              response.headers);
        }
        if (isCodeInRange("404", response.httpStatusCode)) {
            const body: ProblemDetailsResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(),
                  contentType),
                "ProblemDetailsResponse",
                "",
                enumsMap,
                typeMap) as ProblemDetailsResponse;
            throw new ApiException<ProblemDetailsResponse>(response.httpStatusCode,
              "Not Found",
              body,
              response.headers);
        }
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ProblemDetailsResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(),
                  contentType),
                "ProblemDetailsResponse",
                "",
                enumsMap,
                typeMap) as ProblemDetailsResponse;
            throw new ApiException<ProblemDetailsResponse>(response.httpStatusCode,
              "Internal Server Error",
              body,
              response.headers);
        }
        if (isCodeInRange("503", response.httpStatusCode)) {
            const body: ProblemDetailsResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(),
                  contentType),
                "ProblemDetailsResponse",
                "",
                enumsMap,
                typeMap) as ProblemDetailsResponse;
            throw new ApiException<ProblemDetailsResponse>(response.httpStatusCode,
              "Service Unavailable",
              body,
              response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: GetReactionsCount200Response = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(),
                  contentType),
                "GetReactionsCount200Response",
                "",
                enumsMap,
                typeMap) as GetReactionsCount200Response;
            return body;
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode,
          "Unknown API Status Code!",
          await response.getBodyAsAny(),
          response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to removeReaction
     * @throws ApiException if the response code was not in [200, 299]
     */
     public static async removeReaction(response: ResponseContext<CommandSuccessResponse >): Promise<CommandSuccessResponse > {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: CommandSuccessResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(),
                  contentType),
                "CommandSuccessResponse",
                "",
                enumsMap,
                typeMap) as CommandSuccessResponse;
            return body;
        }
        if (isCodeInRange("401", response.httpStatusCode)) {
            const body: ProblemDetailsResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(),
                  contentType),
                "ProblemDetailsResponse",
                "",
                enumsMap,
                typeMap) as ProblemDetailsResponse;
            throw new ApiException<ProblemDetailsResponse>(response.httpStatusCode,
              "Unauthorized",
              body,
              response.headers);
        }
        if (isCodeInRange("404", response.httpStatusCode)) {
            const body: ProblemDetailsResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(),
                  contentType),
                "ProblemDetailsResponse",
                "",
                enumsMap,
                typeMap) as ProblemDetailsResponse;
            throw new ApiException<ProblemDetailsResponse>(response.httpStatusCode,
              "Not Found",
              body,
              response.headers);
        }
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ProblemDetailsResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(),
                  contentType),
                "ProblemDetailsResponse",
                "",
                enumsMap,
                typeMap) as ProblemDetailsResponse;
            throw new ApiException<ProblemDetailsResponse>(response.httpStatusCode,
              "Internal Server Error",
              body,
              response.headers);
        }
        if (isCodeInRange("503", response.httpStatusCode)) {
            const body: ProblemDetailsResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(),
                  contentType),
                "ProblemDetailsResponse",
                "",
                enumsMap,
                typeMap) as ProblemDetailsResponse;
            throw new ApiException<ProblemDetailsResponse>(response.httpStatusCode,
              "Service Unavailable",
              body,
              response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: CommandSuccessResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(),
                  contentType),
                "CommandSuccessResponse",
                "",
                enumsMap,
                typeMap) as CommandSuccessResponse;
            return body;
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode,
          "Unknown API Status Code!",
          await response.getBodyAsAny(),
          response.headers);
    }

}
