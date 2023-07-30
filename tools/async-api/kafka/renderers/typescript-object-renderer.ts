import {
  ConstrainedObjectModel,
  ConstrainedObjectPropertyModel,
} from "@asyncapi/modelina";
import { TypeScriptRenderer } from "./typescript-renderer";
export { TypeScriptEventsOptions } from "../utils/types";

export abstract class TypeScriptObjectRenderer extends TypeScriptRenderer<ConstrainedObjectModel> {
  /**
   * Render all the properties for the model by calling the property preset per property.
   */
  async renderProperties(): Promise<string> {
    const properties = this.model.properties || {};
    const content: string[] = [];

    for (const property of Object.values(properties)) {
      const rendererProperty = await this.runPropertyPreset(property);
      content.push(rendererProperty);
    }

    return this.renderBlock(content);
  }

  renderProperty(property: ConstrainedObjectPropertyModel): string {
    return `${property.propertyName}${
      property.required === false ? "?" : ""
    }: ${
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
    };`;
  }

  runPropertyPreset(property: ConstrainedObjectPropertyModel): Promise<string> {
    return this.runPreset("property", { property });
  }
}
