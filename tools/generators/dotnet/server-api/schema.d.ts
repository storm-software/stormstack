export interface ServerApiGeneratorSchema {
  projectName?: string;
  sourceRoot?: string;
  generator: string;
  additionalProperties?: string;
  globalProperties?: string;
  domainName: string;
  serviceName?: string;
  packageName: string;
  specJsonFile: string;
}
