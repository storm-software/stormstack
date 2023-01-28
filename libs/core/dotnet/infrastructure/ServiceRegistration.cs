using OpenSystem.Core.DotNet.Application.Interfaces;
using OpenSystem.Core.DotNet.Infrastructure.Persistence;
using OpenSystem.Core.DotNet.Infrastructure.Services;
using OpenSystem.Core.DotNet.Domain.Settings;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using OpenSystem.Core.DotNet.Infrastructure.Service;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.DependencyInjection;

namespace OpenSystem.Core.DotNet.Infrastructure
{
    public static class ServiceRegistration
    {
        public static void AddPersistenceInfrastructure(this IServiceCollection services,
          IConfiguration configuration)
        {
            services.AddScoped<AuditableEntitySaveChangesInterceptor>();

            if (configuration.GetValue<bool>("UseInMemoryDatabase"))
            {
                services.AddDbContext<ApplicationDbContext>(options =>
                    options.UseInMemoryDatabase("ApplicationDb"));
            }
            else
            {
                services.AddDbContext<ApplicationDbContext>(options =>
                  options.UseNpgsql(
                    configuration.GetConnectionString("DefaultConnection"),
                    builder => builder.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));
            }

            services.AddScoped<IApplicationDbContext>(provider =>
              provider.GetRequiredService<ApplicationDbContext>());

              services
                .AddIdentity<ApplicationUser, IdentityRole>()
                .AddRoles<IdentityRole>()
                .AddUserStore<ApplicationDbContext>();

              services.AddIdentityServer()
                .AddApiAuthorization<ApplicationUser, ApplicationDbContext>();

            #region Repositories

            services.AddTransient(typeof(IGenericRepository<>),
              typeof(GenericRepository<>));

            //services.AddTransient<IPositionRepositoryAsync, PositionRepositoryAsync>();
            //services.AddTransient<IEmployeeRepositoryAsync, EmployeeRepositoryAsync>();

            #endregion Repositories
        }

        public static void AddServiceInfrastructure(this IServiceCollection services,
          IConfiguration configuration)
        {
            services.Configure<MailSettings>(configuration.GetSection("MailSettings"));

            services.AddTransient<IDateTimeService,
              DateTimeService>();
            services.AddTransient<IEmailService,
              EmailService>();
            services.AddTransient<IIdentityService,
              IdentityService>();
            services.AddTransient<ICsvFileExportService,
              CsvFileExportService>();

            services.AddAuthentication()
            .AddIdentityServerJwt();

            services.AddAuthorization(options =>
                options.AddPolicy("CanPurge",
                policy => policy.RequireRole("Administrator")));
        }
    }
}
