using OpenSystem.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using MediatR;

namespace OpenSystem.Core.Infrastructure.Extensions
{
  public static class MediatorExtensions
  {
      public static async Task DispatchDomainEvents(this IMediator mediator,
        DbContext context)
      {
          /*var entities = context.ChangeTracker
              .Entries<Entity<Guid>>()
              .Where(e => e.Entity.DomainEvents.Any())
              .Select(e => e.Entity);

          var domainEvents = entities
              .SelectMany(e => e.DomainEvents)
              .ToList();

          entities.ToList().ForEach(e => e.ClearDomainEvents());

          foreach (var domainEvent in domainEvents)
              await mediator.Publish(domainEvent);*/
      }
  }
}
