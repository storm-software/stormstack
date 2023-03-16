using OpenSystem.Core.Domain.Entities;
using System;

namespace OpenSystem.Core.Domain.Events
{
    public class EntityCreatedEvent<T> : IDomainEvent
        where T : Entity
    {
        public EntityCreatedEvent(T entity,
          DateTime eventDateTime)
        {
            Entity = entity;
            EventDateTime = eventDateTime;
        }

        public T Entity { get; }

        public DateTime EventDateTime { get; }
    }
}
