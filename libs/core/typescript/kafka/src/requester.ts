import { request, RequestOptions } from "http";
import { KsqlDBRest } from "./type/definition";

export const generateOptions = (options: any, data: any) => ({
  ...options,
  method: "POST",
  path: "/ksql",
  headers: {
    "Content-Type": "application/json",
    ...options.headers,
    "Content-Length": data.length,
  },
});

export const runCommand = (
  ksqlCommand: string,
  options: RequestOptions
): Promise<KsqlDBRest> => {
  return new Promise(resolve => {
    const data = JSON.stringify({ ksql: ksqlCommand });

    let result = "";
    const requestData = {
      statusCode: 0,
    };

    const opts = generateOptions(options, data);
    const req = request(opts, res => {
      if (requestData !== undefined) {
        requestData.statusCode = res.statusCode;
        res.on("data", d => {
          result += Buffer.from(d).toString();
        });
      }
    });

    req.on("close", () => {
      try {
        resolve({ ...requestData, data: JSON.parse(result) });
      } catch (e) {
        console.log(e, result);
        resolve(e);
      }
    });

    req.on("error", error => {
      console.error(error);
    });

    req.write(data);
    req.end();
  });
};

