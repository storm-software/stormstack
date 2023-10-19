import { join } from "path";
import { CompilerOptions, Project } from "ts-morph";
import {
  createProject,
  emitProject,
  formatFile,
  saveProject
} from "../../code-gen";
import { TypescriptPluginOptions } from "../../types";
import { DirectoryTracker } from "./directory-tracker";
import { Generator } from "./generator";

/**
 * Base class for TypeScript generators
 */
export abstract class TypescriptGenerator<
  TOptions extends TypescriptPluginOptions = TypescriptPluginOptions
> extends Generator<TOptions> {
  protected project: Project;
  protected directoryTracker: DirectoryTracker | undefined;

  public get fileExtension(): string {
    return "ts";
  }

  public get commentStart(): string {
    return "//";
  }

  constructor(protected compilerOptions?: CompilerOptions) {
    super();

    this.project = createProject(compilerOptions);
  }

  public async save(options: TOptions) {
    if (this.directoryTracker && options.generateIndexFiles !== false) {
      const indexFiles = this.directoryTracker.getIndexFile();
      for (const indexFile of indexFiles) {
        await this.write(options, indexFile.fileContent, indexFile.fileName);
      }
    }

    const shouldCompile = options.compile !== false;
    if (!shouldCompile || options.preserveTsFiles === true) {
      // save ts files
      return saveProject(this.project);
    }
    if (shouldCompile) {
      return emitProject(this.project);
    }
  }

  protected async innerWrite(
    options: TOptions,
    fileContent: string,
    fileName: string,
    fileExtension = this.fileExtension
  ) {
    const extension =
      fileExtension === "*"
        ? ""
        : fileExtension.startsWith(".")
        ? fileExtension
        : `.${fileExtension}`;

    const filePath = join(
      options.output,
      fileName.endsWith(extension) ? fileName : `${fileName}${extension}`
    );
    const file = this.project.createSourceFile(filePath, fileContent, {
      overwrite: true
    });

    if (options.prettier !== false) {
      await formatFile(file, this.getParserFromExtension(extension));
    }

    if (options.generateIndexFiles !== false) {
      this.directoryTracker ??= new DirectoryTracker("/");
      this.directoryTracker.addFile(filePath.replace(options.output, ""));
    }
  }

  protected getParserFromExtension(extension: string): string {
    switch (extension) {
      case ".ts":
      case ".tsx":
        return "typescript";
      case ".js":
      case ".jsx":
        return "babel";
      case ".json":
        return "json";
      case ".gql":
      case ".graphql":
        return "graphql";
      default:
        return "typescript";
    }
  }
}
