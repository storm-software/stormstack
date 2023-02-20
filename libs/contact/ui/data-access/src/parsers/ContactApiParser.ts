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
import { CommandSuccessResponse } from '../models';
import { ContactHeaderRecord } from '../models';
import { ContactRecord } from '../models';
import { CreateContactRequest } from '../models';
import { GetContactDetails200Response } from '../models';
import { GetContacts200Response } from '../models';
import { GetSubscriptions200Response } from '../models';
import { ProblemDetailsResponse } from '../models';

/**
 * ContactApiRequestFactory
 * no description
 */
export class ContactApiRequestFactory {
    /**
     * Add a new contact
     * Create Contact
     * @param createContactRequest 
     */
    public static createContact({ body  }: { body?: CreateContactRequest;  }): RequestContext {
        if (isEmptyObject(body)) {
            throw new RequiredError("ContactApi",
              "createContact",
              "body");
        }

        // Make Request Context
        const requestContext = RequestContext.create('/contacts',
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
              "CreateContactRequest",
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
     * An end point that adds a new detail to an existing contact
     * Create Contact Detail
     * @param id The records guid
     */
    public static createContactDetail({ id = undefined }: { id?: string;  }): RequestContext {
        // verify required parameter 'id' is not null or undefined
        if ((isString(id) && !isStringSet(id)) || isEmpty(id)) {
            throw new RequiredError("ContactApi",
              "createContactDetail",
              "id");
        }

        // Make Request Context
        const requestContext = RequestContext.create('/contacts/{id}/details'
            .replace('{' + 'id' + '}',
              encodeURIComponent(String(id))),
          HttpMethod.POST);
        requestContext.setHeaderParam("Accept",
          "application/json, */*;q=0.8");



        /*
*/

        return requestContext;
    }

    /**
     * An end point that returns data for a specific contact
     * Get Contact By Id
     * @param id The records guid
     */
    public static getContactById({ id = undefined }: { id?: string;  }): RequestContext {
        // verify required parameter 'id' is not null or undefined
        if ((isString(id) && !isStringSet(id)) || isEmpty(id)) {
            throw new RequiredError("ContactApi",
              "getContactById",
              "id");
        }

        // Make Request Context
        const requestContext = RequestContext.create('/contacts/{id}'
            .replace('{' + 'id' + '}',
              encodeURIComponent(String(id))),
          HttpMethod.GET);
        requestContext.setHeaderParam("Accept",
          "application/json, */*;q=0.8");



        /*
*/

        return requestContext;
    }

    /**
     * An end point that returns detail data for a specific contact
     * Get Contact Details
     * @param id The records guid
     * @param pageNumber The current page number of the selected data
     * @param pageSize The maximum amount of data to return in one request
     * @param orderBy The field to filter data by
     * @param reason An reason type value to filter the returned contact details 
     */
    public static getContactDetails({ id = undefined, pageNumber = 1, pageSize = 200, orderBy = 'details', reason = undefined }: { id?: string; pageNumber?: number; pageSize?: number; orderBy?: string; reason?: 'business' | 'question' | 'other' | 'project' | 'interest';  }): RequestContext {
        // verify required parameter 'id' is not null or undefined
        if ((isString(id) && !isStringSet(id)) || isEmpty(id)) {
            throw new RequiredError("ContactApi",
              "getContactDetails",
              "id");
        }
        // verify required parameter 'pageNumber' is not null or undefined
        if ((isString(pageNumber) && !isStringSet(pageNumber)) || isEmpty(pageNumber)) {
            throw new RequiredError("ContactApi",
              "getContactDetails",
              "pageNumber");
        }
        // verify required parameter 'pageSize' is not null or undefined
        if ((isString(pageSize) && !isStringSet(pageSize)) || isEmpty(pageSize)) {
            throw new RequiredError("ContactApi",
              "getContactDetails",
              "pageSize");
        }
        // verify required parameter 'orderBy' is not null or undefined
        if ((isString(orderBy) && !isStringSet(orderBy)) || isEmpty(orderBy)) {
            throw new RequiredError("ContactApi",
              "getContactDetails",
              "orderBy");
        }

        // Make Request Context
        const requestContext = RequestContext.create('/contacts/{id}/details'
            .replace('{' + 'id' + '}',
              encodeURIComponent(String(id))),
          HttpMethod.GET);
        requestContext.setHeaderParam("Accept",
          "application/json, */*;q=0.8");


        // Query Params
        if (reason !== undefined) {
            requestContext.setQueryParam("reason",
              ObjectSerializer.serialize(reason,
                "'business' | 'question' | 'other' | 'project' | 'interest'",
                "",
                enumsMap,
                typeMap));
        }

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


        /*
*/

        return requestContext;
    }

    /**
     * An end point that returns the list of contacts
     * Get Contacts
     * @param pageNumber The current page number of the selected data
     * @param pageSize The maximum amount of data to return in one request
     * @param orderBy The field to order the records by
     * @param email An email value to filter the returned contacts 
     * @param firstName A first name value to filter the returned contacts 
     * @param lastName A last name value to filter the returned contacts 
     */
    public static getContacts({ pageNumber = 1, pageSize = 200, orderBy = 'email', email = undefined, firstName = undefined, lastName = undefined }: { pageNumber?: number; pageSize?: number; orderBy?: string; email?: string; firstName?: string; lastName?: string;  }): RequestContext {
        // verify required parameter 'pageNumber' is not null or undefined
        if ((isString(pageNumber) && !isStringSet(pageNumber)) || isEmpty(pageNumber)) {
            throw new RequiredError("ContactApi",
              "getContacts",
              "pageNumber");
        }
        // verify required parameter 'pageSize' is not null or undefined
        if ((isString(pageSize) && !isStringSet(pageSize)) || isEmpty(pageSize)) {
            throw new RequiredError("ContactApi",
              "getContacts",
              "pageSize");
        }
        // verify required parameter 'orderBy' is not null or undefined
        if ((isString(orderBy) && !isStringSet(orderBy)) || isEmpty(orderBy)) {
            throw new RequiredError("ContactApi",
              "getContacts",
              "orderBy");
        }

        // Make Request Context
        const requestContext = RequestContext.create('/contacts',
          HttpMethod.GET);
        requestContext.setHeaderParam("Accept",
          "application/json, */*;q=0.8");


        // Query Params
        if (email !== undefined) {
            requestContext.setQueryParam("email",
              ObjectSerializer.serialize(email,
                "string",
                "email",
                enumsMap,
                typeMap));
        }

        // Query Params
        if (firstName !== undefined) {
            requestContext.setQueryParam("firstName",
              ObjectSerializer.serialize(firstName,
                "string",
                "",
                enumsMap,
                typeMap));
        }

        // Query Params
        if (lastName !== undefined) {
            requestContext.setQueryParam("lastName",
              ObjectSerializer.serialize(lastName,
                "string",
                "",
                enumsMap,
                typeMap));
        }

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


        /*
*/

        return requestContext;
    }

    /**
     * An end point that returns a boolean value indicating if the specified email is on the subscription list
     * Get Subscription By Email
     * @param email The email of the subscription
     */
    public static getSubscriptionByEmail({ email = undefined }: { email?: string;  }): RequestContext {
        // verify required parameter 'email' is not null or undefined
        if ((isString(email) && !isStringSet(email)) || isEmpty(email)) {
            throw new RequiredError("ContactApi",
              "getSubscriptionByEmail",
              "email");
        }

        // Make Request Context
        const requestContext = RequestContext.create('/contacts/subscriptions/{email}'
            .replace('{' + 'email' + '}',
              encodeURIComponent(String(email))),
          HttpMethod.GET);
        requestContext.setHeaderParam("Accept",
          "application/json, */*;q=0.8");



        /*
*/

        return requestContext;
    }

    /**
     * An end point that returns a list of emails on the subscription list
     * Get Subscriptions
     * @param pageNumber The current page number of the selected data
     * @param pageSize The maximum amount of data to return in one request
     * @param orderBy The field to order the data by
     */
    public static getSubscriptions({ pageNumber = 1, pageSize = 200, orderBy = 'email' }: { pageNumber?: number; pageSize?: number; orderBy?: string;  }): RequestContext {
        // verify required parameter 'pageNumber' is not null or undefined
        if ((isString(pageNumber) && !isStringSet(pageNumber)) || isEmpty(pageNumber)) {
            throw new RequiredError("ContactApi",
              "getSubscriptions",
              "pageNumber");
        }
        // verify required parameter 'pageSize' is not null or undefined
        if ((isString(pageSize) && !isStringSet(pageSize)) || isEmpty(pageSize)) {
            throw new RequiredError("ContactApi",
              "getSubscriptions",
              "pageSize");
        }
        // verify required parameter 'orderBy' is not null or undefined
        if ((isString(orderBy) && !isStringSet(orderBy)) || isEmpty(orderBy)) {
            throw new RequiredError("ContactApi",
              "getSubscriptions",
              "orderBy");
        }

        // Make Request Context
        const requestContext = RequestContext.create('/contacts/subscriptions',
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


        /*
*/

        return requestContext;
    }

    /**
     * Add a new email address to the subcription list
     * Subscribe
     * @param email The email of the subscription
     */
    public static subscribe({ email = undefined }: { email?: string;  }): RequestContext {
        // verify required parameter 'email' is not null or undefined
        if ((isString(email) && !isStringSet(email)) || isEmpty(email)) {
            throw new RequiredError("ContactApi",
              "subscribe",
              "email");
        }

        // Make Request Context
        const requestContext = RequestContext.create('/contacts/subscriptions/{email}'
            .replace('{' + 'email' + '}',
              encodeURIComponent(String(email))),
          HttpMethod.POST);
        requestContext.setHeaderParam("Accept",
          "application/json, */*;q=0.8");



        /*
*/

        return requestContext;
    }

    /**
     * Remove an existing email address from the subcription list
     * Unsubscribe
     * @param email The email of the subscription
     */
    public static unsubscribe({ email = undefined }: { email?: string;  }): RequestContext {
        // verify required parameter 'email' is not null or undefined
        if ((isString(email) && !isStringSet(email)) || isEmpty(email)) {
            throw new RequiredError("ContactApi",
              "unsubscribe",
              "email");
        }

        // Make Request Context
        const requestContext = RequestContext.create('/contacts/subscriptions/{email}'
            .replace('{' + 'email' + '}',
              encodeURIComponent(String(email))),
          HttpMethod.DELETE);
        requestContext.setHeaderParam("Accept",
          "application/json, */*;q=0.8");



        /*
*/

        return requestContext;
    }

    /**
     * An end point that updates an existing contact
     * Update Contact
     * @param id The records guid
     * @param contactHeaderRecord 
     */
    public static updateContact({ id = undefined, body  }: { id?: string; body?: ContactHeaderRecord;  }): RequestContext {
        // verify required parameter 'id' is not null or undefined
        if ((isString(id) && !isStringSet(id)) || isEmpty(id)) {
            throw new RequiredError("ContactApi",
              "updateContact",
              "id");
        }
        if (isEmptyObject(body)) {
            throw new RequiredError("ContactApi",
              "updateContact",
              "body");
        }

        // Make Request Context
        const requestContext = RequestContext.create('/contacts/{id}'
            .replace('{' + 'id' + '}',
              encodeURIComponent(String(id))),
          HttpMethod.PUT);
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
              "ContactHeaderRecord",
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

}

/**
 * ContactApiResponseProcessor
 * no description
 */
export class ContactApiResponseProcessor {
    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to createContact
     * @throws ApiException if the response code was not in [200, 299]
     */
     public static async createContact(response: ResponseContext<CommandSuccessResponse >): Promise<CommandSuccessResponse > {
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
     * @params response Response returned by the server for a request to createContactDetail
     * @throws ApiException if the response code was not in [200, 299]
     */
     public static async createContactDetail(response: ResponseContext<CommandSuccessResponse >): Promise<CommandSuccessResponse > {
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
     * @params response Response returned by the server for a request to getContactById
     * @throws ApiException if the response code was not in [200, 299]
     */
     public static async getContactById(response: ResponseContext<ContactRecord >): Promise<ContactRecord > {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ContactRecord = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(),
                  contentType),
                "ContactRecord",
                "",
                enumsMap,
                typeMap) as ContactRecord;
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
            const body: ContactRecord = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(),
                  contentType),
                "ContactRecord",
                "",
                enumsMap,
                typeMap) as ContactRecord;
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
     * @params response Response returned by the server for a request to getContactDetails
     * @throws ApiException if the response code was not in [200, 299]
     */
     public static async getContactDetails(response: ResponseContext<GetContactDetails200Response >): Promise<GetContactDetails200Response > {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: GetContactDetails200Response = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(),
                  contentType),
                "GetContactDetails200Response",
                "",
                enumsMap,
                typeMap) as GetContactDetails200Response;
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
            const body: GetContactDetails200Response = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(),
                  contentType),
                "GetContactDetails200Response",
                "",
                enumsMap,
                typeMap) as GetContactDetails200Response;
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
     * @params response Response returned by the server for a request to getContacts
     * @throws ApiException if the response code was not in [200, 299]
     */
     public static async getContacts(response: ResponseContext<GetContacts200Response >): Promise<GetContacts200Response > {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: GetContacts200Response = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(),
                  contentType),
                "GetContacts200Response",
                "",
                enumsMap,
                typeMap) as GetContacts200Response;
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
            const body: GetContacts200Response = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(),
                  contentType),
                "GetContacts200Response",
                "",
                enumsMap,
                typeMap) as GetContacts200Response;
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
     * @params response Response returned by the server for a request to getSubscriptionByEmail
     * @throws ApiException if the response code was not in [200, 299]
     */
     public static async getSubscriptionByEmail(response: ResponseContext<boolean >): Promise<boolean > {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: boolean = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(),
                  contentType),
                "boolean",
                "",
                enumsMap,
                typeMap) as boolean;
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
            const body: boolean = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(),
                  contentType),
                "boolean",
                "",
                enumsMap,
                typeMap) as boolean;
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
     * @params response Response returned by the server for a request to getSubscriptions
     * @throws ApiException if the response code was not in [200, 299]
     */
     public static async getSubscriptions(response: ResponseContext<GetSubscriptions200Response >): Promise<GetSubscriptions200Response > {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: GetSubscriptions200Response = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(),
                  contentType),
                "GetSubscriptions200Response",
                "",
                enumsMap,
                typeMap) as GetSubscriptions200Response;
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
            const body: GetSubscriptions200Response = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(),
                  contentType),
                "GetSubscriptions200Response",
                "",
                enumsMap,
                typeMap) as GetSubscriptions200Response;
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
     * @params response Response returned by the server for a request to subscribe
     * @throws ApiException if the response code was not in [200, 299]
     */
     public static async subscribe(response: ResponseContext<CommandSuccessResponse >): Promise<CommandSuccessResponse > {
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
     * @params response Response returned by the server for a request to unsubscribe
     * @throws ApiException if the response code was not in [200, 299]
     */
     public static async unsubscribe(response: ResponseContext<CommandSuccessResponse >): Promise<CommandSuccessResponse > {
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
     * @params response Response returned by the server for a request to updateContact
     * @throws ApiException if the response code was not in [200, 299]
     */
     public static async updateContact(response: ResponseContext<CommandSuccessResponse >): Promise<CommandSuccessResponse > {
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
