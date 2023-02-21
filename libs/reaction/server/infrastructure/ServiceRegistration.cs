using OpenSystem.Core.Application.Behaviors;
using OpenSystem.Core.Application.Helpers;
using OpenSystem.Core.Application.Interfaces;
using OpenSystem.Core.Application;
using OpenSystem.Reaction.Domain.Entities;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
using AutoMapper;
using OpenSystem.Core.Infrastructure;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using OpenSystem.Core.Infrastructure.Persistence;
using OpenSystem.Reaction.Application.Interfaces;
using OpenSystem.Reaction.Infrastructure.Persistence;
using OpenSystem.Core.Infrastructure.Services;
using Microsoft.AspNetCore.Identity;

namespace OpenSystem.Reaction.Infrastructure
{
    public static class ServiceRegistration
    {
         public static void AddReactionPersistenceInfrastructure(this IServiceCollection services,
          IConfiguration configuration)
        {
            services.AddPersistenceInfrastructure(configuration);

            if (configuration.GetValue<bool>("UseInMemoryDatabase"))
            {
                services.AddDbContext<ReactionDbContext>(options =>
                    options.UseInMemoryDatabase("ApplicationDb"))
                  .AddScoped(typeof(IReactionRepository),
                    typeof(ReactionRepository));
            }
            else
            {
                services.AddDbContext<ReactionDbContext>(options =>
                  options.UseNpgsql(
                    configuration.GetConnectionString("DefaultConnection"),
                    builder => builder.MigrationsAssembly(typeof(ReactionDbContext).Assembly.FullName)))
                .AddScoped(typeof(IReactionRepository),
                  typeof(ReactionRepository));
            }

            services.AddScoped<IApplicationDbContext>(provider =>
              provider.GetRequiredService<ReactionDbContext>());

            services
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
            })
              .AddApiAuthorization<ApplicationUser, ReactionDbContext>();

            /*services.AddIdentityServer()
              .AddApiAuthorization<ApplicationUser, UserApplicationDbContext>();*/

            /*services.AddTransient<IUserStore<UserEntity>, UserStore>();
            services.AddTransient<IRoleStore<Role>, RoleStore>();*/

            services.AddAuthenticationInfrastructure(configuration);

            #region Repositories

            services.AddTransient<IReactionRepository,
              ReactionRepository>();

            #endregion Repositories
        }

        public static void AddReactionServiceInfrastructure(this IServiceCollection services,
          IConfiguration configuration)
        {
            services.AddServiceInfrastructure(configuration);
        }
    }
}
