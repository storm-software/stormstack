export interface DesignTokensBuildExecutorSchema {
  tokensDir: string;
  tokensFile: string;
  fontsDir?: string;
  imagesDir?: string;
  clean?: boolean;
  verbose?: boolean;
}
