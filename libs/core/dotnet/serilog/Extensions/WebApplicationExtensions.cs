using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using OpenSystem.Core.Domain.Constants;
using Serilog.AspNetCore;
using Serilog;
using Serilog.Sinks.SystemConsole.Themes;

namespace OpenSystem.Core.Serilog.Extensions
{
    public static class WebApplicationExtensions
    {
        public static ILogger AddSerilogLogging(
            this WebApplicationBuilder builder,
            IConfiguration configuration
        )
        {
            // load up serilog configuration
            var logger = new LoggerConfiguration().ReadFrom
                .Configuration(configuration)
                /*.WriteTo.Async(
                    wt =>
                        wt.Console(
                            theme: AnsiConsoleTheme.Code,
                            outputTemplate: "[{Timestamp:yyyy-MM-dd HH:mm:ss.fff} {Level:u3}] ({MachineName}): {Message:lj}{NewLine}{Exception}"
                        )
                )*/
                .CreateBootstrapLogger();
            builder.Host.UseSerilog(
                (context, services, configuration) =>
                {
                    configuration.ReadFrom
                        .Configuration(builder.Configuration)
                        .ReadFrom.Services(services);
                }
            );

            return logger;
        }

        public static IApplicationBuilder UseSerilogLogging(this IApplicationBuilder app)
        {
            app.UseSerilogRequestLogging(options =>
            {
                options.MessageTemplate =
                    "Http Request Processed - '{RequestPath}'{NewLine}{NewLine}---- Request ----{NewLine}Request Host: {RequestHost}{NewLine}Request Protocol: {RequestProtocol}{NewLine}Request Query String: {RequestQueryString}{NewLine}Request Scheme: {RequestScheme}{NewLine}Request Headers: {RequestHeaders}{NewLine}Request Cookies: {RequestCookies}{NewLine}Request Services: {RequestServices}{NewLine}Request Content Type: {RequestContentType}{NewLine}Request Content Length: {RequestContentLength}{NewLine}Request Body: {RequestBody}{NewLine}Request Is Https: {RequestIsHttps}{NewLine}Request Method: {RequestMethod}{NewLine}Request Aborted: {RequestAborted}{NewLine}{NewLine}---- Response ----{NewLine}Response Status Code: {ResponseStatusCode}{NewLine}Response Headers: {ResponseHeaders}{NewLine}Response Content Type: {ResponseContentType}{NewLine}Response Content Length: {ResponseContentLength}{NewLine} ";
                options.EnrichDiagnosticContext = (diagnosticContext, httpContext) =>
                {
                    diagnosticContext.Set("NewLine", Literals.NewLine);
                    diagnosticContext.Set("RequestHost", httpContext.Request.Host.Value);
                    diagnosticContext.Set("RequestPath", httpContext.Request.Path);
                    diagnosticContext.Set("RequestProtocol", httpContext.Request.Protocol);
                    diagnosticContext.Set(
                        "RequestQueryString",
                        httpContext.Request.QueryString.Value
                    );
                    diagnosticContext.Set("RequestScheme", httpContext.Request.Scheme);
                    diagnosticContext.Set(
                        "RequestHeaders",
                        httpContext.Request.Headers.ToDictionary(
                            h => h.Key,
                            h => h.Value.ToString()
                        )
                    );
                    diagnosticContext.Set(
                        "RequestCookies",
                        httpContext.Request.Cookies.ToDictionary(
                            c => c.Key,
                            c => c.Value.ToString()
                        )
                    );
                    diagnosticContext.Set("RequestServices", httpContext.RequestServices);
                    diagnosticContext.Set("RequestContentType", httpContext.Request.ContentType);
                    diagnosticContext.Set(
                        "RequestContentLength",
                        httpContext.Request.ContentLength
                    );
                    diagnosticContext.Set("RequestBody", httpContext.Request.Body);
                    diagnosticContext.Set("RequestIsHttps", httpContext.Request.IsHttps);
                    diagnosticContext.Set("RequestMethod", httpContext.Request.Method);
                    diagnosticContext.Set(
                        "RequestAborted",
                        httpContext.RequestAborted.IsCancellationRequested
                    );

                    diagnosticContext.Set("ResponseStatusCode", httpContext.Response.StatusCode);
                    diagnosticContext.Set(
                        "ResponseHeaders",
                        httpContext.Response.Headers.ToDictionary(
                            h => h.Key,
                            h => h.Value.ToString()
                        )
                    );
                    diagnosticContext.Set("ResponseContentType", httpContext.Response.ContentType);
                    diagnosticContext.Set(
                        "ResponseContentLength",
                        httpContext.Response.ContentLength
                    );
                };
            });

            return app;
        }

