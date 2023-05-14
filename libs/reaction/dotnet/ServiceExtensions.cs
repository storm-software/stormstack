namespace OpenSystem.Reaction;

using OpenSystem.Core.Application;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using System.Reflection;
using OpenSystem.Core.Infrastructure;
using OpenSystem.Core.Application.Mediator.Extensions;

public static class ServiceExtensions
{
    public static IServiceCollection AddReactionServices(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        var assembly = Assembly.GetExecutingAssembly();

        _ = services.AddAutoMapper(assembly);
        _ = services.AddValidatorsFromAssembly(assembly);

        _ = services.AddMediator(assembly);
        //services.AddMediatR(assembly);

        // services.AddEvents(Assembly.GetExecutingAssembly());
        _ = services.AddApplicationLayer();
        services.AddServiceInfrastructure();

        // services.AddSingleton(typeof(IDomainEventFactory), typeof(DomainEventFactory));

        /*services
            .AddEventSourcing(assembly, true)
            .UseInMemoryReadStoreFor<ReactionReadModel>()
            .UseInMemorySnapshotPersistence()
            .UseEventStoreEventPersistence(configuration);*/

        return services;
    }
}
