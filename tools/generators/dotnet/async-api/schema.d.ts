export interface AsyncApiGeneratorSchema {
  asyncapiFileDir: string;
  templateName: string;
  targetDir: string;
  pdf?: string;
  png?: string;
  svg?: string;
  maxTextSize?: number;
  namespace?: string;
  user?: string;
  password?: string;
  server: string;
}
