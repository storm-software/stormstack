import { HttpServerConfiguration } from "@open-system/core-typescript-utilities";

export const server1 = new HttpServerConfiguration<{  }>("http://localhost:5000/api", {  })

export const servers = [server1];
