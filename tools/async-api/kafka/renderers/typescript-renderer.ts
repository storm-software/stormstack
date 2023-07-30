import {
  ConstrainedMetaModel,
  FormatHelpers,
  InputMetaModel,
  Preset,
} from "@asyncapi/modelina";
import { TypeScriptDependencyManager } from "../generator/typescript-dependency-manager";
import { TypeScriptEventsGenerator } from "../generator/typescript-events-generator";
import { TypeScriptEventsOptions } from "../utils";
import { AbstractRenderer } from "./abstract-renderer";

export abstract class TypeScriptRenderer<
  TConstrainedMetaModel extends ConstrainedMetaModel = ConstrainedMetaModel
> extends AbstractRenderer<
  TypeScriptEventsOptions,
  TypeScriptEventsGenerator,
  TConstrainedMetaModel
> {
  constructor(
    options: TypeScriptEventsOptions,
    generator: TypeScriptEventsGenerator,
    presets: Array<[Preset, unknown]>,
    model: TConstrainedMetaModel,
    inputModel: InputMetaModel,
    public dependencyManager: TypeScriptDependencyManager
  ) {
    super(options, generator, presets, model, inputModel);
  }

  renderComments(lines: string | string[]): string {
    lines = FormatHelpers.breakLines(lines);
    const renderedLines = lines.map(line => ` * ${line}`).join("\n");
    return `/**
${renderedLines}
 */`;
  }
}
