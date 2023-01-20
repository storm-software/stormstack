using OpenSystem.Core.DotNet.Application.Interfaces;
using OpenSystem.Core.DotNet.Infrastructure.Persistence.Contexts;
using OpenSystem.Core.DotNet.Infrastructure.Persistence.Repositories;
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
            /*if (configuration.GetValue<bool>("UseInMemoryDatabase"))
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
            }*/

            #region Repositories

            services.AddTransient(typeof(IGenericRepositoryAsync<>),
              typeof(GenericRepositoryAsync<>));

            //services.AddTransient<IPositionRepositoryAsync, PositionRepositoryAsync>();
            //services.AddTransient<IEmployeeRepositoryAsync, EmployeeRepositoryAsync>();

            #endregion Repositories
        }

        public static void AddSharedInfrastructure(this IServiceCollection services, IConfiguration _config)
        {
            services.Configure<MailSettings>(_config.GetSection("MailSettings"));
            services.AddTransient<IDateTimeService,
              DateTimeService>();
            services.AddTransient<IEmailService,
              EmailService>();
        }
    }
}
