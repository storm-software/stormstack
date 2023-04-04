using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using OpenSystem.Core.Domain.Entities;
using OpenSystem.Core.Application.Interfaces;
using OpenSystem.Core.Infrastructure.Extensions;
using OpenSystem.Core.Application.Services;
using OpenSystem.Core.Domain.Utilities;
using Microsoft.Extensions.Logging;
using OpenSystem.Core.Domain.Enums;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.EntityFramework.Interceptors
{
    public class AuditableEntitySaveChangesInterceptor : SaveChangesInterceptor
    {
        protected ICurrentUserService CurrentUserService { get; init; }

        protected IDateTimeProvider DateTimeProvider { get; init; }

        protected ILogger<AuditableEntitySaveChangesInterceptor> Logger { get; init; }

        public AuditableEntitySaveChangesInterceptor(
            ICurrentUserService currentUserService,
            IDateTimeProvider dateTimeProvider,
            ILogger<AuditableEntitySaveChangesInterceptor> logger
        )
        {
            CurrentUserService = currentUserService;
            DateTimeProvider = dateTimeProvider;
            Logger = logger;
        }

        public override InterceptionResult<int> SavingChanges(
            DbContextEventData eventData,
            InterceptionResult<int> result
        )
        {
            AsyncHelper.RunSync(async () => await InnerSavingChangesAsync(eventData.Context));
            return base.SavingChanges(eventData, result);
        }

        public override async ValueTask<InterceptionResult<int>> SavingChangesAsync(
            DbContextEventData eventData,
            InterceptionResult<int> result,
            CancellationToken cancellationToken = default
        )
        {
            await InnerSavingChangesAsync(eventData.Context);
            return await base.SavingChangesAsync(eventData, result, cancellationToken);
        }

        public override async ValueTask<int> SavedChangesAsync(
            SaveChangesCompletedEventData eventData,
            int result,
            CancellationToken cancellationToken = default
        )
        {
            return await base.SavedChangesAsync(eventData, result, cancellationToken);
        }

        protected virtual ValueTask InnerInnerSavingChanges(DbContext? context)
        {
            return ValueTask.CompletedTask;
        }

        private async ValueTask InnerSavingChangesAsync(DbContext? context)
        {
            if (context == null)
                return;

            foreach (var entry in context.ChangeTracker.Entries())
            {
                if (entry.Entity is AuditableEntity<EntityId> entity)
                {
                    switch (entry.State)
                    {
                        case EntityState.Added:
                            await entity.SetForCreateAsync(
                                CurrentUserService.UserId,
                                DateTimeProvider.OffsetUtcNow
                            );

                            break;

                        case EntityState.Modified:
                        case EntityState.Unchanged:
                            if (
                                entry.State == EntityState.Unchanged
                                && !entry.HasChangedOwnedEntities()
                            )
                                break;

                            entry.State = EntityState.Modified;
                            await entity.SetForUpdateAsync(
                                CurrentUserService.UserId,
                                DateTimeProvider.OffsetUtcNow
                            );

                            break;
                    }
                }
            }

            await InnerInnerSavingChanges(context);
        }
    }
}
