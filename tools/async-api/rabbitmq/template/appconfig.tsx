import { TemplateContext } from "@asyncapi/generator-react-sdk";
import { Server } from "@asyncapi/parser";
import { FileRenderer } from "../utils";

/*
 * Each template to be rendered must have as a root component a File component,
 * otherwise it will be skipped.
 *
 * If you don't want to render anything, you can return `null` or `undefined` and then Generator will skip the given template.
 *
 * Below you can see how reusable chunks (components) could be called.
 * Just write a new component (or import it) and place it inside the File or another component.
 *
 * Notice that you can pass parameters to components. In fact, underneath, each component is a pure Javascript function.
 */
export default function ({ asyncapi, params }: TemplateContext) {
  if (!asyncapi.hasComponents()) {
    return null;
  }

  const server = Object.entries(asyncapi.servers())
    .map(([serverName, server]: [string, Server]) => {
      if (serverName === params.server) {
        return server.url();
      }
      return "";
    })
    .join("");

  // Notice that root component is the `File` component.
  return (
    <FileRenderer name="appsettings.json">
      {`{
"Serilog": {
    "MinimumLevel": {
    "Default": "Verbose",
    "Override": {
        "System": "Error",
        "Microsoft": "Information",
        "Microsoft.AspNetCore.Authentication": "Information",
        "Microsoft.EntityFrameworkCore": "Error",
        "Microsoft.AspNetCore.Hosting.Diagnostics": "Error",
        "Microsoft.AspNetCore.Routing.EndpointMiddleware": "Error",
        "Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker": "Error",
        "Microsoft.AspNetCore.Mvc.Infrastructure.ObjectResultExecutor": "Error"
    }
    },
    "Properties": {
    "Process": "${params.namespace}"
    },
    "WriteTo": [
    {
        "Name": "Console"
    },
    {
        "Name": "Seq",
        "Args":
        {
        "serverUrl": "http://localhost:5341",
        "apiKey" : ""
        }
    }
    ],
    "Enrich": [
    "FromLogContext"
    ]
},
"Amqp": {
    "User": "${params.user}",
    "Password": "${params.password}",
    "Host": "${server}"
    }
}`}
    </FileRenderer>
  );
}
