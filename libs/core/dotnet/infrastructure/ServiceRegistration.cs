using OpenSystem.Core.DotNet.Application.Interfaces;
using OpenSystem.Core.DotNet.Infrastructure.Persistence;
using OpenSystem.Core.DotNet.Infrastructure.Services;
using OpenSystem.Core.DotNet.Domain.Settings;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace OpenSystem.Core.DotNet.Infrastructure
{
    public static class ServiceRegistration
    {
        public static void AddPersistenceInfrastructure(this IServiceCollection services,
          IConfiguration configuration)
        {
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
                    b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));
            }

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
        }
    }
}
