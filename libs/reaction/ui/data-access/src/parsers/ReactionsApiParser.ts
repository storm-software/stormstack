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
  HttpConfiguration,
} from "@open-system/core-typescript-utilities";
import { enumsMap, typeMap } from "../models/ObjectSerializer";
import { injectable } from "inversify";
import { GetArticleReaction200Response } from "../models";
import { GetArticleReactions200Response } from "../models";
import { ProblemDetails } from "../models";
import { UpdateSuccessResponse } from "../models";

/**
 * no description
 */
@injectable()
export class ReactionsApiRequestFactory extends APIRequestFactory {
  /**
   * Add a new reaction to an article
   * Add Reaction
   * @param id The id of the article/page
   * @param type The type of reaction the user had
   * @param userId The id of the current user sending the request
   */
  public async addArticleReaction(
    id: string,
    type: "like" | "dislike" | "happy" | "sad" | "laugh" | "cry",
    userId: string,
    _options?: HttpConfiguration
  ): Promise<RequestContext> {
    const _config = _options || this.configuration;

    // verify required parameter 'id' is not null or undefined
    if (id === null || id === undefined) {
      throw new RequiredError("ReactionsApi", "addArticleReaction", "id");
    }

    // verify required parameter 'type' is not null or undefined
    if (type === null || type === undefined) {
      throw new RequiredError("ReactionsApi", "addArticleReaction", "type");
    }

    // verify required parameter 'userId' is not null or undefined
    if (userId === null || userId === undefined) {
      throw new RequiredError("ReactionsApi", "addArticleReaction", "userId");
    }

    // Path Params
    const localVarPath = "/article/{id}/reaction/{type}"
      .replace("{" + "id" + "}", encodeURIComponent(String(id)))
      .replace("{" + "type" + "}", encodeURIComponent(String(type)));

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(
      localVarPath,
      HttpMethod.POST
    );
    requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");

    // Header Params
    requestContext.setHeaderParam(
      "userId",
      ObjectSerializer.serialize(userId, "string", "", enumsMap, typeMap)
    );

    /*
     */

    return requestContext;
  }

  /**
   * Remove an existing reaction to an article
   * Remove Reaction
   * @param id The id of the article/page
   * @param type The type of reaction the user had
   * @param userId The id of the current user sending the request
   */
  public async deleteArticleReaction(
    id: string,
    type: "like" | "dislike" | "happy" | "sad" | "laugh" | "cry",
    userId: string,
    _options?: HttpConfiguration
  ): Promise<RequestContext> {
    const _config = _options || this.configuration;

    // verify required parameter 'id' is not null or undefined
    if (id === null || id === undefined) {
      throw new RequiredError("ReactionsApi", "deleteArticleReaction", "id");
    }

    // verify required parameter 'type' is not null or undefined
    if (type === null || type === undefined) {
      throw new RequiredError("ReactionsApi", "deleteArticleReaction", "type");
    }

    // verify required parameter 'userId' is not null or undefined
    if (userId === null || userId === undefined) {
      throw new RequiredError(
        "ReactionsApi",
        "deleteArticleReaction",
        "userId"
      );
    }

    // Path Params
    const localVarPath = "/article/{id}/reaction/{type}"
      .replace("{" + "id" + "}", encodeURIComponent(String(id)))
      .replace("{" + "type" + "}", encodeURIComponent(String(type)));

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(
      localVarPath,
      HttpMethod.DELETE
    );
    requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");

    // Header Params
    requestContext.setHeaderParam(
      "userId",
      ObjectSerializer.serialize(userId, "string", "", enumsMap, typeMap)
    );

    /*
     */

    return requestContext;
  }

