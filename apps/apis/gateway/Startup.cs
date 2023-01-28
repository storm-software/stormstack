using HealthChecks.UI.Client;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using Ocelot.Provider.Consul;
using OpenSystem.Core.DotNet.Infrastructure.Extensions;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Polly.Extensions.Http;
using Polly;
using Serilog;

namespace OpenSystem.Apis.Gateway
{
    public class Startup
    {
        private readonly IConfigurationRoot Configuration;

        public Startup(IWebHostEnvironment env)
        {
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

            Log.Logger = new LoggerConfiguration()
              .ReadFrom.Configuration(Configuration)
              .Enrich.FromLogContext()
              .CreateLogger();
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services
              .AddOcelot(Configuration)
              .AddConfigStoredInConsul();

            services.AddServiceDiscovery(Configuration);

            services.AddHealthChecks()
              .AddUrlGroup(new Uri($"{
                Configuration["GlobalConfiguration:ServiceDiscoveryProvider:Scheme"]
                }://{
                  Configuration["GlobalConfiguration:ServiceDiscoveryProvider:Host"]
                }:{
                  Configuration["GlobalConfiguration:ServiceDiscoveryProvider:Port"]
              }"),
              "user-api.service",
              Microsoft.Extensions.Diagnostics.HealthChecks.HealthStatus.Degraded);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app,
          IWebHostEnvironment env)
        {
          app.UseSerilogRequestLogging();
          if (env.IsDevelopment())
          {
              app.UseDeveloperExceptionPage();
              app.UseSwagger();
              app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json",
                "Api Gateway v1"));
          }

          app.UseRouting();
          app.UseAuthorization();
          app.UseStaticFiles();
          app.UseOcelot().Wait();

          app.UseEndpoints(endpoints =>
          {
              endpoints.MapControllers();
              endpoints.MapHealthChecks("/health-check", new HealthCheckOptions()
              {
                  Predicate = _ => true,
                  ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
              });
          });
        }

        private static IAsyncPolicy<HttpResponseMessage> GetRetryPolicy()
        {
            // In this case will wait for
            //  2 ^ 1 = 2 seconds then
            //  2 ^ 2 = 4 seconds then
            //  2 ^ 3 = 8 seconds then
            //  2 ^ 4 = 16 seconds then
            //  2 ^ 5 = 32 seconds
            return HttpPolicyExtensions
                .HandleTransientHttpError()
                .WaitAndRetryAsync(
                    retryCount: 5,
                    sleepDurationProvider: retryAttempt =>
                      TimeSpan.FromSeconds(Math.Pow(2,
                        retryAttempt)),
                    onRetry: (exception, retryCount, context) =>
                    {
                        Log.Error($"Retry {retryCount} of {context.PolicyKey} at {context.OperationKey}, due to: {exception}.");
                    });
        }

        private static IAsyncPolicy<HttpResponseMessage> GetCircuitBreakerPolicy()
        {
            return HttpPolicyExtensions
                .HandleTransientHttpError()
                .CircuitBreakerAsync(
                    handledEventsAllowedBeforeBreaking: 5,
                    durationOfBreak: TimeSpan.FromSeconds(30)
                );
        }
    }
}
