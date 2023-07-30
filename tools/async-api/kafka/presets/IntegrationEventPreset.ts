import {
  ConstrainedArrayModel,
  ConstrainedDictionaryModel,
  ConstrainedEnumModel,
  ConstrainedMetaModel,
  ConstrainedObjectModel,
  ConstrainedReferenceModel,
  ConstrainedUnionModel,
} from "@asyncapi/modelina";
// import renderExampleFunction from "@asyncapi/modelina/lib/types/generators/typescript/presets/utils/ExampleFunction";
import { ClassRenderer } from "../renderers/ClassRenderer";
import { TypeScriptPreset } from "./typescript-preset";

export interface TypeScriptCommonPresetOptions {
  marshalling: boolean;
  example: boolean;
}

function realizePropertyFactory(prop: string, model: ConstrainedMetaModel) {
  switch (model.type) {
    case "string":
      if (model.originalInput["format"]) {
        if (
          model.originalInput["format"] === "date-time" ||
          model.originalInput["format"] === "date"
        ) {
          return `$\{${prop}?.toISOString()}`;
        } else if (model.originalInput["format"] === "url") {
          return `$\{${prop}?.toString()}`;
        }
      }

      return `$\{${prop}}`;

    case "integer":
    case "number":
    case "boolean":
      return `$\{${prop}}`;

    default:
      return `$\{JSON.stringify(${prop})}`;
  }
}

function renderStringifyProperty(
  modelInstanceVariable: string,
  model: ConstrainedMetaModel
) {
  if (
    model instanceof ConstrainedReferenceModel &&
    !(model.ref instanceof ConstrainedEnumModel)
  ) {
    return `$\{${modelInstanceVariable}.stringify()}`;
  }

  return realizePropertyFactory(modelInstanceVariable, model);
}

function renderUnionSerializationArray(
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
    ${propName}.push(\`${renderStringifyProperty(
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
      modelInstanceVariable,
      unionModel
    )},\`;
  }`;
  }
  return `json += \`"${unconstrainedProperty}": ${realizePropertyFactory(
    modelInstanceVariable,
    unionModel
  )},\`;`;
}

function renderStringifyProperties(model: ConstrainedObjectModel) {
  const properties = model.properties || {};
  const propertyKeys = [...Object.entries(properties)];

  //These are a bit special as 'unwrap' dictionary models means they have to be unwrapped within the JSON object.
  const unwrapDictionaryProperties = [];
  const normalProperties = [];
  for (const entry of propertyKeys) {
    if (
      entry[1].property instanceof ConstrainedDictionaryModel &&
      entry[1].property.serializationType === "unwrap"
    ) {
      unwrapDictionaryProperties.push(entry);
    } else {
      normalProperties.push(entry);
    }
  }

  const marshalNormalProperties = normalProperties.map(([prop, propModel]) => {
    const modelInstanceVariable = `this.${prop}`;
    let marshalCode = "";
    if (
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
    } else {
      const propStringifyCode = renderStringifyProperty(
        modelInstanceVariable,
        propModel.property
      );
      marshalCode = `json += \`"${propModel.unconstrainedPropertyName}": ${propStringifyCode},\`;`;
    }
    return `if(${modelInstanceVariable} !== undefined) {
  ${marshalCode}
}`;
  });

  const marshalUnwrapDictionaryProperties = unwrapDictionaryProperties.map(
    ([prop, propModel]) => {
      const modelInstanceVariable = "value";
      const patternPropertyStringifyCode = renderStringifyProperty(
        modelInstanceVariable,
        (propModel.property as ConstrainedDictionaryModel).value
      );
      const marshalCode = `json += \`"$\{key}": ${patternPropertyStringifyCode},\`;`;
      return `if(this.${prop} !== undefined) {
for (const [key, value] of this.${prop}.entries()) {
  //Only unwrap those who are not already a property in the JSON object
  if(Object.keys(this).includes(String(key))) continue;
    ${marshalCode}
  }
}`;
    }
  );

  return `
${marshalNormalProperties.join("\n")}
${marshalUnwrapDictionaryProperties.join("\n")}
`;
}

/**
 * Render `marshal` function based on model
 */
function renderStringify({
  renderer,
  model,
}: {
  renderer: ClassRenderer;
  model: ConstrainedObjectModel;
}): string {
  const schemaName = `${
    model.name.charAt(0).toLowerCase() +
    model.name.substring(1, model.name.length)
  }Schema`;

  return `public stringify() : string {

  let json = '{'
${renderer.indent(renderStringifyProperties(model))}
  //Remove potential last comma
  return \`$\{json.charAt(json.length-1) === ',' ? json.slice(0, json.length-1) : json}}\`;
}`;
}

/**
 * Render `unmarshal` function based on model
 */
function renderParse({
  renderer,
  model,
}: {
  renderer: ClassRenderer;
  model: ConstrainedObjectModel;
}): string {
  return `public static parse(json: string | object): ${model.type} {
    ${renderer.indent(
      `return new ${model.type}(typeof json === "object" ? json : JSON.parse(json));`
    )}
}`;
}

/**
 * Preset which adds `marshal`, `unmarshal`, `example` functions to class.
 *
 * @implements {TypeScriptPreset}
 */
export const TS_INTEGRATION_EVENT_PRESET: TypeScriptPreset = {
  class: {
    additionalContent({ renderer, model, content, options }) {
      const classOptions: any = options || {};
      const blocks: string[] = [];

      if (classOptions.marshalling === true) {
        blocks.push(renderStringify({ renderer, model }));
        blocks.push(renderParse({ renderer, model }));
      }

      /*if (classOptions.example === true) {
          blocks.push(renderExampleFunction({ model }));
        }*/

      return renderer.renderBlock([content, ...blocks], 2);
    },
  },
};
