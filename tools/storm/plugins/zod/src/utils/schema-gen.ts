/* eslint-disable no-useless-escape */
import { upperCaseFirst } from "@stormstack/core-shared-utilities/common/string-fns";
import {
  DataModel,
  DataModelField,
  DataModelFieldAttribute,
  isEnum
} from "@stormstack/tools-storm-language/ast";
import {
  ExpressionContext,
  PluginError,
  getAttributeArg,
  getAttributeArgLiteral,
  getLiteral
} from "@stormstack/tools-storm-schema/sdk";
import {
  TypeScriptExpressionTransformer,
  TypeScriptExpressionTransformerError
} from "@stormstack/tools-storm-schema/utils/typescript-expression-transformer";
import { name } from "..";

export function makeFieldSchema(field: DataModelField) {
  let schema = makeZodSchema(field);

  for (const attr of field.attributes) {
    const message = getAttrLiteralArg<string>(attr, "message");
    const messageArg = message
      ? `, { message: ${JSON.stringify(message)} }`
      : "";
    const messageArgFirst = message
      ? `{ message: ${JSON.stringify(message)} }`
      : "";

    switch (attr.decl.ref?.name) {
      case "@length": {
        const min = getAttrLiteralArg<number>(attr, "min");
        if (min) {
          schema += `.min(${min}${messageArg})`;
        }
        const max = getAttrLiteralArg<number>(attr, "max");
        if (max) {
          schema += `.max(${max}${messageArg})`;
        }
        break;
      }
      case "@contains": {
        const expr = getAttrLiteralArg<string>(attr, "text");
        if (expr) {
          schema += `.includes(${JSON.stringify(expr)}${messageArg})`;
        }
        break;
      }
      case "@regex": {
        const expr = getAttrLiteralArg<string>(attr, "regex");
        if (expr) {
          schema += `.regex(new RegExp(${JSON.stringify(expr)})${messageArg})`;
        }
        break;
      }
      case "@startsWith": {
        const text = getAttrLiteralArg<string>(attr, "text");
        if (text) {
          schema += `.startsWith(${JSON.stringify(text)}${messageArg})`;
        }
        break;
      }
      case "@endsWith": {
        const text = getAttrLiteralArg<string>(attr, "text");
        if (text) {
          schema += `.endsWith(${JSON.stringify(text)}${messageArg})`;
        }
        break;
      }
      case "@email": {
        schema += `.email(${messageArgFirst})`;
        break;
      }
      case "@phoneNumber": {
        schema += `.regex(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/)`;
        break;
      }
      case "@semver": {
        schema += `.regex(/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/)`;
        break;
      }
      case "@latitude": {
        schema += `.regex(/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)/)`;
        break;
      }
      case "@longitude": {
        schema += `.regex(/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)/)`;
        break;
      }
      case "@countryCode": {
        schema += `.regex(/^(A(D|E|F|G|I|L|M|N|O|R|S|T|Q|U|W|X|Z)|B(A|B|D|E|F|G|H|I|J|L|M|N|O|R|S|T|V|W|Y|Z)|C(A|C|D|F|G|H|I|K|L|M|N|O|R|U|V|X|Y|Z)|D(E|J|K|M|O|Z)|E(C|E|G|H|R|S|T)|F(I|J|K|M|O|R)|G(A|B|D|E|F|G|H|I|L|M|N|P|Q|R|S|T|U|W|Y)|H(K|M|N|R|T|U)|I(D|E|Q|L|M|N|O|R|S|T)|J(E|M|O|P)|K(E|G|H|I|M|N|P|R|W|Y|Z)|L(A|B|C|I|K|R|S|T|U|V|Y)|M(A|C|D|E|F|G|H|K|L|M|N|O|Q|P|R|S|T|U|V|W|X|Y|Z)|N(A|C|E|F|G|I|L|O|P|R|U|Z)|OM|P(A|E|F|G|H|K|L|M|N|R|S|T|W|Y)|QA|R(E|O|S|U|W)|S(A|B|C|D|E|G|H|I|J|K|L|M|N|O|R|T|V|Y|Z)|T(C|D|F|G|H|J|K|L|M|N|O|R|T|V|W|Z)|U(A|G|M|S|Y|Z)|V(A|C|E|G|I|N|U)|W(F|S)|Y(E|T)|Z(A|M|W))$/)`;
        break;
      }
      case "@timeZone": {
        schema += `.length(2)`;
        break;
      }
      case "@ip": {
        schema += `.ip(${messageArgFirst})`;
        break;
      }
      case "@mac": {
        schema += `.regex(/^(?:[0-9A-Fa-f]{2}[:-]){5}(?:[0-9A-Fa-f]{2})$/)`;
        break;
      }
      case "@postalCode": {
        schema += `.regex(/^[0-9]{5}(?:-[0-9]{4})?$/)`;
        break;
      }
      case "@url": {
        schema += `.url(${messageArgFirst})`;
        break;
      }
      case "@datetime": {
        schema += `.datetime({ offset: true${
          message ? ", message: " + JSON.stringify(message) : ""
        } })`;
        break;
      }
      case "@gt": {
        const value = getAttrLiteralArg<number>(attr, "value");
        if (value !== undefined) {
          schema += `.gt(${value}${messageArg})`;
        }
        break;
      }
      case "@gte": {
        const value = getAttrLiteralArg<number>(attr, "value");
        if (value !== undefined) {
          schema += `.gte(${value}${messageArg})`;
        }
        break;
      }
      case "@lt": {
        const value = getAttrLiteralArg<number>(attr, "value");
        if (value !== undefined) {
          schema += `.lt(${value}${messageArg})`;
        }
        break;
      }
      case "@lte": {
        const value = getAttrLiteralArg<number>(attr, "value");
        if (value !== undefined) {
          schema += `.lte(${value}${messageArg})`;
        }
        break;
      }
    }
  }

  if (field.type.optional) {
    schema += ".nullish()";
  }

  return schema;
}

