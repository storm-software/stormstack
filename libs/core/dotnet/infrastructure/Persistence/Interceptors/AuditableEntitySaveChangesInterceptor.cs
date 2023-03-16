using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using OpenSystem.Core.Domain.Entities;
using OpenSystem.Core.Application.Interfaces;
using OpenSystem.Core.Infrastructure.Extensions;
using OpenSystem.Core.Application.Services;
using OpenSystem.Core.Domain.Enums;
using OpenSystem.Core.Domain.Exceptions;
using Serilog;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Infrastructure.Persistence.Interceptors
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

      public override async ValueTask<InterceptionResult<int>> SavingChangesAsync(DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = default)
      {
          UpdateEntities(eventData.Context);

          return await base.SavingChangesAsync(eventData,
            result,
            cancellationToken);
      }

      public override async ValueTask<int> SavedChangesAsync(SaveChangesCompletedEventData eventData,
        int result, CancellationToken
        cancellationToken = default)
      {
          return await base.SavedChangesAsync(eventData, result, cancellationToken);;
      }

      public void UpdateEntities(DbContext? context)
      {
          if (context == null)
            return;

        var savedBy = _currentUserService?.UserId;
        var savedDateTime = _dateTimeProvider?.OffsetUtcNow;

        Result ret;
        foreach (var entry in context.ChangeTracker.Entries())
        {
          if (typeof(AuditableEntity).IsAssignableFrom(entry.Entity.GetType()))
          {
            var entity = entry.Entity as AuditableEntity;
            if (entity != null)
            {

              switch (entry.State)
              {
                case EntityState.Added:
                  if (entity.CreatedDateTime.HasValue)
                    throw new FailedResultException(typeof(ResultCodeValidation),
                      ResultCodeValidation.EntityAlreadyCreated);

                  entity.Status = EntityStatusTypes.Active;

                  entity.CreatedBy = savedBy;
                  entity.CreatedDateTime = savedDateTime;
                  entity.EventCounter = 1;
                  entity.EventType = EntityEventTypes.Create;

                  ret = HandleStatusUpdate(ref entity);
                  if (ret.Failed)
                    throw new FailedResultException(ret);

                  break;

                case EntityState.Deleted:
                  if (entity.Status > EntityStatusTypes.Active)
                    throw new FailedResultException(typeof(ResultCodeValidation),
                      ResultCodeValidation.EntityIsNotActive);

                  if (entity is ISoftDeleted softDeleted)
                  {
                      softDeleted.DeletedBy = savedBy;
                      softDeleted.DeletedDateTime = savedDateTime;
                      entity.EventCounter++;
                      entity.EventType = EntityEventTypes.Delete;

                      ret = HandleStatusUpdate(ref entity);
                      if (ret.Failed)
                        throw new FailedResultException(ret);

                      entry.State = EntityState.Modified;
                  }

                  break;

                case EntityState.Modified:
                case EntityState.Unchanged:
                  if (entry.State == EntityState.Unchanged &&
                    !entry.HasChangedOwnedEntities())
                    break;

                  if (entity.Status > EntityStatusTypes.Active)
                    throw new FailedResultException(typeof(ResultCodeValidation),
                      ResultCodeValidation.EntityIsNotActive);

                  entity.UpdatedBy = savedBy;
                  entity.UpdatedDateTime = savedDateTime;
                  entity.EventCounter++;
                  entity.EventType = EntityEventTypes.Update;

                  ret = HandleStatusUpdate(ref entity);
                  if (ret.Failed)
                    throw new FailedResultException(ret);

                  break;
              }
            }
          }
        }
      }

      private Result HandleStatusUpdate(ref AuditableEntity entity)
      {
        if (entity.ProcessingType == EntityProcessingTypes.StraightThroughProcessing)
          entity.IsApproved = true;
        else
        {
          entity.IsApproved = false;
          if (entity is ISoftDeleted softDeleted &&
            softDeleted.DeletedDateTime.HasValue)
            entity.Status = EntityStatusTypes.Removed;
          else
            entity.Status = EntityStatusTypes.Pending;
        }

        return Result.Success();
      }
  }
}
