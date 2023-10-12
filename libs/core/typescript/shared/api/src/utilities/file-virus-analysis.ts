import { MediaTypes } from "@stormstack/core-shared-state";
import { EnvConfigurationError } from "@stormstack/core-shared-utilities";
import { HeaderTypes, HttpMethods } from "../types";

export interface VirusTotalAnalysisOptions {
  url?: string;
  apiKey?: string;
}

export async function sendFileVirusAnalysis(
  file: Blob,
  options: VirusTotalAnalysisOptions = {}
): Promise<{ data: { type: string; id: string } }> {
  const { url, apiKey } = options;
  if (!url) {
    throw new EnvConfigurationError("VIRUS_TOTAL_API_URL");
  }
  if (!apiKey) {
    throw new EnvConfigurationError("VIRUS_TOTAL_API_KEY");
  }

  const response = await fetch(`${url}/api/v3/files`, {
    method: HttpMethods.POST,
    body: file,
    headers: {
      [HeaderTypes.ACCEPT]: MediaTypes.JSON,
      [HeaderTypes.X_API_KEY]: apiKey
    }
  });
  return await response.json();
}
