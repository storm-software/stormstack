export interface ModelApiSyncExecutorSchema {
  generator: string;
  additionalProperties?: string;
  globalProperties?: string;
  domainName: string;
  serviceName?: string;
  packageName: string;
  specJsonFile: string;
}
