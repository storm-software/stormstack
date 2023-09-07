import { upperCaseFirst } from "@open-system/core-shared-utilities/common/string-fns";
import {
  DataModel,
  DataModelField,
  DataModelFieldType,
  LiteralExpr,
  Operation,
  OperationGroup,
  OperationInputParam,
  isApiModel,
  isDataModel,
  isEnum,
  isInput,
  isInterface
} from "@open-system/tools-storm-language/ast";

export class SchemaGenerator {
  // Usage flags
  public hasOperation = false;
  public hasEdgeConnection = false;

  // Scalar usage flags
  public hasBigInt = false;
  public hasDateTime = false;
  public hasURL = false;
  public hasEmailAddress = false;
  public hasPhoneNumber = false;
  public hasIP = false;
  public hasPostalCode = false;
  public hasLatitude = false;
  public hasLongitude = false;
  public hasCountryCode = false;
  public hasTimeZone = false;
  public hasMAC = false;
  public hasSemVer = false;

  public getColumnTypeSchema(type: DataModelFieldType) {
    let schema: string;
    if (
      isDataModel(type.reference?.ref) ||
      isApiModel(type.reference?.ref) ||
      isInterface(type.reference?.ref) ||
      isInput(type.reference?.ref) ||
      isEnum(type.reference?.ref)
    ) {
      schema = type.reference.ref.name;
    } else {
      switch (type.type) {
        case "Int":
          schema = "Int";
          break;
        case "Float":
        case "Decimal":
          schema = "Float";
          break;
        case "BigInt":
          this.hasBigInt = true;
          schema = "BigInt";
          break;
        case "Boolean":
          schema = "Boolean";
          break;
        case "DateTime":
          this.hasDateTime = true;
          schema = "DateTime";
          break;
        case "String":
        default:
          schema = "String";
          break;
      }
    }

    if (type.array) {
      schema = `[${schema}!]`;
    }
    if (!type.optional) {
      schema += "!";
    }

    return schema;
  }

  public getOperationInputParam(param: OperationInputParam) {
    return `${param.name}: ${this.getColumnTypeSchema(param.type)}${
      (param.defaultValue as LiteralExpr)?.value !== undefined
        ? ` = ${(param.defaultValue as LiteralExpr).value}`
        : ""
    }`;
  }

  public getScalarsSchema(): string {
    let schema = `

interface IEntity {
  """
  The identifier of the record
  """
  id: ID!
  """
  The sequence number (version, or event counter, etc.) of the record
  """
  sequence: Int!
  """
  A timestamp of when the record was created
  """
  createdAt: DateTime!
  """
  The user who created the record
  """
  createdBy: String!
  """
  A timestamp of when the record was last updated
  """
  updatedAt: DateTime
  """
  The user who last updated the record
  """
  updatedBy: String
}
`;

    if (this.hasOperation) {
      schema += `
interface IError {
  message: String!
}

`;
    }

    if (this.hasBigInt) {
      schema += "scalar BigInt \n";
    }
    if (this.hasDateTime) {
      schema += "scalar DateTime \n";
    }
    if (this.hasURL) {
      schema += "scalar URL \n";
    }
    if (this.hasEmailAddress) {
      schema += "scalar EmailAddress \n";
    }
    if (this.hasPhoneNumber) {
      schema += "scalar PhoneNumber \n";
    }
    if (this.hasIP) {
      schema += "scalar IP \n";
    }
    if (this.hasPostalCode) {
      schema += "scalar PostalCode \n";
    }
    if (this.hasLatitude) {
      schema += "scalar Latitude \n";
    }
    if (this.hasLongitude) {
      schema += "scalar Longitude \n";
    }
    if (this.hasCountryCode) {
      schema += "scalar CountryCode \n";
    }
    if (this.hasTimeZone) {
      schema += "scalar TimeZone \n";
    }
    if (this.hasMAC) {
      schema += "scalar MAC \n";
    }
    if (this.hasSemVer) {
      schema += "scalar SemVer \n";
    }

    return schema;
  }

