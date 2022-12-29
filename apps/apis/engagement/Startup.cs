/*
 * Engagement
 *
 * A collection of APIs used to get and set user reactions and comments for an article/page
 *
 * The version of the OpenAPI document: 1.0
 * Contact: Patrick.Joseph.Sullivan@protonmail.com
 */

using System;
using System.IO;
using System.Reflection;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Mvc.Versioning;
using Microsoft.OpenApi.Models;
using OpenSystem.Apis.Engagement.Authentication;
using OpenSystem.Apis.Engagement.Filters;
using OpenSystem.Apis.Engagement.OpenApi;
using OpenSystem.Apis.Engagement.Formatters;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

namespace OpenSystem.Apis.Engagement
{
    /// <summary>
    /// Startup
    /// </summary>
    public class Startup
    {
        private const string SERVICE_NAME = "EngagementService.Api";

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="configuration"></param>
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        /// <summary>
        /// The application configuration.
        /// </summary>
        public IConfiguration Configuration { get; }

        /// <summary>
        /// This method gets called by the runtime. Use this method to add services to the container.
        /// </summary>
        /// <param name="services"></param>
        public void ConfigureServices(IServiceCollection services)
        {
            // services.AddConsul(Configuration.GetServiceConfig());


            // Add framework services.
            services
                // Don't need the full MVC stack for an API, see https://andrewlock.net/comparing-startup-between-the-asp-net-core-3-templates/
                .AddControllers(options => {
                    options.InputFormatters.Insert(0, new InputFormatterStream());
                });
                /*.AddJsonOptions(opts =>
                {
                    opts.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
                    opts.SerializerSettings.Converters.Add(new StringEnumConverter
                    {
                        CamelCaseText = true
                    });
                });*/

            services.AddApiVersioning(options =>
                {
                options.DefaultApiVersion = new ApiVersion(1, 0);
                options.AssumeDefaultVersionWhenUnspecified = true;
                options.ReportApiVersions = true;
                options.ApiVersionReader =
                    ApiVersionReader.Combine(
                        new HeaderApiVersionReader("X-Api-Version"),
                        new QueryStringApiVersionReader("version"));
                });


            services
                .AddSwaggerGen(c =>
                {
                    c.EnableAnnotations(enableAnnotationsForInheritance: true, enableAnnotationsForPolymorphism: true);

                    c.SwaggerDoc("v1.0", new OpenApiInfo
                    {
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
                        Version = "v1.0",
                    });
                    c.CustomSchemaIds(type => type.FriendlyId(true));
                    c.IncludeXmlComments($"{AppContext.BaseDirectory}{Path.DirectorySeparatorChar}{Assembly.GetEntryAssembly().GetName().Name}.xml");
                    // Sets the basePath property in the OpenAPI document generated
                    c.DocumentFilter<BasePathFilter>("/api");

                    // Include DataAnnotation attributes on Controller Action parameters as OpenAPI validation rules (e.g required, pattern, ..)
                    // Use [ValidateModelState] on Actions to actually validate it in C# as well!
                    c.OperationFilter<GeneratePathParamsValidationFilter>();
                });

                services.AddHttpContextAccessor();
                services.AddCors();
                services.AddRouting(options => options.LowercaseUrls = true);
        }

        /// <summary>
        /// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        /// </summary>
        /// <param name="app"></param>
        /// <param name="env"></param>
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            // app.UseHttpsRedirection();
            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.UsePathBase("/api");
            app.UseSwagger(c =>
                {
                    c.RouteTemplate = "/api/v1.0/{documentName}/openapi.json";
                })
                .UseSwaggerUI(c =>
                {
                    // set route prefix to /api/v1.0, e.g. http://localhost:8080//api/v1.0/index.html
                    c.RoutePrefix = "/api/v1.0";
                    //TODO: Either use the SwaggerGen generated OpenAPI contract (generated from C# classes)
                    c.SwaggerEndpoint("/api/v1.0/openapi-original.json", "Engagement");

                    //TODO: Or alternatively use the original OpenAPI contract that's included in the static files
                    // c.SwaggerEndpoint("/openapi-original.json", "Engagement Original");
                });
            app.UseRouting();
            app.UseStaticFiles();
            app.UseEndpoints(endpoints =>
                {
                    endpoints.MapControllers();
                    endpoints.MapGet("/", async context =>
                    {
                        await context.Response.WriteAsync(SERVICE_NAME);
                    });
                });
        }
    }
}
