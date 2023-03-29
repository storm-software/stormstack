using OpenSystem.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Infrastructure.Persistence
{
    public class HistoricalDbContext<TEntity, TEntityId> : BaseDbContext<TEntity, TEntityId>
        where TEntity : Entity<TEntityId>
        where TEntityId : EntityId
    {
        protected virtual bool WriteAddHistory => false;

        public HistoricalDbContext(DbContextOptions options)
            : base(options) { }

        public HistoricalDbContext(ILoggerFactory loggerFactory, DbContextOptions options)
            : base(loggerFactory, options) { }

        public override sealed int SaveChanges()
        {
            if (!WriteAddHistory)
                return base.SaveChanges();

            var changedEntities = ChangeTracker
                .Entries()
                .Where(
                    e => e.State is EntityState.Added or EntityState.Modified or EntityState.Deleted
                )
                .ToArray();

            this.EnsureAutoHistory();
            var ret = base.SaveChanges();

            // after "SaveChanges", entities now have valid ids (if it was necessary)
            // and the history for them can be ensured and be saved with another "SaveChanges"
            this.EnsureAddedHistory(changedEntities);

            return ret;
        }

        public override sealed async Task<int> SaveChangesAsync(
            CancellationToken cancellationToken = default
        )
        {
            if (!WriteAddHistory)
                return base.SaveChanges();

            var changedEntities = ChangeTracker
                .Entries()
                .Where(
                    e => e.State is EntityState.Added or EntityState.Modified or EntityState.Deleted
                )
                .ToArray();

            this.EnsureAutoHistory();
            var ret = await base.SaveChangesAsync(cancellationToken);
            this.EnsureAddedHistory(changedEntities);

            return ret;
        }

        protected override sealed void OnModelCreating(ModelBuilder builder)
        {
            builder.EnableAutoHistory();
            base.OnModelCreating(builder);
        }
    }
}
