package opensystem.typescript.redux;

import org.openapitools.codegen.*;
import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.tags.Tag;

import java.util.*;

public class OpenSystemTypeScriptReduxOperation extends CodegenOperation {
    public boolean isQueryOperation = false;

    public boolean isQueryOperation() {
        return "GET".equalsIgnoreCase(httpMethod);
    }

    @Override
    public String toString() {
        final StringBuffer sb = new StringBuffer("OpenSystemTypeScriptReduxOperation{");
        sb.append("responseHeaders=").append(responseHeaders);
        sb.append(", hasAuthMethods=").append(hasAuthMethods);
        sb.append(", hasConsumes=").append(hasConsumes);
        sb.append(", hasProduces=").append(hasProduces);
        sb.append(", hasParams=").append(hasParams);
        sb.append(", hasOptionalParams=").append(hasOptionalParams);
        sb.append(", hasRequiredParams=").append(hasRequiredParams);
        sb.append(", returnTypeIsPrimitive=").append(returnTypeIsPrimitive);
        sb.append(", returnSimpleType=").append(returnSimpleType);
        sb.append(", subresourceOperation=").append(subresourceOperation);
        sb.append(", isMap=").append(isMap);
        sb.append(", isArray=").append(isArray);
        sb.append(", isMultipart=").append(isMultipart);
        sb.append(", isResponseBinary=").append(isResponseBinary);
        sb.append(", isResponseFile=").append(isResponseFile);
        sb.append(", hasReference=").append(hasReference);
        sb.append(", hasDefaultResponse=").append(hasDefaultResponse);
        sb.append(", hasErrorResponseObject=").append(hasErrorResponseObject);
        sb.append(", isRestfulIndex=").append(isRestfulIndex);
        sb.append(", isRestfulShow=").append(isRestfulShow);
        sb.append(", isRestfulCreate=").append(isRestfulCreate);
        sb.append(", isRestfulUpdate=").append(isRestfulUpdate);
        sb.append(", isRestfulDestroy=").append(isRestfulDestroy);
        sb.append(", isRestful=").append(isRestful);
        sb.append(", isDeprecated=").append(isDeprecated);
        sb.append(", isCallbackRequest=").append(isCallbackRequest);
        sb.append(", uniqueItems='").append(uniqueItems);
        sb.append(", path='").append(path).append('\'');
        sb.append(", operationId='").append(operationId).append('\'');
        sb.append(", returnType='").append(returnType).append('\'');
        sb.append(", httpMethod='").append(httpMethod).append('\'');
        sb.append(", returnBaseType='").append(returnBaseType).append('\'');
        sb.append(", returnContainer='").append(returnContainer).append('\'');
        sb.append(", summary='").append(summary).append('\'');
        sb.append(", unescapedNotes='").append(unescapedNotes).append('\'');
        sb.append(", notes='").append(notes).append('\'');
        sb.append(", baseName='").append(baseName).append('\'');
        sb.append(", defaultResponse='").append(defaultResponse).append('\'');
        sb.append(", discriminator=").append(discriminator);
        sb.append(", consumes=").append(consumes);
        sb.append(", produces=").append(produces);
        sb.append(", prioritizedContentTypes=").append(prioritizedContentTypes);
        sb.append(", servers=").append(servers);
        sb.append(", bodyParam=").append(bodyParam);
        sb.append(", allParams=").append(allParams);
        sb.append(", bodyParams=").append(bodyParams);
        sb.append(", pathParams=").append(pathParams);
        sb.append(", queryParams=").append(queryParams);
        sb.append(", headerParams=").append(headerParams);
        sb.append(", formParams=").append(formParams);
        sb.append(", cookieParams=").append(cookieParams);
        sb.append(", requiredParams=").append(requiredParams);
        sb.append(", optionalParams=").append(optionalParams);
        sb.append(", authMethods=").append(authMethods);
        sb.append(", tags=").append(tags);
        sb.append(", responses=").append(responses);
        sb.append(", callbacks=").append(callbacks);
        sb.append(", imports=").append(imports);
        sb.append(", examples=").append(examples);
        sb.append(", requestBodyExamples=").append(requestBodyExamples);
        sb.append(", externalDocs=").append(externalDocs);
        sb.append(", vendorExtensions=").append(vendorExtensions);
        sb.append(", nickname='").append(nickname).append('\'');
        sb.append(", operationIdOriginal='").append(operationIdOriginal).append('\'');
        sb.append(", operationIdLowerCase='").append(operationIdLowerCase).append('\'');
        sb.append(", operationIdCamelCase='").append(operationIdCamelCase).append('\'');
        sb.append(", operationIdSnakeCase='").append(operationIdSnakeCase).append('\'');
        sb.append(", isQueryOperation='").append(isQueryOperation).append('\'');
        sb.append('}');
        return sb.toString();
    }

