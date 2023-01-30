using OpenSystem.Core.DotNet.Application.Behaviors;
using OpenSystem.Core.DotNet.Application.Helpers;
using OpenSystem.Core.DotNet.Application.Interfaces;
using OpenSystem.Core.DotNet.Application;
using OpenSystem.User.Domain.Entities;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
using AutoMapper;
using OpenSystem.Core.DotNet.Infrastructure;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using OpenSystem.Core.DotNet.Infrastructure.Persistence;
using OpenSystem.User.Application.Interfaces;
using OpenSystem.User.Infrastructure.Persistence;

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
                    options.UseInMemoryDatabase("ApplicationDb"));
            }
            else
            {
                services.AddDbContext<UserApplicationDbContext>(options =>
                  options.UseNpgsql(
                    configuration.GetConnectionString("DefaultConnection"),
                    builder => builder.MigrationsAssembly(typeof(UserApplicationDbContext).Assembly.FullName)));
            }

            services.AddScoped<IApplicationDbContext>(provider =>
              provider.GetRequiredService<UserApplicationDbContext>());

            #region Repositories

            services.AddTransient<IUserRepository,
              UserRepository>();

            #endregion Repositories
        }

        public static void AddUserServiceInfrastructure(this IServiceCollection services,
          IConfiguration configuration)
        {
            services.AddServiceInfrastructure(configuration);
        }
    }
}
