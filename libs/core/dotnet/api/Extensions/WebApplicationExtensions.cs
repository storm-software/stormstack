using System.Reflection;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using OpenSystem.Core.Domain.Settings;
using OpenSystem.Core.Infrastructure.ModelBinding;
using OpenSystem.Core.Infrastructure.Routing;
using OpenSystem.Core.Application.Utilities;
using OpenSystem.Core.Infrastructure.Utilities;
using OpenSystem.Core.Application.Attributes;

namespace OpenSystem.Core.Api.Extensions
{
    public static class WebApplicationExtension
    {
        public static WebApplication MapRequest<TRequest>(this WebApplication app) =>
            MapRequest(app, typeof(TRequest));

        public static WebApplication MapRequest(this WebApplication app, Type type)
        {
            var filters = RouteFilterUtility.GetFilters(type);
            var handler = new RouteExecutor(type, filters);
            foreach (var item in RequestUtility.GetRequestTypes(type))
                app.MapMethods(item.Template, item.SupportedMethods, handler.Handle);

            return app;
        }

        public static WebApplication MapRequest(
            this WebApplication app,
            string pattern,
            Type type,
            IEnumerable<string> httpMethods
        )
        {
            var filters = RouteFilterUtility.GetFilters(type);
            var handler = new RouteExecutor(type, filters);
            app.MapMethods(pattern, httpMethods, handler.Handle);
            return app;
        }

        /// <summary>
        /// Scan and map the entire assembly for <see cref="MapMethodAttribute"/> and <see cref="IEndpointRequest"/>.
        /// </summary>
        /// <param name="app">Web application</param>
        /// <param name="assembly">Assembly to scan. When null, will try to resolve from <see cref="MinimatrConfiguration"/>.</param>
        /// <returns></returns>
        /// <exception cref="NullReferenceException"></exception>
        public static WebApplication MapAllRequests(
            this WebApplication app,
            Assembly? assembly = null
        )
        {
            foreach (var type in GetTypes(app, assembly))
            {
                MapRequest(app, type);
                ModelBinder.ReserveSpace(type);
            }

            return app;
        }

        private static IEnumerable<Type> GetTypes(IHost app, Assembly? assembly = null)
        {
            var config = app.Services.GetRequiredService<IOptions<MediatorSettings>>().Value;
            assembly ??= config.Assembly;
            if (assembly is null)
                throw new NullReferenceException(nameof(assembly));

            foreach (var type in assembly.GetTypes())
            {
                var maps = type.GetCustomAttributes<RequestTypeAttribute>();
                if (!maps.Any())
                    continue;

                if (
                    type.GetInterfaces()
                        .Any(
                            item => item == typeof(IBaseRequest) || item == typeof(IRequest<object>)
                        )
                )
                    yield return type;
            }
        }

        public static WebApplication MapGet<TRequest>(this WebApplication app, string pattern) =>
            app.MapRequest(pattern, typeof(TRequest), new[] { "GET" });

        public static WebApplication MapPost<TRequest>(this WebApplication app, string pattern) =>
            app.MapRequest(pattern, typeof(TRequest), new[] { "POST" });

        public static WebApplication MapPut<TRequest>(this WebApplication app, string pattern) =>
            app.MapRequest(pattern, typeof(TRequest), new[] { "PUT" });

        public static WebApplication MapDelete<TRequest>(this WebApplication app, string pattern) =>
            app.MapRequest(pattern, typeof(TRequest), new[] { "DELETE" });

        public static WebApplication MapPatch<TRequest>(this WebApplication app, string pattern) =>
            app.MapRequest(pattern, typeof(TRequest), new[] { "PATCH" });

        public static WebApplication MapHead<TRequest>(this WebApplication app, string pattern) =>
            app.MapRequest(pattern, typeof(TRequest), new[] { "HEAD" });

        public static WebApplication MapOptions<TRequest>(
            this WebApplication app,
            string pattern
        ) => app.MapRequest(pattern, typeof(TRequest), new[] { "OPTIONS" });

        public static WebApplication MapTrace<TRequest>(this WebApplication app, string pattern) =>
            app.MapRequest(pattern, typeof(TRequest), new[] { "TRACE" });

        public static WebApplication MapConnect<TRequest>(
            this WebApplication app,
            string pattern
        ) => app.MapRequest(pattern, typeof(TRequest), new[] { "CONNECT" });

        public static WebApplication MapAny<TRequest>(this WebApplication app, string pattern) =>
            app.MapRequest(pattern, typeof(TRequest), new[] { "ANY" });

        public static WebApplication MapRequest<TRequest>(
            this WebApplication app,
            string pattern
        ) =>
            app.MapRequest(
                pattern,
                typeof(TRequest),
                new[]
                {
                    "GET",
                    "POST",
                    "PUT",
                    "DELETE",
                    "PATCH",
                    "HEAD",
                    "OPTIONS",
                    "TRACE",
                    "CONNECT"
                }
            );

        public static WebApplication MapRequest(
            this WebApplication app,
            string pattern,
            Type type
        ) =>
            app.MapRequest(
                pattern,
                type,
                new[]
                {
                    "GET",
                    "POST",
                    "PUT",
                    "DELETE",
                    "PATCH",
                    "HEAD",
                    "OPTIONS",
                    "TRACE",
                    "CONNECT"
                }
            );
    }
}
