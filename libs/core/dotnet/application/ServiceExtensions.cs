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
using OpenSystem.Core.Application.Models;
using MediatR.Pipeline;
using OpenSystem.Core.Domain;
using OpenSystem.Core.Domain.Enums;
using System.Collections.Concurrent;
using OpenSystem.Core.Application.Sagas;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.Jobs;
using OpenSystem.Core.Domain.Common;
using Microsoft.Extensions.DependencyInjection.Extensions;
using OpenSystem.Core.Domain.Events.Snapshots;
using OpenSystem.Core.Domain.ReadStores;
using OpenSystem.Core.Domain.Events;
using OpenSystem.Core.Application.Subscribers;
using OpenSystem.Core.Application.Queries;

namespace OpenSystem.Core.Application
{
    public static class ServiceExtensions
    {
        public static IServiceCollection AddApplicationLayer(this IServiceCollection services)
        {
            services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
            services.AddAutoMapper(Assembly.GetExecutingAssembly());
            services.AddMediatR(Assembly.GetExecutingAssembly());
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

        public static IServiceCollection AddCommands(
            this IServiceCollection services,
            IEnumerable<Type> commandTypes
        )
        {
            var cbAggregateEventTypes = new ConcurrentBag<Type>();
            foreach (var commandType in commandTypes)
            {
                if (!typeof(ICommand).GetTypeInfo().IsAssignableFrom(commandType))
                    throw new ArgumentException(
                        $"Type {commandType.PrettyPrint()} is not a {typeof(ICommand).PrettyPrint()}"
                    );

                cbAggregateEventTypes.Add(commandType);
            }

            services.TryAddSingleton<ILoadedVersions<ICommand>>(
                new LoadedVersions<ICommand>(cbAggregateEventTypes)
            );

            return services;
        }

        public static IServiceCollection AddSnapshots(
            this IServiceCollection services,
            IEnumerable<Type> snapshotTypes
        )
        {
            var cbSnapshots = new ConcurrentBag<Type>();
            foreach (var snapshotType in snapshotTypes)
            {
                if (!typeof(ISnapshot).GetTypeInfo().IsAssignableFrom(snapshotType))
                    throw new ArgumentException(
                        $"Type {snapshotType.PrettyPrint()} is not a {typeof(ISnapshot).PrettyPrint()}"
                    );

                cbSnapshots.Add(snapshotType);
            }

            services.TryAddSingleton<ILoadedVersions<ISnapshot>>(
                new LoadedVersions<ISnapshot>(cbSnapshots)
            );

            return services;
        }

        public static IServiceCollection AddJobs(
            this IServiceCollection services,
            IEnumerable<Type> jobTypes
        )
        {
            var cbJobTypes = new ConcurrentBag<Type>();
            foreach (var jobType in jobTypes)
            {
                if (!typeof(IJob).GetTypeInfo().IsAssignableFrom(jobType))
                    throw new ArgumentException(
                        $"Type {jobType.PrettyPrint()} is not a {typeof(IJob).PrettyPrint()}"
                    );

                cbJobTypes.Add(jobType);
            }

            services.TryAddSingleton<ILoadedVersions<IJob>>(new LoadedVersions<IJob>(cbJobTypes));

            return services;
        }

        public static IServiceCollection AddSagas(
            this IServiceCollection services,
            IEnumerable<Type> sagaTypes
        )
        {
            var cbSagaTypes = new ConcurrentBag<Type>();
            foreach (var sagaType in sagaTypes)
            {
                if (!typeof(ISaga).GetTypeInfo().IsAssignableFrom(sagaType))
                {
                    throw new ArgumentException(
                        $"Type {sagaType.PrettyPrint()} is not a {typeof(ISaga).PrettyPrint()}"
                    );
                }

                cbSagaTypes.Add(sagaType);
            }

            services.TryAddSingleton<ILoadedVersions<ISaga>>(
                new LoadedVersions<ISaga>(cbSagaTypes)
            );

            return services;
        }

        public static IServiceCollection AddApplicationDefaults(
            this IServiceCollection serviceCollection
        )
        {
            serviceCollection.AddDomainDefaults();

            // Default no-op resilience strategies
            serviceCollection.AddTransient(
                typeof(IDispatchToReadStoresResilienceStrategy),
                typeof(NoDispatchToReadStoresResilienceStrategy)
            );
            serviceCollection.AddTransient(
                typeof(ISagaUpdateResilienceStrategy),
                typeof(NoSagaUpdateResilienceStrategy)
            );
            serviceCollection.AddTransient(
                typeof(IDispatchToReadStores),
                typeof(DispatchToReadStores)
            );
            serviceCollection.AddTransient(typeof(IEventStore), typeof(BaseEventStore));
            serviceCollection.AddSingleton(
                typeof(IEventUpgradeContextFactory),
                typeof(EventUpgradeContextFactory)
            );
            serviceCollection.AddSingleton(
                typeof(IEventPersistence),
                typeof(InMemoryEventPersistence)
            );
            serviceCollection.AddTransient(typeof(ICommandBus), typeof(CommandBus));
            /*serviceCollection.AddTransient(typeof(ISnapshotStore, SnapshotStore>();
            serviceCollection.AddTransient(typeof(ISnapshotSerializer, SnapshotSerializer>();
            serviceCollection.AddTransient(typeof(ISnapshotPersistence, NullSnapshotPersistence>();
            serviceCollection.AddTransient(typeof(ISnapshotUpgradeService, SnapshotUpgradeService>();*/
            serviceCollection.AddTransient(typeof(IReadModelPopulator), typeof(ReadModelPopulator));
            serviceCollection.AddTransient(
                typeof(IEventJsonSerializer),
                typeof(EventJsonSerializer)
            );

            serviceCollection.AddTransient(typeof(IJobScheduler), typeof(InstantJobScheduler));
            serviceCollection.AddTransient(typeof(IJobRunner), typeof(JobRunner));

            serviceCollection.AddTransient(
                typeof(IReadModelDomainEventApplier),
                typeof(ReadModelDomainEventApplier)
            );
            serviceCollection.AddTransient(
                typeof(ISerializedCommandPublisher),
                typeof(SerializedCommandPublisher)
            );
            serviceCollection.AddTransient(typeof(IQueryProcessor), typeof(QueryProcessor));

            serviceCollection.AddTransient(
                typeof(IDispatchToSubscriberResilienceStrategy),
                typeof(NoDispatchToSubscriberResilienceStrategy)
            );

            serviceCollection.AddTransient(
                typeof(IDispatchToEventSubscribers),
                typeof(DispatchToEventSubscribers)
            );
            serviceCollection.AddTransient(
                typeof(IDomainEventPublisher),
                typeof(DomainEventPublisher)
            );
            serviceCollection.AddTransient(typeof(ISagaStore), typeof(SagaAggregateStore));
            serviceCollection.AddTransient(typeof(ISagaErrorHandler), typeof(SagaErrorHandler));
            serviceCollection.AddTransient(typeof(IDispatchToSagas), typeof(DispatchToSagas));
            serviceCollection.AddTransient(typeof(ISagaUpdater<,,,>), typeof(SagaUpdater<,,,>));
            serviceCollection.AddSingleton(typeof(IReadModelFactory<>), typeof(ReadModelFactory<>));
            serviceCollection.AddSingleton<Func<Type, ISagaErrorHandler>>(_ => __ => null);

            // Definition services
            /*serviceCollection.AddSingleton(typeof(
                ISnapshotDefinitionService,
                SnapshotDefinitionService
            ));*/
            serviceCollection.AddSingleton(
                typeof(IJobDefinitionService),
                typeof(JobDefinitionService)
            );
            serviceCollection.AddSingleton(
                typeof(ISagaDefinitionService),
                typeof(SagaDefinitionService)
            );
            serviceCollection.AddSingleton(
                typeof(ICommandDefinitionService),
                typeof(CommandDefinitionService)
            );

            return serviceCollection;
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
