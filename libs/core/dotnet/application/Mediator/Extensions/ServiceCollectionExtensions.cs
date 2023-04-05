using System.Reflection;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using OpenSystem.Core.Application.Models;
using OpenSystem.Core.Domain.Settings;

namespace OpenSystem.Core.Application.Mediator.Extensions
{
    public static class ServiceCollectionExtensions
    {
        /// <summary>
        /// Add Mediator to a service collection.
        /// </summary>
        /// <param name="services">Service collection</param>
        /// <param name="configure">Configure MinimatR options</param>
        /// <param name="configureParsers">Register additional parser for custom type</param>
        /// <returns></returns>
        /// <exception cref="NullReferenceException"></exception>
        public static IServiceCollection AddMediator(
            this IServiceCollection services,
            Action<MediatorSettings> configure,
            Action<ObjectParserCollection>? configureParsers = null
        )
        {
            services.Configure<MediatorSettings>(config =>
            {
                configure(config);
                if (config.Assembly is null)
                {
                    throw new NullReferenceException("Assembly must be set");
                }
            });

            return AddMediatorParsers(services, configureParsers);
        }

        /// <summary>
        /// Add Mediator to a service collection.
        /// </summary>
        /// <param name="services">Service collection</param>
        /// <param name="assembly">Assembly to scan</param>
        /// <param name="configure">Configure Mediator options</param>
        /// <param name="configureParsers">Register additional parser for custom type</param>
        /// <returns></returns>
        public static IServiceCollection AddMediator(
            this IServiceCollection services,
            Assembly? assembly = null,
            Action<MediatorSettings>? configure = null,
            Action<ObjectParserCollection>? configureParsers = null
        )
        {
            assembly ??= Assembly.GetCallingAssembly();
            services.Configure<MediatorSettings>(configuration =>
            {
                configuration.Assembly ??= assembly;
                configure?.Invoke(configuration);
            });

            return AddMediatorParsers(services, configureParsers);
        }

        private static IServiceCollection AddMediatorParsers(
            IServiceCollection services,
            Action<ObjectParserCollection>? configureParsers
        )
        {
            if (
                services
                    .FirstOrDefault(d => d.ServiceType == typeof(ObjectParserCollection))
                    ?.ImplementationInstance
                is not ObjectParserCollection parserCollection
            )
            {
                parserCollection = new ObjectParserCollection();
                services.TryAddSingleton(parserCollection);
            }

            configureParsers?.Invoke(parserCollection);

            parserCollection.TryAdd(typeof(string), input => input.ToString());
            parserCollection.TryAdd(typeof(string[]), input => input.ToArray());
            parserCollection.TryAdd(typeof(IEnumerable<string>), input => input.ToArray());

            return services;
        }
    }
}
