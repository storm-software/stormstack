using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Events;

namespace OpenSystem.Core.Domain.ResultCodes
{
    public interface IAggregateEventResult : IResult<IVersionedIndex>
    {
        IReadOnlyCollection<IDomainEvent> DomainEvents { get; }

        void SetDomainEvents(IReadOnlyCollection<IDomainEvent>? domainEvents);
    }
}
