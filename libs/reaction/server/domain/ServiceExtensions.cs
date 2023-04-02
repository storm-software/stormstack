using System.Reflection;
using Microsoft.Extensions.DependencyInjection;
using OpenSystem.Core.Domain.Events;
using OpenSystem.Core.Domain;

namespace OpenSystem.Reaction.Domain.Events
{
    public static class ServiceCollectionEventExtensions
    {
        public static IServiceCollection AddReactionEvents(this IServiceCollection services)
        {
            return services.AddEvents(Assembly.GetExecutingAssembly());
        }
    }
}
