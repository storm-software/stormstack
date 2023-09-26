import {
  ArrayExpr,
  Operation,
  OperationGroup,
  ReferenceExpr,
  isLiteralExpr
} from "@stormstack/tools-storm-language/ast";
import { ValidationAcceptor } from "langium";
import { AstValidator } from "../types";
import {
  validateAttributeApplication,
  validateDuplicatedDeclarations
} from "./utils";

/**
 * Validates data Type declarations.
 */
export default class OperationGroupValidator
  implements AstValidator<OperationGroup>
{
  validate(dm: OperationGroup, accept: ValidationAcceptor): void {
    // this.validateBaseAbstractType(dm, accept);
    validateDuplicatedDeclarations(dm.$resolvedFields, accept);
    this.validateAttributes(dm, accept);
    this.validateFields(dm, accept);
  }

  private validateFields(dm: OperationGroup, accept: ValidationAcceptor) {
    dm.fields.forEach(field => this.validateField(field, accept));

    /*if (!dm.isAbstract) {
      dm.$resolvedFields
        .filter(x => isOperationGroup(x.type.reference?.ref))
        .forEach(y => {
          this.validateRelationField(y, accept);
        });
    }*/
  }

  private validateField(field: Operation, accept: ValidationAcceptor): void {
    /*if (field.type.array && field.type.optional) {
      accept(
        "error",
        "Optional lists are not supported. Use either `Type[]` or `Type?`",
        { node: field.type }
      );
    }

    if (
      field.type.unsupported &&
      typeof field.type.unsupported.value.value !== "string"
    ) {
      accept("error", "Unsupported type argument must be a string literal", {
        node: field.type.unsupported
      });
    }*/

    field.attributes.forEach(attr =>
      validateAttributeApplication(attr, accept)
    );
  }

  private validateAttributes(dm: OperationGroup, accept: ValidationAcceptor) {
    dm.attributes.forEach(attr => {
      validateAttributeApplication(attr, accept);
    });
  }

  private parseRelation(field: Operation, accept?: ValidationAcceptor) {
    const relAttr = field.attributes.find(
      attr => attr.decl.ref?.name === "@relation"
    );

    let name: string | undefined;
    let fields: ReferenceExpr[] | undefined;
    let references: ReferenceExpr[] | undefined;
    let valid = true;

    if (!relAttr) {
      return { attr: relAttr, name, fields, references, valid: true };
    }

    for (const arg of relAttr.args) {
      if (!arg.name || arg.name === "name") {
        if (isLiteralExpr(arg.value)) {
          name = arg.value.value as string;
        }
      } else if (arg.name === "fields") {
        fields = (arg.value as ArrayExpr).items as ReferenceExpr[];
        if (fields.length === 0) {
          if (accept) {
            accept("error", `"fields" value cannot be emtpy`, {
              node: arg
            });
          }
          valid = false;
        }
      } else if (arg.name === "references") {
        references = (arg.value as ArrayExpr).items as ReferenceExpr[];
        if (references.length === 0) {
          if (accept) {
            accept("error", `"references" value cannot be emtpy`, {
              node: arg
            });
          }
          valid = false;
        }
      }
    }

    if (!fields || !references) {
      if (this.isSelfRelation(field, name)) {
        // self relations are partial
        // https://www.prisma.io/docs/concepts/components/prisma-schema/relations/self-relations
      } else {
        if (accept) {
          accept("error", `Both "fields" and "references" must be provided`, {
            node: relAttr
          });
        }
      }
    } else {
      // validate "fields" and "references" typing consistency
      if (fields.length !== references.length) {
        if (accept) {
          accept(
            "error",
            `"references" and "fields" must have the same length`,
            { node: relAttr }
          );
        }
      } else {
        for (let i = 0; i < fields.length; i++) {
          if (!fields[i].$resolvedType) {
            if (accept) {
              accept("error", `field reference is unresolved`, {
                node: fields[i]
              });
            }
          }
          if (!references[i].$resolvedType) {
            if (accept) {
              accept("error", `field reference is unresolved`, {
                node: references[i]
              });
            }
          }

          if (
            fields[i].$resolvedType?.decl !==
              references[i].$resolvedType?.decl ||
            fields[i].$resolvedType?.array !==
              references[i].$resolvedType?.array
          ) {
            if (accept) {
              accept(
                "error",
                `values of "references" and "fields" must have the same type`,
                {
                  node: relAttr
                }
              );
            }
          }
        }
      }
    }

    return { attr: relAttr, name, fields, references, valid };
  }

  private isSelfRelation(field: Operation, relationName?: string) {
    /*if (field.type.reference?.ref === field.$container) {
      // field directly references back to its type
      return true;
    }

    if (relationName) {
      // field's relation points to another type, and that type's opposite relation field
      // points back
      const oppositeType = field.type.reference?.ref as OperationGroup;
      if (oppositeType) {
        const oppositeTypeFields = oppositeType.$resolvedFields as Operation[];
        for (const oppositeField of oppositeTypeFields) {
          // find the opposite relation with the matching name
          const relAttr = oppositeField.attributes.find(
            a => a.decl.ref?.name === "@relation"
          );
          if (relAttr) {
            const relNameExpr = relAttr.args.find(
              a => !a.name || a.name === "name"
            );
            const relName = getLiteral<string>(relNameExpr?.value);
            if (
              relName === relationName &&
              oppositeField.type.reference?.ref === field.$container
            ) {
              // found an opposite relation field that points back to this field's type
              return true;
            }
          }
        }
      }
    }*/

    return false;
  }

  private validateRelationField(field: Operation, accept: ValidationAcceptor) {
    /*const thisRelation = this.parseRelation(field, accept);
    if (!thisRelation.valid) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const oppositeType = field.type.reference!.ref! as OperationGroup;

    // Use name because the current document might be updated
    let oppositeFields = oppositeType.$resolvedFields.filter(
      f => f.type.reference?.ref?.name === field.$container.name
    );
    oppositeFields = oppositeFields.filter(f => {
      const fieldRel = this.parseRelation(f);
      return fieldRel.valid && fieldRel.name === thisRelation.name;
    });

    if (oppositeFields.length === 0) {
      const node = field.$isInherited ? field.$container : field;
      const info: DiagnosticInfo<AstNode, string> = {
        node,
        code: IssueCodes.MissingOppositeRelation
      };

      let relationFieldDocUri: string;
      let relationOperationGroupName: string;

      if (field.$isInherited) {
        info.property = "name";
        const container = field.$container as OperationGroup;
        const abstractContainer = container.superTypes.find(x =>
          x.ref?.fields.find(f => f.name === field.name)
        )?.ref as OperationGroup;

        relationFieldDocUri = getDocument(abstractContainer).textDocument.uri;
        relationOperationGroupName = abstractContainer.name;
      } else {
        relationFieldDocUri = getDocument(field).textDocument.uri;
        relationOperationGroupName = field.$container.name;
      }

      const data: MissingOppositeRelationData = {
        relationFieldName: field.name,
        relationOperationGroupName,
        relationFieldDocUri,
        operationGroupName: field.$container.name
      };

      info.data = data;

      accept(
        "error",
        `The relation field "${field.name}" on type "${field.$container.name}" is missing an opposite relation field on type "${oppositeType.name}"`,
        info
      );
      return;
    } else if (oppositeFields.length > 1) {
      oppositeFields
        .filter(x => !x.$isInherited)
        .forEach(f => {
          if (this.isSelfRelation(f)) {
            // self relations are partial
            // https://www.prisma.io/docs/concepts/components/prisma-schema/relations/self-relations
          } else {
            accept(
              "error",
              `Fields ${oppositeFields
                .map(f => '"' + f.name + '"')
                .join(", ")} on type "${
                oppositeType.name
              }" refer to the same relation to type "${
                field.$container.name
              }"`,
              { node: f }
            );
          }
        });
      return;
    }

    const oppositeField = oppositeFields[0];
    const oppositeRelation = this.parseRelation(oppositeField);

    let relationOwner: Operation;

    if (thisRelation?.references?.length && thisRelation.fields?.length) {
      if (oppositeRelation?.references || oppositeRelation?.fields) {
        accept(
          "error",
          '"fields" and "references" must be provided only on one side of relation field',
          {
            node: oppositeField
          }
        );
        return;
      } else {
        relationOwner = oppositeField;
      }
    } else if (
      oppositeRelation?.references?.length &&
      oppositeRelation.fields?.length
    ) {
      if (thisRelation?.references || thisRelation?.fields) {
        accept(
          "error",
          '"fields" and "references" must be provided only on one side of relation field',
          {
            node: field
          }
        );
        return;
      } else {
        relationOwner = field;
      }
    } else {
      // if both the field is array, then it's an implicit many-to-many relation
      if (!(field.type.array && oppositeField.type.array)) {
        [field, oppositeField].forEach(f => {
          if (!this.isSelfRelation(f, thisRelation.name)) {
            accept(
              "error",
              'Field for one side of relation must carry @relation attribute with both "fields" and "references" fields',
              { node: f }
            );
          }
        });
      }
      return;
    }

    if (!relationOwner.type.array && !relationOwner.type.optional) {
      accept("error", "Relation field needs to be list or optional", {
        node: relationOwner
      });
      return;
    }

    if (relationOwner !== field && !relationOwner.type.array) {
      // one-to-one relation requires defining side's reference field to be @unique
      // e.g.:
      //     type User {
      //         id String @id @default(cuid())
      //         data UserData?
      //     }
      //     type UserData {
      //         id String @id @default(cuid())
      //         user User  @relation(fields: [userId], references: [id])
      //         userId String
      //     }
      //
      // UserData.userId field needs to be @unique

      const containingType = field.$container as OperationGroup;
      const uniqueFieldList = getUniqueTypeFields(containingType);

      thisRelation.fields?.forEach(ref => {
        const refField = ref.target.ref as Operation;
        if (refField) {
          if (
            refField.attributes.find(
              a => a.decl.ref?.name === "@id" || a.decl.ref?.name === "@unique"
            )
          ) {
            return;
          }
          if (uniqueFieldList.some(list => list.includes(refField))) {
            return;
          }
          accept(
            "error",
            `Field "${refField.name}" is part of a one-to-one relation and must be marked as @unique or be part of a type-level @@unique attribute`,
            { node: refField }
          );
        }
      });
    }*/
  }

  /*private validateBaseAbstractType(
    type: OperationGroup,
    accept: ValidationAcceptor
  ) {
    type.superTypes.forEach((superType, index) => {
      if (!superType.ref?.isAbstract)
        accept(
          "error",
          `Type ${superType.$refText} cannot be extended because it's not abstract`,
          {
            node: type,
            property: "superTypes",
            index
          }
        );
    });
  }*/
}

export interface MissingOppositeRelationData {
  relationOperationGroupName: string;
  relationFieldName: string;
  // it might be the abstract type in the imported document
  relationFieldDocUri: string;

  // the name of OperationGroup that the relation field belongs to.
  // the document is the same with the error node.
  operationGroupName: string;
}
