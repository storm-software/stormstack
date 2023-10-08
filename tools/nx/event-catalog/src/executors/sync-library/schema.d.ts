export interface EventLibraryExecutorSchema {
  templateName: string;
  outputPath: string;
  pdf?: string;
  png?: string;
  svg?: string;
  maxTextSize?: number;
  namespace: string;
  user?: string;
  password?: string;
  server: string;
}
