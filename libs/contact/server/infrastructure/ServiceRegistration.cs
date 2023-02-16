using OpenSystem.Core.Application.Behaviors;
using OpenSystem.Core.Application.Helpers;
using OpenSystem.Core.Application.Interfaces;
using OpenSystem.Core.Application;
using OpenSystem.Contact.Domain.Entities;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
using AutoMapper;
using OpenSystem.Core.Infrastructure;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using OpenSystem.Core.Infrastructure.Persistence;
using OpenSystem.Contact.Application.Interfaces;
using OpenSystem.Contact.Infrastructure.Persistence;
using OpenSystem.Core.Infrastructure.Services;
using Microsoft.AspNetCore.Identity;

namespace OpenSystem.Contact.Infrastructure
{
    public static class ServiceRegistration
    {
         public static void AddContactPersistenceInfrastructure(this IServiceCollection services,
          IConfiguration configuration)
        {
            services.AddPersistenceInfrastructure(configuration);

            if (configuration.GetValue<bool>("UseInMemoryDatabase"))
            {
                services.AddDbContext<ContactApplicationDbContext>(options =>
                    options.UseInMemoryDatabase("ApplicationDb"))
                  .AddScoped(typeof(IContactRepository),
                    typeof(ContactRepository));
            }
            else
            {
                services.AddDbContext<ContactApplicationDbContext>(options =>
                  options.UseNpgsql(
                    configuration.GetConnectionString("DefaultConnection"),
                    builder => builder.MigrationsAssembly(typeof(ContactApplicationDbContext).Assembly.FullName)))
                .AddScoped(typeof(IContactRepository),
                  typeof(ContactRepository));
            }

            services.AddScoped<IApplicationDbContext>(provider =>
              provider.GetRequiredService<ContactApplicationDbContext>());

            services
              .AddIdentity<ApplicationUser, IdentityRole>()
              .AddRoles<IdentityRole>()
              .AddEntityFrameworkStores<ContactApplicationDbContext>();

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
              .AddApiAuthorization<ApplicationUser, ContactApplicationDbContext>();

            /*services.AddIdentityServer()
              .AddApiAuthorization<ApplicationUser, UserApplicationDbContext>();*/

            /*services.AddTransient<IUserStore<UserEntity>, UserStore>();
            services.AddTransient<IRoleStore<Role>, RoleStore>();*/

            services.AddAuthenticationInfrastructure(configuration);

            #region Repositories

            services.AddTransient<IContactRepository,
              ContactRepository>();

            #endregion Repositories
        }

        public static void AddContactServiceInfrastructure(this IServiceCollection services,
          IConfiguration configuration)
        {
            services.AddServiceInfrastructure(configuration);
        }
    }
}
