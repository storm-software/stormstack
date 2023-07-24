

package opensystem.dotnet.model;

import org.openapitools.codegen.*;
import java.util.*;

public class OpenSystemDotnetModelCodegenParameter extends CodegenParameter {
    public String nameInUpperCase;
    public String dataTypeWithoutNullable;
    public boolean requiredAndNotNullable;
    public boolean notRequiredOrIsNullable;

    public String nameInUpperCase() {
      String ret = this.paramName;
      if (ret != null &&
        ret.length() > 0) {
          ret = ret.substring(0,
            1).toUpperCase()
            + ret.substring(1);
        }

      return ret;
    }

    public String dataTypeWithoutNullable() {
      return this.dataType != null
        ? this.dataType.replace("?",
          "")
        : "";
    }

    public boolean requiredAndNotNullable(){
        return this.required && !this.isNullable;
    }

    public boolean notRequiredOrIsNullable() {
        return !this.required || this.isNullable;
    }

    @Override
    public OpenSystemDotnetModelCodegenParameter copy() {
        OpenSystemDotnetModelCodegenParameter output = new OpenSystemDotnetModelCodegenParameter();
        output.isFile = this.isFile;
        output.isContainer = this.isContainer;
        output.baseName = this.baseName;
        output.paramName = this.paramName;
        output.dataType = this.dataType;
        output.datatypeWithEnum = this.datatypeWithEnum;
        output.enumName = this.enumName;
        output.dataFormat = this.dataFormat;
        output.collectionFormat = this.collectionFormat;
        output.isCollectionFormatMulti = this.isCollectionFormatMulti;
        output.isPrimitiveType = this.isPrimitiveType;
        output.isModel = this.isModel;
        output.description = this.description;
        output.unescapedDescription = this.unescapedDescription;
        output.baseType = this.baseType;
        output.isFormParam = this.isFormParam;
        output.isQueryParam = this.isQueryParam;
        output.isPathParam = this.isPathParam;
        output.isHeaderParam = this.isHeaderParam;
        output.isCookieParam = this.isCookieParam;
        output.isBodyParam = this.isBodyParam;
        output.required = this.required;
        output.maximum = this.maximum;
        output.exclusiveMaximum = this.exclusiveMaximum;
        output.minimum = this.minimum;
        output.exclusiveMinimum = this.exclusiveMinimum;
        output.maxLength = this.maxLength;
        output.minLength = this.minLength;
        output.pattern = this.pattern;
        output.maxItems = this.maxItems;
        output.minItems = this.minItems;
        output.uniqueItems = this.uniqueItems;
        output.setUniqueItemsBoolean(this.getUniqueItemsBoolean());
        output.multipleOf = this.multipleOf;
        output.jsonSchema = this.jsonSchema;
        output.defaultValue = this.defaultValue;
        output.enumDefaultValue = this.enumDefaultValue;
        output.example = this.example;
        output.isEnum = this.isEnum;
        output.setMaxProperties(this.getMaxProperties());
        output.setMinProperties(this.getMinProperties());
        output.maximum = this.maximum;
        output.minimum = this.minimum;
        output.pattern = this.pattern;
        output.additionalProperties = this.additionalProperties;
        output.isNull = this.isNull;
        output.setAdditionalPropertiesIsAnyType(this.getAdditionalPropertiesIsAnyType());
        output.setHasVars(this.getHasVars());
        output.setHasRequired(this.getHasRequired());
        output.setHasDiscriminatorWithNonEmptyMapping(this.getHasDiscriminatorWithNonEmptyMapping());
        output.setHasMultipleTypes(this.getHasMultipleTypes());
        output.setSchemaIsFromAdditionalProperties(this.getSchemaIsFromAdditionalProperties());


      output.setContent(this.getContent());

      output.setSchema(this.getSchema());

      output.setComposedSchemas(this.getComposedSchemas());

        if (this._enum != null) {
            output._enum = new ArrayList<String>(this._enum);
        }
        if (this.allowableValues != null) {
            output.allowableValues = new HashMap<String, Object>(this.allowableValues);
        }
        if (this.items != null) {
            output.items = this.items;
        }
        if (this.vars != null) {
            output.vars = this.vars;
        }
        if (this.requiredVars != null) {
            output.requiredVars = this.requiredVars;
        }
        if (this.mostInnerItems != null) {
            output.mostInnerItems = this.mostInnerItems;
        }
        if (this.vendorExtensions != null) {
            output.vendorExtensions = new HashMap<String, Object>(this.vendorExtensions);
        }

        output.setRequiredVarsMap(this.getRequiredVarsMap());
        output.setRef(this.getRef());

        output.hasValidation = this.hasValidation;
        output.isNullable = this.isNullable;
        output.isDeprecated = this.isDeprecated;
        output.isBinary = this.isBinary;
        output.isByteArray = this.isByteArray;
        output.isString = this.isString;
        output.isNumeric = this.isNumeric;
        output.isInteger = this.isInteger;
        output.isShort = this.isShort;
        output.isLong = this.isLong;
        output.isUnboundedInteger = this.isUnboundedInteger;
        output.isDouble = this.isDouble;
        output.isDecimal = this.isDecimal;
        output.isFloat = this.isFloat;
        output.isNumber = this.isNumber;
        output.isBoolean = this.isBoolean;
        output.isDate = this.isDate;
        output.isDateTime = this.isDateTime;
        output.isUuid = this.isUuid;
        output.isUri = this.isUri;
        output.isEmail = this.isEmail;
        output.isFreeFormObject = this.isFreeFormObject;
        output.isAnyType = this.isAnyType;
        output.isArray = this.isArray;
        output.isMap = this.isMap;
        output.isExplode = this.isExplode;
        output.style = this.style;
        output.isDeepObject = this.isDeepObject;
        output.isAllowEmptyValue = this.isAllowEmptyValue;
        output.contentType = this.contentType;
        output.nameInUpperCase = this.nameInUpperCase();
        output.dataTypeWithoutNullable = this.dataTypeWithoutNullable();
        output.nameInUpperCase = this.nameInUpperCase;
        output.dataTypeWithoutNullable = this.dataTypeWithoutNullable;

        return output;
    }


