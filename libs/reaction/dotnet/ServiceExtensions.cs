using OpenSystem.Core.Application;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using System.Reflection;
using AutoMapper;
using OpenSystem.Reaction.Application.ReadStores;
using OpenSystem.Core.Infrastructure;
using OpenSystem.Core.Domain;
using OpenSystem.Core.Infrastructure.ReadStores.Extensions;
using OpenSystem.Core.Infrastructure.Snapshots.Extensions;
using OpenSystem.Core.EventStore.Extensions;
using OpenSystem.Core.Application.Mediator.Extensions;

namespace OpenSystem.Reaction
{
    public static class ServiceExtensions
    {
        public static IServiceCollection AddReactionServices(
            this IServiceCollection services,
            IConfiguration configuration
        )
        {
            var assembly = Assembly.GetExecutingAssembly();

            services.AddAutoMapper(assembly);
            services.AddValidatorsFromAssembly(assembly);

            services.AddMediator(assembly);
            services.AddMediatR(assembly);

            // services.AddEvents(Assembly.GetExecutingAssembly());
            services.AddApplicationLayer();
            services.AddServiceInfrastructure();

            services
                .AddEventSourcing(assembly, true)
                .UseInMemoryReadStoreFor<ReactionReadModel>()
                .UseInMemorySnapshotPersistence()
                .UseEventStoreEventPersistence(configuration);

            return services;
        }
    }
}
