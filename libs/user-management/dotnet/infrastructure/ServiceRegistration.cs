using OpenSystem.Core.Application.Behaviors;
using OpenSystem.Core.Application.Helpers;
using OpenSystem.Core.Application.Interfaces;
using OpenSystem.Core.Application;
using OpenSystem.User.Domain.Entities;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
using AutoMapper;
using OpenSystem.Core.Infrastructure;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using OpenSystem.Core.Infrastructure.Persistence;
using OpenSystem.User.Application.Interfaces;
using OpenSystem.User.Infrastructure.Persistence;
using OpenSystem.Core.Infrastructure.Services;
using Microsoft.AspNetCore.Identity;
using OpenSystem.User.Infrastructure.Services;

namespace OpenSystem.User.Infrastructure
{
    public static class ServiceRegistration
    {
         public static void AddUserPersistenceInfrastructure(this IServiceCollection services,
          IConfiguration configuration)
        {
            services.AddPersistenceInfrastructure(configuration);

            if (configuration.GetValue<bool>("UseInMemoryDatabase"))
            {
                services.AddDbContext<UserApplicationDbContext>(options =>
                    options.UseInMemoryDatabase("ApplicationDb"))
                  .AddScoped(typeof(IUserRepository), typeof(UserRepository));
            }
            else
            {
                services.AddDbContext<UserApplicationDbContext>(options =>
                  options.UseNpgsql(
                    configuration.GetConnectionString("DefaultConnection"),
                    builder => builder.MigrationsAssembly(typeof(UserApplicationDbContext).Assembly.FullName)))
                .AddScoped(typeof(IUserRepository), typeof(UserRepository));
            }

            services.AddScoped<IApplicationDbContext>(provider =>
              provider.GetRequiredService<UserApplicationDbContext>());

            services
              .AddDefaultIdentity<UserEntity>()
              .AddTokenProviders()
              .AddPasswordValidators()
              .AddRoles<IdentityRole>()
              .AddEntityFrameworkStores<UserApplicationDbContext>();

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
              .AddApiAuthorization<ApplicationUser, UserApplicationDbContext>();

            /*services.AddIdentityServer()
              .AddApiAuthorization<ApplicationUser, UserApplicationDbContext>();*/

            services.AddTransient<IUserStore<UserEntity>, UserStore>();
            services.AddTransient<IRoleStore<Role>, RoleStore>();

            services.AddAuthenticationInfrastructure(configuration);

            #region Repositories

            services.AddTransient<IUserRepository,
              UserRepository>();

            #endregion Repositories

            services.Configure<DataProtectionTokenProviderOptions>(options =>
            {
                options.TokenLifespan = TimeSpan.FromHours(3);
            });

            services.Configure<EmailConfirmationTokenProviderOptions>(options =>
            {
                options.TokenLifespan = TimeSpan.FromDays(2);
            });

            services.Configure<IdentityOptions>(options =>
            {
                options.Tokens.EmailConfirmationTokenProvider = "EmailConfirmation";

                // Default Lockout settings.
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
                options.Lockout.MaxFailedAccessAttempts = 5;
                options.Lockout.AllowedForNewUsers = true;
            });

            services.Configure<PasswordHasherOptions>(option =>
            {
                option.IterationCount = 10000;
                option.CompatibilityMode = PasswordHasherCompatibilityMode.IdentityV2;
            });
        }

        public static void AddUserServiceInfrastructure(this IServiceCollection services,
          IConfiguration configuration)
        {
            services.AddServiceInfrastructure(configuration);
        }

        private static IdentityBuilder AddPasswordValidators(this IdentityBuilder identityBuilder)
        {
            identityBuilder
              .AddPasswordValidator<WeakPasswordValidator>()
              .AddPasswordValidator<HistoricalPasswordValidator>();

            return identityBuilder;
        }

        private static IdentityBuilder AddTokenProviders(this IdentityBuilder identityBuilder)
        {
            identityBuilder
                .AddDefaultTokenProviders()
                .AddTokenProvider<EmailConfirmationTokenProvider<UserEntity>>("EmailConfirmation");

            return identityBuilder;
        }
    }
}
