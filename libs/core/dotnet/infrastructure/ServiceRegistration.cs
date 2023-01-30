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
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Duende.IdentityServer.Configuration;

namespace OpenSystem.Core.DotNet.Infrastructure
{
    public static class ServiceRegistration
    {
        public static void AddPersistenceInfrastructure(this IServiceCollection services,
          IConfiguration configuration)
        {
            services.AddScoped<AuditableEntitySaveChangesInterceptor>();

           /* if (configuration.GetValue<bool>("UseInMemoryDatabase"))
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
              provider.GetRequiredService<ApplicationDbContext>());*/

            #region Repositories

            services.AddTransient(typeof(IGenericRepository<>),
              typeof(GenericRepository<>));

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
        }

        public static void AddAuthenticationInfrastructure(this IServiceCollection services,
          IConfiguration configuration)
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
                };*/
            });

            if (configuration != null)
            {
              services.AddAuthentication().AddGoogle(googleOptions =>
              {
                  googleOptions.ClientId = configuration["Authentication:Google:ClientId"];
                  googleOptions.ClientSecret = configuration["Authentication:Google:ClientSecret"];
                  googleOptions.AuthorizationEndpoint = configuration["Authentication:Google:AuthorizationEndpoint"];
                  googleOptions.TokenEndpoint = configuration["Authentication:Google:TokenEndpoint"];
              });
            }

            services.AddAuthentication()
            .AddIdentityServerJwt();

            services.AddAuthorization(options =>
                options.AddPolicy("CanPurge",
                policy => policy.RequireRole("Administrator")));
        }
    }
}