function makeZodSchema(field: DataModelField) {
  let schema: string;

  if (field.type.reference?.ref && isEnum(field.type.reference?.ref)) {
    schema = `${upperCaseFirst(field.type.reference.ref.name)}Schema`;
  } else {
    switch (field.type.type) {
      case "Int":
      case "Float":
        schema = "z.number()";
        break;
      case "Decimal":
        schema = "DecimalSchema";
        break;
      case "BigInt":
        schema = "z.bigint()";
        break;
      case "String":
        schema = "z.string()";
        break;
      case "Boolean":
        schema = "z.boolean()";
        break;
      case "DateTime":
        schema = "z.date()";
        break;
      case "Bytes":
        schema = "z.union([z.string(), z.instanceof(Uint8Array)])";
        break;
      default:
        schema = "z.any()";
        break;
    }
  }

  if (field.type.array) {
    schema = `z.array(${schema})`;
  }

  return schema;
}

export function makeValidationRefinements(model: DataModel) {
  const attrs = model.attributes.filter(
    attr => attr.decl.ref?.name === "@@validate"
  );
  const refinements = attrs
    .map(attr => {
      const valueArg = getAttributeArg(attr, "value");
      if (!valueArg) {
        return undefined;
      }

      const messageArg = getAttributeArgLiteral<string>(attr, "message");
      const message = messageArg
        ? `, { message: ${JSON.stringify(messageArg)} }`
        : "";

      try {
        const expr = new TypeScriptExpressionTransformer({
          context: ExpressionContext.ValidationRule,
          fieldReferenceContext: "value"
        }).transform(valueArg);
        return `.refine((value: any) => ${expr}${message})`;
      } catch (err) {
        if (err instanceof TypeScriptExpressionTransformerError) {
          throw new PluginError(name, err.message);
        } else {
          throw err;
        }
      }
    })
    .filter(r => !!r);

  return refinements;
}

function getAttrLiteralArg<T extends string | number>(
  attr: DataModelFieldAttribute,
  paramName: string
) {
  const arg = attr.args.find(arg => arg.$resolvedParam?.name === paramName);
  return arg && getLiteral<T>(arg.value);
}
