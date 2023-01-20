using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Text.Json;
using OpenSystem.Apis.Engagement.Authentication;
using OpenSystem.Apis.Engagement.Filters;
using OpenSystem.Apis.Engagement.OpenApi;
using OpenSystem.Apis.Engagement.Formatters;
using Swashbuckle.AspNetCore.SwaggerUI;

namespace OpenSystem.Apis.Engagement.Extensions
{
    public static class ServiceExtensions
    {

        public static void AddSwaggerExtension(this IServiceCollection services)
        {
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Version = "v1",
                    Title = "Engagement",
                    Description = "Engagement (ASP.NET Core 7.0)",
                    TermsOfService = new Uri("https://sullivanpj.github.io/open-system/services/engagement"),
                    Contact = new OpenApiContact
                    {
                        Name = "Patrick Sullivan",
                        Url = new Uri("https://sullivanpj.github.io/open-system/services/engagement"),
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
                // c.DocumentFilter<BasePathFilter>("/api");

                // Include DataAnnotation attributes on Controller Action parameters as OpenAPI validation rules (e.g required, pattern, ..)
                // Use [ValidateModelState] on Actions to actually validate it in C# as well!
                c.OperationFilter<GeneratePathParamsValidationFilter>();
            });
        }
    }

}
