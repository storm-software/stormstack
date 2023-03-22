using OpenSystem.Core.Application.Interfaces;
using OpenSystem.Core.Application.Services;
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
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Builder;
using OpenSystem.Core.Infrastructure.WebApi.Middleware;
using System.Text.Json;
using IdentityServer4.AccessTokenValidation;
using Microsoft.AspNetCore.Mvc;
using OpenSystem.Core.Infrastructure.WebApi.Constants;
using System.Security.Claims;
using IdentityModel;
using OpenSystem.Core.Infrastructure.Persistence.Interceptors;
using OpenSystem.Core.Infrastructure.WebApi.Formatters;
using OpenSystem.Core.Infrastructure.WebApi.Services;
using Microsoft.AspNetCore.Mvc.Versioning;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.AspNetCore.Mvc.Infrastructure;

namespace OpenSystem.Core.Infrastructure
{
    public static class ServiceRegistration
    {
        public static void AddPersistenceInfrastructure(this IServiceCollection services,
          ApplicationSettings settings)
        {
            //services.AddScoped<AuditableEntitySaveChangesInterceptor>();
            //services.AddScoped<ValidateSaveChangesInterceptor>();

            services.AddCache(settings.ConnectionStrings);

            services.AddSingleton<SoftDeletedAuditableEntitySaveChangesInterceptor>();
            services.AddSingleton<ValidateSaveChangesInterceptor>();

            //services.UseEntityFrameworkCoreModel

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

            /*services.AddTransient(typeof(IGenericRepository<>),
              typeof(GenericRepository<>));*/

            #endregion Repositories
        }

        public static void AddServiceInfrastructure(this IServiceCollection services)
        {
            services.AddTransient<IDateTimeProvider,
              DateTimeProvider>();
            services.AddTransient<ICurrentUserService,
              CurrentUserService>();
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

        public static void UseCoreMiddleware(this IApplicationBuilder app)
        {
            app.UseMiddleware<CorrelationIdMiddleware>();
        }

        /// <summary>
        /// Adds the required services for <see cref="UseProblemDetails"/> to work correctly,
        /// using the specified <paramref name="configure"/> callback for configuration.
        /// </summary>
        /// <param name="services">The service collection to add the services to.</param>
        /// <param name="configure"></param>
        public static IServiceCollection AddProblemDetailsFactory(this IServiceCollection services)
        {
            //services.TryAddSingleton<LibProblemDetailsFactory>();
            //services.TryAddSingleton<ProblemDetailsMarkerService, ProblemDetailsMarkerService>();

            services.TryAddSingleton<IProblemDetailsResponseFactory,
              ProblemDetailsResponseFactory>();
            services.TryAddSingleton<IActionResultExecutor<ObjectResult>,
              ObjectResultExecutor>();

            return services;
        }

        /// <summary>
        /// Adds the required services for <see cref="UseProblemDetails"/> to work correctly,
        /// using the specified <paramref name="configure"/> callback for configuration.
        /// </summary>
        /// <param name="services">The service collection to add the services to.</param>
        /// <param name="configure"></param>
        public static void UseProblemDetailsFactory(this IApplicationBuilder app)
        {
          app.UseMiddleware<ProblemDetailsMiddleware>();
        }

        public static void AddControllersExtension(this IServiceCollection services)
        {
          // Don't need the full MVC stack for an API, see https://andrewlock.net/comparing-startup-between-the-asp-net-core-3-templates/
            services.AddControllers(options => {
                  options.InputFormatters.Insert(0,
                    new InputFormatterStream());
              })
              .AddJsonOptions(options =>
              {
                  options.JsonSerializerOptions.DictionaryKeyPolicy = JsonNamingPolicy.CamelCase;
                  options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
              });
        }

        //Configure CORS to allow any origin, header and method.
        //Change the CORS policy based on your requirements.
        //More info see: https://docs.microsoft.com/en-us/aspnet/core/security/cors?view=aspnetcore-3.0
        public static void AddCorsExtension(this IServiceCollection services)
        {
            services.AddCors();
        }

        public static IApplicationBuilder UseAntiforgery(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<AntiforgeryMiddleware>();
        }

        public static void AddVersionedApiExplorerExtension(this IServiceCollection services)
        {
            services.AddVersionedApiExplorer(o =>
            {
                o.GroupNameFormat = "'v'VVV";
                o.SubstituteApiVersionInUrl = true;
            });
        }

        public static void AddApiVersioningExtension(this IServiceCollection services)
        {
            services.AddApiVersioning(config =>
            {
                // Specify the default API Version as 1.0
                config.DefaultApiVersion = new ApiVersion(1, 0);
                // If the client hasn't specified the API version in the request, use the default API version number
                config.AssumeDefaultVersionWhenUnspecified = true;
                // Advertise the API versions supported for the particular endpoint
                config.ReportApiVersions = true;
            });
        }

        public static void AddJWTAuthentication(this IServiceCollection services,
          IConfiguration configuration)
        {

            services.AddAuthentication(IdentityServerAuthenticationDefaults.AuthenticationScheme)
            .AddIdentityServerAuthentication(options =>
            {
                options.Authority = configuration["Sts:ServerUrl"];
                options.RequireHttpsMetadata = false;
            });
        }

        public static void AddAuthorizationPolicies(this IServiceCollection services,
          IConfiguration configuration)
        {
            string admin = configuration["ApiRoles:AdminRole"],
              manager = configuration["ApiRoles:ManagerRole"],
              employee = configuration["ApiRoles:EmployeeRole"];

            services.AddAuthorization(options =>
            {
                options.AddPolicy(AuthorizationConstants.AdminPolicy, policy =>
                  policy.RequireAssertion(context => HasRole(context.User, admin)));
                options.AddPolicy(AuthorizationConstants.ManagerPolicy, policy =>
                  policy.RequireAssertion(context => HasRole(context.User, manager) ||
                  HasRole(context.User, admin)));
                options.AddPolicy(AuthorizationConstants.EmployeePolicy, policy =>
                  policy.RequireAssertion(context => HasRole(context.User, employee) ||
                  HasRole(context.User, manager) ||
                  HasRole(context.User, admin)));
            });
        }

        public static bool HasRole(ClaimsPrincipal user,
          string role)
        {
            if (string.IsNullOrEmpty(role))
                return false;

            return user.HasClaim(c => (c.Type == JwtClaimTypes.Role ||
              c.Type == $"client_{JwtClaimTypes.Role}") &&
              System.Array.Exists(c.Value.Split(','), e => e == role));
        }
    }
}
