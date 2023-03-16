using OpenSystem.Core.Domain.Entities;
using System;

namespace OpenSystem.Core.Domain.Events
{
    public class EntityDeletedEvent<T> : IDomainEvent
        where T : Entity
    {
        public EntityDeletedEvent(T entity,
          DateTime eventDateTime)
        {
            Entity = entity;
            EventDateTime = eventDateTime;
        }

        public T Entity { get; }

        public DateTime EventDateTime { get; }
    }
}
