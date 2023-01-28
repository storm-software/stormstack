using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using OpenSystem.Core.DotNet.Application.Interfaces;
using OpenSystem.Core.DotNet.Domain.Common;
using OpenSystem.Core.DotNet.Infrastructure.Extensions;

namespace OpenSystem.Core.DotNet.Infrastructure.Persistence
{
  public class AuditableEntitySaveChangesInterceptor : SaveChangesInterceptor
  {
      private readonly ICurrentUserService _currentUserService;
      private readonly IDateTimeService _dateTimeService;

      public AuditableEntitySaveChangesInterceptor(
          ICurrentUserService currentUserService,
          IDateTimeService dateTimeService)
      {
          _currentUserService = currentUserService;
          _dateTimeService = dateTimeService;
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

          foreach (var entry in context.ChangeTracker.Entries<AuditableEntity>())
          {
              if (entry.State == EntityState.Added)
              {
                  entry.Entity.CreatedBy = _currentUserService.UserId;
                  entry.Entity.CreatedOn = _dateTimeService.NowUtc;
              }

              if (entry.State == EntityState.Added ||
                entry.State == EntityState.Modified ||
                entry.HasChangedOwnedEntities())
              {
                  entry.Entity.ModifiedBy = _currentUserService.UserId;
                  entry.Entity.ModifiedOn = _dateTimeService.NowUtc;
              }
          }
      }
  }
}
