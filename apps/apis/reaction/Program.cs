using System;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
using Serilog.Events;
using OpenSystem.Reaction.Application;
using OpenSystem.Core.Application.Services;
using OpenSystem.Core.Infrastructure.WebApi.Services;
using OpenSystem.Core.Infrastructure.Extensions;
using OpenSystem.Core.Infrastructure;
using OpenSystem.Reaction.Infrastructure;
using OpenSystem.Reaction.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using OpenSystem.Core.Application;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using HealthChecks.UI.Client;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Http;
using Microsoft.OpenApi.Models;
using System.Collections.Generic;
using OpenSystem.Core.Infrastructure.WebApi.Filters;
using System.Reflection;
using Microsoft.AspNetCore.HttpLogging;
using System.Linq;

const string SERVICE_NAME = "ReactionService.Api";

try
{
    var builder = WebApplication.CreateBuilder(args);

    builder.Services.AddConfiguration(builder.Configuration,
      out var appSettings);

    // load up serilog configuration
    Log.Logger = new LoggerConfiguration()
      .ReadFrom.Configuration(builder.Configuration)
      .CreateBootstrapLogger();
    builder.Host.UseSerilog((context, services, configuration) =>
      {
        configuration
        .ReadFrom.Configuration(builder.Configuration)
        .ReadFrom.Services(services);
      });
    /*builder.Services.AddHttpLogging(logging =>
      {
          logging.LoggingFields = HttpLoggingFields.All;
          logging.RequestHeaders.Add("sec-ch-ua");
          logging.ResponseHeaders.Add("MyResponseHeader");
          logging.MediaTypeOptions.AddText("application/javascript");
          logging.RequestBodyLogLimit = 4096;
          logging.ResponseBodyLogLimit = 4096;

      });
    builder.Services.AddW3CLogging(logging =>
      {
          // Log all W3C fields
          logging.LoggingFields = W3CLoggingFields.All;

          logging.AdditionalRequestHeaders.Add("x-forwarded-for");
          logging.AdditionalRequestHeaders.Add("x-client-ssl-protocol");
          logging.FileSizeLimit = 5 * 1024 * 1024;
          logging.RetainedFileCountLimit = 2;
          logging.FileName = "w3c_logs.log";
          logging.LogDirectory = @"Logs/Web";
          logging.FlushInterval = TimeSpan.FromSeconds(2);
      });*/

    Log.Information($"Starting {SERVICE_NAME} end point service.");


    // builder.Services.AddServiceDiscovery(builder.Configuration);

    builder.Services.AddReactionApplicationLayer();
    builder.Services.AddReactionPersistenceInfrastructure(appSettings);
    builder.Services.AddReactionServiceInfrastructure(appSettings);

    builder.Services.AddSwaggerGen(c =>
                {
                    c.EnableAnnotations(enableAnnotationsForInheritance: true,
                      enableAnnotationsForPolymorphism: true);
                    c.SwaggerDoc("v1", new OpenApiInfo
                    {
                        Version = "v1",
                        Title = "Reaction APIs",
                        Description = "Reaction APIs (ASP.NET Core 7.0)",
                        TermsOfService = new Uri("https://sullivanpj.github.io/open-system/services/reactions"),
                        Contact = new OpenApiContact
                        {
                            Name = "Patrick Sullivan",
                            Url = new Uri("https://sullivanpj.github.io/open-system/services/reactions"),
                            Email = "Patrick.Joseph.Sullivan@protonmail.com"
                        },
                        License = new OpenApiLicense
                        {
                            Name = "BSD 2-Clause License Simplified",
                            Url = new Uri("https://opensource.org/licenses/BSD-2-Clause")
                        },
                    });
                    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    Description = "Input your Bearer token in this format - Bearer {your token here} to access this API",
                });
                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer",
                            },
                            Scheme = "Bearer",
                            Name = "Bearer",
                            In = ParameterLocation.Header,
                        }, new List<string>()
                    },
                });
                c.CustomSchemaIds(type => type.FriendlyId(true));
                c.IncludeXmlComments($"{AppContext.BaseDirectory}{Path.DirectorySeparatorChar}{Assembly.GetEntryAssembly().GetName().Name}.xml");

                // Sets the basePath property in the OpenAPI document generated
                c.DocumentFilter<BasePathFilter>("/reactions");

                // Include DataAnnotation attributes on Controller Action parameters as OpenAPI validation rules (e.g required, pattern, ..)
                // Use [ValidateModelState] on Actions to actually validate it in C# as well!
                c.OperationFilter<GeneratePathParamsValidationFilter>();

                });;

    builder.Services.AddControllersExtension();

    // CORS
    builder.Services.AddCorsExtension();
    builder.Services.AddHealthChecks();

    builder.Services.AddDatabaseDeveloperPageExceptionFilter();
    builder.Services.AddHttpContextAccessor();

    //API Security
    builder.Services.AddJWTAuthentication(builder.Configuration);
    builder.Services.AddAuthorizationPolicies(builder.Configuration);

    // API version
    builder.Services.AddApiVersioningExtension();

    // API explorer
    builder.Services.AddMvcCore()
      .AddApiExplorer();

    // API explorer version
    builder.Services.AddVersionedApiExplorerExtension();


    /*builder.WebHost.ConfigureKestrel(options =>
    {
        options.ListenAnyIP(80);
    });*/

    var app = builder.Build();


    if (app.Environment.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
        // app.UseMigrationsEndPoint();
    }
    else
    {
        app.UseExceptionHandler("/error");

        // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
        app.UseHsts();
    }

    // app.UseHttpsRedirection();



    app.UseDefaultFiles();
    app.UseStaticFiles();


    app.UseSwagger(c =>
      {
          c.RouteTemplate = "swagger/{documentName}/openapi.json";
      })
      .UseSwaggerUI(c =>
      {
          // set route prefix to openapi, e.g. http://localhost:8080/openapi/index.html
          c.RoutePrefix = "swagger";
          //TODO: Either use the SwaggerGen generated OpenAPI contract (generated from C# classes)
          c.SwaggerEndpoint("/swagger/v1/openapi.json", "OpenSystem.Apis.Reaction");
          //TODO: Or alternatively use the original OpenAPI contract that's included in the static files
          // c.SwaggerEndpoint("/openapi-original.json", "OpenSystem.Apis.Reaction Original");
      });

    app.UseRouting();
    //Enable CORS
    app.UseCors(builder =>
    {
      builder.WithOrigins(new string[] { "http://localhost:3000",
        "http://localhost:3002" })
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });

    //app.UseIdentityServer();
    app.UseAuthorization();

    /*app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json",
          "OpenSystem.Apis.Reaction.Controllers");
    });*/


    app.UseSerilogRequestLogging(options =>
      {
        options.EnrichDiagnosticContext = (diagnosticContext, httpContext) =>
        {
          diagnosticContext.Set("RequestHost",
            httpContext.Request.Host.Value);
          diagnosticContext.Set("RequestPath",
            httpContext.Request.Path);
          diagnosticContext.Set("RequestProtocol",
            httpContext.Request.Protocol);
          diagnosticContext.Set("RequestQueryString",
            httpContext.Request.QueryString.Value);
          diagnosticContext.Set("RequestScheme",
            httpContext.Request.Scheme);
          diagnosticContext.Set("RequestHeaders",
            httpContext.Request.Headers.ToDictionary(h => h.Key,
              h => h.Value.ToString()));
          diagnosticContext.Set("RequestCookies",
            httpContext.Request.Cookies.ToDictionary(c => c.Key,
              c => c.Value.ToString()));
          diagnosticContext.Set("RequestServices",
            httpContext.RequestServices);
          diagnosticContext.Set("RequestContentType",
            httpContext.Request.ContentType);
          diagnosticContext.Set("RequestContentLength",
            httpContext.Request.ContentLength);
          diagnosticContext.Set("RequestBody",
            httpContext.Request.Body);
          diagnosticContext.Set("RequestIsHttps",
            httpContext.Request.IsHttps);
          diagnosticContext.Set("RequestMethod",
            httpContext.Request.Method);
          diagnosticContext.Set("RequestAborted",
            httpContext.RequestAborted);
        };
      });
    // app.UseHttpLogging();
    // app.UseW3CLogging();

    app.UseCoreMiddleware();

    app.UseHealthChecks("/health-check",
      new HealthCheckOptions
      {
          Predicate = _ => true,
          ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse,
          ResultStatusCodes =
          {
              [HealthStatus.Healthy] = StatusCodes.Status200OK,
              [HealthStatus.Degraded] = StatusCodes.Status500InternalServerError,
              [HealthStatus.Unhealthy] = StatusCodes.Status503ServiceUnavailable,
          },
      });

    app.MapControllers();

    app.Run();

    using (var scope = app.Services.CreateScope())
    {
        var dbContext = scope
          .ServiceProvider
          .GetRequiredService<ReactionDbContext>();

        // use context
        dbContext.Database.EnsureCreated();
        dbContext.Database.Migrate();
    }

    Log.Information($"{SERVICE_NAME} has started successfully.");

}
catch (Exception ex)
{
  Log.Fatal(ex,
    $"An error occurred starting {SERVICE_NAME}");
}
finally
{
  Log.CloseAndFlush();
}
