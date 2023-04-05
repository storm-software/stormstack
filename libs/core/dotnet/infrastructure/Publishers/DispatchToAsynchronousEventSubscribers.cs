using Microsoft.Extensions.DependencyInjection;
using OpenSystem.Core.Domain.Events;
using OpenSystem.Core.Application.Jobs;
using OpenSystem.Core.Application.Publishers;

namespace OpenSystem.Core.Infrastructure.Publishers
{
    [JobVersion("DispatchToAsynchronousEventSubscribers", 1)]
    public class DispatchToAsynchronousEventSubscribersJob : IJob
    {
        public string Event { get; }

        public string Metadata { get; }

        public ulong Version { get; set; }

        public DispatchToAsynchronousEventSubscribersJob(string @event, string metadata)
        {
            if (string.IsNullOrEmpty(@event))
                throw new ArgumentNullException(nameof(@event));
            if (string.IsNullOrEmpty(metadata))
                throw new ArgumentNullException(nameof(metadata));

            Event = @event;
            Metadata = metadata;
        }

        public Task ExecuteAsync(
            IServiceProvider serviceProvider,
            CancellationToken cancellationToken
        )
        {
            var eventJsonSerializer = serviceProvider.GetRequiredService<IEventJsonSerializer>();
            var dispatchToEventSubscribers =
                serviceProvider.GetRequiredService<IDispatchToEventSubscribers>();
            var domainEvent = eventJsonSerializer.Deserialize(Event, Metadata);

            return dispatchToEventSubscribers.DispatchToAsynchronousSubscribersAsync(
                domainEvent,
                cancellationToken
            );
        }

        public static DispatchToAsynchronousEventSubscribersJob Create(
            IDomainEvent domainEvent,
            IServiceProvider serviceProvider
        )
        {
            var eventJsonSerializer = serviceProvider.GetRequiredService<IEventJsonSerializer>();
            var serializedEvent = eventJsonSerializer.Serialize(domainEvent);

            return new DispatchToAsynchronousEventSubscribersJob(
                serializedEvent.SerializedData,
                serializedEvent.SerializedMetadata
            );
        }
    }
}