  /**
   * An end point that returns the reactions for an article/page to a client
   * Get Reaction
   * @param id The id of the article/page
   * @param type The type of reaction the user had
   * @param userId The id of the current user sending the request
   */
  public async getArticleReaction(
    id: string,
    type: "like" | "dislike" | "happy" | "sad" | "laugh" | "cry",
    userId: string,
    _options?: HttpConfiguration
  ): Promise<RequestContext> {
    const _config = _options || this.configuration;

    // verify required parameter 'id' is not null or undefined
    if (id === null || id === undefined) {
      throw new RequiredError("ReactionsApi", "getArticleReaction", "id");
    }

    // verify required parameter 'type' is not null or undefined
    if (type === null || type === undefined) {
      throw new RequiredError("ReactionsApi", "getArticleReaction", "type");
    }

    // verify required parameter 'userId' is not null or undefined
    if (userId === null || userId === undefined) {
      throw new RequiredError("ReactionsApi", "getArticleReaction", "userId");
    }

    // Path Params
    const localVarPath = "/article/{id}/reaction/{type}"
      .replace("{" + "id" + "}", encodeURIComponent(String(id)))
      .replace("{" + "type" + "}", encodeURIComponent(String(type)));

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(
      localVarPath,
      HttpMethod.GET
    );
    requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");

    // Header Params
    requestContext.setHeaderParam(
      "userId",
      ObjectSerializer.serialize(userId, "string", "", enumsMap, typeMap)
    );

    /*
     */

    return requestContext;
  }

  /**
   * An end point that returns the reactions for an article/page to a client
   * Get Article Reactions
   * @param id The id of the article/page
   * @param userId The id of the current user sending the request
   */
  public async getArticleReactions(
    id: string,
    userId: string,
    _options?: HttpConfiguration
  ): Promise<RequestContext> {
    const _config = _options || this.configuration;

    // verify required parameter 'id' is not null or undefined
    if (id === null || id === undefined) {
      throw new RequiredError("ReactionsApi", "getArticleReactions", "id");
    }

    // verify required parameter 'userId' is not null or undefined
    if (userId === null || userId === undefined) {
      throw new RequiredError("ReactionsApi", "getArticleReactions", "userId");
    }

    // Path Params
    const localVarPath = "/article/{id}".replace(
      "{" + "id" + "}",
      encodeURIComponent(String(id))
    );

    // Make Request Context
    const requestContext = _config.baseServer.makeRequestContext(
      localVarPath,
      HttpMethod.GET
    );
    requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");

    // Header Params
    requestContext.setHeaderParam(
      "userId",
      ObjectSerializer.serialize(userId, "string", "", enumsMap, typeMap)
    );

    /*
     */

    return requestContext;
  }
}

