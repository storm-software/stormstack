using OpenSystem.Reaction.Domain.Entities;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
using OpenSystem.Core.Infrastructure;
using Microsoft.EntityFrameworkCore;
using OpenSystem.Core.Infrastructure.Persistence.Extensions;
using OpenSystem.Reaction.Domain.Repositories;
using OpenSystem.Reaction.Infrastructure.Persistence;
using OpenSystem.Core.Domain.Settings;
using OpenSystem.Core.Domain.Repositories;
using OpenSystem.Core.Domain.Constants;
using AutoMapper;
using OpenSystem.Core.Infrastructure.Persistence.Interceptors;
using AutoMapper.EquivalencyExpression;
using OpenSystem.Reaction.Infrastructure.Persistence.Interceptors;

namespace OpenSystem.Reaction.Infrastructure
{
    public static class ServiceRegistration
    {
        public static void AddReactionPersistenceInfrastructure(
            this IServiceCollection services,
            ApplicationSettings settings
        )
        {
            services.AddPersistenceInfrastructure(settings);

            services.AddSingleton<ReactionDetailMaterializationInterceptor>();
            if (settings.UseInMemoryDatabase)
            {
                services
                    .AddDbContext<ReactionDbContext>(
                        (provider, options) =>
                        {
                            options.UseInMemoryDatabase(
                                SettingConstants.ConnectionStrings.DefaultInMemoryDatabase
                            );

                            options.AddInterceptors(
                                provider.GetRequiredService<ReactionDetailMaterializationInterceptor>()
                            );
                            options.AddInterceptors(
                                provider.GetRequiredService<SoftDeletedAuditableEntitySaveChangesInterceptor>()
                            );
                            options.AddInterceptors(
                                provider.GetRequiredService<ValidateSaveChangesInterceptor>()
                            );
                        }
                    )
                    .AddScoped(typeof(IReactionRepository), typeof(ReactionRepository))
                    .AddScoped(
                        typeof(IReactionReadOnlyRepository),
                        typeof(ReactionReadOnlyRepository)
                    );
            }
            else
            {
                services
                    .AddDbContext<ReactionDbContext>(
                        (provider, options) =>
                        {
                            options.UseNpgsql(
                                settings.ConnectionStrings.DefaultConnection,
                                builder =>
                                    builder.MigrationsAssembly(
                                        typeof(ReactionDbContext).Assembly.FullName
                                    )
                            );

                            options.AddInterceptors(
                                provider.GetRequiredService<ReactionDetailMaterializationInterceptor>()
                            );
                            options.AddInterceptors(
                                provider.GetRequiredService<SoftDeletedAuditableEntitySaveChangesInterceptor>()
                            );
                            options.AddInterceptors(
                                provider.GetRequiredService<ValidateSaveChangesInterceptor>()
                            );
                        }
                    )
                    .AddScoped(typeof(IReactionRepository), typeof(ReactionRepository))
                    .AddScoped(
                        typeof(IReactionReadOnlyRepository),
                        typeof(ReactionReadOnlyRepository)
                    );
            }

            services.AddAutoMapper(
                (serviceProvider, autoMapper) =>
                {
                    autoMapper.AddCollectionMappers();
                    autoMapper.UseEFCoreModel<ReactionDbContext>(serviceProvider);
                },
                Assembly.GetExecutingAssembly()
            );

            services.AddScoped<IBaseDbContext<ReactionEntity>>(
                provider => provider.GetRequiredService<ReactionDbContext>()
            );

            /*services.AddAutoMapper((serviceProvider, autoMapper) =>
            {
                autoMapper.AddCollectionMappers();
                autoMapper.UseEntityFrameworkCoreModel<ReactionDbContext>(serviceProvider);
            }, typeof(ReactionDbContext).Assembly);*/

            /*services.AddHealthCheck(settings)
              .AddDbContextCheck<ReactionDbContext>(name: "Application DB Context",
                  failureStatus: HealthStatus.Degraded);*/

            /*services
              .AddIdentity<ApplicationUser, IdentityRole>()
              .AddRoles<IdentityRole>()
              .AddEntityFrameworkStores<ReactionDbContext>();

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
            });*/

            /*services.AddIdentityServer()
              .AddApiAuthorization<ApplicationUser, UserApplicationDbContext>();*/

            /*services.AddTransient<IUserStore<UserEntity>, UserStore>();
            services.AddTransient<IRoleStore<Role>, RoleStore>();*/

            // services.AddAuthenticationInfrastructure(configuration);

            #region Repositories

            services.AddTransient<IReactionRepository, ReactionRepository>();

            #endregion Repositories
        }

        public static void AddReactionServiceInfrastructure(
            this IServiceCollection services,
            ApplicationSettings settings
        )
        {
            services.AddServiceInfrastructure();
        }
    }
}
