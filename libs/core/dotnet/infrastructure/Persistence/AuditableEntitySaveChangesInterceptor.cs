using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using OpenSystem.Core.Domain.Entities;
using OpenSystem.Core.Application.Interfaces;
using OpenSystem.Core.Infrastructure.Extensions;

namespace OpenSystem.Core.Infrastructure.Persistence
{
  public class AuditableEntitySaveChangesInterceptor : SaveChangesInterceptor
  {
      private readonly ICurrentUserService _currentUserService;
      private readonly IDateTimeProvider _dateTimeProvider;

      public AuditableEntitySaveChangesInterceptor(
          ICurrentUserService currentUserService,
          IDateTimeProvider dateTimeProvider)
      {
          _currentUserService = currentUserService;
          _dateTimeProvider = dateTimeProvider;
      }

      public override InterceptionResult<int> SavingChanges(DbContextEventData eventData,
        InterceptionResult<int> result)
      {
          UpdateEntities(eventData.Context);

          return base.SavingChanges(eventData,
            result);
      }

      public override ValueTask<InterceptionResult<int>> SavingChangesAsync(DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = default)
      {
          UpdateEntities(eventData.Context);
          return base.SavingChangesAsync(eventData,
            result,
            cancellationToken);
      }

      public void UpdateEntities(DbContext? context)
      {
          if (context == null)
            return;

          /*foreach (var entry in context.ChangeTracker.Entries<Entity<Guid>>())
          {
              if (entry.State == EntityState.Added)
              {
                  entry.Entity.CreatedBy = _currentUserService.UserId;
                  entry.Entity.CreatedDateTime = _dateTimeProvider.OffsetUtcNow;
              }

              if (entry.State == EntityState.Added ||
                entry.State == EntityState.Modified ||
                entry.HasChangedOwnedEntities())
              {
                  entry.Entity.UpdatedBy = _currentUserService.UserId;
                  entry.Entity.UpdatedDateTime = _dateTimeProvider.OffsetUtcNow;
              }
          }*/
      }
  }
}
