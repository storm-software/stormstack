import {
  ConstrainedMetaModel,
  renderJavaScriptDependency,
} from "@asyncapi/modelina";
import { AbstractDependencyManager } from "./abstract-dependency-manager";

export declare type TypeScriptExportType = "named" | "default";

export class TypeScriptDependencyManager extends AbstractDependencyManager {
  public dependencies: string[] = [];

  constructor(public options: any, dependencies: string[] = []) {
    super(dependencies);
    this.dependencies = dependencies;
  }

  /**
   * Simple helper function to add a dependency correct based on the module system that the user defines.
   */
  public addTypeScriptDependency(toImport: string, fromModule: string): void {
    const dependencyImport = this.renderDependency(toImport, fromModule);
    this.addDependency(dependencyImport);
  }

  /**
   * Simple helper function to render a dependency based on the module system that the user defines.
   */
  public renderDependency(toImport: string, fromModule: string): string {
    return renderJavaScriptDependency(
      toImport,
      fromModule,
      this.options.moduleSystem
    );
  }

  /**
   * Render the model dependencies based on the option
   */
  public renderCompleteModelDependencies(
    model: ConstrainedMetaModel,
    exportType: TypeScriptExportType
  ): string {
    const dependencyObject =
      exportType === "named" ? `{${model.name}}` : model.name;
    return this.renderDependency(dependencyObject, `./${model.name}`);
  }

  /**
   * Render the exported statement for the model based on the options
   */
  public renderExport(
    model: ConstrainedMetaModel,
    exportType: TypeScriptExportType
  ): string {
    const cjsExport =
      exportType === "default"
        ? `module.exports = ${model.name};`
        : `exports.${model.name} = ${model.name};`;
    const esmExport =
      exportType === "default"
        ? `export default ${model.name};\n`
        : `export { ${model.name} };`;
    return this.options.moduleSystem === "CJS" ? cjsExport : esmExport;
  }

  /**
   * Render the exported statement for the model based on the options
   */
  public renderExportByName(
    name: string,
    exportType: TypeScriptExportType
  ): string {
    const cjsExport =
      exportType === "default"
        ? `module.exports = ${name};`
        : `exports.${name} = ${name};`;
    const esmExport =
      exportType === "default"
        ? `export default ${name};\n`
        : `export { ${name} };`;
    return this.options.moduleSystem === "CJS" ? cjsExport : esmExport;
  }
}
