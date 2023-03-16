using System;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
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

const string SERVICE_NAME = "ReactionService.Api";

try
{
    var builder = WebApplication.CreateBuilder(args);

    // load up serilog configuration
    Log.Logger = new LoggerConfiguration()
      .ReadFrom.Configuration(builder.Configuration)
      .Enrich.FromLogContext()
      .CreateLogger();
    builder.Host.UseSerilog(Log.Logger);


    builder.Services.AddConfiguration(builder.Configuration,
      out var appSettings);

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
    builder.Services.AddSingleton<ICurrentUserService,
      CurrentUserService>();
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

    app.UseSerilogRequestLogging();
    // app.UseHttpsRedirection();
    app.UseStaticFiles();
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

    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json",
          "OpenSystem.Apis.Reaction.Controllers");
    });

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
    Log.Warning(ex,
      $"An error occurred starting {SERVICE_NAME}");
}
finally
{
    Log.CloseAndFlush();
}