  public getScalarsImport(): string {
    const scalars = [];
    if (this.hasBigInt) {
      scalars.push("BigInt");
    }
    if (this.hasDateTime) {
      scalars.push("DateTime");
    }
    if (this.hasURL) {
      scalars.push("URL");
    }
    if (this.hasEmailAddress) {
      scalars.push("EmailAddress");
    }
    if (this.hasPhoneNumber) {
      scalars.push("PhoneNumber");
    }
    if (this.hasIP) {
      scalars.push("IP");
    }
    if (this.hasPostalCode) {
      scalars.push("PostalCode");
    }
    if (this.hasLatitude) {
      scalars.push("Latitude");
    }
    if (this.hasLongitude) {
      scalars.push("Longitude");
    }
    if (this.hasCountryCode) {
      scalars.push("CountryCode");
    }
    if (this.hasTimeZone) {
      scalars.push("TimeZone");
    }
    if (this.hasMAC) {
      scalars.push("MAC");
    }
    if (this.hasSemVer) {
      scalars.push("SemVer");
    }

    return `import { ${scalars
      .map(scalar => `${scalar}Resolver`)
      .join(", ")} } from "graphql-scalars";`;
  }

  public getScalarsResolvers(): string {
    const scalars = [];
    if (this.hasBigInt) {
      scalars.push("BigInt");
    }
    if (this.hasDateTime) {
      scalars.push("DateTime");
    }
    if (this.hasURL) {
      scalars.push("URL");
    }
    if (this.hasEmailAddress) {
      scalars.push("EmailAddress");
    }
    if (this.hasPhoneNumber) {
      scalars.push("PhoneNumber");
    }
    if (this.hasIP) {
      scalars.push("IP");
    }
    if (this.hasPostalCode) {
      scalars.push("PostalCode");
    }
    if (this.hasLatitude) {
      scalars.push("Latitude");
    }
    if (this.hasLongitude) {
      scalars.push("Longitude");
    }
    if (this.hasCountryCode) {
      scalars.push("CountryCode");
    }
    if (this.hasTimeZone) {
      scalars.push("TimeZone");
    }
    if (this.hasMAC) {
      scalars.push("MAC");
    }
    if (this.hasSemVer) {
      scalars.push("SemVer");
    }

    return scalars.map(scalar => `${scalar}: ${scalar}Resolver`).join(", \n");
  }

  public getFieldSchema(
    field: DataModelField,
    skipConnections = false
  ): string {
    let schema = "";
    for (const attr of field.attributes) {
      switch (attr.decl.ref?.name) {
        case "@id":
          schema += "ID";
          break;
        case "@url":
          this.hasURL = true;
          schema += "URL";
          break;
        case "@datetime":
          this.hasDateTime = true;
          schema = "DateTime";
          break;
        case "@email":
          this.hasEmailAddress = true;
          schema = "EmailAddress";
          break;
        case "@phoneNumber":
          this.hasPhoneNumber = true;
          schema = "PhoneNumber";
          break;
        case "@ip":
          this.hasIP = true;
          schema = "IP";
          break;
        case "@postalCode":
          this.hasPostalCode = true;
          schema = "PostalCode";
          break;
        case "@latitude":
          this.hasLatitude = true;
          schema = "Latitude";
          break;
        case "@longitude":
          this.hasLongitude = true;
          schema = "Longitude";
          break;
        case "@countryCode":
          this.hasCountryCode = true;
          schema = "CountryCode";
          break;
        case "@timeZone":
          this.hasTimeZone = true;
          schema = "TimeZone";
          break;
        case "@mac":
          this.hasMAC = true;
          schema = "MAC";
          break;
        case "@semver":
          this.hasSemVer = true;
          schema = "SemVer";
          break;
        default:
          break;
      }
    }

    if (schema) {
      field.type.array && (schema = `[${schema}]`);
      !field.type.optional && (schema += "!");
    }

    if (
      !skipConnections &&
      field.type.array &&
      isDataModel(field.type.reference?.ref) &&
      !isEnum(field.type.reference?.ref) &&
      !isApiModel(field.type.reference?.ref) &&
      !isInterface(field.type.reference?.ref) &&
      !isInput(field.type.reference?.ref) &&
      !isInput(field.$container) &&
      !isInterface(field.$container) &&
      !isApiModel(field.$container)
    ) {
      this.hasEdgeConnection = true;
      return `(
        after: String
        before: String
        first: Int
        last: Int
        ): ${field.type.reference?.ref.name}Connection${
        !field.type.optional ? "!" : ""
      }`;
    }

    if (!schema) {
      schema += this.getColumnTypeSchema(field.type);
    }

    return `: ${schema}`;
  }

