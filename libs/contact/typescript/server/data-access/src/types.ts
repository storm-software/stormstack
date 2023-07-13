import { CloudflareApiServerContext } from "@open-system/core-server-cloudflare/types";
import { ApiServerConnection } from "@open-system/core-server-data-access";
import { DB } from "./db/types";

export type ContactApiServerContext = CloudflareApiServerContext<DB>;

export type ContactApiBuilderOptions = {
  Context: ContactApiServerContext;
  Scalars: {
    UUID: {
      Input: string;
      Output: string;
    };
    DateTime: {
      Input: string;
      Output: string;
    };
    URL: {
      Input: string;
      Output: string;
    };
    PostalCode: {
      Input: string;
      Output: string;
    };
    CountryCode: {
      Input: string;
      Output: string;
    };
    PhoneNumber: {
      Input: string;
      Output: string;
    };
    EmailAddress: {
      Input: string;
      Output: string;
    };
  };
  Connection: ApiServerConnection;
};
