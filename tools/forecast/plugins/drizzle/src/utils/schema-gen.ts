import { lowerCaseFirst } from "@stormstack/core-shared-utilities/common/string-fns";
import {
  ArrayExpr,
  DataModel,
  DataModelField,
  InvocationExpr,
  LiteralExpr,
  ReferenceExpr,
  isDataModel
} from "@stormstack/tools-forecast-language/ast";
import { isForeignKeyField } from "@stormstack/tools-forecast-schema/sdk/utils";

export abstract class SchemaGenerator {
  public abstract readonly tableMethod: string;
  public abstract readonly importStatement: string;

  public abstract getTableSchema(modelName: string): string;

  public getFieldSchema(model: DataModel, field: DataModelField): string {
    let schema = this.getColumnTypeSchema(field);

    for (const attr of field.attributes) {
      switch (attr.decl.ref?.name) {
        case "@default":
          {
            if (attr.args.length > 0) {
              const functionName = (attr.args[0].value as InvocationExpr)
                ?.function?.ref?.name;
              const value = (attr.args[0].value as LiteralExpr)?.value;
              schema +=
                functionName && functionName.startsWith("now")
                  ? ".$defaultFn(() => DateTime.current.asJsDate())"
                  : functionName &&
                    (functionName.startsWith("cuid") ||
                      functionName.startsWith("uuid"))
                  ? ".$defaultFn(() => UniqueIdGenerator.generate())"
                  : value
                  ? `.default(${value})`
                  : "";
            }
          }
          break;
        case "@unique":
          schema += ".unique()";
          break;
        case "@id":
          schema += ".primaryKey()";
          break;
        default:
          break;
      }
    }

    if (!field.type.optional) {
      schema += ".notNull()";
    }

    const modelFields = model.fields.filter(modelField =>
      isDataModel(modelField.type.reference?.ref)
    );

    if (isForeignKeyField(field)) {
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

          if (foreignKeyField) {
            const referencesFields = attribute.args.find(
              a => a.name === "references"
            );

            (referencesFields.value as ArrayExpr)?.items.forEach(item => {
              schema += `.references(() => ${lowerCaseFirst(
                modelField.type.reference.ref.name
              )}.${(item as ReferenceExpr)?.target?.ref?.name})`;
            });
          }
        }
      }
    }

    return schema;
  }

  public getRelationsSchema(model: DataModel): string {
    const relationFields = model.fields.filter(relationField =>
      isDataModel(relationField.type.reference?.ref)
    );
    if (relationFields.length > 0) {
      return `
    export const ${lowerCaseFirst(
      model.name
    )}Relations = relations(${lowerCaseFirst(model.name)}, ({ ${
        relationFields.some(relationField =>
          relationField.attributes.every(
            attr => attr.decl.ref?.name !== "@relation"
          )
        )
          ? "many"
          : ""
      }${
        relationFields.some(relationField =>
          relationField.attributes.some(
            attr => attr.decl.ref?.name === "@relation"
          )
        )
          ? `${
              relationFields.some(relationField =>
                relationField.attributes.every(
                  attr => attr.decl.ref?.name !== "@relation"
                )
              )
                ? ", "
                : ""
            }one`
          : ""
      } }) => ({
      ${relationFields.map(
        relationField =>
          `${relationField.name}: ${
            relationField.attributes.every(
              attr => attr.decl.ref?.name !== "@relation"
            )
              ? "many"
              : "one"
          }(${lowerCaseFirst(relationField.type.reference.ref.name)}${
            relationField.attributes.some(
              attr => attr.decl.ref?.name === "@relation"
            )
              ? `, {
        ${relationField.attributes
          .find(attr => attr.decl.ref?.name === "@relation")
          .args.map(arg => {
            if (arg.name === "fields") {
              return `fields: [${(arg.value as ArrayExpr).items
                .map(
                  item =>
                    `${lowerCaseFirst(model.name)}.${
                      (item as ReferenceExpr)?.target?.ref?.name
                    }`
                )
                .join('", "')}],
             `;
            } else if (arg.name === "references") {
              return `references: [${(arg.value as ArrayExpr).items
                .map(
                  item =>
                    `${lowerCaseFirst(relationField.type.reference.ref.name)}.${
                      (item as ReferenceExpr)?.target?.ref?.name
                    }`
                )
                .join('", "')}],
             `;
            }

            return "";
          })}
          }`
              : ""
          }),`
      )}
      }));
      `;
    }

    return "";
  }

  protected abstract getColumnTypeSchema(field: DataModelField): string;
}