@injectable()
export class ReactionsApiResponseProcessor {
  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to addArticleReaction
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async addArticleReaction(
    response: ResponseContext
  ): Promise<UpdateSuccessResponse> {
    const contentType = ObjectSerializer.normalizeMediaType(
      response.headers["content-type"]
    );
    if (isCodeInRange("200", response.httpStatusCode)) {
      const body: UpdateSuccessResponse = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        "UpdateSuccessResponse",
        "",
        enumsMap,
        typeMap
      ) as UpdateSuccessResponse;
      return body;
    }
    if (isCodeInRange("401", response.httpStatusCode)) {
      const body: ProblemDetails = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        "ProblemDetails",
        "",
        enumsMap,
        typeMap
      ) as ProblemDetails;
      throw new ApiException<ProblemDetails>(
        response.httpStatusCode,
        "Unauthorized",
        body,
        response.headers
      );
    }
    if (isCodeInRange("404", response.httpStatusCode)) {
      const body: ProblemDetails = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        "ProblemDetails",
        "",
        enumsMap,
        typeMap
      ) as ProblemDetails;
      throw new ApiException<ProblemDetails>(
        response.httpStatusCode,
        "Not Found",
        body,
        response.headers
      );
    }
    if (isCodeInRange("500", response.httpStatusCode)) {
      const body: ProblemDetails = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        "ProblemDetails",
        "",
        enumsMap,
        typeMap
      ) as ProblemDetails;
      throw new ApiException<ProblemDetails>(
        response.httpStatusCode,
        "Internal Server Error",
        body,
        response.headers
      );
    }
    if (isCodeInRange("503", response.httpStatusCode)) {
      const body: ProblemDetails = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        "ProblemDetails",
        "",
        enumsMap,
        typeMap
      ) as ProblemDetails;
      throw new ApiException<ProblemDetails>(
        response.httpStatusCode,
        "Service Unavailable",
        body,
        response.headers
      );
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: UpdateSuccessResponse = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        "UpdateSuccessResponse",
        "",
        enumsMap,
        typeMap
      ) as UpdateSuccessResponse;
      return body;
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      "Unknown API Status Code!",
      await response.getBodyAsAny(),
      response.headers
    );
  }

  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to deleteArticleReaction
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async deleteArticleReaction(
    response: ResponseContext
  ): Promise<UpdateSuccessResponse> {
    const contentType = ObjectSerializer.normalizeMediaType(
      response.headers["content-type"]
    );
    if (isCodeInRange("200", response.httpStatusCode)) {
      const body: UpdateSuccessResponse = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        "UpdateSuccessResponse",
        "",
        enumsMap,
        typeMap
      ) as UpdateSuccessResponse;
      return body;
    }
    if (isCodeInRange("401", response.httpStatusCode)) {
      const body: ProblemDetails = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        "ProblemDetails",
        "",
        enumsMap,
        typeMap
      ) as ProblemDetails;
      throw new ApiException<ProblemDetails>(
        response.httpStatusCode,
        "Unauthorized",
        body,
        response.headers
      );
    }
    if (isCodeInRange("404", response.httpStatusCode)) {
      const body: ProblemDetails = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        "ProblemDetails",
        "",
        enumsMap,
        typeMap
      ) as ProblemDetails;
      throw new ApiException<ProblemDetails>(
        response.httpStatusCode,
        "Not Found",
        body,
        response.headers
      );
    }
    if (isCodeInRange("500", response.httpStatusCode)) {
      const body: ProblemDetails = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        "ProblemDetails",
        "",
        enumsMap,
        typeMap
      ) as ProblemDetails;
      throw new ApiException<ProblemDetails>(
        response.httpStatusCode,
        "Internal Server Error",
        body,
        response.headers
      );
    }
    if (isCodeInRange("503", response.httpStatusCode)) {
      const body: ProblemDetails = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        "ProblemDetails",
        "",
        enumsMap,
        typeMap
      ) as ProblemDetails;
      throw new ApiException<ProblemDetails>(
        response.httpStatusCode,
        "Service Unavailable",
        body,
        response.headers
      );
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: UpdateSuccessResponse = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        "UpdateSuccessResponse",
        "",
        enumsMap,
        typeMap
      ) as UpdateSuccessResponse;
      return body;
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      "Unknown API Status Code!",
      await response.getBodyAsAny(),
      response.headers
    );
  }

  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to getArticleReaction
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async getArticleReaction(
    response: ResponseContext
  ): Promise<GetArticleReaction200Response> {
    const contentType = ObjectSerializer.normalizeMediaType(
      response.headers["content-type"]
    );
    if (isCodeInRange("200", response.httpStatusCode)) {
      const body: GetArticleReaction200Response = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        "GetArticleReaction200Response",
        "",
        enumsMap,
        typeMap
      ) as GetArticleReaction200Response;
      return body;
    }
    if (isCodeInRange("401", response.httpStatusCode)) {
      const body: ProblemDetails = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        "ProblemDetails",
        "",
        enumsMap,
        typeMap
      ) as ProblemDetails;
      throw new ApiException<ProblemDetails>(
        response.httpStatusCode,
        "Unauthorized",
        body,
        response.headers
      );
    }
    if (isCodeInRange("404", response.httpStatusCode)) {
      const body: ProblemDetails = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        "ProblemDetails",
        "",
        enumsMap,
        typeMap
      ) as ProblemDetails;
      throw new ApiException<ProblemDetails>(
        response.httpStatusCode,
        "Not Found",
        body,
        response.headers
      );
    }
    if (isCodeInRange("500", response.httpStatusCode)) {
      const body: ProblemDetails = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        "ProblemDetails",
        "",
        enumsMap,
        typeMap
      ) as ProblemDetails;
      throw new ApiException<ProblemDetails>(
        response.httpStatusCode,
        "Internal Server Error",
        body,
        response.headers
      );
    }
    if (isCodeInRange("503", response.httpStatusCode)) {
      const body: ProblemDetails = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        "ProblemDetails",
        "",
        enumsMap,
        typeMap
      ) as ProblemDetails;
      throw new ApiException<ProblemDetails>(
        response.httpStatusCode,
        "Service Unavailable",
        body,
        response.headers
      );
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: GetArticleReaction200Response = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        "GetArticleReaction200Response",
        "",
        enumsMap,
        typeMap
      ) as GetArticleReaction200Response;
      return body;
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      "Unknown API Status Code!",
      await response.getBodyAsAny(),
      response.headers
    );
  }

  /**
   * Unwraps the actual response sent by the server from the response context and deserializes the response content
   * to the expected objects
   *
   * @params response Response returned by the server for a request to getArticleReactions
   * @throws ApiException if the response code was not in [200, 299]
   */
  public async getArticleReactions(
    response: ResponseContext
  ): Promise<GetArticleReactions200Response> {
    const contentType = ObjectSerializer.normalizeMediaType(
      response.headers["content-type"]
    );
    if (isCodeInRange("200", response.httpStatusCode)) {
      const body: GetArticleReactions200Response = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        "GetArticleReactions200Response",
        "",
        enumsMap,
        typeMap
      ) as GetArticleReactions200Response;
      return body;
    }
    if (isCodeInRange("401", response.httpStatusCode)) {
      const body: ProblemDetails = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        "ProblemDetails",
        "",
        enumsMap,
        typeMap
      ) as ProblemDetails;
      throw new ApiException<ProblemDetails>(
        response.httpStatusCode,
        "Unauthorized",
        body,
        response.headers
      );
    }
    if (isCodeInRange("404", response.httpStatusCode)) {
      const body: ProblemDetails = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        "ProblemDetails",
        "",
        enumsMap,
        typeMap
      ) as ProblemDetails;
      throw new ApiException<ProblemDetails>(
        response.httpStatusCode,
        "Not Found",
        body,
        response.headers
      );
    }
    if (isCodeInRange("500", response.httpStatusCode)) {
      const body: ProblemDetails = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        "ProblemDetails",
        "",
        enumsMap,
        typeMap
      ) as ProblemDetails;
      throw new ApiException<ProblemDetails>(
        response.httpStatusCode,
        "Internal Server Error",
        body,
        response.headers
      );
    }
    if (isCodeInRange("503", response.httpStatusCode)) {
      const body: ProblemDetails = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        "ProblemDetails",
        "",
        enumsMap,
        typeMap
      ) as ProblemDetails;
      throw new ApiException<ProblemDetails>(
        response.httpStatusCode,
        "Service Unavailable",
        body,
        response.headers
      );
    }

    // Work around for missing responses in specification, e.g. for petstore.yaml
    if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
      const body: GetArticleReactions200Response = ObjectSerializer.deserialize(
        ObjectSerializer.parse(await response.body.text(), contentType),
        "GetArticleReactions200Response",
        "",
        enumsMap,
        typeMap
      ) as GetArticleReactions200Response;
      return body;
    }

    throw new ApiException<string | Blob | undefined>(
      response.httpStatusCode,
      "Unknown API Status Code!",
      await response.getBodyAsAny(),
      response.headers
    );
  }
}
