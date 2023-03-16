using OpenSystem.Core.Application.Behaviors;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
using AutoMapper;
using Microsoft.Extensions.Configuration;
using OpenSystem.Core.Domain.ResultCodes;
using Serilog;
using OpenSystem.Core.Domain.Exceptions;
using OpenSystem.Core.Domain.Settings;
using OpenSystem.Core.Domain.Constants;

namespace OpenSystem.Core.Application
{
    public static class ServiceExtensions
    {
        public static IServiceCollection AddApplicationLayer(this IServiceCollection services)
        {
            services.AddAutoMapper(Assembly.GetExecutingAssembly());
            services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
            services.AddMediatR(Assembly.GetExecutingAssembly());

            services.AddTransient(typeof(IPipelineBehavior<,>),
              typeof(UnhandledExceptionBehavior<,>));
            services.AddTransient(typeof(IPipelineBehavior<,>),
              typeof(PerformanceBehavior<,>));
            services.AddTransient(typeof(IPipelineBehavior<,>),
              typeof(AuthorizationBehavior<,>));
            services.AddTransient(typeof(IPipelineBehavior<,>),
              typeof(ValidationBehavior<,>));

            return services;
        }

        public static IServiceCollection AddConfiguration(this IServiceCollection services,
          IConfiguration configuration,
          out ApplicationSettings oSettings)
        {
          oSettings = new ApplicationSettings();
          configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json")
            .Build();

          oSettings.UseInMemoryDatabase = configuration.GetValue<bool>("UseInMemoryDatabase");

          var applicationDetailSettings = configuration.GetSection("ApplicationDetailSettings");
          if (!applicationDetailSettings.Exists())
            throw new FailedResultException(Result.Failure(typeof(ResultCodeApplication),
              ResultCodeApplication.MissingSetting,
              "ApplicationDetailSettings is not defined in appsettings.json"));

          oSettings.ApplicationDetails = new ApplicationDetailSettings
          {
              ApplicationName = applicationDetailSettings["ApplicationName"],
              Description = applicationDetailSettings["Description"],
              ContactWebsite = applicationDetailSettings["ContactWebsite"],
              LicenseDetail = applicationDetailSettings["LicenseDetail"]
          };
          services.AddSingleton<ApplicationDetailSettings>(oSettings.ApplicationDetails);

          var defaultConnection = configuration.GetConnectionString(SettingConstants.
            ConnectionStrings.
            DefaultConnection);
          if (string.IsNullOrEmpty(defaultConnection))
            throw new FailedResultException(Result.Failure(typeof(ResultCodeDatabase),
              ResultCodeDatabase.ConnectionStringNotSet,
              "DefaultConnection is not defined in appsettings.json"));

          var cacheConnection = configuration.GetConnectionString(SettingConstants.
            ConnectionStrings.
            CacheConnection);
          oSettings.ConnectionStrings = new ConnectionStringSettings
          {
              DefaultConnection = defaultConnection,
              CacheConnection = cacheConnection
          };
          services.AddSingleton<ConnectionStringSettings>(oSettings.ConnectionStrings);

          var jwtSettings = configuration.GetSection("JWTSettings");
          oSettings.JWTSettings = new JWTSettings
          {
              Key = jwtSettings["Key"],
              Issuer = jwtSettings["Issuer"],
              Audience = jwtSettings["Audience"],
              DurationInMinutes = jwtSettings.GetValue<double>("DurationInMinutes")
          };
          services.AddSingleton<JWTSettings>(oSettings.JWTSettings);

          var mailSettings = configuration.GetSection("MailSettings");
          oSettings.MailSettings = new MailSettings
          {
              SmtpHost = mailSettings["SmtpHost"],
              SmtpPort = mailSettings.GetValue<int>("SmtpPort"),
              SmtpUser = mailSettings["SmtpUser"],
              SmtpPassword = mailSettings["SmtpPassword"],
              EmailFrom = mailSettings["EmailFrom"],
              DisplayName = mailSettings["DisplayName"],
              EnableSsl = mailSettings.GetValue<bool>("EnableSsl")
          };
          services.AddSingleton<MailSettings>(oSettings.MailSettings);

          var scheduledServiceSettings = configuration.GetSection("ScheduledServiceSettings");
          oSettings.ScheduledServiceSettings = new ScheduledServiceSettings
          {
            Cron = scheduledServiceSettings["Cron"],
            TimeoutMs = scheduledServiceSettings.GetValue<int>("TimeoutMs")
          };
          services.AddSingleton<ScheduledServiceSettings>(oSettings.ScheduledServiceSettings);

          var fileExportServiceSettings = configuration.GetSection("FileExportServiceSettings");
          oSettings.FileExportServiceSettings = new FileExportServiceSettings
          {
            FilePath = fileExportServiceSettings["FilePath"],
            FileName = fileExportServiceSettings["FileName"],
            FileExtension = fileExportServiceSettings["FileExtension"],
            AppendTimestamp = fileExportServiceSettings.GetValue<bool>("AppendTimestamp")
          };
          services.AddSingleton<FileExportServiceSettings>(oSettings.FileExportServiceSettings);

          services.AddSingleton<ApplicationSettings>(oSettings);
          return services;
        }
    }
}