    @Override
    public boolean equals(Object o) {
      if (this == o) return true;
        if (o == null) return false;

        OpenSystemTypeScriptReduxOperation that = (OpenSystemTypeScriptReduxOperation) o;
        return hasAuthMethods == that.hasAuthMethods &&
                hasConsumes == that.hasConsumes &&
                hasProduces == that.hasProduces &&
                hasParams == that.hasParams &&
                hasOptionalParams == that.hasOptionalParams &&
                hasRequiredParams == that.hasRequiredParams &&
                returnTypeIsPrimitive == that.returnTypeIsPrimitive &&
                returnSimpleType == that.returnSimpleType &&
                subresourceOperation == that.subresourceOperation &&
                isMap == that.isMap &&
                isArray == that.isArray &&
                isMultipart == that.isMultipart &&
                isResponseBinary == that.isResponseBinary &&
                isResponseFile == that.isResponseFile &&
                hasReference == that.hasReference &&
                hasDefaultResponse == that.hasDefaultResponse &&
                hasErrorResponseObject == that.hasErrorResponseObject &&
                isRestfulIndex == that.isRestfulIndex &&
                isRestfulShow == that.isRestfulShow &&
                isRestfulCreate == that.isRestfulCreate &&
                isRestfulUpdate == that.isRestfulUpdate &&
                isRestfulDestroy == that.isRestfulDestroy &&
                isRestful == that.isRestful &&
                isDeprecated == that.isDeprecated &&
                isCallbackRequest == that.isCallbackRequest &&
                uniqueItems == that.uniqueItems &&
                Objects.equals(responseHeaders, that.responseHeaders) &&
                Objects.equals(path, that.path) &&
                Objects.equals(operationId, that.operationId) &&
                Objects.equals(returnType, that.returnType) &&
                Objects.equals(httpMethod, that.httpMethod) &&
                Objects.equals(returnBaseType, that.returnBaseType) &&
                Objects.equals(returnContainer, that.returnContainer) &&
                Objects.equals(summary, that.summary) &&
                Objects.equals(unescapedNotes, that.unescapedNotes) &&
                Objects.equals(notes, that.notes) &&
                Objects.equals(baseName, that.baseName) &&
                Objects.equals(defaultResponse, that.defaultResponse) &&
                Objects.equals(discriminator, that.discriminator) &&
                Objects.equals(consumes, that.consumes) &&
                Objects.equals(produces, that.produces) &&
                Objects.equals(prioritizedContentTypes, that.prioritizedContentTypes) &&
                Objects.equals(servers, that.servers) &&
                Objects.equals(bodyParam, that.bodyParam) &&
                Objects.equals(allParams, that.allParams) &&
                Objects.equals(bodyParams, that.bodyParams) &&
                Objects.equals(pathParams, that.pathParams) &&
                Objects.equals(queryParams, that.queryParams) &&
                Objects.equals(headerParams, that.headerParams) &&
                Objects.equals(formParams, that.formParams) &&
                Objects.equals(cookieParams, that.cookieParams) &&
                Objects.equals(requiredParams, that.requiredParams) &&
                Objects.equals(optionalParams, that.optionalParams) &&
                Objects.equals(authMethods, that.authMethods) &&
                Objects.equals(tags, that.tags) &&
                Objects.equals(responses, that.responses) &&
                Objects.equals(callbacks, that.callbacks) &&
                Objects.equals(imports, that.imports) &&
                Objects.equals(examples, that.examples) &&
                Objects.equals(requestBodyExamples, that.requestBodyExamples) &&
                Objects.equals(externalDocs, that.externalDocs) &&
                Objects.equals(vendorExtensions, that.vendorExtensions) &&
                Objects.equals(nickname, that.nickname) &&
                Objects.equals(operationIdOriginal, that.operationIdOriginal) &&
                Objects.equals(operationIdLowerCase, that.operationIdLowerCase) &&
                Objects.equals(operationIdCamelCase, that.operationIdCamelCase) &&
                Objects.equals(operationIdSnakeCase, that.operationIdSnakeCase) &&
                Objects.equals(isQueryOperation, that.isQueryOperation);
    }

    @Override
    public int hashCode() {

        return Objects.hash(responseHeaders, hasAuthMethods, hasConsumes, hasProduces, hasParams, hasOptionalParams,
                hasRequiredParams, returnTypeIsPrimitive, returnSimpleType, subresourceOperation, isMap,
                isArray, isMultipart, isResponseBinary, isResponseFile, hasReference, hasDefaultResponse, isRestfulIndex,
                isRestfulShow, isRestfulCreate, isRestfulUpdate, isRestfulDestroy, isRestful, isDeprecated,
                isCallbackRequest, uniqueItems, path, operationId, returnType, httpMethod, returnBaseType,
                returnContainer, summary, unescapedNotes, notes, baseName, defaultResponse, discriminator, consumes,
                produces, prioritizedContentTypes, servers, bodyParam, allParams, bodyParams, pathParams, queryParams,
                headerParams, formParams, cookieParams, requiredParams, optionalParams, authMethods, tags,
                responses, callbacks, imports, examples, requestBodyExamples, externalDocs, vendorExtensions,
                nickname, operationIdOriginal, operationIdLowerCase, operationIdCamelCase, operationIdSnakeCase,
                hasErrorResponseObject, isQueryOperation);
    }
}
