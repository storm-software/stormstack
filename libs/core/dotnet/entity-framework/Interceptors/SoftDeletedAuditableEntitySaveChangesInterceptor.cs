using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using OpenSystem.Core.Domain.Entities;
using OpenSystem.Core.Application.Interfaces;
using OpenSystem.Core.Infrastructure.Extensions;
using OpenSystem.Core.Application.Services;
using OpenSystem.Core.Domain.Extensions;
using Microsoft.Extensions.Logging;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.EntityFramework.Interceptors
{
    public class SoftDeletedAuditableEntitySaveChangesInterceptor
        : AuditableEntitySaveChangesInterceptor
    {
        public SoftDeletedAuditableEntitySaveChangesInterceptor(
            ICurrentUserService currentUserService,
            IDateTimeProvider dateTimeProvider,
            ILogger<SoftDeletedAuditableEntitySaveChangesInterceptor> logger
        )
            : base(currentUserService, dateTimeProvider, logger) { }

        protected override async ValueTask InnerInnerSavingChanges(DbContext? context)
        {
            if (context == null)
                return;

            await context.ChangeTracker
                .Entries()
                .Where(e => e.State is EntityState.Deleted)
                .ForEachAsync(async entry =>
                {
                    if (
                        entry.Entity
                        is SoftDeletedAuditableEntity<EntityId> softDeletedAuditableEntity
                    )
                    {
                        entry.State = EntityState.Modified;
                        await softDeletedAuditableEntity.SetForDeleteAsync(
                            CurrentUserService.UserId,
                            DateTimeProvider.OffsetUtcNow
                        );
                    }
                });
        }
    }
}
