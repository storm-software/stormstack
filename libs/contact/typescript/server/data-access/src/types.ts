import { CloudflareApiServerContext } from "@open-system/core-server-cloudflare/types";
import { DB } from "./db/types";

export type ContactApiServerContext = CloudflareApiServerContext<DB>;
