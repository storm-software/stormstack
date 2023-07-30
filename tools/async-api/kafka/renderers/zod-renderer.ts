import {
  ConstrainedMetaModel,
  ConstrainedObjectModel,
  InputMetaModel,
  Preset,
} from "@asyncapi/modelina";
import { TypeScriptDependencyManager } from "../generator/typescript-dependency-manager";
import { TypeScriptZodGenerator } from "../generator/typescript-zod-generator";
import { TypeScriptEventsOptions } from "../utils/types";
import { AbstractRenderer } from "./abstract-renderer";

export class ZodRenderer extends AbstractRenderer<
  TypeScriptEventsOptions,
  TypeScriptZodGenerator,
  ConstrainedObjectModel
> {
  constructor(
    options: TypeScriptEventsOptions,
    generator: TypeScriptZodGenerator,
    presets: Array<[Preset, unknown]>,
    model: ConstrainedObjectModel,
    inputModel: InputMetaModel,
    public dependencyManager: TypeScriptDependencyManager
  ) {
    super(options, generator, presets, model, inputModel);
  }

  public async defaultSelf(): Promise<string> {
    const content = [await this.renderZodProperties(this.model)];

    return `
const ${this.model.name}Schema = z.object({
  ${this.indent(this.renderBlock(content, 2))}
});

export type ${
      this.model.name.charAt(0).toUpperCase() +
      this.model.name.substring(1, this.model.name.length)
    }Schema = z.infer<typeof ${this.model.name}Schema>;

`;
  }

  public renderZodProperty(model: ConstrainedMetaModel) {
    /*if (
      model instanceof ConstrainedReferenceModel &&
      !(model.ref instanceof ConstrainedEnumModel)
    ) {
      return `${model.name}Schema`;
    }*/

    let property = "";
    switch (model.type) {
      case "string":
        property += "z.string()";

        if (model.originalInput["format"]) {
          if (
            model.originalInput["format"] === "date-time" ||
            model.originalInput["format"] === "date"
          ) {
            property = "z.date()";

            if (
              model.originalInput["minimum"] !== null &&
              model.originalInput["minimum"] !== undefined &&
              !isNaN(new Date(model.originalInput["maximum"])?.getTime())
            ) {
              property += `.min(new Date(${model.originalInput["minimum"]}))`;
            }

            if (
              model.originalInput["maximum"] !== null &&
              model.originalInput["maximum"] !== undefined &&
              !isNaN(new Date(model.originalInput["maximum"])?.getTime())
            ) {
              property += `.max(new Date(${model.originalInput["maximum"]}))`;
            }

            break;
          } else {
            property += `.${model.originalInput["format"]}()`;
          }
        }

        if (
          model.originalInput["minimum"] !== null &&
          model.originalInput["minimum"] !== undefined &&
          Number.isInteger(Number(model.originalInput["minimum"]))
        ) {
          property += `.min(${model.originalInput["minimum"]})`;
        }

        if (
          model.originalInput["exclusiveMinimum"] !== null &&
          model.originalInput["exclusiveMinimum"] !== undefined &&
          Number.isInteger(Number(model.originalInput["exclusiveMinimum"]))
        ) {
          property += `.min(${
            Number(model.originalInput["exclusiveMinimum"]) - 1
          })`;
        }

        if (
          model.originalInput["maximum"] !== null &&
          model.originalInput["maximum"] !== undefined &&
          Number.isInteger(Number(model.originalInput["maximum"]))
        ) {
          property += `.max(${model.originalInput["maximum"]})`;
        }

        if (
          model.originalInput["exclusiveMaximum"] !== null &&
          model.originalInput["exclusiveMaximum"] !== undefined &&
          Number.isInteger(Number(model.originalInput["exclusiveMaximum"]))
        ) {
          property += `.max(${
            Number(model.originalInput["exclusiveMaximum"]) - 1
          })`;
        }

        if (model.originalInput["pattern"]) {
          property += `.regex(${model.originalInput["pattern"]})`;
        }

        if (
          model.originalInput["minLength"] !== null &&
          model.originalInput["minLength"] !== undefined &&
          Number.isInteger(Number(model.originalInput["minLength"]))
        ) {
          property += `.min(${Number(model.originalInput["minLength"])})`;
        }

        if (
          model.originalInput["maxLength"] !== null &&
          model.originalInput["maxLength"] !== undefined &&
          Number.isInteger(Number(model.originalInput["maxLength"]))
        ) {
          property += `.max(${model.originalInput["maxLength"]})`;
        }

        if (model.originalInput["pattern"]) {
          property += `.regex(${model.originalInput["pattern"]})`;
        }

        if (model.originalInput["includes"]) {
          property += `.regex(${model.originalInput["includes"]})`;
        }

        if (model.originalInput["startsWith"]) {
          property += `.regex(${model.originalInput["startsWith"]})`;
        }

        if (model.originalInput["endsWith"]) {
          property += `.regex(${model.originalInput["endsWith"]})`;
        }

        if (model.originalInput["trim"]) {
          property += `.regex(${model.originalInput["trim"]})`;
        }

        if (model.originalInput["toLowerCase"]) {
          property += `.regex(${model.originalInput["toLowerCase"]})`;
        }

        if (model.originalInput["toUpperCase"]) {
          property += `.regex(${model.originalInput["toUpperCase"]})`;
        }
        break;

      case "number":
        property += "z.number()";

        if (
          model.originalInput["minimum"] !== null &&
          model.originalInput["minimum"] !== undefined &&
          Number.isFinite(Number(model.originalInput["minimum"]))
        ) {
          property += `.gte(${model.originalInput["minimum"]})`;
        }

        if (
          model.originalInput["exclusiveMinimum"] !== null &&
          model.originalInput["exclusiveMinimum"] !== undefined &&
          Number.isFinite(Number(model.originalInput["exclusiveMinimum"]))
        ) {
          property += `.gt(${
            Number(model.originalInput["exclusiveMinimum"]) - 1
          })`;
        }

        if (
          model.originalInput["maximum"] !== null &&
          model.originalInput["maximum"] !== undefined &&
          Number.isFinite(Number(model.originalInput["maximum"]))
        ) {
          property += `.lte(${model.originalInput["maximum"]})`;
        }

        if (
          model.originalInput["exclusiveMaximum"] !== null &&
          model.originalInput["exclusiveMaximum"] !== undefined &&
          Number.isFinite(Number(model.originalInput["exclusiveMaximum"]))
        ) {
          property += `.lt(${
            Number(model.originalInput["exclusiveMaximum"]) - 1
          })`;
        }
        break;

      case "integer":
        if (model.originalInput["format"] === "int64") {
          property += "z.bigint()";
        } else {
          property += "z.number().int()";
        }

        if (
          model.originalInput["minimum"] !== null &&
          model.originalInput["minimum"] !== undefined &&
          Number.isFinite(Number(model.originalInput["minimum"]))
        ) {
          property += `.gte(${model.originalInput["minimum"]})`;
        }

        if (
          model.originalInput["exclusiveMinimum"] !== null &&
          model.originalInput["exclusiveMinimum"] !== undefined &&
          Number.isFinite(Number(model.originalInput["exclusiveMinimum"]))
        ) {
          property += `.gt(${
            Number(model.originalInput["exclusiveMinimum"]) - 1
          })`;
        }

        if (
          model.originalInput["maximum"] !== null &&
          model.originalInput["maximum"] !== undefined &&
          Number.isFinite(Number(model.originalInput["maximum"]))
        ) {
          property += `.lte(${model.originalInput["maximum"]})`;
        }

        if (
          model.originalInput["exclusiveMaximum"] !== null &&
          model.originalInput["exclusiveMaximum"] !== undefined &&
          Number.isFinite(Number(model.originalInput["exclusiveMaximum"]))
        ) {
          property += `.lt(${
            Number(model.originalInput["exclusiveMaximum"]) - 1
          })`;
        }
        break;

      case "boolean":
        property += "z.boolean()";
        break;

      default:
        property += "z.any()";
        break;
    }

    if (model.originalInput["required"]) {
      property += ".optional()";
    }

    return property;
  }

  /*function renderUnionSerializationArray(
    modelInstanceVariable: string,
    prop: string,
    unconstrainedProperty: string,
    unionModel: ConstrainedUnionModel
  ) {
    const propName = `${prop}JsonValues`;
    const allUnionReferences = unionModel.union
      .filter(model => {
        return (
          model instanceof ConstrainedReferenceModel &&
          !(model.ref instanceof ConstrainedEnumModel)
        );
      })
      .map(model => {
        return `unionItem instanceof ${model.type}`;
      });
    const allUnionReferencesCondition = allUnionReferences.join(" || ");
    const hasUnionReference = allUnionReferences.length > 0;
    let unionSerialization = `${propName}.push(typeof unionItem === 'number' || typeof unionItem === 'boolean' ? unionItem : JSON.stringify(unionItem))`;
    if (hasUnionReference) {
      unionSerialization = `if(${allUnionReferencesCondition}) {
        ${propName}.push(unionItem.stringify());
      } else {
        ${propName}.push(typeof unionItem === 'number' || typeof unionItem === 'boolean' ? unionItem : JSON.stringify(unionItem))
      }`;
    }
    return `let ${propName}: any[] = [];
    for (const unionItem of ${modelInstanceVariable}) {
      ${unionSerialization}
    }
    json += \`"${unconstrainedProperty}": [\${${propName}.join(',')}],\`;`;
  }

  function renderArraySerialization(
    modelInstanceVariable: string,
    prop: string,
    unconstrainedProperty: string,
    arrayModel: ConstrainedArrayModel
  ) {
    const propName = `${prop}JsonValues`;
    return `let ${propName}: any[] = [];
    for (const unionItem of ${modelInstanceVariable}) {
      ${propName}.push(\`${renderZodProperties(
      "unionItem",
      arrayModel.valueModel
    )}\`);
    }
    json += \`"${unconstrainedProperty}": [\${${propName}.join(',')}],\`;`;
  }
  function renderUnionSerialization(
    modelInstanceVariable: string,
    unconstrainedProperty: string,
    unionModel: ConstrainedUnionModel
  ) {
    const allUnionReferences = unionModel.union
      .filter(model => {
        return (
          model instanceof ConstrainedReferenceModel &&
          !(model.ref instanceof ConstrainedEnumModel)
        );
      })
      .map(model => {
        return `${modelInstanceVariable} instanceof ${model.type}`;
      });
    const allUnionReferencesCondition = allUnionReferences.join(" || ");
    const hasUnionReference = allUnionReferences.length > 0;
    if (hasUnionReference) {
      return `if(${allUnionReferencesCondition}) {
      json += \`"${unconstrainedProperty}": $\{${modelInstanceVariable}.stringify()},\`;
    } else {
      json += \`"${unconstrainedProperty}": ${realizePropertyFactory(
        modelInstanceVariable
      )},\`;
    }`;
    }
    return `json += \`"${unconstrainedProperty}": ${realizePropertyFactory(
      modelInstanceVariable
    )},\`;`;
  }*/

  public renderZodProperties(model: ConstrainedObjectModel) {
    const properties = model.properties || {};
    const propertyKeys = [...Object.entries(properties)];

    const marshalNormalProperties = propertyKeys.map(
      ([prop, propModel], index) => {
        let marshalCode = "";
        /*if (
        propModel.property instanceof ConstrainedArrayModel &&
        propModel.property.valueModel instanceof ConstrainedUnionModel
      ) {
        marshalCode = renderUnionSerializationArray(
          modelInstanceVariable,
          prop,
          propModel.unconstrainedPropertyName,
          propModel.property.valueModel
        );
      } else if (propModel.property instanceof ConstrainedUnionModel) {
        marshalCode = renderUnionSerialization(
          modelInstanceVariable,
          propModel.unconstrainedPropertyName,
          propModel.property
        );
      } else if (propModel.property instanceof ConstrainedArrayModel) {
        marshalCode = renderArraySerialization(
          modelInstanceVariable,
          prop,
          propModel.unconstrainedPropertyName,
          propModel.property
        );
      } else {*/
        const propMarshalCode = this.renderZodProperty(propModel.property);
        marshalCode = `${propModel.unconstrainedPropertyName}: ${propMarshalCode}`;
        if (index !== propertyKeys.length - 1) {
          marshalCode += ",";
        }
        // }
        return marshalCode;
      }
    );

    return `
  ${marshalNormalProperties.join("\n")}
  `;
  }
}