    public void copyFrom(CodegenParameter input) {
        this.isFile = input.isFile;
        this.isContainer = input.isContainer;
        this.baseName = input.baseName;
        this.paramName = input.paramName;
        this.dataType = input.dataType;
        this.datatypeWithEnum = input.datatypeWithEnum;
        this.enumName = input.enumName;
        this.dataFormat = input.dataFormat;
        this.collectionFormat = input.collectionFormat;
        this.isCollectionFormatMulti = input.isCollectionFormatMulti;
        this.isPrimitiveType = input.isPrimitiveType;
        this.isModel = input.isModel;
        this.description = input.description;
        this.unescapedDescription = input.unescapedDescription;
        this.baseType = input.baseType;
        this.isFormParam = input.isFormParam;
        this.isQueryParam = input.isQueryParam;
        this.isPathParam = input.isPathParam;
        this.isHeaderParam = input.isHeaderParam;
        this.isCookieParam = input.isCookieParam;
        this.isBodyParam = input.isBodyParam;
        this.required = input.required;
        this.maximum = input.maximum;
        this.exclusiveMaximum = input.exclusiveMaximum;
        this.minimum = input.minimum;
        this.exclusiveMinimum = input.exclusiveMinimum;
        this.maxLength = input.maxLength;
        this.minLength = input.minLength;
        this.pattern = input.pattern;
        this.maxItems = input.maxItems;
        this.minItems = input.minItems;
        this.uniqueItems = input.uniqueItems;
        this.setUniqueItemsBoolean(input.getUniqueItemsBoolean());
        this.multipleOf = input.multipleOf;
        this.jsonSchema = input.jsonSchema;
        this.defaultValue = input.defaultValue;
        this.enumDefaultValue = input.enumDefaultValue;
        this.example = input.example;
        this.isEnum = input.isEnum;
        this.setMaxProperties(input.getMaxProperties());
        this.setMinProperties(input.getMinProperties());
        this.maximum = input.maximum;
        this.minimum = input.minimum;
        this.pattern = input.pattern;
        this.additionalProperties = input.additionalProperties;
        this.isNull = input.isNull;
        this.setAdditionalPropertiesIsAnyType(input.getAdditionalPropertiesIsAnyType());
        this.setHasVars(input.getHasVars());
        this.setHasRequired(input.getHasRequired());
        this.setHasDiscriminatorWithNonEmptyMapping(input.getHasDiscriminatorWithNonEmptyMapping());
        this.setHasMultipleTypes(input.getHasMultipleTypes());
        this.setSchemaIsFromAdditionalProperties(input.getSchemaIsFromAdditionalProperties());


      this.setContent(input.getContent());

      this.setSchema(input.getSchema());

      this.setComposedSchemas(input.getComposedSchemas());

        if (input._enum != null) {
            this._enum = new ArrayList<String>(input._enum);
        }
        if (input.allowableValues != null) {
            this.allowableValues = new HashMap<String, Object>(input.allowableValues);
        }
        if (input.items != null) {
            this.items = input.items;
        }
        if (input.vars != null) {
            this.vars = input.vars;
        }
        if (input.requiredVars != null) {
            this.requiredVars = input.requiredVars;
        }
        if (input.mostInnerItems != null) {
            this.mostInnerItems = input.mostInnerItems;
        }
        if (input.vendorExtensions != null) {
            this.vendorExtensions = new HashMap<String, Object>(input.vendorExtensions);
        }

        this.setRequiredVarsMap(input.getRequiredVarsMap());
        this.setRef(input.getRef());

        this.hasValidation = input.hasValidation;
        this.isNullable = input.isNullable;
        this.isDeprecated = input.isDeprecated;
        this.isBinary = input.isBinary;
        this.isByteArray = input.isByteArray;
        this.isString = input.isString;
        this.isNumeric = input.isNumeric;
        this.isInteger = input.isInteger;
        this.isShort = input.isShort;
        this.isLong = input.isLong;
        this.isUnboundedInteger = input.isUnboundedInteger;
        this.isDouble = input.isDouble;
        this.isDecimal = input.isDecimal;
        this.isFloat = input.isFloat;
        this.isNumber = input.isNumber;
        this.isBoolean = input.isBoolean;
        this.isDate = input.isDate;
        this.isDateTime = input.isDateTime;
        this.isUuid = input.isUuid;
        this.isUri = input.isUri;
        this.isEmail = input.isEmail;
        this.isFreeFormObject = input.isFreeFormObject;
        this.isAnyType = input.isAnyType;
        this.isArray = input.isArray;
        this.isMap = input.isMap;
        this.isExplode = input.isExplode;
        this.style = input.style;
        this.isDeepObject = input.isDeepObject;
        this.isAllowEmptyValue = input.isAllowEmptyValue;
        this.contentType = input.contentType;
        this.nameInUpperCase = this.nameInUpperCase();
        this.dataTypeWithoutNullable = this.dataTypeWithoutNullable();
    }