  public getRelationsSchema(model: DataModel): string {
    let schema = "";

    const relationFields = model.fields.filter(relationField =>
      isDataModel(relationField.type.reference?.ref)
    );
    if (relationFields.length > 0) {
      relationFields.forEach(relationField => {
        if (
          relationField.attributes.every(
            attr => attr.decl.ref?.name !== "@relation"
          )
        ) {
          schema += `
"""
An object containing the current paginated result data returned from ${
            relationField.type.reference.ref.name
          } at the current cursor position
"""
type ${upperCaseFirst(relationField.type.reference.ref.name)}Edge {
  node: ${upperCaseFirst(relationField.type.reference.ref.name)}!
  cursor: String!
}

"""
An object containing the paginated child model data returned from ${
            relationField.type.reference.ref.name
          }
"""
type ${upperCaseFirst(relationField.type.reference.ref.name)}Connection {
  edges: [${upperCaseFirst(relationField.type.reference.ref.name)}Edge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}
      `;
        }
      });
    }

    return schema;
  }

  public getMutationResultSchema(operationGroup: OperationGroup): string {
    return operationGroup.fields.reduce((ret: string, operation: Operation) => {
      ret += `
"""
An object containing the successful result of the ${operation.name} operation
"""
type ${upperCaseFirst(operation.name)}Ok {
  payload: ${this.getColumnTypeSchema(operation.resultType)}
}
`;

      if (operation.params && operation.params.length > 0) {
        if (
          operation.params.length === 1 &&
          (isDataModel(operation.params[0].type.reference?.ref) ||
            isApiModel(operation.params[0].type.reference?.ref) ||
            isInterface(operation.params[0].type.reference?.ref) ||
            isInput(operation.params[0].type.reference?.ref))
        ) {
          ret += `
"""
An object containing potential input errors during the ${
            operation.name
          } operation
"""
type ${upperCaseFirst(operation.name)}InputErrors {
  ${operation.params[0].type.reference?.ref.fields
    .map(param => `${param.name}: String`)
    .join("\n")}
}
`;
        } else {
          ret += `
"""
An object containing potential input errors during the ${
            operation.name
          } operation
"""
type ${upperCaseFirst(operation.name)}InputErrors {
  ${operation.params.map(param => `${param.name}: String`).join("\n")}
}
`;
        }

        ret += `
"""
An object containing the summary error message and individual input errors (when applicable) of the ${
          operation.name
        } operation
"""
type ${upperCaseFirst(operation.name)}Error implements IError {
  message: String!
  inputErrors: ${upperCaseFirst(operation.name)}InputErrors!
}
      `;
      } else {
        ret += `
"""
An object containing the error details of the ${operation.name} operation
"""
type ${upperCaseFirst(operation.name)}Error implements IError {
  message: String!
}
        `;
      }

      ret += `
"""
A response object containing the successful result data or error details of the ${
        operation.name
      } operation
"""
type ${upperCaseFirst(operation.name)}Result {
  ok: ${upperCaseFirst(operation.name)}Ok
  error: ${upperCaseFirst(operation.name)}Error
}
`;

      return ret;
    }, "");
  }
}
