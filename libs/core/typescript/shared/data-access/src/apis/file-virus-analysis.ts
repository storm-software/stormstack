import {
  EnvConfigurationError,
  HttpHeaderTypes,
  HttpMediaTypes,
  HttpMethod
} from "@stormstack/core-shared-utilities";

const { VIRUS_TOTAL_API_URL, VIRUS_TOTAL_API_KEY } = process.env;

export async function postFileVirusAnalysis(
  file: Blob
): Promise<{ data: { type: string; id: string } }> {
  if (!VIRUS_TOTAL_API_URL) {
    throw new EnvConfigurationError("VIRUS_TOTAL_API_URL");
  }
  if (!VIRUS_TOTAL_API_KEY) {
    throw new EnvConfigurationError("VIRUS_TOTAL_API_KEY");
  }

  const response = await fetch(`${VIRUS_TOTAL_API_URL}/api/v3/files`, {
    method: HttpMethod.POST,
    body: file,
    headers: {
      [HttpHeaderTypes.ACCEPT]: HttpMediaTypes.JSON,
      [HttpHeaderTypes.X_APIKEY]: VIRUS_TOTAL_API_KEY
    }
  });
  return await response.json();
}
