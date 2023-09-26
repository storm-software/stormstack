import {
  DataModelField,
  isApiModel,
  isDataModel,
  isEnum,
  isInput,
  isInterface
} from "@stormstack/tools-forecast-language/ast";

export class EntityGenerator {
  // Usage flags
  public hasOperation = false;
  public hasEdgeConnection = false;

  // Scalar usage flags
  public hasDecimal = false;
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

  public getImport(): string {
    let imports = "";
    if (this.hasDateTime) {
      imports +=
        'import { DateTime } from "@stormstack/core-shared-utilities/common/date-time";\n';
    }
    if (this.hasDecimal) {
      imports += 'import { Decimal } from "decimal.js";\n';
    }

    return imports;
  }

  public getInterfaceField(field: DataModelField): string {
    return this.getField(field, true);
  }

  public getField(field: DataModelField, isInterfaceField = false): string {
    let schema = "";
    for (const attr of field.attributes) {
      switch (attr.decl.ref?.name) {
        case "@id":
          schema = "string";
          break;
        case "@url":
          this.hasURL = true;
          schema = "URL";
          break;
        case "@datetime":
          this.hasDateTime = true;
          schema = "DateTime";
          break;
      }
    }

    if (!schema) {
      if (isDataModel(field.type.reference?.ref)) {
        schema = `${isInterfaceField ? "I" : ""}${
          field.type.reference.ref.name
        }Entity`;
      } else if (
        isApiModel(field.type.reference?.ref) ||
        isInterface(field.type.reference?.ref) ||
        isInput(field.type.reference?.ref) ||
        isEnum(field.type.reference?.ref)
      ) {
        schema = field.type.reference.ref.name;
      } else {
        switch (field.type.type) {
          case "Int":
            schema = "number";
            break;
          case "Float":
          case "Decimal":
            this.hasDecimal = true;
            schema = "Decimal";
            break;
          case "BigInt":
            schema = "bigint";
            break;
          case "Boolean":
            schema = "boolean";
            break;
          case "DateTime":
            this.hasDateTime = true;
            schema = "DateTime";
            break;
          case "String":
          default:
            schema = "string";
            break;
        }
      }
    }

    return `${field.type.optional ? "?" : ""}: ${schema}${
      field.type.array ? "[]" : ""
    }`;
  }
}
