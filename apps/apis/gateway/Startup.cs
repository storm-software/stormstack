using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using Ocelot.Provider.Consul;
using System;
using System.Collections.Generic;
using System.IO;
using OpenSystem.Core.DotNet.Application.Helpers;
using OpenSystem.Core.DotNet.Infrastructure.Extensions;

namespace OpenSystem.Apis.Gateway
{
    public class Startup
    {
        private readonly IConfigurationRoot Configuration;

        public Startup(IWebHostEnvironment env)
        {
            /*string ocelotJson = null;
            foreach (var jsonFilename in Directory.EnumerateFiles("Configuration",
              "ocelot.*.json",
              SearchOption.AllDirectories))
            {
                using (StreamReader fi = File.OpenText(jsonFilename))
                {
                    ocelotJson = fi.ReadToEnd();
                }
            }

            if (!string.IsNullOrEmpty(ocelotJson)) {
              File.WriteAllText("ocelot.json",
                ocelotJson);
            }*/

            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("ocelot.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"ocelot.{env.EnvironmentName}.json",
                    optional: true, reloadOnChange: true)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json",
                    optional: true, reloadOnChange: true)
                .AddEnvironmentVariables();

            Configuration = builder.Build();
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services
              // .AddSwaggerForOcelot(Configuration)
              .AddOcelot(Configuration)
              .AddConfigStoredInConsul();

            services.AddServiceDiscovery(Configuration);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app)
        {
            app.UseStaticFiles();
            /*app.UseSwaggerForOcelotUI(opt => {
                opt.PathToSwaggerGenerator = "/swagger/docs";
            });*/
            app.UseOcelot().Wait();
        }
    }
}
