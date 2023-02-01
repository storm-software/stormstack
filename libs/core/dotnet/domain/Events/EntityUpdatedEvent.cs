using OpenSystem.Core.Domain.Entities;
using System;

namespace OpenSystem.Core.Domain.Events
{
    public class EntityUpdatedEvent<T> : IDomainEvent
        where T : Entity<Guid>
    {
        public EntityUpdatedEvent(T entity,
          DateTime eventDateTime)
        {
            Entity = entity;
            EventDateTime = eventDateTime;
        }

        public T Entity { get; }

        public DateTime EventDateTime { get; }
    }
}
