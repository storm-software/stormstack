using OpenSystem.Core.Application.Behaviors;
using OpenSystem.Core.Application.Commands;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
using AutoMapper;
using Microsoft.Extensions.Configuration;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Exceptions;
using OpenSystem.Core.Domain.Settings;
using OpenSystem.Core.Domain.Constants;
using MediatR.Pipeline;
using OpenSystem.Core.Domain;
using OpenSystem.Core.Domain.Enums;
using System.Collections.Concurrent;
using OpenSystem.Core.Application.Sagas;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Application.Jobs;
using OpenSystem.Core.Domain.Common;
using Microsoft.Extensions.DependencyInjection.Extensions;
using OpenSystem.Core.Application.ReadStores;
using OpenSystem.Core.Domain.Events;
using OpenSystem.Core.Application.Subscribers;
using OpenSystem.Core.Application.Queries;

namespace OpenSystem.Core.Application
{
    public static class ServiceExtensions
    {
        public static IServiceCollection AddApplicationLayer(this IServiceCollection services)
        {
            //services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
            //services.AddAutoMapper(Assembly.GetExecutingAssembly());
            //services.AddMediatR(Assembly.GetExecutingAssembly());
            services.AddTransient(
                typeof(IRequestExceptionHandler<,>),
                typeof(UnhandledExceptionBehavior<,>)
            );

            services.AddTransient(typeof(IPipelineBehavior<,>), typeof(PerformanceBehavior<,>));
            services.AddTransient(typeof(IPipelineBehavior<,>), typeof(LoggingBehavior<,>));
            services.AddTransient(
                typeof(IPipelineBehavior<ICommand, IAggregateEventResult>),
                typeof(ValidationBehavior<ICommand>)
            );
            services.AddTransient(typeof(IPipelineBehavior<,>), typeof(AuthorizationBehavior<,>));

            //services.AddTransient(typeof(IRequestPreProcessor<>), typeof(ValidationBehavior<>));

            return services;
        }

        public static IServiceCollection AddConfiguration(
            this IServiceCollection services,
            IConfiguration configuration,
            out ApplicationSettings oSettings
        )
        {
            oSettings = new ApplicationSettings();
            configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", false, true)
                .AddJsonFile(
                    $"appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ??
              "Production"}.json",
                    true,
                    true
                )
                .AddEnvironmentVariables()
                //.AddUserSecrets()
                .Build();

            oSettings.UseInMemoryDatabase = configuration.GetValue<bool>("UseInMemoryDatabase");

            var applicationDetailSettings = configuration.GetSection("ApplicationDetailSettings");
            if (!applicationDetailSettings.Exists())
                throw new MissingSettingException("ApplicationDetailSettings");

            oSettings.ApplicationDetails = new ApplicationDetailSettings
            {
                ApplicationName = applicationDetailSettings["ApplicationName"],
                Description = applicationDetailSettings["Description"],
                ContactWebsite = applicationDetailSettings["ContactWebsite"],
                LicenseDetail = applicationDetailSettings["LicenseDetail"]
            };
            services.AddSingleton<ApplicationDetailSettings>(oSettings.ApplicationDetails);

            var defaultConnection = configuration.GetConnectionString(
                SettingConstants.ConnectionStrings.DefaultConnection
            );
            if (string.IsNullOrEmpty(defaultConnection))
                throw new MissingSettingException("DefaultConnection");

            var cacheConnection = configuration.GetConnectionString(
                SettingConstants.ConnectionStrings.CacheConnection
            );
            var eventStoreConnection = configuration.GetConnectionString(
                SettingConstants.ConnectionStrings.EventStoreConnection
            );

            oSettings.ConnectionStrings = new ConnectionStringSettings
            {
                DefaultConnection = defaultConnection,
                CacheConnection = cacheConnection,
                EventStoreConnection = eventStoreConnection,
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

            var eventSourcingSettings = configuration.GetSection("EventSourcingSettings");
            oSettings.EventSourcingSettings = new EventSourcingSettings
            {
                NumberOfRetriesOnOptimisticConcurrencyExceptions =
                    eventSourcingSettings.GetValue<int>(
                        "NumberOfRetriesOnOptimisticConcurrencyExceptions"
                    ),
                ForwardOptimisticConcurrencyExceptions = eventSourcingSettings.GetValue<bool>(
                    "ForwardOptimisticConcurrencyExceptions"
                ),
                ThrowSubscriberExceptions = eventSourcingSettings.GetValue<bool>(
                    "ThrowSubscriberExceptions"
                ),
                IsAsynchronousSubscribersEnabled = eventSourcingSettings.GetValue<bool>(
                    "IsAsynchronousSubscribersEnabled"
                ),
                CancellationBoundary = string.IsNullOrEmpty(
                    eventSourcingSettings["CancellationBoundary"]
                )
                    ? CancellationBoundaryTypes.BeforeCommittingEvents
                    : (CancellationBoundaryTypes)
                        Enum.Parse(
                            typeof(CancellationBoundaryTypes),
                            eventSourcingSettings["CancellationBoundary"]
                        ),
                PopulateReadModelEventPageSize = eventSourcingSettings.GetValue<int>(
                    "PopulateReadModelEventPageSize"
                ),
            };
            var delayBeforeRetryOnOptimisticConcurrencyExceptions =
                eventSourcingSettings.GetValue<int>(
                    "DelayBeforeRetryOnOptimisticConcurrencyExceptions"
                );
            if (delayBeforeRetryOnOptimisticConcurrencyExceptions != null)
                oSettings.EventSourcingSettings.DelayBeforeRetryOnOptimisticConcurrencyExceptions =
                    TimeSpan.FromMilliseconds(delayBeforeRetryOnOptimisticConcurrencyExceptions);

            services.AddSingleton<EventSourcingSettings>(oSettings.EventSourcingSettings);
            services.AddSingleton<ICancellationSettings>(oSettings.EventSourcingSettings);

            services.AddSingleton<ApplicationSettings>(oSettings);
            return services;
        }
    }
}
