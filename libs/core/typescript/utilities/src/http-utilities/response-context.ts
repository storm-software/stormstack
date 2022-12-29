import { ConsoleLogger } from "../logging";
import { HttpFile } from "../types";

export interface ResponseBody {
  text(): Promise<string>;
  binary(): Promise<Blob>;
}

/**
 * Helper class to generate a `ResponseBody` from binary data
 */
export class SelfDecodingBody implements ResponseBody {
  constructor(private dataSource: Promise<Blob>) {}

  binary(): Promise<Blob> {
    return this.dataSource;
  }

  async text(): Promise<string> {
    const data: Blob = await this.dataSource;
    if (data.text) {
      return data.text();
    }

    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result as string));
      reader.addEventListener("error", () => reject(reader.error));
      reader.readAsText(data);
    });
  }
}

export class ResponseContext {
  public constructor(
    public httpStatusCode: number,
    public headers: { [key: string]: string },
    public body: ResponseBody
  ) {}

  /**
   * Parse header value in the form `value; param1="value1"`
   *
   * E.g. for Content-Type or Content-Disposition
   * Parameter names are converted to lower case
   * The first parameter is returned with the key `""`
   */
  public getParsedHeader(headerName: string): { [parameter: string]: string } {
    const result: { [parameter: string]: string } = {};
    if (!this.headers[headerName]) {
      return result;
    }

    const parameters = this.headers[headerName].split(";");
    for (const parameter of parameters) {
      let [key, value] = parameter.split("=", 2);
      key = key.toLowerCase().trim();
      if (value === undefined) {
        result[""] = key;
      } else {
        value = value.trim();
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        }
        result[key] = value;
      }
    }
    return result;
  }

  public async getBodyAsFile(): Promise<HttpFile> {
    const data = await this.body.binary();
    const fileName =
      this.getParsedHeader("content-disposition")["filename"] || "";
    const contentType = this.headers["content-type"] || "";
    try {
      return new File([data], fileName, { type: contentType });
    } catch (e) {
      /** Fallback for when the File constructor is not available */
      return Object.assign(data, {
        name: fileName,
        type: contentType,
      });
    }
  }

  /**
   * Use a heuristic to get a body of unknown data structure.
   * Return as string if possible, otherwise as binary.
   */
  public getBodyAsAny(): Promise<string | Blob | undefined> {
    try {
      return this.body.text();
    } catch (e) {
      ConsoleLogger.error((e as Error)?.message);
    }

    try {
      return this.body.binary();
    } catch (e) {
      ConsoleLogger.error((e as Error)?.message);
    }

    return Promise.resolve(undefined);
  }
}
