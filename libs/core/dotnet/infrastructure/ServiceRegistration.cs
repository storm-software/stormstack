using OpenSystem.Core.Application.Interfaces;
using OpenSystem.Core.Infrastructure.Persistence;
using OpenSystem.Core.Infrastructure.Services;
using OpenSystem.Core.Domain.Settings;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using OpenSystem.Core.Infrastructure.Service;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using OpenSystem.Core.Domain.Constants;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;


namespace OpenSystem.Core.Infrastructure
{
    public static class ServiceRegistration
    {
        public static void AddPersistenceInfrastructure(this IServiceCollection services,
          ApplicationSettings settings)
        {
            // services.AddScoped<AuditableEntitySaveChangesInterceptor>();

            services.AddCache(settings.ConnectionStrings);

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

        public static void AddServiceInfrastructure(this IServiceCollection services)
        {
            services.AddTransient<IDateTimeProvider,
              DateTimeProvider>();
            services.AddTransient<IEmailService,
              EmailService>();
            services.AddTransient<ICsvFileExportService,
              CsvFileExportService>();
            /*services.AddTransient<IIdentityService,
              IdentityService>();*/
        }

        public static void AddAuthenticationInfrastructure(this IServiceCollection services,
          IConfiguration configuration)
        {
            /*services
              .AddIdentity<ApplicationUser, IdentityRole>()
              .AddRoles<IdentityRole>()
              .AddEntityFrameworkStores<ApplicationDbContext>();*/

            /*services.AddIdentityServer(options =>
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
              .AddApiAuthorization<ApplicationUser, ApplicationDbContext>();*/

              services.AddAuthentication()
                .AddGoogle(options =>
                {
                    IConfigurationSection googleAuthNSection =
                      configuration.GetSection("Authentication:Google");
                    if (googleAuthNSection != null)
                    {
                        options.ClientId = googleAuthNSection["ClientId"];
                        options.ClientSecret = googleAuthNSection["ClientSecret"];
                    }
                })
                /*.AddFacebook(options =>
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
                })*/.AddIdentityServerJwt();

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

            services.AddAuthorization(options =>
                options.AddPolicy("CanPurge",
                policy => policy.RequireRole("Administrator")));
        }

        public static void AddCache(this IServiceCollection services,
          ConnectionStringSettings settings)
        {
            services.AddStackExchangeRedisCache(options => {
              options.Configuration = settings.CacheConnection;
                options.InstanceName = SettingConstants.CacheInstanceName;
            });

            services.AddSingleton<IMessageCacheService, MessageCacheService>();
        }

        public static IHealthChecksBuilder AddHealthCheck(this IServiceCollection services,
          ApplicationSettings settings)
        {
            var builder = services.AddHealthChecks();
            services.AddHealthChecksUI(setupSettings: setup =>
            {
                setup.AddHealthCheckEndpoint("Basic Health Check",
                  "/health-check");
            });

            return builder;
        }
    }
}
