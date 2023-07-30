import { ConstrainedObjectPropertyModel } from "@asyncapi/modelina";
import { ClassPresetType } from "../presets/typescript-preset";
import { TypeScriptObjectRenderer } from "./typescript-object-renderer";

export class ClassRenderer extends TypeScriptObjectRenderer {
  public async defaultSelf(): Promise<string> {
    const content = [
      await this.renderStatic(),
      await this.renderProperties(),
      await this.runCtorPreset(),
      await this.renderAccessors(),
      await this.runAdditionalContentPreset(),
    ];

    return `class ${
      this.model.name ?? this.model.name
    } extends IntegrationEvent {
${this.indent(this.renderBlock(content, 2))}
}`;
  }

  runCtorPreset(): Promise<string> {
    return this.runPreset("ctor");
  }

  async renderStatic(): Promise<string> {
    return `
  public static eventType = "${this.model.name}";

  public static isMatch(event: IIntegrationEvent): event is ${this.model.name} {
    return event.eventType === ${this.model.name}.eventType;
  }
    `;
  }

  async renderAccessors(): Promise<string> {
    const properties = this.model.properties;
    const content: string[] = [];

    for (const property of Object.values(properties)) {
      const getter = await this.runGetterPreset(property);
      const setter = await this.runSetterPreset(
        property as ConstrainedObjectPropertyModel
      );
      content.push(this.renderBlock([getter, setter]));
    }

    return this.renderBlock(content, 2);
  }

  runGetterPreset(property: ConstrainedObjectPropertyModel): Promise<string> {
    return this.runPreset("getter", { property });
  }

  runSetterPreset(property: ConstrainedObjectPropertyModel): Promise<string> {
    return this.runPreset("setter", { property });
  }
}

export const TS_DEFAULT_CLASS_PRESET: ClassPresetType = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  ctor({ renderer, model, options }): string {
    const properties = model.properties || {};
    const assignments = Object.entries(properties).map(
      ([propertyName, property]: [string, ConstrainedObjectPropertyModel]) => {
        return `this.#${propertyName} = ${
          property.property.type === "string" &&
          (property.property.originalInput["format"] === "date" ||
            property.property.originalInput["format"] === "date-time")
            ? `typeof values.${property.propertyName} === "string" || typeof values.${property.propertyName} === "number" ? new Date(values.${property.propertyName}) : values.${property.propertyName}`
            : property.property.type === "string" &&
              property.property.originalInput["format"] === "url"
            ? `typeof values.${property.propertyName} === "string" ? new URL(values.${property.propertyName}) : values.${property.propertyName}`
            : property.property.type === "number" &&
              property.property.originalInput["format"] === "int64"
            ? `bigint(values.${property.propertyName})`
            : `values.${property.propertyName}`
        };`;
      }
    );

    const ctorProperties = Object.values(properties).map(property => {
      return renderer.renderProperty(property).replace(";", ",");
    });

    const schemaName = `${
      model.name.charAt(0).toLowerCase() +
      model.name.substring(1, model.name.length)
    }Schema`;

    return `constructor(input: {
${renderer.indent(renderer.renderBlock(ctorProperties))}
}) {
  super(${model.name}.eventType, ${options.version ?? 1}, "server-event");

  const values = ${schemaName}.parse(input);

  ${renderer.indent(renderer.renderBlock(assignments))}
}`;
  },
  property({ renderer, property }): string {
    return `#${renderer.renderProperty(property)}`;
  },
  getter({ property }): string {
    return `public get ${property.propertyName}(): ${
      property.property.type === "string" &&
      (property.property.originalInput["format"] === "date" ||
        property.property.originalInput["format"] === "date-time")
        ? "Date"
        : property.property.type === "string" &&
          property.property.originalInput["format"] === "url"
        ? "URL"
        : property.property.type === "number" &&
          property.property.originalInput["format"] === "int64"
        ? "bigint"
        : property.property.type
    }${property.required === false ? " | undefined" : ""} { return this.#${
      property.propertyName
    }; }`;
  },
  setter({ property }): string {
    return `public set ${property.propertyName}(${property.propertyName}: ${
      property.property.type === "string" &&
      (property.property.originalInput["format"] === "date" ||
        property.property.originalInput["format"] === "date-time")
        ? "Date | string | number"
        : property.property.type === "string" &&
          property.property.originalInput["format"] === "url"
        ? "URL | string"
        : property.property.type === "number" &&
          property.property.originalInput["format"] === "int64"
        ? "bigint | number"
        : property.property.type
    }${property.required === false ? " | undefined" : ""}) { this.#${
      property.propertyName
    } = ${
      property.property.type === "string" &&
      (property.property.originalInput["format"] === "date" ||
        property.property.originalInput["format"] === "date-time")
        ? `typeof ${property.propertyName} === "string" || typeof ${property.propertyName} === "number" ? new Date(${property.propertyName}) : ${property.propertyName}`
        : property.property.type === "string" &&
          property.property.originalInput["format"] === "url"
        ? `typeof ${property.propertyName} === "string" ? new URL(${property.propertyName}) : ${property.propertyName}`
        : property.property.type === "number" &&
          property.property.originalInput["format"] === "int64"
        ? `bigint(${property.propertyName})`
        : property.propertyName
    }; }`;
  },
};
