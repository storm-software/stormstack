using OpenSystem.Core.Application.Interfaces;
using OpenSystem.Core.Application.Services;
using OpenSystem.Core.Infrastructure.Services;
using OpenSystem.Core.Domain.Settings;
using System.Reflection;
using OpenSystem.Core.Application.Commands.Extensions;
using Microsoft.Extensions.DependencyInjection;
using OpenSystem.Core.Application.Jobs;
using OpenSystem.Core.Application.ReadStores;
using OpenSystem.Core.Domain.Events;
using OpenSystem.Core.Infrastructure.Publishers;
using OpenSystem.Core.Application.Commands;
using OpenSystem.Core.Application.Sagas;
using OpenSystem.Core.Infrastructure.Jobs;
using OpenSystem.Core.Application.Publishers;
using OpenSystem.Core.Infrastructure.Sagas;
using OpenSystem.Core.Application.Queries;
using OpenSystem.Core.Domain;
using OpenSystem.Core.Application.Subscribers.Extensions;
using OpenSystem.Core.Application.Mediator.Extensions;
using OpenSystem.Core.Infrastructure.Jobs.Extensions;
using OpenSystem.Core.Domain.Snapshots;
using OpenSystem.Core.Domain.Utilities;
using OpenSystem.Core.Domain.Aggregates;
using Microsoft.Extensions.DependencyInjection.Extensions;
using OpenSystem.Core.Application.Sagas.Extensions;

namespace OpenSystem.Core.Infrastructure
{
    public static class ServiceRegistration
    {
        public static IServiceCollection AddEventSourcing(
            this IServiceCollection serviceCollection,
            Assembly fromAssembly,
            bool useDefaults = false
        )
        {
            if (useDefaults)
                serviceCollection.AddEventSourcingDefaults();

            serviceCollection
                .AddCommands(fromAssembly)
                .AddCommandHandlers(fromAssembly)
                .AddEvents(fromAssembly)
                .AddEventUpgraders(fromAssembly)
                .AddSubscribers(fromAssembly)
                .AddSnapshots(fromAssembly)
                .AddJobs(fromAssembly)
                .AddSagas(fromAssembly);

            return serviceCollection;
        }

        public static IServiceCollection AddEventSourcingDefaults(
            this IServiceCollection serviceCollection
        )
        {
            serviceCollection.AddMemoryCache();

            serviceCollection.AddSnapshots(Assembly.GetExecutingAssembly());
            serviceCollection.AddSnapshotUpgraders(Assembly.GetExecutingAssembly());

            // Default no-op resilience strategies
            serviceCollection.AddTransient(
                typeof(IOptimisticConcurrencyRetryStrategy),
                typeof(OptimisticConcurrencyRetryStrategy)
            );
            serviceCollection.AddTransient(
                typeof(IAggregateStoreResilienceStrategy),
                typeof(NoAggregateStoreResilienceStrategy)
            );
            serviceCollection.AddTransient(typeof(IEventStore), typeof(BaseEventStore));
            serviceCollection.AddSingleton(
                typeof(IEventUpgradeContextFactory),
                typeof(EventUpgradeContextFactory)
            );
            serviceCollection.AddTransient(typeof(IAggregateStore), typeof(AggregateStore));
            serviceCollection.AddTransient(typeof(ISnapshotStore), typeof(SnapshotStore));
            serviceCollection.AddTransient(typeof(ISnapshotSerializer), typeof(SnapshotSerializer));

            serviceCollection.AddTransient(
                typeof(ISnapshotUpgradeService),
                typeof(SnapshotUpgradeService)
            );
            serviceCollection.AddTransient(
                typeof(IEventJsonSerializer),
                typeof(EventJsonSerializer)
            );
            serviceCollection.AddSingleton(typeof(IJsonSerializer), typeof(BaseJsonSerializer));
            serviceCollection.AddTransient(typeof(IJsonOptions), typeof(JsonOptions));
            serviceCollection.AddSingleton(
                typeof(IEventUpgradeManager),
                typeof(EventUpgradeManager)
            );
            serviceCollection.AddTransient(typeof(IAggregateFactory), typeof(AggregateFactory));

            serviceCollection.AddSingleton(typeof(IDomainEventFactory), typeof(DomainEventFactory));
            serviceCollection.TryAddTransient(
                typeof(ITransientFaultHandler<>),
                typeof(TransientFaultHandler<>)
            );
            // Definition services
            serviceCollection.AddSingleton(
                typeof(ISnapshotDefinitionService),
                typeof(SnapshotDefinitionService)
            );
            serviceCollection.AddSingleton(
                typeof(IEventDefinitionService),
                typeof(EventDefinitionService)
            );

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
            serviceCollection.AddTransient(typeof(ICommandBus), typeof(CommandBus));
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
            serviceCollection.AddTransient(typeof(IReadModelPopulator), typeof(ReadModelPopulator));
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
                typeof(IDispatchToReadStoresResilienceStrategy),
                typeof(NoDispatchToReadStoresResilienceStrategy)
            );
            serviceCollection.AddTransient(
                typeof(IDispatchToReadStores),
                typeof(DispatchToReadStores)
            );
            serviceCollection.AddTransient(
                typeof(IReadModelDomainEventApplier),
                typeof(ReadModelDomainEventApplier)
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

        public static void AddServiceInfrastructure(this IServiceCollection services)
        {
            services.AddTransient<IDateTimeProvider, DateTimeProvider>();
            //services.AddTransient<ICurrentUserService, CurrentUserService>();
            //services.AddTransient<IEmailService, EmailService>();
            //services.AddTransient<ICsvFileExportService, CsvFileExportService>();

            /*services.AddTransient<IIdentityService,
              IdentityService>();*/
        }

        /* public static void AddAuthenticationInfrastructure(
             this IServiceCollection services,
             IConfiguration configuration
         )
         {
             services
               .AddIdentity<ApplicationUser, IdentityRole>()
               .AddRoles<IdentityRole>()
               .AddEntityFrameworkStores<ApplicationDbContext>();

             services.AddIdentityServer(options =>
             {
                 options.UserInteraction.LoginUrl = "/user/login";
                 options.UserInteraction.LoginReturnUrlParameter = "returnUrl";

                 options.UserInteraction.LogoutUrl = "/user/logout";

                 options.UserInteraction.ConsentUrl = "/user/login/consent";
                 options.UserInteraction.ConsentReturnUrlParameter = "returnUrl";

                 options.UserInteraction.ErrorUrl = "/user/login/access-denied";
                 options.UserInteraction.ErrorIdParameter = "errorId";

                 options.UserInteraction.DeviceVerificationUrl = "/user/login/device-verification";
             })
               .AddApiAuthorization<ApplicationUser, ApplicationDbContext>();

             services
                 .AddAuthentication()
                 .AddGoogle(options =>
                 {
                     IConfigurationSection googleAuthNSection = configuration.GetSection(
                         "Authentication:Google"
                     );
                     if (googleAuthNSection != null)
                     {
                         options.ClientId = googleAuthNSection["ClientId"];
                         options.ClientSecret = googleAuthNSection["ClientSecret"];
                     }
                 })
                 .AddFacebook(options =>
                 {
                     IConfigurationSection FBAuthNSection =
                       configuration.GetSection("Authentication:FB");
                     options.ClientId = FBAuthNSection["ClientId"];
                     options.ClientSecret = FBAuthNSection["ClientSecret"];
                 })
                 .AddMicrosoftAccount(microsoftOptions =>
                 {
                     microsoftOptions.ClientId = configuration["Authentication:Microsoft:ClientId"];
                     microsoftOptions.ClientSecret = configuration["Authentication:Microsoft:ClientSecret"];
                 }).AddIdentityServerJwt();

             services.ConfigureApplicationCookie(options =>
             {
                 options.LoginPath = new PathString("/user/login");
                 options.LogoutPath = new PathString("/user/logout");
                 //options.ReturnUrlParameter = new PathString("/user");
                 options.AccessDeniedPath = new PathString("/user/login/access-denied");

                 /*options.SlidingExpiration = true;

                 options.Cookie.HttpOnly = true;
                 options.ExpireTimeSpan = TimeSpan.FromMinutes(10);

                 options.Events = new CookieAuthenticationEvents
                 {
                     OnRedirectToLogin = x =>
                     {
                         x.Response.Redirect("user/login");
                         return Task.CompletedTask;
                     }
                 };
             });

             services.AddAuthorization(
                 options =>
                     options.AddPolicy("CanPurge", policy => policy.RequireRole("Administrator"))
             );*/
    }