     @Override
    public int hashCode() {
        return Objects.hash(nameInUpperCase, dataTypeWithoutNullable, isFormParam, isQueryParam, isPathParam, isHeaderParam, isCookieParam, isBodyParam, isContainer, isCollectionFormatMulti, isPrimitiveType, isModel, isExplode, baseName, paramName, dataType, datatypeWithEnum, dataFormat, collectionFormat, description, unescapedDescription, baseType, defaultValue, enumDefaultValue, enumName, style, isDeepObject, isAllowEmptyValue, example, jsonSchema, isString, isNumeric, isInteger, isLong, isNumber, isFloat, isDouble, isDecimal, isByteArray, isBinary, isBoolean, isDate, isDateTime, isUuid, isUri, isEmail, isFreeFormObject, isAnyType, isArray, isMap, isFile, isEnum, _enum, allowableValues, items, mostInnerItems, additionalProperties, vars, requiredVars, vendorExtensions, hasValidation, getMaxProperties(), getMinProperties(), isNullable, isDeprecated, required, getMaximum(), getExclusiveMaximum(), getMinimum(), getExclusiveMinimum(), getMaxLength(), getMinLength(), getPattern(), getMaxItems(), getMinItems(), getUniqueItems(), contentType, multipleOf, isNull, isShort, isUnboundedInteger);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        OpenSystemDotnetModelCodegenParameter that = (OpenSystemDotnetModelCodegenParameter) o;
        return super.equals(that) &&
          Objects.equals(nameInUpperCase, that.nameInUpperCase) &&
          Objects.equals(dataTypeWithoutNullable, that.dataTypeWithoutNullable);
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("CodegenParameter{");
        sb.append("isFormParam=").append(isFormParam);
        sb.append(", isQueryParam=").append(isQueryParam);
        sb.append(", isPathParam=").append(isPathParam);
        sb.append(", isHeaderParam=").append(isHeaderParam);
        sb.append(", isCookieParam=").append(isCookieParam);
        sb.append(", isBodyParam=").append(isBodyParam);
        sb.append(", isContainer=").append(isContainer);
        sb.append(", isCollectionFormatMulti=").append(isCollectionFormatMulti);
        sb.append(", isPrimitiveType=").append(isPrimitiveType);
        sb.append(", isModel=").append(isModel);
        sb.append(", isExplode=").append(isExplode);
        sb.append(", baseName='").append(baseName).append('\'');
        sb.append(", paramName='").append(paramName).append('\'');
        sb.append(", dataType='").append(dataType).append('\'');
        sb.append(", datatypeWithEnum='").append(datatypeWithEnum).append('\'');
        sb.append(", dataFormat='").append(dataFormat).append('\'');
        sb.append(", collectionFormat='").append(collectionFormat).append('\'');
        sb.append(", description='").append(description).append('\'');
        sb.append(", unescapedDescription='").append(unescapedDescription).append('\'');
        sb.append(", baseType='").append(baseType).append('\'');
        sb.append(", defaultValue='").append(defaultValue).append('\'');
        sb.append(", enumDefaultValue='").append(enumDefaultValue).append('\'');
        sb.append(", enumName='").append(enumName).append('\'');
        sb.append(", style='").append(style).append('\'');
        sb.append(", deepObject='").append(isDeepObject).append('\'');
        sb.append(", allowEmptyValue='").append(isAllowEmptyValue).append('\'');
        sb.append(", example='").append(example).append('\'');
        sb.append(", jsonSchema='").append(jsonSchema).append('\'');
        sb.append(", isString=").append(isString);
        sb.append(", isNumeric=").append(isNumeric);
        sb.append(", isInteger=").append(isInteger);
        sb.append(", isShort=").append(isShort);
        sb.append(", isLong=").append(isLong);
        sb.append(", isUnboundedInteger=").append(isUnboundedInteger);
        sb.append(", isNumber=").append(isNumber);
        sb.append(", isFloat=").append(isFloat);
        sb.append(", isDouble=").append(isDouble);
        sb.append(", isDecimal=").append(isDecimal);
        sb.append(", isByteArray=").append(isByteArray);
        sb.append(", isBinary=").append(isBinary);
        sb.append(", isBoolean=").append(isBoolean);
        sb.append(", isDate=").append(isDate);
        sb.append(", isDateTime=").append(isDateTime);
        sb.append(", isUuid=").append(isUuid);
        sb.append(", isUri=").append(isUri);
        sb.append(", isEmail=").append(isEmail);
        sb.append(", isFreeFormObject=").append(isFreeFormObject);
        sb.append(", isAnyType=").append(isAnyType);
        sb.append(", isArray=").append(isArray);
        sb.append(", isMap=").append(isMap);
        sb.append(", isFile=").append(isFile);
        sb.append(", isEnum=").append(isEnum);
        sb.append(", _enum=").append(_enum);
        sb.append(", allowableValues=").append(allowableValues);
        sb.append(", items=").append(items);
        sb.append(", mostInnerItems=").append(mostInnerItems);
        sb.append(", additionalProperties=").append(additionalProperties);
        sb.append(", vars=").append(vars);
        sb.append(", requiredVars=").append(requiredVars);
        sb.append(", vendorExtensions=").append(vendorExtensions);
        sb.append(", hasValidation=").append(hasValidation);
        sb.append(", isNullable=").append(isNullable);
        sb.append(", isDeprecated=").append(isDeprecated);
        sb.append(", required=").append(required);
        sb.append(", maximum='").append(maximum).append('\'');
        sb.append(", exclusiveMaximum=").append(exclusiveMaximum);
        sb.append(", minimum='").append(minimum).append('\'');
        sb.append(", exclusiveMinimum=").append(exclusiveMinimum);
        sb.append(", maxLength=").append(maxLength);
        sb.append(", minLength=").append(minLength);
        sb.append(", pattern='").append(pattern).append('\'');
        sb.append(", maxItems=").append(maxItems);
        sb.append(", minItems=").append(minItems);
        sb.append(", uniqueItems=").append(uniqueItems);
        sb.append(", contentType=").append(contentType);
        sb.append(", multipleOf=").append(multipleOf);
        sb.append(", isNull=").append(isNull);
        sb.append(", nameInUpperCase=").append(nameInUpperCase);
        sb.append(", dataTypeWithoutNullable=").append(dataTypeWithoutNullable);
        sb.append('}');
        return sb.toString();
    }
}
