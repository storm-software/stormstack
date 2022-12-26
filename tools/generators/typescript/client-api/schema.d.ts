export interface ClientApiGeneratorSchema {
  generator: string;
  additionalProperties?: string;
  globalProperties?: string;
  projectName: string;
  sourceRoot: string;
  domainName: string;
  packageName: string;
  specJsonFile: string;
}