    /*  public static void AddCache(
          this IServiceCollection services,
          ConnectionStringSettings settings
      )
      {
          services.AddStackExchangeRedisCache(options =>
          {
              options.Configuration = settings.CacheConnection;
              options.InstanceName = SettingConstants.CacheInstanceName;
          });

          services.AddSingleton<IMessageCacheService, MessageCacheService>();
      }

      public static IHealthChecksBuilder AddHealthCheck(
          this IServiceCollection services,
          ApplicationSettings settings
      )
      {
          var builder = services.AddHealthChecks();
          services.AddHealthChecksUI(setupSettings: setup =>
          {
              setup.AddHealthCheckEndpoint("Basic Health Check", "/health-check");
          });

          return builder;
      }





      public static void AddJWTAuthentication(
          this IServiceCollection services,
          IConfiguration configuration
      )
      {
          services
              .AddAuthentication(IdentityServerAuthenticationDefaults.AuthenticationScheme)
              .AddIdentityServerAuthentication(options =>
              {
                  options.Authority = configuration["Sts:ServerUrl"];
                  options.RequireHttpsMetadata = false;
              });
      }

      public static void AddAuthorizationPolicies(
          this IServiceCollection services,
          IConfiguration configuration
      )
      {
          string admin = configuration["ApiRoles:AdminRole"],
              manager = configuration["ApiRoles:ManagerRole"],
              employee = configuration["ApiRoles:EmployeeRole"];

          services.AddAuthorization(options =>
          {
              options.AddPolicy(
                  AuthorizationConstants.AdminPolicy,
                  policy => policy.RequireAssertion(context => HasRole(context.User, admin))
              );
              options.AddPolicy(
                  AuthorizationConstants.ManagerPolicy,
                  policy =>
                      policy.RequireAssertion(
                          context =>
                              HasRole(context.User, manager) || HasRole(context.User, admin)
                      )
              );
              options.AddPolicy(
                  AuthorizationConstants.EmployeePolicy,
                  policy =>
                      policy.RequireAssertion(
                          context =>
                              HasRole(context.User, employee)
                              || HasRole(context.User, manager)
                              || HasRole(context.User, admin)
                      )
              );
          });
      }

      public static bool HasRole(ClaimsPrincipal user, string role)
      {
          if (string.IsNullOrEmpty(role))
              return false;

          return user.HasClaim(
              c =>
                  (c.Type == JwtClaimTypes.Role || c.Type == $"client_{JwtClaimTypes.Role}")
                  && System.Array.Exists(c.Value.Split(','), e => e == role)
          );
      }
}*/
}
