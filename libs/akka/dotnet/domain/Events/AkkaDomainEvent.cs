/*using OpenSystem.Core.Domain.Events;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.Utilities;
using System.Collections;
using System.Collections.Concurrent;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Logging;

namespace OpenSystem.Akka.Domain.Events
{
    public class AkkaDomainEvent<TAggregate, TIdentity, TAggregateEvent>
        : DomainEvent<TAggregate, TIdentity, TAggregateEvent>,
            IDomainEvent<TAggregate, TIdentity, TAggregateEvent>
        where TAggregate : IAggregateRoot<TIdentity>
        where TIdentity : IIdentity
        where TAggregateEvent : IAggregateEvent<TAggregate, TIdentity>
    {
        public AkkaDomainEvent(
            TIdentity aggregateIdentity,
            string aggregateName,
            ulong aggregateSequenceNumber,
            TAggregateEvent aggregateEvent,
            IMetadata metadata
        )
            : base(
                aggregateEvent,
                metadata,
                System.DateTimeOffset.Now,
                aggregateIdentity,
                aggregateSequenceNumber
            ) { }
    }
}
*/
