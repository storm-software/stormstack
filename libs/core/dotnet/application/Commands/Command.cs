using OpenSystem.Core.Domain.Aggregates;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Application.Commands
{
    public abstract class Command<TAggregate, TIdentity>
        : ValueObject,
            ICommand<TAggregate, TIdentity>
        where TAggregate : IAggregateRoot<TIdentity>
        where TIdentity : IIdentity
    {
        public SourceId SourceId { get; }

        public TIdentity AggregateId { get; }

        public TAggregate Aggregate { get; set; }

        public uint Version { get; set; }

        protected Command(TIdentity aggregateId)
            : this(aggregateId, CommandId.New) { }

        protected Command(TIdentity aggregateId, SourceId sourceId)
        {
            if (aggregateId == null)
                throw new ArgumentNullException(nameof(aggregateId));
            if (sourceId == null)
                throw new ArgumentNullException(nameof(sourceId));

            AggregateId = aggregateId;
            SourceId = sourceId;
        }

        public async Task<IAggregateEventResult> PublishAsync(
            ICommandBus commandBus,
            CancellationToken cancellationToken
        )
        {
            return await commandBus.PublishAsync(this, cancellationToken).ConfigureAwait(false);
        }

        public SourceId GetSourceId()
        {
            return SourceId;
        }
    }
}
