import { upperCaseFirst } from "@open-system/core-shared-utilities/common/string-fns";
import {
  DataModel,
  DataModelField,
  isDataModel,
  isEnum
} from "@open-system/tools-storm-language/ast";

export class SchemaGenerator {
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

  public hasEdgeConnection = false;

  private getColumnTypeSchema(field: DataModelField) {
    let schema: string;

    if (field.type.reference?.ref && isEnum(field.type.reference?.ref)) {
      schema = field.type.reference.ref.name;
    } else {
      switch (field.type.type) {
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

    return schema;
  }

  public getScalarsSchema(): string {
    let schema = "";

    if (this.hasEdgeConnection) {
      schema += `
type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String!
  endCursor: String!
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

    return schema;
  }

  public getFieldSchema(model: DataModel, field: DataModelField): string {
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

        default:
          break;
      }
    }

    if (isDataModel(field.type.reference?.ref)) {
      this.hasEdgeConnection = true;
      return `(first: Int = 100, after: String): ${
        field.type.reference?.ref.name
      }Connection${!field.type.optional ? "!" : ""}`;
    }

    if (!schema) {
      schema += this.getColumnTypeSchema(field);
    }

    if (schema && field.type.array) {
      schema = `[${schema}]`;
    }

    /*if (isForeignKeyField(field)) {
      const modelFields = model.fields.filter(modelField =>
        isDataModel(modelField.type.reference?.ref)
      );

      for (const modelField of modelFields) {
        const attribute = modelField.attributes.find(
          attr => attr.decl.ref?.name === "@relation"
        );
        if (attribute) {
          const foreignKeyFields = attribute.args.find(
            a => a.name === "fields"
          );
          const foreignKeyField = (
            foreignKeyFields.value as ArrayExpr
          ).items.find(
            item => (item as ReferenceExpr)?.target?.ref?.name === field.name
          );

          if (
            foreignKeyField &&
            field.type.type === "String" &&
            field.name.endsWith("Id")
          ) {
            schema = "ID";
          }
        }
      }
    }*/

    if (schema && !field.type.optional) {
      schema += "!";
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
type ${upperCaseFirst(relationField.type.reference.ref.name)}Edge {
  node: ${upperCaseFirst(relationField.type.reference.ref.name)}!
  cursor: String!
}

type ${upperCaseFirst(relationField.type.reference.ref.name)}Connection { 
  edges: [${upperCaseFirst(relationField.type.reference.ref.name)}Edge!]!
  pageInfo: PageInfo!
}
      `;
        }
      });
    }

    return schema;
  }
}
