using Microsoft.AspNetCore.Builder;
using Akka.HealthCheck.Hosting.Web;
using System.Reflection;
using OpenSystem.Core.Api.ModelBinding;
using Akka.Hosting;
using Microsoft.Extensions.DependencyInjection;
using OpenSystem.Core.Api.Utilities;
using OpenSystem.Core.Application.Utilities;
using Akka.Actor;

namespace OpenSystem.Akka.Api.Extensions
{
    public static class WebApplicationExtension
    {
        public static WebApplication UseAkkaHealthCheck(this WebApplication app)
        {
            app.MapAkkaHealthCheckRoutes(
                optionConfigure: (_, opt) =>
                {
                    // Use a custom response writer to output a json of all reported statuses
                    opt.ResponseWriter = Helper.JsonResponseWriter;
                }
            );

            return app;
        }

        public static WebApplication MapRequest<TActor, TRequest>(this WebApplication app)
            where TActor : ActorBase => MapRequest<TActor>(app, typeof(TRequest));

        public static WebApplication MapRequest<TActor>(this WebApplication app, Type type)
            where TActor : ActorBase
        {
            var actor = app.Services.GetRequiredService<IRequiredActor<TActor>>();

            var filters = RouteFilterUtility.GetFilters(type);
            var handler = new AkkaApiMediator<TActor>(actor, type, filters);
            foreach (var item in RequestUtility.GetRequestTypes(type))
                app.MapMethods(item.Template, item.SupportedMethods, handler.Handle);

            return app;
        }

        public static WebApplication MapRequest<TActor>(
            this WebApplication app,
            string pattern,
            Type type,
            IEnumerable<string> httpMethods
        )
            where TActor : ActorBase
        {
            var actor = app.Services.GetRequiredService<IRequiredActor<TActor>>();

            var filters = RouteFilterUtility.GetFilters(type);
            var handler = new AkkaApiMediator<TActor>(actor, type, filters);
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
        public static WebApplication MapAllRequests<TActor>(
            this WebApplication app,
            Assembly? assembly = null
        )
            where TActor : ActorBase
        {
            foreach (
                var type in Core.Api.Extensions.WebApplicationExtension.GetTypes(app, assembly)
            )
            {
                MapRequest<TActor>(app, type);
                ModelBinder.ReserveSpace(type);
            }

            return app;
        }
    }
}