        /*public static string FormatHttpContextValue(this IApplicationBuilder app)
        {
            app.UseSerilogRequestLogging(options =>
            {
                options.MessageTemplate =
                    "Http Request Processed - '{RequestPath}'{NewLine}{NewLine}---- Request ----{NewLine}Request Host: {RequestHost}{NewLine}Request Protocol: {RequestProtocol}{NewLine}Request Query String: {RequestQueryString}{NewLine}Request Scheme: {RequestScheme}{NewLine}Request Headers: {RequestHeaders}{NewLine}Request Cookies: {RequestCookies}{NewLine}Request Services: {RequestServices}{NewLine}Request Content Type: {RequestContentType}{NewLine}Request Content Length: {RequestContentLength}{NewLine}Request Body: {RequestBody}{NewLine}Request Is Https: {RequestIsHttps}{NewLine}Request Method: {RequestMethod}{NewLine}Request Aborted: {RequestAborted}{NewLine}---- Response ----{NewLine}Response Status Code: {ResponseStatusCode}{NewLine}Response Headers: {ResponseHeaders}{NewLine}Response Content Type: {ResponseContentType}{NewLine}Response Content Length: {ResponseContentLength}{NewLine} ";
                options.EnrichDiagnosticContext = (diagnosticContext, httpContext) =>
                {
                    diagnosticContext.Set("RequestHost", httpContext.Request.Host.Value);
                    diagnosticContext.Set("RequestPath", httpContext.Request.Path);
                    diagnosticContext.Set("RequestProtocol", httpContext.Request.Protocol);
                    diagnosticContext.Set(
                        "RequestQueryString",
                        httpContext.Request.QueryString.Value
                    );
                    diagnosticContext.Set("RequestScheme", httpContext.Request.Scheme);
                    diagnosticContext.Set(
                        "RequestHeaders",
                        httpContext.Request.Headers.ToDictionary(
                            h => h.Key,
                            h => h.Value.ToString()
                        )
                    );
                    diagnosticContext.Set(
                        "RequestCookies",
                        httpContext.Request.Cookies.ToDictionary(
                            c => c.Key,
                            c => c.Value.ToString()
                        )
                    );
                    diagnosticContext.Set("RequestServices", httpContext.RequestServices);
                    diagnosticContext.Set("RequestContentType", httpContext.Request.ContentType);
                    diagnosticContext.Set(
                        "RequestContentLength",
                        httpContext.Request.ContentLength
                    );
                    diagnosticContext.Set("RequestBody", httpContext.Request.Body);
                    diagnosticContext.Set("RequestIsHttps", httpContext.Request.IsHttps);
                    diagnosticContext.Set("RequestMethod", httpContext.Request.Method);
                    diagnosticContext.Set("RequestAborted", httpContext.RequestAborted.IsCancellationRequested);

                    diagnosticContext.Set("ResponseStatusCode", httpContext.Response.StatusCode);
                    diagnosticContext.Set(
                        "ResponseHeaders",
                        httpContext.Response.Headers.ToDictionary(
                            h => h.Key,
                            h => h.Value.ToString()
                        )
                    );
                    diagnosticContext.Set("ResponseContentType", httpContext.Response.ContentType);
                    diagnosticContext.Set(
                        "ResponseContentLength",
                        httpContext.Response.ContentLength
                    );
                };
            });

            return app;
        }*/
    }
}
